// Rat Raider rehearsal, Moving (T029): docs/design/rigs/rat-raider-rehearsal.md key by key, posed on the rig with the IK
// helper (rat-raider-kit.js P). Sim timings: moves/rat-rehearsal.js. Views: { torso, pelvis } codes (rat-raider-views.js;
// H hunched and LB leaning back are three-quarter chests with their own points). `aloft`: a key off the floor (no
// floor-line rule while it shows: render/rig.js). Cycle poses (run) are waves like the walk (biped-ik.js walkCycle).
import rig from './rat-raider.js';
import { walkCycle } from './biped-ik.js';
import { P, NEAR, FAR, FEET, CROUCH, HOLD, TAIL, FIST } from './rat-raider-kit.js';

const H = { torso: 'H' }, LB = { torso: 'LB' }, B = { torso: 'B', pelvis: 'B' };
const TOE = { near: 'foot-near-toe', far: 'foot-far-toe' };
// walk (rehearsal: heel-strike feet at contact, toe-off at push-off): rat-raider-poses.js walk
export const WALK_HEEL = { heelDraw: { near: 'foot-near-heel', far: 'foot-far-heel' } };

// Run (chase, flee): hunched chest, longer stride, both feet up between steps (stance 0.36), arms pumping, tail streaming
const RUN_LEGS = { speed: 2.6, walk: 230, lift: 14, dy: 7, bob: 3, gather: 0.3, stance: 0.36, heel: 16, strike: 12, toe: TOE, toeAt: [0.28, 0.42], ...WALK_HEEL };
const { swap: _r, ...RUN_ARMS } = P({ ...CROUCH, view: H, torso: 12, hand: { off: [4, 18], dir: -80 }, shield: { off: [14, 18], turn: -40 } });
const wave = (k, amp, ph, h = 2) => [RUN_ARMS[k], amp, ph, h];
export const RUN = {
  speed: RUN_LEGS.speed, ...walkCycle(rig, RUN_LEGS), view: H, swap: FIST,
  pelvis: 6, torso: [12, 2, 0, 2], head: [-14, 2, 0.1, 2],
  'arm-near-upper': [RUN_ARMS['arm-near-upper'], 14, 0.5], 'arm-near-lower': RUN_ARMS['arm-near-lower'], 'hand-near': RUN_ARMS['hand-near'],
  'arm-far-upper': [RUN_ARMS['arm-far-upper'], 22, 0], 'arm-far-lower': wave('arm-far-lower', 8, 0.1, 1), 'hand-far': RUN_ARMS['hand-far'],
  tail: [10, 8, 0.25, 2], 'tail-2': [20, 10, 0.4, 2], 'tail-3': [25, 12, 0.55, 2], 'scarf-tail': [30, 10, 0.4, 2],
};

