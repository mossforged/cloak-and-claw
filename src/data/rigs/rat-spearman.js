// Rat Spearman rig (T026): the A018 rat holding the spear kit (items/rat-spear.js) on the weapon node (T025), **both
// fists overhand** (A018's hand-near-grip-overhand and hand-far-grip-overhand: the rig's default hold for the spear):
// the back (near) fist low by the belt near the butt, the front (far) fist reaching out along the shaft on grip2
// (rig grips['two-hand'], IK), point angled slightly up at the enemy. weapon: { x, y, rot } = where the back fist holds
// the spear (rig px from the feet, x forward) and the shaft's screen angle (0 forward, - = up); the arms follow by IK.
// The thrust turns him side-on (A018 side torso) and pushes off the trailing toe (A019).
import rat from './rat-raider.js';
import raider, { P, CROUCH, FEET } from './rat-raider-poses.js';
import { layoutRig, apply } from '../../render/rig-layout.js';
import { STAFF } from '../items/a021-items.js';

const { run: _run, ...base } = raider;   // T029: the raider's run holds a cutlass guard (his own run: later)

// the node's placement as channels (render/rig-pose.js turns a pose's `weapon` into these; the stance needs them as is)
const SPEAR = (x, y, rot) => ({ 'weapon.x': x, 'weapon.y': y, 'weapon.at': 1, 'weapon.rot': rot, 'weapon.turn': 1 });
const GRIP = { hand: { off: [10, 20], dir: -10 } };
const SIDE = { torso: 'S', pelvis: 'S' };   // the back fist's start for the node (it re-places it)
// T029 r2 (rehearsal: two-hand overhead, far raised arm): A023's far raised arm turned `deg` from as drawn, and the staff
// placed so its second grip (the user's line, c) sits in that fist with the shaft at `rot` (screen deg); the near fist
// then takes the staff's own grip (the weapon node). The raised arm hides the far forearm, so no second-hand IK there.
const RAISE = -20;
const C = (STAFF.art.grip2[0] - STAFF.art.grip[0]) * STAFF.art.px;
function raisedFar(spec, deg, rot) {
  const pose = P({ ...spec, swap: { ...spec.swap, 'arm-far-upper': 'arm-far-raised' }, 'arm-far-upper': deg });
  const views = Object.fromEntries(Object.entries(spec.view ?? {}).map(([k, v]) => [`@view.${k}`, v]));
  const e = layoutRig(rat, pose, { ...pose.swap, ...views }).find((x) => x.name === 'arm-far-upper');
  const F = apply(e.m, ...rat.parts['arm-far-upper'].swaps['arm-far-raised'].grip), r = rot * Math.PI / 180;
  return { ...pose, ...SPEAR(F[0] - C * Math.cos(r) - (pose.dx ?? 0), F[1] - C * Math.sin(r) - (pose.dy ?? 0), rot) };
}
// T029 r3: the stance spear 4 px back, 8 px lower, 2 deg flatter (was -6, -44, -10): both wrists inside their limits
// (near 39, far 36 deg) with the fists on grip and grip2 (tools/wrist-try.mjs)
const IDLE_SPEAR = [-10, -36, -8];
const OVERHEAD_WIND = { ...CROUCH, ...GRIP, view: { torso: 'LB' }, swap: { head: 'head-effort' }, dx: -4, torso: -8, head: -4,
  feet: { near: FEET.near, far: [FEET.far[0] - 2, 2, 10] }, tail: 15 };
