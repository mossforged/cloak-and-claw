// Draw order: backdrop -> stage -> shadows -> fighters (sorted by depth; rig or standee) -> effects -> HUD -> debug.
import { VIEW } from '../config.js';
import { drawBackdrop, drawStage } from './backdrop.js';
import { drawShadow, drawStandee } from './standee.js';
import { drawRig } from './rig.js';
import { RIGS } from '../data/rigs/index.js';
import { drawHud, drawPaused } from './hud.js';
import { drawDebug } from './debug.js';
import { createEffects } from './effects.js';

export function createRenderer(ctx, assets) {
  const fx = createEffects();
  return {
    fx,
    reset: () => fx.clear(),
    tick: () => fx.update(),
    draw(world, time, juice, opts) {
      ctx.imageSmoothingQuality = 'high';
      drawBackdrop(ctx, world.stage, VIEW, time);
      ctx.save();
      ctx.translate(juice.ox, juice.oy);
      drawStage(ctx, world.stage, assets);
      const sorted = [...world.fighters].sort((a, b) => a.y - b.y);
      for (const f of sorted) drawShadow(ctx, f);
      for (const f of sorted) {
        const rig = opts.rig !== false && RIGS[f.def.art.rig];   // R toggles rig vs standee
        if (rig) drawRig(ctx, f, rig, assets, time, fx.flashOf(f.id));
        else drawStandee(ctx, f, assets, time, fx.flashOf(f.id));
      }
      fx.draw(ctx);
      ctx.restore();
      drawHud(ctx, world, assets, VIEW);
      if (opts.debug) drawDebug(ctx, world, juice);
      if (opts.paused) drawPaused(ctx, VIEW);
    },
  };
}
