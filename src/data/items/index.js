// Registry: every floor item (weapon kits, food) id -> definition. Add new items here.
// rat-spear / rat-bow (T011) are enemy kits: carried by the spearman / archer (fighter `kit`), never dropped yet.
import ratCutlass from './rat-cutlass.js';
import plankClub from './plank-club.js';
import bigFish from './big-fish.js';
import cheeseWedge from './cheese-wedge.js';
import berryPie from './berry-pie.js';
import ratSpear from './rat-spear.js';
import ratBow from './rat-bow.js';
export const ITEMS = Object.fromEntries([ratCutlass, plankClub, bigFish, cheeseWedge, berryPie, ratSpear, ratBow].map((d) => [d.id, d]));
