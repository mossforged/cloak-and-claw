// Paint check (T026 round 2, rig standard 8, G2): the rest assembly compared with the master colour for colour, not only
// by outline. The game-ready cuts are laid out at rest (render/rig-layout.js, the game's draw order) on a grid at the
// importer's cut scale (canvas px x ART, the cuts' own resolution), composited over the key green, and compared with the
// master (keyed, box-averaged to the same grid) inside the master's silhouette (eroded by EDGE px: antialiasing).
// A punched hole shows green (strong), a painted disc or repaint shows a colour step. Pure: readRGBA(path) ->
// { w, h, rgba } is the caller's (Node: bench/png.mjs). tests/paint.test.mjs runs it, tools/paint-map.mjs draws the maps.
import { layoutRig } from '../../src/render/rig-layout.js';
import { channelsOf } from '../../src/render/rig-pose.js';
import { PAINT } from '../../src/data/paint-check.js';

const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const inv = (m) => { const d = m[0] * m[3] - m[1] * m[2]; return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[3] * m[4]) / d, (m[1] * m[4] - m[0] * m[5]) / d]; };
const KEY = [0, 255, 0];
const keyed = (r, g, b) => { const spill = g - Math.max(r, b); return [r, spill > 0 ? Math.min(g, Math.max(r, b) + 8) : g, b, Math.min(1, Math.max(0, 1 - (spill - 25) / 70))]; };

// body: { rig, master (canvas png), canvas: [w, h], pelvis (canvas pivot of the root part), exclude: [canvas pngs],
//   skipParts: [part names whose drawing is not the master's on purpose (A010: head R, the fist the master's cutlass is in)],
//   shift: { part: [dx, dy] canvas px the delivery moved it off the master (A018 foot_translations): laid back for the check } }
export function paintCheck(body, readRGBA, o = {}) {
  const { rig } = body, ART = o.art ?? PAINT.art, W = Math.round(body.canvas[0] * ART), H = Math.round(body.canvas[1] * ART);
  const k = 1 / ART;   // canvas px per grid px
  // master -> grid: premultiplied box average of the keyed canvas pixels each grid px covers
  const M = readRGBA(body.master), master = new Float32Array(W * H * 4);
  for (let gy = 0; gy < H; gy++) for (let gx = 0; gx < W; gx++) {
    let r = 0, g = 0, b = 0, a = 0, n = 0;
    for (let y = Math.floor(gy * k); y < Math.min(M.h, Math.floor((gy + 1) * k)); y++) for (let x = Math.floor(gx * k); x < Math.min(M.w, Math.floor((gx + 1) * k)); x++) {
      const i = (y * M.w + x) * 4, [R, G, B, A] = M.rgba[i + 3] < 255 ? [M.rgba[i], M.rgba[i + 1], M.rgba[i + 2], M.rgba[i + 3] / 255] : keyed(M.rgba[i], M.rgba[i + 1], M.rgba[i + 2]);
      r += R * A; g += G * A; b += B * A; a += A; n++;
    }
    const j = (gy * W + gx) * 4;
    master.set([r / n, g / n, b / n, a / n], j);
  }
  // excluded drawings (the A010 master's cutlass: not a body part)
  const skip = new Uint8Array(W * H);
  for (const path of body.exclude ?? []) {
    const X = readRGBA(path);
    for (let gy = 0; gy < H; gy++) for (let gx = 0; gx < W; gx++) {
      const i = (Math.floor((gy + 0.5) * k) * X.w + Math.floor((gx + 0.5) * k)) * 4;
      if ((X.rgba[i + 3] < 255 ? X.rgba[i + 3] / 255 : keyed(X.rgba[i], X.rgba[i + 1], X.rgba[i + 2])[3]) > 0.1) skip[gy * W + gx] = 1;
    }
  }
  // the rest assembly: grid px -> screen px (root pivot on the master's), then each cut's own px (bilinear)
  const L = layoutRig(rig, { ...channelsOf(rig) }, {}, null).filter((e) => e.m);
  const root = L.find((e) => !rig.parts[e.name].parent), S0 = apply(root.m, ...rig.parts[root.name].pivot), s = rig.scale;
  const toScreen = [s, 0, 0, s, S0[0] - body.pelvis[0] * ART * s, S0[1] - body.pelvis[1] * ART * s];
  const out = new Float32Array(W * H * 4);   // premultiplied
  const skipped = new Set(body.skipParts ?? []);
  for (const e of L) {
    const A = readRGBA(e.img), [sx, sy] = (body.shift?.[e.name] ?? [0, 0]).map((v) => -v * ART * s), m = [...e.m.slice(0, 4), e.m[4] + sx, e.m[5] + sy], im = inv(m);
    const c = [[0, 0], [A.w, 0], [0, A.h], [A.w, A.h]].map(([x, y]) => apply(m, x, y)).map(([x, y]) => [(x - toScreen[4]) / s, (y - toScreen[5]) / s]);
    const x0 = Math.max(0, Math.floor(Math.min(...c.map((p) => p[0])))), x1 = Math.min(W, Math.ceil(Math.max(...c.map((p) => p[0]))));
    const y0 = Math.max(0, Math.floor(Math.min(...c.map((p) => p[1])))), y1 = Math.min(H, Math.ceil(Math.max(...c.map((p) => p[1]))));
    for (let gy = y0; gy < y1; gy++) for (let gx = x0; gx < x1; gx++) {
      const [u, v] = apply(im, toScreen[4] + (gx + 0.5) * s, toScreen[5] + (gy + 0.5) * s), px = sample(A, u - 0.5, v - 0.5);
      if (!px[3]) continue;
      if (skipped.has(e.name) && px[3] > 0.1) skip[gy * W + gx] = 1;
      const j = (gy * W + gx) * 4, t = 1 - px[3];
      for (let q = 0; q < 4; q++) out[j + q] = px[q] + out[j + q] * t;
    }
  }
  // inside the master's silhouette, eroded EDGE px, not excluded: per-pixel colour difference (both over the key green)
  const near = dilate(skip, W, H, PAINT.edge + 2);   // a skipped drawing's surroundings too (its outline, the master's own version of it)
  const inside = erode(Uint8Array.from({ length: W * H }, (_, i) => +(master[i * 4 + 3] > 0.5 && !near[i])), W, H, PAINT.edge);
  const diff = new Float32Array(W * H), vals = [];
  for (let i = 0; i < W * H; i++) {
    if (!inside[i]) { diff[i] = -1; continue; }
    let d = 0;
    for (let q = 0; q < 3; q++) d += Math.abs((out[i * 4 + q] + KEY[q] * (1 - out[i * 4 + 3])) - (master[i * 4 + q] + KEY[q] * (1 - master[i * 4 + 3])));
    diff[i] = d / 3; vals.push(d / 3);
  }
  vals.sort((a, b) => a - b);
  const strong = Uint8Array.from(diff, (d) => +(d > PAINT.strong));
  // solid: strong pixels with strong pixels all round (eroded SOLID px): a hole, disc or repaint, not an edge sliver
  const region = largest(erode(strong, W, H, PAINT.solid), W, H), n = vals.length;
  return {
    W, H, diff, render: out, master,
    mean: vals.reduce((a, b) => a + b, 0) / n, p95: vals[Math.floor(n * 0.95)],
    strongShare: vals.filter((d) => d > PAINT.strong).length / n,
    region: { ...region, gamePx: region.area * (s * s) },   // largest solid strong-difference region (core grid px; game px^2)
  };
}

