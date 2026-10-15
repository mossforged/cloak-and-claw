// Arrows in flight (T011, sim/shots.js): the shot's art pointing along its flight, at its height over its lane,
// with a faint speed streak behind and a small shadow on the floor.
const D = Math.PI / 180;

export function drawShotShadow(ctx, s) {
  ctx.fillStyle = 'rgba(20,12,30,0.25)';
  ctx.beginPath(); ctx.ellipse(s.x, s.y, 14, 3, 0, 0, Math.PI * 2); ctx.fill();
}

export function drawShot(ctx, s, assets) {
  const A = s.def.art, img = assets.get(A.img), k = A.px;
  ctx.save();
  ctx.translate(s.x, s.y - s.z);
  ctx.strokeStyle = 'rgba(255,255,240,0.45)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-s.facing * 30, 0); ctx.lineTo(-s.facing * 70, 0); ctx.stroke();
  ctx.rotate(90 * s.facing * D);   // point-up image -> pointing the way it flies
  ctx.scale(k, k);
  ctx.drawImage(img, -A.nock[0], -img.height / 2);
  ctx.restore();
}
