// T021: more than one hero. One hero = the old world whichever way it is created (w.player is heroes[0]); two scripted
// heroes clear harbor-run (no stuck zone, both always on screen, enemies split their targets, never more attackers than
// the limit, none on one hero beyond maxAttackers); the camera holds the leading hero at the edge when they spread;
// game over only when both are down; enemies retarget off a downed hero; per-slot input mapping; per-hero run log.
import { createWorld, stepWorld } from '../src/sim/world.js';
import { attackLimit } from '../src/sim/ai.js';
import { setState } from '../src/sim/fighter.js';
import { readSlots, keyAction } from '../src/core/slots.js';
import { createRunLog } from '../src/log/runlog.js';
import { bus } from '../src/core/events.js';
import { RULES } from '../src/data/rules.js';
import { VIEW } from '../src/config.js';
import { botControl } from './bot.mjs';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const N = { mx: 0, my: 0, attack: false, jump: false };

// One hero, three ways to make him: same run, frame for frame
{
  const trace = (w) => { const o = []; for (let i = 0; i < 60 * 60 && !w.over; i++) { stepWorld(w, botControl(w)); if (i % 30 === 0) o.push(w.heroes[0].x.toFixed(3), w.heroes[0].hp, w.kos); } return o.join(','); };
  const a = createWorld('harbor-run', 'mouse-fighter', 4), b = createWorld('harbor-run', ['mouse-fighter'], 4), c = createWorld({ stage: 'harbor-run', heroes: ['mouse-fighter'], seed: 4 });
  check(a.player === a.heroes[0] && a.heroes.length === 1 && a.heroes[0].slot === 0 && a.heroes[0].controller.kind === 'human', 'one hero: heroes[0] (slot 0, human) = the deprecated w.player');
  check(!Object.keys(a).includes('player'), 'w.player is a hidden read-only alias');
  const ta = trace(a);
  check(ta === trace(b) && ta === trace(c), 'one hero: id, [id] and { heroes } give the same run');
}

// Two heroes: start spots from stage.heroStarts, per-slot controls, a scripted hero thinks for himself
{
  const w = createWorld('harbor-run', ['mouse-fighter', 'mouse-fighter'], 1), [h0, h1] = w.heroes;
  check(h0.x === w.stage.playerStart.x && h0.y === w.stage.playerStart.y, 'slot 0 starts on playerStart');
  check(h1.x === w.stage.heroStarts[1].x && h1.y === w.stage.heroStarts[1].y && h1.slot === 1, 'slot 1 starts on heroStarts[1]');
  stepWorld(w, [{ ...N, mx: 1 }, { ...N, my: 1 }]);
  check(h0.control.mx === 1 && h1.control.my === 1 && h1.control.mx === 0, 'array of controls: one per slot');
  stepWorld(w, { ...N, mx: -1 });
  check(h0.control.mx === -1 && h1.control.mx === 0 && h1.control.my === 0, 'a single control drives slot 0 only (others neutral)');
  h1.controller = { kind: 'script', think: () => ({ ...N, mx: 1 }) };
  stepWorld(w, [N, { ...N, mx: -1 }]);
  check(h1.control.mx === 1, 'a scripted hero ignores the passed control');
}

