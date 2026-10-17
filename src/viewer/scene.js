// Model viewer (T027): draws one slot's sandbox into a rectangle of the page canvas with the game's own renderers
// (drawRig, shadows, floor and flying items, arrows, helping rings, effects), at game size x the size pick x zoom.
// Background: neutral grey with floor ticks (foot sliding shows against them) or Harbor Market. Browser only.
import { drawRig, rigMemory } from '../render/rig.js';
import { rigFrame } from '../render/rig.js';
import { drawShadow } from '../render/standee.js';
import { drawItem } from '../render/props.js';
import { drawShot, drawShotShadow } from '../render/shots.js';
import { drawHelping } from '../render/helping.js';
import { drawStage } from '../render/backdrop.js';
import { STAGES } from '../data/stages/index.js';
import { rigOf } from './models.js';
import { drawOverlays } from './overlays.js';

const STAGE = STAGES['harbor-market'];
export const FLOOR_AT = 0.8;   // feet line at this share of the slot's height

// The rig a fighter in the sandbox is drawn with: the model's (its version), others their own.
export const rigFor = (sb, f) => (f === sb.hero ? sb.rig : rigOf(f.def.id));
const poseFor = (sb, f) => (f === sb.hero ? sb.pose ?? undefined : undefined);

// Replays one frame's render memory without pixels (seek / frame step back): exactly what drawRig would do.
export function warm(sb, time) {
  for (const f of sb.w.fighters) rigFrame(f, rigFor(sb, f), time, rigMemory(f), poseFor(sb, f));
}

// The world -> screen matrix for a slot: scale s, model (or the fixed camera) centred, feet line at FLOOR_AT.
export function cameraOf(sb, r, scale, juice) {
  const cx = sb.clip.follow ? sb.hero.x : sb.cx0;
  return [scale, 0, 0, scale, r.x + r.w / 2 - cx * scale + (juice?.ox ?? 0) * scale, r.y + r.h * FLOOR_AT - sb.hero.y * scale + (juice?.oy ?? 0) * scale];
}

function background(ctx, r, M, bg, assets) {
  const s = M[0];
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (bg === 'harbor') {
    const b = STAGE.backdrop, g = ctx.createLinearGradient(0, r.y, 0, r.y + r.h);
    g.addColorStop(0, b.sky[0]); g.addColorStop(0.5, b.sky[1]); g.addColorStop(0.5, b.sea[0]); g.addColorStop(1, b.sea[1]);
    ctx.fillStyle = g; ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.setTransform(...M); drawStage(ctx, STAGE, assets);
    return;
  }
  ctx.fillStyle = '#7b7b84'; ctx.fillRect(r.x, r.y, r.w, r.h);
  const fy = M[5] + 432 * s;   // floor plane under the feet line
  ctx.fillStyle = '#6a6a72'; ctx.fillRect(r.x, fy - 30 * s, r.w, r.y + r.h - fy + 30 * s);
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = Math.max(1, s * 0.6);
  const x0 = Math.floor((r.x - M[4]) / s / 40) * 40;   // a tick every 40 game px, fixed to the floor
  for (let x = x0; x * s + M[4] < r.x + r.w; x += 40) {
    const sx = x * s + M[4];
    ctx.beginPath(); ctx.moveTo(sx, fy - 4 * s); ctx.lineTo(sx, fy + 18 * s); ctx.stroke();
  }
}

// opts: { scale, bg, ov (overlay names), assets, fx: { a: effects, b: prop effects }, juice, label }
export function drawSlot(ctx, sb, r, o) {
  const time = sb.n / 60, M = cameraOf(sb, r, o.scale, o.juice), w = sb.w;
  ctx.save();
  ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  background(ctx, r, M, o.bg, o.assets);
  ctx.setTransform(...M);
  ctx.imageSmoothingQuality = 'high';
  for (const f of w.fighters) drawShadow(ctx, f);
  for (const s of w.shots) drawShotShadow(ctx, s);
  o.fx?.b.drawBack(ctx);
  for (const it of w.items) if (it.state === 'floor') drawItem(ctx, it, o.assets, time);
  o.fx?.a.drawBack(ctx);
  if (o.ov.includes('ghost')) {   // the rest pose (stance) where he stands, faint, behind him
    ctx.globalAlpha = 0.35;
    drawRig(ctx, { ...sb.hero, state: 'idle', move: null, z: 0, t: 0, weapon: sb.hero.weapon, invuln: 0 }, sb.rig, o.assets, 0, 0, 'stance');
    ctx.globalAlpha = 1;
  }
  const sorted = [...w.fighters, ...w.items.filter((it) => it.state !== 'floor'), ...w.shots].sort((a, b) => a.y - b.y);
  for (const f of sorted) {
    if (f.kind === 'shot') drawShot(ctx, f, o.assets);
    else if (!f.team) drawItem(ctx, f, o.assets, time);
    else drawRig(ctx, f, rigFor(sb, f), o.assets, time, o.fx?.a.flashOf(f.id) ?? 0, poseFor(sb, f));
  }
  drawHelping(ctx, w, o.assets, time);
  o.fx?.a.draw(ctx);
  o.fx?.b.draw(ctx);
  const flags = drawOverlays(ctx, sb, M, o);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (o.label) {
    ctx.font = '600 13px system-ui, sans-serif'; ctx.fillStyle = 'rgba(0,0,0,0.45)';
    const tw = ctx.measureText(o.label).width;
    ctx.fillRect(r.x + 6, r.y + 6, tw + 12, 22); ctx.fillStyle = '#fff'; ctx.fillText(o.label, r.x + 12, r.y + 22);
  }
  ctx.restore();
  return flags;
}
