// Exposed hidden paint (T028 r3, rig standard 5b.6): Art paints each cut a little past where it shows (thigh tops under
// the trousers, foot tops under the shin) so a turning joint never opens a gap. That hidden paint is plain fill; when a
// pose (or a covering piece narrower than the extension) lets it show, it reads as a flat block. The seam measures
// can't see it (the spot isn't see-through: it's covered by the wrong paint).
//   hidden zone: a drawing's pixels that the rest assembly of the frame's view (the rig at rest 0 as the game lays it
//     out; Q is the master, which the paint check holds it to; B and the other views are A023's setups) does not show
//     because a piece at the same joint covers them: its parent or a child, or a sibling an anatomy rule names as its
//     cover (src/data/rigs/anatomy.js: the torso over the near thigh, the belt over the torso; T030: not a `surface` cover,
//     the seat over the thighs' finished cloth, left out of the rest assembly). A piece that only passes
//     in front (an arm hanging over the thigh) leaves painted surface, not hidden paint. Pixels within EDGE_PX of the
//     shown paint are tolerance (the surface carries on a little under its cover).
//   exposed: in a frame (as drawn: every piece's screen matrix, the draw order), hidden-zone pixels that end up on top.
//     Flag over EXPOSED_PX2 game px^2 for a piece in a frame; `under` = the piece that hid most of them at rest.
//     T028 r4 (Art's point: finished paint meant to show must not flag): only UNFINISHED exposed paint flags: a piece's
//     exposed region is unfinished when it is flat over the region (FLAT_SHARE or more of its pixels sit in plain fill:
//     the drawing's luminance standard deviation in a FLAT_WIN window, its own image px, under FLAT_SD) or when it touches
//     a straight cut run of the same piece (the cut-edge measure below: a block bounded by a knife cut). px2 = the
//     region's area when unfinished (as r3), else 0; `all` = its area either way, `flat` = its flat share.
//   cut edge: a visible run of a piece's own outline that isn't on the reference's outline (the reference's ink or
//     silhouette edge: exposure-refs.js; Q the master, B A017's back reference; a view without one: the outline its
//     rest assembly shows), CUT_MIN game px or longer and straight (within CUT_DEV px of a line): a knife cut showing,
//     like the back view's trouser thighs, knee line and scarf at the neck.
// Pure (no DOM, no files): readRGBA(path) -> { w, h, alpha, rgba } and o.ref(rig, 'T/P', k) -> reference or null are
// the caller's (Node: bench/png.mjs, bench/exposure-refs.js).
import { layoutRig } from '../../src/render/rig-layout.js';
import { channelsOf } from '../../src/render/rig-pose.js';
import { coverPairs, SURFACE_COVERS } from '../../src/data/rigs/anatomy.js';

export const EXPOSED_PX2 = 4, EDGE_PX = 1, CUT_MIN = 4, CUT_DEV = 1, SS = 2;
export const FLAT_SD = 6, FLAT_WIN = 5, FLAT_SHARE = 0.3;   // T028 r4 unfinished paint (calibrated in tests/exposure.test.mjs on A023 r3 vs r4)
const SKIP = new Set(['sword', 'shield', 'held']);
const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
const inv = (m) => { const d = m[0] * m[3] - m[1] * m[2]; return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[3] * m[4]) / d, (m[1] * m[4] - m[0] * m[5]) / d]; };
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const base = (n) => n.split(':')[0];
// the pieces checked: body drawings (not the held item, not a split grip's under piece)
export const subject = (cell, e) => !SKIP.has(e.name) && e.name !== cell.held?.slot && !e.name.includes(':');
export const viewKey = (swap) => `${swap?.['@view.torso'] ?? 'Q'}/${swap?.['@view.pelvis'] ?? 'Q'}`;

