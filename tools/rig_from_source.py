"""Draft rig importer (T016). Reads a rig-source.json (rig standard section 5, rule 4) and writes:
  - every part and swap keyed (tools/key_green.py), trimmed and scaled by one uniform factor into --art
  - a draft src/data/rigs/<id>.js: pivots/attach points converted to each image's own pixels, bands as draw order,
    swaps with their offsets, rest 0 (joint angle 0 = the master pose, as in the rig bench and data/rigs/biped-poses.js).
Usage: python3 tools/rig_from_source.py <rig-source.json> --id rat-raider [--art assets/art/enemies/rat-raider/rig]
       [--merge <fragment rig-source.json> ...]
       [--out src/data/rigs/rat-raider.js] [--height 136] [--scale 0.4]
A draft: the game's poses for the character still have to be written against it.
T023: whole-arm swaps keep their extra fields: `hide` (parts the drawing replaces), `itemGrip` -> `grip` (where the held
item sits, swap image px) and `slotDirection` -> `axis` (degrees the fist holds a handle toward the item's head). The
source's `grips` (each grip hand's slot centre and direction) become `hands`: { swap: { part, at (part px), axis } }.
T024: part names are near/far (rig standard section 3). A source that says front/back for limbs, hands and feet (A013,
A016) is read as near/far, so the output (data and image names) uses the new names; head/torso `back` views keep theirs.
T026 round 2: every cut loses its detached islands (tools/islands.py: stray scraps apart from the main shape), each one
dropped listed in the report; --keep-islands <name,...> keeps them on parts drawn in pieces on purpose (e.g. whiskers).
T028: the source's view joint points (`anchors`, canvas px, per torso / pelvis drawing; A023) become `bodyViews` (each
view's drawing, points in that part's own px, the rehearsal's default bands); render/rig-views.js reads them.
T028 r2 (A023 round 2): a grip drawing's `under` piece (the fingers behind the handle) is written on the swap
(`under: '<swap>'`; paired-under grips are not hands of their own); a part marked `visibleWhenArmInFront` is a shoulder cap
(`cap: true`); `viewSwaps.<code>` (the back view's limb cuts) and `viewJointPositions.<code>` (where each limb's joint sits
in that view, canvas px) become the view's `swaps` and `attach` (each child's joint on its parent's own px, so the cut
hangs where the view's setup put it); the B pelvis hides the separate `belt` (the back drawing has its own).
T035 (rat v3, A026 + A027: every piece drawn whole on the master canvas): --joints <fitted joints json> (the user's Fitting
Room points and limits, docs/design/rigs/rat-v3-joints-v4.json) wins over the source's pivots: each jointed part turns on
the user's point (its parent's attach follows), and the limits are written as `limits: { part: [lo, hi] }` (degrees from
rest, + clockwise on screen). --floor-y gives the floor for a source without `floorY` (A018's 1950: same master, same
scale as the raider). Re-run after Art's next round (same PNG names, same points), then node tools/rig-hulls.mjs:
  python3 tools/rig_from_source.py assets/source/A027-rat-v3-body/rig-source.json --id rat-v3 \\
    --joints docs/design/rigs/rat-v3-joints-v4.json --floor-y 1950 --art assets/art/enemies/rat-raider/rig-v3 \\
    --out src/data/rigs/rat-v3-parts.js
  node tools/rig-hulls.mjs --only rat-v3   (T035 r2: only v3's outlines; the game rat's stay as they are)"""
import argparse, json, math, os, re, sys
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from key_green import key  # noqa: E402
from islands import describe  # noqa: E402


def alpha_of(path):
    a = np.asarray(Image.open(path).convert("RGBA")).astype(np.float32)
    if a[..., 3].min() < 255:
        return a[..., 3]
    spill = a[..., 1] - np.maximum(a[..., 0], a[..., 2])
    return np.clip(1 - (spill - 25) / 70, 0, 1) * 255


def silhouette_top(path):
    return int(np.nonzero((alpha_of(path) > 20).any(axis=1))[0][0])


