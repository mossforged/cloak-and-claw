// Rat telegraph (T004): a player standing where the rat attacks, who starts stepping out of the lane
// 15 frames (reaction time) after the windup starts, is out of the hit lane before the active frames.
import { createWorld, stepWorld } from '../src/sim/world.js';
import { createFighter, startMove } from '../src/sim/fighter.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RAT_BLADE } from '../src/data/moves/rat-blade.js';
import { RULES } from '../src/data/rules.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };

const REACTION = 15;
const rat = FIGHTERS['rat-raider'];

// Returns { gap, hit }: depth gap when the first active frame begins, and whether the swing connected.
function dodge(dir) {
  const w = createWorld('harbor-market', 'mouse-fighter', 1);
  const p = w.player;
  const r = createFighter(rat, p.x + rat.ai.range, p.y, { facing: -1 });   // the AI's attack spot
  w.fighters.push(r);
  startMove(r, rat.attack);
  const m = r.move, depth = m.depth ?? RULES.depthHit;
  let gap = null;
  for (let k = 0; k < m.windup + m.active; k++) {
    if (r.mf === m.windup) gap = Math.abs(p.y - r.y);
    stepWorld(w, { mx: 0, my: k >= REACTION ? dir : 0, attack: false, jump: false });
  }
  return { gap, depth, hit: p.hp < p.maxHp };
}

for (const dir of [-1, 1]) {
  const { gap, depth, hit } = dodge(dir);
  console.log(`dodge ${dir < 0 ? 'up' : 'down'}: depth gap at first active frame ${gap.toFixed(1)} (lane ${depth}), hit=${hit}`);
  check(gap > depth, `dodging ${dir < 0 ? 'up' : 'down'}: out of the lane before active frames (gap ${gap} vs ${depth})`);
  check(!hit, `dodging ${dir < 0 ? 'up' : 'down'}: the swing misses`);
}

// The test must bite: the pre-T004 numbers (windup 22, lunge 2.2) leave no time to escape.
Object.assign(RAT_BLADE.ratSlash, { windup: 22, lunge: 2.2 });
check(dodge(-1).hit, 'old numbers (windup 22) still catch a reacting player');

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
