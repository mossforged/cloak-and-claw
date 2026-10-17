// Helping marks in world space (T022), drawn over the fighters: the timer ring over a downed hero (shrinks as his
// time runs out, red and pulsing near the end; a 'HELP' tag), the filling revive ring round him while a friend holds
// grab (and a 'Hold H' prompt to a friend standing in reach), and the potion in a hero's hand while he tosses or drinks.
// Reads state only. Numbers: JUICE.help.
import { JUICE } from '../data/juice.js';
import { RULES } from '../data/rules.js';
import { socketOf } from './sockets.js';
import { reviverOf, reviveProgress, downedNear } from '../sim/revive.js';

const FONT = (px) => `${px}px "Lilita One", sans-serif`;
function label(ctx, s, x, y, px, fill) {
  ctx.font = FONT(px); ctx.textAlign = 'center'; ctx.lineJoin = 'round';
  ctx.lineWidth = 4; ctx.strokeStyle = '#2a1630'; ctx.strokeText(s, x, y);
  ctx.fillStyle = fill; ctx.fillText(s, x, y);
}

function arc(ctx, x, y, r, k, width, color) {
  ctx.lineCap = 'round';
  ctx.lineWidth = width + 4; ctx.strokeStyle = 'rgba(42,22,48,0.85)';
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  if (k <= 0) return;
  ctx.lineWidth = width; ctx.strokeStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k); ctx.stroke();
}

function drawDowned(ctx, h, w, time) {
  const H = JUICE.help, k = Math.max(0, h.downT / RULES.downed.frames), warn = k < H.timer.warn;
  const x = h.x, y = h.y - H.timer.z, r = H.timer.r * (warn ? 1 + 0.12 * Math.sin(time * 14) : 1);
  const reviver = reviverOf(h, w);
  ctx.save();
  if (reviver) {   // the revive ring fills round him; brighter as it nears the end
    const p = reviveProgress(reviver), R = H.revive;
    ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.ellipse(x, h.y - 8, R.r * 1.6, R.r * 0.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,236,150,${0.12 + 0.3 * p})`; ctx.fill();
    ctx.globalAlpha = 1;
    arc(ctx, x, y - 4, R.r, p, R.width, p < 1 ? '#ffe36a' : '#ffffff');
  }
  arc(ctx, x, y - 4, r, k, 5, warn ? '#ff5a4e' : '#ffd23f');
  label(ctx, 'HELP!', x, y - (reviver ? H.revive.r + 10 : r + 10), 16, warn ? '#ff9a6a' : '#fff');
  ctx.restore();
}

// A friend in reach of a downed hero who isn't picking him up yet: the button to hold.
function drawPrompt(ctx, f, w) {
  if (!JUICE.help.prompt || f.controller?.kind === 'ai' || (f.state !== 'idle' && f.state !== 'walk')) return;
  const t = downedNear(f, w);
  if (t) label(ctx, f.slot === 0 ? 'Hold H' : 'Hold Y', t.x, t.y + 22, 15, '#ffe9a8');
}

// The potion in his hand: raised to toss (until it leaves), tipped up to drink.
function drawHeld(ctx, f, assets, time) {
  const H = JUICE.help.hand, img = assets.get(f.potion?.art.img);
  if (!img || !['potion', 'potionToss', 'drink'].includes(f.state)) return;
  const w = img.width * H.px, h = img.height * H.px, P = RULES.potions;
  let x = f.x + f.facing * H.x, z = H.z, rot = 0;
  if (f.state === 'potionToss') { const k = Math.min(1, f.t / P.wind); x -= f.facing * 22 * k; z += 14 * k; rot = -f.facing * 0.6 * k; }
  if (f.state === 'drink') { const k = Math.min(1, f.t / 8); x -= f.facing * 12 * k; z += 22 * k; rot = -f.facing * (1.9 * k + 0.1 * Math.sin(time * 18)); }
  let at = [x, f.y - f.z - z];
  const hand = socketOf(f, 'hand_near'), mouth = socketOf(f, 'mouth');   // T024: in his drawn fist, brought to his mouth to drink
  if (hand) at = f.state === 'drink' && mouth ? hand.map((v, i) => v + (mouth[i] - v) * Math.min(1, f.t / 8)) : hand;
  ctx.save(); ctx.translate(...at); ctx.rotate(rot); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
}

export function drawHelping(ctx, w, assets, time) {
  if (w.heroes.length < 2 && !w.heroes[0]?.potion) return;
  for (const h of w.heroes) {
    if (h.state === 'downed') drawDowned(ctx, h, w, time);
    else drawPrompt(ctx, h, w);
    drawHeld(ctx, h, assets, time);
  }
}
