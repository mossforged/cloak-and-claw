// T036, pure: the joint checker's contact sheet (phone-sized RGB): a header line per joint, then one cell per flagged
// joint and kind (its worst sample's window: gap magenta, fragment cyan, seam yellow, joint point white), then each PNG
// island (orange, on its piece).
import { JOINT_CHECK } from '../../src/data/joint-check.js';
import { sourceOf, colourAt } from './joint-check.js';
import { KINDS } from './joint-report.js';

const G = { 0: [14, 17, 19, 21, 25, 17, 14], 1: [4, 12, 4, 4, 4, 4, 14], 2: [14, 17, 1, 2, 4, 8, 31], 3: [31, 2, 4, 2, 1, 17, 14],
  4: [2, 6, 10, 18, 31, 2, 2], 5: [31, 16, 30, 1, 1, 17, 14], 6: [6, 8, 16, 30, 17, 17, 14], 7: [31, 1, 2, 4, 8, 8, 8],
  8: [14, 17, 17, 14, 17, 17, 14], 9: [14, 17, 17, 15, 1, 2, 12], A: [14, 17, 17, 31, 17, 17, 17], B: [30, 17, 17, 30, 17, 17, 30],
  C: [14, 17, 16, 16, 16, 17, 14], D: [28, 18, 17, 17, 17, 18, 28], E: [31, 16, 16, 30, 16, 16, 31], F: [31, 16, 16, 30, 16, 16, 16],
  G: [14, 17, 16, 23, 17, 17, 15], H: [17, 17, 17, 31, 17, 17, 17], I: [14, 4, 4, 4, 4, 4, 14], J: [7, 2, 2, 2, 2, 18, 12],
  K: [17, 18, 20, 24, 20, 18, 17], L: [16, 16, 16, 16, 16, 16, 31], M: [17, 27, 21, 21, 17, 17, 17], N: [17, 17, 25, 21, 19, 17, 17],
  O: [14, 17, 17, 17, 17, 17, 14], P: [30, 17, 17, 30, 16, 16, 16], Q: [14, 17, 17, 17, 21, 18, 13], R: [30, 17, 17, 30, 20, 18, 17],
  S: [15, 16, 16, 14, 1, 1, 30], T: [31, 4, 4, 4, 4, 4, 4], U: [17, 17, 17, 17, 17, 17, 14], V: [17, 17, 17, 17, 17, 10, 4],
  W: [17, 17, 17, 21, 21, 21, 10], X: [17, 17, 10, 4, 10, 17, 17], Y: [17, 17, 10, 4, 4, 4, 4], Z: [31, 1, 2, 4, 8, 16, 31],
  '-': [0, 0, 0, 31, 0, 0, 0], '+': [0, 4, 4, 31, 4, 4, 0], '.': [0, 0, 0, 0, 0, 12, 12], ':': [0, 12, 12, 0, 12, 12, 0],
  ',': [0, 0, 0, 0, 12, 4, 8], '(': [2, 4, 8, 8, 8, 4, 2], ')': [8, 4, 2, 2, 2, 4, 8], '/': [0, 1, 2, 4, 8, 16, 0],
  '@': [14, 17, 23, 21, 23, 16, 14], '=': [0, 0, 31, 0, 31, 0, 0], '|': [4, 4, 4, 4, 4, 4, 4] };
export const MARK = { gap: [255, 0, 255], fragment: [0, 230, 255], seam: [255, 230, 0], island: [255, 140, 0] };
const BG = [92, 94, 100], PAPER = [38, 40, 46];