// Two scripted heroes clear harbor-run
const lane = (h) => (h.slot === 0 ? 455 : 470);   // lanes clear of the props
function heroBot(w, h) {
  const fighting = w.fighters.some((f) => f.team === 'enemy' && !f.entering && f.state !== 'dead');
  if (fighting) return botControl(w, h);
  return { mx: 1, my: Math.abs(h.y - lane(h)) > 3 ? Math.sign(lane(h) - h.y) : 0, attack: false, jump: false };
}
for (const seed of [1, 2, 3]) {
  const w = createWorld('harbor-run', ['mouse-fighter', 'mouse-fighter'], seed);
  for (const h of w.heroes) h.controller = { kind: 'script', think: heroBot };
  let off = 0, overLimit = 0, overOne = 0, busy = 0, split = 0, lockAt = 0, worstZone = 0, locks = 0;
  for (let i = 0; i < 60 * 600 && w.run.loop === 0 && !w.over; i++) {
    const was = w.run.locked;
    stepWorld(w, []);
    if (!was && w.run.locked) { locks++; lockAt = w.frame; }
    if (w.run.locked) worstZone = Math.max(worstZone, w.frame - lockAt);
    for (const h of w.heroes) if (h.state !== 'dead' && (h.x < w.cam.x || h.x > w.cam.x + VIEW.w)) off++;
    const tok = w.fighters.filter((f) => f.ai?.token);
    if (tok.length > attackLimit(w)) overLimit++;
    if (w.heroes.some((h) => tok.filter((f) => f.ai.target === h.slot).length > RULES.maxAttackers)) overOne++;
    const es = w.fighters.filter((f) => f.ai && !f.entering && f.state !== 'dead');
    if (es.length >= 2 && w.heroes.every((h) => h.state !== 'dead')) { busy++; if (new Set(es.map((f) => f.ai.target)).size > 1) split++; }
  }
  console.log(`2 heroes seed ${seed}: frames=${w.frame} loop=${w.run.loop} kos=${w.kos} hp=${w.heroes.map((h) => h.hp)} longest zone=${worstZone}f split=${(100 * split / Math.max(1, busy)).toFixed(0)}% of ${busy}f`);
  check(!w.over && w.run.loop === 1 && locks === w.stage.zones.length, `seed ${seed}: two heroes clear every zone and loop`);
  check(worstZone < 60 * 120, `seed ${seed}: no stuck zone (${worstZone} frames)`);
  check(off === 0, `seed ${seed}: a living hero left the screen (${off} frames)`);
  check(overLimit === 0 && overOne === 0, `seed ${seed}: attackers over the limit (${overLimit}) or over maxAttackers on one hero (${overOne})`);
  check(busy > 0 && split / busy > 0.5, `seed ${seed}: enemies split their targets (${split}/${busy} frames)`);
  check(w.heroes.every((h, i) => h.x === w.stage.heroStarts[i].x), `seed ${seed}: the loop puts both heroes back on their starts`);
}

// Spread apart: the camera holds; the leading hero stops at the right edge, the other stays on screen
{
  const w = createWorld('harbor-run', ['mouse-fighter', 'mouse-fighter'], 1), [h0, h1] = w.heroes;
  h1.y = 470;   // a lane clear of the first crate
  for (let i = 0; i < 400; i++) stepWorld(w, [N, { ...N, mx: 1 }]);
  check(w.cam.x <= h0.x - w.stage.camera.edge + 1e-9, `camera keeps the hindmost hero on screen (cam ${w.cam.x.toFixed(1)}, hero ${h0.x.toFixed(1)})`);
  check(Math.abs(h1.x - w.bounds.right) < 1e-6, `leading hero held at the right edge (x ${h1.x.toFixed(1)}, edge ${w.bounds.right})`);
  for (let i = 0; i < 200; i++) stepWorld(w, [{ ...N, mx: 1 }, N]);
  check(w.cam.x > 0, `once the hindmost catches up the camera moves on (cam ${w.cam.x.toFixed(1)})`);
  const v = createWorld('harbor-run', ['mouse-fighter', 'mouse-fighter'], 1);
  setState(v.heroes[0], 'dead');
  for (let i = 0; i < 300; i++) stepWorld(v, [N, { ...N, mx: 1 }]);
  check(v.cam.x > 0, `a downed hero doesn't hold the camera (cam ${v.cam.x.toFixed(1)})`);
}

