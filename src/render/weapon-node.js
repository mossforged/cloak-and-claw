// Weapon node (T025): a held item placed on its own, then the hands placed on it (Spine's two-handed weapon rig), so
// overhand / underhand / reverse holds are data (data/grip-modes.js), not drawings. Pure (tests use it).
// Placement: where the posed fist holds it (the pre-T025 placement: a pose that names neither `weapon` nor a grip mode
// gets exactly the old frame), pulled toward the pose's `weapon: { x, y, rot }` (rig px from the feet, x forward; rot =
// the handle's screen angle, 0 = forward, - = up; channels 'weapon.x/.y/.rot' with weights 'weapon.at'/'weapon.turn',
// so it blends between poses like any joint). The grip hand's drawing then copies the weapon's rotation (its slot axis
// along the handle, slot point on the grip, turned per mode about the grip), the arm is IK'd to the wrist that leaves,
// and if the arm can't reach, the weapon follows the hand (never drawn out of the fist). The slot's own joint (the fish's
// wobble, a sword turned in the fist) turns the weapon in the fist last.
import { layoutRig, mul, rot, tr, apply } from './rig-layout.js';
import { reach } from './rig-ik.js';
import { GRIP_MODES, modesFor } from '../data/grip-modes.js';
import HULLS from '../data/rigs/hulls.js';

const D = Math.PI / 180;
const lin = (m, v) => [m[0] * v[0] + m[2] * v[1], m[1] * v[0] + m[3] * v[1]];
const ang = (v) => Math.atan2(v[1], v[0]) / D;
const wrap = (d) => ((d + 540) % 360) - 180;
const about = (P, deg) => mul(mul(tr(P[0], P[1]), rot(deg)), tr(-P[0], -P[1]));
// reflection across the line through P at screen angle a (degrees)
const mirror = (P, a) => { const c = Math.cos(2 * a * D), s = Math.sin(2 * a * D); return mul(mul(tr(P[0], P[1]), [c, s, s, -c, 0, 0]), tr(-P[0], -P[1])); };

// The weapon a rig holds in a hand it can turn: a floor weapon / kit (held) or the rig's own one-hand part with its
// item `art` (the mouse's sword). null when there is nothing to place.
export function nodeOf(rig, held) {
  const slot = held?.part ? held.slot : !held && rig.slots?.['one-hand'];
  const p = slot && (held?.part ? { ...rig.parts[slot], ...held.part } : rig.parts[slot]);
  const art = held?.part ? held.kit.art : p?.art, grip = held?.part ? held.grip : 'one-hand';
  if (!p?.parent || !art?.gripEnd || rig.axes?.[grip] == null) return null;
  return { slot, hand: p.parent, at: p.attach, axis: rig.axes[grip], art, grip };
}

// Grip modes for this frame: forced (hold sheet, tests), else the pose's (`grip`, `grip2` keys, carried with the swaps
// as '@grip' / '@grip2'), else the rig's per-kit default (rig.holds[item id]), else the item's (kit.hold).
export function modesOf(rig, held, swap, force = {}) {
  const id = held?.kit?.id, d = { ...held?.kit?.hold, ...(id && rig.holds?.[id]) };
  const m = { grip: force.grip ?? swap['@grip'] ?? d.grip ?? 'side', grip2: force.grip2 ?? swap['@grip2'] ?? d.grip2 ?? null };
  if (rig.gripLines && !modesFor(rig).includes(m.grip)) m.grip = 'side';   // T028 r4: no mode without its own drawing
  return m;
}

// Is the node on this frame? (anything but the old placement with the side grip)
export function nodeActive(rig, joints, swap, held, modes) {
  const N = nodeOf(rig, held);
  if (!N || !(joints['weapon.at'] > 0 || joints['weapon.turn'] > 0 || modes.grip !== 'side')) return null;
  if (layoutRig(rig, joints, swap, held).every((e) => e.name !== N.hand)) return null;   // a whole-arm drawing holds it (raised, cocked)
  return N;
}