// pieces at the same joint: parent or child, or a sibling an anatomy rule names as the cover
const pairs = new WeakMap();
function related(rig, a, b) {
  const pa = rig.parts[base(a)]?.parent, pb = rig.parts[base(b)]?.parent;
  if (pa === base(b) || pb === base(a)) return true;
  const P = pairs.get(rig) ?? pairs.set(rig, new Set(coverPairs(rig).flatMap((c) => c.tops.map((t) => `${t}>${c.under}`)))).get(rig);
  return P.has(`${base(b)}>${base(a)}`);
}
// an entry's drawing placed by matrix M: opaque lookup (image px index or -1) and screen box
function placed(e, M, readRGBA) {
  const A = readRGBA(e.img), I = inv(M), c = [[0, 0], [A.w, 0], [0, A.h], [A.w, A.h]].map(([x, y]) => apply(M, x, y));
  return { e, A, M, box: [Math.min(...c.map((p) => p[0])), Math.min(...c.map((p) => p[1])), Math.max(...c.map((p) => p[0])), Math.max(...c.map((p) => p[1]))],
    at(x, y) { const [u, v] = apply(I, x, y), X = Math.floor(u), Y = Math.floor(v); return X >= 0 && Y >= 0 && X < A.w && Y < A.h && A.alpha[Y * A.w + X] > 127 ? Y * A.w + X : -1; } };
}
// plain fill: 1 where the luminance in the FLAT_WIN window round an opaque pixel (opaque neighbours only) varies by under FLAT_SD
const flats = new WeakMap();
export function flatOf(A) {
  if (flats.has(A)) return flats.get(A);
  const lum = new Float32Array(A.w * A.h), out = new Uint8Array(A.w * A.h), r = (FLAT_WIN - 1) / 2;
  for (let j = 0; j < lum.length; j++) lum[j] = 0.299 * A.rgba[j * 4] + 0.587 * A.rgba[j * 4 + 1] + 0.114 * A.rgba[j * 4 + 2];
  for (let y = 0; y < A.h; y++) for (let x = 0; x < A.w; x++) {
    if (A.alpha[y * A.w + x] <= 127) continue;
    let n = 0, s = 0, s2 = 0;
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const xx = x + dx, yy = y + dy, k = yy * A.w + xx;
      if (xx < 0 || yy < 0 || xx >= A.w || yy >= A.h || A.alpha[k] <= 127) continue;
      n++; s += lum[k]; s2 += lum[k] * lum[k];
    }
    out[y * A.w + x] = +(Math.sqrt(Math.max(0, s2 / n - (s / n) ** 2)) < FLAT_SD);
  }
  flats.set(A, out);
  return out;
}
const outline = (A, j) => {
  const x = j % A.w, y = (j - x) / A.w, op = (xx, yy) => xx >= 0 && yy >= 0 && xx < A.w && yy < A.h && A.alpha[yy * A.w + xx] > 127;
  return !(op(x - 1, y) && op(x + 1, y) && op(x, y - 1) && op(x, y + 1));
};

// A drawing's zone in the rest assembly of a view: { deep (1 = hidden past the tolerance), by (coverer index into
// names), names, cut (1 = an outline pixel not on the reference) } in image px, or null (it never shows at rest).
const zones = new WeakMap();
export function hiddenZone(rig, views, name, swapName, img, k, readRGBA, ref) {
  const cache = zones.get(rig) ?? zones.set(rig, new Map()).get(rig), key = `${views}|${name}|${img}|${k}|${!!ref}`;
  if (cache.has(key)) return cache.get(key);
  let z = null;
  for (const v of [views, 'Q/Q', 'S/S', 'F/F', 'B/B']) {
    const [t, p] = v.split('/'), swap = { '@view.torso': t, '@view.pelvis': p, ...(swapName && { [name]: swapName }) };
    const L = layoutRig(rig, { ...channelsOf(rig) }, swap).filter((e) => e.m && !e.line), i = L.findIndex((e) => e.name === name && e.img === img);
    if (i >= 0) { z = zoneOf(rig, L, i, k, readRGBA, ref?.(rig, v, k)); break; }
  }
  cache.set(key, z);
  return z;
}
function zoneOf(rig, L, i, k, readRGBA, ref) {
  // T030: a surface cover (the seat over the thighs' finished cloth) hides no paint Art drew to stay hidden: left out here
  const { A } = placed(L[i], L[i].m, readRGBA), above = L.slice(i + 1).filter((e) => !SURFACE_COVERS.has(base(e.name))).map((e) => placed(e, e.m, readRGBA)), m = L[i].m;
  const names = above.map((x) => x.e.name), state = new Uint8Array(A.w * A.h), by = new Int16Array(A.w * A.h).fill(-1), cut = new Uint8Array(A.w * A.h);
  const [fx, fy] = ref?.shift[L[i].name] ?? [0, 0];   // A018 moved the feet off the master: laid back for the comparison
  for (let y = 0; y < A.h; y++) for (let x = 0; x < A.w; x++) {
    const j = y * A.w + x;
    if (A.alpha[j] <= 127) continue;
    const [X, Y] = apply(m, x + 0.5, y + 0.5);
    let top = -1;
    for (let a = above.length - 1; a >= 0; a--) { const b = above[a].box; if (X >= b[0] && X <= b[2] && Y >= b[1] && Y <= b[3] && above[a].at(X, Y) >= 0) { top = a; break; } }
    // 1 shown, 2 hidden by its joint's cover, 3 behind a piece passing in front (painted surface)
    state[j] = top < 0 ? 1 : related(rig, L[i].name, names[top]) ? 2 : 3;
    if (state[j] === 2) by[j] = top;
    if (outline(A, j) && (state[j] === 2 || (state[j] === 1 && ref && !ref.near(X - fx, Y - fy)))) cut[j] = 1;
  }
  // distance (image px, 8-neighbour steps) from the shown paint; hidden pixels within the tolerance don't count
  const R = EDGE_PX / (Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2])) * k), dist = new Float32Array(A.w * A.h).fill(Infinity), q = [];
  for (let j = 0; j < state.length; j++) if (state[j] === 1 || state[j] === 3) { dist[j] = 0; q.push(j); }
  for (let h = 0; h < q.length; h++) {
    const j = q[h], x = j % A.w, y = (j - x) / A.w;
    if (dist[j] > R) continue;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy, n = yy * A.w + xx, d = dist[j] + (dx && dy ? Math.SQRT2 : 1);
      if (xx >= 0 && yy >= 0 && xx < A.w && yy < A.h && state[n] === 2 && d < dist[n]) { dist[n] = d; q.push(n); }
    }
  }
  const deep = Uint8Array.from(state, (s, j) => +(s === 2 && dist[j] > R));
  return { deep, by, names, cut };
}

