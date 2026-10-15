// Floor weapons, breakables and food (T010): crates break after their hp and drop their item; H picks up only what is
// underfoot (an enemy in grab reach wins); food heals and is gone; weapon moves replace the sword's while held and come
// back after it breaks or is tossed; a tossed weapon knocks down the first enemy only; props block movement (rats step
// round them); KO'd rats drop cutlasses that blink out; a knockdown knocks the weapon loose; no props = old result.
import { createWorld, stepWorld } from '../src/sim/world.js';
import { createFighter } from '../src/sim/fighter.js';
import { spawnItem } from '../src/sim/props.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { ITEMS } from '../src/data/items/index.js';
import { STAGES } from '../src/data/stages/index.js';
import { RULES } from '../src/data/rules.js';
import { MOUSE_SWORD } from '../src/data/moves/mouse-sword.js';
import { bus } from '../src/core/events.js';
import { botControl } from './bot.mjs';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const N = { mx: 0, my: 0, attack: false, jump: false, block: false, grab: false };
const C = (o = {}) => ({ ...N, ...o });
const events = {};
for (const e of ['propHit', 'propBreak', 'eat', 'pickup', 'weaponThrow', 'weaponBreak', 'hit']) bus.on(e, (p) => (events[e] ??= []).push(p));
const reset = () => { for (const k in events) events[k] = []; };

// A quiet world: no waves, the stage's props unless told otherwise, the player placed.
function world(o = {}) {
  const w = createWorld('harbor-market', 'mouse-fighter', 5);
  if (o.props) w.props = w.props.filter((p) => o.props.includes(p.def.id + '@' + p.x));
  else if (o.props === null) w.props = [];
  w.waveTimer = 1e9;
  Object.assign(w.player, { x: 200, y: 432, facing: 1 }, o.player);
  return w;
}
const run = (w, n, c = N) => { for (let i = 0; i < n; i++) stepWorld(w, typeof c === 'function' ? c(i) : c); };
const rat = (w, x, y, o = {}) => { const r = createFighter(FIGHTERS['rat-raider'], x, y, { facing: -1, ...o }); w.fighters.push(r); return r; };
const settle = (w) => run(w, 60);   // let popped items land
const hold = (w, id, uses) => { w.player.weapon = { def: ITEMS[id], uses: uses ?? ITEMS[id].durability, hit: false, broken: false }; };
const swing = (w, frames = 60) => { stepWorld(w, C({ attack: true })); run(w, frames); };

// 1. Crate breaks after its hp and drops its item (stage override: the club crate)
{
  const w = world({ props: ['crate@470'], player: { x: 420, y: 412 } }); reset();
  const crate = w.props[0];
  for (let i = 0; i < crate.def.hp - 1; i++) swing(w, 40);
  check(w.props.length === 1 && crate.hp === 1, `crate still standing after ${crate.def.hp - 1} hits (hp ${crate.hp})`);
  swing(w, 60);
  check(w.props.length === 0 && events.propBreak.length === 1, 'crate breaks on its last hp');
  check(events.propHit.length === crate.def.hp, `one propHit per hit (${events.propHit.length})`);
  check(w.items.length === 1 && w.items[0].def.id === 'plank-club' && w.items[0].state === 'floor', 'club crate leaves the plank club on the floor');
  // the food crate (no override) rolls its own weighted pick: always food
  const w2 = world({ props: ['crate@640'], player: { x: 590, y: 454 } });
  for (let i = 0; i < 3; i++) swing(w2, 40);
  settle(w2);
  check(w2.items.length === 1 && w2.items[0].def.kind === 'food', 'food crate drops food');
  // rats' swings don't break crates
  const w3 = world({ props: ['crate@470'], player: { x: 150 } });
  const r = rat(w3, 520, 412); r.facing = -1;
  for (let i = 0; i < 4; i++) { r.control.attack = true; run(w3, 1); r.control.attack = false; run(w3, 80); }
  check(w3.props[0]?.hp === w3.props[0]?.def.hp, 'enemy swings leave crates alone');
}

