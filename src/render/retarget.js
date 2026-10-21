// Retarget by position (T035 r2), pure: a rig with `retarget` (the rig its poses were written for: rat v3 -> the raider,
// rigs/rat-v3.js) plays those poses by where the source's hands and feet are, not by its joint angles (v3's drawings rest
// at other angles, so the same number bent its arms another way). Each frame the source is laid out with the pose as the
// game draws it (its own drawings, views, held item, grip IK and wrist limits: render/rig-grip.js), and each of v3's
// limbs is solved onto the same place inside v3's limits (render/limits.js reachInLimits), the elbow / knee bent to the
// source's side, the hand / foot at the source's turn on screen.
// The place: how far the source's wrist / ankle has moved from where it rests, in the frame of the body part the limb
// hangs from (torso for arms, pelvis for legs: they keep their angles, same rest on both), scaled by limb length (v3 /
// source), added to v3's own resting wrist / ankle. So the rest pose maps onto v3's own master pose even where the two rats'
// joint points sit differently on the drawings (v3's ankle point is ~5 px higher on its foot, its far knee forward).
// The torso, neck, waist, tail and root keep their angles. An arm the source draws whole (a whole-arm drawing hides its
// forearm and fist) is placed by that drawing's fist (its `grip` point) against the source's resting fist (its hand socket),
// the hand keeping its turn; a whole leg (kneeling, folded) keeps its angles. Unmirrored (sx 1): a turn's sx applies after.
// No `retarget`: as given.
import { layoutRig } from './rig-layout.js';
import { gripLayout } from './rig-grip.js';
import { limbGeometry, limbInLimits, pivotOf } from './limits.js';

const D = Math.PI / 180;
export const LIMBS = [['arm-near-upper', 'arm-near-lower', 'hand-near'], ['arm-far-upper', 'arm-far-lower', 'hand-far'],
  ['leg-near-upper', 'leg-near-lower', 'foot-near'], ['leg-far-upper', 'leg-far-lower', 'foot-far']];
const byName = (L) => Object.fromEntries(L.filter((e) => e.m && !e.line).map((e) => [e.name, e]));
const has = (B, limb) => limb.every((n) => B[n]);
const angOf = (m) => Math.atan2(m[1], m[0]) / D;
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const turn = (deg, [x, y]) => { const c = Math.cos(deg * D), s = Math.sin(deg * D); return [x * c - y * s, x * s + y * c]; };

// The source's drawn layout for joints (unmirrored): what the retarget copies. held = heldOf(f, src) (render/rig.js).
export const sourceLayout = (src, joints, swap, held, f) => byName(gripLayout(src, { ...joints, sx: 1 }, swap, held, f));

// A limb's end from its root (shoulder / hip) in its parent's frame, and its length, on layout B
function local(rig, B, [up, lo, end]) {
  const S = pivotOf(rig, B, up), E = pivotOf(rig, B, lo), W = pivotOf(rig, B, end), R = angOf(B[rig.parts[up].parent].base);
  return { S, R, q: turn(-R, [W[0] - S[0], W[1] - S[1]]), len: Math.hypot(E[0] - S[0], E[1] - S[1]) + Math.hypot(W[0] - E[0], W[1] - E[1]) };
}
const rests = new WeakMap();
const restOf = (rig) => rests.get(rig) ?? rests.set(rig, byName(layoutRig(rig, {}))).get(rig);

// An arm the source draws whole: its fist on that drawing and at rest (the hand socket), in the parent's frame from the
// shoulder, with the arm's resting length. null = not drawn whole (or no fist point).
function wholeFist(src, A, [up, , end]) {
  const e = A[up], sw = e?.swap && src.parts[up].swaps?.[e.swap], so = src.sockets?.[end.replace('-', '_')];
  if (A[end] || !sw?.grip || so?.part !== end) return null;
  const R0 = restOf(src), r = local(src, R0, [up, src.parts[end].parent, end]), S = pivotOf(src, A, up), R = angOf(A[src.parts[up].parent].base);
  const F = apply(e.m, sw.grip), F0 = apply(R0[end].base, so.at), S0 = pivotOf(src, R0, up);
  return { s: { q: turn(-R, [F[0] - S[0], F[1] - S[1]]), len: r.len }, s0: { q: [F0[0] - S0[0], F0[1] - S0[1]] } };
}

