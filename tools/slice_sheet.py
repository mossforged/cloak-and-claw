"""Slices a green-screen parts sheet into keyed, trimmed part PNGs.
Usage: python3 tools/slice_sheet.py sheet.png out_dir name1,name2,... [scale] [rows]
  names: part names in reading order (rows top to bottom, left to right within a row).
  scale: uniform downscale for every part (default 0.5), so parts keep their relative sizes.
  rows:  number of rows on the sheet (default 3).
Finds parts as connected regions of non-green pixels (thin bits like whiskers are merged
into the nearest part by a dilation), keys each with tools/key_green.py's keyer and trims it.
Example (A001): python3 tools/slice_sheet.py assets/source/A001-mouse-fighter-rig/parts-sheet.png \\
  assets/art/heroes/mouse-fighter/rig head,torso,scarf-tail,tail,sword,arm-front-upper,...
"""
import sys
from collections import deque
from pathlib import Path
import numpy as np
from PIL import Image

GRID = 4          # label on a 1/4-size grid (fast in pure Python)
DILATE = 1        # grid cells; joins whiskers and thin tips to their part
MIN_CELLS = 40    # smaller regions are specks, dropped


def keyed(a):
    """Same maths as tools/key_green.py: alpha from green spill, despilled colour."""
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    spill = g - np.maximum(r, b)
    alpha = np.clip(1 - (spill - 25) / 70, 0, 1)
    g2 = np.where(spill > 0, np.minimum(g, np.maximum(r, b) + 8), g)
    return np.dstack([r, g2, b, alpha * 255]).astype(np.uint8)


def dilate(m, n):
    for _ in range(n):
        d = m.copy()
        d[1:] |= m[:-1]; d[:-1] |= m[1:]; d[:, 1:] |= m[:, :-1]; d[:, :-1] |= m[:, 1:]
        m = d
    return m


def label(m):
    lab = np.zeros(m.shape, np.int32)
    n = 0
    for y0, x0 in zip(*np.nonzero(m)):
        if lab[y0, x0]:
            continue
        n += 1
        lab[y0, x0] = n
        q = deque([(y0, x0)])
        while q:
            y, x = q.popleft()
            for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= yy < m.shape[0] and 0 <= xx < m.shape[1] and m[yy, xx] and not lab[yy, xx]:
                    lab[yy, xx] = n
                    q.append((yy, xx))
    return lab, n


def slice_sheet(src, out_dir, names, scale=0.5, rows=3):
    a = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
    rgba = keyed(a)
    h, w = a.shape[:2]
    gh, gw = h // GRID, w // GRID
    solid = rgba[: gh * GRID, : gw * GRID, 3].reshape(gh, GRID, gw, GRID).max(axis=(1, 3)) > 60
    lab, n = label(dilate(solid, DILATE))
    parts = []
    for i in range(1, n + 1):
        ys, xs = np.nonzero(lab == i)
        if len(ys) >= MIN_CELLS:
            parts.append({"id": i, "cy": ys.mean(), "cx": xs.mean()})
    if len(parts) != len(names):
        sys.exit(f"found {len(parts)} parts, expected {len(names)}")
    # Reading order: split into `rows` bands by sorted centre y, then left to right.
    parts.sort(key=lambda p: p["cy"])
    per = np.array_split(np.arange(len(parts)), rows)
    ordered = []
    for idx in per:
        ordered += sorted((parts[i] for i in idx), key=lambda p: p["cx"])
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    for name, p in zip(names, ordered):
        cell = np.kron(lab == p["id"], np.ones((GRID, GRID), bool))
        mask = np.zeros((h, w), bool)
        mask[: cell.shape[0], : cell.shape[1]] = cell
        im = rgba.copy()
        im[~mask, 3] = 0
        img = Image.fromarray(im)
        img = img.crop(img.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox())
        if scale != 1:
            img = img.resize((max(1, round(img.width * scale)), max(1, round(img.height * scale))), Image.LANCZOS)
        dst = out / f"{name}.png"
        img.save(dst, optimize=True)
        print(dst, img.size)


if __name__ == "__main__":
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    slice_sheet(sys.argv[1], sys.argv[2], sys.argv[3].split(","),
                float(sys.argv[4]) if len(sys.argv) > 4 else 0.5,
                int(sys.argv[5]) if len(sys.argv) > 5 else 3)
