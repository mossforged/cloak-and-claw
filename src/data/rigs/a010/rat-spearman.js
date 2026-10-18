// Rat Spearman rig (T018): the A010 Rat Raider rig holding the spear kit (items/rat-spear.js) in the two-hand grip: near
// grip hand low by the hip near the butt (slot in rigs/rat-raider.js), far grip hand closed on the shaft (IK,
// render/rig-grip.js), point angled slightly up at the enemy. The far arm's angles here only pick the elbow's bend.
// T020 round 2 (user's pick E): back (near) fist turned over, underhand, low at the belt (the near arm is short: only
// this way round does the shaft get below his chest); front (far) fist reaching out along the shaft, closing from above
// (grips['two-hand'].wrist), on the spear's grip2 (62 px out from the back fist).
// Spear direction on screen (0 = forward, - = up) = 90 (the turned-over fist's slot axis) + torso + arm-near-upper
// + arm-near-lower + hand-near.
import rat from './rat-raider.js';
import base from './rat-raider-poses.js';

const arms = (a, b, h, c, d) => ({ 'arm-near-upper': a, 'arm-near-lower': b, 'hand-near': h, 'arm-far-upper': c, 'arm-far-lower': d });
const FRONT = { 'arm-near-upper.order': 815 };   // spear arm in front of the body (the far fist over the shaft: grips['two-hand'].order)
const LOW = [-99, 54];   // near arm: IK'd so the back fist sits low in front of the belt
export default {
  ...rat, id: 'rat-spearman',
  axes: { ...rat.axes, 'two-hand': 90 },   // the back fist turned over: the shaft runs through it the other way
  grips: { ...rat.grips, 'two-hand': { ...rat.grips['two-hand'], wrist: 'above' } },
  poses: {
    ...base,
    stance: { ...base.stance, ...arms(...LOW, -59, 20, 20), ...FRONT },   // spear -10 (point slightly up), back fist at the belt
    idle: { ...base.idle, 'arm-near-upper': [LOW[0], 3, 0.1], 'hand-near': -59, 'arm-far-upper': [20, 3, 0.1], 'hand-far': 0 },
    walk: { ...base.walk, 'arm-near-upper': [LOW[0], 4, 0.5], 'arm-near-lower': LOW[1], 'hand-near': -37, 'arm-far-upper': [20, 4, 0], swap: {} },   // hand turned 22 deg against the walk's lean back: spear level as in idle
    hurt: { ...base.hurt, ...arms(0, 15, -80, 20, 20), ...FRONT },   // spear jolted 9 deg point-down; arm fitted so both fists keep the shaft
    moves: {
      spearThrust: {   // draws the spear back along his side (long telegraph), then drives it straight out at the enemy
        windup: { swap: { head: 'head-effort' }, torso: -4, head: -2, dx: -4, ...arms(-50, -80, 41, 20, 30), ...FRONT, tail: 20 },
        strike: { swap: { head: 'head-attack' }, torso: 14, head: -12, dx: 2, ...arms(-80, -45, 33, 20, 20), ...FRONT, tail: -25 },
      },
    },
  },
};