// Where v3's wrist / ankle goes (screen px of its layout B) for the source's layout A
export function goalOf(src, A, rig, B, limb) {
  const W = wholeFist(src, A, limb), s = W?.s ?? local(src, A, limb), s0 = W?.s0 ?? local(src, restOf(src), limb);
  const v = local(rig, B, limb), v0 = local(rig, restOf(rig), limb), k = v.len / s.len;
  const q = [v0.q[0] + k * (s.q[0] - s0.q[0]), v0.q[1] + k * (s.q[1] - s0.q[1])], w = turn(v.R, q);
  return [v.S[0] + w[0], v.S[1] + w[1]];
}

// T039 r2: a hand holding something turns so its own grip line (rig.hands: the user's lines on v3's drawings) runs where
// the source's item points, not to the source hand's turn: the two rats' grip drawings sit at other angles in the fist,
// and the source's grip mode turns its hand about the item (weapon-node.js), which v3 doesn't redo. The held item: along
// the source fist's line (its hand drawing, or a whole-arm key's `axis`); the strapped shield: its own item line. Screen
// degrees for v3's hand part's x axis; undefined = no item in that hand (or no line): the source hand's turn, as before.
const dirOf = (m, deg) => Math.atan2(m[1] * Math.cos(deg * D) + m[3] * Math.sin(deg * D), m[0] * Math.cos(deg * D) + m[2] * Math.sin(deg * D)) / D;
function itemTurn(src, A, rig, end) {
  if (!rig.gripLines || !src.gripLines) return undefined;
  const side = end.replace('hand-', ''), sh = A.shield, L = sh && src.itemLines?.[sh.p.strap];
  if (end === 'hand-far' && L && rig.hands?.['hand-far-shield']) return dirOf(sh.m, Math.atan2(L.gripEnd[1] - L.grip[1], L.gripEnd[0] - L.grip[0]) / D) - rig.hands['hand-far-shield'].axis;
  const h = A.held, by = h?.p?.parent;
  if (!h?.m || !by?.includes(`-${side}`)) return undefined;
  const H = rig.hands?.[A[end]?.swap] ?? (!A[end] && rig.hands?.[rig.heldHand?.[end]]);
  if (!H) return undefined;
  const S = A[end] ? src.hands?.[A[end].swap] : src.parts[by]?.swaps?.[A[by]?.swap];
  if (S?.axis == null) return undefined;
  return dirOf(A[end] ? A[end].base : A[by].m, S.axis) - H.axis;
}

export function retargetLayer(rig, joints, A) {
  if (!rig.retarget || !A) return joints;
  const src = rig.retarget;
  let out = { ...joints, sx: 1 }, B = byName(layoutRig(rig, out));
  for (const limb of LIMBS) {
    if (!has(B, limb)) continue;
    if (has(A, limb)) {
      const s = limbGeometry(src, A, joints, limb);
      out = limbInLimits(rig, B, out, limb, goalOf(src, A, rig, B, limb), itemTurn(src, A, rig, limb[2]) ?? s.endTurn, s.bend).joints;
    } else if (wholeFist(src, A, limb)) out = limbInLimits(rig, B, out, limb, goalOf(src, A, rig, B, limb), itemTurn(src, A, rig, limb[2]), 0).joints;
    else continue;
    B = byName(layoutRig(rig, out));
  }
  const { sx: _sx, ...rest } = out;
  return joints.sx === undefined ? rest : { ...rest, sx: joints.sx };
}
