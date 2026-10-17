// Standard biped motion strip (T016, rig standard sections 3 and 8): the poses every rigged biped is judged on (G3)
// in the rig bench (tools/rig-bench.html), using only the standard's part names.
// Angles are degrees ADDED TO THE MASTER POSE (0 everywhere = the master drawing), + = clockwise
// (facing right: torso/head lean forward, hanging limbs swing back). dx/dy: root offset in screen px at game size.
// body: whole-figure turn (degrees) round the feet (falls; dx/dy then move the turned figure on screen); ground: lift the figure so its lowest
//   point sits on the floor (lying poses).
// A value can be a wave [base, amp, phase 0..1, harmonic]: base + amp*sin(2pi(speed*t*harmonic + phase)).
// swap: { part: [swap names] }: the first swap the character has is used (missing ones are skipped).
// A rig that lacks a standard part (Mouse Fighter has no pelvis, hands or feet) skips its angle: the turn still
// carries to its children, so a leg on a pelvis-less rig keeps the angle it would have had.

// Standard part -> its parent in the standard skeleton (rig standard section 3).
export const BIPED_PARENTS = {
  pelvis: null, torso: 'pelvis', head: 'torso',
  'arm-near-upper': 'torso', 'arm-near-lower': 'arm-near-upper', 'hand-near': 'arm-near-lower',
  'arm-far-upper': 'torso', 'arm-far-lower': 'arm-far-upper', 'hand-far': 'arm-far-lower',
  'leg-near-upper': 'pelvis', 'leg-near-lower': 'leg-near-upper', 'foot-near': 'leg-near-lower',
  'leg-far-upper': 'pelvis', 'leg-far-lower': 'leg-far-upper', 'foot-far': 'leg-far-lower',
  tail: 'pelvis',
};
export const BIPED_PARTS = Object.keys(BIPED_PARENTS);
export const POSE_CHANNELS = ['dx', 'dy', 'body', 'speed', 'swap', 'ground', 'air'];

const HEAD_HURT = ['head-hurt'], HEAD_KO = ['head-ko', 'head-hurt'];

