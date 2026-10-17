// Rig poses: picks the pose for a fighter's state/move, evaluates waves and move phases,
// and eases from the last drawn pose into a new one. Pure (no DOM), so tests can run it.
// Channels: '<part>' angle, 'dx'/'dy' root offset, 'sx' whole-body width (-1 = mirrored, e.g. mid-spin), and per part '<part>.sx' / '<part>.sy'
// (stretch across/along the bone, 1 = as drawn, negative flips) and '<part>.order' (draw order). T024: '<foot>.lift' = px the
// foot's drawing stands off its floor line (0 = planted; render/floor.js re-solves the leg to it in grounded states).
// A value: a number, a wave [base, amp, phase 0..1, harmonic], or (T023) a list of waves that add up.
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
    if (name.startsWith('foot-')) out[`${name}.lift`] = 0;
  }
  return out;
}
export const jointsOfRig = (rig) => Object.keys(channelsOf(rig));

function evalPose(pose, stance, t) {
  const out = { ...stance };
  for (const [k, v] of Object.entries(pose ?? {})) {
    if (k === 'speed' || k === 'swap' || k === 'swapPhase') continue;
    const wave = (w) => w[0] + w[1] * Math.sin(2 * Math.PI * ((pose.speed ?? 1) * t * (w[3] ?? 1) + (w[2] ?? 0)));
    // T023: a list of waves adds up (harmonics fitted to an IK leg path)
    out[k] = !Array.isArray(v) ? v : Array.isArray(v[0]) ? v.reduce((a, w) => a + wave(w), 0) : wave(v);
  }
  return out;
}

// Both sides always carry every channel (evalPose starts from the full stance), so keys match.
const mix = (a, b, t) => {
  const o = {};
  for (const k in a) o[k] = lerp(a[k], b[k], t);
  return o;
};

const moveKey = (f) => f.moveKey ?? Object.keys(f.def.moves).find((k) => f.def.moves[k] === f.move);

function strikePose(M, W, X, K, p, T) {
  const s = Math.min(1, p / T.strikeIn);
  if (!M.through) return mix(W, K, easeOutBack(s, T.overshoot));
  return s < 0.5 ? mix(W, X, s * 2) : mix(X, K, easeOutBack(s * 2 - 1, T.overshoot));
}

const swapOf = (pose) => pose?.swap ?? {};
// T024: a cycle's drawings by phase (the walk's toe-off feet): swapPhase [{ part, swap, from, to }] in 0..1 of the cycle.
function phaseSwaps(pose, t) {
  const out = { ...swapOf(pose) }, u = ((((pose.speed ?? 1) * t) % 1) + 1) % 1;
  for (const { part, swap, from, to } of pose.swapPhase ?? []) if (from < to ? u >= from && u < to : u >= from || u < to) out[part] = swap;
  return out;
}

// Grab and throw (T009): `grabbing` hold, `knee` strike (from def.grab.knee frames), `throw` wind (`throwWindBack`
// for a back throw: the body narrows and mirrors, he turns as the rat goes over) then `throwRelease`, easing to idle.
function grabPose(f, poses, S, time) {
  const P = (k) => evalPose(poses[k], S, 0), g = f.grab;
  if (f.state === 'grabbing') {
    const K = f.def.grab.knee, n = g?.knee ?? -1;
    if (n < 0) return { key: 'grabbing', joints: P('grabbing'), swap: swapOf(poses.grabbing) };
    const j = n < K.windup ? mix(P('grabbing'), P('knee'), easeOut(n / K.windup))
      : mix(P('knee'), P('grabbing'), easeInOut(Math.max(0, (n - K.windup - K.active) / K.recovery)));
    return { key: 'knee', joints: j, swap: n < K.windup + K.active + K.recovery / 2 ? swapOf(poses.knee) : {} };
  }
  const T = f.def.throw, wind = g?.back ? 'throwWindBack' : 'throwWind';
  if (f.t < T.wind) return { key: wind, joints: mix(P('grabbing'), P(wind), easeOut(f.t / T.wind)), swap: swapOf(poses[wind]) };
  const k = (f.t - T.wind) / T.recovery;
  return { key: 'throwRelease', joints: mix(P('throwRelease'), evalPose(poses.idle, S, time), easeInOut(Math.max(0, k * 1.4 - 0.4))),
    swap: k < 0.5 ? swapOf(poses.throwRelease) : {} };
}

