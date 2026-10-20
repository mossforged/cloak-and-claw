// T036, pure: binary mask helpers for the joint checker (tools/bench/joint-check.js). A mask is a Uint8Array w*h (1 = set).

// squared Euclidean distance from every pixel to the nearest set pixel (Felzenszwalb & Huttenlocher); none set = Infinity
export function edt(mask, w, h) {
  const INF = 1e20, d = new Float64Array(w * h), n = Math.max(w, h);
  const f = new Float64Array(n), g = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
  const pass = (len, get, set) => {
    for (let q = 0; q < len; q++) f[q] = get(q);
    let k = 0; v[0] = 0; z[0] = -INF; z[1] = INF;
    for (let q = 1; q < len; q++) {
      const sOf = () => ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      let s = sOf();
      while (s <= z[k]) { k--; s = sOf(); }
      k++; v[k] = q; z[k] = s; z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < len; q++) { while (z[k + 1] < q) k++; g[q] = (q - v[k]) ** 2 + f[v[k]]; }
    for (let q = 0; q < len; q++) set(q, g[q]);
  };
  for (let x = 0; x < w; x++) pass(h, (y) => (mask[y * w + x] ? 0 : INF), (y, val) => { d[y * w + x] = val; });
  for (let y = 0; y < h; y++) pass(w, (x) => d[y * w + x], (x, val) => { d[y * w + x] = val; });
  for (let i = 0; i < d.length; i++) if (d[i] >= INF) d[i] = Infinity;
  return d;
}

export function dilate(mask, w, h, r) {
  const d = edt(mask, w, h), out = new Uint8Array(w * h);
  for (let i = 0; i < out.length; i++) out[i] = d[i] <= r * r ? 1 : 0;
  return out;
}
export function erode(mask, w, h, r) {
  const inv = new Uint8Array(w * h);
  for (let i = 0; i < inv.length; i++) inv[i] = mask[i] ? 0 : 1;
  const d = edt(inv, w, h), out = new Uint8Array(w * h);
  for (let i = 0; i < out.length; i++) out[i] = mask[i] && d[i] > r * r ? 1 : 0;
  return out;
}
// morphological closing (dilate then erode, disc radius r); outside the mask's frame counts as unset
export const close = (mask, w, h, r) => erode(dilate(mask, w, h, r), w, h, r);

// connected components: [{ px: [indices], area, box: [x0, y0, x1, y1], edge: touches the frame }], biggest first
export function components(mask, w, h, eight = true) {
  const seen = new Uint8Array(w * h), out = [], stack = new Int32Array(w * h);
  const nb = eight ? [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]] : [[0, -1], [-1, 0], [1, 0], [0, 1]];
  for (let s = 0; s < w * h; s++) {
    if (!mask[s] || seen[s]) continue;
    let top = 0; stack[top++] = s; seen[s] = 1;
    const px = []; let x0 = w, y0 = h, x1 = -1, y1 = -1, edge = false;
    while (top) {
      const i = stack[--top], x = i % w, y = (i - x) / w;
      px.push(i);
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      if (!x || !y || x === w - 1 || y === h - 1) edge = true;
      for (const [dx, dy] of nb) {
        const X = x + dx, Y = y + dy;
        if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
        const j = Y * w + X;
        if (mask[j] && !seen[j]) { seen[j] = 1; stack[top++] = j; }
      }
    }
    out.push({ px, area: px.length, box: [x0, y0, x1, y1], edge });
  }
  return out.sort((a, b) => b.area - a.area);
}

// a PNG's own detached islands: 8-connected pieces after growing `grow` px; all but the biggest, with their own px count
export function islands(mask, w, h, { grow = 2, min = 1 } = {}) {
  const comps = components(grow ? dilate(mask, w, h, grow) : mask, w, h);
  return comps.slice(1).map((c) => ({ ...c, area: c.px.reduce((n, i) => n + mask[i], 0) })).filter((c) => c.area >= min);
}