def derive_sockets(src, folder):
    """T024 sockets (rig standard 9a), canvas px, from part pivots and drawings (facing right):
    hand_near / hand_far = the grip fist's slot centre (source `grips`), else the hand drawing's middle; chest = halfway
    from the torso's pivot (waist) to the neck; head_top = the top of the head drawing; mouth = its front-most point (the
    snout); tail_tip = the tail drawing's point farthest from its pivot. feet (halfway between the soles, on the floor) and
    weapon_tip (the held item's art `tip`, else its far end along the handle) are found at runtime."""
    P = src["parts"]
    def opaque(name):
        ys, xs = np.nonzero(alpha_of(os.path.join(folder, P[name]["img"])) > 127)
        return xs, ys
    out = {}
    grips = src.get("grips") or {}
    for side in ("near", "far"):
        hand = f"hand-{side}"
        if hand not in P:
            continue
        g = next((g for n, g in grips.items() if g["of"] == hand), None)
        if g:
            out[f"hand_{side}"] = (hand, g["center"])
        else:
            xs, ys = opaque(hand)
            out[f"hand_{side}"] = (hand, [float(xs.mean()), float(ys.mean())])
    if "torso" in P and "head" in P:
        a, b = P["torso"]["pivot"], P["head"]["pivot"]
        out["chest"] = ("torso", [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2])
    if "head" in P:
        xs, ys = opaque("head")
        top = ys.min()
        out["head_top"] = ("head", [float(xs[ys <= top + 6].mean()), float(top)])
        front = xs.max()
        out["mouth"] = ("head", [float(front), float(ys[xs >= front - 6].mean())])
    tails = [n for n in P if n == "tail" or re.fullmatch(r"tail-\d", n)]
    if tails:   # T026: a segmented tail's tip is on its last segment
        last = sorted(tails, key=lambda n: 0 if n == "tail" else int(n[5:]))[-1]
        xs, ys = opaque(last)
        px, py = P[last]["pivot"]
        i = int(np.argmax((xs - px) ** 2 + (ys - py) ** 2))
        out["tail_tip"] = (last, [float(xs[i]), float(ys[i])])
    return out


def source_sockets(src, derived):
    """T026: sockets the source names outright (A018 `sockets`: { name: { part, at } }, canvas px) win over the derived
    ones; feet / weapon_tip stay runtime. Prints where each differs from the derived point (canvas px)."""
    out = dict(derived)
    for n, s in (src.get("sockets") or {}).items():
        if "part" not in s:
            continue
        part = near_far(s["part"])
        d = derived.get(n)
        if d:
            gap = math.hypot(s["at"][0] - d[1][0], s["at"][1] - d[1][1]) if d[0] == part else None
            print(f"socket {n}: source {part} {s['at']} vs derived {d[0]} {[round(v) for v in d[1]]}"
                  + (f" ({gap:.0f} canvas px apart)" if gap is not None else " (different part)"), file=sys.stderr)
        out[n] = (part, s["at"])
    return out


def near_far(n):
    if n is None:
        return None
    if n == "tail-1":
        return "tail"
    return re.sub(r"\b(arm|leg|hand|foot)-back", r"\1-far", re.sub(r"\b(arm|leg|hand|foot)-front", r"\1-near", n))


def renamed(src):
    """The source with near/far part names (keys, parents, swap targets, hide lists, grip hands). T026: a segmented tail's
    first segment `tail-1` is the standard's `tail` (poses turn the root by that name); tail-2, tail-3 hang off it."""
    fix = lambda d: {near_far(k): v for k, v in (d or {}).items()}
    out = dict(src)
    out["parts"] = {k: {**p, "parent": near_far(p.get("parent"))} for k, p in fix(src.get("parts")).items()}
    out["swaps"] = {k: {**s, "of": near_far(s["of"]), **({"hide": [near_far(h) for h in s["hide"]]} if s.get("hide") else {})}
                    for k, s in fix(src.get("swaps")).items()}
    if src.get("grips"):
        out["grips"] = {k: {**g, "of": near_far(g["of"])} for k, g in fix(src["grips"]).items()}
    return out