// 2. Pickup with H only when standing on the item; an enemy in grab reach is grabbed first
{
  const w = world({ props: null });
  spawnItem(w, 'plank-club', 200 + 40, 432, 0); settle(w);
  stepWorld(w, C({ grab: true }));
  check(!w.player.weapon && w.items.length === 1, 'H does nothing with the item just out of reach (40 px)');
  w.player.x = w.items[0].x - 20; stepWorld(w, C({ grab: true }));
  check(w.player.weapon?.def.id === 'plank-club' && w.items.length === 0, 'H picks up the weapon underfoot');
  check(events.pickup?.length >= 1, 'pickup event');
  const w2 = world({ props: null });
  spawnItem(w2, 'plank-club', 200, 432, 0); settle(w2);
  rat(w2, 250, 432);
  stepWorld(w2, C({ grab: true }));
  check(w2.player.state === 'grabbing' && !w2.player.weapon, 'rat in grab reach: H grabs him, the item stays');
  run(w2, 5);
  check(w2.player.state === 'grabbing', 'walking over an item never picks it up by itself');
}

// 3. Food heals and is consumed (capped at max hp); eaten even while holding a weapon
{
  const w = world({ props: null }); reset();
  w.player.hp = 50;
  spawnItem(w, 'cheese-wedge', 200, 432, 0); spawnItem(w, 'berry-pie', 200, 432, 0); settle(w);
  stepWorld(w, C({ grab: true }));
  check(w.player.hp === 50 + ITEMS['cheese-wedge'].heal || w.player.hp === 50 + ITEMS['berry-pie'].heal, `one food eaten (hp ${w.player.hp})`);
  check(w.items.length === 1, 'eaten food is gone');
  hold(w, 'rat-cutlass'); run(w, 2);
  stepWorld(w, C({ grab: true }));
  check(w.items.length === 0 && w.player.hp === w.player.maxHp && w.player.weapon, 'holding a weapon: H eats the food underfoot (heal capped at max), weapon kept');
  check(events.eat.length === 2 && events.eat[1].heal === w.player.maxHp - (50 + events.eat[0].heal), 'eat event reports the hp actually healed');
}

// 4. Weapon moves replace the sword's while held; the sword's come back after a break or a toss
{
  const w = world({ props: null });
  hold(w, 'plank-club', 2);
  const r = rat(w, 250, 432); r.hp = r.maxHp = 999;
  stepWorld(w, C({ attack: true }));
  check(w.player.move === ITEMS['plank-club'].moves.club1, 'J while holding the club starts club1');
  run(w, 50);
  check(w.player.weapon?.uses === 1, `a landed club swing costs one use (${w.player.weapon?.uses})`);
  Object.assign(r, { x: 250, y: 432, state: 'idle', invuln: 0, vx: 0 }); reset();
  stepWorld(w, C({ attack: true }));
  run(w, 15);
  check(events.weaponBreak.length === 1, 'the last use breaks it');
  check(w.player.weapon?.broken && w.player.move, 'the empty hand finishes the swing');
  run(w, 60);
  check(w.player.weapon === null, 'broken weapon gone after the swing');
  stepWorld(w, C({ attack: true }));
  check(w.player.move === MOUSE_SWORD.slash1, 'sword moves back after the break');
  // toss: H while holding throws it, sword moves back
  const w2 = world({ props: null });
  hold(w2, 'big-fish'); reset();
  stepWorld(w2, C({ grab: true }));
  check(w2.player.state === 'toss', 'H while holding = toss');
  run(w2, w2.player.def.toss.wind + 2);
  check(!w2.player.weapon && w2.items.length === 1 && w2.items[0].state === 'fly' && events.weaponThrow.length === 1, 'weapon leaves the hand spinning');
  run(w2, 40);
  stepWorld(w2, C({ attack: true }));
  check(w2.player.move === MOUSE_SWORD.slash1, 'sword moves back after the toss');
  // a combo with a weapon chains its own moves
  const w3 = world({ props: null }); hold(w3, 'rat-cutlass');
  run(w3, 6, (i) => C({ attack: i % 2 === 0 }));
  run(w3, 12, (i) => C({ attack: i % 2 === 0 }));
  check(w3.player.moveKey === 'cut2' || w3.player.moveKey === 'cut3', `cutlass combo chains (${w3.player.moveKey})`);
}

