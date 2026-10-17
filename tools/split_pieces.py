"""Split a keyed part image into its separate painted pieces (T023). Usage:
  python3 tools/split_pieces.py in.png out-1.png out-2.png ...
Pieces = connected opaque regions (alpha > 40, 8-neighbour) of at least 20 px, largest first; each output keeps the
input's size (so the part's pivot and offsets stay valid) with every other piece cleared. Prints each piece's box.
Used on the Mouse Fighter's scarf-tail (A013), drawn as a knot and a tail with the sword arm covering the gap between."""
import collections, sys
import numpy as np
from PIL import Image


def pieces(alpha):
    H, W = alpha.shape
    lab, n = np.zeros((H, W), int), 0
    for y, x in zip(*np.nonzero(alpha)):
        if lab[y, x]:
            continue
        n += 1
        lab[y, x] = n
        q = collections.deque([(y, x)])
        while q:
            cy, cx = q.popleft()
            for ny in (cy - 1, cy, cy + 1):
                for nx in (cx - 1, cx, cx + 1):
                    if 0 <= ny < H and 0 <= nx < W and alpha[ny, nx] and not lab[ny, nx]:
                        lab[ny, nx] = n
                        q.append((ny, nx))
    sizes = sorted(((int((lab == i).sum()), i) for i in range(1, n + 1)), reverse=True)
    return lab, [i for s, i in sizes if s >= 20]


if __name__ == "__main__":
    src, outs = sys.argv[1], sys.argv[2:]
    im = np.array(Image.open(src).convert("RGBA"))
    lab, ids = pieces(im[..., 3] > 40)
    near = np.zeros_like(lab)   # soft edge pixels (alpha <= 40) go with the nearest piece's label: grow labels 2 px
    grown = lab.copy()
    for _ in range(2):
        g = grown.copy()
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                sh = np.roll(np.roll(grown, dy, 0), dx, 1)
                g = np.where((g == 0) & (sh > 0), sh, g)
        grown = g
    for out, i in zip(outs, ids):
        o = im.copy()
        o[grown != i] = 0
        Image.fromarray(o).save(out, optimize=True)
        ys, xs = np.nonzero(lab == i)
        print(out, "box", xs.min(), ys.min(), xs.max(), ys.max())
