// Rat Raider rig poses (T026, A018 + A019 on the standard part names). Same format as rigs/mouse-fighter-poses.js.
// All-zero joints = the A017 setup master: standing straight, arms hanging, fists closed. Every pose here is posed from
// it with the IK helper (rigs/biped-ik.js `pose`): the cutlass fist placed from the shoulder (`hand.off`) with the
// blade's screen direction (`dir`: 0 forward, -90 up, 90 down; T028 r4: on the user's grip line the blade keeps its
// direction and the fist turns to it, ~87 deg from A023's estimate; a whole-arm drawing instead keeps its round 3
// screen angle, so the item leaves its fist where the user drew it: wholeArm dirs moved by the change of the arm's line,
// cocked -185.7, raised -194.8; turning those drawings 186 / 195 deg would stand the arm on its head), the far fist from its shoulder (`shield`: A018's
// hand-far-shield slot, used as the far fist's reference point), ankles planted by leg IK (x, lift, tilt).
// The menace crouch (his A010 look: wide hunched stance, cutlass up behind) is CROUCH; poses spread it and
// change what they need. Whole-limb drawings (A019): cocked near arm for the telegraph, kneeling near leg for the
// get-up, folded far leg for squat / lying, knee-up near leg for the jump tuck, toe-off feet at the walk's push-off.
// Spearman and archer (rigs/rat-spearman.js, rat-archer.js) override the arms and add their kit moves.
// T029: the helpers and the crouch / guard / stance live in rat-raider-kit.js (shared with the rehearsal move files
// rat-raider-moves.js and rat-raider-attacks.js); the numbers' history stays here.
import rig from './rat-raider.js';
import { walkCycle } from './biped-ik.js';
import { P, NEAR, FAR, FEET, CROUCH, HOLD, TAIL, FIST, STANCE } from './rat-raider-kit.js';
import { MOVING, RUN, WALK_HEEL } from './rat-raider-moves.js';
import { ATTACKS } from './rat-raider-attacks.js';
export { P, NEAR, FAR, FEET, CROUCH, HOLD };
// the menace crouch: hips 1 px down, trailing (near) boot back, leading (far) boot forward, leaning in (T026 r2: raised
// from 6 px down: idle 134.4 px tall, A010 137.8, the master 138; was 129.9). T026 r4 (the user's gaps): boots 4 px back
// / 10 px forward of the master (were 10 / 12) and 1 px down (was 3), pelvis 3 + torso 6 (was 4 + 5): the near thigh no
// longer swings back off the trouser apron (crotch gap) nor the far knee open the trouser leg's hem (pose seam test);
// idle 136.5 px tall (FEET, CROUCH: rat-raider-kit.js)
const HURT = { head: 'head-hurt', 'hand-far': 'hand-far-open' };
const FALL = { head: 'head-hurt', 'hand-far': 'hand-far-open', 'hand-near': 'hand-near-open' };

// Walk (T024's 9-key pattern, floor-line rule): 2 strides/s at his sim walk (2 px/frame = 120 px/s), hips in the crouch
// (low at contact, high at passing), toe-off drawings (A019) at the push-off only.
export const WALK = { speed: 2.0, walk: 120, lift: 5, dy: 2, bob: 1.5, gather: 0.2, heel: 10, strike: 8,
  toe: { near: 'foot-near-toe', far: 'foot-far-toe' } };