// Weapon toss (T010): `toss` over def.toss.wind frames, then `tossRelease` easing back to idle over the recovery.
function tossPose(f, poses, S, time, T = f.def.toss) {
  const P = (k) => evalPose(poses[k], S, 0);
  if (f.t < T.wind) return { key: 'toss', joints: mix(evalPose(poses.idle, S, time), P('toss'), easeOut(f.t / T.wind)), swap: swapOf(poses.toss) };
  const k = (f.t - T.wind) / T.recovery;
  return { key: 'tossRelease', joints: mix(P('tossRelease'), evalPose(poses.idle, S, time), easeInOut(Math.max(0, k * 1.4 - 0.4))),
    swap: k < 0.5 ? swapOf(poses.tossRelease) : {} };
}

// Weapon pickup (T010 round 2): idle -> `stow` -> `reach` (crouched at the weapon) -> idle, on def.pickup frames.
function pickupPose(f, poses, S, time) {
  const P = (k) => evalPose(poses[k], S, 0), T = f.def.pickup, idle = evalPose(poses.idle, S, time);
  if (f.t < T.stow) return { key: 'stow', joints: mix(idle, P('stow'), easeOut(f.t / T.stow)), swap: {} };
  if (f.t < T.stow + T.reach) return { key: 'reach', joints: mix(P('stow'), P('reach'), easeInOut((f.t - T.stow) / T.reach)), swap: {} };
  return { key: 'rise', joints: mix(P('reach'), idle, easeInOut(Math.min(1, (f.t - T.stow - T.reach) / T.rise))), swap: {} };
}

// Sword draw (T010 round 2): an arm-only layer over whatever pose he is in, after a floor weapon leaves his hand
// (thrown or broken). The arm sweeps to the `stow` arm (sword still sheathed: mem.sheathed) and back up with the sword.
// Starts when drawRig sets mem.drawT0. Returns the layered joints (mem.last is left unlayered for blending).
const ARM = ['arm-near-upper', 'arm-near-lower', 'hand-near', 'sword'];   // T023: + the hand (A013 rigs turn the sword with it)
export function drawLayer(rig, time, mem, joints) {
  const dur = rig.poses.timing.drawSword, k = mem.drawT0 === undefined ? 1 : (time - mem.drawT0) / dur;
  mem.sheathed = k < 0.5;
  if (k >= 1 || !rig.poses.stow) return joints;
  const w = k < 0.5 ? easeOut(k * 2) : 1 - easeInOut((k - 0.5) * 2), out = { ...joints };
  for (const j of ARM) if (j in joints) out[j] = lerp(joints[j], rig.poses.stow[j] ?? joints[j], w);
  return out;
}

// Jump squat (T014): joints pulled toward the rig's `jumpSquat` crouch by k (0..1, render/jump-squat.js). Like drawLayer,
// a layer over the blended pose (mem.last stays unlayered).
export function squatLayer(rig, joints, k) {
  if (!(k > 0) || !rig.poses.jumpSquat) return joints;
  return mix(joints, evalPose(rig.poses.jumpSquat, { ...channelsOf(rig), ...rig.poses.stance }, 0), k);
}

// Active-phase swaps: a `through` pose that names swaps shows them only while the swing is near it
// (timing.throughSwap, as a share of the way to the strike), e.g. one back-view drawing mid-spin.
function activeSwap(M, p, T) {
  if (!M.through?.swap) return swapOf(M.strike);
  const s = Math.min(1, p / T.strikeIn), [a, b] = T.throughSwap;
  return s >= a && s < b ? swapOf(M.through) : swapOf(M.strike);
}

