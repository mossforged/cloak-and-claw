// Mouse Fighter pose shorthands (T023), shared by his pose files. P(spec) = rigs/biped-ik.js `pose` on his rig.
// F0 / B0: the master's ankle x (screen px from his feet centre) of the near (trailing) and far (leading) boot.
// PLANT: both boots flat where the master stands them; OUT: the turned-out near boot (A013 addendum 2) for planted poses.
import rig from './mouse-fighter.js';
import { pose, masterAt } from './biped-ik.js';

export const F0 = masterAt(rig, 'foot-front')[0], B0 = masterAt(rig, 'foot-back')[0];
export const PLANT = { front: [F0, 0, 0], back: [B0, 0, 0] };
export const OUT = { 'foot-front': 'foot-front-out' };
export const P = (spec) => pose(rig, spec);
