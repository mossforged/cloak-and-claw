// Weapon grips on a rig (T011): a held kit whose grip type has an entry in `rig.grips` (two-hand spear, bow) swaps in
// its hand drawings (T018: the far `hand-back` grip or pinch) and bends one arm with 2-bone IK so its hand lands on a point of the weapon art: `grip2`
// on a spear shaft, or the bow's `nock` pulled back by how far the bow is drawn (the hand reaches it as the draw starts). A bow also gets its drawn string (two
// lines from the tips to the hand) and, while drawing, the shot's arrow nocked on it. Drawing only; pure (tests use it).
import { layoutRig } from './rig.js';
import { phaseOf } from '../sim/fighter.js';

const D = Math.PI / 180;
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) / D;
const wrap = (d) => ((d + 540) % 360) - 180;
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

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

// Layout entries (layoutRig's, plus { order, line: [points] } for a bow string), with the grip applied.
export function gripLayout(rig, joints, swap, held, f) {
  const G = held?.part && rig.grips?.[held.grip];
  if (!G) return layoutRig(rig, joints, swap, held);
  const sw = { ...swap, ...G.swap }, A = held.kit.art, k = A.nock ? drawOf(f) : 0;
  const weaponPt = (L, xy) => apply(L.find((x) => x.name === held.slot).m, ...xy);
  const to = A.nock ? [A.nock[0] - A.pull * k, A.nock[1]] : A[G.ik.to];
  let j = joints;
  for (let i = 0; i < 2; i++) j = reach(rig, j, sw, held, G.ik, (L) => weaponPt(L, to));   // 2nd pass mops up the error
  // a bow hand only goes to the string as the draw starts (over the first `A.reachIn` of it); at rest it stays posed
  const w = A.nock ? Math.min(1, k / A.reachIn) : 1;
  if (w < 1) for (const n of G.ik.arm) j[n] = joints[n] + (j[n] - joints[n]) * w;
  const L = layoutRig(rig, j, sw, held).filter((e) => !G.hide?.includes(e.name));
  if (!A.tips || k <= 0) return L;
  const bow = L.find((x) => x.name === held.slot), N = weaponPt(L, to);
  const out = [...L, { name: 'string', order: G.string ?? bow.order + 0.1, line: [weaponPt(L, A.tips[0]), N, weaponPt(L, A.tips[1])] }];
  const S = f.move.shot.art, th = Math.atan2(bow.m[1], bow.m[0]), c = Math.cos(th), s = Math.sin(th), px = S.px;
  // arrow: its nock (art.nock, on the point-up image) on the string, pointing along the bow's forward axis
  const m = [-s * px, c * px, -c * px, -s * px, 0, 0], [nx, ny] = apply(m, ...S.nock);
  m[4] = N[0] - nx; m[5] = N[1] - ny;
  out.push({ name: 'arrow', order: G.arrow ?? rig.parts[G.ik.arm[1]].order - 0.5, img: S.img, m });
  return out.sort((a, b) => a.order - b.order);
}
