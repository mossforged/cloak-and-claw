"""Green-screen keyer. Usage: python3 tools/key_green.py in.png out.png [max_size] [--scale S]
Removes green background, despills edges, trims to content, optionally downsizes.
  max_size: fit the trimmed image inside max_size px (each image gets its own factor).
  --scale S: uniform factor instead, so parts cut from one canvas keep their relative sizes.
Prints the output size and the trim box's top-left on the input canvas (for rig attach points)."""
import sys
import numpy as np
from PIL import Image

def key(src, dst, max_size=None, scale=None):
    a = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    spill = g - np.maximum(r, b)            # how "green" a pixel is
    alpha = np.clip(1 - (spill - 25) / 70, 0, 1)  # >95 fully clear, <25 fully solid
    g2 = np.where(spill > 0, np.minimum(g, np.maximum(r, b) + 8), g)  # despill
    out = np.dstack([r, g2, b, alpha * 255]).astype(np.uint8)
    im = Image.fromarray(out)
    bbox = im.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox()
    im = im.crop(bbox)
    if scale:
        im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
    elif max_size:
        im.thumbnail((max_size, max_size), Image.LANCZOS)
    im.save(dst, optimize=True)
    print(dst, im.size, "trim", bbox[:2])
    return im.size, bbox

if __name__ == "__main__":
    args = sys.argv[1:]
    s = None
    if "--scale" in args:
        i = args.index("--scale"); s = float(args[i + 1]); del args[i:i + 2]
    key(args[0], args[1], int(args[2]) if len(args) > 2 else None, s)
