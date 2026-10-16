import { BIG_FISH } from '../moves/big-fish.js';
// Weapon kit (T010); fields: see rat-cutlass.js. Held by the tail.
export default {
  id: 'big-fish', name: 'Big Fish', kind: 'weapon',
  art: { img: 'assets/art/items/big-fish.png', px: 0.4, grip: [34, 46], rest: 0 },
  grip: 'one-hand', durability: 8,
  moves: BIG_FISH, attack: 'fishSlap',
  toss: { damage: 12, spin: 0.35, hitstop: 9, shake: 8 },
  // feel (T017, view only, render/weapon-feel.js): wobble = a floppy spring on the held fish (period s, damping ratio,
  // gain = share of the hand's change of turn it lags, bob = degrees per px/s of body bob, max degrees);
  // squash = on each slap that lands, squashed by `amount` along its length, then a stretch, settled in `time` s.
  feel: { wobble: { period: 0.2, damping: 0.16, gain: 0.9, bob: 0.25, max: 28 }, squash: { amount: 0.32, time: 0.45 } },
};
