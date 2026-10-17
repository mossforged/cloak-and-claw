import { RAT_SPEAR } from '../moves/rat-spear.js';
// Weapon kit (T011): the Rat Spearman's spear. grip 'two-hand': drawn in the rig's two-hand slot (the near fist, low by
// the hip, on `grip` near the butt); the far hand closes on `grip2` mid-shaft (render/rig-grip.js IK). rest 90: the image
// is drawn point-up (on the floor it lies point forward: `floor` 90). ai: what a fighter carrying this kit does (merged over
// its own ai). Same fields as rat-cutlass.js. T020: A012 art (keyed x0.4; points from its weapons.json); px keeps the
// grip-to-point length of A004's spear (128 px), so the 140 px thrust still ends at the point; gripEnd = A012's grip2 (shaft line); T020 round 2: grip2 62 px out from the grip (A012's 50) so the
// front arm reaches out along the shaft instead of folding at the chest.
export default {
  id: 'rat-spear', name: 'Spear', kind: 'weapon',
  art: { img: 'assets/art/items/rat-spear.png', px: 0.292, grip: [31.6, 438.8], gripEnd: [31.6, 266.8], grip2: [31.6, 226.5], tip: [32.4, 0.8], rest: 90, floor: 90, stow: 'back' },
  grip: 'two-hand', durability: 10,
  moves: RAT_SPEAR, attack: 'spearThrust',
  toss: { damage: 10, spin: 0.3, hitstop: 7, shake: 6 },
  ai: { range: 140, hover: 230, think: [24, 56], cooldown: [70, 130], aggression: 0.5 },
};