// One frame (a poseFrames / rehearsalFrames cell): { exposed: [{ part, img, px2, under, at }], cuts: [{ part, img, len,
// at }] } (game px^2, game px; at = screen point, feet at 0,0). o.paint: also `image` ({ W, H, rgba, x0, y0 }: SS px per
// game px, exposed paint red, cut runs blue; o.paint 'all': every visible off-reference outline pixel cyan) for the strip.
export function frameExposure(cell, readRGBA, o = {}) {
  const P = cell.L.filter((e) => e.m && !e.line).map((e) => placed(e, mul(cell.view, e.m), readRGBA));
  const x0 = Math.floor(Math.min(...P.map((p) => p.box[0]))), y0 = Math.floor(Math.min(...P.map((p) => p.box[1])));
  const W = Math.ceil((Math.max(...P.map((p) => p.box[2])) - x0) * SS) + 1, H = Math.ceil((Math.max(...P.map((p) => p.box[3])) - y0) * SS) + 1;
  const top = new Int16Array(W * H).fill(-1), pix = new Int32Array(W * H);
  P.forEach((p, i) => {
    for (let by = Math.max(0, Math.floor((p.box[1] - y0) * SS)); by < Math.min(H, Math.ceil((p.box[3] - y0) * SS)); by++)
      for (let bx = Math.max(0, Math.floor((p.box[0] - x0) * SS)); bx < Math.min(W, Math.ceil((p.box[2] - x0) * SS)); bx++) {
        const j = p.at(x0 + (bx + 0.5) / SS, y0 + (by + 0.5) / SS);
        if (j >= 0) { top[by * W + bx] = i; pix[by * W + bx] = j; }
      }
  });
  const views = viewKey(cell.swap), Z = P.map((p) => (subject(cell, p.e) ? hiddenZone(cell.rig, views, p.e.name, p.e.swap, p.e.img, cell.k, readRGBA, o.ref) : null));
  const count = new Float64Array(P.length), flat = new Float64Array(P.length), sx = new Float64Array(P.length), sy = new Float64Array(P.length), under = P.map(() => ({})), edge = new Uint8Array(W * H);
  const shown = new Uint8Array(W * H), F = P.map((p, i) => Z[i] && flatOf(p.A));
  for (let b = 0; b < W * H; b++) {
    const i = top[b], z = Z[i];
    if (i < 0 || !z) continue;
    const j = pix[b], x = b % W, y = (b - x) / W;
    if (z.deep[j]) {
      count[i]++; shown[b] = 1;
      if (F[i][j]) flat[i]++;
      sx[i] += x; sy[i] += y; const n = z.names[z.by[j]]; under[i][n] = (under[i][n] ?? 0) + 1;
    }
    if (z.cut[j]) edge[b] = 1;
  }
  const cuts = cutRuns(edge, top, W, H, x0, y0, P);
  // a straight cut run of the piece within one game px of its exposed paint: that paint is a block cut with a knife
  const edged = new Set();
  for (const c of cuts) {
    const i = top[c.pts[0]];
    if (edged.has(i) || !count[i]) continue;
    if (c.pts.some((b) => { const x = b % W, y = (b - x) / W; for (let dy = -SS; dy <= SS; dy++) for (let dx = -SS; dx <= SS; dx++) { const n = (y + dy) * W + x + dx; if (x + dx >= 0 && x + dx < W && y + dy >= 0 && y + dy < H && shown[n] && top[n] === i) return true; } return false; })) edged.add(i);
  }
  const exposed = [];
  P.forEach((p, i) => {
    const all = count[i] / (SS * SS), px2 = edged.has(i) || flat[i] >= FLAT_SHARE * count[i] ? all : 0;
    if (px2 > EXPOSED_PX2) exposed.push({ part: p.e.name, img: p.e.img, px2: +px2.toFixed(1), all: +all.toFixed(1), flat: +(flat[i] / count[i]).toFixed(2), edged: edged.has(i),
      under: Object.entries(under[i]).sort((a, b) => b[1] - a[1])[0][0], at: [x0 + sx[i] / count[i] / SS, y0 + sy[i] / count[i] / SS] });
  });
  return { exposed, cuts: cuts.map(({ pts, ...c }) => c), ...(o.paint && { image: paint(P, Z, top, pix, W, H, cuts, exposed, x0, y0, o.paint === 'all' && edge) }) };
}
function paint(P, Z, top, pix, W, H, cuts, exposed, x0, y0, edge) {
  const rgba = new Uint8Array(W * H * 4), flagged = new Set(exposed.map((e) => e.part));
  for (let b = 0; b < W * H; b++) {
    const i = top[b];
    if (i < 0) continue;
    const j = pix[b], c = P[i].A.rgba;
    rgba.set(flagged.has(P[i].e.name) && Z[i]?.deep[j] ? [255, 30, 30, 255] : [c[j * 4], c[j * 4 + 1], c[j * 4 + 2], 255], b * 4);
  }
  if (edge) for (let b = 0; b < W * H; b++) if (edge[b]) rgba.set([0, 255, 255, 255], b * 4);   // every visible off-reference outline pixel
  for (const c of cuts) for (const b of c.pts) rgba.set([40, 120, 255, 255], b * 4);
  return { W, H, rgba, x0, y0 };
}

