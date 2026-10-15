// Browser glue: input -> sim step (with hit-stop) -> render. Owns pause, debug and restart.
import { START_STAGE, START_HERO } from './config.js';
import { readControl } from './core/input.js';
import { createWorld, stepWorld } from './sim/world.js';
import { createRenderer } from './render/renderer.js';
import { createJuice } from './render/juice.js';
import { bus } from './core/events.js';
import { createRunLog, summaryLines } from './log/runlog.js';
import { saveRun, downloadRuns } from './log/store.js';

export function createGame(ctx, assets) {
  let world = createWorld(START_STAGE, START_HERO);
  const renderer = createRenderer(ctx, assets);
  const juice = createJuice();
  const opts = { debug: new URLSearchParams(location.search).has('debug'), paused: false, rig: true, pose: null, runLines: null };
  const log = createRunLog();
  log.begin(world);
  bus.on('gameOver', () => { const s = log.summary(); saveRun(s); opts.runLines = summaryLines(s); });
  window.game = { get world() { return world; }, opts, log };   // console access for debugging

  return {
    update() {
      const c = readControl();
      if (c.debug) opts.debug = !opts.debug;
      if (c.rig) opts.rig = !opts.rig;
      if (c.cast) opts.pose = opts.pose ? null : 'cast';   // view only: hero's rig holds the cast pose
      if (c.pause) opts.paused = !opts.paused;
      if (c.log) downloadRuns();
      if (c.framing) cycleFraming(world.stage, opts);
      if (opts.paused) return;
      if (world.over && (c.attack || c.start)) {
        world = createWorld(START_STAGE, START_HERO); renderer.reset(); juice.reset(); log.begin(world); opts.runLines = null;
      }
      juice.tick();
      if (juice.freeze > 0) { juice.freeze--; return; }   // hit-stop: sim and effects pause, shake continues
      stepWorld(world, c);
      renderer.tick();
    },
    render(time) { renderer.draw(world, time, juice, opts); },
  };
}

// T006 test: copy the next stage framing into the live stage data; the banner names it.
function cycleFraming(stage, opts) {
  const list = stage.framings;
  if (!list) return;
  opts.framing = ((opts.framing ?? 0) + 1) % list.length;
  const f = list[opts.framing];
  Object.assign(stage.art, f.art); Object.assign(stage.floor, f.floor);
  opts.banner = { text: `Framing ${opts.framing + 1}/${list.length}: ${f.name}  (F = next)`, until: performance.now() + 4000 };
}
