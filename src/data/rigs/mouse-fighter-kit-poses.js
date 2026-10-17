// Mouse Fighter weapon-feel poses (T017), registered as `kits` on his rig poses (mouse-fighter-poses.js): per floor weapon
// (item id), its own idle/walk (laid over the normal ones) and move poses (used instead of the sword move the kit borrows
// via move.rig). View only; same units as mouse-fighter-poses.js (T023: A013, written with the IK helper; the weapon
// sits in the grip fist exactly as his sword does, so `dir` is the weapon's handle-to-head direction).
// hold: share of the windup held at the top; tremble: degrees of arm strain shake meanwhile.
// With the whole raised arm (arm-near-raised) the weapon points -90 + the arm's world turn (pelvis + torso + arm).
import { NEAR, FAR, OUT, P } from './mouse-fighter-feet.js';

const ATTACK = { head: 'head-attack' };
const arm = (spec) => { const { torso, ...j } = P(spec); return j; };   // idle/walk overlays: arms only (torso stays the state's)

export const KIT_POSES = {
  'plank-club': {   // heavy: rested on the shoulder; lifted high overhead leaning back, a beat, then slammed down low
    idle: { ...arm({ hand: { off: [9.4, 10.4], dir: -139 } }), 'sword.order': 585 },
    walk: { ...arm({ torso: 4, hand: { off: [8.6, 11], dir: -135 } }), 'sword.order': 585, torso: [8, 2, 0, 2] },
    moves: {
      club1: {
        hold: 0.35, tremble: 2,
        windup: P({ swap: { head: 'head-effort', 'arm-near-upper': 'arm-near-raised', ...OUT }, torso: -18, head: -8, dx: -4, dy: 3,
          'arm-near-upper': -2, 'arm-near-upper.order': 820, 'sword.order': 815, shield: { off: [11.9, 12] },
          feet: { near: [NEAR, 0, 0], far: [FAR - 4, 4, 15] }, tail: 25, 'scarf-tail': 5 }),
        strike: P({ swap: { ...ATTACK, ...OUT }, torso: 18, head: 12, dx: 4, dy: 15, pelvis: 6, hand: { off: [22, 20], dir: 50 }, shield: { off: [-23, 25] },
          'arm-near-upper.order': 805, 'arm-near-lower.order': 806,
          feet: { near: [NEAR - 8, 0, 0], far: [FAR + 10, 0, 0] }, tail: -30, 'scarf-tail': -12 }),
      },
      club2: {
        hold: 0.25, tremble: 1.5,
        windup: P({ swap: { torso: 'torso-side', head: 'head-effort', ...OUT }, torso: -14, head: -4, dx: -4, dy: 7,
          hand: { off: [-26.9, -4.4], dir: 170 }, shield: { off: [13.7, -18.1] },
          'arm-near-upper.order': 650, 'arm-near-lower.order': 651,   // out of the side torso's sleeve
          feet: { near: [NEAR - 2, 0, 0], far: [FAR - 6, 5, 18] }, tail: 20, 'scarf-tail': 5 }),
        strike: P({ swap: { ...ATTACK, ...OUT }, torso: 24, head: 14, dx: 6, dy: 17, pelvis: 8, hand: { off: [18, 24], dir: 40 }, shield: { off: [-28, 22] },
          'arm-near-upper.order': 805, 'arm-near-lower.order': 806,
          feet: { near: [NEAR - 7, 0, 0], far: [FAR + 14, 0, 0] }, tail: -35, 'scarf-tail': -14 }),
      },
    },
  },
  'big-fish': {   // silly: dangled by the tail, nose down, so it flops (render/weapon-feel.js wobble); slap = slash2's spin
    idle: arm({ hand: { off: [18, 15.8], dir: -2 } }),
    walk: arm({ torso: 4, hand: { off: [16.3, 17.5], dir: 4 } }),
  },
  'rat-cutlass': {   // quick: the sword's chops with a shorter wind-back (no back-turn on the third), lighter than his own sword
    moves: {
      cut1: {
        windup: P({ swap: OUT, torso: -8, head: 0, dy: 2, hand: { off: [-25.9, -2], dir: -74 }, shield: { off: [12.6, -4.5] },
          feet: { near: [NEAR, 0, 0], far: [FAR - 2, 2, 8] }, 'scarf-tail': 2 }),
        strike: P({ swap: { ...ATTACK, ...OUT }, torso: 2, head: 7, dx: 2, dy: 6, pelvis: 3, hand: { off: [25.2, 11], dir: 23 }, shield: { off: [0.3, 24.3] },
          'arm-near-upper.order': 805, 'arm-near-lower.order': 806,
          feet: { near: [NEAR - 5, 0, 0], far: [FAR + 5, 0, 0] }, 'scarf-tail': -5, tail: -10 }),
      },
      cut3: {
        windup: P({ swap: OUT, torso: -12, head: -2, dx: -2, dy: 4, hand: { off: [-21.6, -15.7], dir: -110 }, shield: { off: [17.4, -7.7] },
          feet: { near: [NEAR - 2, 0, 0], far: [FAR - 4, 4, 14] }, 'scarf-tail': 5, tail: 14 }),
        strike: P({ swap: { ...ATTACK, ...OUT }, torso: 8, head: 9, dx: 3, dy: 9, pelvis: 5, hand: { off: [19.9, 19], dir: 54 }, shield: { off: [-21, 26] },
          'arm-near-upper.order': 805, 'arm-near-lower.order': 806,
          feet: { near: [NEAR - 6, 0, 0], far: [FAR + 10, 0, 0] }, 'scarf-tail': -10, tail: -24 }),
      },
    },
  },
};
