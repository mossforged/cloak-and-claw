// Mouse Fighter action poses (grab/throw, weapon toss, pickup), split out of mouse-fighter-poses.js (same format; see
// that file's header). T023: rewritten for A013 with the IK helper (fist from the shoulder, blade direction, ankles).
import { F0, B0, OUT, PLANT, P } from './mouse-fighter-feet.js';

const ATTACK = { head: 'head-attack' };

export const ACTION_POSES = {
  // Grab and throw (T009). grabbing: sword fist forward at the rat's collar (blade up along the forearm), shield braced
  // low, wide planted stance. knee: drives the far (leading) knee up into him while yanking him down. throwWind: heaves
  // him up and back; throwWindBack: twists round (body narrows and mirrors) to send him over the shoulder; throwRelease:
  // flings him, stepping into it.
  grabbing: P({
    'arm-front-upper.order': 805, 'arm-front-lower.order': 806,   // the arm over the tunic (A013 rests it under the torso)
    swap: { 'hand-back': 'hand-back-fist', ...OUT },
    torso: 8, head: 2, dy: 4, hand: { off: [27.6, -0.1], dir: -133 }, shield: { off: [13.8, 9.7], turn: -2 },
    feet: { front: [F0 - 4, 0, 0], back: [B0 + 4, 0, 0] }, tail: 10, 'scarf-tail': 4,
  }),
  knee: P({
    'arm-front-upper.order': 805, 'arm-front-lower.order': 806,   // the arm over the tunic (A013 rests it under the torso)
    swap: { ...ATTACK, 'hand-back': 'hand-back-fist', ...OUT },
    torso: 14, head: 8, dy: 2, hand: { off: [12.6, 24.5], dir: -92 }, shield: { off: [12.9, 15.3], turn: 2 },
    feet: { front: [F0 - 2, 0, 0], back: [B0 + 2, 22, 40] },
    'leg-back-upper.order': 605, 'leg-back-lower.order': 604, 'foot-back.order': 603,   // the knee comes up in front of the tunic
    tail: -15, 'scarf-tail': -7,
  }),
  throwWind: P({
    swap: { head: 'head-effort', 'hand-back': 'hand-back-fist', ...OUT },
    torso: -18, head: -6, dy: 4, hand: { off: [11.6, -24.7], dir: -134 }, shield: { off: [1.4, -24], turn: -8 },
    feet: { front: [F0 - 2, 0, 0], back: [B0 + 2, 0, 0] }, tail: 25, 'scarf-tail': 5,
  }),
  throwWindBack: P({
    swap: { torso: 'torso-back', head: 'head-back', 'hand-back': 'hand-back-fist' }, sx: -1,
    torso: -20, head: -8, dy: 4, hand: { off: [16.3, -21.8], dir: -96 }, shield: { off: [-12, -24], turn: -8 },
    feet: { front: [F0 + 6, 0, 0], back: [B0 - 6, 0, 0] }, tail: 30, 'scarf-tail': 5,
  }),
  throwRelease: P({
    swap: { ...ATTACK, 'hand-back': 'hand-back-open' },
    torso: 14, head: 10, dx: 4, dy: 3, hand: { off: [26.9, 6.2], dir: 3 }, shield: { off: [-2, 24], turn: 2 },
    'arm-front-upper.order': 805, 'arm-front-lower.order': 806,
    feet: { front: [F0 - 8, 3, -15], back: [B0 + 8, 0, 0] }, tail: -25, 'scarf-tail': -10,
  }),
  // Weapon toss (T010, H while holding a floor weapon): toss = cocked back overhead, tossRelease = arm whipped forward,
  // the hand opens once it lets go (rig emptyHand). Wind lasts def.toss.wind frames, then the release eases back to idle over toss.recovery.
  toss: P({
    swap: OUT,
    torso: -14, head: -2, dy: 3, hand: { off: [-22.2, -14.9], dir: -90 }, shield: { off: [10, 17.5], turn: -4 },
    feet: { front: [F0, 0, 0], back: [B0 - 3, 3, 12] }, tail: 15, 'scarf-tail': 5,
  }),
  tossRelease: P({
    swap: ATTACK,
    torso: 12, head: 8, dx: 4, dy: 3, hand: { off: [27.2, 5.3], dir: 1 }, shield: { off: [-18, 26], turn: 2 },
    'arm-front-upper.order': 805, 'arm-front-lower.order': 806,
    feet: { front: [F0 - 8, 3, -15], back: [B0 + 8, 0, 0] }, tail: -20, 'scarf-tail': -9,
  }),
  // Weapon pickup (T010 round 2): stow = sword arm swept back to the hip, blade down and behind (sheathing it, or
  // flicking the held weapon away); reach = crouched, leaning in, hand down at the weapon on the floor in front.
  // pickup state: idle -> stow over def.pickup.stow frames, -> reach over .reach, -> idle over .rise. T022: a revive
  // holds `reach` (hand down to his friend).
  stow: P({
    swap: OUT,
    torso: 4, head: 2, dy: 3, hand: { off: [-18.5, 19.3], dir: 150 }, shield: { off: [13.3, 7.1], turn: -2 },
    feet: PLANT, tail: 10, 'scarf-tail': 4,
  }),
  reach: P({   // both boots flat on the floor at this crouch (tests/rig.test.mjs)
    'arm-front-upper.order': 805, 'arm-front-lower.order': 806,   // the arm over the tunic (A013 rests it under the torso)
    swap: OUT,
    torso: 24, head: -18, dy: 12, hand: { off: [11.6, 24.4], dir: 8 }, shield: { off: [16.7, 1.8], turn: 2 },
    feet: { front: [F0 - 2, 0, 0], back: [B0 + 6, 0, 0] }, tail: -10, 'scarf-tail': -7,
  }),
};