// Weapon feel (T017): a rig's `kits[<item id>]` gives a held floor weapon its own look: `moves` (its own move poses,
// used before the borrowed `move.rig` one) and state poses (`idle`, `walk`) laid over the normal ones. View only.
const kitPoses = (f, poses) => poses.kits?.[f.weapon?.def.id];
const withKit = (poses, KP) => (KP ? Object.fromEntries(Object.entries(poses).map(([k, v]) => [k, KP[k] ? { ...v, ...KP[k] } : v])) : poses);

function windupPose(M, rest, W, p, time) {
  const h = M.hold ?? 0, j = mix(rest, W, easeOut(Math.min(1, p / (1 - h))));
  if (h && p > 1 - h && M.tremble) j['arm-near-upper'] += M.tremble * Math.sin(time * 70);
  return j;
}

// Which pose a fighter is in: { key, joints, swap } before blending.
// override: a named pose to hold whatever the fighter does (view-only, e.g. the `cast` test pose).
export function targetPose(f, rig, time, override) {
  const KP = kitPoses(f, rig.poses), poses = withKit(rig.poses, KP), S = { ...channelsOf(rig), ...poses.stance }, T = poses.timing;
  if (override && poses[override]) return { key: override, joints: evalPose(poses[override], S, time), swap: swapOf(poses[override]) };
  if (f.move) {
    const key = moveKey(f), M = KP?.moves?.[key] ?? poses.moves?.[f.move.rig ?? key];   // move.rig: a weapon kit's move borrows that rig move pose
    if (M) {
      const [ph, p] = phaseOf(f);
      const W = evalPose(M.windup, S, 0), K = evalPose(M.strike, S, 0), X = M.through && evalPose(M.through, S, 0);
      const rest = evalPose(f.state === 'attack' ? poses.idle : poses.jump, S, time);
      // M.hold: share of the windup held at the top (the club's heavy beat), with a strain tremble of M.tremble degrees on the arm
      if (ph === 'windup') return { key, joints: windupPose(M, rest, W, p, time), swap: swapOf(M.windup) };
      if (ph === 'active') return { key, joints: strikePose(M, W, X, K, p, T), swap: activeSwap(M, p, T) };
      // recovery keeps the strike's swaps until it is `swapBack` of the way back to rest
      return { key, joints: mix(K, rest, easeInOut(p)), swap: p < T.swapBack ? swapOf(M.strike) : {} };
    }
  }
  const named = (key, t = 0) => ({ key, joints: evalPose(poses[key], S, t), swap: phaseSwaps(poses[key], t) });
  switch (f.state) {
    case 'walk': return named('walk', f.t / 60);
    case 'jump': return named('jump');
    case 'block': {   // blockstun: shoved into `blockHit` at the hit, easing back to `block` (one key: no blend restart)
      if (!poses.blockHit || !(f.t < f.stun)) return named('block');
      const k = easeOut(1 - f.t / f.stun);
      return { key: 'block', joints: mix(evalPose(poses.block, S, 0), evalPose(poses.blockHit, S, 0), k), swap: swapOf(poses.block) };
    }
    case 'grabbing': case 'throw': if (poses.grabbing) return grabPose(f, poses, S, time); break;
    case 'toss': if (poses.toss) return tossPose(f, poses, S, time); break;
    case 'pickup': if (poses.stow) return pickupPose(f, poses, S, time); break;
    case 'grabbed': case 'thrown': if (poses.held) return named('held'); break;   // T011: a rig with a `held` pose (rats)
    case 'hurt': return named('hurt');
    case 'knockdown': return named('knockdown');
    case 'downed': if (poses.downed) return named('downed'); return named('down');   // T024: a rig with a `downed` pose kneels
    case 'down': case 'dead': return named('down');
    case 'revive': if (poses.revive || poses.reach) return named(poses.revive ? 'revive' : 'reach'); break;   // T022: hand down to his friend (T024: kneeling)
    case 'potionToss': if (poses.toss) return tossPose(f, poses, S, time, RULES.potions); break;
    case 'drink': if (poses.cast) return named('cast'); break;
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
