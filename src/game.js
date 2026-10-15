// Browser glue: input -> sim step (with hit-stop) -> render. Owns pause, debug and restart.
import { START_STAGE, START_HERO } from './config.js';
import { readControl } from './core/input.js';
import { createWorld, stepWorld } from './sim/world.js';
import { createRenderer } from './render/renderer.js';
import { createJuice } from './render/juice.js';

export function createGame(ctx, assets) {
  let world = createWorld(START_STAGE, START_HERO);
  const renderer = createRenderer(ctx, assets);
  const juice = createJuice();
  const opts = { debug: new URLSearchParams(location.search).has('debug'), paused: false, rig: true, alt: false };
  window.game = { get world() { return world; }, opts };   // console access for debugging

  return {
    update() {
      const c = readControl();
      if (c.debug) opts.debug = !opts.debug;
      if (c.rig) opts.rig = !opts.rig;
      if (c.alt) opts.alt = !opts.alt;
      if (c.pause) opts.paused = !opts.paused;
      if (opts.paused) return;
      if (world.over && (c.attack || c.start)) { world = createWorld(START_STAGE, START_HERO); renderer.reset(); juice.reset(); }
      juice.tick();
      if (juice.freeze > 0) { juice.freeze--; return; }   // hit-stop: sim and effects pause, shake continues
      stepWorld(world, c);
      renderer.tick();
    },
    render(time) { renderer.draw(world, time, juice, opts); },
  };
}
