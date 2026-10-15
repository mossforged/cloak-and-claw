import { PLANK_CLUB } from '../moves/plank-club.js';
// Weapon kit (T010); fields: see rat-cutlass.js.
export default {
  id: 'plank-club', name: 'Plank Club', kind: 'weapon',
  art: { img: 'assets/art/items/plank-club.png', px: 0.38, grip: [40, 48], rest: 0 },
  grip: 'one-hand', durability: 10,
  moves: PLANK_CLUB, attack: 'club1',
  toss: { damage: 14, spin: 0.45, hitstop: 9, shake: 8 },
};
