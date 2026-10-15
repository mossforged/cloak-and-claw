import { BIG_FISH } from '../moves/big-fish.js';
// Weapon kit (T010); fields: see rat-cutlass.js. Held by the tail.
export default {
  id: 'big-fish', name: 'Big Fish', kind: 'weapon',
  art: { img: 'assets/art/items/big-fish.png', px: 0.4, grip: [34, 46], rest: 0 },
  grip: 'one-hand', durability: 8,
  moves: BIG_FISH, attack: 'fishSlap',
  toss: { damage: 12, spin: 0.35, hitstop: 9, shake: 8 },
};
