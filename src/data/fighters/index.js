// Registry: every fighter id -> definition. Add new heroes/enemies here.
import mouseFighter from './mouse-fighter.js';
import ratRaider from './rat-raider.js';
export const FIGHTERS = { [mouseFighter.id]: mouseFighter, [ratRaider.id]: ratRaider };
