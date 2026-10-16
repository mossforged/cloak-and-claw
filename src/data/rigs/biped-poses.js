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
  'arm-front-upper': 'torso', 'arm-front-lower': 'arm-front-upper', 'hand-front': 'arm-front-lower',
  'arm-back-upper': 'torso', 'arm-back-lower': 'arm-back-upper', 'hand-back': 'arm-back-lower',
  'leg-front-upper': 'pelvis', 'leg-front-lower': 'leg-front-upper', 'foot-front': 'leg-front-lower',
  'leg-back-upper': 'pelvis', 'leg-back-lower': 'leg-back-upper', 'foot-back': 'leg-back-lower',
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
    'arm-front-upper': [0, 2.5, 0.1], 'arm-back-upper': [0, 2.5, 0.1], 'hand-back': [0, 3, 0.2],
    tail: [0, 7, 0.3],
  },
  walk: {   // 1.5 strides a second; legs opposite, arms opposite their leg
    speed: 1.5,
    dy: [-1, 2, 0.75, 2], torso: [3, 1.5, 0, 2], head: [-2, 1.5, 0.1, 2], pelvis: [0, 2, 0],
    'leg-front-upper': [0, 26, 0], 'leg-front-lower': [12, 14, 0.8], 'foot-front': [0, 10, 0.75],
    'leg-back-upper': [0, 26, 0.5], 'leg-back-lower': [12, 14, 0.3], 'foot-back': [0, 10, 0.25],
    'arm-front-upper': [0, 14, 0.5], 'arm-back-upper': [0, 12, 0],
    tail: [4, 10, 0.25],
  },
  windup: {   // weapon arm drawn up and back, weight on the back foot
    swap: { head: ['head-effort'], 'hand-front': ['hand-front-grip'], 'hand-back': ['hand-back-fist'] },
    dx: -3, dy: 2, torso: -10, head: 4, pelvis: -4,
    'arm-front-upper': 120, 'arm-front-lower': -40, 'hand-front': -20,
    'arm-back-upper': -30, 'arm-back-lower': -30,
    'leg-front-upper': -8, 'leg-back-upper': 8, 'leg-back-lower': 10,
    tail: 12,
  },
  strike: {   // the blow: arm whipped forward and down, body thrown into it
    swap: { head: ['head-attack'], 'hand-front': ['hand-front-grip'], 'hand-back': ['hand-back-fist'] },
    dx: 6, dy: 3, torso: 14, head: -6, pelvis: 4,
    'arm-front-upper': -95, 'arm-front-lower': -15, 'hand-front': 10,
    'arm-back-upper': 35, 'arm-back-lower': -20,
    'leg-front-upper': -14, 'leg-front-lower': 10, 'leg-back-upper': 16,
    tail: -10,
  },
  follow: {   // follow-through: the swing carries on down past the target
    swap: { head: ['head-attack'], 'hand-front': ['hand-front-grip'] },
    dx: 7, dy: 4, torso: 18, head: -4, pelvis: 5,
    'arm-front-upper': -40, 'arm-front-lower': -5, 'hand-front': 20,
    'arm-back-upper': 40, 'arm-back-lower': -10,
    'leg-front-upper': -16, 'leg-front-lower': 12, 'leg-back-upper': 18,
    tail: -14,
  },
  hurt: {   // snapped back by a hit
    swap: { head: HEAD_HURT, 'hand-back': ['hand-back-open'] },
    dx: -5, torso: -14, head: -12, pelvis: -3,
    'arm-front-upper': 25, 'arm-front-lower': 20, 'arm-back-upper': -30, 'arm-back-lower': -20,
    'leg-front-upper': -6, tail: 18,
  },
  knockdown: {   // thrown off his feet, falling backwards
    swap: { head: HEAD_HURT, 'hand-back': ['hand-back-open'], 'hand-front': ['hand-front-open'] },
    air: true, body: -45, dx: 14, dy: -34, torso: -10, head: -14,
    'arm-front-upper': -60, 'arm-back-upper': -70,
    'leg-front-upper': -45, 'leg-front-lower': 30, 'leg-back-upper': -25, 'leg-back-lower': 20,
    tail: 25,
  },
  down: {   // flat on his back
    swap: { head: HEAD_KO, 'hand-back': ['hand-back-open'], 'hand-front': ['hand-front-open'] },
    body: -88, dx: 50, ground: true, torso: 12, head: 8,
    'arm-front-upper': -20, 'arm-back-upper': -30,
    'leg-front-upper': -2, 'leg-front-lower': 12, 'leg-back-upper': 6, 'leg-back-lower': 10,
    tail: -25,
  },
  getup: {   // up on one knee, pushing off
    swap: { head: ['head-effort'], 'hand-back': ['hand-back-open'] },
    body: -8, dx: -6, dy: 16, torso: 20, head: -10,
    'arm-front-upper': -20, 'arm-back-upper': 20, 'arm-back-lower': -30,
    'leg-front-upper': -60, 'leg-front-lower': 75, 'foot-front': -15,
    'leg-back-upper': 40, 'leg-back-lower': 50, 'foot-back': 30,
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