export const MOVING = {
  // Menace idle fidget: draws himself up and shouts (shout head), free fist shaken up at the chest
  fidget: {
    windup: P({ ...CROUCH, swap: { ...FIST, head: 'head-shout' }, torso: 0, head: -12, hand: HOLD, shield: { off: [18, 4], turn: -70 }, ...TAIL(0, 15, 20) }),
    strike: P({ ...CROUCH, swap: { ...FIST, head: 'head-shout' }, dy: -1, torso: -4, head: -20, hand: { off: [2, 10], dir: -100 }, shield: { off: [20, -2], turn: -80 }, ...TAIL(10, 20, 20), 'scarf-tail': 10 }),
  },
  // Skid stop: leaning back, the trailing (near) boot turned out and braced, the lead boot sliding forward on its heel
  skidStop: {
    windup: P({ ...CROUCH, view: LB, swap: { ...FIST, 'foot-near': 'foot-near-out', head: 'head-effort' }, dy: 6, pelvis: -4, torso: -6, head: 2,
      hand: { off: [-8, 10], dir: -130 }, shield: { off: [22, 8], turn: -30 }, feet: { near: [NEAR - 12, 0, 0], far: [FAR + 22, 2, -6] }, ...TAIL(-30, -10, 0), 'scarf-tail': -30 }),
    strike: P({ ...CROUCH, view: LB, swap: { ...FIST, 'foot-near': 'foot-near-out', head: 'head-effort' }, dy: 9, pelvis: -2, torso: -4, head: 0,
      hand: { off: [-6, 12], dir: -120 }, shield: { off: [20, 12], turn: -30 }, feet: { near: [NEAR - 10, 0, 0], far: [FAR + 20, 0, 0] }, ...TAIL(-15, 0, 10), 'scarf-tail': -15 }),
  },
  // Jump: squat (hunched, far leg folded) -> rise (near knee up, far leg folded, arms up, effort head) -> apex (arms out)
  // -> fall (legs reaching down) -> land (squat) -> settle (the idle)
  jumpUp: {
    windup: P({ ...CROUCH, view: H, swap: { ...FIST, 'leg-far-upper': 'leg-far-folded' }, dy: 14, pelvis: 6, torso: 14, head: -14,
      feet: { near: FEET.near }, hand: { off: [-12, 16], dir: -60 }, shield: { off: [8, 20], turn: -10 }, ...TAIL(-20, 10, 15) }),
    through: [
      P({ ...CROUCH, aloft: true, swap: { ...FIST, head: 'head-effort', 'leg-near-upper': 'leg-near-kneeup', 'leg-far-upper': 'leg-far-folded' }, dy: -34,
        pelvis: -4, torso: -6, head: -10, 'leg-near-upper': -20, 'leg-far-upper': 6, hand: { off: [-6, -14], dir: -120 }, shield: { off: [12, -12], turn: -80 }, ...TAIL(20, 15, 10) }),
      P({ ...CROUCH, aloft: true, swap: { ...FIST, 'leg-near-upper': 'leg-near-kneeup', 'leg-far-upper': 'leg-far-folded' }, dy: -46,
        pelvis: 0, torso: 0, head: -6, 'leg-near-upper': -12, 'leg-far-upper': 12, hand: { off: [-16, 0], dir: -140 }, shield: { off: [24, 4], turn: -40 }, ...TAIL(25, 10, 5) }),
    ],
    strike: P({ ...CROUCH, aloft: true, swap: FIST, dy: -22, pelvis: 2, torso: 4, head: -6,
      feet: { near: [NEAR - 8, 16, 18], far: [FAR + 8, 20, 18] }, hand: { off: [-14, 4], dir: -130 }, shield: { off: [22, 2], turn: -40 }, ...TAIL(-10, 10, 20) }),
    recover: P({ ...CROUCH, view: H, swap: { ...FIST, 'leg-far-upper': 'leg-far-folded' }, dy: 15, pelvis: 6, torso: 16, head: -16,
      feet: { near: FEET.near }, hand: { off: [-12, 16], dir: -60 }, shield: { off: [10, 20], turn: -10 }, ...TAIL(-25, 10, 15) }),
  },
  // Dodge hop: a short hop back out of the lane: crouch (hunched, far leg folded) -> hop (knee up, far folded) -> land
  dodgeHop: {
    windup: P({ ...CROUCH, view: H, swap: { ...FIST, 'leg-far-upper': 'leg-far-folded' }, dy: 12, pelvis: 6, torso: 14, head: -14,
      feet: { near: FEET.near }, hand: { off: [-10, 14], dir: -70 }, shield: { off: [10, 18], turn: -20 }, ...TAIL(-20, 10, 15) }),
    strike: P({ ...CROUCH, view: H, aloft: true, swap: { ...FIST, head: 'head-effort', 'leg-near-upper': 'leg-near-kneeup', 'leg-far-upper': 'leg-far-folded' }, dy: -20,
      pelvis: -6, torso: 8, head: -10, 'leg-near-upper': -10, 'leg-far-upper': 16, hand: { off: [-8, 8], dir: -100 }, shield: { off: [16, 10], turn: -40 }, ...TAIL(25, 20, 10) }),
    recover: P({ ...CROUCH, view: H, swap: { ...FIST, 'leg-far-upper': 'leg-far-folded' }, dy: 12, pelvis: 6, torso: 14, head: -14,
      feet: { near: FEET.near }, hand: { off: [-10, 14], dir: -70 }, shield: { off: [10, 18], turn: -20 }, ...TAIL(-20, 10, 15) }),
  },
  // Dodge roll: out of the lane, rolling over his shoulder away from the camera: tuck (knee up, far leg folded) -> his
  // back to the camera mid-roll (back torso, head and pelvis; B draw order: the far arm in front with its cap) -> still
  // over -> up on the near knee. A tucked ball low to the floor (whole legs turned onto it), no screen-plane spin.
  dodgeRoll: {
    windup: P({ ...CROUCH, view: H, swap: { ...FIST, 'leg-near-upper': 'leg-near-kneeup', 'leg-far-upper': 'leg-far-folded' }, dy: 22, pelvis: 10, torso: 26, head: -6,
      hand: { off: [-4, 16], dir: -50 }, shield: { off: [12, 16], turn: -20 }, ...TAIL(-20, 10, 15) }),
    through: [
      P({ view: B, swap: { 'leg-near-upper': 'leg-near-kneeup', 'leg-far-upper': 'leg-far-folded' }, dy: 30, pelvis: 20, torso: 30, head: 14,
        hand: { off: [-4, 18], dir: -30 }, shield: { off: [10, 18], turn: -20 }, ...TAIL(20, 15, 10) }),
      P({ view: B, swap: { 'leg-near-upper': 'leg-near-kneeup', 'leg-far-upper': 'leg-far-folded' }, dy: 28, pelvis: 10, torso: 26, head: 10,
        hand: { off: [-6, 16], dir: -40 }, shield: { off: [12, 16], turn: -20 }, ...TAIL(25, 15, 10) }),
    ],
    strike: P({ ...CROUCH, swap: { head: 'head-effort', 'hand-far': 'hand-far-open', 'leg-near-upper': 'leg-near-kneeling' }, dy: 16, pelvis: 4, torso: 16, head: -12,
      hand: { off: [-14, 14], dir: -80 }, shield: { off: [12, 22], turn: 0 }, feet: { far: [FAR + 6, 0, 0] }, ...TAIL(-20, 10, 15) }),
  },
};
