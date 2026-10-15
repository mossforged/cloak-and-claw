// Rig poses: picks the pose for a fighter's state/move, evaluates waves and move phases,
// and eases from the last drawn pose into a new one. Pure (no DOM), so tests can run it.
import { phaseOf } from '../sim/fighter.js';
import { RULES } from '../data/rules.js';

const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOutBack = (t, s) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2;

// Joint names a pose may use: every rig part plus the root offsets.
export const jointsOfRig = (rig) => [...Object.keys(rig.parts), 'dx', 'dy'];

function evalPose(pose, stance, t) {
  const out = { dx: 0, dy: 0, ...stance };
  for (const [k, v] of Object.entries(pose ?? {})) {
    if (k === 'speed') continue;
    out[k] = Array.isArray(v) ? v[0] + v[1] * Math.sin(2 * Math.PI * ((pose.speed ?? 1) * t * (v[3] ?? 1) + (v[2] ?? 0))) : v;
  }
  return out;
}

const mix = (a, b, t) => {
  const o = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) o[k] = lerp(a[k] ?? 0, b[k] ?? 0, t);
  return o;
};

const moveKey = (f) => Object.keys(f.def.moves).find((k) => f.def.moves[k] === f.move);

// Which pose a fighter is in: { key, joints } before blending.
export function targetPose(f, poses, time) {
  const S = poses.stance, T = poses.timing;
  if (f.move) {
    const key = moveKey(f), M = poses.moves?.[key];
    if (M) {
      const [ph, p] = phaseOf(f);
      const W = evalPose(M.windup, S, 0), K = evalPose(M.strike, S, 0);
      const rest = evalPose(f.state === 'attack' ? poses.idle : poses.jump, S, time);
      if (ph === 'windup') return { key, joints: mix(rest, W, easeOut(p)) };
      if (ph === 'active') return { key, joints: mix(W, K, easeOutBack(Math.min(1, p / T.strikeIn), T.overshoot)) };
      return { key, joints: mix(K, rest, easeInOut(p)) };
    }
  }
  switch (f.state) {
    case 'walk': return { key: 'walk', joints: evalPose(poses.walk, S, f.t / 60) };
    case 'jump': return { key: 'jump', joints: evalPose(poses.jump, S, 0) };
    case 'hurt': return { key: 'hurt', joints: evalPose(poses.hurt, S, 0) };
    case 'knockdown': return { key: 'knockdown', joints: evalPose(poses.knockdown, S, 0) };
    case 'down': case 'dead': return { key: 'down', joints: evalPose(poses.down, S, 0) };
    case 'getup': {
      const k = easeInOut(Math.min(1, f.t / RULES.knockdown.getupFrames));
      return { key: 'getup', joints: mix(evalPose(poses.down, S, 0), evalPose(poses.getup, S, 0), Math.min(1, k * 1.6)) };
    }
  }
  return { key: 'idle', joints: evalPose(poses.idle, S, time) };
}

// Final joints for this frame. mem is per-fighter render memory ({} to start).
export function rigJoints(f, poses, time, mem) {
  const { key, joints } = targetPose(f, poses, time);
  if (mem.key !== key) { mem.from = mem.last ?? joints; mem.t0 = time; mem.key = key; }
  const k = Math.min(1, (time - mem.t0) / poses.timing.blend);
  mem.last = k < 1 ? mix(mem.from, joints, easeOut(k)) : joints;
  return mem.last;
}
