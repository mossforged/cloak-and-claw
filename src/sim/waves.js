// Spawns stage.waves in order, then loops them with tougher enemies.
import { RULES } from '../data/rules.js';
import { FIGHTERS } from '../data/fighters/index.js';
import { bus } from '../core/events.js';
import { createFighter } from './fighter.js';
import { pickLook } from './looks.js';

export function stepWaves(w) {
  if (w.fighters.some((f) => f.team === 'enemy')) return;
  if (--w.waveTimer > 0) return;
  const list = w.stage.waves, fl = w.stage.floor;
  const loop = Math.floor(w.wave / list.length);
  const wave = list[w.wave % list.length];
  w.wave++;
  wave.enemies.forEach((id, i) => {
    const side = i % 2 === 0 ? 1 : -1;
    const x = side > 0 ? fl.right + 50 + i * 30 : fl.left - 50 - i * 30;
    const y = w.rng.range(fl.top + 10, fl.bottom - 10);
    const e = createFighter(FIGHTERS[id], x, y, { ai: true, entering: true, facing: -side });
    e.look = pickLook(e.def, w.lookRng);   // T019: render-only individual look
    if (loop) e.hp = e.maxHp = Math.round(e.maxHp * (1 + 0.3 * loop));
    w.fighters.push(e);
  });
  w.waveTimer = RULES.waveDelay;
  bus.emit('wave', { n: w.wave });
}
