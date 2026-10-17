// Mouse Fighter rig poses (T023, A013 on the standard part names). Same format as rigs/rat-raider-poses.js: joint angles
// in degrees added to the master pose, dx/dy root offsets in screen px (dx = forward), waves [base, amp, phase, harmonic].
// All-zero joints = the A013 master = his standee stance (sword cocked up behind his head, shield out front, near foot
// trailing). Still poses are written with the IK helper (rigs/biped-ik.js `pose`): the sword fist placed from the
// shoulder (`off`) with the blade's screen direction (`dir`: 0 forward, -90 up, 90 down; a swing turns from one pose's
// dir to the next's the way the numbers run), the shield fist from its shoulder, and the ankles (x, lift, tilt) planted
// by leg IK; the moves came from the old A002 poses (fist and blade where they were), then got real footwork (T023).
// The sword is rigid in the fist ('sword' stays 0; its direction is the hand's): the handle always runs through the slot.
// Footwork: planted poses and strikes stand on the turned-out near boot (`foot-near-out`); walking and jumping on the
// forward one. Attacks: windup sits back on the trailing (near) leg and lightens the leading (far) foot; the strike
// steps the leading foot in while the trailing boot stays flat and turned out where it was on the floor, a braced lunge
// (user T023 round 2: never toes-up behind him). The sim's lunge carries the body: in the rig's frame that boot slides
// back by the lunge; recovery settles to the stance.
// swap: { part: swap name } switches a part's drawing for that pose or move phase (rigs/mouse-fighter.js `swaps`).
import rig from './mouse-fighter.js';
import { walkCycle } from './biped-ik.js';
import { KIT_POSES } from './mouse-fighter-kit-poses.js';
import { ACTION_POSES } from './mouse-fighter-action-poses.js';
import { NEAR, FAR, OUT, PLANT, P } from './mouse-fighter-feet.js';

const ATTACK = { head: 'head-attack' };
// walkCycle options (T024; walk = his sim walk px/s): 2.6 strides/s, a 31 px planted sweep (= body travel; measured slide 1.8 / 1.0 px, T023: 3.7)
export const WALK = { speed: 2.6, walk: 162, lift: 5, dy: 4, bob: 2, gather: 0.25, stride: 31, heel: 12, strike: 8,
  toe: { near: 'foot-near-toe', far: 'foot-far-toe' } };

