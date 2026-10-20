// T036, pure: the joint checker. Each joint of a rig (tools/bench/joint-rig.js) turned through its range with every piece
// below it; a window round the joint point checked per sample for gaps / notches, detached fragments and seam lines,
// each new against the rest pose (what already shows at rest is the rest check's business). Numbers: data/joint-check.js.
import { JOINT_CHECK } from '../../src/data/joint-check.js';
import { close, dilate, components, edt } from './masks.js';
import { widthAt } from './joint-rig.js';

const rad = (d) => (d * Math.PI) / 180;
// the window's owner map: top opaque piece index per pixel (-1 none), pieces in the moving set turned by deg about pt
export function composite(rig, joint, deg, box) {
  const [bx, by, w, h] = box, own = new Int16Array(w * h).fill(-1), mov = new Set(joint.moving);
  const c =Math.cos(rad(-deg)), s = Math.sin(rad(-deg)), [px, py] = joint.point;
  rig.order.forEach((n, k) => {
    const p = rig.parts[n];
    if (!p.area) return;
    const turn = mov.has(n) && deg;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let X = bx + x + 0.5, Y = by + y + 0.5;
      if (turn) { const dx = X - px, dy = Y - py; X = px + dx * c - dy * s; Y = py + dx * s + dy * c; }
      const u = Math.floor(X) - p.x0, v = Math.floor(Y) - p.y0;
      if (u >= 0 && v >= 0 && u < p.w && v < p.h && p.mask[v * p.w + u]) own[y * w + x] = k;
    }
  });
  return own;
}
// where a window pixel of a turned piece sat at rest (window px)
const restOf = (joint, deg, box) => {
  const c = Math.cos(rad(-deg)), s = Math.sin(rad(-deg)), [px, py] = joint.point, [bx, by, w] = box;
  return (i) => { const X = bx + (i % w) + 0.5 - px, Y = by + Math.floor(i / w) + 0.5 - py; return [Math.floor(px + X * c - Y * s) - bx, Math.floor(py + X * s + Y * c) - by]; };
};
// (piece index k, window px i) -> the px in piece k's own crop it shows
export function sourceOf(rig, joint, deg, box) {
  const back = restOf(joint, deg, box), mov = new Set(joint.moving.map((n) => rig.order.indexOf(n)));
  return (k, i) => { const p = rig.parts[rig.order[k]], [u, v] = mov.has(k) ? back(i) : [i % box[2], Math.floor(i / box[2])]; return [u + box[0] - p.x0, v + box[1] - p.y0]; };
}
export function colourAt(rig, src, own, i) {
  const k = own[i];
  if (k < 0) return null;
  const p = rig.parts[rig.order[k]], [u, v] = src(k, i);
  if (u < 0 || v < 0 || u >= p.w || v >= p.h) return [255, 255, 255];
  const j = (v * p.w + u) * 3;
  return [p.rgb[j], p.rgb[j + 1], p.rgb[j + 2]];
}

function measures(rig, joint, own, src, box, R, cfg) {
  const [bx, by, w, h] = box, n = w * h, idx = (name) => rig.order.indexOf(name);
  const child = new Set(joint.child.map(idx)), side = new Set(joint.parentSide.map(idx)), mov = new Set(joint.moving.map(idx));
  const disc = new Uint8Array(n), U = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    U[i] = own[i] >= 0 ? 1 : 0;
    disc[i] = Math.hypot(bx + (i % w) + 0.5 - joint.point[0], by + Math.floor(i / w) + 0.5 - joint.point[1]) <= R ? 1 : 0;
  }
  // gap: filled by closing the outline, inside the disc, within `close` px of both the turning piece and the pieces next
  // to it in the tree (joint.near: a notch in the join, not the slit between a fist and the belly)
  const closed = close(U, w, h, cfg.gap.close), gap = new Uint8Array(n);
  const touch = (set) => { const m = new Uint8Array(n); for (let i = 0; i < n; i++) m[i] = set.has(own[i]) ? 1 : 0; return dilate(m, w, h, cfg.gap.close); };
  const tc = touch(child), ts = touch(new Set((joint.near ?? joint.parentSide).map(idx)));
  for (let i = 0; i < n; i++) gap[i] = closed[i] && !U[i] && disc[i] && tc[i] && ts[i] ? 1 : 0;
  // fragments: visible pieces of the join's own pieces, 4-connected, all but each piece's biggest, off the window frame
  const frag = new Uint8Array(n);
  for (const k of [...child, ...side]) {
    const m = new Uint8Array(n);
    for (let i = 0; i < n; i++) m[i] = own[i] === k ? 1 : 0;
    for (const c of components(m, w, h, false).slice(1)) if (!c.edge && c.area <= cfg.fragment.max) for (const i of c.px) if (disc[i]) frag[i] = 1;
  }
  // seams: dark px of the covered piece next to the covering piece across the join, away from the outside
  const near = (set) => { const m = new Uint8Array(n); for (let i = 0; i < n; i++) m[i] = set.has(own[i]) ? 1 : 0; return dilate(m, w, h, cfg.seam.near); };
  const nearChild = near(child), nearSide = near(side), outside = dilate(U.map((v) => 1 - v), w, h, cfg.seam.edge);
  const seam = new Uint8Array(n), lum = (k, i) => { const [r, g, b] = colourAt(rig, src, own, i); return 0.299 * r + 0.587 * g + 0.114 * b; };
  for (let i = 0; i < n; i++) {
    const k = own[i];
    if (k < 0 || !disc[i] || outside[i]) continue;
    const covered = child.has(k) ? nearSide[i] && [...side].some((q) => q > k) : side.has(k) ? nearChild[i] && [...child].some((q) => q > k) : false;
    if (covered && lum(k, i) < cfg.seam.dark) seam[i] = 1;
  }
  return { gap, frag, seam, mov };
}

