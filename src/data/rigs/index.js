// Registry: rig id -> { ...rig, poses }. A fighter uses a rig when its art block says rig: '<id>'.
import mouseFighter from './mouse-fighter.js';
import mouseFighterPoses from './mouse-fighter-poses.js';
export const RIGS = { [mouseFighter.id]: { ...mouseFighter, poses: mouseFighterPoses } };
