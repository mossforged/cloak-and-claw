// T022 helping: a lone hero still dies at 0 hp; with a friend he goes downed (enemies leave him, timer, bleeds out);
// holding grab by him for RULES.revive.frames gets him up (letting go or a hit cancels); potions are carried, tossed
// to the friend in front (heals on landing, a moving one too; nobody there = a floor pickup) or drunk; the AI ally
// steps out of a telegraphed lane, picks up a downed player-hero, tosses potions; two scripted heroes + an ally clear harbor-run.
import { createWorld, stepWorld } from '../src/sim/world.js';
import { createFighter, startMove, setState } from '../src/sim/fighter.js';
import { spawnItem } from '../src/sim/props.js';
import { reviveProgress } from '../src/sim/revive.js';
import { dangerTo } from '../src/sim/ally.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { ITEMS } from '../src/data/items/index.js';
import { RULES } from '../src/data/rules.js';
import { ALLY } from '../src/data/ally.js';
import { VIEW } from '../src/config.js';
import { bus } from '../src/core/events.js';
import { botControl } from './bot.mjs';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const N = { mx: 0, my: 0, attack: false, jump: false, block: false, grab: false, grabHeld: false, use: false };
const R = RULES.revive, P = RULES.potions, POT = ITEMS['health-potion'];
const ALLY_HERO = { id: 'mouse-fighter', ally: true };
const events = (name) => { const got = []; bus.on(name, (e) => got.push(e)); return got; };
const revives = events('revive'), heals = events('heal'), hits = events('hit'), swings = events('swing');

// Puts a hero at 0 hp on the floor ('down'); the next RULES.knockdown.downFrames steps decide dead or downed.
function knockOut(w, h) { h.hp = 0; setState(h, 'down'); for (let i = 0; i <= RULES.knockdown.downFrames; i++) stepWorld(w, []); }
const rat = (w, id, x, y, facing) => { const r = createFighter(FIGHTERS[id], x, y, { ai: true, facing }); w.fighters.push(r); return r; };

// A lone hero dies as before; with a friend he is downed, then bleeds out
{
  const w = createWorld('harbor-run', 'mouse-fighter', 1);
  knockOut(w, w.heroes[0]);
  check(w.heroes[0].state === 'dead' && w.over, 'a lone hero at 0 hp is dead and the game is over (old case)');
  const v = createWorld('harbor-run', ['mouse-fighter', 'mouse-fighter'], 1), [h0] = v.heroes;
  knockOut(v, h0);
  check(h0.state === 'downed' && h0.downT === RULES.downed.frames - 1 && !v.over, `with a friend he is downed (${h0.state}, timer ${h0.downT})`);
  for (let i = 0; i < RULES.downed.frames; i++) stepWorld(v, []);
  check(h0.state === 'dead' && !v.over, 'the downed timer runs out: out for the fight, the friend fights on');
  const u = createWorld('harbor-run', ['mouse-fighter', 'mouse-fighter'], 1);
  knockOut(u, u.heroes[0]); knockOut(u, u.heroes[1]);
  check(u.over, 'every hero downed: game over');
}

