// Rat Raider rig poses (T026, A018 + A019 on the standard part names). Same format as rigs/mouse-fighter-poses.js.
// All-zero joints = the A017 setup master: standing straight, arms hanging, fists closed. Every pose here is posed from
// it with the IK helper (rigs/biped-ik.js `pose`): the cutlass fist placed from the shoulder (`hand.off`) with the
// blade's screen direction (`dir`: 0 forward, -90 up, 90 down), the far fist from its shoulder (`shield`: A018's
// hand-far-shield slot, used as the far fist's reference point), ankles planted by leg IK (x, lift, tilt).
// The menace crouch (his A010 look: wide hunched stance, cutlass up behind) is CROUCH; poses spread it and
// change what they need. Whole-limb drawings (A019): cocked near arm for the telegraph, kneeling near leg for the
// get-up, folded far leg for squat / lying, knee-up near leg for the jump tuck, toe-off feet at the walk's push-off.
// Spearman and archer (rigs/rat-spearman.js, rat-archer.js) override the arms and add their kit moves.
import rig from './rat-raider.js';
import { pose, masterAt, walkCycle } from './biped-ik.js';

export const P = (spec) => pose(rig, spec);
export const NEAR = masterAt(rig, 'foot-near')[0], FAR = masterAt(rig, 'foot-far')[0];
// the menace crouch: hips 3 px down, trailing (near) boot back, leading (far) boot forward, leaning in (T026 r2: raised
// from 6 px down and 10 / -12 degrees: idle 134.4 px tall, A010 137.8, the master 138; was 129.9)
export const FEET = { near: [NEAR - 10, 0, 0], far: [FAR + 12, 0, 0] };
export const CROUCH = { dy: 3, pelvis: 4, torso: 5, head: -6, feet: FEET, tail: -10, 'tail-2': 15, 'tail-3': 20, 'scarf-tail': 0 };
const FIST = { 'hand-far': 'hand-far-fist' };
const HURT = { head: 'head-hurt', 'hand-far': 'hand-far-open' };
const FALL = { head: 'head-hurt', 'hand-far': 'hand-far-open', 'hand-near': 'hand-near-open' };
const TAIL = (a, b, c) => ({ tail: a, 'tail-2': b, 'tail-3': c });

// Walk (T024's 9-key pattern, floor-line rule): 2 strides/s at his sim walk (2 px/frame = 120 px/s), hips in the crouch
// (low at contact, high at passing), toe-off drawings (A019) at the push-off only.
export const WALK = { speed: 2.0, walk: 120, lift: 5, dy: 2, bob: 1.5, gather: 0.2, heel: 10, strike: 8,
  toe: { near: 'foot-near-toe', far: 'foot-far-toe' } };
// T026 r3 (user: the free hand "weirdly curled up"): far arm hangs forward and low like the standee / A010, elbow
// slightly bent, a loose fist in front of the belt (was off [23, 6], turn -40: an open claw curled at the chest)
const { swap: _s, ...STANCE } = P({ ...CROUCH, swap: FIST, hand: { off: [-10, 12], dir: -105 }, shield: { off: [20, 24], turn: -30 } });
const arm = (k, amp, ph) => [STANCE[k] ?? 0, amp, ph];

