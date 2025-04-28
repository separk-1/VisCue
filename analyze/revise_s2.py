import os
import json

# Set input and output file paths
input_path = "./logs/log_20250425_151051_bitterjor1004 - Jordyn Le.json"
output_path = "./logs/log_20250425_151051_bitterjor1004 - Jordyn Le_revised.json"

# Load JSON
with open(input_path, 'r') as f:
    data = json.load(f)

logs = data.get('log', [])

# Fix missing x, y coordinates
for idx, event in enumerate(logs):
    if ('x' not in event or 'y' not in event) or (event['x'] is None or event['y'] is None):
        # Find previous valid event
        prev = next(
            (logs[i] for i in range(idx-1, -1, -1) if 'x' in logs[i] and 'y' in logs[i] and logs[i]['x'] is not None and logs[i]['y'] is not None),
            None
        )
        # Find next valid event
        next_ = next(
            (logs[i] for i in range(idx+1, len(logs)) if 'x' in logs[i] and 'y' in logs[i] and logs[i]['x'] is not None and logs[i]['y'] is not None),
            None
        )

        if prev and next_:
            event['x'] = (prev['x'] + next_['x']) / 2
            event['y'] = (prev['y'] + next_['y']) / 2
        elif prev:
            event['x'] = prev['x']
            event['y'] = prev['y']
        elif next_:
            event['x'] = next_['x']
            event['y'] = next_['y']
        else:
            event['x'] = 0
            event['y'] = 0

# Save revised JSON
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"Finished! Revised file saved to: {output_path}")
