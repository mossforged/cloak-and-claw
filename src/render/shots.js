// Arrows in flight (T011, sim/shots.js): the shot's art pointing along its flight, at its height over its lane, drawn
// bigger than the nocked arrow with a light glow and a speed streak behind (JUICE.shot) so it reads against the market;
// a small shadow on the floor shows its lane.
import { JUICE } from '../data/juice.js';

const D = Math.PI / 180;

export function drawShotShadow(ctx, s) {
  ctx.fillStyle = 'rgba(20,12,30,0.3)';
  ctx.beginPath(); ctx.ellipse(s.x, s.y, 18, 3.5, 0, 0, Math.PI * 2); ctx.fill();
}

export function drawShot(ctx, s, assets) {
  const A = s.def.art, J = JUICE.shot, img = assets.get(A.img), k = A.px * J.size, back = -s.facing;
  ctx.save();
  ctx.translate(s.x, s.y - s.z);
  const tail = A.nock[1] * k;   // nock -> tip length on screen
  const g = ctx.createLinearGradient(back * tail * 0.4, 0, back * (tail * 0.4 + J.streak), 0);
  g.addColorStop(0, `rgba(255,255,240,${J.alpha})`); g.addColorStop(1, 'rgba(255,255,240,0)');
  ctx.strokeStyle = g; ctx.lineWidth = J.width; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(back * tail * 0.4, 0); ctx.lineTo(back * (tail * 0.4 + J.streak), 0); ctx.stroke();
  ctx.shadowColor = 'rgba(255,255,230,0.95)'; ctx.shadowBlur = J.glow;
  ctx.rotate(90 * s.facing * D);   // point-up image -> pointing the way it flies; centred on its middle
  ctx.scale(k, k);
  ctx.drawImage(img, -A.nock[0], -A.nock[1] / 2);
  ctx.restore();
}