export default {
  timing: { blend: 0.09, strikeIn: 0.55, overshoot: 1.4, bodyLean: 0.3, swapBack: 0.5, throughSwap: [0, 0.75] },
  stance: STANCE,   // channels only (every pose starts from it); the loose far fist is idle's swap
  idle: {   // coiled: breathing through the shoulders, free fist swaying, tail swishing (feet stay planted)
    ...STANCE, speed: 0.6, swap: FIST,
    torso: [STANCE.torso, 1.6, 0], head: [STANCE.head, 2.4, 0.15],
    'arm-near-upper': arm('arm-near-upper', 2.5, 0.1), 'hand-near': arm('hand-near', 3, 0.2),
    'arm-far-upper': arm('arm-far-upper', 3, 0.1), 'hand-far': arm('hand-far', 6, 0.3),
    tail: [-10, 10, 0.3], 'tail-2': [15, 8, 0.45], 'tail-3': [20, 10, 0.6], 'scarf-tail': [0, 7, 0.55],
  },
  walk: {
    speed: WALK.speed, ...walkCycle(rig, WALK),
    swap: { 'hand-far': 'hand-far-fist' }, pelvis: 3, torso: [5, 1.5, 0, 2], head: [-6, 1.5, 0.1, 2],
    'arm-near-upper': arm('arm-near-upper', 6, 0.5), 'arm-near-lower': STANCE['arm-near-lower'], 'hand-near': STANCE['hand-near'],
    'arm-far-upper': [10, 14, 0], 'arm-far-lower': [-20, 6, 0.1], 'hand-far': -10,
    tail: [-12, 12, 0.25], 'tail-2': [15, 10, 0.4], 'tail-3': [20, 12, 0.55], 'scarf-tail': [8, 8, 0.4, 2],
  },
  jump: P({   // A019 tuck: near knee up, far leg folded (whole-leg drawings, hip angles as given: in the air)
    torso: -4, head: -6, swap: { 'leg-near-upper': 'leg-near-kneeup', 'leg-far-upper': 'leg-far-folded' },
    'leg-near-upper': -10, 'leg-far-upper': 10, hand: { off: [-12, -4], dir: -110 }, shield: { off: [18, 4], turn: -30 }, ...TAIL(20, 15, 10) }),
  jumpSquat: P({   // squat / land: far leg folded under him (turned onto its floor line), near boot planted
    dy: 14, pelvis: 6, torso: 20, head: -18, swap: { 'leg-far-upper': 'leg-far-folded' }, feet: { near: FEET.near },
    hand: { off: [-14, 16], dir: -60 }, shield: { off: [8, 20], turn: -10 }, ...TAIL(-20, 10, 15) }),
  hurt: P({   // snapped back by the hit: head and shoulders thrown back, cutlass arm flung out behind
    ...CROUCH, swap: HURT, dx: -3, torso: -14, head: -14,
    hand: { off: [-20, 6], dir: -170 }, shield: { off: [14, 18], turn: 20 },
    feet: { near: FEET.near, far: [FEET.far[0], 3, -15] }, ...TAIL(10, 20, 20), 'scarf-tail': 25 }),
  held: P({   // grabbed by the collar / flying when thrown: hurt face, legs kicking off the ground, arms flailing
    swap: FALL, torso: -6, head: -16,
    hand: { off: [-18, -6], dir: -150 }, shield: { off: [14, -10], turn: -60 },
    'leg-near-upper': -40, 'leg-near-lower': 40, 'leg-far-upper': 30, 'leg-far-lower': 25, 'foot-far': 20, ...TAIL(-30, -10, -10), 'scarf-tail': -30 }),
  knockdown: P({   // falling backwards (the standee tips the whole figure over): legs kicked up, arms flung out
    swap: FALL, torso: -14, head: -8,
    hand: { off: [-14, -16], dir: -150 }, shield: { off: [16, -14], turn: -70 },
    'leg-near-upper': -45, 'leg-near-lower': 25, 'leg-far-upper': 15, 'leg-far-lower': 15, ...TAIL(25, 10, 10), 'scarf-tail': 30 }),
  // Flat on his back (the standee turns the figure round the feet): one line, KO face, arms flopped, far knee up
  // (A019 folded far leg), near leg straight along the floor
  down: P({
    swap: { ...FALL, head: 'head-ko', 'leg-far-upper': 'leg-far-folded' }, dx: 6, torso: -10, head: 2,
    hand: { off: [-24, -2], dir: -100 }, shield: { off: [6, 26], turn: 20 },
    'leg-far-upper': -15, feet: { near: [NEAR - 2, 0, 0] }, ...TAIL(-30, 0, 0), 'scarf-tail': 20 }),
  getup: P({   // up on the near knee (A019 kneeling leg), far boot planted, pushing up into the crouch
    swap: { head: 'head-effort', 'hand-far': 'hand-far-open', 'leg-near-upper': 'leg-near-kneeling' },
    dy: 16, pelvis: 4, torso: 16, head: -12, hand: { off: [-14, 14], dir: -80 }, shield: { off: [12, 22], turn: 0 },
    feet: { far: [FAR + 6, 0, 0] }, ...TAIL(-20, 10, 15) }),
  // not a state: the arms-up check (stretch test, viewer): A019 raised near arm, cutlass hanging back over his head
  cast: P({ ...CROUCH, swap: { head: 'head-attack' }, wholeArm: { swap: 'arm-near-raised', dir: 135 },
    shield: { off: [19, 9], turn: -40 } }),
  moves: {
    ratSlash: {   // long telegraph: rears up with the cutlass wound back behind his head (A019 cocked arm), then a
      // lunging chop down in front, the trailing boot pushing off on its toe
      windup: P({ ...CROUCH, swap: { head: 'head-effort', 'hand-far': 'hand-far-fist' }, dx: -2, torso: -8, head: -4,
        wholeArm: { swap: 'arm-near-cocked', dir: -150 }, shield: { off: [16, 6], turn: -40 },
        feet: { near: FEET.near, far: [FEET.far[0] - 2, 2, 10] }, ...TAIL(10, 20, 20), 'scarf-tail': 15 }),
      strike: P({ ...CROUCH, swap: { head: 'head-attack', 'hand-far': 'hand-far-fist', 'foot-near': 'foot-near-toe' }, dx: 4, dy: 9,
        pelvis: 6, torso: 22, head: -20, hand: { off: [22, 14], dir: 50 }, shield: { off: [6, 20], turn: 10 },
        feet: { near: [FEET.near[0] - 6, 9.8, 0], far: [FEET.far[0] + 6, 0, 0] }, ...TAIL(-25, -10, 0), 'scarf-tail': -25 }),
    },
  },
};