// T029 r3: a raised-arm pose's staff placement held by the jointed far arm instead (the grip's IK puts the fist on grip2):
// the far arm raised (shoulder up, elbow bent back over the head) as the IK's start
function jointedFar(pose, dx = 0, dy = 0) {   // dx, dy: the staff moved (rig px) so both wrists sit inside their limits
  const { 'arm-far-upper': _u, ...rest } = pose.swap;
  return { ...pose, swap: rest, 'weapon.x': pose['weapon.x'] + dx, 'weapon.y': pose['weapon.y'] + dy, 'arm-far-upper': -150, 'arm-far-lower': -40, 'hand-far': 0 };
}
const { swap: _s, ...STANCE } = P({ ...CROUCH, ...GRIP, shield: { off: [20, 12], turn: 0 } });
export default {
  ...rat, id: 'rat-spearman',
  holds: { 'rat-spear': { grip: 'overhand', grip2: 'overhand' }, 'a021-staff': { grip: 'overhand', grip2: 'overhand' } },   // T029 r2: the staff as the spear
  poses: {
    ...base,
    stance: { ...STANCE, ...SPEAR(...IDLE_SPEAR) },   // T026 r2: 2 px nearer him (the taller stance's far fist reaches it)
    idle: { ...base.idle, ...SPEAR(...IDLE_SPEAR), 'arm-near-upper': STANCE['arm-near-upper'], 'arm-near-lower': STANCE['arm-near-lower'], 'hand-near': STANCE['hand-near'],
      'arm-far-upper': [STANCE['arm-far-upper'], 3, 0.1], 'arm-far-lower': STANCE['arm-far-lower'], 'hand-far': STANCE['hand-far'] },
    walk: { ...base.walk, ...SPEAR(-4, -44, -8), swap: {}, 'arm-near-upper': STANCE['arm-near-upper'], 'arm-near-lower': STANCE['arm-near-lower'], 'hand-near': STANCE['hand-near'],
      'arm-far-upper': STANCE['arm-far-upper'], 'arm-far-lower': STANCE['arm-far-lower'], 'hand-far': STANCE['hand-far'] },
    hurt: { ...base.hurt, ...SPEAR(-8, -46, 10) },   // spear jolted point-down, both fists keep the shaft (T026 r2: 10, was 14: A022's front fist reaches it)
    moves: {
      // T029 (rehearsal: side-on chest and hips, overhand both hands, far fist over the shaft, toe-off lunge with the
      // rear boot turned out): every key on the side views (S / S); the lunge on the out-turned trailing boot
      spearThrust: {   // draws the spear back along his side (long telegraph), then drives it straight out at the enemy
        windup: { ...P({ ...CROUCH, ...GRIP, view: SIDE, swap: { head: 'head-effort' }, dx: -4, torso: 2, head: -6, shield: { off: [14, 12] },
          feet: { near: FEET.near, far: [FEET.far[0] - 2, 2, 10] }, tail: 10 }), ...SPEAR(-24, -36, -8) },   // T029 r3: was -20, -48, -6 (wrists inside their limits: tools/wrist-try.mjs)
        strike: { ...P({ ...CROUCH, ...GRIP, view: SIDE, swap: { head: 'head-attack', 'foot-near': 'foot-near-out' }, dx: 2, dy: 8, torso: 16, head: -18,
          shield: { off: [24, 10] }, feet: { near: [FEET.near[0] - 4, 0, 0], far: [FEET.far[0] + 6, 0, 0] }, tail: -25 }), ...SPEAR(8, -36, -4) },   // T029 r3: was 16, -46, 0
        recover: { ...P({ ...CROUCH, ...GRIP, view: SIDE, swap: { head: 'head-effort' }, dx: 0, dy: 4, torso: 8, head: -10, shield: { off: [18, 12] },
          feet: { near: FEET.near, far: FEET.far }, tail: -10 }), ...SPEAR(-4, -38, -6) },   // T029 r3: was 0, -46, -4
      },
      // T029 staff work (rehearsal "Staff two-hand swing / overhead"; T029 r2: with A021's staff): overhand both
      // hands; the swing winds turned away with the shaft drawn back and sweeps through toward the camera; the overhead
      // leans back with the shaft raised over his head and chops down hunched
      staffSwing: {
        windup: { ...P({ ...CROUCH, ...GRIP, view: { torso: 'BQ' }, swap: { head: 'head-effort' }, dx: -4, torso: -10, head: -2, shield: { off: [10, 4] },
          feet: { near: FEET.near, far: [FEET.far[0] - 2, 2, 10] }, tail: 15 }), ...SPEAR(-38, -54, -40) },   // T029 r3: was -26, -60, -40 (wrists inside their limits: tools/wrist-fit.mjs)
        strike: { ...P({ ...CROUCH, ...GRIP, view: { torso: 'F' }, swap: { head: 'head-attack', 'foot-near': 'foot-near-toe' }, dx: 4, dy: 8, pelvis: 5, torso: 16, head: -16,
          shield: { off: [24, 14] }, feet: { near: [FEET.near[0] - 6, 9.8, 0], far: [FEET.far[0] + 6, 0, 0] }, tail: -25 }), ...SPEAR(0, -28, -6) },   // T029 r3: was 14, -40, 14 (the shaft level: no placement nearer holds both wrists)
      },
      // T029 r3: the wind-up holds the staff with the jointed far arm (upper, forearm, overhand fist on grip2 by IK, wrist
      // inside its limit): the rigid raised-arm drawing held it only while the staff ran through its fist, and the wrist
      // limits turn the staff, so its fist ended up empty beside the shaft. Same staff placement as round 2's.
      staffOverhead: {
        windup: jointedFar(raisedFar(OVERHEAD_WIND, RAISE, -150), -14, -14),
        strike: { ...P({ ...CROUCH, ...GRIP, view: { torso: 'H' }, swap: { head: 'head-attack', 'foot-near': 'foot-near-toe' }, dx: 5, dy: 10, pelvis: 7, torso: 20, head: -20,
          shield: { off: [24, 16] }, feet: { near: [FEET.near[0] - 6, 9.8, 0], far: [FEET.far[0] + 6, 0, 0] }, tail: -25 }), ...SPEAR(12, -34, 12) },   // T029 r2: 12 (was 30): the staff's head stays over the floor
      },
    },
  },
};
