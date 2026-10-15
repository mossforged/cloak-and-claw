// Rat Raider rig poses (T011). Same format as rigs/mouse-fighter-poses.js. All-zero joints = the upright A005
// reference; `stance` is the art bible's fighting crouch: hips low, knees bent, feet wide, torso tipped forward,
// head pushed out, cutlass cocked up behind his ear, far claw reaching forward. A limb's on-screen angle (0 = straight
// down, + = swung back) is the sum of its chain: e.g. near shin = torso + leg-front-upper + leg-front-lower.
// Spearman and archer (rigs/rat-spearman.js, rat-archer.js) override the arms and add their kit moves.
export default {
  timing: { blend: 0.09, strikeIn: 0.55, overshoot: 1.4, bodyLean: 0.3, swapBack: 0.5, throughSwap: [0, 0.75] },
  stance: {
    torso: 20, head: -14, tail: 0, 'scarf-tail': 0,
    'arm-front-upper': 25, 'arm-front-lower': -150, sword: 0,
    'arm-back-upper': -75, 'arm-back-lower': -40,
    'leg-back-upper': -78, 'leg-back-lower': 62, 'leg-front-upper': 26, 'leg-front-lower': -40,   // both soles on the floor (rig test)
  },
  idle: {   // coiled: a slow breathing bob with the tail swishing
    speed: 0.6,
    torso: [20, 2, 0], head: [-14, 3, 0.15], dy: [0, 1, 0.25],
    'arm-front-upper': [25, 4, 0.1], 'arm-back-upper': [-75, 5, 0.1], 'arm-back-lower': [-40, 6, 0.3],
    tail: [0, 12, 0.3], 'scarf-tail': [0, 8, 0.55],
  },
  // Scuttle: short quick steps in the crouch (walk 2.0 px/frame; tests/rig.test.mjs checks the feet don't skate).
  walk: {
    speed: 1.9,
    torso: [24, 2, 0, 2], head: [-16, 2, 0.1, 2], dy: [-4.5, 2, 0.75, 2],
    'leg-back-upper': [-64, 17, 0], 'leg-back-lower': [52, 12, 0.8],
    'leg-front-upper': [4, 19, 0.5], 'leg-front-lower': [-14, 12, 0.3],
    'arm-front-upper': [25, 10, 0.5], 'arm-back-upper': [-75, 12, 0],
    tail: [5, 14, 0.25], 'scarf-tail': [10, 8, 0.4, 2],
  },
  jump: {
    torso: 10, head: -10,
    'leg-back-upper': -90, 'leg-back-lower': 90, 'leg-front-upper': -20, 'leg-front-lower': 60,
  },
  hurt: {
    swap: { head: 'head-hurt' },
    torso: -6, head: -16, dx: -3,
    'arm-front-upper': 60, 'arm-front-lower': -90, sword: 30, 'arm-back-upper': 10, 'arm-back-lower': -30,
    'leg-back-upper': -26, 'leg-back-lower': 34, 'leg-front-upper': 39, 'leg-front-lower': -71,
    tail: -25, 'scarf-tail': -30,
  },
  held: {   // grabbed by the collar / flying when thrown (T011): hurt face, legs kicking off the ground, arms flailing
    swap: { head: 'head-hurt' },
    torso: -4, head: -18,
    'arm-front-upper': 70, 'arm-front-lower': -60, 'arm-back-upper': -30, 'arm-back-lower': -50,
    'leg-back-upper': -40, 'leg-back-lower': 50, 'leg-front-upper': 30, 'leg-front-lower': 20,
    tail: -30, 'scarf-tail': -30,
  },
  knockdown: {
    swap: { head: 'head-hurt' },
    torso: -20, head: -25,
    'arm-front-upper': -60, 'arm-front-lower': -20, sword: 40, 'arm-back-upper': -100, 'arm-back-lower': -10,
    'leg-back-upper': -55, 'leg-back-lower': 30, 'leg-front-upper': -35, 'leg-front-lower': 40,
    tail: -30, 'scarf-tail': -40,
  },
  down: {
    swap: { head: 'head-hurt' },
    torso: 0, head: 12,
    'arm-front-upper': 5, 'arm-front-lower': -15, sword: 85, 'arm-back-upper': 10, 'arm-back-lower': -20,
    'leg-back-upper': -10, 'leg-back-lower': 10, 'leg-front-upper': 5, 'leg-front-lower': 10,
    tail: 30, 'scarf-tail': 20,
  },
  getup: {
    torso: 30, head: -10,
    'arm-front-upper': 10, 'arm-front-lower': -60, 'arm-back-upper': -50,
    'leg-back-upper': -100, 'leg-back-lower': 92, 'leg-front-upper': 16, 'leg-front-lower': -36,
  },
  moves: {
    ratSlash: {   // long telegraph: rears up with the cutlass high behind his head, then a lunging chop down in front
      windup: { torso: -6, head: -6, 'arm-front-upper': 150, 'arm-front-lower': -40, sword: -214, 'arm-back-upper': -100, 'arm-back-lower': -20,
        'leg-back-upper': -32, 'leg-back-lower': 34, 'leg-front-upper': 39, 'leg-front-lower': -71, tail: 20, 'scarf-tail': 15 },
      strike: { swap: { head: 'head-snarl' }, torso: 30, head: -14, dx: 4, 'arm-front-upper': -70, 'arm-front-lower': -10, sword: 60, 'arm-back-upper': 20, 'arm-back-lower': -40,
        'leg-back-upper': -96, 'leg-back-lower': 74, 'leg-front-upper': 14, 'leg-front-lower': -36, tail: -25, 'scarf-tail': -25 },
    },
  },
};
