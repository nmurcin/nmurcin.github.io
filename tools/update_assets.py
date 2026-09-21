"""Register optional real project photographs. Run from any directory."""
from pathlib import Path
import json
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
SLOTS = {
    "fin-design-tree": "assets/projects/fins/fin-design-tree.jpg",
    "passthrough": "assets/projects/passthrough/passthrough-hardware.jpg",
}
media = {}
for key, relative in SLOTS.items():
    file = ROOT / relative
    if file.exists():
        with Image.open(file) as image:
            image.verify()
        with Image.open(file) as image:
            width, height = image.size
        media[key] = {"src": relative, "width": width, "height": height}
(ROOT / "assets/project-media.js").write_text(
    "window.PORTFOLIO_MEDIA = " + json.dumps(media, indent=2) + ";\n", encoding="utf-8"
)
print(f"Registered {len(media)} optional real project image(s).")
