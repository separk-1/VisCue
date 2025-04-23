import json
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import numpy as np
from pathlib import Path

# Load the log data
log_path = "./logs/log_20250423_163057_seongeun.json"
# Background image and canvas setup
bg_image_path = "interface.png"
with open(log_path, 'r') as f:
    data = json.load(f)

participant = data.get('participant', 'Unknown')
logs = data['log']

# Extract experiment start/end times
start_time = next((e['time'] for e in logs if e['type'] == 'experimentStart'), None)
end_time = next((e['time'] for e in logs if e['type'] == 'experimentEnd'), None)

# Extract relevant mousemove events
moves = [e for e in logs if e['type'] == 'mousemove' and (start_time is None or (start_time <= e['time'] <= (end_time or float('inf'))))]
clicks = [e for e in logs if e['type'] == 'toggle']

x = np.array([e['x'] for e in moves])
y = np.array([e['y'] for e in moves])
t = np.array([e['time'] for e in moves])
dx = np.diff(x)
dy = np.diff(y)
speed = np.sqrt(dx**2 + dy**2) / np.diff(t) * 1000  # Pixels per second

canvas_size = (1440, 1600)  # Manual override to fit user's screen size

fig, ax = plt.subplots(figsize=(14, 10))

# Plot background
if Path(bg_image_path).exists():
    img = mpimg.imread(bg_image_path)
    ax.imshow(img, extent=[0, canvas_size[0], canvas_size[1], 0], alpha=0.3)

# Plot mouse trajectory with direction arrows
qv = ax.quiver(
    x[:-1], y[:-1], dx, dy, speed,
    cmap='cool', scale_units='xy', angles='xy',
    scale=1, width=0.003, headwidth=4, headlength=5
)

# Highlight click positions
click_labels = [e['label'] for e in clicks if 'x' in e and 'y' in e]
click_x = [e['x'] for e in clicks if 'x' in e and 'y' in e]
click_y = [e['y'] for e in clicks if 'x' in e and 'y' in e]
ax.scatter(click_x, click_y, c='orange', edgecolors='black', s=80, label='Toggle Click')

# Final adjustments
ax.set_xlim([0, canvas_size[0]])
ax.set_ylim([canvas_size[1], 0])
ax.set_title(f"Mouse Trajectory with Direction – {participant}", fontsize=16)
ax.set_xlabel("X Position")
ax.set_ylabel("Y Position")
ax.grid(True)
ax.legend(loc='upper right')
plt.colorbar(qv, ax=ax, label='Speed (pixels/sec)')
plt.tight_layout()
plt.show()
