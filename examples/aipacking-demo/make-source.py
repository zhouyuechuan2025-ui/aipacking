"""Generate a synthetic presenter plate for the public demo."""
from pathlib import Path
import subprocess
import sys

from PIL import Image, ImageDraw

directory = Path(sys.argv[1]).resolve()
directory.mkdir(parents=True, exist_ok=True)
plate = directory / "synthetic-plate.png"
image = Image.new("RGB", (1920, 1080))
draw = ImageDraw.Draw(image)
for y in range(1080):
    draw.line((0, y, 1920, y), fill=(34 + y // 65, 25 + y // 85, 45 + y // 85))

for x in range(104, 1920, 117):
    draw.line((x, 100, x, 840), fill="#36283d", width=1)
for y in range(110, 840, 105):
    draw.line((80, y, 1840, y), fill="#36283d", width=1)
draw.ellipse((625, 138, 1295, 810), fill="#3E2C46")
draw.ellipse((670, 184, 1250, 764), outline="#704859", width=3)
draw.rounded_rectangle((560, 763, 1360, 885), 32, fill="#1C1927")
draw.rounded_rectangle((739, 485, 1181, 838), 132, fill="#874B5E")
draw.ellipse((821, 226, 1099, 556), fill="#211A2D")
draw.rounded_rectangle((929, 447, 991, 525), 19, fill="#D88D71")
draw.rounded_rectangle((850, 255, 1070, 485), 105, fill="#F1AA8A")
draw.pieslice((828, 231, 1091, 460), 177, 359, fill="#211A2D")
draw.ellipse((903, 372, 915, 385), fill="#402835")
draw.ellipse((1005, 372, 1017, 385), fill="#402835")
draw.arc((942, 411, 977, 432), 10, 173, fill="#74404A", width=4)
draw.polygon([(849, 518), (958, 630), (1070, 518), (1040, 623), (958, 697), (870, 622)], fill="#E6A189")
draw.rounded_rectangle((1033, 599, 1054, 628), 8, fill="#252131")
image.save(plate)

subprocess.run([
    "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-loop", "1", "-framerate", "30", "-i", str(plate),
    "-t", "21", "-vf", "format=yuv420p", "-c:v", "libx264", "-preset", "fast", "-crf", "21",
    str(directory / "demo-source.mp4"),
], check=True)
