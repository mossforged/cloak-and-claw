"""Makes a horizontally repeating tile seamless with a narrow cross-fade, then scales it uniformly.
Usage: python3 tools/tile_fade.py in.png out.webp fade_px scale
The tile's last fade_px columns are blended into its first fade_px (and then dropped), so the right edge runs straight
on into the left edge when tiled. Output width = (width - fade_px) * scale."""
import sys
import numpy as np
from PIL import Image

def fade(src, dst, n, scale):
    im = Image.open(src).convert("RGBA")
    a = np.asarray(im).astype(np.float32)
    w = a.shape[1]
    t = np.linspace(0, 1, n)[None, :, None]           # 0 at the left edge (all wrap-around), 1 at fade end (all original)
    a[:, :n] = a[:, w - n:] * (1 - t) + a[:, :n] * t
    out = Image.fromarray(a[:, : w - n].round().astype(np.uint8))
    out = out.resize((round(out.width * scale), round(out.height * scale)), Image.LANCZOS)
    out.save(dst)
    print(dst, out.size)

if __name__ == "__main__":
    fade(sys.argv[1], sys.argv[2], int(sys.argv[3]), float(sys.argv[4]))