export const BIPED_POSES = {
  stance: {},
  breath: {
    speed: 0.5,
    torso: [0, 1.2, 0], head: [0, 1.6, 0.15], dy: [0, 0.8, 0.25],
    'arm-near-upper': [0, 2.5, 0.1], 'arm-far-upper': [0, 2.5, 0.1], 'hand-far': [0, 3, 0.2],
    tail: [0, 7, 0.3],
  },
  walk: {   // 1.5 strides a second; legs opposite, arms opposite their leg
    speed: 1.5,
    dy: [-1, 2, 0.75, 2], torso: [3, 1.5, 0, 2], head: [-2, 1.5, 0.1, 2], pelvis: [0, 2, 0],
    'leg-near-upper': [0, 26, 0], 'leg-near-lower': [12, 14, 0.8], 'foot-near': [0, 10, 0.75],
    'leg-far-upper': [0, 26, 0.5], 'leg-far-lower': [12, 14, 0.3], 'foot-far': [0, 10, 0.25],
    'arm-near-upper': [0, 14, 0.5], 'arm-far-upper': [0, 12, 0],
    tail: [4, 10, 0.25],
  },
  windup: {   // weapon arm drawn up and back, weight on the back foot
    swap: { head: ['head-effort'], 'hand-near': ['hand-near-grip'], 'hand-far': ['hand-far-fist'] },
    dx: -3, dy: 2, torso: -10, head: 4, pelvis: -4,
    'arm-near-upper': 120, 'arm-near-lower': -40, 'hand-near': -20,
    'arm-far-upper': -30, 'arm-far-lower': -30,
    'leg-near-upper': -8, 'leg-far-upper': 8, 'leg-far-lower': 10,
    tail: 12,
  },
  strike: {   // the blow: arm whipped forward and down, body thrown into it
    swap: { head: ['head-attack'], 'hand-near': ['hand-near-grip'], 'hand-far': ['hand-far-fist'] },
    dx: 6, dy: 3, torso: 14, head: -6, pelvis: 4,
    'arm-near-upper': -95, 'arm-near-lower': -15, 'hand-near': 10,
    'arm-far-upper': 35, 'arm-far-lower': -20,
    'leg-near-upper': -14, 'leg-near-lower': 10, 'leg-far-upper': 16,
    tail: -10,
  },
  follow: {   // follow-through: the swing carries on down past the target
    swap: { head: ['head-attack'], 'hand-near': ['hand-near-grip'] },
    dx: 7, dy: 4, torso: 18, head: -4, pelvis: 5,
    'arm-near-upper': -40, 'arm-near-lower': -5, 'hand-near': 20,
    'arm-far-upper': 40, 'arm-far-lower': -10,
    'leg-near-upper': -16, 'leg-near-lower': 12, 'leg-far-upper': 18,
    tail: -14,
  },
  hurt: {   // snapped back by a hit
    swap: { head: HEAD_HURT, 'hand-far': ['hand-far-open'] },
    dx: -5, torso: -14, head: -12, pelvis: -3,
    'arm-near-upper': 25, 'arm-near-lower': 20, 'arm-far-upper': -30, 'arm-far-lower': -20,
    'leg-near-upper': -6, tail: 18,
  },
  knockdown: {   // thrown off his feet, falling backwards
    swap: { head: HEAD_HURT, 'hand-far': ['hand-far-open'], 'hand-near': ['hand-near-open'] },
    air: true, body: -45, dx: 14, dy: -34, torso: -10, head: -14,
    'arm-near-upper': -60, 'arm-far-upper': -70,
    'leg-near-upper': -45, 'leg-near-lower': 30, 'leg-far-upper': -25, 'leg-far-lower': 20,
    tail: 25,
  },
  down: {   // flat on his back
    swap: { head: HEAD_KO, 'hand-far': ['hand-far-open'], 'hand-near': ['hand-near-open'] },
    body: -88, dx: 50, ground: true, torso: 12, head: 8,
    'arm-near-upper': -20, 'arm-far-upper': -30,
    'leg-near-upper': -2, 'leg-near-lower': 12, 'leg-far-upper': 6, 'leg-far-lower': 10,
    tail: -25,
  },
  getup: {   // up on one knee, pushing off
    swap: { head: ['head-effort'], 'hand-far': ['hand-far-open'] },
    body: -8, dx: -6, dy: 16, torso: 20, head: -10,
    'arm-near-upper': -20, 'arm-far-upper': 20, 'arm-far-lower': -30,
    'leg-near-upper': -60, 'leg-near-lower': 75, 'foot-near': -15,
    'leg-far-upper': 40, 'leg-far-lower': 50, 'foot-far': 30,
  },
};

// The strip, in order: blend into `pose` over `in` s (ease: out, inOut or back = overshoot), then hold `hold` s.
// `label` names the frame in the exported strip (taken when the pose is fully reached; walk adds four steps).
export const BIPED_STRIP = [
  { pose: 'stance', in: 0.25, hold: 0.5, ease: 'inOut', label: 'stance' },
  { pose: 'breath', in: 0.2, hold: 2, ease: 'inOut', label: 'idle breath' },
  { pose: 'walk', in: 0.15, hold: 1.4, ease: 'inOut', label: 'walk', frames: [0, 0.25, 0.5, 0.75] },
  { pose: 'stance', in: 0.15, hold: 0.2, ease: 'inOut' },
  { pose: 'windup', in: 0.3, hold: 0.12, ease: 'out', label: 'windup' },
  { pose: 'strike', in: 0.08, hold: 0.06, ease: 'back', label: 'strike' },
  { pose: 'follow', in: 0.12, hold: 0.15, ease: 'out', label: 'follow-through' },
  { pose: 'stance', in: 0.3, hold: 0.3, ease: 'inOut' },
  { pose: 'hurt', in: 0.06, hold: 0.25, ease: 'out', label: 'hurt' },
  { pose: 'stance', in: 0.25, hold: 0.3, ease: 'inOut' },
  { pose: 'knockdown', in: 0.2, hold: 0.1, ease: 'out', label: 'knockdown' },
  { pose: 'down', in: 0.22, hold: 0.7, ease: 'out', label: 'down' },
  { pose: 'getup', in: 0.3, hold: 0.25, ease: 'inOut', label: 'get-up' },
  { pose: 'stance', in: 0.3, hold: 0.4, ease: 'inOut' },
];

export const BIPED = { parents: BIPED_PARENTS, parts: BIPED_PARTS, poses: BIPED_POSES, strip: BIPED_STRIP };
export default BIPED;
