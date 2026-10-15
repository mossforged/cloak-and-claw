// The game state and one sim step. Order: AI -> fighters -> separation -> props block -> hits (fighters, then props)
// -> thrown bodies -> shots (loosed, flying) -> KO drops -> items -> cleanup -> waves (arena) or camera + zones (scrolling, T013).
// w.bounds = the walkable belt (stage.floor on an arena; the floor inside the camera's view on a scrolling stage).
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
import { fireShots, stepShots } from './shots.js';
import { createCamera, stepCamera } from './camera.js';
import { createRun, stepZones } from './zones.js';

export function createWorld(stageId, heroId, seed = Date.now()) {
  const stage = STAGES[stageId];
  const player = createFighter(FIGHTERS[heroId], stage.playerStart.x, stage.playerStart.y);
  return {
    ...createCamera(stage), run: createRun(stage),
    stage, player, fighters: [player], frame: 0, rng: createRng(seed),
    props: createProps(stage), items: [], shots: [], itemRng: createRng(seed * 7 + 13),   // T010: own rng, so loot never shifts the fight's
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
  fireShots(w);
  stepShots(w);
  dropOnKO(w);
  stepItems(w);
  for (const f of w.fighters) if (f.remove) { w.kos++; w.xp += f.def.xp ?? 0; }
  w.fighters = w.fighters.filter((f) => !f.remove);
  if (w.run) { stepCamera(w); stepZones(w); } else stepWaves(w);
  if (!w.over && w.player.state === 'dead') { w.over = true; bus.emit('gameOver', { wave: w.wave, kos: w.kos }); }
}
