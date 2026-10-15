// Run log: bot plays 3 minutes headless; the log must add up against independently counted bus events.
import { createWorld, stepWorld } from '../src/sim/world.js';
import { bus } from '../src/core/events.js';
import { createRunLog, summaryLines } from '../src/log/runlog.js';
import { botControl } from './bot.mjs';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };

const log = createRunLog();
let w, ref;
bus.on('hit', (e) => {
  if (e.attacker === w.player) { ref.hits++; ref.dealt += e.damage; if (e.targetPhase === 'windup') ref.cut++; }
  if (e.target === w.player) ref.taken += e.damage;
  if (e.target.team === 'enemy') ref.enemyDamage += e.damage;
});
bus.on('swing', (e) => { if (e.f === w.player) ref.swings++; });
bus.on('thrownHit', (e) => { if (e.thrower === w.player) { ref.dealt += e.damage; ref.enemyDamage += e.damage; } });

for (const seed of [1, 2, 3]) {
  w = createWorld('harbor-market', 'mouse-fighter', seed);
  ref = { hits: 0, dealt: 0, taken: 0, enemyDamage: 0, swings: 0, cut: 0 };
  log.begin(w);
  let downs = 0, wasDown = false;
  for (let i = 0; i < 60 * 180 && !w.over; i++) {
    stepWorld(w, botControl(w));
    const down = w.player.state === 'knockdown';
    if (down && !wasDown) downs++;
    wasDown = down;
  }
  const s = log.summary();
  console.log(`seed ${seed}:`, JSON.stringify(s));
  check(s.frames === w.frame && s.seconds === +(w.frame / 60).toFixed(1), 'duration');
  check(s.wave === w.wave && s.kos === w.kos && s.xp === w.xp, 'wave/kos/xp');
  check(s.hitsLanded === ref.hits && s.hitsLanded > 0, `hits landed ${s.hitsLanded} vs hit events ${ref.hits}`);
  check(s.damageDealt === ref.enemyDamage && s.damageDealt === ref.dealt, `damage dealt ${s.damageDealt} vs ${ref.enemyDamage}`);
  check(s.damageTaken === ref.taken, `damage taken ${s.damageTaken} vs ${ref.taken}`);
  check(s.swings === ref.swings && s.swings >= s.hitsLanded, `swings ${s.swings} vs ${ref.swings}`);
  check(Object.values(s.swingsByMove).reduce((a, b) => a + b, 0) === s.swings, 'swings by move add up');
  check(!('unknown' in s.swingsByMove), 'every swing has a move key');
  check(s.whiffs >= 0 && s.whiffs <= s.swings, 'whiffs in range');
  check(s.knockdowns === downs, `knockdowns ${s.knockdowns} vs observed ${downs}`);
  check(s.windupsInterrupted === ref.cut, 'windups interrupted');
  check(summaryLines(s).length === 2, 'two summary lines');
}

// A player who stands still at 1 hp gets knocked down (KO hits always knock down) and the run ends.
w = createWorld('harbor-market', 'mouse-fighter', 4);
ref = { hits: 0, dealt: 0, taken: 0, enemyDamage: 0, swings: 0, cut: 0 };
log.begin(w);
w.player.hp = 1;
for (let i = 0; i < 60 * 120 && !w.over; i++) stepWorld(w, { mx: 0, my: 0, attack: false, jump: false });
check(w.over && log.summary().knockdowns === 1 && log.summary().damageTaken === ref.taken, `idle run: over=${w.over} ${JSON.stringify(log.summary())}`);

// A fresh begin() resets the counts.
log.begin(createWorld('harbor-market', 'mouse-fighter', 9));
check(log.summary().hitsLanded === 0 && log.summary().swings === 0, 'begin resets');

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