function sample(A, x, y) {
  const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0, out = [0, 0, 0, 0];
  for (const [dx, dy, w] of [[0, 0, (1 - fx) * (1 - fy)], [1, 0, fx * (1 - fy)], [0, 1, (1 - fx) * fy], [1, 1, fx * fy]]) {
    const X = x0 + dx, Y = y0 + dy;
    if (X < 0 || Y < 0 || X >= A.w || Y >= A.h || !w) continue;
    const i = (Y * A.w + X) * 4, a = A.rgba[i + 3] / 255;
    out[0] += A.rgba[i] * a * w; out[1] += A.rgba[i + 1] * a * w; out[2] += A.rgba[i + 2] * a * w; out[3] += a * w;
  }
  return out;
}
function dilate(m, W, H, r) {
  for (let k = 0; k < r; k++) {
    const n = m.slice();
    for (let i = 0; i < W * H; i++) if (!m[i]) { const x = i % W; if ((x > 0 && m[i - 1]) || (x < W - 1 && m[i + 1]) || m[i - W] || m[i + W]) n[i] = 1; }
    m = n;
  }
  return m;
}
function erode(m, W, H, r) {
  for (let k = 0; k < r; k++) {
    const n = m.slice();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (m[i] && (x === 0 || y === 0 || x === W - 1 || y === H - 1 || !m[i - 1] || !m[i + 1] || !m[i - W] || !m[i + W])) n[i] = 0;
    }
    m = n;
  }
  return m;
}
function largest(m, W, H) {
  const seen = new Uint8Array(W * H);
  let best = { area: 0, box: null };
  for (let s = 0; s < W * H; s++) {
    if (!m[s] || seen[s]) continue;
    const q = [s]; seen[s] = 1;
    let area = 0, x0 = W, y0 = H, x1 = 0, y1 = 0;
    while (q.length) {
      const i = q.pop(), x = i % W, y = (i / W) | 0;
      area++; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      for (const j of [x > 0 && i - 1, x < W - 1 && i + 1, y > 0 && i - W, y < H - 1 && i + W]) if (j !== false && m[j] && !seen[j]) { seen[j] = 1; q.push(j); }
    }
    if (area > best.area) best = { area, box: [x0, y0, x1 + 1, y1 + 1] };
  }
  return best;
}