def sockets_block(sk, local, pad=""):
    body = ", ".join(f"{n}: {{ part: '{part}', at: {local(part, pt)} }}" for n, (part, pt) in sk.items())
    return f"{pad}sockets: {{ {body}, feet: {{ parts: ['foot-near', 'foot-far'] }}, weapon_tip: {{ item: 'tip' }} }},"


# T028 views: which view each torso / pelvis drawing is, and the rehearsal's default bands per view
# (docs/design/rigs/rat-raider-rehearsal.md: S and F near arm in front, BQ near arm behind, B far arm in front and the
# legs and tail swapped). The source records `anchors` (canvas px) per drawing: top level { drawing: { joint: [x, y] } }
# or an `anchors` field on the part / swap.
VIEW_OF = {"torso": "Q", "torso-side": "S", "torso-front": "F", "torso-away": "BQ", "torso-back": "B", "torso-hunched": "H",
           "torso-lean-back": "LB", "pelvis": "Q", "pelvis-side": "S", "pelvis-front": "F", "pelvis-back": "B"}
NEAR_FRONT = {"arm-near-upper": 800}
VIEW_BANDS = {
    ("torso", "S"): NEAR_FRONT, ("torso", "F"): NEAR_FRONT,
    ("torso", "BQ"): {"arm-near-upper": 140, "arm-near-lower": 150, "hand-near": 145},
    ("torso", "B"): {"arm-far-upper": 800, "arm-far-lower": 820, "hand-far": 815, "arm-near-upper": 110, "arm-near-lower": 120, "hand-near": 115},
    # T028 r2: the feet stay under their shins (rig standard 5b.1) when the legs swap depth
    ("pelvis", "B"): {"leg-near-upper": 210, "leg-near-lower": 220, "foot-near": 215, "leg-far-upper": 510, "leg-far-lower": 520,
                      "foot-far": 515, "tail": 450, "tail-2": 460, "tail-3": 470},
}
# T028 r2: drawings a view brings for other parts (the front head on the F chest, the back head on the B chest)
VIEW_HEADS = {("torso", "F"): "head-front", ("torso", "B"): "head-back"}
ARM_PARTS = ("arm-", "hand-", "shoulder-")
# T035: a fitted joint's name -> the part that turns on it (rig standard part names)
JOINT_PART = {"neck": "head", "waist": "torso", "tail-root": "tail", "tail-mid": "tail-2", "tail-end": "tail-3"}
for _side in ("near", "far"):
    JOINT_PART.update({f"shoulder-{_side}": f"arm-{_side}-upper", f"elbow-{_side}": f"arm-{_side}-lower", f"wrist-{_side}": f"hand-{_side}",
                       f"hip-{_side}": f"leg-{_side}-upper", f"knee-{_side}": f"leg-{_side}-lower", f"ankle-{_side}": f"foot-{_side}"})


def anchors_of(src):
    out = dict(src.get("anchors") or {})
    for d in (src.get("parts") or {}), (src.get("swaps") or {}):
        for n, p in d.items():
            if p.get("anchors"):
                out[n] = p["anchors"]
    return out


def view_limbs(src, slot, code, local):
    """T028 r2: a view's limb cuts (`viewSwaps`) and their joints (`viewJointPositions`, canvas px in that view's setup):
    each child's attach on its parent = the parent's pivot + (child joint - parent joint), in the parent's own px. Arms go
    with the torso view, legs with the pelvis view."""
    mine = lambda n: n.startswith(ARM_PARTS) == (slot == "torso")
    sw = {near_far(k): near_far(v) for k, v in ((src.get("viewSwaps") or {}).get(code) or {}).items() if mine(near_far(k))}
    J = {near_far(k): v for k, v in ((src.get("viewJointPositions") or {}).get(code) or {}).items()}
    at = {}
    for c, xy in J.items():
        par = src["parts"].get(c, {}).get("parent")
        if not mine(c) or par not in J:
            continue
        pv = src["parts"][par]["pivot"]
        at[c] = local(par, [pv[0] + xy[0] - J[par][0], pv[1] + xy[1] - J[par][1]])
    return sw, at


