// T036, pure: a rig-source.json (Art's format: every piece on the master canvas, pivots in canvas px) as pieces for the
// joint checker: each piece's opaque mask + colour cropped to its box, draw order, joints (point, range, turning piece,
// the pieces that turn with it, the pieces on each side of the join). `read(path) -> { w, h, rgba }`.
import { JOINT_CHECK } from '../../src/data/joint-check.js';
import { islands } from './masks.js';

// opaque: real alpha when the PNG has it, else green key (key_green.py's spill, half-alpha point)
export function pieceOf(name, img, solid = JOINT_CHECK.key.solid) {
  const { w, h, rgba } = img;
  let hasAlpha = false;
  for (let i = 3; i < rgba.length; i += 4) if (rgba[i] < 255) { hasAlpha = true; break; }
  const full = new Uint8Array(w * h);
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let i = 0; i < w * h; i++) {
    const r = rgba[i * 4], g = rgba[i * 4 + 1], b = rgba[i * 4 + 2];
    const on = hasAlpha ? rgba[i * 4 + 3] >= 128 : g - Math.max(r, b) < solid;
    if (!on) continue;
    full[i] = 1;
    const x = i % w, y = (i - x) / w;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  if (x1 < 0) return { name, x0: 0, y0: 0, w: 0, h: 0, mask: new Uint8Array(0), rgb: new Uint8Array(0), area: 0 };
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1, mask = new Uint8Array(cw * ch), rgb = new Uint8Array(cw * ch * 3);
  let area = 0;
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const s = (y + y0) * w + x + x0, d = y * cw + x;
    if (!full[s]) continue;
    mask[d] = 1; area++;
    rgb[d * 3] = rgba[s * 4]; rgb[d * 3 + 1] = rgba[s * 4 + 1]; rgb[d * 3 + 2] = rgba[s * 4 + 2];
  }
  return { name, x0, y0, w: cw, h: ch, mask, rgb, area };
}

// src: the parsed rig-source; joints: optional fitted joints file ({ joints: { name: { world, limits } } }); resolve(img) -> path
export function loadRig(src, { joints = null, read, resolve, cfg = JOINT_CHECK } = {}) {
  const parts = {}, notes = [];
  for (const [name, p] of Object.entries(src.parts)) {
    const piece = pieceOf(name, read(resolve(p.img)), cfg.key.solid);
    parts[name] = { ...piece, parent: p.parent && src.parts[p.parent] ? p.parent : null, missingParent: p.parent && !src.parts[p.parent] ? p.parent : null,
      pivot: p.pivot, point: p.pivotPoint ?? p.skeleton_from ?? null, band: p.band ?? 0 };
  }
  const order = src.drawOrder?.filter((n) => parts[n]) ?? Object.keys(parts).sort((a, b) => parts[a].band - parts[b].band);
  for (const n of Object.keys(parts)) if (!order.includes(n)) order.push(n);
  const kids = (n) => Object.keys(parts).filter((k) => parts[k].parent === n);
  const below = (n) => [n, ...kids(n).flatMap(below)];
  const turning = new Set(Object.values(cfg.turns));
  const list = joints?.joints ? Object.entries(joints.joints).map(([n, j]) => [n, j.world, j.limits])
    : Object.entries(src.limits_deg ?? {}).map(([n, lim]) => [n, src.points?.[n], lim]);
  const out = [];
  for (const [name, world, limits] of list) {
    const cands = Object.keys(parts).filter((k) => parts[k].point === name);
    const part = cands.includes(cfg.turns[name]) ? cfg.turns[name] : cands.sort((a, b) => below(b).length - below(a).length)[0];
    if (!part) { notes.push(`${name}: no piece turns there, skipped`); continue; }
    const P = parts[part];
    if (!P.parent) { notes.push(`${name}: ${part} has no parent piece${P.missingParent ? ` (${P.missingParent} not in this source)` : ''}, skipped`); continue; }
    // the parent side: the parent and the pieces riding it without a joint of their own (seat, belt, scarf)
    const parentSide = [P.parent, ...kids(P.parent).filter((k) => k !== part && !turning.has(k))];
    // what a notch may open against: the parent side plus the parent's other neighbours in the tree (its parent, its
    // other children: the head beside the shoulder, the thigh above the ankle), not the far body (a pouch by the fist)
    const near = [...new Set([...parentSide, ...kids(P.parent).filter((k) => k !== part), parts[P.parent].parent].filter(Boolean))];
    out.push({ name, part, point: world ?? P.pivot, limits, moving: below(part), child: [part], parentSide, near });
  }
  return { parts, order, joints: out, notes };
}

// each piece's own detached islands (canvas px boxes)
export function pieceIslands(rig, cfg = JOINT_CHECK) {
  const out = [];
  for (const p of Object.values(rig.parts)) {
    if (!p.area) continue;
    for (const c of islands(p.mask, p.w, p.h, { grow: cfg.island.grow, min: cfg.island.min }))
      out.push({ part: p.name, kind: 'island', px: c.area, box: [c.box[0] + p.x0, c.box[1] + p.y0, c.box[2] + p.x0, c.box[3] + p.y0], mask: c.px.filter((i) => p.mask[i]) });
  }
  return out;
}

// the turning piece's width across the joint point (opaque run through it, perpendicular to the piece's direction)
export function widthAt(piece, point) {
  let sx = 0, sy = 0, n = 0;
  for (let i = 0; i < piece.mask.length; i += 7) if (piece.mask[i]) { const x = i % piece.w; sx += x; sy += (i - x) / piece.w; n++; }
  if (!n) return 0;
  let dx = sx / n + piece.x0 - point[0], dy = sy / n + piece.y0 - point[1];
  const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
  const on = (t) => { const x = Math.round(point[0] - dy * t - piece.x0), y = Math.round(point[1] + dx * t - piece.y0); return x >= 0 && y >= 0 && x < piece.w && y < piece.h && piece.mask[y * piece.w + x]; };
  let a = 0, b = 0;
  while (a < 2000 && on(-a - 1)) a++;
  while (b < 2000 && on(b + 1)) b++;
  return a + b + 1;
}
