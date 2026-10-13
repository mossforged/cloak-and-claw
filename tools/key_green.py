"""Green-screen keyer. Usage: python3 tools/key_green.py in.png out.png [max_size]
Removes green background, despills edges, trims to content, optionally downsizes."""
import sys
import numpy as np
from PIL import Image

def key(src, dst, max_size=None):
    a = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    spill = g - np.maximum(r, b)            # how "green" a pixel is
    alpha = np.clip(1 - (spill - 25) / 70, 0, 1)  # >95 fully clear, <25 fully solid
    g2 = np.where(spill > 0, np.minimum(g, np.maximum(r, b) + 8), g)  # despill
    out = np.dstack([r, g2, b, alpha * 255]).astype(np.uint8)
    im = Image.fromarray(out, "RGBA")
    bbox = im.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox()
    im = im.crop(bbox)
    if max_size:
        im.thumbnail((max_size, max_size), Image.LANCZOS)
    im.save(dst, optimize=True)
    print(dst, im.size)

if __name__ == "__main__":
    key(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else None)
