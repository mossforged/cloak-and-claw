// The game state and one sim step. Order: AI -> fighters -> separation -> props block -> hits (fighters, then props)
// -> thrown bodies -> KO drops -> items -> cleanup -> waves.
import { FIGHTERS } from '../data/fighters/index.js';
import { STAGES } from '../data/stages/index.js';
import { RULES } from '../data/rules.js';
import { bus } from '../core/events.js';
import { createRng } from '../core/rng.js';
import { createFighter, updateFighter } from './fighter.js';
import { resolveHits } from './combat.js';
import { resolveThrown } from './grab.js';
import { thinkAI, separate } from './ai.js';
import { createProps, hitProps, blockProps, stepItems, dropOnKO } from './props.js';
import { stepWaves } from './waves.js';

export function createWorld(stageId, heroId, seed = Date.now()) {
  const stage = STAGES[stageId];
  const player = createFighter(FIGHTERS[heroId], stage.playerStart.x, stage.playerStart.y);
  return {
    stage, player, fighters: [player], frame: 0, rng: createRng(seed),
    props: createProps(stage), items: [], itemRng: createRng(seed * 7 + 13),   // T010: own rng, so loot never shifts the fight's
    wave: 0, waveTimer: 40, kos: 0, xp: 0, over: false,
  };
}

const NEUTRAL = { mx: 0, my: 0, attack: false, jump: false, block: false, grab: false };

export function stepWorld(w, control) {
  w.frame++;
  Object.assign(w.player.control, w.over ? NEUTRAL : control);
  for (const f of w.fighters) if (f.ai) thinkAI(f, w);
  for (const f of w.fighters) updateFighter(f, w);
  separate(w);
  blockProps(w);
  resolveHits(w);
  hitProps(w);
  resolveThrown(w);
  dropOnKO(w);
  stepItems(w);
  for (const f of w.fighters) if (f.remove) { w.kos++; w.xp += f.def.xp ?? 0; }
  w.fighters = w.fighters.filter((f) => !f.remove);
  stepWaves(w);
  if (!w.over && w.player.state === 'dead') { w.over = true; bus.emit('gameOver', { wave: w.wave, kos: w.kos }); }
}
