// Draws breakable props, floor items (weapons, food) and a held weapon on a standee (T010). Reads state only.
// Look numbers: JUICE.items / JUICE.props (data/juice.js); sizes: each def's art.px.
import { RULES } from '../data/rules.js';
import { JUICE } from '../data/juice.js';
import { phaseOf } from '../sim/fighter.js';

const sizeOf = (img, px) => [img.width * px, img.height * px];

export function drawPropShadow(ctx, p) {
  const rx = p.def.body.w * 0.62;
  ctx.fillStyle = 'rgba(20,12,30,0.32)';
  ctx.beginPath(); ctx.ellipse(p.x, p.y, rx, rx * 0.3, 0, 0, Math.PI * 2); ctx.fill();
}

// Bottom centre on the floor spot; it shudders for a few frames after each hit.
export function drawProp(ctx, p, assets, frame) {
  const img = assets.get(p.def.art.img), [w, h] = sizeOf(img, p.def.art.px), k = frame - p.lastHit, S = JUICE.props;
  const wob = k < S.wobble ? Math.sin(k * 2.2) * (1 - k / S.wobble) : 0;
  ctx.save();
  ctx.translate(p.x + wob * 3, p.y);
  ctx.rotate(wob * 0.06);
  ctx.drawImage(img, -w / 2, -h, w, h);
  if (k < 4) { ctx.globalAlpha = 0.5 * (1 - k / 4); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(img, -w / 2, -h, w, h); }
  ctx.restore();
}

// Items lying on the floor get a soft glow under them so they read as pickups; weapons blink before they vanish.
export function drawItem(ctx, it, assets, time) {
  const A = it.def.art, img = assets.get(A.img), [w, h] = sizeOf(img, A.px), I = JUICE.items;
  if (it.state === 'floor' && it.def.kind === 'weapon' && it.life < RULES.items.blink && it.life % 10 < 5) return;
  ctx.save();
  if (it.state === 'floor') {
    const g = ctx.createRadialGradient(it.x, it.y, 0, it.x, it.y, w * 0.6);
    g.addColorStop(0, `rgba(255,236,150,${I.glow * (0.75 + 0.25 * Math.sin(time * 4 + it.id))})`); g.addColorStop(1, 'rgba(255,236,150,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(it.x, it.y, w * 0.6, w * 0.18, 0, 0, Math.PI * 2); ctx.fill();
  }
  const kz = Math.max(0.4, 1 - it.z / 160);
  ctx.fillStyle = `rgba(20,12,30,${0.3 * kz})`;
  ctx.beginPath(); ctx.ellipse(it.x, it.y, w * 0.42 * kz, w * 0.1 * kz, 0, 0, Math.PI * 2); ctx.fill();
  if (it.state === 'fly') {   // a few fading ghosts behind the spinning weapon
    for (let i = I.ghosts; i >= 1; i--) {
      ctx.globalAlpha = 0.18 * (1 - i / (I.ghosts + 1));
      piece(ctx, img, it.x - it.vx * i * 1.4, it.y - it.z, w, h, it.spin - it.dir * it.def.toss.spin * i);
    }
    ctx.globalAlpha = 1;
  }
  if (it.state === 'floor') {   // lying flat, a little tilted; weapons point the way they were dropped
    ctx.translate(it.x, it.y - h * 0.3);
    if (it.def.kind === 'weapon') { ctx.rotate(-0.08); ctx.scale(1, 0.8); }
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  } else piece(ctx, img, it.x, it.y - it.z - h * 0.3, w, h, it.spin);
  ctx.restore();
}

function piece(ctx, img, x, y, w, h, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
}

// Standee fallback for a held weapon: drawn at art.hand (px from the feet, forward/up) inside the standee's own
// transform, raised in a move's windup and swung down through it. Called by drawStandee.
export function drawHeldStandee(ctx, f, assets, artFacing) {
  const W = f.weapon, H = f.def.art.hand;
  if (!W || W.broken || !H) return;
  const A = W.def.art, img = assets.get(A.img), [w, h] = sizeOf(img, A.px);
  let rot = H.rot;
  if (f.move) {
    const [ph, p] = phaseOf(f);
    rot += ph === 'windup' ? -1.3 * p : ph === 'active' ? -1.3 + 2.6 * Math.min(1, p * 2) : 1.3 * (1 - p);
  }
  if (f.state === 'toss') rot -= 1.5;
  ctx.save();
  ctx.scale(artFacing, 1);   // local +x = forward
  ctx.translate(H.x, -H.y);
  ctx.rotate(rot + (A.rest ?? 0) * Math.PI / 180);
  ctx.drawImage(img, -A.grip[0] * A.px, -A.grip[1] * A.px, w, h);
  ctx.restore();
}
