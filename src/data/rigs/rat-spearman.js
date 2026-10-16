// Rat Spearman rig (T018): the A010 Rat Raider rig holding the spear kit (items/rat-spear.js) in the two-hand grip: near
// grip hand low by the hip near the butt (slot in rigs/rat-raider.js), far grip hand closed on the shaft (IK,
// render/rig-grip.js), point angled slightly up at the enemy. The far arm's angles here only pick the elbow's bend.
// Spear direction on screen (0 = forward, - = up) = -75 + torso + arm-front-upper + arm-front-lower + hand-front.
import rat from './rat-raider.js';
import base from './rat-raider-poses.js';

const arms = (a, b, h, c, d) => ({ 'arm-front-upper': a, 'arm-front-lower': b, 'hand-front': h, 'arm-back-upper': c, 'arm-back-lower': d });
const FRONT = { 'arm-front-upper.order': 815, 'hand-back.order': 845 };   // spear arm in front of the body; far fist over the shaft
export default {
  ...rat, id: 'rat-spearman',
  poses: {
    ...base,
    stance: { ...base.stance, ...arms(-80, -59, -162, 20, 20), ...FRONT },   // spear -10 (point slightly up), near fist at the hip
    idle: { ...base.idle, 'arm-front-upper': [-80, 3, 0.1], 'hand-front': -162, 'arm-back-upper': [20, 3, 0.1], 'hand-back': 0 },
    walk: { ...base.walk, 'arm-front-upper': [-80, 4, 0.5], 'arm-back-upper': [20, 4, 0], swap: {} },
    hurt: { ...base.hurt, ...arms(-40, -70, -150, 20, 20), ...FRONT },
    moves: {
      spearThrust: {   // draws the spear back along his side (long telegraph), then drives it straight out at the enemy
        windup: { swap: { head: 'head-effort' }, torso: -4, head: -2, dx: -4, ...arms(-50, -80, -154, 20, 30), ...FRONT, tail: 20 },
        strike: { swap: { head: 'head-attack' }, torso: 14, head: -12, dx: 2, ...arms(-80, -45, -162, 20, 20), ...FRONT, tail: -25 },
      },
    },
  },
};
