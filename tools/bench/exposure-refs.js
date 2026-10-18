// Reference outlines for the cut-edge check (T028 r3, tools/bench/exposure.js): per rig and view, the painting the rest
// assembly stands for: Q = the setup master (A017, as A018's reference.png: the paint check's), B = A017's back
// reference (master-back.png); other views have none yet (their rest assembly is A023's view proof). An outline of a
// piece is on the reference when the reference has ink (a dark line, or its silhouette edge) within TOL game px of where
// the rest assembly puts it. Node only (reads the masters). A master still an LFS pointer: no reference (a NOTE).
import { readFileSync } from 'node:fs';
import { layoutRig } from '../../src/render/rig-layout.js';
import { channelsOf } from '../../src/render/rig-pose.js';
import { PAINT } from '../../src/data/paint-check.js';
import { readRGBA } from './png.mjs';

export const TOL = 1.5, INK = 70;
const A018 = 'assets/source/A018-rat-parts/rig-source.json';
const RAT = { source: A018, views: { 'Q/Q': 'assets/source/A018-rat-parts/reference.png', 'B/B': 'assets/source/A017-rat-setup-master/master-back.png' }, search: { 'B/B': true } };
// by rig name (FIGHTERS[id].art.rig); the mouse has none until its rebuild
export const REFS = { 'rat-raider': RAT, 'rat-spearman': RAT, 'rat-archer': RAT };

const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const inv = (m) => { const d = m[0] * m[3] - m[1] * m[2]; return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[3] * m[4]) / d, (m[1] * m[4] - m[0] * m[5]) / d]; };
const lfs = (path) => { try { return readFileSync(path, 'latin1', { length: 64 }).startsWith('version https://git-lfs'); } catch { return true; } };
export const notes = new Set();

// keyed master: alpha (0..1) and ink (dark line or silhouette edge), canvas px
function masterOf(path) {
  const M = readRGBA(path), n = M.w * M.h, a = new Float32Array(n), ink = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const r = M.rgba[i * 4], g = M.rgba[i * 4 + 1], b = M.rgba[i * 4 + 2], spill = g - Math.max(r, b);
    a[i] = M.rgba[i * 4 + 3] < 255 ? M.rgba[i * 4 + 3] / 255 : Math.min(1, Math.max(0, 1 - (spill - 25) / 70));
  }
  for (let y = 1; y < M.h - 1; y++) for (let x = 1; x < M.w - 1; x++) {
    const i = y * M.w + x;
    if (a[i] <= 0.5) continue;
    const lum = 0.299 * M.rgba[i * 4] + 0.587 * M.rgba[i * 4 + 1] + 0.114 * M.rgba[i * 4 + 2];
    if (lum < INK || a[i - 1] <= 0.5 || a[i + 1] <= 0.5 || a[i - M.w] <= 0.5 || a[i + M.w] <= 0.5) ink[i] = 1;
  }
  return { w: M.w, h: M.h, a, ink };
}
// square dilation (separable running max) by r px
function dilate(src, w, h, r) {
  const tmp = new Uint8Array(w * h), out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) { let last = -1e9; for (let x = 0; x < w; x++) { if (src[y * w + x]) last = x; tmp[y * w + x] = x - last <= r ? 1 : 0; } last = 1e9; for (let x = w - 1; x >= 0; x--) { if (src[y * w + x]) last = x; if (last - x <= r) tmp[y * w + x] = 1; } }
  for (let x = 0; x < w; x++) { let last = -1e9; for (let y = 0; y < h; y++) { if (tmp[y * w + x]) last = y; out[y * w + x] = y - last <= r ? 1 : 0; } last = 1e9; for (let y = h - 1; y >= 0; y--) { if (tmp[y * w + x]) last = y; if (last - y <= r) out[y * w + x] = 1; } }
  return out;
}

