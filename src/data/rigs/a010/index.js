// The A010 rat family as it was before T026 (view only): kept so the model viewer can show the old rat beside the
// rebuilt one (src/viewer/models.js VERSIONS, version 'a010'). Not in the game's registry; art in
// assets/art/enemies/rat-raider/rig-a010/. Delete this folder (and that art) once the user has locked the new rat.
import raider from './rat-raider.js';
import raiderPoses from './rat-raider-poses.js';
import spearman from './rat-spearman.js';
import archer from './rat-archer.js';
export const RAT_A010 = { 'rat-raider': { ...raider, poses: raiderPoses }, 'rat-spearman': spearman, 'rat-archer': archer };