// T026 r3 (user: the free hand "weirdly curled up"): far arm hangs forward and low like the standee / A010, elbow
// slightly bent, a loose fist in front of the belt (was off [23, 6], turn -40: an open claw curled at the chest). r4: 4 px
// nearer and 2 px higher, turned -40 (was [20, 24], -30): the far wrist's seam stays shut on the new crouch
// T026 r4 (user: the cutlass arm "still awkward"): a guard like the standee / A010: fist in front of the chest, forearm
// about level from the elbow, blade upright and a little back, the hand in the forearm's line but for a fist's cock (was
// off [-10, 12]: fist behind the shoulder, forearm up and the hand bent ~50 degrees under the bracer). A fist behind the
// body (A010's spot) can't hold the blade up with A018's side-on grip without bending the wrist past 45 degrees.
// (HOLD, STANCE: rat-raider-kit.js)
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
  walk: {   // T029: heel-strike drawings at contact (rehearsal: toe-off at push-off, heel-strike at contact)
    speed: WALK.speed, ...walkCycle(rig, { ...WALK, ...WALK_HEEL }),
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
  cast: P({ ...CROUCH, swap: { head: 'head-attack' }, wholeArm: { swap: 'arm-near-raised', dir: -59.8 },
    shield: { off: [19, 9], turn: -40 } }),
  run: RUN,   // T029 rehearsal: the chase run (rat-raider-moves.js)
  moves: {
    ...MOVING, ...ATTACKS,   // T029: every rehearsal move (Moving, Attacking) the rat types don't use yet
    ratSlash: {   // T028 the turning slash (rehearsal Slash 1): wind-up turned away (BQ) with the cocked arm (A019) wholly
      // behind the body, rearing back on the effort head; the swing turns the chest toward the camera (F) and brings the
      // arm over in front of it: the `through` key (fist over the shoulder, blade up and forward) is the named key where
      // the depth switches (its swaps from `switchAt` of the swing: the first swing frame keeps the cocked drawing); then a lunging chop down in front on
      // the trailing toe; recover: F held through the follow-through (timing.swapBack), then back to three-quarter with
      // the arm under the vest. Until A023: the side torso stands in for F and BQ.
      switchAt: 0.1,
      // T028 r5 (lead: frame ~4 the arm vanished and the blade poked out by the tail): the cocked drawing swaps in at the
      // windup's start and turned 373 deg from idle's arm angle (-339) to its own (+34), sweeping the blade round past the
      // legs. Now -50 (fist above and behind the shoulder, blade up over the head) taken one turn down (-410), so the arm
      // turns 51 deg back from idle and then swings over the top into `through` (+174)
      windup: P({ ...CROUCH, view: { torso: 'BQ' }, swap: { head: 'head-effort', 'hand-far': 'hand-far-fist' }, dx: -4, torso: -12, head: 0,
        wholeArm: { swap: 'arm-near-cocked', dir: -410 }, shield: { off: [22, 10], turn: -50 },
        feet: { near: FEET.near, far: [FEET.far[0] - 2, 2, 10] }, ...TAIL(15, 20, 20), 'scarf-tail': 20 }),
      // T029 (rehearsal: the horizontal smear arm on the strike frame): a second through key, the cut itself, on the
      // smear arm (A023, carrying the cutlass on the user's line) between the over-the-shoulder key and the follow
      through: [P({ ...CROUCH, view: { torso: 'F' }, swap: { head: 'head-attack', 'hand-far': 'hand-far-fist' }, dx: 0, dy: 3,
        pelvis: 4, torso: 6, head: -10, hand: { off: [10, -30], dir: -45 }, shield: { off: [10, 16], turn: 0 },
        feet: { near: FEET.near, far: FEET.far }, ...TAIL(0, 10, 10), 'scarf-tail': 0 }),
      P({ ...CROUCH, view: { torso: 'F' }, swap: { head: 'head-attack', 'hand-far': 'hand-far-fist', 'foot-near': 'foot-near-toe' }, dx: 3, dy: 6,
        pelvis: 5, torso: 15, head: -16, wholeArm: { swap: 'arm-near-smear-h', dir: 100 }, shield: { off: [2, 18], turn: 10 },
        feet: { near: [FEET.near[0] - 4, 9.8, 0], far: [FEET.far[0] + 4, 0, 0] }, ...TAIL(-12, 0, 5), 'scarf-tail': -12 })],
      strike: P({ ...CROUCH, view: { torso: 'F' }, swap: { head: 'head-attack', 'hand-far': 'hand-far-fist', 'foot-near': 'foot-near-toe' }, dx: 5, dy: 9,
        pelvis: 6, torso: 24, head: -22, hand: { off: [26, 18], dir: 55 }, shield: { off: [-4, 18], turn: 20 },
        feet: { near: [FEET.near[0] - 6, 9.8, 0], far: [FEET.far[0] + 6, 0, 0] }, ...TAIL(-25, -10, 0), 'scarf-tail': -25 }),
      // T028 r2: recover through a low key (the blade dropped forward and down by the near hip, back in three-quarter
      // with the arm under the vest) so the guard rises in front of the body, not across the face
      recover: P({ ...CROUCH, swap: { 'hand-far': 'hand-far-fist' }, dx: 2, dy: 4, pelvis: 4, torso: 12, head: -10,
        hand: { off: [8, 30], dir: 20 }, shield: { off: [10, 22], turn: 0 }, ...TAIL(-15, 0, 10), 'scarf-tail': -10 }),
    },
  },
};
