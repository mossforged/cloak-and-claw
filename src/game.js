// Browser glue: input -> sim step (with hit-stop) -> render. Owns pause, debug and restart.
import { START_STAGE, START_HERO } from './config.js';
import { readControls } from './core/input.js';
import { KEYBOARD2 } from './data/controls.js';
import { createWorld, stepWorld } from './sim/world.js';
import { createRenderer } from './render/renderer.js';
import { stepViewPose } from './render/view-pose.js';
import { RIGS } from './data/rigs/index.js';
import { withSpearHold } from './data/rigs/rat-spearman-holds.js';
import { STAGES } from './data/stages/index.js';
import { createJuice } from './render/juice.js';
import { bus } from './core/events.js';
import { createRunLog, summaryLines } from './log/runlog.js';
import { saveRun, downloadRuns } from './log/store.js';

// ?stage=harbor-market loads the old arena (T013); default START_STAGE
const Q = new URLSearchParams(location.search);
const STAGE = STAGES[Q.get('stage')] ? Q.get('stage') : START_STAGE;
// T021 test: ?heroes=2 (or 3) adds Mouse Fighters on player slots 1, 2 (tinted, render/hero-tint.js): gamepads 2 and 3,
// or ?keys2 for the second keyboard layout (arrows + numpad). Not in normal play yet.
const HEROES = Array(Math.max(1, Math.min(3, +Q.get('heroes') || 1))).fill(START_HERO);
// T022: ?ally=1 adds an AI ally (a tinted Mouse Fighter, sim/ally.js) on the next free slot. Off in normal play for now.
if (Q.get('ally') === '1' && HEROES.length < 3) HEROES.push({ id: START_HERO, ally: true });
if (Q.has('keys2')) KEYBOARD2.on = true;
// T025 view test: ?spear=B (C, D) gives spearmen an overhand hold variant (data/rigs/rat-spearman-holds.js); default E
if (Q.get('spear')) RIGS['rat-spearman'] = withSpearHold(RIGS['rat-spearman'], Q.get('spear'));
const newWorld = () => createWorld(STAGE, HEROES);

export function createGame(ctx, assets) {
  let world = newWorld();
  const renderer = createRenderer(ctx, assets);
  const juice = createJuice();
  const opts = { debug: Q.has('debug'), paused: false, rig: true, poses: [], runLines: null };
  const views = HEROES.map(() => ({ pose: null, left: 0 }));   // C test pose per hero (render-only)
  const log = createRunLog();
  log.begin(world);
  bus.on('gameOver', () => { const s = log.summary(); saveRun(s); opts.runLines = summaryLines(s); });
  window.game = { get world() { return world; }, opts, log };   // console access for debugging

  return {
    update() {
      const cs = readControls(), c = cs[0];   // slot 0 also has the view keys
      if (c.debug) opts.debug = !opts.debug;
      if (c.rig) opts.rig = !opts.rig;
      if (c.pause) opts.paused = !opts.paused;
      if (c.blockTap && world.over) downloadRuns();   // L blocks in play; on the game-over screen it downloads the run logs
      if (opts.paused) return;
      if (world.over && cs.some((k) => k.attack || k.start)) {
        world = newWorld(); renderer.reset(); juice.reset(); for (const v of views) v.pose = null; opts.poses = []; log.begin(world); opts.runLines = null;
      }
      juice.tick();
      if (juice.freeze > 0) { juice.freeze--; return; }   // hit-stop: sim and effects pause, shake continues
      stepWorld(world, cs);
      opts.poses = world.heroes.map((h, i) => stepViewPose(views[i], h, cs[i].cast, RIGS[h.def.art.rig]));   // view only: C plays the cast pose once
      renderer.tick();
    },
    render(time) { renderer.draw(world, time, juice, opts); },
  };
}
