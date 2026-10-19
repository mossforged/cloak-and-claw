// Rat Spearman rig (T026): the A018 rat holding the spear kit (items/rat-spear.js) on the weapon node (T025), **both
// fists overhand** (A018's hand-near-grip-overhand and hand-far-grip-overhand: the rig's default hold for the spear):
// the back (near) fist low by the belt near the butt, the front (far) fist reaching out along the shaft on grip2
// (rig grips['two-hand'], IK), point angled slightly up at the enemy. weapon: { x, y, rot } = where the back fist holds
// the spear (rig px from the feet, x forward) and the shaft's screen angle (0 forward, - = up); the arms follow by IK.
// The thrust turns him side-on (A018 side torso) and pushes off the trailing toe (A019).
import rat from './rat-raider.js';
import raider, { P, CROUCH, FEET } from './rat-raider-poses.js';

const { run: _run, ...base } = raider;   // T029: the raider's run holds a cutlass guard (his own run: later)

// the node's placement as channels (render/rig-pose.js turns a pose's `weapon` into these; the stance needs them as is)
const SPEAR = (x, y, rot) => ({ 'weapon.x': x, 'weapon.y': y, 'weapon.at': 1, 'weapon.rot': rot, 'weapon.turn': 1 });
const GRIP = { hand: { off: [10, 20], dir: -10 } };
const SIDE = { torso: 'S', pelvis: 'S' };   // the back fist's start for the node (it re-places it)
const { swap: _s, ...STANCE } = P({ ...CROUCH, ...GRIP, shield: { off: [20, 12], turn: 0 } });
export default {
  ...rat, id: 'rat-spearman',
  holds: { 'rat-spear': { grip: 'overhand', grip2: 'overhand' } },
  poses: {
    ...base,
    stance: { ...STANCE, ...SPEAR(-6, -44, -10) },   // T026 r2: 2 px nearer him (the taller stance's far fist reaches it)
    idle: { ...base.idle, ...SPEAR(-6, -44, -10), 'arm-near-upper': STANCE['arm-near-upper'], 'arm-near-lower': STANCE['arm-near-lower'], 'hand-near': STANCE['hand-near'],
      'arm-far-upper': [STANCE['arm-far-upper'], 3, 0.1], 'arm-far-lower': STANCE['arm-far-lower'], 'hand-far': STANCE['hand-far'] },
    walk: { ...base.walk, ...SPEAR(-4, -44, -8), swap: {}, 'arm-near-upper': STANCE['arm-near-upper'], 'arm-near-lower': STANCE['arm-near-lower'], 'hand-near': STANCE['hand-near'],
      'arm-far-upper': STANCE['arm-far-upper'], 'arm-far-lower': STANCE['arm-far-lower'], 'hand-far': STANCE['hand-far'] },
    hurt: { ...base.hurt, ...SPEAR(-8, -46, 10) },   // spear jolted point-down, both fists keep the shaft (T026 r2: 10, was 14: A022's front fist reaches it)
    moves: {
      // T029 (rehearsal: side-on chest and hips, overhand both hands, far fist over the shaft, toe-off lunge with the
      // rear boot turned out): every key on the side views (S / S); the lunge on the out-turned trailing boot
      spearThrust: {   // draws the spear back along his side (long telegraph), then drives it straight out at the enemy
        windup: { ...P({ ...CROUCH, ...GRIP, view: SIDE, swap: { head: 'head-effort' }, dx: -4, torso: 2, head: -6, shield: { off: [14, 12] },
          feet: { near: FEET.near, far: [FEET.far[0] - 2, 2, 10] }, tail: 10 }), ...SPEAR(-20, -48, -6) },
        strike: { ...P({ ...CROUCH, ...GRIP, view: SIDE, swap: { head: 'head-attack', 'foot-near': 'foot-near-out' }, dx: 2, dy: 8, torso: 16, head: -18,
          shield: { off: [24, 10] }, feet: { near: [FEET.near[0] - 4, 0, 0], far: [FEET.far[0] + 6, 0, 0] }, tail: -25 }), ...SPEAR(16, -46, 0) },
        recover: { ...P({ ...CROUCH, ...GRIP, view: SIDE, swap: { head: 'head-effort' }, dx: 0, dy: 4, torso: 8, head: -10, shield: { off: [18, 12] },
          feet: { near: FEET.near, far: FEET.far }, tail: -10 }), ...SPEAR(0, -46, -4) },
      },
      // T029 staff work (rehearsal "Staff two-hand swing / overhead"; the spear stands in for a staff): overhand both
      // hands; the swing winds turned away with the shaft drawn back and sweeps through toward the camera; the overhead
      // leans back with the shaft raised over his head and chops down hunched
      staffSwing: {
        windup: { ...P({ ...CROUCH, ...GRIP, view: { torso: 'BQ' }, swap: { head: 'head-effort' }, dx: -4, torso: -10, head: -2, shield: { off: [10, 4] },
          feet: { near: FEET.near, far: [FEET.far[0] - 2, 2, 10] }, tail: 15 }), ...SPEAR(-26, -60, -40) },
        strike: { ...P({ ...CROUCH, ...GRIP, view: { torso: 'F' }, swap: { head: 'head-attack', 'foot-near': 'foot-near-toe' }, dx: 4, dy: 8, pelvis: 5, torso: 16, head: -16,
          shield: { off: [24, 14] }, feet: { near: [FEET.near[0] - 6, 9.8, 0], far: [FEET.far[0] + 6, 0, 0] }, tail: -25 }), ...SPEAR(14, -40, 20) },
      },
      staffOverhead: {
        windup: { ...P({ ...CROUCH, ...GRIP, view: { torso: 'LB' }, swap: { head: 'head-effort' }, dx: -4, torso: -8, head: -4, shield: { off: [12, -20] },
          feet: { near: FEET.near, far: [FEET.far[0] - 2, 2, 10] }, tail: 15 }), ...SPEAR(-8, -86, -150) },
        strike: { ...P({ ...CROUCH, ...GRIP, view: { torso: 'H' }, swap: { head: 'head-attack', 'foot-near': 'foot-near-toe' }, dx: 5, dy: 10, pelvis: 7, torso: 20, head: -20,
          shield: { off: [24, 16] }, feet: { near: [FEET.near[0] - 6, 9.8, 0], far: [FEET.far[0] + 6, 0, 0] }, tail: -25 }), ...SPEAR(12, -34, 30) },
      },
    },
  },
};
