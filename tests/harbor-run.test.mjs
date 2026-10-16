// T013: scrolling Harbor Market. A scripted player walks right and clears every zone of harbor-run (3 seeds): no stuck
// locks, every rat type shows up, enemies never spawn or stand off the floor, archers stay on screen, arrows vanish
// off screen, the camera only moves forward and holds still while locked. The arena keeps the old bounds object.
import { createWorld, stepWorld } from '../src/sim/world.js';
import { bus } from '../src/core/events.js';
import { RULES } from '../src/data/rules.js';
import { VIEW } from '../src/config.js';
import { botControl } from './bot.mjs';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };

// Arena: no camera, bounds are the stage's own floor (so every arena number stays as before)
const a = createWorld('harbor-market', 'mouse-fighter', 1);
check(a.cam === null && a.run === null && a.bounds === a.stage.floor, 'arena: no camera/run, bounds = stage.floor');

// Bot: fight the nearest rat that has walked in; with none, walk right along a lane clear of the props
function runBot(w) {
  const c = botControl(w);
  const fighting = w.fighters.some((f) => f.team === 'enemy' && !f.entering && f.state !== 'dead');
  if (fighting) return c;
  return { mx: 1, my: Math.abs(w.player.y - 455) > 3 ? Math.sign(455 - w.player.y) : 0, attack: false, jump: false };
}

let shotsSeen = 0, shotsOnScreen = 0;
bus.on('shot', ({ f }) => { const w = cur; if (!w?.cam) return; shotsSeen++; if (f.x >= w.cam.x && f.x <= w.cam.x + VIEW.w) shotsOnScreen++; });
let cur = null;

for (const seed of [1, 2, 3]) {
  const w = createWorld('harbor-run', 'mouse-fighter', seed); cur = w;
  const zones = w.stage.zones, types = new Set(), locks = [];
  let camJumps = 0, worstX = 0, worstY = 0, lastCam = 0, lockFrame = 0, worstZone = 0, maxEnemies = 0, offFloor = 0, offScreen = 0, arrowsOff = 0, backScroll = 0, lockedMoves = 0, hpMin = w.player.hp;
  for (let i = 0; i < 60 * 600 && w.run.loop === 0 && !w.over; i++) {
    const wasLocked = w.run.locked, camBefore = w.cam.x;
    stepWorld(w, runBot(w));
    if (w.cam.x < camBefore - 1e-9 && w.run.loop === 0) backScroll++;
    if (w.cam.x - camBefore > w.stage.camera.catchUp + 1e-9 && w.run.loop === 0) camJumps++;
    if (wasLocked && w.run.locked && w.cam.x !== camBefore) lockedMoves++;
    if (!wasLocked && w.run.locked) { locks.push(w.run.zone); lockFrame = w.frame; }
    if (w.run.locked) worstZone = Math.max(worstZone, w.frame - lockFrame);
    const es = w.fighters.filter((f) => f.team === 'enemy');
    maxEnemies = Math.max(maxEnemies, es.length);
    for (const e of es) {
      types.add(e.def.id);
      // (separation may nudge a rat up to a pixel past the clamp for a frame, as in the arena)
      if (e.y < w.bounds.top - 2 || e.y > w.bounds.bottom + 2 || !Number.isFinite(e.x)) { offFloor++; worstY = Math.max(worstY, w.bounds.top - e.y, e.y - w.bounds.bottom); }
      if (!e.entering && (e.x < w.bounds.left - 2 || e.x > w.bounds.right + 2)) { offScreen++; worstX = Math.max(worstX, w.bounds.left - e.x, e.x - w.bounds.right); }
    }
    for (const s of w.shots) if (s.x < w.cam.x - 100 || s.x > w.cam.x + VIEW.w + 100) arrowsOff++;
    check(w.fighters.filter((f) => f.ai?.token).length <= RULES.maxAttackers, `seed ${seed}: more attackers than allowed`);
    hpMin = Math.min(hpMin, w.player.hp);
    lastCam = w.cam.x;
  }
  console.log(`seed ${seed}: frames=${w.frame} zones locked=${locks.join(',')} loop=${w.run.loop} kos=${w.kos} hp=${w.player.hp} (min ${hpMin}) longest zone=${worstZone}f max on screen=${maxEnemies} types=${[...types].join(',')}`);
  check(!w.over, `seed ${seed}: bot died`);
  check(w.run.loop === 1, `seed ${seed}: reached the end and looped`);
  check(locks.join() === zones.map((_, i) => i).join(), `seed ${seed}: every zone locked once, in order`);
  check(worstZone < 60 * 120, `seed ${seed}: a zone stayed locked ${worstZone} frames (stuck?)`);
  check(['rat-raider', 'rat-spearman', 'rat-archer'].every((t) => types.has(t)), `seed ${seed}: all three rat types present`);
  check(maxEnemies <= RULES.enemyCap, `seed ${seed}: at most ${RULES.enemyCap} enemies at once (saw ${maxEnemies})`);
  check(offFloor === 0, `seed ${seed}: enemies off the floor belt (${offFloor} frames, worst ${worstY.toFixed(1)} px)`);
  check(offScreen === 0, `seed ${seed}: enemies outside the screen bounds after walking in (${offScreen}, worst ${worstX.toFixed(1)} px)`);
  check(arrowsOff === 0, `seed ${seed}: arrows flying on off screen (${arrowsOff})`);
  check(backScroll === 0 && lockedMoves === 0, `seed ${seed}: camera scrolled back (${backScroll}) or moved while locked (${lockedMoves})`);
  check(camJumps === 0, `seed ${seed}: camera moved more than catchUp px in a frame (${camJumps})`);
  check(w.kos === zones.reduce((n, z) => n + z.enemies.length, 0), `seed ${seed}: KOs = every zone's rats`);
  check(lastCam === 0 && w.player.x === w.stage.playerStart.x, `seed ${seed}: loop puts camera and player back at the start`);
}
check(shotsSeen > 0 && shotsOnScreen === shotsSeen, `archers shot only from on screen (${shotsOnScreen}/${shotsSeen})`);

