// Impact (T041), pure: a move with an `impact` entry on its rig (data/impact.js) overshoots its strike pose for one frame
// at the hit frame and stretches the striking limb along its bones ('<part>.len' channels: render/rig-layout.js) for one
// or two frames, then settles on the strike pose. Called by render/rig-pose.js in the active phase; no entry = untouched.
import { impactOf } from '../data/impact.js';

// frames into the active phase the strike pose is first reached (timing.strikeIn of the active phase)
export const hitFrame = (move, T) => Math.ceil(T.strikeIn * move.active - 1e-9);

// the frame's stretch for a limb part (1 = none): { part: len } on the hit frame and the frames after it
export function stretchAt(I, n, h) {
  if (!I || n < h || n >= h + I.frames) return null;
  const k = 1 + Math.min(0.08, I.stretch) * (1 - (n - h) / I.frames);
  return Object.fromEntries(I.limb.map((p) => [p, k]));
}

// Is frame mf of the move an impact frame (overshoot or stretch)? Tools and tests that measure seams skip these.
export function impactFrame(rig, key, move, T, mf) {
  const I = impactOf(rig, key), n = mf - move.windup;
  return !!I && n >= hitFrame(move, T) && n < hitFrame(move, T) + Math.max(1, I.frames);
}

// joints j of the active phase with the impact laid on: K = the strike pose, prev = the key before it (windup or the last
// through key), n = frames into the active phase
export function impactLayer(rig, key, move, T, j, K, prev, n) {
  const I = impactOf(rig, key);
  if (!I) return j;
  const h = hitFrame(move, T), out = { ...j };
  if (n === h) for (const c in K) if (typeof K[c] === 'number' && !/\.order$|^sx$/.test(c)) out[c] = K[c] + I.over * (K[c] - prev[c]);
  for (const [p, k] of Object.entries(stretchAt(I, n, h) ?? {})) out[`${p}.len`] = k;
  return out;
}