// 5. A tossed weapon knocks down the first enemy only, then drops to the floor (one use spent)
{
  const w = world({ props: null });
  hold(w, 'plank-club');
  const a = rat(w, 330, 432), b = rat(w, 380, 432); reset();
  stepWorld(w, C({ grab: true }));
  run(w, 40);
  check(a.state === 'knockdown' || a.state === 'down', `first rat knocked down (${a.state})`);
  check(b.state === 'idle' && b.hp === b.maxHp, 'second rat untouched');
  check(events.hit.filter((e) => e.attacker === w.player).length === 1, 'one hit event from the thrower');
  run(w, 60);
  check(w.items.length === 1 && w.items[0].state === 'floor' && w.items[0].uses === ITEMS['plank-club'].durability - 1, 'it drops on the floor with one use spent');
  // a miss lands down the lane
  const w2 = world({ props: null }); hold(w2, 'rat-cutlass');
  stepWorld(w2, C({ grab: true })); run(w2, 120);
  check(w2.items[0]?.state === 'floor' && w2.items[0].x > 500, `a miss lands far down the lane (x ${Math.round(w2.items[0]?.x)})`);
}

// 6. Props block movement; a jump clears them; rats step round them
{
  const w = world({ props: ['crate@470'], player: { x: 380, y: 412 } });
  run(w, 90, C({ mx: 1 }));
  const crate = w.props[0], stop = crate.x - crate.def.body.w / 2 - w.player.def.body.w * RULES.footprint / 2;
  check(Math.abs(w.player.x - stop) < 1, `walking into the crate stops at its side (x ${w.player.x.toFixed(1)}, side ${stop})`);
  check(Math.abs(w.player.y - 412) < 1, 'and he is not pushed along the belt');
  const w2 = world({ props: ['crate@470'], player: { x: 380, y: 412 } });
  run(w2, 60, (i) => C({ mx: 1, jump: i === 10 }));
  check(w2.player.x > crate.x, `jumping over the crate clears it (x ${w2.player.x.toFixed(0)})`);
  const w3 = world({ props: ['crate@470'], player: { x: 380, y: 412 } });
  const r = createFighter(FIGHTERS['rat-raider'], 560, 412, { ai: true, facing: -1 }); w3.fighters.push(r);
  let reached = -1;
  for (let i = 0; i < 600 && reached < 0; i++) { stepWorld(w3, N); if (Math.abs(r.x - w3.player.x) < 80) reached = i; }
  check(reached >= 0, `a rat behind the crate steps round it to reach the player (${reached} frames)`);
}

// 7. KO'd rats drop their cutlass; dropped weapons blink out after floorLife, food stays
{
  const w = world({ props: null });
  const chance = FIGHTERS['rat-raider'].drop.chance;
  FIGHTERS['rat-raider'].drop.chance = 1;
  const r = rat(w, 250, 432); r.hp = 1;
  swing(w, 80);
  FIGHTERS['rat-raider'].drop.chance = chance;
  check(w.items.length === 1 && w.items[0].def.id === 'rat-cutlass' && w.items[0].state === 'floor', 'KO drops the cutlass');
  spawnItem(w, 'cheese-wedge', 600, 440, 0);
  run(w, RULES.items.floorLife + 30);
  check(!w.items.some((i) => i.def.kind === 'weapon') && w.items.some((i) => i.def.kind === 'food'), 'the cutlass vanished after floorLife; food stayed');
  let drops = 0;
  for (let s = 0; s < 40; s++) {
    const v = createWorld('harbor-market', 'mouse-fighter', s); v.waveTimer = 1e9; v.props = [];
    const e = createFighter(FIGHTERS['rat-raider'], 250, 432, { facing: -1 }); e.hp = 1; v.fighters.push(e);
    v.player.x = 200; v.player.y = 432; stepWorld(v, C({ attack: true })); run(v, 80);
    drops += v.items.length;
  }
  check(drops >= 26 && drops <= 40, `drop chance ~${chance} (${drops}/40)`);
}

