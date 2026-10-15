import { RAT_SPEAR } from '../moves/rat-spear.js';
// Weapon kit (T011): the Rat Spearman's spear. grip 'two-hand': drawn in the rig's two-hand slot (the near fist, low by
// the hip, on `grip` near the butt); the far hand closes on `grip2` mid-shaft (render/rig-grip.js IK). rest 90: the image
// is drawn point-up. ai: what a fighter carrying this kit does (merged over its own ai). Same fields as rat-cutlass.js.
export default {
  id: 'rat-spear', name: 'Spear', kind: 'weapon',
  art: { img: 'assets/art/items/rat-spear.png', px: 0.2, grip: [30, 640], grip2: [30, 480], rest: 90 },
  grip: 'two-hand', durability: 10,
  moves: RAT_SPEAR, attack: 'spearThrust',
  toss: { damage: 10, spin: 0.3, hitstop: 7, shake: 6 },
  ai: { range: 140, hover: 230, think: [24, 56], cooldown: [70, 130], aggression: 0.5 },
};
