// Draw order: backdrop -> stage (or a scrolling stage's back layers, T013) -> shadows -> floor items + debris -> far half of wrap swooshes -> fighters, props and
// flying items and arrows (sorted by depth; rig or standee) -> effects -> front layer pieces -> HUD -> debug.
// Everything between the stage and the front pieces is in world space, shifted by the camera (w.cam; arenas have none).
import { VIEW } from '../config.js';
import { drawBackdrop, drawStage } from './backdrop.js';
import { drawLayersBack, drawLayersFront } from './layers.js';
import { drawShadow, drawStandee } from './standee.js';
import { drawRig } from './rig.js';
import { RIGS } from '../data/rigs/index.js';
import { JUICE } from '../data/juice.js';
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
      const layered = !!world.stage.layers;   // T013: whole-pixel shake on layered stages, so tile edges never open a seam
      ctx.translate(layered ? Math.round(juice.ox) : juice.ox, layered ? Math.round(juice.oy) : juice.oy);
      const camX = Math.round(world.cam?.x ?? 0);
      if (world.stage.layers) drawLayersBack(ctx, world.stage, camX, assets, VIEW);
      else drawStage(ctx, world.stage, assets);
      ctx.save();
      ctx.translate(-camX, 0);
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
        const tint = f.slot > 0 && JUICE.heroes.filter[f.slot];   // T021: heroes on slots 1, 2 tinted
        if (tint) { ctx.save(); ctx.filter = tint; }
        if (rig) drawRig(ctx, f, rig, assets, time, fx.flashOf(f.id), f.slot != null ? opts.poses?.[f.slot] ?? null : null);
        else drawStandee(ctx, f, assets, time, fx.flashOf(f.id));
        if (tint) ctx.restore();
      }
      fx.draw(ctx);
      pfx.draw(ctx);
      ctx.restore();
      if (world.stage.layers) drawLayersFront(ctx, world.stage, camX, world.fighters, assets);
      ctx.restore();
      drawHud(ctx, world, assets, VIEW, opts.runLines, camX);
      if (opts.debug) drawDebug(ctx, world, juice, camX);
      if (opts.paused) drawPaused(ctx, VIEW);
    },
  };
}
