// Mouse Fighter rig poses: joint angles in degrees (see rigs/mouse-fighter.js for the sign rule),
// plus dx/dy root offsets in screen px (dx = forward). A joint a pose leaves out uses `stance`.
// A value can be a number or a wave [base, amplitude, phase 0..1, harmonic]: base + amp*sin(2pi(speed*t*harmonic + phase)).
// Moves: `windup` is reached at the end of the windup phase, `strike` during active, then recovery eases back to stance.
// swap: { part: swap name } switches a part's drawing for that pose or move phase (rigs/mouse-fighter.js `swaps`);
// parts not named show their normal image (head-neutral, front torso).
export default {
  timing: {
    blend: 0.09,        // s to ease from the last drawn pose into a new pose
    strikeIn: 0.55,     // fraction of the active phase spent swinging into `strike`
    overshoot: 1.6,     // easeOutBack strength on the strike (0 = none)
    bodyLean: 0.3,      // share of the move's standee lean (move.pose.rot) the rig keeps; joints do the rest
    swapBack: 0.5,      // fraction of a move's recovery that keeps the strike's swaps (shout face) before the normal drawings return
    castHold: 1,        // s the C test pose (`cast`) plays before he drops back to normal
    throughSwap: [0, 0.75],      // a `through` pose's swaps show while the swing is this share of the way to the strike
  },
  stance: {
    torso: 4, head: -4,
    'arm-front-upper': 15, 'arm-front-lower': -75, sword: 20,
    'arm-back-upper': -45, 'arm-back-lower': -70, shield: 8,   // shield is upright (rigs/mouse-fighter.js): top tipped forward
    'leg-back-upper': -52, 'leg-back-lower': 36, 'leg-front-upper': 50, 'leg-front-lower': -54,   // wide, bent-knee stance
    tail: 0, 'scarf-tail': 0,
  },
  idle: {
    speed: 0.45,
    torso: [4, 1.5, 0], head: [-4, 2.5, 0.15], dy: [0, 0.7, 0.25],
    'arm-front-upper': [15, 3, 0.1], 'arm-back-upper': [-45, 3, 0.1],
    tail: [0, 9, 0.3], 'scarf-tail': [0, 7, 0.55],
  },
  // Stride cycles per second. Matched to Mouse Fighter's walk speed (tests/rig.test.mjs checks the
  // feet don't skate): change move.walk or the leg swing and this should follow.
  walk: {
    speed: 1.55,
    torso: [8, 2, 0, 2], head: [-6, 2, 0.1, 2], dy: [-4.5, 3.5, 0.75, 2],   // hips rise as the legs pass under the body
    'leg-back-upper': [-4, 38, 0], 'leg-back-lower': [24, 22, 0.8],
    'leg-front-upper': [-4, 38, 0.5], 'leg-front-lower': [24, 22, 0.3],
    'arm-front-upper': [12, 20, 0.5], 'arm-back-upper': [-45, 14, 0],
    tail: [5, 12, 0.25], 'scarf-tail': [12, 8, 0.4, 2],
  },
  jump: {
    torso: -4, head: -8,
    'arm-front-upper': -30, 'arm-front-lower': -60, sword: -10, 'arm-back-upper': -70, 'arm-back-lower': -40,
    'leg-back-upper': -60, 'leg-back-lower': 75, 'leg-front-upper': -25, 'leg-front-lower': 70,
    tail: 25, 'scarf-tail': 30,
  },
  block: {   // shield forward, braced: deep forward lean behind the shield pushed up and out (drawn a little
    // larger, as if thrust at the viewer), eyes over the rim, sword cocked high ready to answer.
    // Legs: boots kept as flat as in stance (torso + upper + lower), soles on the floor at this crouch.
    torso: 18, head: -6, dy: 8,
    'arm-back-upper': -105, 'arm-back-lower': -30, shield: 0, 'shield.sx': 1.12, 'shield.sy': 1.12,
    'arm-front-upper': 60, 'arm-front-lower': -130, sword: -40,
    'leg-back-upper': -104, 'leg-back-lower': 74, 'leg-front-upper': 59, 'leg-front-lower': -77,
    tail: -20, 'scarf-tail': -25,
  },
  hurt: {
    swap: { head: 'head-hurt' },
    torso: -16, head: -22, dx: -3,
    'arm-front-upper': 45, 'arm-front-lower': -15, sword: 30, 'arm-back-upper': 10, 'arm-back-lower': -20,
    'leg-back-upper': -25, 'leg-back-lower': 25, 'leg-front-upper': 20, 'leg-front-lower': -84,
    tail: -20, 'scarf-tail': -25,
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
    torso: 25, head: -10,
    'arm-front-upper': 10, 'arm-front-lower': -60, 'arm-back-upper': -50,
    'leg-back-upper': -75, 'leg-back-lower': 95, 'leg-front-upper': -20, 'leg-front-lower': 80,
  },
  // Not a move: the flexibility test (sword thrust straight up for a spell). C plays it once from idle, in play or the lab.
  cast: {
    swap: { head: 'head-shout' },
    torso: -6, head: -14, dy: -2,
    'arm-front-upper': 172, 'arm-front-lower': 8, sword: -264,   // tip: -6 + 172 + 8 - 264 = -90, straight up
    'arm-back-upper': -30, 'arm-back-lower': -40, shield: 4,
    'leg-back-upper': -38, 'leg-back-lower': 22, 'leg-front-upper': 64, 'leg-front-lower': -52,
    tail: 15, 'scarf-tail': 20,
  },
  // Sword tip direction on screen = torso + arm-front-upper + arm-front-lower + sword
  // (0 = forward, -90 = up, 90 = down, 180 = back). Swings go the way the numbers run.
  moves: {
    slash1: {   // overhead chop: up-back to forward-down
      windup: { torso: -8, head: -6, 'arm-front-upper': 158, 'arm-front-lower': -40, sword: -230, 'arm-back-upper': -60, 'scarf-tail': 10,
        'leg-front-upper': 66, 'leg-front-lower': -66 },
      strike: { swap: { head: 'head-shout' }, torso: 8, head: 4, dx: 2, 'arm-front-upper': -78, 'arm-front-lower': 10, sword: 90, 'arm-back-upper': -10, 'arm-back-lower': -30,
        'leg-back-upper': -52, 'leg-back-lower': 38, 'leg-front-upper': 50, 'leg-front-lower': -54, 'scarf-tail': -20, tail: -15 },
    },
    slash2: {   // spin slash: he twists away (body narrowed = turning), faces the other way for the first two
      // active frames (whole body mirrored, back torso, blade trailing on the enemy's side), then comes round
      // to the front with the blade flat out at shoulder height. 'sx' = whole-body width (-1 mirrored).
      windup: { sx: 0.65, torso: 2, head: -2, dy: 3, 'arm-front-upper': 70, 'arm-front-lower': -20, sword: 104, 'sword.sx': 0.75,
        'arm-back-upper': -70, 'leg-back-upper': -46, 'leg-back-lower': 44, 'leg-front-upper': 64, 'leg-front-lower': -70, tail: 15, 'scarf-tail': 15 },
      through: { swap: { torso: 'torso-back', head: 'head-shout' }, sx: -1, torso: 0, head: -4, dy: 2,
        'arm-front-upper': 90, 'arm-front-lower': 0, sword: 90, 'sword.sx': 0.55, 'arm-front-lower.sy': 0.8, 'arm-back-upper': -100, 'arm-back-lower': -20, tail: 30, 'scarf-tail': 30 },
      strike: { swap: { head: 'head-shout' }, torso: 10, head: 2, dx: 2, 'arm-front-upper': -102, 'arm-front-lower': 0, sword: 92,
        'arm-back-upper': -15, 'arm-back-lower': -40, 'leg-back-upper': -52, 'leg-back-lower': 38, 'leg-front-upper': 50, 'leg-front-lower': -54,
        'scarf-tail': -18, tail: -12 },
    },
    slash3: {   // big wind-back, full swing over the top that knocks down
      windup: { swap: { torso: 'torso-back' }, torso: -12, head: -8, dx: -3, 'arm-front-upper': 182, 'arm-front-lower': -30, sword: -290, 'arm-back-upper': -100, 'arm-back-lower': -20,
        'leg-back-upper': -62, 'leg-back-lower': 60, 'leg-front-upper': 74, 'leg-front-lower': -68, 'scarf-tail': 20, tail: 20 },
      strike: { swap: { head: 'head-shout' }, torso: 14, head: 6, dx: 4, dy: -3, 'arm-front-upper': -64, 'arm-front-lower': 10, sword: 100, 'arm-back-upper': 20, 'arm-back-lower': -20,
        'leg-back-upper': -58, 'leg-back-lower': 36, 'leg-front-upper': 52, 'leg-front-lower': -50, 'scarf-tail': -35, tail: -30 },
    },
    jumpSlash: {   // airborne: blade from straight up, down through the front, legs tucked
      windup: { torso: -10, 'arm-front-upper': 160, 'arm-front-lower': -30, sword: -210, 'arm-back-upper': -70,
        'leg-back-upper': -60, 'leg-back-lower': 75, 'leg-front-upper': -25, 'leg-front-lower': 70 },
      strike: { swap: { head: 'head-shout' }, torso: 18, head: 6, 'arm-front-upper': -8, 'arm-front-lower': -10, sword: 120, 'arm-back-upper': -30,
        'leg-back-upper': -55, 'leg-back-lower': 70, 'leg-front-upper': -20, 'leg-front-lower': 65, 'scarf-tail': 25 },
    },
  },
};
