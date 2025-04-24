import json
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import numpy as np
from pathlib import Path
import argparse

# Argument parser
parser = argparse.ArgumentParser()
parser.add_argument('--log', type=str, default='./logs/log_20250424_011413_All_Correct.json', help='Path to log file')
parser.add_argument('--bg', type=str, default='False', help='Use background image (True/False)')
args = parser.parse_args()

log_path = args.log
use_background = args.bg.lower() == 'true'

# Load data
with open(log_path, 'r') as f:
    data = json.load(f)

participant = data.get('participant', 'Unknown')
logs = data['log']

start_time = next((e['time'] for e in logs if e['type'] == 'experimentStart'), None)
end_time = next((e['time'] for e in logs if e['type'] == 'experimentEnd'), None)

moves = [e for e in logs if e['type'] == 'mousemove' and (start_time is None or (start_time <= e['time'] <= (end_time or float('inf'))))]
clicks = [e for e in logs if e['type'] == 'toggle']
click_guide = [e for e in logs if e['type'] == 'guide']

x = np.array([e['x'] for e in moves])
y = np.array([e['y'] for e in moves])
t = np.array([e['time'] for e in moves])
dx = np.diff(x)
dy = np.diff(y)
speed = np.sqrt(dx**2 + dy**2) / np.diff(t) * 1000  # pixels/sec

canvas_size = (1440, 1600)
bg_image_path = "interface.png"

fig, ax = plt.subplots(figsize=(14, 10))

if use_background and Path(bg_image_path).exists():
    img = mpimg.imread(bg_image_path)
    ax.imshow(img, extent=[0, canvas_size[0], canvas_size[1], 0], alpha=0.3)

qv = ax.quiver(
    x[:-1], y[:-1], dx, dy, speed,
    cmap='cool', scale_units='xy', angles='xy',
    scale=1, width=0.003, headwidth=4, headlength=5
)

click_x = [e['x'] for e in clicks if 'x' in e and 'y' in e]
click_y = [e['y'] for e in clicks if 'x' in e and 'y' in e]
ax.scatter(click_x, click_y, c='orange', edgecolors='black', s=80)
guide_x = [e['x'] for e in click_guide if 'x' in e and 'y' in e]
guide_y = [e['y'] for e in click_guide if 'x' in e and 'y' in e]
ax.scatter(guide_x, guide_y, facecolors='none', edgecolors='blue', s=100, linewidths=2)

ax.set_xlim([0, canvas_size[0]])
ax.set_ylim([canvas_size[1], 0])
ax.set_aspect(canvas_size[1] / canvas_size[0])
ax.axis('off')


# Save
Path("results").mkdir(exist_ok=True)
suffix = "_mousetrack.png" if use_background else "_mousetrack_wo_bg.png"
outname = Path(log_path).stem + suffix
bbox_opt = 'tight' if use_background else None
plt.savefig(f"results/{outname}", dpi=300, bbox_inches=bbox_opt, transparent=not use_background)
plt.close()

