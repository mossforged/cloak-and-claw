// Browser glue: input -> sim step (with hit-stop) -> render. Owns pause, debug and restart.
import { START_STAGE, START_HERO } from './config.js';
import { readControl } from './core/input.js';
import { createWorld, stepWorld } from './sim/world.js';
import { createRenderer } from './render/renderer.js';
import { stepViewPose } from './render/view-pose.js';
import { RIGS } from './data/rigs/index.js';
import { STAGES } from './data/stages/index.js';
import { createJuice } from './render/juice.js';
import { bus } from './core/events.js';
import { createRunLog, summaryLines } from './log/runlog.js';
import { saveRun, downloadRuns } from './log/store.js';
import { setupWalkTest } from './render/walk-test.js';   // TEMPORARY (T018 round 2): V cycles the rat walks

// ?stage=harbor-market loads the old arena (T013); default START_STAGE
const STAGE = (() => { const id = new URLSearchParams(location.search).get('stage'); return STAGES[id] ? id : START_STAGE; })();

export function createGame(ctx, assets) {
  let world = createWorld(STAGE, START_HERO);
  const renderer = createRenderer(ctx, assets);
  setupWalkTest();
  const juice = createJuice();
  const opts = { debug: new URLSearchParams(location.search).has('debug'), paused: false, rig: true, pose: null, runLines: null };
  const view = { pose: null, left: 0 };   // C test pose (render-only)
  const log = createRunLog();
  log.begin(world);
  bus.on('gameOver', () => { const s = log.summary(); saveRun(s); opts.runLines = summaryLines(s); });
  window.game = { get world() { return world; }, opts, log };   // console access for debugging

  return {
    update() {
      const c = readControl();
      if (c.debug) opts.debug = !opts.debug;
      if (c.rig) opts.rig = !opts.rig;
      if (c.pause) opts.paused = !opts.paused;
      if (c.blockTap && world.over) downloadRuns();   // L blocks in play; on the game-over screen it downloads the run logs
      if (opts.paused) return;
      if (world.over && (c.attack || c.start)) {
        world = createWorld(STAGE, START_HERO); renderer.reset(); juice.reset(); view.pose = opts.pose = null; log.begin(world); opts.runLines = null;
      }
      juice.tick();
      if (juice.freeze > 0) { juice.freeze--; return; }   // hit-stop: sim and effects pause, shake continues
      stepWorld(world, c);
      opts.pose = stepViewPose(view, world.player, c.cast, RIGS[world.player.def.art.rig]);   // view only: C plays the cast pose once
      renderer.tick();
    },
    render(time) { renderer.draw(world, time, juice, opts); },
  };
}
