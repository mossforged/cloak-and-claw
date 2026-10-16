// Rig bench (T016), fit overlay (G2): keys the delivery's canvas images in the browser, then compares the parts at rest
// (no rotation, each where it sits on the canvas) with the master. Browser only (canvas pixels).

// Same key as tools/key_green.py: green spill -> alpha (>95 clear, <25 solid), despilled edges. An image that already
// has transparency keeps it. Returns the trimmed image and its box on the canvas (+ its alpha, for the fit maths).
export function keyImage(img) {
  const c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height), px = d.data;
  let hasAlpha = false;
  for (let i = 3; i < px.length; i += 4) if (px[i] < 255) { hasAlpha = true; break; }
  let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
  for (let i = 0, n = 0; i < px.length; i += 4, n++) {
    if (!hasAlpha) {
      const r = px[i], gr = px[i + 1], b = px[i + 2], hi = Math.max(r, b), spill = gr - hi;
      px[i + 3] = Math.round(Math.min(1, Math.max(0, 1 - (spill - 25) / 70)) * 255);
      if (spill > 0) px[i + 1] = Math.min(gr, hi + 8);
    }
    if (px[i + 3] > 20) {
      const x = n % c.width, y = (n / c.width) | 0;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  }
  if (x1 < 0) { x0 = y0 = 0; x1 = y1 = 0; }
  const box = [x0, y0, x1 + 1, y1 + 1], w = box[2] - box[0], h = box[3] - box[1];
  const out = document.createElement('canvas');
  out.width = w; out.height = h;
  const cut = new ImageData(w, h);
  const alpha = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const s = ((y + y0) * c.width + x + x0) * 4, o = (y * w + x) * 4;
    cut.data[o] = px[s]; cut.data[o + 1] = px[s + 1]; cut.data[o + 2] = px[s + 2]; cut.data[o + 3] = px[s + 3];
    alpha[y * w + x] = px[s + 3];
  }
  out.getContext('2d').putImageData(cut, 0, 0);
  return { canvas: out, box, alpha };
}

const inside = (k, [x, y]) => {
  const [x0, y0, x1] = k.box;
  if (x < x0 || y < k.box[1] || x >= x1 || y >= k.box[3]) return false;
  return k.alpha[(Math.round(y) - y0) * (x1 - x0) + Math.round(x) - x0] > 127;
};

// Compares parts at rest with the master. Score: share of the master's silhouette no part covers, and share of the
// parts' pixels outside the master. Per part: its pixels outside the master, and whether its joint lies on itself and on
// its parent (a joint off either drawing tears when it bends). Also builds the difference image.
export function fitReport(src, keyed) {
  const [W, H] = src.canvas, master = keyed[src.master];
  const cover = new Uint8Array(W * H), mm = new Uint8Array(W * H);
  const stamp = (k, into) => {
    const [x0, y0, x1, y1] = k.box, w = x1 - x0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (k.alpha[(y - y0) * w + x - x0] > 127) into[y * W + x] = 1;
  };
  stamp(master, mm);
  const parts = {};
  for (const p of Object.values(src.parts)) {
    const k = keyed[p.img], [x0, y0, x1, y1] = k.box, w = x1 - x0;
    let n = 0, out = 0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      if (k.alpha[(y - y0) * w + x - x0] <= 127) continue;
      cover[y * W + x] = 1; n++;
      if (!mm[y * W + x]) out++;
    }
    parts[p.name] = { outside: n ? out / n : 0, onSelf: inside(k, p.pivot), onParent: p.parent ? inside(keyed[src.parts[p.parent].img], p.pivot) : null };
  }
  let mN = 0, missed = 0, pN = 0, extra = 0;
  // difference image: red = master not covered by any part, blue = part outside the master, grey = both agree
  const diff = new ImageData(W, H);
  for (let i = 0; i < W * H; i++) {
    const m = mm[i], p = cover[i], o = i * 4;
    mN += m; pN += p;
    if (m && !p) { missed++; diff.data.set([255, 64, 64, 255], o); }
    else if (p && !m) { extra++; diff.data.set([70, 150, 255, 255], o); }
    else if (m) diff.data.set([190, 190, 190, 110], o);
  }
  const img = document.createElement('canvas');
  img.width = W; img.height = H;
  img.getContext('2d').putImageData(diff, 0, 0);
  return { missed: mN ? missed / mN : 0, extra: pN ? extra / pN : 0, parts, diff: img };
}
