// Rat Spearman rig (T011): the Rat Raider rig + A008 helmet and jerkin, holding the spear kit (items/rat-spear.js) in the
// two-hand grip: near fist low by the hip near the butt (the `sword` slot), far fist on the shaft (IK, render/rig-grip.js),
// point angled slightly up at the enemy. The far arm's angles here only pick the elbow's bend; IK sets the rest.
// Spear direction on screen (0 = forward, - = up) = torso + arm-front-upper + arm-front-lower + sword.
import rat, { GEAR } from './rat-raider.js';
import base from './rat-raider-poses.js';

const arms = (a, b, c, d, s) => ({ 'arm-front-upper': a, 'arm-front-lower': b, 'arm-back-upper': c, 'arm-back-lower': d, sword: s });
export default {
  ...rat, id: 'rat-spearman',
  parts: { ...rat.parts, helmet: GEAR.helmet, jerkin: GEAR.jerkin },
  poses: {
    ...base,
    stance: { ...base.stance, ...arms(-12, -66, -60, -60, 50) },   // spear -8 (point slightly up), near fist at the hip
    idle: { ...base.idle, 'arm-front-upper': [-12, 3, 0.1], 'arm-back-upper': [-60, 3, 0.1], 'arm-back-lower': -60 },
    walk: { ...base.walk, speed: 1.7, 'arm-front-upper': [-12, 4, 0.5], 'arm-back-upper': [-60, 4, 0] },
    hurt: { ...base.hurt, ...arms(30, -100, -40, -60, 60) },
    knockdown: { ...base.knockdown, ...arms(-60, -20, -100, -10, 80) },
    moves: {
      spearThrust: {   // draws the spear back along his side (long telegraph), then drives it straight out at the enemy
        windup: { swap: { head: 'head-snarl' }, torso: 6, head: -6, dx: -4, ...arms(10, -70, -30, -60, 55),
          'leg-back-upper': -32, 'leg-back-lower': 34, 'leg-front-upper': 39, 'leg-front-lower': -71, tail: 20 },
        strike: { swap: { head: 'head-snarl' }, torso: 22, head: -14, ...arms(-45, -55, -70, -40, 73), tail: -25 },   // arms drive, body stays back
      },
    },
  },
};
