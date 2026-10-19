"""Gear importer for whole-drawing gear swaps + additive overlays (T032, A020 round 3 manifests: `swaps`, `overlays`,
`gearViews`, `bodySources`). Everything shares the body's canvas, so:
  - each dressed swap (head-attack-hood, torso-front-jerkin, head-notch) is keyed and trimmed at --scale into
    --art/gear-a020/ like a body cut (detached islands dropped), with its offset in the image px of the part it replaces
    (offset = (swap trim corner - part trim corner) * scale: the same arithmetic as the rig importer's swaps)
  - each overlay (sash, quiver, face details) the same way (islands kept: an earring is its own piece)
  - line-up check: around each swap's joint points (heads: the neck = pivot; torsos: neck, shoulders, waist) the shift
    that lays the most dressed pixels on the same bare fur / skin (best_shift, within --search source px). A torso whose points
    agree (spread <= 1 game px), or a head whose neck matched surely (SURE), and moved >= 0.5 game px gets that shift
    folded into its offset; anything still over 2 game px is listed for Art; a point with no bare anatomy left round
    it (under the gear: the jerkin's waist) is listed as covered
  - masks: none imported (A020 r3 tint sheet failed: semanticTintPass false); every new drawing listed as untinted
Writes src/data/rigs/<id>-gear-a020.js: DRESS, SWAPS, OVERLAYS, VIEWS, UNTINTED, LINEUP.
Usage: python3 tools/gear_swaps_from_source.py assets/source/A020-rat-gear-every-view/rig-source.json --id rat-raider
       [--scale 0.4] [--game 0.25185] [--lineup docs/screens/T032/lineup.json]"""
import argparse, json, os, sys
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from key_green import key  # noqa: E402
from gear_from_source import trim_box  # noqa: E402

HEAD_NECK = "neck"


def alpha_of(path):
    img = Image.open(path)
    if img.mode == "RGBA" and img.getchannel("A").getextrema()[0] < 255:
        return np.asarray(img.getchannel("A")) > 20
    a = np.asarray(img.convert("RGB")).astype(np.int16)
    return (a[..., 1] - np.maximum(a[..., 0], a[..., 2])) < 60


def rgb_of(path):
    return np.asarray(Image.open(path).convert("RGB")).astype(np.int16)


MATCH = 24      # RGB sum difference under which a pixel counts as the same drawn anatomy
EXPOSED = 0.15  # share of the window's bare paint that must match for the point to count as exposed (else: under gear)
SURE = 0.4      # a single point (heads: the neck) is trusted for a fix when at least this share matches