// 8. A knockdown knocks the held weapon loose
{
  const w = world({ props: null }); hold(w, 'big-fish', 3);
  const r = rat(w, 260, 432); r.facing = -1;
  w.player.hp = 100;
  r.control.attack = true; run(w, 1); r.control.attack = false;
  const ko = { ...FIGHTERS['rat-raider'].moves.ratSlash, knockdown: true };
  r.move = ko; run(w, 70);
  check(!w.player.weapon && w.items.some((i) => i.def.id === 'big-fish' && i.uses === 3), 'knocked down: the fish falls to the floor with its uses');
}

// 9. Old case: a stage without props gives the same run whether or not rats drop weapons (loot never touches the fight's rng)
{
  const trace = (drop) => {
    const saved = FIGHTERS['rat-raider'].drop; FIGHTERS['rat-raider'].drop = drop;
    const props = STAGES['harbor-market'].props; STAGES['harbor-market'].props = [];
    const w = createWorld('harbor-market', 'mouse-fighter', 2);
    const out = [];
    for (let i = 0; i < 60 * 120 && !w.over; i++) { stepWorld(w, botControl(w)); if (i % 60 === 0) out.push(w.player.x.toFixed(2), w.player.hp, w.kos); }
    STAGES['harbor-market'].props = props; FIGHTERS['rat-raider'].drop = saved;
    return out.join(',') + `|${w.kos}|${w.player.hp}|items ${w.items.length}`;
  };
  const a = trace(undefined), b = trace(FIGHTERS['rat-raider'].drop);
  check(a.split('|items')[0] === b.split('|items')[0], 'no props: the fight is identical with and without weapon drops');
  check(a.endsWith('items 0') && !b.endsWith('items 0'), 'and only the drop run has items on the floor');
}

// 10. Weapon bot: picks up whatever is underfoot, smashes crates, tosses when a weapon is worn; 3 min x 3 seeds, no NaN
for (const seed of [1, 2, 3]) {
  const w = createWorld('harbor-market', 'mouse-fighter', seed); reset();
  for (let i = 0; i < 60 * 180 && !w.over; i++) {
    const c = { grab: false, ...botControl(w) }, p = w.player;
    const it = w.items.find((x) => x.state === 'floor');
    const prop = w.props[0];
    if (it && !p.weapon && i % 2 === 0) { c.mx = Math.sign(it.x - p.x); c.my = Math.sign(it.y - p.y); if (Math.abs(it.x - p.x) < 20 && Math.abs(it.y - p.y) < 8) c.grab = true; }
    else if (prop && !w.fighters.some((f) => f.team === 'enemy' && !f.entering)) { c.mx = Math.sign(prop.x - 50 - p.x); c.my = Math.sign(prop.y - p.y); c.attack = Math.abs(prop.x - 50 - p.x) < 6 && i % 8 === 0; }
    if (p.weapon?.uses === 1 && i % 30 === 0) c.grab = true;
    stepWorld(w, c);
    for (const f of [...w.fighters, ...w.items]) if (![f.x, f.y, f.z].every(Number.isFinite)) { check(false, `NaN frame ${w.frame}`); break; }
  }
  console.log(`weapon bot seed ${seed}: kos=${w.kos} hp=${w.player.hp} breaks=${events.propBreak.length} pickups=${events.pickup.length} eats=${events.eat.length} tosses=${events.weaponThrow.length} weaponBreaks=${events.weaponBreak.length}`);
  check(events.propBreak.length === 3 && events.pickup.length > 0, 'weapon bot broke every prop and used weapons');
}

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