// Locked zone: an archer the player chases to the screen edge stops there (never backs off screen) and still shoots
{
  const w = createWorld('harbor-run', 'mouse-fighter', 4); cur = w;
  const z = w.stage.zones[2], saved = z.enemies;
  z.enemies = ['rat-archer'];
  let shots = 0, minX = Infinity, maxX = -Infinity;
  const off = bus.on('shot', () => shots++);
  for (let i = 0; i < 60 * 90 && !(w.run.locked && w.run.zone === 2); i++) stepWorld(w, runBot(w));
  for (let i = 0; i < 60 * 40 && w.run.locked; i++) {   // the bot stays put on the left: the archer keeps away to the right edge
    w.player.hp = w.player.maxHp;
    const ar = w.fighters.find((f) => f.def.id === 'rat-archer' && !f.entering);
    if (ar) { minX = Math.min(minX, ar.x); maxX = Math.max(maxX, ar.x); }
    stepWorld(w, { mx: w.player.x > w.cam.x + 120 ? -1 : 0, my: 0, attack: false, jump: false });
  }
  z.enemies = saved; off?.();
  console.log(`archer in zone 3: x ${minX.toFixed(0)}..${maxX.toFixed(0)} (screen ${w.cam.x + 30}..${w.cam.x + VIEW.w - 30}), shots ${shots}`);
  check(maxX <= w.cam.x + VIEW.w - w.stage.camera.edge && minX >= w.cam.x + w.stage.camera.edge, 'archer stays inside the locked screen');
  check(shots > 0, 'archer shoots inside the locked zone');
}

// Unlock with the player at the right edge: the camera glides at catchUp px/frame (no snap / shudder)
{
  const w = createWorld('harbor-run', 'mouse-fighter', 1); cur = w;
  w.stage.zones[0].enemies = [];   // stand-in: a zone that clears at once
  for (let i = 0; i < 60 * 30 && !w.run.locked; i++) stepWorld(w, runBot(w));
  w.player.x = w.bounds.right;   // he walked to the right edge during the fight
  const lockedAt = w.cam.x, steps = [];
  for (let i = 0; i < 120; i++) { const x0 = w.cam.x; stepWorld(w, { mx: 0, my: 0 }); steps.push(w.cam.x - x0); }
  w.stage.zones[0].enemies = ['rat-raider', 'rat-raider', 'rat-raider'];
  check(Math.max(...steps) <= w.stage.camera.catchUp && w.cam.x > lockedAt + 300, `unlock glides (max step ${Math.max(...steps)}, moved ${w.cam.x - lockedAt})`);
}

// Rough play (random mash of grab, jump attacks, block, wandering) never throws and never stalls a zone: 20 seeds
{
  const { createRng } = await import('../src/core/rng.js');
  let bad = 0;
  for (let seed = 1; seed <= 20; seed++) {
    const w = createWorld('harbor-run', 'mouse-fighter', seed), r = createRng(seed * 31); cur = w;
    w.player.hp = w.player.maxHp = 1e6;
    let mode = 0, lockT = 0, err = null;
    for (let i = 0; i < 60 * 600 && w.run.loop === 0; i++) {
      if (i % 90 === 0) mode = r.int(0, 4);
      let c = runBot(w);
      if (mode === 1) c = { ...c, grab: i % 5 === 0 };
      if (mode === 2) c = { ...c, jump: i % 40 === 0, attack: i % 7 === 0 };
      if (mode === 3 && w.run.locked) c = { mx: r.int(-1, 1), my: r.int(-1, 1), attack: i % 9 === 0, grab: i % 13 === 0 };
      if (mode === 4) c = { ...c, block: i % 60 < 30 };
      try { stepWorld(w, c); } catch (e) { err = e.message; break; }
      lockT = w.run.locked ? lockT + 1 : 0;
      if (lockT > 60 * 120) break;
    }
    if (err || w.run.loop === 0) { bad++; console.error(`rough play seed ${seed}: ${err ?? 'stalled at zone ' + (w.run.zone + 1)}`); }
  }
  check(bad === 0, `rough play: ${bad}/20 seeds crashed or stalled`);
}

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
