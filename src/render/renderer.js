// Draw order: backdrop -> stage -> shadows -> floor items + debris -> far half of wrap swooshes -> fighters, props and
// flying items and arrows (sorted by depth; rig or standee) -> effects -> HUD -> debug.
import { VIEW } from '../config.js';
import { drawBackdrop, drawStage } from './backdrop.js';
import { drawShadow, drawStandee } from './standee.js';
import { drawRig } from './rig.js';
import { RIGS } from '../data/rigs/index.js';
import { drawHud, drawPaused } from './hud.js';
import { drawDebug } from './debug.js';
import { createEffects } from './effects.js';
import { createPropFx } from './prop-fx.js';
import { drawProp, drawPropShadow, drawItem } from './props.js';
import { drawShot, drawShotShadow } from './shots.js';

export function createRenderer(ctx, assets) {
  const fx = createEffects(), pfx = createPropFx(assets);
  return {
    fx,
    reset: () => { fx.clear(); pfx.clear(); },
    tick: () => { fx.update(); pfx.update(); },
    draw(world, time, juice, opts) {
      ctx.imageSmoothingQuality = 'high';
      drawBackdrop(ctx, world.stage, VIEW, time);
      ctx.save();
      ctx.translate(juice.ox, juice.oy);
      drawStage(ctx, world.stage, assets);
      const sorted = [...world.fighters, ...world.props, ...world.items.filter((it) => it.state !== 'floor'), ...world.shots].sort((a, b) => a.y - b.y);
      for (const f of world.fighters) drawShadow(ctx, f);
      for (const p of world.props) drawPropShadow(ctx, p);
      for (const s of world.shots) drawShotShadow(ctx, s);
      pfx.drawBack(ctx);
      for (const it of world.items) if (it.state === 'floor') drawItem(ctx, it, assets, time);
      fx.drawBack(ctx);
      for (const f of sorted) {
        if (f.kind === 'shot') { drawShot(ctx, f, assets); continue; }   // arrows (T011)
        if (!f.team) { if (f.def.kind) drawItem(ctx, f, assets, time); else drawProp(ctx, f, assets, world.frame); continue; }   // props, flying items
        const rig = opts.rig !== false && RIGS[f.def.art.rig];   // R toggles rig vs standee
        if (rig) drawRig(ctx, f, rig, assets, time, fx.flashOf(f.id), f.def.team === 'hero' ? opts.pose : null);
        else drawStandee(ctx, f, assets, time, fx.flashOf(f.id));
      }
      fx.draw(ctx);
      pfx.draw(ctx);
      ctx.restore();
      drawHud(ctx, world, assets, VIEW, opts.runLines);
      if (opts.debug) drawDebug(ctx, world, juice);
      if (opts.paused) drawPaused(ctx, VIEW);
    },
  };
}
