// Layered scrolling stage (T013): far (parallax), stone backfill under the back art, back segments end to end,
// floor tile (shaded), decor pieces.
// drawLayersBack before the fighters, drawLayersFront after them. camX = the camera's x (sim/camera.js), rounded.
// segmentsOf / joinsOf are pure (data test, debug overlay).

export function segmentsOf(stage) {
  const B = stage.layers.back;
  let x = 0;
  return B.sequence.map((k, i) => {
    if (i) x -= B.overlap;
    const s = { key: k, src: B.segments[k].src, x, w: B.segments[k].w };
    x += s.w;
    return s;
  });
}

export const joinsOf = (stage) => segmentsOf(stage).slice(1).map((s) => s.x + stage.layers.back.overlap / 2);

// A decor piece's screen rect (base point at x, y; h px tall).
function pieceRect(L, d, img, sx) {
  const P = L.pieces[d.piece], w = img.width * d.h / img.height;
  return { x: sx - P.anchorX * w, y: d.y - d.h, w, h: d.h };
}

export function drawLayersBack(ctx, stage, camX, assets, view) {
  const L = stage.layers;
  const far = assets.get(L.far.src);
  ctx.drawImage(far, Math.round(L.far.x - camX * L.far.parallax), L.far.y);
  const fl = assets.get(L.floor.src), tw = fl.width, F = L.floor;
  if (F.backfill) {   // stone behind the back art's uneven feet, so the far sea never shows between barrels and the lane
    const y0 = L.back.base - F.backfill;
    ctx.save(); ctx.beginPath(); ctx.rect(0, y0, view.w, F.backfill); ctx.clip();
    for (let x = -(camX % tw); x < view.w; x += tw) ctx.drawImage(fl, x, y0, tw + 1, fl.height);
    ctx.fillStyle = `rgba(0,0,0,${F.backfillShade})`; ctx.fillRect(0, y0, view.w, F.backfill);
    ctx.restore();
  }
  for (const s of segmentsOf(stage)) {
    if (s.x - camX > view.w || s.x + s.w - camX < 0) continue;
    const img = assets.get(s.src), h = img.height * s.w / img.width;
    ctx.drawImage(img, s.x - camX, L.back.base - h, s.w, h);
  }
  for (let x = -(camX % tw); x < view.w; x += tw) ctx.drawImage(fl, x, L.floor.y, tw + 1, fl.height);   // 1 px overlap: no hairline
  if (L.floor.shade) { ctx.fillStyle = `rgba(0,0,0,${L.floor.shade})`; ctx.fillRect(0, L.floor.y, view.w, fl.height); }
  for (const d of L.decor) if (d.layer === 'back') drawPiece(ctx, L, d, d.x - camX, assets, 1);
}

// Front pieces scroll at frontParallax and turn see-through (L.fade) while they overlap a fighter.
export function drawLayersFront(ctx, stage, camX, fighters, assets) {
  const L = stage.layers;
  for (const d of L.decor) {
    if (d.layer !== 'front') continue;
    const img = assets.get(L.pieces[d.piece].src), r = pieceRect(L, d, img, d.x - camX * L.frontParallax);
    if (r.x > 2000 || r.x + r.w < -100) continue;
    const behind = fighters.some((f) => {
      const w = f.def.body?.w ?? 50, top = f.y - f.z - f.def.art.height, left = f.x - camX - w / 2;
      return left < r.x + r.w && left + w > r.x && top < r.y + r.h && f.y - f.z > r.y;
    });
    drawPiece(ctx, L, d, d.x - camX * L.frontParallax, assets, behind ? L.fade : 1);
  }
}

function drawPiece(ctx, L, d, sx, assets, alpha) {
  const img = assets.get(L.pieces[d.piece].src), r = pieceRect(L, d, img, sx);
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, r.x, r.y, r.w, r.h);
  ctx.globalAlpha = 1;
}