// Holding grab by a downed friend picks him up; letting go or a hit cancels
{
  const w = createWorld('harbor-run', ['mouse-fighter', 'mouse-fighter'], 1), [h0, h1] = w.heroes;
  h1.x = h0.x + 40; h1.y = h0.y;
  knockOut(w, h0);
  stepWorld(w, [N, { ...N, grab: true, grabHeld: true }]);
  check(h1.state === 'revive' && h1.revive.target === h0, 'grab by a downed friend starts the pick-up');
  for (let i = 0; i < 20; i++) stepWorld(w, [N, { ...N, grabHeld: true }]);
  check(reviveProgress(h1) > 0.2 && h0.state === 'downed', `progress fills while held (${reviveProgress(h1).toFixed(2)})`);
  const t = h0.downT;
  stepWorld(w, [N, { ...N, grabHeld: true }]);
  check(h0.downT === t, 'the downed timer waits while he is being picked up');
  stepWorld(w, [N, N]);
  check(h1.state === 'idle' && h0.state === 'downed' && !h1.revive, 'letting go stops the pick-up');
  stepWorld(w, [N, { ...N, grab: true, grabHeld: true }]);
  let k = 0;
  while (h0.state === 'downed' && k++ < 200) stepWorld(w, [N, { ...N, grabHeld: true }]);
  check(k === R.frames, `held for revive.frames (${k} vs ${R.frames}) he gets up`);
  check(h0.state === 'getup' && h0.hp === Math.round(h0.maxHp * R.hpShare) && h0.invuln > RULES.knockdown.getupFrames, `up with ${R.hpShare * 100}% health and invulnerable (hp ${h0.hp})`);
  check(revives.at(-1)?.f === h1 && revives.at(-1)?.target === h0, 'revive event');

  const v = createWorld('harbor-run', ['mouse-fighter', 'mouse-fighter'], 1), [a, b] = v.heroes;
  b.x = a.x + 40; b.y = a.y;
  knockOut(v, a);
  const r = rat(v, 'rat-raider', b.x + FIGHTERS['rat-raider'].ai.range, b.y, -1);
  r.ai.cool = 999;   // hold his own brain off: we swing for him
  stepWorld(v, [N, { ...N, grab: true, grabHeld: true }]);
  r.x = b.x + r.def.ai.range; r.facing = -1; r.control.mx = 0;
  startMove(r, r.def.attack);
  for (let i = 0; i < 60 && b.state === 'revive'; i++) stepWorld(v, [N, { ...N, grabHeld: true }]);
  check(b.state === 'hurt' && a.state === 'downed' && !b.revive, `a hit stops the pick-up (${b.state}, friend ${a.state})`);
}

// Enemies leave a downed hero alone and go after the one still up
{
  const w = createWorld('harbor-run', ['mouse-fighter', 'mouse-fighter'], 2), [h0, h1] = w.heroes;
  h1.x = h0.x + 420; h1.y = 455;
  knockOut(w, h0);
  const r = rat(w, 'rat-raider', h0.x + 60, h0.y, -1);
  const before = hits.length, swung = swings.length;
  for (let i = 0; i < 120; i++) stepWorld(w, [N, N]);
  check(r.ai.target === 1, 'the enemy targets the hero still up');
  check(!hits.slice(before).some((e) => e.target === h0) && !swings.slice(swung).some((e) => e.f === r && Math.abs(r.x - h1.x) > 150), 'nobody swings at the downed hero');
  check(Math.abs(r.x - h1.x) < Math.abs(h0.x + 60 - h1.x), 'he walks off toward the other hero');
}

// Potions: pick up into the slot (one only), toss to the friend in front (moving too), floor pickup when nobody's there, drink
{
  const w = createWorld('harbor-run', ['mouse-fighter', 'mouse-fighter'], 1), [h0, h1] = w.heroes;
  const lay = (x, y) => { const it = spawnItem(w, 'health-potion', x, y, 0, { vx: 0, vz: 0 }); it.state = 'floor'; return it; };
  lay(h0.x, h0.y); lay(h0.x + 4, h0.y);
  stepWorld(w, [{ ...N, grab: true }, N]);
  check(h0.potion === POT && h0.state === 'idle', 'grab on a potion puts it in the potion slot');
  stepWorld(w, [{ ...N, grab: true }, N]);
  check(w.items.filter((i) => i.def === POT).length === 1, 'one potion slot: the second stays on the floor');
  w.items = [];
  h0.facing = 1; h1.x = h0.x + 180; h1.y = h0.y + 24; h1.hp = 40;
  stepWorld(w, [{ ...N, use: true }, N]);
  check(h0.state === 'potion', 'use starts the potion');
  let k = 0;
  while (!heals.some((e) => e.f === h1) && k++ < 120) stepWorld(w, [N, N]);
  check(h1.hp === 40 + POT.heal && !h0.potion, `a tap tosses it to the friend in front; it heals on landing (hp ${h1.hp}, ${k} frames)`);
  check(heals.at(-1)?.by === h0 && heals.at(-1)?.heal === POT.heal, 'heal event: who, how much');
  // a friend walking away still catches it
  h0.potion = POT; h1.x = h0.x + 150; h1.y = h0.y; h1.hp = 30; setState(h1, 'idle');
  stepWorld(w, [{ ...N, use: true }, { ...N, mx: 1 }]);
  for (let i = 0; i < 60; i++) stepWorld(w, [N, { ...N, mx: 1 }]);
  check(h1.hp === 30 + POT.heal, `a moving friend still gets it (hp ${h1.hp}, x ${h1.x.toFixed(0)})`);
  // nobody hurt there: it lands as a pickup
  h0.potion = POT; h1.hp = h1.maxHp;
  stepWorld(w, [{ ...N, use: true }, N]);
  for (let i = 0; i < 60; i++) stepWorld(w, [N, N]);
  check(w.items.some((i) => i.def === POT && i.state === 'floor'), 'a friend at full health: it lands on the floor as a pickup');
  // hold: drink it himself
  w.items = []; h0.potion = POT; h0.hp = 20;
  for (let i = 0; i < P.drinkHold + P.drink + 4; i++) stepWorld(w, [{ ...N, use: true }, N]);
  check(h0.hp === 20 + POT.heal && !h0.potion && heals.at(-1)?.f === h0, `holding use drinks it (hp ${h0.hp})`);
}