function canvas(w, h) { const rgb = new Uint8Array(w * h * 3); for (let i = 0; i < w * h; i++) rgb.set(PAPER, i * 3); return { w, h, rgb }; }
export function text(c, x, y, s, col = [235, 235, 235], z = 2) {
  for (const ch of String(s).toUpperCase()) {
    const g = G[ch];
    if (g) g.forEach((row, r) => { for (let b = 0; b < 5; b++) if (row & (16 >> b)) fill(c, x + b * z, y + r * z, z, z, col); });
    x += 6 * z;
  }
}
function fill(c, x, y, w, h, col) {
  for (let j = Math.max(0, y); j < Math.min(c.h, y + h); j++) for (let i = Math.max(0, x); i < Math.min(c.w, x + w); i++) c.rgb.set(col, (j * c.w + i) * 3);
}
// a window (owner map + marks) drawn into a size x size cell, box-averaged
function cell(c, x0, y0, size, rig, r, s, kind) {
  const [, , w, h] = r.box, src = sourceOf(rig, { point: r.point, moving: r.moving }, s.deg, r.box), mark = new Uint8Array(w * h);
  for (const f of s.found) if (f.kind === kind) for (const i of f.mask) mark[i] = 1;
  const k = w / size, [px, py] = [r.point[0] - r.box[0], r.point[1] - r.box[1]];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let R = 0, G2 = 0, B = 0, n = 0, m = 0;
    const v0 = Math.floor(y * k), u0 = Math.floor(x * k), v1 = Math.max(v0 + 1, Math.floor((y + 1) * k)), u1 = Math.max(u0 + 1, Math.floor((x + 1) * k));
    for (let v = v0; v < v1; v++) for (let u = u0; u < u1; u++) {
      const i = v * w + u, col = colourAt(rig, src, s.own, i) ?? BG;
      R += col[0]; G2 += col[1]; B += col[2]; n++; m += mark[i];
    }
    let col = n ? [R / n, G2 / n, B / n] : BG;
    if (m) col = MARK[kind];
    c.rgb.set(col.map(Math.round), ((y0 + y) * c.w + x0 + x) * 3);
  }
  fill(c, x0 + Math.round(px / k) - 3, y0 + Math.round(py / k), 7, 1, [255, 255, 255]);
  fill(c, x0 + Math.round(px / k), y0 + Math.round(py / k) - 3, 1, 7, [255, 255, 255]);
}

// a PNG's island: the piece round it (its own colours), the island marked
function islandCell(c, x0, y0, size, piece, isl) {
  const [a, b, a2, b2] = isl.box, side = Math.max(80, 3 * Math.max(a2 - a, b2 - b)), cx = (a + a2) / 2 - side / 2, cy = (b + b2) / 2 - side / 2;
  const mark = new Set(isl.mask), k = side / size;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = Math.floor(cx + x * k) - piece.x0, v = Math.floor(cy + y * k) - piece.y0, i = v * piece.w + u;
    const inside = u >= 0 && v >= 0 && u < piece.w && v < piece.h && piece.mask[i];
    const col = !inside ? BG : mark.has(i) ? MARK.island : [piece.rgb[i * 3], piece.rgb[i * 3 + 1], piece.rgb[i * 3 + 2]];
    c.rgb.set(col, ((y0 + y) * c.w + x0 + x) * 3);
  }
}

export function contactSheet(rig, results, report, { islands = [], cfg = JOINT_CHECK } = {}) {
  const size = cfg.crop.px, cols = 3, pad = 12, W = cols * (size + pad) + pad;
  const cells = [];
  for (const r of results) for (const kind of KINDS) {
    const j = report.joints[r.joint][kind];
    if (!j.pass) cells.push({ r, kind, s: r.samples.find((s) => s.deg === j.worst.deg), label: `${r.joint} ${kind}`, sub: `${j.worst.px}px @${j.worst.deg} (${j.flagged.length}/${r.angles.length})` });
  }
  for (const isl of islands) cells.push({ isl, kind: 'island', label: `${isl.part} island`, sub: `${isl.px}px at ${isl.box[0]},${isl.box[1]}` });
  const head = Object.keys(report.joints).length + report.islands.length + 3, rows = Math.ceil(cells.length / cols);
  const c = canvas(W, pad + head * 16 + rows * (size + 44) + pad);
  text(c, pad, pad, `joint check: ${report.pass ? 'PASS' : 'FAIL'}  (${cells.length} flagged)`, report.pass ? [120, 230, 120] : [255, 120, 110]);
  let y = pad + 24;
  for (const [n, j] of Object.entries(report.joints)) {
    text(c, pad, y, `${j.pass ? 'ok  ' : 'FAIL'} ${n} ${j.limits.join('..')}: ` + KINDS.map((k) => (j[k].pass ? '' : `${k} ${j[k].worst.px}`)).filter(Boolean).join(', '), j.pass ? [150, 200, 150] : [255, 170, 150]);
    y += 16;
  }
  for (const i of report.islands) { text(c, pad, y, `FAIL island ${i.part} ${i.px}px`, [255, 170, 150]); y += 16; }
  y += 8;
  cells.forEach((e, n) => {
    const x = pad + (n % cols) * (size + pad), yy = y + Math.floor(n / cols) * (size + 44);
    if (e.isl) islandCell(c, x, yy, size, rig.parts[e.isl.part], e.isl); else cell(c, x, yy, size, rig, e.r, e.s, e.kind);
    text(c, x, yy + size + 6, e.label, MARK[e.kind]);
    text(c, x, yy + size + 24, e.sub);
  });
  return c;
}
