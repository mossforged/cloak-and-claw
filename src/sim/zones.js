// Wave zones on a scrolling stage (T013, Golden Axe flow). w.run = { zone, locked, queue, cleared, loop }.
// The camera stops at the next zone's lock point (sim/camera.js); then the zone locks: its enemies walk in from the
// screen edges (alternating right/left, RULES.zoneStagger frames apart, at most RULES.enemyCap at once). When the last
// one is gone the camera unlocks and `cleared` is set (the HUD's GO arrow) until the next zone locks. After the last
// zone, walking to stage.end loops the stage with tougher enemies (like the arena's wave loop). Uses w.rng only.
import { RULES } from '../data/rules.js';
import { FIGHTERS } from '../data/fighters/index.js';
import { VIEW } from '../config.js';
import { bus } from '../core/events.js';
import { createFighter } from './fighter.js';
import { pickLook } from './looks.js';
import { createProps } from './props.js';
import { lockX, fitBounds } from './camera.js';

export const createRun = (stage) => (stage.zones ? { zone: 0, locked: false, queue: [], spawnT: 0, n: 0, cleared: false, loop: 0 } : null);

export function stepZones(w) {
  const run = w.run, cam = w.cam, zones = w.stage.zones;
  if (!run.locked) {
    const z = zones[run.zone];
    if (z && cam.x >= lockX(z)) {
      cam.x = lockX(z); cam.locked = run.locked = true; run.cleared = false;
      run.queue = [...z.enemies]; run.spawnT = 0; run.n = 0;
      w.wave++;
      bus.emit('wave', { n: w.wave });
    } else if (!z && w.player.x >= w.stage.end) loopStage(w);
    return;
  }
  const alive = w.fighters.filter((f) => f.team === 'enemy').length;
  if (run.queue.length) {
    if (--run.spawnT <= 0 && alive < RULES.enemyCap) { spawn(w, run.queue.shift(), run.n++); run.spawnT = RULES.zoneStagger; }
  } else if (!alive) {
    cam.locked = run.locked = false; run.zone++; run.cleared = true;
  }
}

function spawn(w, id, i) {
  const side = i % 2 === 0 ? 1 : -1, b = w.bounds;
  const x = side > 0 ? w.cam.x + VIEW.w + 40 : w.cam.x - 40;
  const y = w.rng.range(b.top + 10, b.bottom - 10);
  const e = createFighter(FIGHTERS[id], x, y, { ai: true, entering: true, facing: -side });
  e.look = pickLook(e.def, w.lookRng);   // T019: render-only individual look
  if (w.run.loop) e.hp = e.maxHp = Math.round(e.maxHp * (1 + 0.3 * w.run.loop));
  w.fighters.push(e);
}

// Back to the start, tougher: fresh props, floor cleared.
function loopStage(w) {
  const run = w.run, s = w.stage;
  run.loop++; run.zone = 0; run.cleared = false;
  w.cam.x = 0;
  w.player.x = s.playerStart.x; w.player.y = s.playerStart.y;
  w.props = createProps(s); w.items = []; w.shots = [];
  fitBounds(w);
}
