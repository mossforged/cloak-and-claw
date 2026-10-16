// Weapon grips on a rig (T011): a held kit whose grip type has an entry in `rig.grips` (two-hand spear, bow) swaps in
// its hand drawings (T018: the far `hand-back` grip or pinch) and bends one arm with 2-bone IK so its hand lands on a point of the weapon art: `grip2`
// on a spear shaft, or the bow's `nock` pulled back by how far the bow is drawn (the hand reaches it as the draw starts). A bow also gets its drawn string (two
// lines from the tips to the hand) and, while drawing, the shot's arrow nocked on it. Drawing only; pure (tests use it).
// T020: the IK hand can also turn to close round the shaft (`align`), parts can change draw order while gripping
// (`order`), and a bow can be drawn back to a point on the body (`anchor`: the ear) instead of a fixed `pull`.
import { layoutRig } from './rig.js';
import { phaseOf } from '../sim/fighter.js';

const D = Math.PI / 180;
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) / D;
const wrap = (d) => ((d + 540) % 360) - 180;
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const lin = (m, v) => [m[0] * v[0] + m[2] * v[1], m[1] * v[0] + m[3] * v[1]];
const inv = (m) => { const d = m[0] * m[3] - m[1] * m[2]; return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[3] * m[4]) / d, (m[1] * m[4] - m[0] * m[5]) / d]; };

// A part's own px (pivot space) on screen, whichever drawing (swap) it shows.
export function at(rig, L, name, xy) {
  const e = L.find((x) => x.name === name), s = e.swap && rig.parts[name].swaps[e.swap];
  const k = s?.scale ?? 1, o = s?.offset ?? [0, 0];
  return apply(e.m, ...(s ? [(xy[0] - o[0]) / k, (xy[1] - o[1]) / k] : xy));
}

// How far a bow is drawn (0..1): eases back over the shot move's windup, snaps forward on the loose.
export function drawOf(f) {
  if (!f.move?.shot) return 0;
  const [ph, p] = phaseOf(f);
  return ph === 'windup' ? 1 - (1 - p) ** 2 : 0;
}

// Joints with `upper`/`lower` bent so `hand` (in `ik.end`'s own px: a hand part riding on the lower arm, T018; default
// the lower arm itself) reaches the target point (screen px) of `targetOf(L)`.
// Keeps the elbow on the side the pose bends it. Also plants a leg (T015 brace: `hand` = the sole point).
export function reach(rig, joints, swap, held, ik, targetOf) {
  const [up, lo] = ik.arm, end = ik.end ?? lo, j = { ...joints };
  const pts = (L) => [at(rig, L, up, rig.parts[up].pivot), at(rig, L, lo, rig.parts[lo].pivot), at(rig, L, end, ik.hand)];
  let L = layoutRig(rig, j, swap, held);
  const T = targetOf(L), [S, E, H] = pts(L), m = L.find((x) => x.name === up).m;
  const flip = Math.sign(m[0] * m[3] - m[1] * m[2]) || 1;   // a mirrored body (sx < 0) turns the other way
  const l1 = dist(S, E), l2 = dist(E, H), d = Math.max(Math.abs(l1 - l2) + 0.01, Math.min(l1 + l2 - 0.01, dist(S, T)));
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))) / D;
  const side = (E[0] - S[0]) * (H[1] - S[1]) - (E[1] - S[1]) * (H[0] - S[0]) > 0 ? -1 : 1;
  j[up] += flip * wrap(ang(S, T) + side * a - ang(S, E));
  L = layoutRig(rig, j, swap, held);
  const [, E2, H2] = pts(L);
  j[lo] += flip * wrap(ang(E2, T) - ang(E2, H2));
  return j;
}

