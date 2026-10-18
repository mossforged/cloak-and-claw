// T028 r4: holds from the user's grip lines (rig standard 5b.2; data in rigs/<id>-grip-lines.js, pinned to the setup
// canvas). One rule for every hold: the item's grip point sits on the hand's grip centre (midpoint of a-b) and its handle
// direction (a -> b) equals the hand's handle direction (a -> b: pommel to blade). Pure; the rig module applies it once.
//   hands[<hand drawing>] = { part, at (part px), axis (deg, part px) }
//   whole-arm keys: swap.grip (swap image px) / swap.axis, and the held item carried there (`carry`, `turn`); a far-arm
//     key carries only an item held in the far hand (`carryHand`)
//   slots / axes: on the side grip (near) and the far grip (bow); grips['two-hand'] / bow: the second hand's point and line
//   itemLines[item id] = { grip, gripEnd, grip2? } in each item image's px (fractions x its size), read by render/rig.js
const D = 180 / Math.PI;
const mid = (l) => [(l.a[0] + l.b[0]) / 2, (l.a[1] + l.b[1]) / 2];
const axisOf = (l) => Math.atan2(l.b[1] - l.a[1], l.b[0] - l.a[0]) * D;
const r = (v) => Math.round(v * 1000) / 1000;

// a canvas point in a part's own px: the importer's cut keeps pivot_px = (pivot_canvas - trim) * CUT
export const partPx = (rig, G, part, C) => [rig.parts[part].pivot[0] + G.CUT * (C[0] - G.PIVOT[part][0]), rig.parts[part].pivot[1] + G.CUT * (C[1] - G.PIVOT[part][1])];
export const lineIn = (rig, G, name) => { const d = G.DRAWINGS[name]; return { a: partPx(rig, G, d.part, d.a), b: partPx(rig, G, d.part, d.b) }; };
export const handOf = (rig, G, name) => { const l = lineIn(rig, G, name); return { part: G.DRAWINGS[name].part, at: mid(l).map(r), axis: r(axisOf(l)) }; };
export const itemLine = (G, id) => {
  const I = G.ITEMS[id];
  if (!I) return null;
  const px = (f) => [r(f[0] * I.size[0]), r(f[1] * I.size[1])];
  return { grip: px(I.a), gripEnd: px(I.b), ...(I.c ? { grip2: px(I.c) } : {}) };
};

export function withGripLines(rig, G, itemIds) {
  const parts = { ...rig.parts }, hands = { ...rig.hands };
  for (const name of Object.keys(G.DRAWINGS).filter((n) => n.startsWith('hand-'))) hands[name] = handOf(rig, G, name);
  const SIDE = hands['hand-near-grip'], FAR = hands['hand-far-grip'];
  for (const name of Object.keys(G.DRAWINGS).filter((n) => n.startsWith('arm-'))) {
    const h = handOf(rig, G, name), p = parts[h.part], s = p.swaps[name], o = s.offset ?? [0, 0];
    const grip = [r(h.at[0] - o[0]), r(h.at[1] - o[1])], near = h.part.startsWith('arm-near');
    const ref = near ? SIDE.axis : FAR.axis;   // the held item lies along the hand it hangs from: turn it onto this key's line
    parts[h.part] = { ...p, swaps: { ...p.swaps, [name]: { ...s, grip, axis: h.axis, carry: { held: grip }, turn: { held: r(h.axis - ref) }, carryHand: near ? 'hand-near' : 'hand-far' } } };
  }
  const OVER = hands['hand-far-grip-overhand'], PINCH = hands['hand-near-pinch'];
  const slots = { ...rig.slots, 'one-hand': { ...rig.slots['one-hand'], attach: SIDE.at }, 'two-hand': { ...rig.slots['two-hand'], attach: SIDE.at },
    bow: { ...rig.slots.bow, attach: FAR.at } };
  const axes = { ...rig.axes, 'one-hand': SIDE.axis, 'two-hand': SIDE.axis, bow: FAR.axis };
  const g2 = rig.grips['two-hand'], gb = rig.grips.bow;
  const grips = { ...rig.grips, 'two-hand': { ...g2, align: OVER.axis, ik: { ...g2.ik, hand: OVER.at } },
    bow: { ...gb, align: PINCH.axis, ik: { ...gb.ik, hand: PINCH.at } } };
  const itemLines = Object.fromEntries(itemIds.map((id) => [id, itemLine(G, id)]).filter(([, l]) => l));
  return { ...rig, parts, hands, slots, axes, grips, itemLines, gripLines: true };
}