// Game over only when every hero is down; enemies leave a downed hero for the one still up
{
  let overs = 0; bus.on('gameOver', () => overs++);
  const w = createWorld('harbor-market', ['mouse-fighter', 'mouse-fighter'], 2), [h0, h1] = w.heroes;
  for (let i = 0; i < 400; i++) stepWorld(w, N);
  check(w.fighters.some((f) => f.ai), 'a wave is in');
  h0.hp = 0; setState(h0, 'dead');
  for (let i = 0; i < RULES.targeting.stick + 5; i++) stepWorld(w, N);
  check(!w.over && overs === 0, 'one hero down: not over');
  check(h0.state === 'dead' && w.fighters.includes(h0), 'a downed hero stays down (and in the world)');
  check(w.fighters.filter((f) => f.ai).every((f) => f.ai.target === 1), 'every enemy now goes after the hero still up');
  h1.hp = 0; setState(h1, 'dead'); stepWorld(w, N);
  check(w.over && overs === 1, 'both down: game over');
}

// Per-slot input mapping
{
  const pad = (axes = [0, 0], down = []) => ({ axes, buttons: Array.from({ length: 16 }, (_, i) => ({ pressed: down.includes(i) })) });
  let s = readSlots(new Set(['KeyA', 'KeyL']), new Set(['KeyJ', 'Backquote']), [], []);
  check(s.length === 3 && s[0].mx === -1 && s[0].attack && s[0].block && s[0].debug && s[1].mx === 0 && !s[1].attack, 'keyboard drives slot 0 only');
  check(!('debug' in s[1]), 'view keys (debug, pause, rig, cast) are slot 0\'s');
  s = readSlots(new Set(['ArrowLeft']), new Set(), [], [], false);
  check(s[0].mx === -1 && s[1].mx === 0, 'second layout off: arrows move slot 0 (as before)');
  s = readSlots(new Set(['ArrowLeft', 'KeyD']), new Set(['Numpad1']), [], [], true);
  check(s[1].mx === -1 && s[1].attack && s[0].mx === 1 && !s[0].attack, 'second layout on: arrows + numpad drive slot 1, WASD slot 0');
  check(keyAction('ArrowUp', true)[0] === 1 && keyAction('ArrowUp', false)[0] === 0, 'keyAction: the layout decides the slot');
  const prevs = [], pads = [null, pad([0.9, 0], [2]), pad([0, -0.9], [0])];
  s = readSlots(new Set(), new Set(), pads, prevs);
  check(s[0].mx === 1 && s[0].attack && s[1].my === -1 && s[1].jump && !s[1].attack && s[2].mx === 0, 'connected pads in order: first = slot 0, second = slot 1');
  s = readSlots(new Set(), new Set(), pads, prevs);
  check(!s[0].attack && !s[1].jump && s[0].mx === 1, 'pad buttons count once per press, per slot; sticks stay held');
  s = readSlots(new Set(), new Set(), [pad([0, 0], [5]), null, pad(), pad([-1, 0])], []);
  check(s[0].block && s[0].blockTap && !s[1].block && s[2].mx === -1, 'third pad = slot 2; RB blocks on its own slot');
}

// Run log: slot 0 in the old fields, plus one entry per hero
{
  const log = createRunLog(), w = createWorld('harbor-market', ['mouse-fighter', 'mouse-fighter'], 3);
  log.begin(w);
  for (let i = 0; i < 60 * 40 && !w.over; i++) stepWorld(w, [botControl(w, w.heroes[0]), botControl(w, w.heroes[1])]);
  const s = log.summary();
  check(s.heroes.length === 2 && s.heroes[1].slot === 1, 'run log: one entry per hero');
  check(s.hitsLanded === s.heroes[0].hitsLanded && s.damageDealt === s.heroes[0].damageDealt && s.swings === s.heroes[0].swings, 'run log: slot 0 in the old fields');
  check(s.heroes[1].hitsLanded > 0, `run log: slot 1's hits counted on his own entry (${s.heroes[1].hitsLanded})`);
}

if (fails) { console.error(`${fails} failure(s)`); process.exit(1); }
