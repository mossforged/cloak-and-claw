// Rat Raider rig poses (T018, A010 on the standard part names). Same format as rigs/mouse-fighter-poses.js.
// All-zero joints = the A010 master: his fighting crouch (wide hunched stance, cutlass cocked up behind, far claw out).
// Angles are degrees added to the master, + = clockwise (facing right: torso/head lean forward, hanging limbs swing back).
// The cutlass is rigid in the near grip hand, so its direction on screen (0 = forward, -90 = up) =
// -75 + pelvis + torso + arm-front-upper + arm-front-lower + hand-front (the slot's rest, rigs/rat-raider.js).
// Hands: the near hand grips the weapon (its default drawing); the far hand is open (default) idle/hurt, a fist walking
// and striking. Spearman and archer (rigs/rat-spearman.js, rat-archer.js) override the arms and add their kit moves.
const HURT = { head: 'head-hurt', 'hand-back': 'hand-back-open' };
const FALL = { head: 'head-hurt', 'hand-back': 'hand-back-open', 'hand-front': 'hand-front-open' };

export default {
  timing: { blend: 0.09, strikeIn: 0.55, overshoot: 1.4, bodyLean: 0.3, swapBack: 0.5, throughSwap: [0, 0.75] },
  stance: { torso: 4, head: -4, 'scarf-tail': 0, tail: 0 },
  idle: {   // coiled: breathing through the shoulders, claw flexing, tail swishing (feet stay planted)
    speed: 0.6,
    torso: [4, 1.6, 0], head: [-4, 2.4, 0.15],
    'arm-front-upper': [0, 2.5, 0.1], 'hand-front': [0, 3, 0.2], 'arm-back-upper': [0, 3, 0.1], 'hand-back': [0, 6, 0.3],
    tail: [0, 10, 0.3], 'scarf-tail': [0, 7, 0.55],
  },
  // Scuttle: quick short steps, hips dropped 9 px into a deeper crouch (walk 2.0 px/frame). Legs solved by 2-bone IK on an
  // ankle path (planted sweep back, lifted arc forward) and fitted to one wave per joint; feet kept level; tests/rat-rig
  // checks they don't skate or sink.
  walk: { speed: 2.8, swap: { 'hand-back': 'hand-back-fist' }, dy: 5, torso: [10, 2, 0, 2], head: [-10, 2, 0.1, 2],
    'leg-front-upper': [19.5, 4.4, 0.55], 'leg-front-lower': [-72.7, 45.5, 0.769], 'foot-front': [53.3, 46.5, 0.254],
    'leg-back-upper': [-23.6, 17, 0.3], 'leg-back-lower': [88.9, 42.1, 0.201], 'foot-back': [-65.3, 56.8, 0.729],
    'arm-back-upper': [0, 10, 0], 'arm-front-upper': [0, 6, 0.5], tail: [4, 12, 0.25], 'scarf-tail': [8, 8, 0.4, 2] },
  jump: {
    torso: -4, head: -6,
    'leg-front-upper': -40, 'leg-front-lower': 30, 'leg-back-upper': 20, 'leg-back-lower': 10,
  },
  hurt: {   // snapped back by the hit: head and shoulders thrown back, cutlass arm flung out behind
    swap: HURT,
    torso: -16, head: -14, dx: -3,
    'arm-front-upper': 25, 'arm-front-lower': 15, 'hand-front': -60, 'arm-back-upper': -10, 'arm-back-lower': 30,
    tail: 20, 'scarf-tail': 25,
  },
  held: {   // grabbed by the collar / flying when thrown: hurt face, legs kicking off the ground, arms flailing
    swap: FALL,
    torso: -6, head: -16,
    'arm-front-upper': -30, 'arm-front-lower': 20, 'arm-back-upper': 35, 'arm-back-lower': 30,
    'leg-front-upper': -45, 'leg-front-lower': 40, 'leg-back-upper': 30, 'leg-back-lower': 20, 'foot-back': 20,
    tail: -30, 'scarf-tail': -30,
  },
  knockdown: {   // falling backwards (the standee tips the whole figure over): legs kicked up, arms flung out
    swap: FALL,
    torso: -14, head: -8,
    'arm-front-upper': -60, 'hand-front': 30, 'arm-back-upper': 45, 'arm-back-lower': 25,
    'leg-front-upper': -45, 'leg-front-lower': 20, 'leg-back-upper': 15, 'leg-back-lower': 15,
    tail: 25, 'scarf-tail': 30,
  },
  // Flat on his back: the standee turns the figure -86 degrees round the feet, so here he is straightened into one
  // upright line (torso back, legs straight down: they end up lying along the floor), head level with the torso (no
  // roll: the back of the head on the floor, KO face up), arms flopped over his head and down his side. dx lifts the
  // turned body onto the floor.
  down: {
    swap: { ...FALL, head: 'head-ko' },
    dx: 10, torso: -22, head: -6,
    'arm-front-upper': -100, 'arm-front-lower': -10, 'arm-back-upper': 60, 'arm-back-lower': 10,
    'leg-front-upper': -62, 'leg-front-lower': 14, 'foot-front': 30, 'leg-back-upper': 33, 'leg-back-lower': -3, 'foot-back': -20,
    tail: -30, 'scarf-tail': 20,
  },
  getup: {   // pushing up off the floor, coiled again
    swap: { head: 'head-effort', 'hand-back': 'hand-back-open' },
    torso: 14, head: -8,
    'arm-front-upper': -10, 'arm-back-upper': 20, 'arm-back-lower': -20,
  },
  moves: {
    ratSlash: {   // long telegraph: rears up with the cutlass high behind his head, then a lunging chop down in front
      windup: { swap: { head: 'head-effort', 'hand-back': 'hand-back-fist' }, torso: -10, head: -4, dx: -2,
        'arm-front-upper': 85, 'arm-front-lower': 30, 'hand-front': -175, 'arm-back-upper': 20, 'arm-back-lower': 25,
        tail: 20, 'scarf-tail': 15 },
      strike: { swap: { head: 'head-attack', 'hand-back': 'hand-back-fist' }, torso: 22, head: -12, dx: 4,
        'arm-front-upper': -90, 'arm-front-lower': -40, 'hand-front': -137, 'arm-back-upper': 40, 'arm-back-lower': 10,
        'arm-front-upper.order': 815,   // the arm comes across in front of the body (it rests under the torso, band 590)
        tail: -25, 'scarf-tail': -25 },
    },
  },
};
