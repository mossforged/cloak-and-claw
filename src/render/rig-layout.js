// Rig layout (split out of rig.js, T024): each part's image matrix for a set of joints, swaps and held item. Pure.
import { applyViews, capTurn, capShows } from './rig-views.js';
import { GRIP_BAND } from '../data/grip-modes.js';

const D = Math.PI / 180;

// 2D affine matrices [a, b, c, d, e, f] (same layout as canvas setTransform).
export const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
export const rot = (deg) => { const c = Math.cos(deg * D), s = Math.sin(deg * D); return [c, s, -s, c, 0, 0]; };
export const tr = (x, y) => [1, 0, 0, 1, x, y];
export const sc = (x, y = x) => [x, 0, 0, y, 0, 0];
export const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const scaleOf = (p) => (Array.isArray(p.scale) ? p.scale : [p.scale ?? 1, p.scale ?? 1]);
// image -> bone frame (no translation); pose stretch '<part>.sx/.sy' multiplies the data scale.
const shape = (name, p, j) => { const [x, y] = scaleOf(p); return mul(sc(x * (j[`${name}.sx`] ?? 1), y * (j[`${name}.sy`] ?? 1)), rot(p.rest ?? 0)); };

// A swap image is drawn so its pixel (x, y) lands on the part's own (offset + scale * (x, y)):
// pivot and children's attach points stay in the part's own pixels whichever image shows.
// A swap may also hide other parts (`hide: [names]`, e.g. the forearm when a whole-arm drawing is in) and
// re-attach children to points on its own image (`carry: { child: [x, y] }` in swap image px, e.g. the
// shield onto the drawn fist): the child then hangs off this part, keeping its own joint angle (T012). T023: `turn: { child:
// deg }` turns the carried child's drawing on top (the whole raised arm's fist holds the sword's handle at its own slot axis).
export const swapMatrix = (s) => mul(tr(...(s.offset ?? [0, 0])), sc(s.scale ?? 1));

// T026: a rig whose default hand drawing is a fist (A018) names the drawing a hand holding its item puts on
// (`heldHand: { part: swap }`), unless the pose names that part. No heldHand: swaps as given.
export const withHeldHand = (rig, swap, held) => (held?.part && rig.heldHand ? { ...rig.heldHand, ...swap } : swap);

// Each part's image matrix (part px -> screen px, feet at 0,0) and image path, in draw order (`base` = the matrix of the
// part's own image whichever swap shows: gear overlays ride it, render/looks.js).
// swap: { part: swap name } from the pose. held: { slot, part } from heldOf (a held weapon replaces the slot part's
// drawing; part null = empty hand, slot hidden, and the rig's `emptyHand` swaps unless the pose names that part). Pure; tests use it.
export function layoutRig(rig, joints, swap = {}, held = null) {
  const frames = {};
  const parts = held?.part ? { ...rig.parts, [held.slot]: { ...rig.parts[held.slot], ...held.part, swaps: undefined } } : { ...rig.parts };
  const hidden = new Set();
  if (held && !held.part && rig.emptyHand) swap = { ...rig.emptyHand, ...swap };   // T023: the empty hand's own drawing
  const V = applyViews(rig, parts, swap);   // T028: torso / pelvis views (drawing, joint points, bands); none = as before
  swap = V.swap;
  for (const h of V.hide) hidden.add(h);   // T028 r2: parts a view leaves out (B: the belt)
  swap = withHeldHand(rig, swap, held);
  if (rig.strapHand) swap = { ...swap, ...rig.strapHand };   // T029 r2: a hand holding a strap (render/strap.js) keeps its strap drawing
  for (const [name, key] of Object.entries(swap)) {
    const s = parts[name]?.swaps?.[key];
    if (!s) continue;
    for (const h of s.hide ?? []) hidden.add(h);
    for (const [c, xy] of Object.entries(s.carry ?? {})) {
      // T028 r4: a key that carries only what its own hand holds (`carryHand`: the far raised arm and the bow, not the cutlass)
      if (parts[c] && !(s.carryHand && parts[c].parent !== s.carryHand)) parts[c] = { ...parts[c], parent: name, attach: apply(swapMatrix(s), ...xy), rest: (parts[c].rest ?? 0) + (s.turn?.[c] ?? 0) };
    }
  }
  const frameOf = (name) => {
    if (frames[name]) return frames[name];
    const p = parts[name];
    let m;
    if (!p.parent) m = mul(mul(tr(joints.dx ?? 0, (joints.dy ?? 0) - rig.rootY), sc(rig.scale * (joints.sx ?? 1), rig.scale)), rot(joints[name] ?? 0));
    else {
      const q = parts[p.parent];
      const [ax, ay] = apply(shape(p.parent, q, joints), p.attach[0] - q.pivot[0], p.attach[1] - q.pivot[1]);
      const pf = frameOf(p.parent);
      // upright parts (the shield) cancel their parents' turn: the pose angle is relative to the rig, not the arm
      const undo = p.upright ? -Math.atan2(pf[1], pf[0]) / D : 0;
      m = mul(mul(pf, tr(ax, ay)), rot(undo + (joints[name] ?? 0) + (p.cap ? capTurn(rig, p, joints) : 0)));
    }
    return (frames[name] = m);
  };
  // T028: a view's band beats the pose's order channel; a cap draws just above its arm; the held item keeps its place
  // relative to the hand it hangs from when a view moves that hand to another band. T028 r2: a whole-arm drawing carrying
  // the held item is lifted over it later (rig-grip.js band, GRIP_BAND): its cap goes by that lifted order
  // T029 r2: a part that `rides` its parent (a strapped item) draws that many bands over it, whichever part carries it
  const orderOf = (name) => V.bands[name] ?? (parts[name].cap ? liftedOf(parts[name].parent) + (parts[name].capOrder ?? 5)
    : parts[name].rides != null ? orderOf(parts[name].parent) + parts[name].rides : joints[`${name}.order`] ?? parts[name].order);
  const heldBy = held?.part && rig.parts[held.part.parent] ? held.part.parent : null;
  const orderAt = (name) => (heldBy && name === held.slot && V.bands[heldBy] != null && V.bands[name] == null
    ? parts[name].order + orderOf(heldBy) - (joints[`${heldBy}.order`] ?? rig.parts[heldBy].order) : orderOf(name));
  const liftedOf = (name) => (held?.part && parts[name]?.swaps?.[swap[name]]?.carry?.[held.slot] && orderOf(name) <= orderAt(held.slot)
    ? orderAt(held.slot) + GRIP_BAND : orderOf(name));
  return Object.entries(parts)
    .map(([name, p]) => {
      const m = mul(mul(frameOf(name), shape(name, p, joints)), tr(-p.pivot[0], -p.pivot[1]));
      const s = p.swaps?.[swap[name]];
      return { name, p, order: orderAt(name), img: s ? s.img : p.img, swap: s ? swap[name] : null, m: s ? mul(m, swapMatrix(s)) : m, base: m };
    })
    .filter((e) => !hidden.has(e.name) && !(held && e.name === held.slot && !held.part) && !(e.p.cap && !capShows(liftedOf, e.p)))
    .sort((a, b) => a.order - b.order);
}

