// Sky, drifting clouds and sea behind the stage cutout.
export function drawBackdrop(ctx, stage, view, time) {
  const b = stage.backdrop;
  const sky = ctx.createLinearGradient(0, 0, 0, b.horizon);
  sky.addColorStop(0, b.sky[0]); sky.addColorStop(1, b.sky[1]);
  ctx.fillStyle = sky; ctx.fillRect(0, 0, view.w, b.horizon);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  for (let i = 0; i < 5; i++) {
    const x = ((i * 260 + time * (6 + i * 2)) % (view.w + 300)) - 150, y = 40 + ((i * 53) % 140);
    for (const [ox, oy, r] of [[0, 0, 28], [30, -10, 34], [62, 0, 26], [30, 8, 26]]) {
      ctx.beginPath(); ctx.arc(x + ox, y + oy, r, 0, Math.PI * 2); ctx.fill();
    }
  }
  const sea = ctx.createLinearGradient(0, b.horizon, 0, view.h);
  sea.addColorStop(0, b.sea[0]); sea.addColorStop(1, b.sea[1]);
  ctx.fillStyle = sea; ctx.fillRect(0, b.horizon, view.w, view.h - b.horizon);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
  for (let i = 0; i < 14; i++) {
    const y = b.horizon + 12 + i * 10, x = ((i * 137 + time * 12 * (i % 2 ? 1 : -1)) % view.w + view.w) % view.w;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 30 + (i % 3) * 10, y); ctx.stroke();
  }
}

export function drawStage(ctx, stage, assets) {
  const a = stage.art, img = assets.get(a.src);
  ctx.drawImage(img, a.x, a.y, a.w, a.w * (img.height / img.width));
}
