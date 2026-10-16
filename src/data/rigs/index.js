// Registry: rig id -> { ...rig, poses }. A fighter uses a rig when its art block says rig: '<id>'.
// brace (T015): the bracing loop while blocking (render/brace.js); only rigs that block have one.
// Rat spearman/archer (T011) are variants of the rat rig that come with their poses (and gear parts) built in.
import mouseFighter from './mouse-fighter.js';
import mouseFighterPoses from './mouse-fighter-poses.js';
import mouseFighterBrace from './mouse-fighter-brace.js';
import ratRaider from './rat-raider.js';
import ratRaiderPoses from './rat-raider-poses.js';
import ratSpearman from './rat-spearman.js';
import ratArcher from './rat-archer.js';
export const RIGS = {
  [mouseFighter.id]: { ...mouseFighter, poses: mouseFighterPoses, brace: mouseFighterBrace },
  [ratRaider.id]: { ...ratRaider, poses: ratRaiderPoses },
  [ratSpearman.id]: ratSpearman,
  [ratArcher.id]: ratArcher,
};