// Solo: no potion drops (old game), crates still drop their food
{
  let pots = 0;
  for (const seed of [1, 2, 3]) {
    const w = createWorld('harbor-market', 'mouse-fighter', seed);
    for (let i = 0; i < 60 * 120 && !w.over; i++) { stepWorld(w, botControl(w)); pots += w.items.filter((it) => it.def === POT).length; }
  }
  check(pots === 0, 'a lone hero sees no potion drops');
  let co = 0;
  for (const seed of [1, 2, 3, 4, 5, 6]) {
    const w = createWorld('harbor-run', ['mouse-fighter', 'mouse-fighter'], seed);
    for (const p of w.props) { p.hp = 1; }
    for (const p of [...w.props]) { const h = w.heroes[0]; h.x = p.x - 50; h.y = p.y; h.facing = 1; startMove(h, 'slash1'); for (let i = 0; i < 30; i++) stepWorld(w, []); }
    co += w.items.filter((it) => it.def === POT).length;
  }
  check(co > 0, `with two heroes some crates drop potions (${co})`);
}

// Ally, rule 1: in a rat's lane during the windup, he has left it by the strike frame
for (const id of ['rat-raider', 'rat-spearman']) {
  for (const dy of [0, -6, 6]) {
    const w = createWorld('harbor-run', ['mouse-fighter', ALLY_HERO], 1), [h0, al] = w.heroes;
    h0.x = 600; al.x = 400; al.y = 450 + dy; al.facing = 1;
    const def = FIGHTERS[id], r = rat(w, id, al.x + def.ai.range, 450, -1);
    r.ai.cool = 999;
    startMove(r, r.def.attack);
    const m = r.move, lane = m.depth ?? RULES.depthHit, hp = al.hp;
    let gap = null;
    for (let k = 0; k < m.windup + m.active; k++) { if (r.mf === m.windup) gap = Math.abs(al.y - r.y); stepWorld(w, []); }
    check(gap > lane && al.hp === hp, `${id} dy ${dy}: ally out of the lane by the strike (gap ${gap?.toFixed(1)} vs ${lane}, hp ${al.hp})`);
  }
}
{
  const w = createWorld('harbor-run', ['mouse-fighter', ALLY_HERO], 1), [, al] = w.heroes;
  const r = rat(w, 'rat-raider', al.x + 400, al.y, -1);
  startMove(r, r.def.attack); r.mf = ALLY.react + 1;
  check(!dangerTo(w, al), 'a windup far out of reach is no danger');
}

