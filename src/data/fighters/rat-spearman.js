import base from './rat-raider.js';
import KIT from '../items/rat-spear.js';
import { RAT_LOOKS, LOADOUTS } from '../looks.js';
// Rat Spearman (T011): the Rat Raider's body with the spear kit (moves + AI from items/rat-spear.js) ; T019: A011 helmet + jerkin.
export default {
  ...base, id: 'rat-spearman', name: 'Rat Spearman',
  art: { ...base.art, rig: 'rat-spearman', gear: LOADOUTS.spearman },
  kit: KIT.id,   // drawn in his hands (render/rig.js heldOf); never dropped
  stats: { ...base.stats, maxHp: 34 },
  move: { ...base.move, walk: 1.8 },
  moves: KIT.moves, attack: KIT.attack,
  ai: { ...base.ai, ...KIT.ai },
  look: RAT_LOOKS.spearman,
  xp: 14, drop: null,
};
