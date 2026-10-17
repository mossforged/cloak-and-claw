"""Draft rig importer (T016). Reads a rig-source.json (rig standard section 5, rule 4) and writes:
  - every part and swap keyed (tools/key_green.py), trimmed and scaled by one uniform factor into --art
  - a draft src/data/rigs/<id>.js: pivots/attach points converted to each image's own pixels, bands as draw order,
    swaps with their offsets, rest 0 (joint angle 0 = the master pose, as in the rig bench and data/rigs/biped-poses.js).
Usage: python3 tools/rig_from_source.py <rig-source.json> --id rat-raider [--art assets/art/enemies/rat-raider/rig]
       [--out src/data/rigs/rat-raider.js] [--height 136] [--scale 0.4]
A draft: the game's poses for the character still have to be written against it.
T023: whole-arm swaps keep their extra fields: `hide` (parts the drawing replaces), `itemGrip` -> `grip` (where the held
item sits, swap image px) and `slotDirection` -> `axis` (degrees the fist holds a handle toward the item's head). The
source's `grips` (each grip hand's slot centre and direction) become `hands`: { swap: { part, at (part px), axis } }."""
import argparse, json, math, os, sys
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from key_green import key  # noqa: E402


def silhouette_top(path):
    a = np.asarray(Image.open(path).convert("RGBA")).astype(np.float32)
    if a[..., 3].min() < 255:
        alpha = a[..., 3]
    else:
        spill = a[..., 1] - np.maximum(a[..., 0], a[..., 2])
        alpha = np.clip(1 - (spill - 25) / 70, 0, 1) * 255
    return int(np.nonzero((alpha > 20).any(axis=1))[0][0])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("--id", required=True)
    ap.add_argument("--art")
    ap.add_argument("--out")
    ap.add_argument("--height", type=float, default=136, help="screen px tall in game")
    ap.add_argument("--scale", type=float, default=0.4, help="canvas px -> stored image px")
    a = ap.parse_args()
    src = json.load(open(a.source))
    folder = src.get("dir") or os.path.dirname(a.source)
    art = a.art or f"assets/art/rigs/{a.id}"
    out = a.out or f"src/data/rigs/{a.id}.js"
    os.makedirs(art, exist_ok=True)
    s = a.scale

    def cut(name, img):
        dst = os.path.join(art, f"{name}.png")
        _, bbox = key(os.path.join(folder, img), dst, None, s)
        return dst, bbox[:2]

    origin, path = {}, {}
    for name, p in src["parts"].items():
        path[name], origin[name] = cut(name, p["img"])
    swaps, sorigin = {}, {}
    for name, sw in src.get("swaps", {}).items():
        if sw["of"] in src["parts"]:
            swaps[name] = (sw["of"],) + cut(name, sw["img"])
            sorigin[name] = swaps[name][2]
    axis = lambda d: round(math.degrees(math.atan2(d[1][1] - d[0][1], d[1][0] - d[0][0])), 2)

    top = silhouette_top(os.path.join(folder, src["master"]))
    scale = a.height / ((src["floorY"] - top) * s)   # stored image px -> screen px
    root = next(n for n, p in src["parts"].items() if not p.get("parent"))
    local = lambda name, pt: [round((pt[0] - origin[name][0]) * s, 2), round((pt[1] - origin[name][1]) * s, 2)]

    lines = [f"// DRAFT rig from {a.source} (tools/rig_from_source.py, T016). Images keyed into {art} at x{s}.",
             "// Points are in each image's own px; rest 0 = the master pose (rig bench convention). Write its poses before use.",
             f"const P = '{art.rstrip('/')}/';", "", "export default {", f"  id: '{a.id}',",
             f"  scale: {scale:.5f},", f"  rootY: {(src['floorY'] - src['parts'][root]['pivot'][1]) * s * scale:.3f},", "  parts: {"]
    for name, p in src["parts"].items():
        fields = [f"img: P + '{name}.png'"]
        if p.get("parent"):
            fields += [f"parent: '{p['parent']}'", f"attach: {local(p['parent'], p['pivot'])}"]
        fields += [f"pivot: {local(name, p['pivot'])}", f"order: {p.get('band', 500)}"]
        def extra(n):
            S, o = src["swaps"][n], sorigin[n]
            out = f", hide: {json.dumps(S['hide'])}" if S.get("hide") else ""
            if S.get("itemGrip"):
                out += f", grip: [{round((S['itemGrip'][0] - o[0]) * s, 2)}, {round((S['itemGrip'][1] - o[1]) * s, 2)}]"
            if S.get("slotDirection"):
                out += f", axis: {axis(S['slotDirection'])}"
            return out
        sw = [f"'{n}': {{ img: P + '{n}.png', offset: [{round((o[0] - origin[name][0]) * s, 2)}, {round((o[1] - origin[name][1]) * s, 2)}]{extra(n)} }}"
              for n, (of, _, o) in swaps.items() if of == name]
        if sw:
            fields.append("swaps: { " + ", ".join(sw) + " }")
        lines.append(f"    '{name}': {{ " + ", ".join(fields) + " },")
    lines.append("  },")
    if src.get("grips"):
        lines.append("  hands: {")
        for n, g in src["grips"].items():
            lines.append(f"    '{n}': {{ part: '{g['of']}', at: {local(g['of'], g['center'])}, axis: {axis(g['direction'])} }},")
        lines.append("  },")
    lines += ["};", ""]
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    open(out, "w").write("\n".join(lines))
    print("wrote", out)


if __name__ == "__main__":
    main()
