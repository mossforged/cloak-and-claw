// Mouse Fighter rig poses: joint angles in degrees (see rigs/mouse-fighter.js for the sign rule),
// plus dx/dy root offsets in screen px (dx = forward). A joint a pose leaves out uses `stance`.
// A value can be a number or a wave [base, amplitude, phase 0..1, harmonic]: base + amp*sin(2pi(speed*t*harmonic + phase)).
// Moves: `windup` is reached at the end of the windup phase, `strike` during active, then recovery eases back to stance.
export default {
  timing: {
    blend: 0.09,        // s to ease from the last drawn pose into a new pose
    strikeIn: 0.55,     // fraction of the active phase spent swinging into `strike`
    overshoot: 1.6,     // easeOutBack strength on the strike (0 = none)
    bodyLean: 0.3,      // share of the move's standee lean (move.pose.rot) the rig keeps; joints do the rest
  },
  stance: {
    torso: 4, head: -4,
    'arm-front-upper': 15, 'arm-front-lower': -75, sword: 20,
    'arm-back-upper': -45, 'arm-back-lower': -70, shield: 0,
    'leg-front-upper': -18, 'leg-front-lower': 14, 'leg-back-upper': 16, 'leg-back-lower': 4,
    tail: 0, 'scarf-tail': 0,
  },
  idle: {
    speed: 0.45,
    torso: [4, 1.5, 0], head: [-4, 2.5, 0.15], dy: [0, 0.7, 0.25],
    'arm-front-upper': [15, 3, 0.1], 'arm-back-upper': [-45, 3, 0.1],
    tail: [0, 9, 0.3], 'scarf-tail': [0, 7, 0.55],
  },
  walk: {
    speed: 2.3,
    torso: [9, 2, 0, 2], head: [-6, 2, 0.1, 2],
    'leg-front-upper': [-8, 30, 0], 'leg-front-lower': [20, 18, 0.8],
    'leg-back-upper': [-8, 30, 0.5], 'leg-back-lower': [20, 18, 0.3],
    'arm-front-upper': [12, 20, 0.5], 'arm-back-upper': [-45, 14, 0],
    tail: [5, 12, 0.25], 'scarf-tail': [12, 8, 0.4, 2],
  },
  jump: {
    torso: -4, head: -8,
    'arm-front-upper': -30, 'arm-front-lower': -60, sword: -10, 'arm-back-upper': -70, 'arm-back-lower': -40,
    'leg-front-upper': -60, 'leg-front-lower': 75, 'leg-back-upper': -25, 'leg-back-lower': 70,
    tail: 25, 'scarf-tail': 30,
  },
  hurt: {
    torso: -16, head: -22, dx: -3,
    'arm-front-upper': 45, 'arm-front-lower': -15, sword: 30, 'arm-back-upper': 10, 'arm-back-lower': -20,
    'leg-front-upper': -25, 'leg-front-lower': 25, 'leg-back-upper': 20,
    tail: -20, 'scarf-tail': -25,
  },
  knockdown: {
    torso: -20, head: -25,
    'arm-front-upper': -60, 'arm-front-lower': -20, sword: 40, 'arm-back-upper': -100, 'arm-back-lower': -10,
    'leg-front-upper': -55, 'leg-front-lower': 30, 'leg-back-upper': -35, 'leg-back-lower': 40,
    tail: -30, 'scarf-tail': -40,
  },
  down: {
    torso: 0, head: 12,
    'arm-front-upper': 5, 'arm-front-lower': -15, sword: 85, 'arm-back-upper': 10, 'arm-back-lower': -20,
    'leg-front-upper': -10, 'leg-front-lower': 10, 'leg-back-upper': 5, 'leg-back-lower': 10,
    tail: 30, 'scarf-tail': 20,
  },
  getup: {
    torso: 25, head: -10,
    'arm-front-upper': 10, 'arm-front-lower': -60, 'arm-back-upper': -50,
    'leg-front-upper': -75, 'leg-front-lower': 95, 'leg-back-upper': -20, 'leg-back-lower': 80,
  },
  // Sword tip direction on screen = torso + arm-front-upper + arm-front-lower + sword
  // (0 = forward, -90 = up, 90 = down, 180 = back). Swings go the way the numbers run.
  moves: {
    slash1: {   // overhead chop: up-back to forward-down
      windup: { torso: -8, head: -6, 'arm-front-upper': 158, 'arm-front-lower': -40, sword: -230, 'arm-back-upper': -60, 'scarf-tail': 10 },
      strike: { torso: 8, head: 4, dx: 2, 'arm-front-upper': -78, 'arm-front-lower': 10, sword: 90, 'arm-back-upper': -10, 'arm-back-lower': -30,
        'leg-front-upper': -30, 'leg-front-lower': 22, 'leg-back-upper': 26, 'scarf-tail': -20, tail: -15 },
    },
    slash2: {   // rising backhand: down-back to up-forward
      windup: { torso: 10, head: 2, 'arm-front-upper': 30, 'arm-front-lower': -20, sword: 100, 'arm-back-upper': -20 },
      strike: { torso: -6, head: -8, 'arm-front-upper': -90, 'arm-front-lower': -35, sword: 60, 'arm-back-upper': -55,
        'leg-front-upper': -25, 'leg-back-upper': 22, 'scarf-tail': 18, tail: 15 },
    },
    slash3: {   // big wind-back, full swing over the top that knocks down
      windup: { torso: -12, head: -8, dx: -3, 'arm-front-upper': 182, 'arm-front-lower': -30, sword: -290, 'arm-back-upper': -100, 'arm-back-lower': -20,
        'leg-front-upper': -50, 'leg-front-lower': 45, 'leg-back-upper': 10, 'scarf-tail': 20, tail: 20 },
      strike: { torso: 14, head: 6, dx: 4, dy: 3, 'arm-front-upper': -64, 'arm-front-lower': 10, sword: 100, 'arm-back-upper': 20, 'arm-back-lower': -20,
        'leg-front-upper': -42, 'leg-front-lower': 15, 'leg-back-upper': 38, 'leg-back-lower': 25, 'scarf-tail': -35, tail: -30 },
    },
    jumpSlash: {   // airborne: blade from straight up, down through the front, legs tucked
      windup: { torso: -10, 'arm-front-upper': 160, 'arm-front-lower': -30, sword: -210, 'arm-back-upper': -70,
        'leg-front-upper': -60, 'leg-front-lower': 75, 'leg-back-upper': -25, 'leg-back-lower': 70 },
      strike: { torso: 18, head: 6, 'arm-front-upper': -8, 'arm-front-lower': -10, sword: 120, 'arm-back-upper': -30,
        'leg-front-upper': -55, 'leg-front-lower': 70, 'leg-back-upper': -20, 'leg-back-lower': 65, 'scarf-tail': 25 },
    },
  },
};