def best_shift(a, ca, b, cb, pt, win, search, step=2):
    """Shift (dx, dy) of the dressed drawing (b, cb) that lays the most of its pixels on the same anatomy of the bare one
    (a, ca) in a window round pt (gear pixels match at no shift, so only exposed fur / skin decides), and the share of
    the bare paint matched there. Share under EXPOSED: the point is under the gear (nothing of the body left to line up)."""
    x, y = pt
    h, w = a.shape
    x0, y0, x1, y1 = max(0, x - win), max(0, y - win), min(w, x + win), min(h, y + win)
    A, CA = a[y0:y1, x0:x1], ca[y0:y1, x0:x1]
    if not A.any():
        return (0, 0), 0.0
    best = None
    for dy in range(-search, search + 1, step):
        for dx in range(-search, search + 1, step):
            sy0, sx0 = y0 + dy, x0 + dx
            if sy0 < 0 or sx0 < 0 or sy0 + A.shape[0] > h or sx0 + A.shape[1] > w:
                continue
            B, CB = b[sy0:sy0 + A.shape[0], sx0:sx0 + A.shape[1]], cb[sy0:sy0 + A.shape[0], sx0:sx0 + A.shape[1]]
            n = int((A & B & (np.abs(CA - CB).sum(axis=2) < MATCH)).sum())
            if best is None or n > best[1] or (n == best[1] and abs(dx) + abs(dy) < abs(best[0][0]) + abs(best[0][1])):
                best = ((dx, dy), n)
    return best[0], best[1] / A.sum()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("--id", required=True)
    ap.add_argument("--art")
    ap.add_argument("--out")
    ap.add_argument("--scale", type=float, default=0.4)
    ap.add_argument("--game", type=float, default=0.25185, help="rig scale: part px -> game px")
    ap.add_argument("--lineup", default="docs/screens/T032/lineup.json")
    ap.add_argument("--search", type=int, default=40, help="line-up search, source px")
    a = ap.parse_args()
    folder = os.path.dirname(a.source)
    src = json.load(open(a.source))
    base = (a.art or f"assets/art/enemies/{a.id}").rstrip("/")
    art = f"{base}/gear-a020"
    out = a.out or f"src/data/rigs/{a.id}-gear-a020.js"
    s, gpx = a.scale, a.scale * a.game   # source px -> part px, source px -> game px
    os.makedirs(art, exist_ok=True)
    bodies = src["bodySources"]
    box = {n: trim_box(p) for n, p in bodies.items()}
    rnd = lambda v: round(v, 2)
    rel = lambda b, part: [rnd((b[0] - box[part][0]) * s), rnd((b[1] - box[part][1]) * s)]

    swaps, lineup, report = {}, {}, []
    for name, sw in sorted(src["swaps"].items()):
        path, part, drawing = os.path.join(folder, sw["img"]), sw["of"], sw["drawing"]
        _, b = key(path, f"{art}/{name}.png", None, s, [])
        offset = rel(b, part)
        pts = sw.get("anchors") or {HEAD_NECK: sw["pivot"]}
        A, B, CA, CB = alpha_of(bodies[drawing]), alpha_of(path), rgb_of(bodies[drawing]), rgb_of(path)
        shifts, covered = {}, {}
        for pn, pt in pts.items():
            (dx, dy), share = best_shift(A, CA, B, CB, pt, 120, a.search)
            if share < EXPOSED:
                covered[pn] = rnd(share)
                continue
            shifts[pn] = {"shift": [rnd(dx * gpx), rnd(dy * gpx)], "match": rnd(share)}
        if not shifts:
            lineup[name] = {"points": {}, "covered": covered, "fix": None, "residual": {}}
            swaps[name] = {"img": f"{art}/{name}.png", "of": part, "drawing": drawing, "offset": offset}
            continue
        vs = np.array([v["shift"] for v in shifts.values()])
        med = np.median(vs, axis=0)
        spread = float(np.abs(vs - med).max()) if len(vs) > 1 else None
        fix = None
        sure = (spread is not None and spread <= 1) or (spread is None and min(v["match"] for v in shifts.values()) >= SURE)
        if sure and float(np.hypot(*med)) >= 0.5:
            fix = [rnd(-med[0] / a.game), rnd(-med[1] / a.game)]   # move the drawing back by the shift (part px)
            offset = [rnd(offset[0] + fix[0]), rnd(offset[1] + fix[1])]
        resid = {pn: rnd(float(np.hypot(*(np.array(v["shift"]) + (np.array(fix) * a.game if fix else 0)))))
                 for pn, v in shifts.items()}
        lineup[name] = {"points": shifts, "covered": covered, "fix": fix, "residual": resid}
        over = {pn: r for pn, r in resid.items() if r > 2}
        if over:
            report.append(f"{name}: " + ", ".join(f"{pn} {r} px" for pn, r in over.items()))
        swaps[name] = {"img": f"{art}/{name}.png", "of": part, "drawing": drawing, "offset": offset}

    overlays = {}
    for name, o in sorted(src["overlays"].items()):
        path = os.path.join(folder, o["img"])
        _, b = key(path, f"{art}/{name}.png", None, s, None)
        overlays[name] = {"img": f"{art}/{name}.png", "on": o["on"], "order": o["band"], "offset": rel(b, o["on"])}

    dress, views = {}, {}
    for g, G in src["gearViews"].items():
        vs = {d: n for d, n in G["views"].items() if n}
        if all(n in swaps for n in vs.values()):
            dress[g] = {"on": G["on"], "views": {d: n for d, n in vs.items() if d in box}}
        else:
            views[g] = {"on": G["on"], "views": G["views"]}

    untinted = sorted([*swaps, *overlays])
    js = lambda v: json.dumps(v, separators=(", ", ": ")).replace('"', "'")
    L = [f"// Rat gear for every view (T032), generated by tools/gear_swaps_from_source.py from {a.source}. Do not edit by hand.",
         "// DRESS: gear group -> { on, views: the part's undressed drawing -> its dressed swap (whole drawing: replaces it) }.",
         "// SWAPS: dressed swap -> { img, of: the part, drawing: the undressed one, offset: in the part's own image px }.",
         "// OVERLAYS / VIEWS: additive overlays (sash, quiver, face details), as rat-raider-gear.js; a null view = hidden.",
         "// UNTINTED: new drawings that show as drawn (A020 r3 masks parked: tint sheet failed). LINEUP: the import's line-up check",
         "//   (game px: each point's best outline shift vs the undressed drawing, fix folded into the offset, residual).",
         "export const DRESS = {"]
    L += [f"  '{n}': {js(v)}," for n, v in dress.items()] + ["};", "", "export const SWAPS = {"]
    L += [f"  '{n}': {js(v)}," for n, v in swaps.items()] + ["};", "", "export const OVERLAYS = {"]
    L += [f"  '{n}': {js(v)}," for n, v in overlays.items()] + ["};", "", "export const VIEWS = {"]
    L += [f"  '{n}': {js(v)}," for n, v in views.items()] + ["};", "", f"export const UNTINTED = {js(untinted)};", "", "export const LINEUP = {"]
    L += [f"  '{n}': {js({'fix': v['fix'], 'residual': v['residual'], 'covered': list(v['covered'])})}," for n, v in lineup.items()] + ["};", ""]
    open(out, "w").write("\n".join(L))
    os.makedirs(os.path.dirname(a.lineup), exist_ok=True)
    json.dump(lineup, open(a.lineup, "w"), indent=1)
    print("wrote", out)
    print("over 2 game px after import:" if report else "line-up: every point within 2 game px")
    for r in report:
        print("  " + r)


if __name__ == "__main__":
    main()
