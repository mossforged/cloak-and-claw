// Headless smoke test: runs the sim with a bot for 3 minutes of game time and checks invariants.
// Run via: npm test
import { createWorld, stepWorld } from '../src/sim/world.js';
import { bus } from '../src/core/events.js';
import { botControl } from './bot.mjs';

const counts = {};
for (const e of ['hit', 'swing', 'land', 'wave', 'defeated', 'gameOver']) bus.on(e, () => (counts[e] = (counts[e] ?? 0) + 1));

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };

for (const seed of [1, 2, 3]) {
  const w = createWorld('harbor-market', 'mouse-fighter', seed);
  for (let i = 0; i < 60 * 180 && !w.over; i++) {
    stepWorld(w, botControl(w));
    for (const f of w.fighters) {
      if (![f.x, f.y, f.z, f.hp].every(Number.isFinite)) { check(false, `NaN on ${f.def.id} frame ${w.frame}`); break; }
    }
    check(w.fighters.filter((f) => f.ai?.token).length <= 1, 'more attackers than allowed');
  }
  console.log(`seed ${seed}: frames=${w.frame} wave=${w.wave} kos=${w.kos} playerHp=${w.player.hp} over=${w.over}`);
  check(w.kos > 0, 'bot never defeated an enemy');
}
console.log('events:', counts);
check(counts.hit > 0 && counts.wave > 0, 'no hits or waves happened');
console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
