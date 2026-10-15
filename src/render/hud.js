// Health bars, wave banner, KO counter, controls hint and game-over screen. Drawn in screen space.
import { bus } from '../core/events.js';

const FONT = (px) => `${px}px "Lilita One", sans-serif`;
let banner = null;
bus.on('wave', ({ n }) => { banner = { text: `Wave ${n}`, t: 0 }; });

function text(ctx, s, x, y, px, fill = '#fff', align = 'left') {
  ctx.font = FONT(px); ctx.textAlign = align; ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(3, px / 5); ctx.strokeStyle = '#2a1630'; ctx.strokeText(s, x, y);
  ctx.fillStyle = fill; ctx.fillText(s, x, y);
}

function bar(ctx, x, y, w, h, k, lagK, color) {
  ctx.fillStyle = '#2a1630'; ctx.beginPath(); ctx.roundRect(x - 3, y - 3, w + 6, h + 6, 6); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w * lagK, h);
  ctx.fillStyle = color; ctx.fillRect(x, y, w * k, h);
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(x, y, w * k, h * 0.35);
}

const lag = new Map();   // trailing white chunk on health bars
function lagged(f) {
  const k = f.hp / f.maxHp, prev = lag.get(f.id) ?? k;
  const v = prev > k ? prev - 0.006 : k;
  lag.set(f.id, v);
  return [k, v];
}

export function drawHud(ctx, world, assets, view, runLines = null) {
  const p = world.player, [k, lk] = lagged(p);
  // portrait
  const img = assets.get(p.def.art.idle);
  ctx.save(); ctx.beginPath(); ctx.arc(52, 50, 34, 0, Math.PI * 2);
  ctx.fillStyle = '#f3e6c8'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#2a1630'; ctx.stroke(); ctx.clip();
  ctx.drawImage(img, 0, 0, img.width, img.height * 0.55, 6, 14, 92, 92 * 0.55 * img.height / img.width);
  ctx.restore();
  text(ctx, p.def.name, 96, 34, 22);
  bar(ctx, 96, 44, 220, 16, k, lk, k > 0.3 ? '#5fd35a' : '#ff5a4e');
  text(ctx, `KOs ${world.kos}   XP ${world.xp}`, view.w - 20, 36, 22, '#ffe9a8', 'right');

  for (const f of world.fighters) {
    if (f === p || f.state === 'dead' || world.frame - f.lastHit > 150) continue;
    const [ek, elk] = lagged(f);
    bar(ctx, f.x - 26, f.y - f.def.art.height - 18, 52, 6, ek, elk, '#ff7a3d');
  }

  if (banner && banner.t++ < 100) {
    const a = banner.t < 10 ? banner.t / 10 : banner.t > 80 ? (100 - banner.t) / 20 : 1;
    ctx.globalAlpha = a; text(ctx, banner.text, view.w / 2, 200, 64, '#ffd23f', 'center'); ctx.globalAlpha = 1;
  }
  if (world.frame < 600 && !world.over) {
    ctx.globalAlpha = world.frame > 480 ? (600 - world.frame) / 120 : 1;
    text(ctx, 'Move: WASD / Arrows   Attack: J   Jump: K   Debug: `   Pause: P   Rig: R', view.w / 2, view.h - 18, 18, '#fff', 'center');
    ctx.globalAlpha = 1;
  }
  if (world.over) {
    ctx.fillStyle = 'rgba(20,10,30,0.55)'; ctx.fillRect(0, 0, view.w, view.h);
    text(ctx, 'Defeated!', view.w / 2, view.h / 2 - 20, 72, '#ff5a4e', 'center');
    text(ctx, `Reached wave ${world.wave} with ${world.kos} KOs  -  press J to fight again`, view.w / 2, view.h / 2 + 30, 24, '#fff', 'center');
    runLines?.forEach((s, i) => text(ctx, s, view.w / 2, view.h / 2 + 66 + i * 26, 19, '#ffe9a8', 'center'));
    if (runLines) text(ctx, 'L: download run logs', view.w / 2, view.h - 24, 16, '#fff', 'center');
  }
}

export function drawPaused(ctx, view) {
  ctx.fillStyle = 'rgba(20,10,30,0.45)'; ctx.fillRect(0, 0, view.w, view.h);
  text(ctx, 'Paused', view.w / 2, view.h / 2, 64, '#fff', 'center');
}

export function drawBanner(ctx, view, msg) {
  ctx.fillStyle = 'rgba(20,10,30,0.6)'; ctx.fillRect(0, 70, view.w, 36);
  text(ctx, msg, view.w / 2, 96, 22, '#fff', 'center');
}
