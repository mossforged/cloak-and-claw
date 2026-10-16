// Mouse Fighter weapon-feel poses (T017), registered as `kits` on his rig poses (mouse-fighter-poses.js): per floor weapon
// (item id), its own idle/walk (laid over the normal ones) and move poses (used instead of the sword move the kit borrows
// via move.rig). View only; same joint units as mouse-fighter-poses.js. hold: share of the windup held at the top;
// tremble: degrees of arm strain shake meanwhile. With the raised arm (arm-front-raised) the tip = torso + arm + weapon.
export const KIT_POSES = {
  'plank-club': {   // heavy: rested on the shoulder; lifted high overhead leaning back, a beat, then slammed down low
    idle: { 'arm-front-upper': [22, 2, 0.1], 'arm-front-lower': -120, sword: -45, 'sword.order': 8.5 },
    walk: { 'arm-front-upper': [20, 5, 0.5], 'arm-front-lower': -120, sword: -45, 'sword.order': 8.5, torso: [10, 2, 0, 2] },
    moves: {
      club1: {
        hold: 0.35, tremble: 2,
        windup: { swap: { head: 'head-brace', 'arm-front-upper': 'arm-front-raised' }, torso: -14, head: -12, dx: -4, dy: -1,
          'arm-front-upper': 30, sword: -126, 'sword.order': 11.5, 'arm-back-upper': -20, 'arm-back-lower': -50,
          'leg-back-upper': -40, 'leg-back-lower': 30, 'leg-front-upper': 66, 'leg-front-lower': -58, tail: 25, 'scarf-tail': 25 },
        strike: { swap: { head: 'head-shout' }, torso: 22, head: 8, dx: 4, dy: 8,
          'arm-front-upper': -85, 'arm-front-lower': 5, sword: 83, 'arm-back-upper': 15, 'arm-back-lower': -30,
          'leg-back-upper': -104, 'leg-back-lower': 74, 'leg-front-upper': 59, 'leg-front-lower': -77, tail: -30, 'scarf-tail': -35 },
      },
      club2: {
        hold: 0.25, tremble: 1.5,
        windup: { swap: { torso: 'torso-back' }, torso: -10, head: -8, dx: -4, dy: 3,
          'arm-front-upper': 120, 'arm-front-lower': -20, sword: 80, 'arm-back-upper': -100, 'arm-back-lower': -20,
          'leg-back-upper': -62, 'leg-back-lower': 60, 'leg-front-upper': 74, 'leg-front-lower': -68, tail: 20, 'scarf-tail': 20 },
        strike: { swap: { head: 'head-shout' }, torso: 28, head: 10, dx: 6, dy: 12,
          'arm-front-upper': -60, 'arm-front-lower': 0, sword: 32, 'arm-back-upper': 20, 'arm-back-lower': -20,
          'leg-back-upper': -133, 'leg-back-lower': 93, 'leg-front-upper': 52, 'leg-front-lower': -80, tail: -35, 'scarf-tail': -40 },
      },
    },
  },
  'big-fish': {   // silly: dangled by the tail, nose down, so it flops (render/weapon-feel.js wobble); slap = slash2's spin
    idle: { 'arm-front-upper': [-20, 3, 0.1], 'arm-front-lower': -60, sword: 74 },
    walk: { 'arm-front-upper': [-18, 10, 0.5], 'arm-front-lower': -60, sword: 74 },
  },
  'rat-cutlass': {   // quick: the sword's chops with a shorter wind-back (no back-turn on the third), lighter than his own sword
    moves: {
      cut1: {
        windup: { torso: -4, head: -4, 'arm-front-upper': 120, 'arm-front-lower': -40, sword: -150, 'arm-back-upper': -55, 'scarf-tail': 6 },
        strike: { swap: { head: 'head-shout' }, torso: 6, head: 3, dx: 2, 'arm-front-upper': -78, 'arm-front-lower': 10, sword: 85,
          'arm-back-upper': -15, 'arm-back-lower': -35, 'scarf-tail': -15, tail: -10 },
      },
      cut3: {
        windup: { torso: -8, head: -6, dx: -2, 'arm-front-upper': 150, 'arm-front-lower': -30, sword: -222, 'arm-back-upper': -80, 'arm-back-lower': -25,
          'leg-front-upper': 64, 'leg-front-lower': -62, 'scarf-tail': 14, tail: 14 },
        strike: { swap: { head: 'head-shout' }, torso: 12, head: 5, dx: 3, dy: -2, 'arm-front-upper': -64, 'arm-front-lower': 10, sword: 96,
          'arm-back-upper': 15, 'arm-back-lower': -20, 'leg-back-upper': -58, 'leg-back-lower': 36, 'leg-front-upper': 52, 'leg-front-lower': -50,
          'scarf-tail': -28, tail: -24 },
      },
    },
  },
};
