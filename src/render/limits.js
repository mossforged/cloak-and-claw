// Joint limits (T035), pure: a rig with `limits: { part: [lo, hi] }` (degrees from rest, + clockwise on screen; rat v3's
// are the user's Fitting Room ranges) never draws a joint outside them. `limitLayer` is the last joint layer of rigFrame
// (after the floor-line rule and the springs), so every key, blend and IK result is held inside; the pose page's drags
// clamp the same way (viewer/pose-drag.js). A rig without limits is returned untouched (the same object).
const wrap = (d) => ((((d + 180) % 360) + 360) % 360) - 180;
const gap = (a, b) => Math.abs(wrap(a - b));

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
