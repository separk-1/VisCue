import json
import os
from collections import defaultdict

# Load initial and target states
with open("initial_and_target_states.json", "r") as f:
    state_definitions = json.load(f)

initial_state = state_definitions["initial"]
target_state = state_definitions["target"]

# Set log file path
log_path = "./logs/log_20250423_170805_Seongeun_2.json"
with open(log_path, "r") as f:
    log_data = json.load(f)

# Extract experiment start and end
start_time = next((e['time'] for e in log_data['log'] if e['type'] == 'experimentStart'), None)
end_time = next((e['time'] for e in log_data['log'] if e['type'] == 'experimentEnd'), None)

# Prepare state tracking
state = initial_state.copy()
toggle_counts = defaultdict(int)
time_to_match = {}
overcorrected = set()

# Process toggles
for event in log_data['log']:
    if event['type'] == 'toggle' and start_time <= event['time'] <= (end_time or float('inf')):
        label, new_state = event['label'].rsplit(' ', 1)
        toggle_counts[label] += 1
        state[label] = new_state

        if label in target_state:
            if new_state == target_state[label] and label not in time_to_match:
                time_to_match[label] = (event['time'] - start_time) / 1000
            elif new_state != target_state[label] and label in time_to_match:
                overcorrected.add(label)

# Final result
final_state_correct = all(state.get(k) == v for k, v in target_state.items())
total_time = (end_time - start_time) / 1000 if start_time and end_time else None
accuracy = sum(state[k] == v for k, v in target_state.items()) / len(target_state)
avg_time_to_target = sum(time_to_match.values()) / len(time_to_match) if time_to_match else None
redundant_actions = sum(v for v in toggle_counts.values() if v > 1)
redundant_ratio = redundant_actions / sum(toggle_counts.values()) if toggle_counts else 0
unmatched = [k for k, v in target_state.items() if state.get(k) != v]
mastered = [k for k in toggle_counts if toggle_counts[k] == 1 and state.get(k) == target_state[k]]
confused = [k for k in toggle_counts if toggle_counts[k] > 1 or state.get(k) != target_state[k]]

# Prepare result summary string
summary_lines = []
summary_lines.append("=== Experiment Analysis Summary ===")
summary_lines.append(f"Total Time: {total_time:.3f} sec")
summary_lines.append(f"Final State Matches Target: {final_state_correct}")
summary_lines.append(f"Accuracy: {accuracy*100:.1f}%")
summary_lines.append(f"Average Time to Reach Correct State: {avg_time_to_target:.2f} sec" if avg_time_to_target else "No targets reached.")
summary_lines.append(f"Redundant Action Ratio: {redundant_ratio*100:.1f}%")
summary_lines.append(f"Unmatched Components: {unmatched}")
summary_lines.append(f"Mastered Components (1 toggle & correct): {mastered}")
summary_lines.append(f"Confused Components (many toggles or incorrect): {confused}")
summary_lines.append(f"Overcorrected Components: {list(overcorrected)}")
summary_lines.append("\n--- Time to Reach Target (per component) ---")
for k, v in time_to_match.items():
    summary_lines.append(f" - {k}: {v:.2f} sec")
summary_lines.append("\n--- Toggle Counts ---")
for k, v in toggle_counts.items():
    summary_lines.append(f" - {k}: {v}")

# Print to console
print("\n".join(summary_lines))

# Save to file
log_filename = os.path.basename(log_path)
output_filename = f"results/{log_filename.replace('.json', '_analysis.txt')}"
os.makedirs("results", exist_ok=True)
with open(output_filename, "w") as f:
    f.write("\n".join(summary_lines))

print(f"\n✅ Saved analysis to: {output_filename}")
