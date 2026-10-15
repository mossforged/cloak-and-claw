import base from './rat-raider.js';
import KIT from '../items/rat-spear.js';
// Rat Spearman (T011): the Rat Raider's body with the spear kit (moves + AI from items/rat-spear.js) and A008 helmet + jerkin.
export default {
  ...base, id: 'rat-spearman', name: 'Rat Spearman',
  art: { ...base.art, rig: 'rat-spearman' },
  kit: KIT.id,   // drawn in his hands (render/rig.js heldOf); never dropped
  stats: { ...base.stats, maxHp: 34 },
  move: { ...base.move, walk: 1.8 },
  moves: KIT.moves, attack: KIT.attack,
  ai: { ...base.ai, ...KIT.ai },
  xp: 14, drop: null,
};