// Ally, rule 2: picks up a downed player-hero in a fight
for (const seed of [1, 2, 3]) {
  const w = createWorld('harbor-run', ['mouse-fighter', ALLY_HERO], seed), [h0, al] = w.heroes;
  al.x = h0.x + 200;
  rat(w, 'rat-raider', h0.x + 330, h0.y, -1);
  const n = revives.length;
  knockOut(w, h0);
  for (let i = 0; i < RULES.downed.frames && h0.state === 'downed'; i++) stepWorld(w, []);
  check(revives.slice(n).some((e) => e.f === al && e.target === h0), `seed ${seed}: the ally picks up the downed player-hero (${h0.state}, ally ${al.state} hp ${al.hp})`);
}

// Ally, rule 3: tosses his potion to a hurt player-hero
{
  const w = createWorld('harbor-run', ['mouse-fighter', ALLY_HERO], 1), [h0, al] = w.heroes;
  al.potion = POT; h0.hp = 30;
  for (let i = 0; i < 120 && h0.hp === 30; i++) stepWorld(w, []);
  check(h0.hp === 30 + POT.heal && !al.potion, `the ally tosses his potion to a hurt friend (hp ${h0.hp})`);
  al.potion = POT; al.hp = 20; h0.hp = h0.maxHp;
  for (let i = 0; i < 120 && al.hp === 20; i++) stepWorld(w, []);
  check(al.hp === 20 + POT.heal, `alone and low he drinks it (hp ${al.hp})`);
}

// Ally: floor potions are the player's first (the ally only fetches one once the player carries one)
{
  const w = createWorld('harbor-run', ['mouse-fighter', ALLY_HERO], 1), [h0, al] = w.heroes;
  al.x = h0.x + 100; al.y = h0.y;
  const it = spawnItem(w, 'health-potion', al.x + 30, al.y, 0, { vx: 0, vz: 0 }); it.state = 'floor';
  for (let i = 0; i < 120; i++) stepWorld(w, []);
  check(!al.potion && w.items.includes(it), 'the ally leaves a floor potion for an empty-handed player');
  h0.potion = POT; al.x = it.x - 60; al.y = it.y;
  for (let i = 0; i < 180 && !al.potion; i++) stepWorld(w, []);
  check(al.potion === POT, 'once the player carries one, the ally fetches the next');
}

// Two scripted heroes + one ally clear harbor-run
const lane = (h) => (h.slot === 0 ? 455 : 470);
function heroBot(w, h) {
  const fighting = w.fighters.some((f) => f.team === 'enemy' && !f.entering && f.state !== 'dead');
  if (fighting) return botControl(w, h);
  return { mx: 1, my: Math.abs(h.y - lane(h)) > 3 ? Math.sign(lane(h) - h.y) : 0, attack: false, jump: false };
}
for (const seed of [1, 2, 3]) {
  const w = createWorld('harbor-run', ['mouse-fighter', 'mouse-fighter', ALLY_HERO], seed), al = w.heroes[2];
  for (const h of w.heroes.slice(0, 2)) h.controller = { kind: 'script', think: heroBot };
  const n = hits.length;
  let off = 0;
  for (let i = 0; i < 60 * 600 && w.run.loop === 0 && !w.over; i++) {
    stepWorld(w, []);
    for (const h of w.heroes) if (h.state !== 'dead' && (h.x < w.cam.x - 1 || h.x > w.cam.x + VIEW.w + 1)) off++;
  }
  const mine = hits.slice(n).filter((e) => e.attacker.team === 'hero'), byAlly = mine.filter((e) => e.attacker === al).length;
  console.log(`2 heroes + ally seed ${seed}: frames=${w.frame} loop=${w.run.loop} kos=${w.kos} hp=${w.heroes.map((h) => h.hp)} ally hits ${byAlly}/${mine.length}`);
  check(!w.over && w.run.loop === 1, `seed ${seed}: two heroes and an ally clear every zone`);
  check(off === 0, `seed ${seed}: everyone stays on screen (${off} frames off)`);
  check(byAlly > 0 && byAlly < mine.length * 0.4, `seed ${seed}: the ally helps without taking over (${byAlly} of ${mine.length} hits)`);
}

if (fails) { console.error(`${fails} failure(s)`); process.exit(1); }
console.log('ALL OK');