// straight runs of visible cut-edge pixels, one piece each: each pixel's local direction (its neighbours within NB px)
// in 8 bins of 22.5 deg, so a U-shaped cut splits into its sides; then 8-connected runs of one bin, long axis >= CUT_MIN
// and every pixel within CUT_DEV of the run's line
const NB = 2;
function cutRuns(edge, top, W, H, x0, y0, P) {
  const out = [], seen = new Uint8Array(W * H), bin = new Int8Array(W * H).fill(-1), r = NB * SS;
  for (let s = 0; s < W * H; s++) {
    if (!edge[s]) continue;
    const x = s % W, y = (s - x) / W;
    let a = 0, c = 0, d = 0, n = 0;
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx >= 0 && yy >= 0 && xx < W && yy < H && edge[yy * W + xx] && top[yy * W + xx] === top[s]) { a += dx * dx; c += dx * dy; d += dy * dy; n++; }
    }
    if (n >= 3) bin[s] = Math.round(((0.5 * Math.atan2(2 * c, a - d) + Math.PI) % Math.PI) / (Math.PI / 8)) % 8;
  }
  for (let s = 0; s < W * H; s++) {
    if (bin[s] < 0 || seen[s]) continue;
    const comp = [s];
    seen[s] = 1;
    for (let h = 0; h < comp.length; h++) {
      const b = comp[h], x = b % W, y = (b - x) / W;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy, n = yy * W + xx;
        if (xx >= 0 && yy >= 0 && xx < W && yy < H && !seen[n] && bin[n] === bin[s] && top[n] === top[s]) { seen[n] = 1; comp.push(n); }
      }
    }
    if (comp.length < CUT_MIN * SS) continue;
    let mx = 0, my = 0;
    for (const b of comp) { mx += b % W; my += Math.floor(b / W); }
    mx /= comp.length; my /= comp.length;
    let a = 0, c = 0, d = 0;
    for (const b of comp) { const dx = b % W - mx, dy = Math.floor(b / W) - my; a += dx * dx; c += dx * dy; d += dy * dy; }
    const th = 0.5 * Math.atan2(2 * c, a - d), ux = Math.cos(th), uy = Math.sin(th);
    let lo = Infinity, hi = -Infinity, dev = 0;
    for (const b of comp) { const dx = b % W - mx, dy = Math.floor(b / W) - my, t = dx * ux + dy * uy; lo = Math.min(lo, t); hi = Math.max(hi, t); dev = Math.max(dev, Math.abs(-dx * uy + dy * ux)); }
    const len = (hi - lo) / SS;
    if (len >= CUT_MIN && dev / SS <= CUT_DEV) out.push({ part: P[top[s]].e.name, img: P[top[s]].e.img, len: +len.toFixed(1), at: [x0 + mx / SS, y0 + my / SS], pts: comp });
  }
  return out;
}
