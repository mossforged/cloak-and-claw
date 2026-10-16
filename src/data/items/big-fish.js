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
  // bend = drawn in `segs` slices, each turning `sag` of the way toward straight down (limp, hangs at the far end); `flop` = share of the wobble that bends it.
  // fling: swinging flings it straight (windup = stiffness by the windup's end, fully stiff from the strike, limp again over
  // `release` of the recovery with a springy overshoot: period s, damping).
  feel: { wobble: { period: 0.22, damping: 0.13, gain: 1.3, bob: 0.4, max: 40 }, squash: { amount: 0.32, time: 0.45 },
    bend: { segs: 10, sag: 0.24, flop: 0.85, fling: { windup: 0.6, release: 0.4, period: 0.32, damping: 0.22 } } },
};
