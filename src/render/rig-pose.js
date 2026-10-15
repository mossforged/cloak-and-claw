// Rig poses: picks the pose for a fighter's state/move, evaluates waves and move phases,
// and eases from the last drawn pose into a new one. Pure (no DOM), so tests can run it.
// Channels: '<part>' angle, 'dx'/'dy' root offset, and per part '<part>.sx' / '<part>.sy'
// (stretch across/along the bone, 1 = as drawn, negative flips) and '<part>.order' (draw order).
import { phaseOf } from '../sim/fighter.js';
import { RULES } from '../data/rules.js';

const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOutBack = (t, s) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2;

// Every channel a pose may use, with its value when a pose leaves it out.
export function channelsOf(rig) {
  const out = { dx: 0, dy: 0 };
  for (const [name, p] of Object.entries(rig.parts)) {
    out[name] = 0; out[`${name}.sx`] = 1; out[`${name}.sy`] = 1; out[`${name}.order`] = p.order;
  }
  return out;
}
export const jointsOfRig = (rig) => Object.keys(channelsOf(rig));

function evalPose(pose, stance, t) {
  const out = { ...stance };
  for (const [k, v] of Object.entries(pose ?? {})) {
    if (k === 'speed') continue;
    out[k] = Array.isArray(v) ? v[0] + v[1] * Math.sin(2 * Math.PI * ((pose.speed ?? 1) * t * (v[3] ?? 1) + (v[2] ?? 0))) : v;
  }
  return out;
}

// Both sides always carry every channel (evalPose starts from the full stance), so keys match.
const mix = (a, b, t) => {
  const o = {};
  for (const k in a) o[k] = lerp(a[k], b[k], t);
  return o;
};

const moveKey = (f) => Object.keys(f.def.moves).find((k) => f.def.moves[k] === f.move);

function strikePose(M, W, X, K, p, T) {
  const s = Math.min(1, p / T.strikeIn);
  if (!M.through) return mix(W, K, easeOutBack(s, T.overshoot));
  return s < 0.5 ? mix(W, X, s * 2) : mix(X, K, easeOutBack(s * 2 - 1, T.overshoot));
}

// Which pose a fighter is in: { key, joints } before blending.
export function targetPose(f, rig, time) {
  const poses = rig.poses, S = { ...channelsOf(rig), ...poses.stance }, T = poses.timing;
  if (f.move) {
    const key = moveKey(f), M = poses.moves?.[key];
    if (M) {
      const [ph, p] = phaseOf(f);
      const W = evalPose(M.windup, S, 0), K = evalPose(M.strike, S, 0), X = M.through && evalPose(M.through, S, 0);
      const rest = evalPose(f.state === 'attack' ? poses.idle : poses.jump, S, time);
      if (ph === 'windup') return { key, joints: mix(rest, W, easeOut(p)) };
      if (ph === 'active') return { key, joints: strikePose(M, W, X, K, p, T) };
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
export function rigJoints(f, rig, time, mem) {
  const { key, joints } = targetPose(f, rig, time);
  if (mem.key !== key) { mem.from = mem.last ?? joints; mem.t0 = time; mem.key = key; }
  const k = Math.min(1, (time - mem.t0) / rig.poses.timing.blend);
  mem.last = k < 1 ? mix(mem.from, joints, easeOut(k)) : joints;
  return mem.last;
}
