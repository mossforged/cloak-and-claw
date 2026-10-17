// Rat Spearman rig (T026): the A018 rat holding the spear kit (items/rat-spear.js) on the weapon node (T025), **both
// fists overhand** (A018's hand-near-grip-overhand and hand-far-grip-overhand: the rig's default hold for the spear):
// the back (near) fist low by the belt near the butt, the front (far) fist reaching out along the shaft on grip2
// (rig grips['two-hand'], IK), point angled slightly up at the enemy. weapon: { x, y, rot } = where the back fist holds
// the spear (rig px from the feet, x forward) and the shaft's screen angle (0 forward, - = up); the arms follow by IK.
// The thrust turns him side-on (A018 side torso) and pushes off the trailing toe (A019).
import rat from './rat-raider.js';
import base, { P, CROUCH, FEET } from './rat-raider-poses.js';

// the node's placement as channels (render/rig-pose.js turns a pose's `weapon` into these; the stance needs them as is)
const SPEAR = (x, y, rot) => ({ 'weapon.x': x, 'weapon.y': y, 'weapon.at': 1, 'weapon.rot': rot, 'weapon.turn': 1 });
const GRIP = { hand: { off: [10, 20], dir: -10 } };   // the back fist's start for the node (it re-places it)
const { swap: _s, ...STANCE } = P({ ...CROUCH, ...GRIP, shield: { off: [20, 12], turn: 0 } });
export default {
  ...rat, id: 'rat-spearman',
  holds: { 'rat-spear': { grip: 'overhand', grip2: 'overhand' } },
  poses: {
    ...base,
    stance: { ...STANCE, ...SPEAR(-4, -44, -10) },
    idle: { ...base.idle, ...SPEAR(-4, -44, -10), 'arm-near-upper': STANCE['arm-near-upper'], 'arm-near-lower': STANCE['arm-near-lower'], 'hand-near': STANCE['hand-near'],
      'arm-far-upper': [STANCE['arm-far-upper'], 3, 0.1], 'arm-far-lower': STANCE['arm-far-lower'], 'hand-far': STANCE['hand-far'] },
    walk: { ...base.walk, ...SPEAR(-4, -44, -8), swap: {}, 'arm-near-upper': STANCE['arm-near-upper'], 'arm-near-lower': STANCE['arm-near-lower'], 'hand-near': STANCE['hand-near'],
      'arm-far-upper': STANCE['arm-far-upper'], 'arm-far-lower': STANCE['arm-far-lower'], 'hand-far': STANCE['hand-far'] },
    hurt: { ...base.hurt, ...SPEAR(-10, -46, 14) },   // spear jolted point-down, both fists keep the shaft
    moves: {
      spearThrust: {   // draws the spear back along his side (long telegraph), then drives it straight out at the enemy
        windup: { ...P({ ...CROUCH, ...GRIP, swap: { head: 'head-effort' }, dx: -4, torso: 2, head: -6, shield: { off: [14, 12] },
          feet: { near: FEET.near, far: [FEET.far[0] - 2, 2, 10] }, tail: 10 }), ...SPEAR(-20, -48, -6) },
        strike: { ...P({ ...CROUCH, ...GRIP, swap: { head: 'head-attack', torso: 'torso-side', 'foot-near': 'foot-near-toe' }, dx: 2, dy: 8, torso: 16, head: -18,
          shield: { off: [24, 10] }, feet: { near: [FEET.near[0] - 6, 9.8, 0], far: [FEET.far[0] + 6, 0, 0] }, tail: -25 }), ...SPEAR(16, -46, 0) },
      },
    },
  },
};
