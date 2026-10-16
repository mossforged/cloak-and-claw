// Hero panels (one per player slot, T021), enemy health bars, wave banner, GO arrow (scrolling stage cleared zone, T013), KO counter, controls hint and game-over screen.
// Drawn in screen space (camX = the camera's x, for the bars over enemies).
import { bus } from '../core/events.js';
import { BUILD } from '../config.js';
import { JUICE } from '../data/juice.js';
import { RULES } from '../data/rules.js';

const HUD_STEP = 320;   // px between hero panels along the top (T021)

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

// One hero's portrait, name, health bar and held weapon (T021: slot 0 where it always was, slots 1 and 2 along the top).
function drawHero(ctx, h, assets, multi) {
  const [k, lk] = lagged(h), x = h.slot * HUD_STEP, tint = JUICE.heroes.filter[h.slot];
  const img = assets.get(h.def.art.idle);
  ctx.save(); ctx.beginPath(); ctx.arc(x + 52, 50, 34, 0, Math.PI * 2);
  ctx.fillStyle = '#f3e6c8'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = multi ? JUICE.heroes.tag[h.slot] : '#2a1630'; ctx.stroke(); ctx.clip();
  if (h.slot > 0 && tint) ctx.filter = tint;
  if ((h.state === 'dead' || h.state === 'downed') && multi) ctx.globalAlpha = 0.45;
  ctx.drawImage(img, 0, 0, img.width, img.height * 0.55, x + 6, 14, 92, 92 * 0.55 * img.height / img.width);
  ctx.restore();
  const tag = h.controller?.kind === 'ai' ? 'Ally' : `P${h.slot + 1}`;   // T022: the AI ally's panel
  text(ctx, multi ? `${tag} ${h.def.name}` : h.def.name, x + 96, 34, 22, multi ? JUICE.heroes.tag[h.slot] : '#fff');
  bar(ctx, x + 96, 44, 220, 16, k, lk, k > 0.3 ? '#5fd35a' : '#ff5a4e');
  if (multi && h.state === 'dead') text(ctx, 'Down', x + 206, 59, 16, '#ff9a6a', 'center');
  if (h.state === 'downed') text(ctx, `Downed ${Math.ceil(h.downT / 60)}`, x + 206, 59, 16, h.downT < RULES.downed.frames * JUICE.help.timer.warn ? '#ff5a4e' : '#ffe9a8', 'center');
  if (h.potion) {   // T022: the potion slot
    const pi = assets.get(h.potion.art.img), ph = 30, pw = pi.width * ph / pi.height;
    ctx.fillStyle = 'rgba(42,22,48,0.75)'; ctx.beginPath(); ctx.roundRect(x + 290, 64, 30, 34, 8); ctx.fill();
    ctx.drawImage(pi, x + 305 - pw / 2, 66, pw, ph);
  }
  if (h.weapon && !h.weapon.broken) {   // T010: held weapon + hits left
    const W = h.weapon, img = assets.get(W.def.art.img), w = 46, ih = img.height * w / img.width;
    ctx.fillStyle = 'rgba(42,22,48,0.75)'; ctx.beginPath(); ctx.roundRect(x + 92, 66, 54, 28, 8); ctx.fill();
    ctx.drawImage(img, x + 96, 80 - ih / 2, w, ih);
    text(ctx, `${W.def.name} x${W.uses}`, x + 152, 87, 16, W.uses <= 2 ? '#ff9a6a' : '#ffe9a8');
  }
}

export function drawHud(ctx, world, assets, view, runLines = null, camX = 0) {
  const multi = world.heroes.length > 1;
  for (const h of world.heroes) drawHero(ctx, h, assets, multi);
  const ty = world.heroes.length > 2 ? 128 : 36;   // three panels fill the top: KOs/XP go under them
  text(ctx, `KOs ${world.kos}   XP ${world.xp}`, view.w - 20, ty, 22, '#ffe9a8', 'right');
  ctx.globalAlpha = 0.75; text(ctx, `build: ${BUILD}`, view.w - 20, ty + 22, 14, '#fff', 'right'); ctx.globalAlpha = 1;

  for (const f of world.fighters) {
    if (f.slot != null || f.state === 'dead' || world.frame - f.lastHit > 150) continue;
    const [ek, elk] = lagged(f);
    bar(ctx, f.x - camX - 26, f.y - f.def.art.height - 18, 52, 6, ek, elk, '#ff7a3d');
  }

  if (banner && banner.t++ < 100) {
    const a = banner.t < 10 ? banner.t / 10 : banner.t > 80 ? (100 - banner.t) / 20 : 1;
    ctx.globalAlpha = a; text(ctx, banner.text, view.w / 2, 200, 64, '#ffd23f', 'center'); ctx.globalAlpha = 1;
  }
  if (world.run?.cleared && !world.over) drawGo(ctx, view, world.frame);
  if (world.frame < 600 && !world.over) {
    ctx.globalAlpha = world.frame > 480 ? (600 - world.frame) / 120 : 1;
    text(ctx, 'Move: WASD   Attack: J   Jump: K   Block: hold L   Grab, pick up, throw weapon: H   Pause: P', view.w / 2, view.h - 18, 18, '#fff', 'center');
    if (multi) text(ctx, 'Pick up a downed friend: hold H by him   Potion: tap U to toss, hold U to drink', view.w / 2, view.h - 42, 18, '#ffe9a8', 'center');
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

// GO + arrow at the right edge, blinking (Golden Axe): the zone is clear, walk on.
function drawGo(ctx, view, frame) {
  if (frame % 50 >= 34) return;
  const x = view.w - 120, y = 190;
  text(ctx, 'GO', x, y, 56, '#ffd23f', 'center');
  ctx.beginPath(); ctx.moveTo(x - 34, y + 18); ctx.lineTo(x + 26, y + 18); ctx.lineTo(x + 26, y + 6); ctx.lineTo(x + 56, y + 32);
  ctx.lineTo(x + 26, y + 58); ctx.lineTo(x + 26, y + 46); ctx.lineTo(x - 34, y + 46); ctx.closePath();
  ctx.lineJoin = 'round'; ctx.lineWidth = 6; ctx.strokeStyle = '#2a1630'; ctx.stroke(); ctx.fillStyle = '#ffd23f'; ctx.fill();
}
