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
import { startOf, heroesUp } from './heroes.js';

// createWorld(stageId, heroes, seed): heroes = one fighter id or an array (order = player slot, T021); also
// createWorld({ stage, heroes, seed }). w.heroes[i] has `slot` and `controller` ({ kind: 'human', index } by default;
// tests may set { kind: 'script', think(w, f) -> control }; 'ai' allies later). w.player = w.heroes[0], deprecated.
export function createWorld(stageId, heroIds, seed = Date.now()) {
  if (typeof stageId === 'object') ({ stage: stageId, heroes: heroIds, seed = Date.now() } = stageId);
  const stage = STAGES[stageId], ids = [heroIds].flat();
  const heroes = ids.map((id, slot) => {
    const at = startOf(stage, slot), h = createFighter(FIGHTERS[id], at.x, at.y);
    return Object.assign(h, { slot, controller: { kind: 'human', index: slot } });
  });
  const w = {
    ...createCamera(stage), run: createRun(stage),
    stage, heroes, fighters: [...heroes], frame: 0, rng: createRng(seed),
    props: createProps(stage), items: [], shots: [], itemRng: createRng(seed * 7 + 13),   // T010: own rng, so loot never shifts the fight's
    lookRng: createRng(seed * 11 + 5),   // T019: enemy looks (sim/looks.js), render only, own rng
    wave: 0, waveTimer: 40, kos: 0, xp: 0, over: false,
  };
  Object.defineProperty(w, 'player', { get: () => w.heroes[0], enumerable: false });   // deprecated alias: use w.heroes
  return w;
}

const NEUTRAL = { mx: 0, my: 0, attack: false, jump: false, block: false, grab: false };

// control: slot 0's control object, or an array with one per slot (missing = neutral). A scripted hero thinks for itself.
export function stepWorld(w, control) {
  w.frame++;
  for (const h of w.heroes) {
    const c = h.controller.kind === 'script' ? h.controller.think(w, h) : Array.isArray(control) ? control[h.slot] : h.slot === 0 ? control : null;
    Object.assign(h.control, w.over || !c ? NEUTRAL : c);
  }
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
  if (!w.over && !heroesUp(w).length) { w.over = true; bus.emit('gameOver', { wave: w.wave, kos: w.kos }); }
}
