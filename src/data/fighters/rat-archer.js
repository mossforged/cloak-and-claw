import base from './rat-raider.js';
import KIT from '../items/rat-bow.js';
import { RAT_LOOKS, LOADOUTS } from '../looks.js';
// Rat Archer (T011): the Rat Raider's body with the bow kit (moves + AI from items/rat-bow.js); T019: A011 hood + quiver.
// Standee fallback (R) uses the art bible archer.
export default {
  ...base, id: 'rat-archer', name: 'Rat Archer',
  art: { ...base.art, idle: 'assets/art/enemies/rat-archer.png', rig: 'rat-archer', gear: LOADOUTS.archer },
  kit: KIT.id,
  stats: { ...base.stats, maxHp: 24 },
  moves: KIT.moves, attack: KIT.attack,
  ai: { ...base.ai, ...KIT.ai },
  look: RAT_LOOKS.archer,
  xp: 14, drop: null,
};
