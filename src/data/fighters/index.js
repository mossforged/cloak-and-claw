// Registry: every fighter id -> definition. Add new heroes/enemies here.
import mouseFighter from './mouse-fighter.js';
import ratRaider from './rat-raider.js';
import ratSpearman from './rat-spearman.js';
import ratArcher from './rat-archer.js';
export const FIGHTERS = Object.fromEntries([mouseFighter, ratRaider, ratSpearman, ratArcher].map((d) => [d.id, d]));
