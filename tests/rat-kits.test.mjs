// Rat weapon kits (T011): spearman thrust and archer arrow are escapable at reaction time (like T004's rat-telegraph),
// arrows fly along the lane, are stopped by the shield, one in flight per archer; the archer keeps his distance and
// holds an attack token while drawing; old-waves bot run = main's exact numbers (the cutlass rat is unchanged).
import { createWorld, stepWorld } from '../src/sim/world.js';
import { createFighter, startMove } from '../src/sim/fighter.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { STAGES } from '../src/data/stages/index.js';
import { RULES } from '../src/data/rules.js';
import { bus } from '../src/core/events.js';
import { botControl } from './bot.mjs';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const REACTION = 15;
const C = (o = {}) => ({ mx: 0, my: 0, attack: false, jump: false, block: false, grab: false, ...o });
const events = {};
for (const e of ['hit', 'block', 'shot']) bus.on(e, (p) => (events[e] ??= []).push(p));
const reset = () => { for (const k of ['hit', 'block', 'shot']) events[k] = []; };

function arena(enemyId, dx, o = {}) {
  const w = createWorld('harbor-market', 'mouse-fighter', 1);
  w.waveTimer = 1e9; w.props = [];
  const p = w.player;
  Object.assign(p, { x: 300, y: 432, facing: 1 });
  const e = createFighter(FIGHTERS[enemyId], p.x + dx, p.y, { facing: -1, ...o });
  w.fighters.push(e);
  reset();
  return { w, p, e };
}

// Spear thrust: a player at the spearman's attack spot who steps out of the lane 15 frames in is clear before it lands.
function thrust(dir) {
  const { w, p, e } = arena('rat-spearman', FIGHTERS['rat-spearman'].ai.range);
  startMove(e, 'spearThrust');
  const m = e.move, depth = m.depth ?? RULES.depthHit;
  let gap = null;
  for (let k = 0; k < m.windup + m.active + 2; k++) {
    if (e.mf === m.windup) gap = Math.abs(p.y - e.y);
    stepWorld(w, C({ my: dir && k >= REACTION ? dir : 0 }));
  }
  return { gap, depth, hit: p.hp < p.maxHp };
}
for (const dir of [-1, 1]) {
  const r = thrust(dir);
  console.log(`spear dodge ${dir < 0 ? 'up' : 'down'}: gap ${r.gap.toFixed(1)} at the thrust (lane ${r.depth}), hit=${r.hit}`);
  check(r.gap > r.depth && !r.hit, `spear: stepping ${dir < 0 ? 'up' : 'down'} after ${REACTION} frames escapes`);
}
check(thrust(0).hit, 'spear: standing still at his spot gets hit (the thrust reaches)');

// Arrow: shot from the archer's spot; stepping out of the lane 15 frames into the draw escapes; standing still is hit.
function arrow(ctl, o = {}) {
  const { w, p, e } = arena('rat-archer', FIGHTERS['rat-archer'].ai.range, o);
  startMove(e, 'bowShot');
  let maxShots = 0, k = 0;
  for (; k < 200 && (k < e.move?.windup + 2 || w.shots.length); k++) {
    stepWorld(w, C(ctl(k)));
    maxShots = Math.max(maxShots, w.shots.length);
  }
  return { w, p, e, hit: events.hit.filter((h) => h.target === p).length, blocks: events.block.length, shots: events.shot.length, maxShots, k };
}
for (const dir of [-1, 1]) {
  const r = arrow((k) => ({ my: k >= REACTION ? dir : 0 }));
  check(r.shots === 1 && r.hit === 0, `arrow: stepping ${dir < 0 ? 'up' : 'down'} after ${REACTION} frames, the arrow flies past (shots ${r.shots}, hits ${r.hit})`);
}
const still = arrow(() => ({}));
check(still.hit === 1 && still.p.hp === still.p.maxHp - FIGHTERS['rat-archer'].moves.bowShot.shot.damage, `arrow: standing in the lane is hit once for its damage (hp ${still.p.hp})`);
check(still.w.shots.length === 0 && still.maxShots === 1, 'arrow: gone after the hit');

// Shield: blocking toward the archer stops the arrow (no damage, block event, arrow gone, archer not shoved).
const bl = arrow(() => ({ block: true }));
check(bl.blocks === 1 && bl.hit === 0 && bl.p.hp === bl.p.maxHp && bl.w.shots.length === 0, `arrow: the shield stops it (blocks ${bl.blocks}, hp ${bl.p.hp})`);
check(bl.e.x === 300 + FIGHTERS['rat-archer'].ai.range, `arrow: a blocked arrow does not shove the archer (x ${bl.e.x})`);
// Facing away while blocking: it lands in his back.
const back = arrow((k) => (k === 0 ? { mx: -1 } : k === 1 ? {} : { block: true }));
check(back.hit === 1 && back.blocks === 0, 'arrow: blocking with your back to it does not stop it');

// AI: the archer backs off when you come close, takes an attack token for the draw, one arrow in flight at a time.
{
  const { w, p, e } = arena('rat-archer', 200, { ai: true });
  e.ai.cool = 0;
  let token = 0, drawn = 0, inFlight = 0, x0 = e.x;
  for (let i = 0; i < 60 * 20; i++) {
    stepWorld(w, C({ mx: Math.abs(e.x - p.x) > 90 ? Math.sign(e.x - p.x) : 0 }));   // chase him
    if (e.state === 'attack') { drawn++; if (e.ai.token) token++; }
    inFlight = Math.max(inFlight, w.shots.filter((s) => s.owner === e).length);
    check(w.fighters.filter((f) => f.ai?.token).length <= RULES.maxAttackers, 'archer: token limit');
  }
  console.log(`archer AI: drew ${drawn} frames (token ${token}), shots ${events.shot.length}, max in flight ${inFlight}`);
  check(drawn > 0 && token === drawn, 'archer: holds an attack token whenever he is drawing');
  check(inFlight === 1 && events.shot.length >= 2, 'archer: shoots, one arrow in flight at a time');
  const { w: w2, p: p2, e: e2 } = arena('rat-archer', 260, { ai: true });
  for (let i = 0; i < 40; i++) { p2.x = 300 + i * 3; stepWorld(w2, C()); }
  check(e2.x > 300 + 260 + 20, `archer: backs off as the player walks in (x ${e2.x.toFixed(0)})`);
}

// Old case: Harbor Market with the pre-T011 waves (cutlass rats only) gives main's exact bot numbers.
{
  const H = STAGES['harbor-market'], waves = H.waves;
  H.waves = [2, 3, 4].map((n) => ({ enemies: Array(n).fill('rat-raider') }));
  const MAIN = { 1: '10800 12 32 84', 2: '10800 12 32 84', 3: '10800 12 33 76' };
  for (const seed of [1, 2, 3]) {
    const w = createWorld('harbor-market', 'mouse-fighter', seed);
    for (let i = 0; i < 60 * 180 && !w.over; i++) stepWorld(w, botControl(w));
    const got = `${w.frame} ${w.wave} ${w.kos} ${w.player.hp}`;
    check(got === MAIN[seed], `old waves seed ${seed}: ${got} = main ${MAIN[seed]}`);
  }
  H.waves = waves;
}

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