def views_block(src, local, pad="  "):
    """T028: bodyViews from the source's anchors (canvas px -> the torso's / pelvis' own px, as attach points)."""
    views = {}
    swaps = src.get("swaps") or {}
    for drawing, A in anchors_of(src).items():
        slot = drawing.split("-")[0]
        code = VIEW_OF.get(drawing)
        if slot not in ("torso", "pelvis") or not code or slot not in src["parts"]:
            print(f"anchors for {drawing}: not a torso / pelvis view drawing, skipped", file=sys.stderr)
            continue
        f = []
        if drawing != slot:   # a drawing still to come stays a stand-in (the part's own drawing, the new points)
            f.append(f"swap: '{drawing}'" if drawing in (src.get("swaps") or {}) else f"standIn: '{drawing}'")
        f.append("anchors: { " + ", ".join(f"{k}: {local(slot, pt)}" for k, pt in A.items()) + " }")
        if VIEW_BANDS.get((slot, code)):
            f.append("bands: " + json.dumps(VIEW_BANDS[(slot, code)]).replace('"', "'"))
        sw, at = view_limbs(src, slot, code, local)
        if VIEW_HEADS.get((slot, code)) in swaps:
            sw = {"head": VIEW_HEADS[(slot, code)], **sw}
        if sw:
            f.append("swaps: " + json.dumps(sw).replace('"', "'"))
        if at:
            f.append("attach: { " + ", ".join(f"'{c}': {xy}" for c, xy in at.items()) + " }")
        if slot == "pelvis" and code == "B" and "belt" in src["parts"]:
            f.append("hide: ['belt']")
        views.setdefault(slot, []).append(f"{code}: {{ " + ", ".join(f) + " }")
    if not views:
        return []
    return [f"{pad}bodyViews: {{"] + [f"{pad}  {slot}: {{ " + ", ".join(v) + " }," for slot, v in views.items()] + [f"{pad}}},"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("--id", required=True)
    ap.add_argument("--art")
    ap.add_argument("--out")
    ap.add_argument("--height", type=float, default=136, help="screen px tall in game")
    ap.add_argument("--scale", type=float, default=0.4, help="canvas px -> stored image px")
    ap.add_argument("--merge", action="append", default=[], help="T026: a rig-source fragment (A019, A022) laid over the source: its parts replace, its swaps and grips add; images resolve in the fragment's folder")
    ap.add_argument("--keep-islands", default="", help="T026 r2: comma-separated part/swap names whose detached pieces are kept")
    ap.add_argument("--joints", help="T035: the user's fitted joints (world points + limits): pivots and `limits`")
    ap.add_argument("--floor-y", type=float, help="T035: floor (canvas px) when the source has no floorY")
    ap.add_argument("--sockets", action="store_true", help="only print the sockets block (T024; images not written)")
    a = ap.parse_args()
    raw = json.load(open(a.source))
    for frag in a.merge:   # T026: fragments (same canvas and pivots); their image paths made absolute so they resolve
        F, fdir = json.load(open(frag)), os.path.abspath(os.path.dirname(frag))
        own = lambda d: {k: {**v, "img": os.path.join(fdir, v["img"])} for k, v in (d or {}).items()}
        raw["parts"] = {**raw["parts"], **{k: {**raw["parts"].get(k, {}), **v} for k, v in own(F.get("parts")).items()}}
        raw["swaps"] = {**raw.get("swaps", {}), **own(F.get("swaps"))}
        if F.get("anchors"):   # T028 (A023): view joint points
            raw["anchors"] = {**raw.get("anchors", {}), **F["anchors"]}
        for k in ("viewSwaps", "viewJointPositions"):   # T028 r2 (A023 round 2): the back view's limb cuts
            if F.get(k):
                raw[k] = {**raw.get(k, {}), **F[k]}
        if F.get("grips"):   # T026 r2 (A022): a fragment's grips win; a hand socket the base pinned on its old grip goes too
            raw["grips"] = {**raw.get("grips", {}), **F["grips"]}
            for side in {near_far(g["of"])[5:] for g in F["grips"].values()}:
                (raw.get("sockets") or {}).pop(f"hand_{side}", None)
        print(f"merged {frag}: parts {sorted((F.get('parts') or {}))}, swaps {sorted((F.get('swaps') or {}))}", file=sys.stderr)
    src = renamed(raw)
    if a.floor_y is not None:
        src["floorY"] = a.floor_y
    limits = {}
    if a.joints:   # T035: the user's points win over the source's pivots
        for jn, j in json.load(open(a.joints))["joints"].items():
            part = JOINT_PART.get(jn)
            if part not in src["parts"]:
                print(f"joint {jn}: no part {part}, skipped", file=sys.stderr)
                continue
            old = src["parts"][part]["pivot"]
            src["parts"][part] = {**src["parts"][part], "pivot": j["world"]}
            limits[part] = j["limits"]
            moved = math.hypot(j["world"][0] - old[0], j["world"][1] - old[1])
            if moved > 0.5:
                print(f"joint {jn}: {part} pivot {old} -> {j['world']} ({moved:.1f} canvas px)", file=sys.stderr)
    folder = src.get("dir") or os.path.dirname(a.source)
    s = a.scale
    if a.sockets:
        def tl(name):   # trim box top-left of a part's drawing on the canvas (as key_green trims it)
            al = alpha_of(os.path.join(folder, src["parts"][name]["img"])) > 20
            ys, xs = np.nonzero(al)
            return [int(xs.min()), int(ys.min())]
        print(sockets_block(source_sockets(src, derive_sockets(src, folder)), lambda n, pt: [round((pt[0] - tl(n)[0]) * s, 1), round((pt[1] - tl(n)[1]) * s, 1)]))
        return
    art = a.art or f"assets/art/rigs/{a.id}"
    out = a.out or f"src/data/rigs/{a.id}.js"
    os.makedirs(art, exist_ok=True)

    keep_islands = set(filter(None, a.keep_islands.split(",")))
    dropped = {}

    def cut(name, img):
        dst = os.path.join(art, f"{name}.png")
        isl = None if name in keep_islands else []
        _, bbox = key(os.path.join(folder, img), dst, None, s, isl)
        if isl:
            dropped[name] = isl
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
        if p.get("visibleWhenArmInFront"):   # T028 r2: a shoulder cap (render/rig-views.js)
            fields.append("cap: true")
        def extra(n):
            S, o = src["swaps"][n], sorigin[n]
            out = f", hide: {json.dumps(S['hide'])}" if S.get("hide") else ""
            if S.get("under"):   # T028 r2: the split grip's piece behind the handle
                out += f", under: '{near_far(S['under'])}'"
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
    if limits:   # T035
        lines.append("  limits: { " + ", ".join(f"'{p}': {lim}" for p, lim in limits.items()) + " },")
    if src.get("grips"):
        lines.append("  hands: {")
        for n, g in src["grips"].items():
            if g.get("kind") == "paired-under":   # T028 r2: drawn with its face piece, not a hand of its own
                continue
            lines.append(f"    '{n}': {{ part: '{g['of']}', at: {local(g['of'], g['center'])}, axis: {axis(g['direction'])} }},")
        lines.append("  },")
    lines.append(sockets_block(source_sockets(src, derive_sockets(src, folder)), local, "  "))
    lines += views_block(src, local)
    lines += ["};", ""]
    print(f"islands dropped ({len(dropped)} cuts; canvas px):" if dropped else "islands dropped: none")
    for n, isl in dropped.items():
        print(f"  {n}: {describe(isl)}")
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    open(out, "w").write("\n".join(lines))
    print("wrote", out, f"(scale {scale:.5f}: one uniform factor, no per-part scale)")


if __name__ == "__main__":
    main()
