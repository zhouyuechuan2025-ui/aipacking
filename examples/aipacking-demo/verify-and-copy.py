"""Check visible motion and full playback decode of the public synthetic outputs."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys

import numpy as np
from PIL import Image

source, target = (Path(arg).resolve() for arg in sys.argv[1:3])
registry = Path("skills/aipacking/assets/remotion-host-2.0/src/motion")
names = []
for file in ("semantic.json", "keyframes.json"):
    names.extend(json.loads((registry / file).read_text(encoding="utf-8")))

frames = (0, 8, 15, 23, 30, 38, 45, 53, 59)
report = []
for page, first in enumerate(range(0, len(names), 12)):
    visible = [np.asarray(Image.open(source / f"verify-{page}-{frame}.png").convert("RGB"))
               for frame in frames]
    for i, name in enumerate(names[first:first + 12]):
        x, y = 65 + (i % 3) * 605, 175 + (i // 3) * 209
        crop = [rgb[y:y + 144, x:x + 564].astype(np.int16) for rgb in visible]
        changed = max(float(np.mean(np.max(np.abs(a - b), axis=2) > 15))
                      for a, b in zip(crop, crop[1:]))
        if changed < 0.001:
            raise RuntimeError(f"No visible frame change for {name}: {changed:.6f}")
        report.append({"id": name, "gallerySeconds": page * 2, "changedArea": round(changed, 5)})

files = ("opening.png", "side-checklist.png", "branch.png", "merge.png", "compare.png",
         "case-demo.mp4", "motion-gallery.mp4")
for file, frame_count in (("case-demo.mp4", 630), ("motion-gallery.mp4", 720)):
    clip = source / file
    subprocess.run(["ffmpeg", "-v", "error", "-i", str(clip), "-f", "null", "-"], check=True)
    metadata = json.loads(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "stream=codec_name,nb_frames,r_frame_rate,width,height",
        "-of", "json", str(clip),
    ]))
    stream, = metadata["streams"]
    assert stream["codec_name"] == "h264" and int(stream["nb_frames"]) == frame_count
    assert (stream["width"], stream["height"], stream["r_frame_rate"]) == (1280, 720, "30/1")

target.mkdir(parents=True, exist_ok=True)
manifest = {"kind": "aipacking-synthetic-demo", "version": "3.0.0", "motion": report, "assets": []}
for file in files:
    path = source / file
    shutil.copyfile(path, target / file)
    manifest["assets"].append({"file": file, "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
(target / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(f"Verified visible frame changes for {len(report)} effects and full decode for both videos")
