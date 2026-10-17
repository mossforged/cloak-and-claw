// Mouse Fighter pose shorthands (T023), shared by his pose files. P(spec) = rigs/biped-ik.js `pose` on his rig.
// NEAR / FAR: the master's ankle x (screen px from his feet centre) of the near (trailing) and far (leading) boot.
// PLANT: both boots flat where the master stands them; OUT: the turned-out near boot (A013 addendum 2) for planted poses.
import rig from './mouse-fighter.js';
import { pose, masterAt } from './biped-ik.js';

export const NEAR = masterAt(rig, 'foot-near')[0], FAR = masterAt(rig, 'foot-far')[0];
export const PLANT = { near: [NEAR, 0, 0], far: [FAR, 0, 0] };
export const OUT = { 'foot-near': 'foot-near-out' };
export const P = (spec) => pose(rig, spec);