// Places weapon and grip hand. Returns { joints (arm IK'd), W (weapon image matrix before the slot joint), B (grip hand
// base matrix), finish(L) } where finish puts B, W and the slot joint into a final layout.
export function placeNode(rig, joints, swap, held, N, mode) {
  const A = N.art, ik = { arm: [rig.parts[rig.parts[N.hand].parent].parent, rig.parts[N.hand].parent], hand: rig.parts[N.hand].attach };
  const j0 = { ...joints, [N.slot]: 0 }, by = (L, n) => L.find((e) => e.name === n);
  const L0 = layoutRig(rig, j0, swap, held), W0 = by(L0, N.slot).m, H0 = by(L0, N.hand).base;
  const G0 = apply(W0, ...A.grip), a0 = ang(lin(W0, [A.gripEnd[0] - A.grip[0], A.gripEnd[1] - A.grip[1]]));
  // target: the pose's placement in rig space (with the body's own shift and width), mixed in by the weights
  const sx = joints.sx ?? 1, wa = joints['weapon.at'] ?? 0, wt = joints['weapon.turn'] ?? 0;
  const Gt = [(joints.dx ?? 0) + sx * (joints['weapon.x'] ?? 0), (joints.dy ?? 0) + (joints['weapon.y'] ?? 0)];
  const r = (joints['weapon.rot'] ?? 0) * D, aT = ang([Math.cos(r) * sx, Math.sin(r)]);
  const G = [G0[0] + (Gt[0] - G0[0]) * wa, G0[1] + (Gt[1] - G0[1]) * wa], a = a0 + wrap(aT - a0) * wt;
  let W = mul(mul(tr(G[0] - G0[0], G[1] - G0[1]), about(G0, a - a0)), W0);
  // the grip hand copies the weapon: slot axis along the handle, slot point on the grip, then the mode about the grip
  // T028 r4: on the user's lines the drawing is placed as drawn (its own line along the handle), never turned over
  const M = rig.gripLines ? GRIP_MODES.side : GRIP_MODES[mode] ?? GRIP_MODES.side, S0 = apply(H0, ...N.at);
  const B1 = mul(mul(tr(G[0] - S0[0], G[1] - S0[1]), about(S0, a - ang(lin(H0, [Math.cos(N.axis * D), Math.sin(N.axis * D)])))), H0);
  const pivot = rig.parts[N.hand].pivot, cands = M.turns.map((t) => (M.mirror ? mul(mirror(G, a + 90), mul(about(G, t), B1)) : mul(about(G, t), B1)));
  // over / under: the fist drawing's middle (its hull's mean point) above or below the shaft line on screen
  const sw = rig.parts[N.hand].swaps?.[swap[N.hand]], hull = HULLS[sw?.img ?? rig.parts[N.hand].img];
  const mid = hull ? hull.reduce((p, q) => [p[0] + q[0] / hull.length, p[1] + q[1] / hull.length], [0, 0]) : pivot;
  const own = sw ? [(sw.offset?.[0] ?? 0) + (sw.scale ?? 1) * mid[0], (sw.offset?.[1] ?? 0) + (sw.scale ?? 1) * mid[1]] : mid;
  const u = [Math.cos(a * D), Math.sin(a * D)], up = u[0] >= 0 ? [u[1], -u[0]] : [-u[1], u[0]];   // the shaft's upward normal
  const height = (B) => { const c = apply(B, ...own); return (c[0] - G[0]) * up[0] + (c[1] - G[1]) * up[1]; };
  let B = cands[0];
  if (M.wrist) B = cands.reduce((p, c) => ((M.wrist === 'above' ? height(c) > height(p) : height(c) < height(p)) ? c : p));
  // the arm to the wrist; the hand stays on the forearm, so if it falls short the weapon comes with it
  const Pw = apply(B, ...pivot);
  let j = joints;
  for (let i = 0; i < 2; i++) j = reach(rig, j, swap, held, ik, () => Pw);
  const Pa = apply(by(layoutRig(rig, j, swap, held), N.hand).base, ...pivot), e = tr(Pa[0] - Pw[0], Pa[1] - Pw[1]);
  B = mul(e, B); W = mul(e, W);
  const finish = (L) => {
    const Gs = apply(W, ...A.grip), spin = Math.sign(W[0] * W[3] - W[1] * W[2]) * (joints[N.slot] ?? 0);
    const Wd = mul(about(Gs, spin), W);
    return L.map((x) => {
      if (x.name === N.hand) return { ...x, base: B, m: mul(B, mul(inv(x.base), x.m)) };
      if (x.name === N.slot) return { ...x, m: Wd };
      return x;
    });
  };
  return { joints: j, W, B, finish };
}

const inv = (m) => { const d = m[0] * m[3] - m[1] * m[2]; return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[3] * m[4]) / d, (m[1] * m[4] - m[0] * m[5]) / d]; };
