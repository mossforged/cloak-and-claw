"""Detached islands in a keyed cut (T026 round 2, rig standard 8 paint check): connected pieces (alpha > 20, 8-connected)
apart from the main (largest) shape. Stray scraps of fur or trouser that float beside a part read as noise in play.
  main_shape(alpha) -> (keep, islands): keep = bool mask of the main shape grown by 2 px (its soft edge stays);
  islands = [{ area, box: [x0, y0, x1, y1] }, ...] for every other piece, largest first.
Usage: python3 tools/islands.py <png> ...   (lists the islands of each image; exit 1 if any)"""
import sys
from collections import deque
import numpy as np
from PIL import Image

THRESHOLD = 20   # alpha counted as drawn (as key_green's trim)
GROW = 2         # px of soft edge kept round the main shape


def components(solid):
    h, w = solid.shape
    label = np.zeros((h, w), np.int32)
    flat, lab = solid.ravel(), label.ravel()
    pieces, n = [], 0
    for start in np.flatnonzero(flat):
        if lab[start]:
            continue
        n += 1
        lab[start] = n
        q, area, x0, y0, x1, y1 = deque([start]), 0, w, h, -1, -1
        while q:
            i = q.popleft()
            area += 1
            y, x = divmod(int(i), w)
            x0, y0, x1, y1 = min(x0, x), min(y0, y), max(x1, x), max(y1, y)
            for dy in (-1, 0, 1):
                yy = y + dy
                if yy < 0 or yy >= h:
                    continue
                for dx in (-1, 0, 1):
                    xx = x + dx
                    if 0 <= xx < w:
                        j = yy * w + xx
                        if flat[j] and not lab[j]:
                            lab[j] = n
                            q.append(j)
        pieces.append({"id": n, "area": area, "box": [x0, y0, x1 + 1, y1 + 1]})
    return label, pieces


def main_shape(alpha):
    label, pieces = components(alpha > THRESHOLD)
    if not pieces:
        return np.ones(alpha.shape, bool), []
    pieces.sort(key=lambda p: -p["area"])
    keep = label == pieces[0]["id"]
    for _ in range(GROW):   # grow by one px each round (8-neighbourhood)
        g = keep.copy()
        g[1:] |= keep[:-1]; g[:-1] |= keep[1:]; g[:, 1:] |= keep[:, :-1]; g[:, :-1] |= keep[:, 1:]
        g[1:, 1:] |= keep[:-1, :-1]; g[:-1, :-1] |= keep[1:, 1:]; g[1:, :-1] |= keep[:-1, 1:]; g[:-1, 1:] |= keep[1:, :-1]
        keep = g
    return keep, [{"area": p["area"], "box": p["box"]} for p in pieces[1:]]


def describe(islands):
    big = [f"{p['area']} px at {p['box'][:2]}" for p in islands if p["area"] >= 4]
    specks = sum(1 for p in islands if p["area"] < 4)
    return ", ".join(big + ([f"{specks} speck(s) under 4 px"] if specks else []))


if __name__ == "__main__":
    bad = 0
    for path in sys.argv[1:]:
        a = np.asarray(Image.open(path).convert("RGBA"))[..., 3]
        _, isl = main_shape(a)
        if isl:
            bad += 1
            print(f"{path}: {len(isl)} island(s): {describe(isl)}")
    sys.exit(1 if bad else 0)