// T020: the far fist closes round the shaft. Screen angles (degrees) of the held weapon's handle (grip -> gripEnd) and of
// the IK hand's own axis `G.align` (its px).
function axesOf(L, held, G) {
  const h = L.find((e) => e.name === G.ik.end).base, w = L.find((e) => e.name === held.slot).m, A = held.kit.art;
  return [ang([0, 0], lin(w, [A.gripEnd[0] - A.grip[0], A.gripEnd[1] - A.grip[1]])), ang([0, 0], lin(h, [Math.cos(G.align * D), Math.sin(G.align * D)])), h];
}
// Solved in one go: the fist's axis goes along the shaft (the smaller turn, or the other way round if the arm can't
// reach the wrist spot for that one: the ring holds either way); the arm is IK'd to put the wrist where the turned
// fist's ring sits on the target, then the fist turns about the wrist onto the shaft line.
function alignGrip(rig, joints, swap, held, G, target) {
  const end = G.ik.end, pivot = rig.parts[end].pivot, wrist = { ...G.ik, hand: pivot };
  let L = layoutRig(rig, joints, swap, held);
  const [shaft, axis] = axesOf(L, held, G), T = target(L), P = at(rig, L, end, pivot), R = at(rig, L, end, G.ik.hand);
  let d = wrap(shaft - axis);
  if (Math.abs(d) > 90) d = wrap(d + 180);
  const v = [R[0] - P[0], R[1] - P[1]], wristAt = (t) => [T[0] - (Math.cos(t * D) * v[0] - Math.sin(t * D) * v[1]), T[1] - (Math.sin(t * D) * v[0] + Math.cos(t * D) * v[1])];
  const S = at(rig, L, G.ik.arm[0], rig.parts[G.ik.arm[0]].pivot), E = at(rig, L, G.ik.arm[1], rig.parts[G.ik.arm[1]].pivot);
  const len = dist(S, E) + dist(E, P), out = (t) => dist(S, wristAt(t)) - len;
  if (out(d) > 0 && out(d + 180) < out(d)) d = wrap(d + 180);
  const goal = axis + d;   // the fist axis' screen angle when done
  let j = joints;
  for (let i = 0; i < 2; i++) j = reach(rig, j, swap, held, wrist, () => wristAt(d));
  const [, axis2, h] = axesOf(layoutRig(rig, j, swap, held), held, G);
  return { ...j, [end]: j[end] + Math.sign(h[0] * h[3] - h[1] * h[2]) * wrap(goal - axis2) };
}

// How far back (bow image px) full draw pulls the string: to the grip's `anchor` (T020: the ear; the anchor seen along
// the bow's forward axis), else the item's `pull`.
function pullOf(rig, G, A, L, bow) {
  if (!G.anchor) return A.pull;
  return Math.max(0, A.nock[0] - apply(inv(bow), ...at(rig, L, G.anchor.part, G.anchor.at))[0]);
}

// Layout entries (layoutRig's, plus { order, line: [points] } for a bow string), with the grip applied.
export function gripLayout(rig, joints, swap, held, f) {
  const G = held?.part && rig.grips?.[held.grip];
  if (!G) return layoutRig(rig, joints, swap, held);
  const sw = { ...swap, ...G.swap }, A = held.kit.art, k = A.nock ? drawOf(f) : 0;
  const weapon = (L) => L.find((x) => x.name === held.slot).m, weaponPt = (L, xy) => apply(weapon(L), ...xy);
  const to = (L) => (A.nock ? [A.nock[0] - pullOf(rig, G, A, L, weapon(L)) * k, A.nock[1]] : A[G.ik.to]);
  let j = joints;
  for (let i = 0; i < 2; i++) j = reach(rig, j, sw, held, G.ik, (L) => weaponPt(L, to(L)));   // 2nd pass mops up the error
  if (G.align != null) j = alignGrip(rig, j, sw, held, G, (L) => weaponPt(L, to(L)));
  // a bow hand only goes to the string as the draw starts (over the first `A.reachIn` of it); at rest it stays posed
  const w = A.nock ? Math.min(1, k / A.reachIn) : 1;
  if (w < 1) for (const n of G.ik.arm) j[n] = joints[n] + (j[n] - joints[n]) * w;
  const L = layoutRig(rig, j, sw, held).filter((e) => !G.hide?.includes(e.name))
    .map((e) => (G.order?.[e.name] != null ? { ...e, order: G.order[e.name] } : e));   // T020: e.g. the far fist over the shaft
  if (!A.tips || k <= 0) return L.sort((a, b) => a.order - b.order);
  const bow = L.find((x) => x.name === held.slot), N = weaponPt(L, to(L));
  const out = [...L, { name: 'string', order: G.string ?? bow.order + 0.1, line: [weaponPt(L, A.tips[0]), N, weaponPt(L, A.tips[1])] }];
  // arrow (T020: A012's points right): its nock on the string, nock -> tip along the bow's forward axis (the bow image's
  // +x), at its own size, mirrored with the body
  const S = f.move.shot.art, r = S.px / A.px, m = [bow.m[0] * r, bow.m[1] * r, bow.m[2] * r, bow.m[3] * r, 0, 0], [nx, ny] = apply(m, ...S.nock);
  m[4] = N[0] - nx; m[5] = N[1] - ny;
  out.push({ name: 'arrow', order: G.arrow ?? rig.parts[G.ik.arm[1]].order - 0.5, img: S.img, m });
  return out.sort((a, b) => a.order - b.order);
}