const cache = new WeakMap();
// { near(x, y): rig point on the reference's ink?, shift } for (rig, rig name, 'T/P' view) or null
export function refOf(rig, name, views, k) {
  const R = REFS[name], path = R?.views[views];
  if (!path) return null;
  const C = cache.get(rig) ?? cache.set(rig, new Map()).get(rig);
  const ck = `${views}|${k}`;
  if (C.has(ck)) return C.get(ck);
  if (lfs(path)) { notes.add(`${path} is an LFS pointer: no ${views} reference outline (git lfs pull)`); C.set(ck, null); return null; }
  const src = JSON.parse(readFileSync(R.source, 'utf8')), root = Object.values(src.parts).find((p) => !p.parent), s = rig.scale, ART = PAINT.art;
  const [t, p] = views.split('/'), L = layoutRig(rig, { ...channelsOf(rig) }, { '@view.torso': t, '@view.pelvis': p }).filter((e) => e.m && !e.line);
  const rootE = L.find((e) => !rig.parts[e.name].parent), S0 = apply(rootE.m, ...rig.parts[rootE.name].pivot);
  const M = masterOf(path);
  // canvas px -> rig point, the paint check's mapping (root pivot on the master's); B: moved to where the back view's
  // rest silhouette best overlaps the back reference (its setup sits elsewhere on the canvas)
  let off = [0, 0];
  if (R.search[views]) off = align(L, M, S0, root.pivot, ART * s);
  const toRig = (cx, cy) => [S0[0] + (cx - root.pivot[0] - off[0]) * ART * s, S0[1] + (cy - root.pivot[1] - off[1]) * ART * s];
  const toCanvas = (x, y) => [(x - S0[0]) / (ART * s) + root.pivot[0] + off[0], (y - S0[1]) / (ART * s) + root.pivot[1] + off[1]];
  const ink = dilate(M.ink, M.w, M.h, Math.ceil(TOL / (k * ART * s)));
  const ref = { off, toRig, near: (x, y) => { const [cx, cy] = toCanvas(x, y).map(Math.floor); return cx >= 0 && cy >= 0 && cx < M.w && cy < M.h && !!ink[cy * M.w + cx]; },
    shift: views === 'Q/Q' ? Object.fromEntries(Object.entries(src.foot_translations ?? {}).map(([n, d]) => [n, d.map((v) => v * ART * s)])) : {} };
  C.set(ck, ref);
  return ref;
}
// translation (canvas px) of the reference that best overlaps the rest silhouette: coarse then fine grid search
function align(L, M, S0, pivot, u) {
  const P = L.map((e) => { const A = readRGBA(e.img); return { A, I: inv(e.m) }; });
  const covered = (x, y) => P.some(({ A, I }) => { const [a, b] = apply(I, x, y), X = Math.floor(a), Y = Math.floor(b); return X >= 0 && Y >= 0 && X < A.w && Y < A.h && A.alpha[Y * A.w + X] > 127; });
  const score = (dx, dy, step) => {
    let both = 0, any = 0;
    for (let cy = 0; cy < M.h; cy += step) for (let cx = 0; cx < M.w; cx += step) {
      const m = M.a[cy * M.w + cx] > 0.5, r = covered(S0[0] + (cx - pivot[0] - dx) * u, S0[1] + (cy - pivot[1] - dy) * u);
      if (m && r) both++;
      if (m || r) any++;
    }
    return both / Math.max(1, any);
  };
  let best = [0, 0], top = -1;
  for (const [R, st, grid] of [[96, 16, 16], [16, 4, 8], [4, 1, 4]]) {
    const [bx, by] = best;
    top = score(bx, by, grid);
    for (let dy = -R; dy <= R; dy += st) for (let dx = -R; dx <= R; dx += st) { const v = score(bx + dx, by + dy, grid); if (v > top) { top = v; best = [bx + dx, by + dy]; } }
  }
  return best;
}
// the check's o.ref for fighter id (its rig's references)
export const refFor = (rigName) => (rig, views, k) => refOf(rig, rigName, views, k);
