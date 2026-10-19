// Rat Raider pose kit (T029, split out of rat-raider-poses.js so the move files can share it): the pose helper on the rig's
// views, the master ankle x, the menace crouch, the cutlass guard and the stance every pose starts from. Notes on each
// number: rat-raider-poses.js (T026 r2-r4).
import rig from './rat-raider.js';
import { pose, masterAt } from './biped-ik.js';
import { viewRig } from '../../render/rig-views.js';

// T028: a pose that names its views (`view: { torso: 'F' }`) is placed on that view's own joint points
export const P = (spec) => pose(spec.view ? viewRig(rig, spec.view) : rig, spec);
export const NEAR = masterAt(rig, 'foot-near')[0], FAR = masterAt(rig, 'foot-far')[0];
export const FEET = { near: [NEAR - 4, 0, 0], far: [FAR + 10, 0, 0] };
export const CROUCH = { dy: 1, pelvis: 3, torso: 6, head: -6, feet: FEET, tail: -10, 'tail-2': 15, 'tail-3': 20, 'scarf-tail': 0 };
export const HOLD = { off: [2, 14], dir: -105 };
export const TAIL = (a, b, c) => ({ tail: a, 'tail-2': b, 'tail-3': c });
export const FIST = { 'hand-far': 'hand-far-fist' };
export const { swap: _s, ...STANCE } = P({ ...CROUCH, swap: FIST, hand: HOLD, shield: { off: [16, 22], turn: -40 } });
