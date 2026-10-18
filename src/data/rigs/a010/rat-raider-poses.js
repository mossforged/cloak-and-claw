// Rat Raider rig poses (T018, A010 on the standard part names). Same format as rigs/mouse-fighter-poses.js.
// All-zero joints = the A010 master: his fighting crouch (wide hunched stance, cutlass cocked up behind, far claw out).
// Angles are degrees added to the master, + = clockwise (facing right: torso/head lean forward, hanging limbs swing back).
// The cutlass is rigid in the near grip hand, so its direction on screen (0 = forward, -90 = up) =
// -75 + pelvis + torso + arm-near-upper + arm-near-lower + hand-near (the slot's rest, rigs/rat-raider.js).
// Hands: the near hand grips the weapon (its default drawing); the far hand is open (default) idle/hurt, a fist walking
// and striking. Spearman and archer (rigs/rat-spearman.js, rat-archer.js) override the arms and add their kit moves.
import rig from './rat-raider.js';
import { liftWaves } from '../biped-ik.js';

const HURT = { head: 'head-hurt', 'hand-far': 'hand-far-open' };
const FALL = { head: 'head-hurt', 'hand-far': 'hand-far-open', 'hand-near': 'hand-near-open' };

const WALK = { speed: 2.0, swap: { 'hand-far': 'hand-far-fist' }, dy: -2, torso: [-18, 1.5, 0, 2], head: [13, 1.5, 0.1, 2],
    'leg-near-upper': [-7.9, 26.8, 0.744], 'leg-near-lower': [-108.7, 36.4, 0.795], 'foot-near': [116.6, 62.4, 0.273],
    'leg-far-upper': [12.7, 34.6, 0.266], 'leg-far-lower': [69.8, 18.1, 0.982], 'foot-far': [-82.6, 35.4, 0.683],
    'arm-far-upper': [0, 10, 0], 'arm-near-upper': [0, 6, 0.5], tail: [4, 12, 0.25], 'scarf-tail': [8, 8, 0.4, 2] };

export default {
  timing: { blend: 0.09, strikeIn: 0.55, overshoot: 1.4, bodyLean: 0.3, swapBack: 0.5, throughSwap: [0, 0.75] },
  stance: { torso: 4, head: -4, 'scarf-tail': 0, tail: 0 },
  idle: {   // coiled: breathing through the shoulders, claw flexing, tail swishing (feet stay planted)
    speed: 0.6,
    torso: [4, 1.6, 0], head: [-4, 2.4, 0.15],
    'arm-near-upper': [0, 2.5, 0.1], 'hand-near': [0, 3, 0.2], 'arm-far-upper': [0, 3, 0.1], 'hand-far': [0, 6, 0.3],
    tail: [0, 10, 0.3], 'scarf-tail': [0, 7, 0.55],
  },
  // Walk (T018 round 3, user's pick "F tallest" over the round-1 scuttle): 2.0 steps/s, hips 2 px above the master crouch,
  // torso leaned back to stand tall (head tipped to keep the face level). Legs: 2-bone IK on an ankle path (planted sweep
  // back, lifted arc forward) fitted to one wave per joint, feet kept level; the far leg is short, so higher hips would
  // need shorter (scuttlier) steps. tests/rat-rig.test.mjs checks the feet don't skate or sink.
  walk: { ...WALK, ...liftWaves(rig, WALK) },   // T024: its lifts declared (the floor-line rule keeps the step as it was)
  jump: {
    torso: -4, head: -6,
    'leg-near-upper': -40, 'leg-near-lower': 30, 'leg-far-upper': 20, 'leg-far-lower': 10,
  },
  hurt: {   // snapped back by the hit: head and shoulders thrown back, cutlass arm flung out behind
    swap: HURT,
    torso: -16, head: -14, dx: -3,
    'arm-near-upper': 25, 'arm-near-lower': 15, 'hand-near': -60, 'arm-far-upper': -10, 'arm-far-lower': 30,
    tail: 20, 'scarf-tail': 25,
  },
  held: {   // grabbed by the collar / flying when thrown: hurt face, legs kicking off the ground, arms flailing
    swap: FALL,
    torso: -6, head: -16,
    'arm-near-upper': -30, 'arm-near-lower': 20, 'arm-far-upper': 35, 'arm-far-lower': 30,
    'leg-near-upper': -45, 'leg-near-lower': 40, 'leg-far-upper': 30, 'leg-far-lower': 20, 'foot-far': 20,
    tail: -30, 'scarf-tail': -30,
  },
  knockdown: {   // falling backwards (the standee tips the whole figure over): legs kicked up, arms flung out
    swap: FALL,
    torso: -14, head: -8,
    'arm-near-upper': -60, 'hand-near': 30, 'arm-far-upper': 45, 'arm-far-lower': 25,
    'leg-near-upper': -45, 'leg-near-lower': 20, 'leg-far-upper': 15, 'leg-far-lower': 15,
    tail: 25, 'scarf-tail': 30,
  },
  // Flat on his back: the standee turns the figure -86 degrees round the feet, so here he is straightened into one
  // upright line (torso back, legs straight down: they end up lying along the floor), head level with the torso (no
  // roll: the back of the head on the floor, KO face up), arms flopped over his head and down his side. dx lifts the
  // turned body onto the floor.
  down: {
    swap: { ...FALL, head: 'head-ko' },
    dx: 10, torso: -22, head: -6,
    'arm-near-upper': -100, 'arm-near-lower': -10, 'arm-far-upper': 60, 'arm-far-lower': 10,
    'leg-near-upper': -62, 'leg-near-lower': 14, 'foot-near': 30, 'leg-far-upper': 33, 'leg-far-lower': -3, 'foot-far': -20,
    tail: -30, 'scarf-tail': 20,
  },
  getup: {   // pushing up off the floor, coiled again
    swap: { head: 'head-effort', 'hand-far': 'hand-far-open' },
    torso: 14, head: -8,
    'arm-near-upper': -10, 'arm-far-upper': 20, 'arm-far-lower': -20,
  },
  moves: {
    ratSlash: {   // long telegraph: rears up with the cutlass high behind his head, then a lunging chop down in front
      windup: { swap: { head: 'head-effort', 'hand-far': 'hand-far-fist' }, torso: -10, head: -4, dx: -2,
        'arm-near-upper': 85, 'arm-near-lower': 30, 'hand-near': -175, 'arm-far-upper': 20, 'arm-far-lower': 25,
        tail: 20, 'scarf-tail': 15 },
      strike: { swap: { head: 'head-attack', 'hand-far': 'hand-far-fist' }, torso: 22, head: -12, dx: 4,
        'arm-near-upper': -90, 'arm-near-lower': -40, 'hand-near': -137, 'arm-far-upper': 40, 'arm-far-lower': 10,
        'arm-near-upper.order': 815,   // the arm comes across in front of the body (it rests under the torso, band 590)
        tail: -25, 'scarf-tail': -25 },
    },
  },
};
