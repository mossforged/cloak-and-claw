// Bracing loop while blocking (T015): a slow living layer over the rig's `block` pose (numbers: rig.brace,
// data/rigs/*-brace.js). Breath (chest stretch lifts the head and shoulders), shield lagging the breath, ready-grip
// sword twitch, and a hip sway with the boots kept planted by bending the legs (2-bone IK from rig-grip.js).
// Drawing only: reads the fighter, writes only render memory (mem.swayW, mem.braceT).
import { layoutRig } from './rig.js';
import { reach, at } from './rig-grip.js';

const easeOut = (t) => 1 - (1 - t) ** 3;
const clamp01 = (x) => Math.max(0, Math.min(1, x));

// 0..1: how much of the loop shows. 0 outside block and during blockstun; eases in over `fade` frames after either.
export function braceWeight(f, B) {
  if (f.state !== 'block' || !B) return 0;
  const since = f.t - (f.stun ?? 0);
  return since < 0 ? 0 : easeOut(clamp01(since / B.fade));
}

// Sole points (screen px, feet at 0,0) of each planted leg in this layout.
export const solesOf = (rig, joints, swap) => {
  const L = layoutRig(rig, joints, swap);
  return Object.values(rig.brace?.plant ?? {}).map(([lo, pt]) => at(rig, L, lo, pt));
};

// joints = the blended pose (rig-pose.js); returns them with the loop layered on. mem: per-fighter render memory.
export function braceLayer(rig, f, joints, time, mem = {}, swap = {}) {
  const B = rig.brace;
  if (!B) return joints;
  const dt = mem.braceT === undefined ? 0 : Math.max(0, time - mem.braceT) * 60;   // render frames since last call
  mem.braceT = time;
  const walking = Math.hypot(f.vx ?? 0, f.vy ?? 0) > 0.05 && !(f.t < f.stun);   // shuffle-walk: the sway rests
  mem.swayW = clamp01((mem.swayW ?? 1) + (walking ? -1 : 1) * dt / B.swayFade);
  const w = braceWeight(f, B);
  if (!(w > 0)) return joints;
  const wave = (period, phase = 0) => Math.sin(2 * Math.PI * (time / period + phase));
  const breath = wave(B.breath), late = wave(B.breath, -B.lag), o = { ...joints };
  o['torso.sy'] = joints['torso.sy'] * (1 + B.chest * w * (breath + 1) / 2);   // rise on the in-breath, settle on the out
  o.head = joints.head - B.head * w * breath;                                    // chin lifts a touch as he breathes in
  o['arm-far-upper'] = joints['arm-far-upper'] + B.arm * w * late;
  o.shield = joints.shield + B.shield * w * late;
  const sj = B.swordJoint ?? 'sword';   // T023: the part that twitches (the sword hand, so the handle stays in the fist)
  o[sj] = joints[sj] + B.sword * w * (0.6 * wave(B.twitch[0]) + 0.4 * wave(B.twitch[1], 0.3));
  const hips = B.hips * w * mem.swayW * wave(B.sway, 0.1);
  if (!hips) return o;
  o.dx = joints.dx + hips;
  const soles = solesOf(rig, joints, swap);
  let i = 0, j = o;
  for (const [up, [lo, pt]] of Object.entries(B.plant)) {
    const T = soles[i++];
    j = reach(rig, j, swap, null, { arm: [up, lo], hand: pt }, () => T);
  }
  return j;
}
