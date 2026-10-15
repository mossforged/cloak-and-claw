// Registry: every floor item (weapon kits, food) id -> definition. Add new items here.
import ratCutlass from './rat-cutlass.js';
import plankClub from './plank-club.js';
import bigFish from './big-fish.js';
import cheeseWedge from './cheese-wedge.js';
import berryPie from './berry-pie.js';
export const ITEMS = Object.fromEntries([ratCutlass, plankClub, bigFish, cheeseWedge, berryPie].map((d) => [d.id, d]));
