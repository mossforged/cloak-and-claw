// Grip alignment test (T028 r4), pure: on a rig with the user's grip lines (rig.gripLines), every hand holding an item
// holds it on the user's line: the item's handle line (its grip a -> gripEnd b, rig.itemLines) passes within ALIGN_PX of
// the hand's grip centre and runs within ALIGN_DEG of the hand's line (pommel -> head, signed), as drawn on screen.
// Holds checked in a drawn frame (layout L, held from rigFrame):
//   the hand the item hangs from: its grip drawing (rig.hands) or the whole-arm key that carries it (swap grip / axis)
//   a two-hander's second hand on the shaft (rig.grips[grip].ik.to = 'grip2', its own drawing's line)
//   the bow's string hand on the nocked arrow (the arrow's own line), once the hand is on the string
// The hand the item hangs from holds it one way (its line pommel -> head along the item's); a second hand mid-shaft and the
// string hand have no pommel end, so their line is read either way round (the user's spear fist runs back to front).
// An item whose rig slot joint turns it in the fist on purpose (the fish's wobble: kit.feel.wobble) is checked for the
// point only. Distances as seen; angles with the body's own width undone (joints.sx: the turn-around squashes the whole
// rig across, which skews every angle; an edge-on frame, |sx| < EDGE, is not measured). A rig without the user's lines returns no holds (its old hold tests stand).
export const ALIGN_PX = 1, ALIGN_DEG = 1, EDGE = 0.2;
const D = Math.PI / 180;
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const lin = (m, [x, y]) => [m[0] * x + m[2] * y, m[1] * x + m[3] * y];
const ang = (v) => Math.atan2(v[1], v[0]) / D;
const wrap = (d) => ((d + 540) % 360) - 180;
const dir = (m, deg) => lin(m, [Math.cos(deg * D), Math.sin(deg * D)]);
// distance of P from the line through A along v
const off = (P, A, v) => { const n = Math.hypot(...v); return Math.abs((P[0] - A[0]) * v[1] - (P[1] - A[1]) * v[0]) / n; };

// every hold in one frame: [{ hand, item, px, deg }] (deg null when only the point is checked)
export function gripHolds(rig, L, held, f) {
  const sx = f?.sx ?? 1;
  if (!rig.gripLines || !held?.part || Math.abs(sx) < EDGE) return [];
  const un = (m) => [m[0] / sx, m[1], m[2] / sx, m[3], m[4] / sx, m[5]];
  L = L.map((e) => (e.m ? { ...e, m: un(e.m), base: e.base && un(e.base) } : e));
  const re = (P) => [P[0] * sx, P[1]];   // back to the screen for the distance
  const by = Object.fromEntries(L.filter((e) => e.m && !e.line).map((e) => [e.name, e])), W = by[held.slot];
  if (!W || (W.m[0] * W.m[3] - W.m[1] * W.m[2]) === 0) return [];
  const A = held.kit.art, G = apply(W.m, A.grip), u = lin(W.m, [A.gripEnd[0] - A.grip[0], A.gripEnd[1] - A.grip[1]]);
  const loose = !!held.kit.feel?.wobble, out = [];
  const hold = (name, C, v, line = [G, u], pointOnly = loose, either = false) => {
    const e = Math.abs(wrap(ang(v) - ang(line[1])));
    out.push({ hand: name, item: held.kit.id, px: off(re(C), re(line[0]), [line[1][0] * sx, line[1][1]]), deg: pointOnly ? null : either ? Math.min(e, 180 - e) : e });
  };
  const hand = rig.slots[held.grip]?.parent ?? held.part.parent, h = by[hand];
  if (h?.swap && rig.hands[h.swap]) {
    const H = rig.hands[h.swap];
    hold(h.swap, apply(h.base, H.at), dir(h.base, H.axis));
  } else {
    const k = L.find((e) => e.swap && e.p?.swaps?.[e.swap]?.carry?.[held.slot] && e.p.swaps[e.swap].hide?.includes(hand));
    if (k) { const s = k.p.swaps[k.swap]; hold(k.swap, apply(k.m, s.grip), dir(k.m, s.axis)); }
  }
  const g = rig.grips?.[held.grip], e = g && by[g.ik.end];
  if (g?.ik.to === 'grip2' && e?.swap && rig.hands[e.swap]) {
    const H = rig.hands[e.swap];
    hold(e.swap, apply(e.base, H.at), dir(e.base, H.axis), [G, u], false, true);
  }
  const arrow = L.find((x) => x.name === 'arrow'), al = rig.itemLines?.['rat-arrow'];
  if (g?.ik.to === 'nock' && arrow && al && e?.swap && rig.hands[e.swap] && f?.reached) {
    const H = rig.hands[e.swap];
    hold(e.swap, apply(e.base, H.at), dir(e.base, H.axis), [apply(arrow.m, al.grip), lin(arrow.m, [al.gripEnd[0] - al.grip[0], al.gripEnd[1] - al.grip[1]])], false, true);
  }
  return out;
}

// the holds that miss: off the line by over ALIGN_PX, or turned off it by over ALIGN_DEG
export const gripMisses = (holds) => holds.filter((h) => h.px > ALIGN_PX || (h.deg != null && h.deg > ALIGN_DEG));
