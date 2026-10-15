// Jump squat (T014 A/B test, render side): how crouched (0..1) a fighter looks around a jump. Drawing only.
// A: crouching in the sim's `jumpStart` state; A and B: legs extend from the crouch over JUICE.jumpSquat.rise frames after
// take-off; A and B: a landing squash (A's added in T011). Mode 'off' (or a def with no jumpSquatMode) = always 0, the old look.
import { JUICE } from '../data/juice.js';

const memory = new WeakMap();   // per fighter: last state seen and when he last landed from a jump (render time, s)
const easeOut = (t) => 1 - (1 - t) ** 3;

export function squatOf(f, time) {
  const mode = f.def.jumpSquatMode ?? 'off', J = JUICE.jumpSquat;
  let m = memory.get(f);
  if (!m) memory.set(f, (m = { state: f.state, land: -Infinity }));
  if (m.state === 'jump' && (f.state === 'idle' || f.state === 'walk')) m.land = time;
  m.state = f.state;
  if (mode === 'off') return 0;
  if (f.state === 'jumpStart') return easeOut(Math.min(1, (f.t + 1) / f.def.move.jumpSquat));
  if (f.state === 'jump') return f.t < J.rise && !f.move ? (1 - f.t / J.rise) ** 2 : 0;
  const k = (time - m.land) * 60 / J.land;
  return k >= 0 && k < 1 && !f.move ? J.landDepth * (1 - k) ** 2 : 0;
}

// Standee squash at crouch k: wider and shorter.
export function squashOf(k) {
  const J = JUICE.jumpSquat;
  return { sx: 1 + (J.squashX - 1) * k, sy: 1 + (J.squashY - 1) * k };
}
