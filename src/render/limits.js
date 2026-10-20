// Joint limits (T035), pure: a rig with `limits: { part: [lo, hi] }` (degrees from rest, + clockwise on screen; rat v3's
// are the user's Fitting Room ranges) never draws a joint outside them. `limitLayer` is the last joint layer of rigFrame
// (after the floor-line rule and the springs), so every key, blend and IK result is held inside; the pose page's drags
// clamp the same way (viewer/pose-drag.js). A rig without limits is returned untouched (the same object).
// T035 r2: `reachInLimits` = two-bone IK that only picks elbow / knee and shoulder / hip turns inside the limits (the
// retarget layer, the floor-line fix and drag-to-pose on rat v3), so a clamp never throws the hand or foot off its place.
import { LIMIT_SOLVE as K } from '../data/limit-solve.js';

const D = Math.PI / 180;
const wrap = (d) => ((((d + 180) % 360) + 360) % 360) - 180;
const gap = (a, b) => Math.abs(wrap(a - b));
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) / D;
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const angOf = (m) => Math.atan2(m[1], m[0]) / D;

// One angle into [lo, hi]: inside, its turn as is (wrapped to -180..180); outside, the nearer end round the circle.
export function clampTurn(v, [lo, hi]) {
  const a = wrap(v);
  if (a >= lo && a <= hi) return a;
  return gap(a, lo) <= gap(a, hi) ? lo : hi;
}

export function limitLayer(rig, joints) {
  if (!rig.limits) return joints;
  const out = { ...joints };
  for (const [part, range] of Object.entries(rig.limits)) if (part in out) out[part] = clampTurn(out[part], range);
  return out;
}

// The parts whose drawn turn sits outside its range by more than tol degrees: [{ part, turn, range }]
export function outside(rig, joints, tol = 0.5) {
  const out = [];
  for (const [part, [lo, hi]] of Object.entries(rig.limits ?? {})) {
    const a = wrap(joints[part] ?? 0);
    if (a < lo - tol || a > hi + tol) out.push({ part, turn: a, range: [lo, hi] });
  }
  return out;
}

// A limb [up, lo, end] as drawn on layout B (byName, unmirrored): shoulder / hip S, the two bone lengths, the bones' screen
// angles less their joints (c1, c2: bone 1 = c1 + up, bone 2 = c2 + up + lo), the bend on screen, the end's screen turn.
export const pivotOf = (rig, B, n) => apply(B[n].base, B[n].p?.pivot ?? rig.parts[n].pivot);
export function limbGeometry(rig, B, joints, [up, lo, end]) {
  const S = pivotOf(rig, B, up), E = pivotOf(rig, B, lo), W = pivotOf(rig, B, end), ju = joints[up] ?? 0, jl = joints[lo] ?? 0;
  return { S, W, ju, jl, l1: dist(S, E), l2: dist(E, W), c1: ang(S, E) - ju, c2: ang(E, W) - ju - jl, bend: wrap(ang(E, W) - ang(S, E)),
    endTurn: angOf(B[end].base) };
}

// The best { up, lo, err, bend } putting the limb's end point (wrist / ankle) on T with both joints inside their ranges
// (null = free): every elbow / knee turn in its range (K.step degrees, then K.fine round the best: data/limit-solve.js) with the shoulder / hip aimed at T
// and clamped. side (the bend's sign on screen to keep, 0 = either) wins over a closer reach on the other side when the
// limb is bent past K.bent degrees and that side lands within K.side px; between equals, the elbow / knee nearest its
// current turn (K.stay px per degree). end = { e0, lim }: the end joint (hand / foot) the
// wanted turn on screen needs at the limb's current turns (e0) and its range: a solve that would push it past its range
// costs K.tilt px per degree over (the ankle limit tips the foot, which lifts or sinks it), so the solve keeps it reachable.
export function reachInLimits(g, T, lim1, lim2, side = 0, end = null) {
  const toward = ang(g.S, T), d = dist(g.S, T);
  const at = (lo) => {
    const del = g.c2 - g.c1 + lo, ux = g.l1 + g.l2 * Math.cos(del * D), uy = g.l2 * Math.sin(del * D);
    let up = wrap(toward - Math.atan2(uy, ux) / D - g.c1);
    if (lim1) up = clampTurn(up, lim1);
    const t = (g.c1 + up) * D, W = [g.S[0] + Math.cos(t) * ux - Math.sin(t) * uy, g.S[1] + Math.sin(t) * ux + Math.cos(t) * uy];
    return { up, lo, err: dist(W, T), bend: wrap(del) };
  };
  const cos = Math.max(-1, Math.min(1, (d * d - g.l1 * g.l1 - g.l2 * g.l2) / (2 * g.l1 * g.l2))), del = Math.acos(cos) / D;
  const los = [del, -del].map((x) => wrap(x - g.c2 + g.c1)).map((lo) => (lim2 ? clampTurn(lo, lim2) : lo));
  if (lim2) for (let lo = lim2[0]; lo <= lim2[1]; lo += K.step) los.push(lo);
  const over = (r) => { if (!end?.lim) return 0; const e = wrap(end.e0 - wrap(r.up - g.ju) - wrap(r.lo - g.jl)); return Math.max(0, end.lim[0] - e, e - end.lim[1]); };
  const score = (r) => r.err + (side && Math.abs(r.bend) > K.bent && Math.sign(r.bend) !== side ? K.side : 0) + K.tilt * over(r) + K.stay * Math.abs(wrap(r.lo - g.jl));
  let best = null;
  for (const lo of los) { const r = at(lo); if (!best || score(r) < score(best)) best = r; }
  for (let lo = best.lo - K.step; lo <= best.lo + K.step; lo += K.fine) {
    if (lim2 && (lo < lim2[0] || lo > lim2[1])) continue;
    const r = at(lo);
    if (score(r) < score(best)) best = r;
  }
  return best;
}

// joints with limb [up, lo, end] solved onto T (screen px of layout B) inside the rig's limits, the end turned to `turn`
// on screen (default: as it is) and then held inside its own range. bend: the bend (screen degrees) whose side to keep when
// it is past K.bent (default: the limb's as drawn; nearly straight = either side).
// A foot's tilt counts in the solve (it decides where the sole lands); a hand's place wins over its turn.
const sideOf = (bend) => (Math.abs(bend) > K.bent ? Math.sign(bend) : 0);
export function limbInLimits(rig, B, joints, limb, T, turn, bend) {
  const [up, lo, end] = limb, g = limbGeometry(rig, B, joints, limb), L = rig.limits ?? {};
  const want = turn ?? g.endTurn, r = reachInLimits(g, T, L[up], L[lo], sideOf(bend ?? g.bend), /^foot-/.test(end) ? { e0: (joints[end] ?? 0) + wrap(want - g.endTurn), lim: L[end] } : null);
  const out = { ...joints, [up]: r.up, [lo]: r.lo };
  const moved = wrap(r.up - (joints[up] ?? 0)) + wrap(r.lo - (joints[lo] ?? 0));
  out[end] = (joints[end] ?? 0) + wrap(want - (g.endTurn + moved));
  if (L[end]) out[end] = clampTurn(out[end], L[end]);
  return { joints: out, err: r.err };
}
