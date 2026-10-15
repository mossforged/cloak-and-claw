// Draw order: backdrop -> stage -> shadows -> fighters (sorted by depth; rig or standee) -> effects -> HUD -> debug.
import { VIEW } from '../config.js';
import { drawBackdrop, drawStage } from './backdrop.js';
import { drawShadow, drawStandee } from './standee.js';
import { drawRig } from './rig.js';
import { RIGS } from '../data/rigs/index.js';
import { drawHud, drawPaused } from './hud.js';
import { drawDebug } from './debug.js';
import { createEffects } from './effects.js';

// The rig's A/B variant of a move (poses.alt), when V has it switched on.
const altOf = (f, move) => {
  const rig = RIGS[f.def.art.rig], key = Object.keys(f.def.moves).find((k) => f.def.moves[k] === move);
  return rig?.poses.alt?.[key];
};

export function createRenderer(ctx, assets) {
  let cur = {};   // last draw's opts, so swing effects know whether the variant is on
  const useAlt = () => cur.rig !== false && cur.alt;
  const fx = createEffects((f, move) => (useAlt() ? altOf(f, move)?.fx : null));
  return {
    fx,
    reset: () => fx.clear(),
    tick: () => fx.update(),
    draw(world, time, juice, opts) {
      cur = opts;
      ctx.imageSmoothingQuality = 'high';
      drawBackdrop(ctx, world.stage, VIEW, time);
      ctx.save();
      ctx.translate(juice.ox, juice.oy);
      drawStage(ctx, world.stage, assets);
      const sorted = [...world.fighters].sort((a, b) => a.y - b.y);
      for (const f of sorted) drawShadow(ctx, f);
      for (const f of sorted) {
        const rig = opts.rig !== false && RIGS[f.def.art.rig];   // R toggles rig vs standee
        if (rig) drawRig(ctx, f, rig, assets, time, fx.flashOf(f.id), useAlt());
        else drawStandee(ctx, f, assets, time, fx.flashOf(f.id));
      }
      fx.draw(ctx);
      ctx.restore();
      drawHud(ctx, world, assets, VIEW);
      const alts = opts.rig !== false && world.fighters.map((f) => RIGS[f.def.art.rig]?.poses.alt).find(Boolean);
      if (alts) for (const [i, [k, a]] of Object.entries(alts).entries()) {   // A/B label, bottom left
        ctx.font = '15px sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = '#fff';
        ctx.fillText(`${k}: ${useAlt() ? a.label : a.base} (V)`, 12, VIEW.h - 44 - i * 18);
      }
      if (opts.debug) drawDebug(ctx, world, juice);
      if (opts.paused) drawPaused(ctx, VIEW);
    },
  };
}
