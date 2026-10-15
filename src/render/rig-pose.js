// Rig poses: picks the pose for a fighter's state/move, evaluates waves and move phases,
// and eases from the last drawn pose into a new one. Pure (no DOM), so tests can run it.
// Channels: '<part>' angle, 'dx'/'dy' root offset, 'sx' whole-body width (-1 = mirrored, e.g. mid-spin), and per part '<part>.sx' / '<part>.sy'
// (stretch across/along the bone, 1 = as drawn, negative flips) and '<part>.order' (draw order).
// Part swaps: a pose's `swap: { <part>: '<swap name>' }` picks one of the part's `swaps` images.
// Swaps don't blend: they switch the moment the pose (or move phase) that names them starts.
import { phaseOf } from '../sim/fighter.js';
import { RULES } from '../data/rules.js';

const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOutBack = (t, s) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2;

// Every channel a pose may use, with its value when a pose leaves it out.
export function channelsOf(rig) {
  const out = { dx: 0, dy: 0, sx: 1 };   // sx: whole-body width (1 = as drawn, -1 = mirrored; through 0 reads as a turn)
  for (const [name, p] of Object.entries(rig.parts)) {
    out[name] = 0; out[`${name}.sx`] = 1; out[`${name}.sy`] = 1; out[`${name}.order`] = p.order;
  }
  return out;
}
export const jointsOfRig = (rig) => Object.keys(channelsOf(rig));

function evalPose(pose, stance, t) {
  const out = { ...stance };
  for (const [k, v] of Object.entries(pose ?? {})) {
    if (k === 'speed' || k === 'swap') continue;
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

const swapOf = (pose) => pose?.swap ?? {};

// Active-phase swaps: a `through` pose that names swaps shows them only while the swing is near it
// (timing.throughSwap, as a share of the way to the strike), e.g. one back-view drawing mid-spin.
function activeSwap(M, p, T) {
  if (!M.through?.swap) return swapOf(M.strike);
  const s = Math.min(1, p / T.strikeIn), [a, b] = T.throughSwap;
  return s >= a && s < b ? swapOf(M.through) : swapOf(M.strike);
}

// Which pose a fighter is in: { key, joints, swap } before blending.
// override: a named pose to hold whatever the fighter does (view-only, e.g. the `cast` test pose).
export function targetPose(f, rig, time, override) {
  const poses = rig.poses, S = { ...channelsOf(rig), ...poses.stance }, T = poses.timing;
  if (override && poses[override]) return { key: override, joints: evalPose(poses[override], S, time), swap: swapOf(poses[override]) };
  if (f.move) {
    const key = moveKey(f), M = poses.moves?.[key];
    if (M) {
      const [ph, p] = phaseOf(f);
      const W = evalPose(M.windup, S, 0), K = evalPose(M.strike, S, 0), X = M.through && evalPose(M.through, S, 0);
      const rest = evalPose(f.state === 'attack' ? poses.idle : poses.jump, S, time);
      if (ph === 'windup') return { key, joints: mix(rest, W, easeOut(p)), swap: swapOf(M.windup) };
      if (ph === 'active') return { key, joints: strikePose(M, W, X, K, p, T), swap: activeSwap(M, p, T) };
      // recovery keeps the strike's swaps until it is `swapBack` of the way back to rest
      return { key, joints: mix(K, rest, easeInOut(p)), swap: p < T.swapBack ? swapOf(M.strike) : {} };
    }
  }
  const named = (key, t = 0) => ({ key, joints: evalPose(poses[key], S, t), swap: swapOf(poses[key]) });
  switch (f.state) {
    case 'walk': return named('walk', f.t / 60);
    case 'jump': return named('jump');
    case 'block': return named('block');
    case 'hurt': return named('hurt');
    case 'knockdown': return named('knockdown');
    case 'down': case 'dead': return named('down');
    case 'getup': {
      const k = easeInOut(Math.min(1, f.t / RULES.knockdown.getupFrames));
      return { key: 'getup', joints: mix(evalPose(poses.down, S, 0), evalPose(poses.getup, S, 0), Math.min(1, k * 1.6)), swap: swapOf(poses.getup) };
    }
  }
  return named('idle', time);
}

// Final joints for this frame. mem is per-fighter render memory ({} to start); mem.swap holds
// this frame's part swaps (they switch at once, joints blend).
export function rigJoints(f, rig, time, mem, override) {
  const { key, joints, swap } = targetPose(f, rig, time, override);
  mem.swap = swap;
  if (mem.key !== key) { mem.from = mem.last ?? joints; mem.t0 = time; mem.key = key; }
  const k = Math.min(1, (time - mem.t0) / rig.poses.timing.blend);
  mem.last = k < 1 ? mix(mem.from, joints, easeOut(k)) : joints;
  return mem.last;
}
