// 2-bone IK on a rig (split out of rig-grip.js, T025): `at` (a part's own px on screen, whichever drawing shows) and
// `reach` (bend an arm or leg so a point on its end part lands on a target). Pure. rig-grip.js re-exports both.
import { layoutRig } from './rig-layout.js';
import { limbInLimits } from './limits.js';

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

// Joints with `upper`/`lower` bent so `hand` (in `ik.end`'s own px: a hand part riding on the lower arm, T018; default
// the lower arm itself) reaches the target point (screen px) of `targetOf(L)`.
// Keeps the elbow on the side the pose bends it. Also plants a leg (T015 brace: `hand` = the sole point).
export function reach(rig, joints, swap, held, ik, targetOf) {
  const [up, lo] = ik.arm, end = ik.end ?? lo, j = { ...joints };
  if (rig.limits?.[up] && rig.limits?.[lo] && end !== lo) return reachLimited(rig, joints, swap, held, ik, targetOf);
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

// T039: a rig with joint limits (rat v3: its two-hand second fist, its bow hand) reaches inside them (render/limits.js
// limbInLimits, as the retarget): solved unmirrored (the target taken across the body's sx), the end keeping its turn on
// screen, so the point on it lands where the wrist's place puts it, as near the target as the ranges let.
function reachLimited(rig, joints, swap, held, ik, targetOf) {
  const [up, lo] = ik.arm, end = ik.end, sx = joints.sx ?? 1, dx = joints.dx ?? 0, T = targetOf(layoutRig(rig, joints, swap, held));
  const ju = { ...joints, sx: 1 }, Lu = layoutRig(rig, ju, swap, held), B = Object.fromEntries(Lu.filter((e) => e.m && !e.line).map((e) => [e.name, e]));
  const P = at(rig, Lu, end, ik.hand ?? rig.parts[end].pivot), W = apply(B[end].base, ...(B[end].p?.pivot ?? rig.parts[end].pivot));
  const goal = [dx + (T[0] - dx) / (Math.abs(sx) < 1e-3 ? 1 : sx) - (P[0] - W[0]), T[1] - (P[1] - W[1])];
  const out = limbInLimits(rig, B, ju, [up, lo, end], goal).joints;
  if (joints.sx === undefined) delete out.sx; else out.sx = joints.sx;
  return out;
}