export default {
  timing: {
    blend: 0.09,        // s to ease from the last drawn pose into a new pose
    strikeIn: 0.55,     // fraction of the active phase spent swinging into `strike`
    overshoot: 1.6,     // easeOutBack strength on the strike (0 = none)
    bodyLean: 0.3,      // share of the move's standee lean (move.pose.rot) the rig keeps; joints do the rest
    swapBack: 0.5,      // fraction of a move's recovery that keeps the strike's swaps (shout face) before the normal drawings return
    castHold: 1,        // s the C test pose (`cast`) plays before he drops back to normal
    throughSwap: [0, 0.75],      // a `through` pose's swaps show while the swing is this share of the way to the strike
    drawSword: 0.36,    // s: after a floor weapon is thrown or breaks, his hand goes to the hip (`stow` arm) and draws the sword back up
  },
  stance: { tail: 0, 'scarf-tail': 0, 'scarf-tail-2': -22 },   // the master (scarf tail dropped to stream under the fist, as on the standee)
  idle: {   // the standee stance breathing: chest and head bob, sword arm and shield shift a touch, tail swishing (feet planted)
    speed: 0.45, swap: OUT,
    torso: [0, 1.5, 0], head: [0, 2.5, 0.15],
    'arm-near-upper': [0, 3, 0.1], 'hand-near': [0, 2, 0.2], 'arm-far-upper': [0, 3, 0.1], 'hand-far': [0, 1.5, 0.3],
    tail: [0, 9, 0.3], 'scarf-tail': [0, 4, 0.55], 'scarf-tail-2': [-22, 6, 0.75],
  },
  // Walk (T024 rebuild, study 2026-10-17's 9-key pattern; replaces T023's narrowed hips): the wide 3/4 hips stay as drawn,
  // each boot pinned to its floor line through the planted half at walk speed (render/floor.js holds it there), hips low at
  // each contact and high at each passing, heel rising then A016's toe-off drawing pushing off, toes up reaching for the
  // next contact. Stride centres gathered a quarter of the way in so the near boot steps past the far one. Forward near
  // boot. Sword carried up and ready, swinging a little in step.
  walk: {
    speed: WALK.speed,
    ...walkCycle(rig, WALK),
    torso: [0, 1.5, 0, 2], head: [0, 1.5, 0.1, 2],
    'arm-near-upper': [4, 9, 0.5], 'arm-near-lower': [0, 6, 0.6], 'arm-far-upper': [0, 7, 0], 'hand-far': [0, 3, 0.1],
    tail: [5, 12, 0.25], 'scarf-tail': [-4, 4, 0.4, 2], 'scarf-tail-2': [-18, 8, 0.6, 2],
  },
  // T024 jump tuck (A016): near knee up, far leg folded under (whole-leg drawings, hip angles as given: in the air)
  jump: P({ torso: -8, head: -4, hand: { off: [22, -8], dir: -104 }, shield: { off: [16.7, -4.2] },
    swap: { 'leg-near-upper': 'leg-near-kneeup', 'leg-far-upper': 'leg-far-folded' }, 'leg-near-upper': -10, 'leg-far-upper': 10,
    'leg-near-upper.order': 535, tail: 25, 'scarf-tail': 5 }),
  jumpSquat: P({   // T014: crouch before take-off and on landing (render/jump-squat.js); boots flat, arms swung down and back
    'arm-near-upper.order': 805, 'arm-near-lower.order': 806,   // the arm over the tunic (A013 rests it under the torso)
    torso: 18, head: -6, dy: 12, hand: { off: [-13.1, 23.2], dir: 32 }, shield: { off: [-1.8, 24] },
    swap: { 'leg-far-upper': 'leg-far-folded' },   // T024 (A016): the far leg folded under him, turned onto its floor line
    feet: { near: PLANT.near }, tail: -15, 'scarf-tail': -7 }),
  block: P({   // shield thrust out at chest height, face to the camera, his head peering over the rim (the old A002 block's
    // look, user T023 round 2: the whole guard arm turned it edge-on behind his body); effort head; sword cocked high,
    // ready to answer; crouched on planted boots (turned-out near boot). Both arms over the tunic.
    'arm-near-upper.order': 805, 'arm-near-lower.order': 806,
    'arm-far-upper.order': 808, 'arm-far-lower.order': 809, 'hand-far.order': 811, 'shield.order': 812,
    swap: { head: 'head-effort', ...OUT },
    torso: 14, head: -2, dy: 8, hand: { off: [-0.6, 13.2], dir: -92 }, shield: { off: [14, 0], turn: -8 },
    feet: PLANT, tail: -20, 'scarf-tail': -9 }),
  blockHit: P({   // on a blocked hit (blockstun): the shield is shoved further out at the attacker and eases back
    'arm-near-upper.order': 805, 'arm-near-lower.order': 806,
    'arm-far-upper.order': 808, 'arm-far-lower.order': 809, 'hand-far.order': 811, 'shield.order': 812,
    swap: { head: 'head-effort', ...OUT },
    torso: 19, head: 0, dy: 9, 'shield.sx': 1.14, 'shield.sy': 1.14, hand: { off: [-1.8, 13.1], dir: -87 },
    shield: { off: [18, 1], turn: -4 },
    feet: PLANT, tail: -25, 'scarf-tail': -10 }),
  hurt: P({   // snapped back: head thrown back wincing, sword arm flung down, open far hand, weight on the heels
    'arm-near-upper.order': 805, 'arm-near-lower.order': 806,   // the arm over the tunic (A013 rests it under the torso)
    swap: { head: 'head-hurt', 'hand-far': 'hand-far-open' },
    torso: -20, head: -18, dx: -3, hand: { off: [-10.9, 26], dir: 44 }, shield: { off: [-5, 24], turn: -15 },
    feet: { near: [NEAR + 2, 0, 0], far: [FAR, 4, -20] }, tail: -20, 'scarf-tail': -9 }),
  knockdown: P({   // flung back (the standee tips the figure over): arms out, legs kicked up
    swap: { head: 'head-hurt', 'hand-far': 'hand-far-open' },
    torso: -24, head: -21, hand: { off: [26, -2], dir: -60 }, shield: { off: [12.5, -18], turn: -30 },
    feet: { near: [-16, 14, -20], far: [30, 20, -30] }, tail: -30, 'scarf-tail': -14 }),
  // Flat on his back (the standee turns the figure round the feet): straightened into one line, KO face, arms flopped
  down: P({
    torso: -4, head: 12, hand: { off: [1.6, 27], dir: 75 }, shield: { off: [-10, 22], turn: 20 },
    swap: { head: 'head-ko', 'hand-far': 'hand-far-open', 'hand-near': 'hand-near-open', 'leg-far-upper': 'leg-far-folded' },   // T024: far knee up (A016)
    'leg-far-upper': -20, feet: { near: [-12, 0, 0] }, tail: 30, 'scarf-tail': 5 }),
  getup: P({   // up on the near knee (A016 kneeling leg), far boot planted, pushing up into the stance
    'arm-near-upper.order': 805, 'arm-near-lower.order': 806,   // the arm over the tunic (A013 rests it under the torso)
    swap: { head: 'head-effort', 'leg-near-upper': 'leg-near-kneeling' },
    torso: 16, head: -6, dy: 17, hand: { off: [-1.1, 24], dir: -5 }, shield: { off: [9.8, 11.3] },
    feet: { far: [FAR + 2, 0, 0] } }),
  // T024 downed (needs a friend): slumped on the near knee, KO face, sword arm hanging, shield sagging
  downed: P({
    'arm-near-upper.order': 805, 'arm-near-lower.order': 806,
    swap: { head: 'head-ko', 'leg-near-upper': 'leg-near-kneeling', 'hand-far': 'hand-far-open' },
    torso: 26, head: 18, dy: 20, hand: { off: [8, 26], dir: 12 }, shield: { off: [4, 24], turn: 25 },   // blade resting on the floor
    feet: { far: [FAR + 2, 0, 0] }, tail: -10, 'scarf-tail': -8 }),
  // T024 revive hold: kneeling beside his friend, hand down to him
  revive: P({
    'arm-near-upper.order': 805, 'arm-near-lower.order': 806,
    swap: { head: 'head-effort', 'leg-near-upper': 'leg-near-kneeling' },
    torso: 24, head: -14, dy: 18, hand: { off: [14, 24], dir: 10 }, shield: { off: [12, 6], turn: 2 },
    feet: { far: [FAR + 2, 0, 0] }, tail: -10, 'scarf-tail': -7 }),
  // Not a move: the flexibility test (sword thrust straight up for a spell). C plays it once from idle, in play or the lab.
  cast: P({   // A013 whole raised arm, fist above his head carrying the sword, blade straight up (raised arm's slot axis);
    // attack head, planted on the turned-out boot
    swap: { head: 'head-attack', 'arm-near-upper': 'arm-near-raised', ...OUT },
    torso: -6, head: -10, dy: 1, 'arm-near-upper': 6, 'arm-near-upper.order': 820, 'sword.order': 815,   // handle behind the fingers
    shield: { off: [11.3, 17.6], turn: -4 },
    feet: PLANT, tail: 15, 'scarf-tail': 5 }),
  ...ACTION_POSES,   // grab/throw, toss, stow/reach (rigs/mouse-fighter-action-poses.js)
  kits: KIT_POSES,   // T017 weapon feel: per floor weapon idle/walk/move poses (rigs/mouse-fighter-kit-poses.js)
  moves: {
    slash1: {   // overhead chop: sits back with the blade up behind, then steps in and chops forward-down
      windup: P({ swap: OUT, torso: -12, head: -2, dy: 3, hand: { off: [-20.4, -16.1], dir: -120 }, shield: { off: [11.7, -8.7] },
        feet: { near: [NEAR, 0, 0], far: [FAR - 3, 3, 12] }, 'scarf-tail': 4 }),
      strike: P({ swap: { ...ATTACK, ...OUT }, torso: 4, head: 8, dx: 2, dy: 6, pelvis: 4, hand: { off: [24.8, 11.8], dir: 30 }, shield: { off: [-4.5, 26.5] },
        'arm-near-upper.order': 805, 'arm-near-lower.order': 806,   // the arm crosses in front of the tunic
        feet: { near: [NEAR - 5, 0, 0], far: [FAR + 6, 0, 0] }, 'scarf-tail': -7, tail: -15 }),
    },
    slash2: {   // spin slash: twists away (body narrowed = turning), faces the other way for the first two active frames
      // (mirrored, back torso and back of the head, blade trailing), then comes round with the blade flat out (side torso).
      // Feet pivot with the body: heels turn in the windup, then the leading foot steps round into the cut.
      windup: P({ sx: 0.65, torso: -2, head: 2, dy: 4, hand: { off: [-15.5, 13.1], dir: 156 }, shield: { off: [7.7, -5.6] },
        'sword.sx': 0.75, 'arm-near-upper.order': 805, 'arm-near-lower.order': 806, feet: { near: [NEAR + 4, 0, 0], far: [FAR - 6, 2, 10] }, tail: 15, 'scarf-tail': 5 }),
      through: P({ swap: { torso: 'torso-back', head: 'head-back' }, sx: -1, torso: -4, head: 0, dy: 3,
        hand: { off: [24.7, 0], dir: 180 }, shield: { off: [-12, 6] }, 'sword.sx': 0.55,
        feet: { near: [NEAR + 8, 0, 0], far: [FAR - 8, 0, 0] }, tail: 30, 'scarf-tail': 5 }),
      strike: P({ swap: { ...ATTACK, torso: 'torso-side', ...OUT }, torso: 6, head: 6, dx: 2, dy: 6, hand: { off: [27.6, -0.9], dir: 0 },
        shield: { off: [-0.5, 24.2] }, 'arm-near-upper.order': 805, 'arm-near-lower.order': 806,
        feet: { near: [NEAR - 5, 0, 0], far: [FAR + 6, 0, 0] }, 'scarf-tail': -6, tail: -12 }),
    },
    slash3: {   // big wind-back (turned side-on, effort face, deep on the back leg), full swing over the top with a long
      // stride in: knocks down
      windup: P({ swap: { torso: 'torso-side', head: 'head-effort', ...OUT }, torso: -16, head: -4, dx: -3, dy: 6,
        wholeArm: { swap: 'arm-near-cocked', dir: -150 }, shield: { off: [13.1, -19.1] },   // T024: A016 cocked arm, fist by the ear
        'arm-near-upper.order': 650, 'sword.order': 645,   // the arm comes out of the side torso's sleeve, blade behind it
        feet: { near: [NEAR - 2, 0, 0], far: [FAR - 6, 5, 18] }, 'scarf-tail': 5, tail: 20 }),
      strike: P({ swap: { ...ATTACK, ...OUT }, torso: 14, head: 10, dx: 4, dy: 11, pelvis: 6, hand: { off: [19.3, 19.6], dir: 60 }, shield: { off: [-24, 26] },
        'arm-near-upper.order': 805, 'arm-near-lower.order': 806,
        feet: { near: [NEAR - 6, 0, 0], far: [FAR + 14, 0, 0] }, 'scarf-tail': -12, tail: -30 }),
    },
    jumpSlash: {   // airborne: blade from straight up, down through the front; legs tuck in the windup, kick out on the cut
      windup: P({ torso: -14, head: 0, hand: { off: [-19.3, -18.5], dir: -90 }, shield: { off: [9.6, -14] },
        feet: { near: [-22, 18, 10], far: [12, 20, 20] }, tail: 25, 'scarf-tail': 5 }),
      strike: P({ swap: ATTACK, torso: 14, head: 10, hand: { off: [-2.3, 27.5], dir: 120 }, shield: { off: [6.3, 16.5] },
        'arm-near-upper.order': 805, 'arm-near-lower.order': 806,
        feet: { near: [-34, 8, 20], far: [32, 6, 10] }, 'scarf-tail': 5 }),
    },
  },
};