// canvas box round some window components
const boxOf = (cs, box) => [Math.min(...cs.map((c) => c.box[0])) + box[0], Math.min(...cs.map((c) => c.box[1])) + box[1],
  Math.max(...cs.map((c) => c.box[2])) + box[0], Math.max(...cs.map((c) => c.box[3])) + box[1]];

export function checkJoint(rig, joint, cfg = JOINT_CHECK) {
  const P = rig.parts[joint.part], width = widthAt(P, joint.point);
  const R = Math.round(Math.min(cfg.window.max, Math.max(cfg.window.min, width * cfg.window.factor)));
  const m = 2 * cfg.gap.close + 4, box = [Math.floor(joint.point[0] - R - m), Math.floor(joint.point[1] - R - m), 2 * (R + m), 2 * (R + m)];
  const [lo, hi] = joint.limits, angles = Array.from({ length: cfg.samples }, (_, i) => +(lo + ((hi - lo) * i) / (cfg.samples - 1)).toFixed(2));
  const run = (deg) => {
    const own = composite(rig, joint, deg, box), src = sourceOf(rig, joint, deg, box);
    return { own, src, back: restOf(joint, deg, box), ...measures(rig, joint, own, src, box, R, cfg) };
  };
  const rest = run(0), [, , w, h] = box, samples = [];
  for (const deg of angles) {
    const s = deg ? run(deg) : rest, found = [], score = {};   // score: share of the flag limit (>= 1 flags)
    for (const kind of ['gap', 'frag', 'seam']) {
      const m = s[kind], keep = new Uint8Array(w * h);
      for (let i = 0; i < w * h; i++) {
        if (!m[i]) continue;
        // new vs rest: not there at rest in the static frame, nor (for a moving piece's px, or a gap) in the turned frame
        const k = s.own[i], [u, v] = s.back(i), atRest = (x, y) => x >= 0 && y >= 0 && x < w && y < h && rest[kind][y * w + x];
        const old = atRest(i % w, Math.floor(i / w)) || ((kind === 'gap' || s.mov.has(k)) && atRest(u, v));
        if (!old) keep[i] = 1;
      }
      const comps = components(keep, w, h);
      if (kind === 'gap') {
        score.gap = comps.length ? comps[0].area / cfg.gap.min : 0;
        for (const c of comps) if (c.area >= cfg.gap.min) found.push({ kind, px: c.area, box: boxOf([c], box), mask: c.px });
        continue;
      }
      // seams and fragments add up per sample (a broken-up join is many small bits), against the window's size (R)
      let parts;
      if (kind === 'seam') parts = comps.filter((c) => c.area >= cfg.seam.floor);
      else {   // thin scraps: thickness = twice the deepest px's distance out of the scrap
        const depth = edt(keep.map((v) => 1 - v), w, h), F = cfg.fragment;
        parts = comps.filter((c) => c.area >= F.floor && 2 * Math.sqrt(c.px.reduce((a, i) => Math.max(a, depth[i]), 0)) <= F.thin);
      }
      const total = parts.reduce((n, c) => n + c.area, 0), K = kind === 'seam' ? cfg.seam : cfg.fragment;
      score[kind === 'seam' ? 'seam' : 'fragment'] = total / (K.perR * R);
      if (parts.length && total >= K.perR * R) found.push({ kind: kind === 'seam' ? 'seam' : 'fragment', px: total, count: parts.length, box: boxOf(parts, box), mask: parts.flatMap((c) => c.px) });
    }
    samples.push({ deg, found, score, own: s.own });
  }
  return { joint: joint.name, part: joint.part, moving: joint.moving, point: joint.point, limits: joint.limits, R, width, box, angles, samples };
}
