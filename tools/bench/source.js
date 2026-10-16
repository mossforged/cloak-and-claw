// Rig bench (T016), pure part: reads a rig-source.json (rig standard section 5, rule 4), builds a game-format rig from it
// (parts for render/rig.js layoutRig) and plays the standard biped strip (data/rigs/biped-poses.js) on it.
// No DOM: tests run it under Node. The page (tools/rig-bench.html) adds image keying and drawing.
//
// rig-source.json: every part image sits on one shared canvas exactly where it is in the master, so a joint is one
// canvas point shared by parent and child. `pivot` = that joint (canvas px); `band` = draw-order band.
// Fixture-only extra: "dir" (repo-relative folder of the images) when the json is not in Art's delivery folder.
import { BIPED } from '../../src/data/rigs/biped-poses.js';

const D = Math.PI / 180;

// Where a delivery lives. ?src=<ID>-<slug> -> Art's folder; ?fixture=<name> -> tools/fixtures/<name>.rig-source.json.
export function sourceUrl(q) {
  if (q.get('fixture')) return `tools/fixtures/${q.get('fixture')}.rig-source.json`;
  return `assets/source/${q.get('src') ?? 'A010-rat-raider-standard'}/rig-source.json`;
}

// Normalises a parsed rig-source.json: image paths repo-relative, every part/swap/overlay with its canvas pivot.
export function readSource(json, url) {
  const dir = json.dir ?? url.slice(0, url.lastIndexOf('/'));
  const path = (img) => `${dir}/${img}`;
  const parts = {};
  for (const [name, p] of Object.entries(json.parts ?? {})) {
    parts[name] = { name, img: path(p.img), parent: p.parent ?? null, pivot: p.pivot, band: p.band ?? 500 };
  }
  const swaps = {};
  for (const [name, s] of Object.entries(json.swaps ?? {})) if (parts[s.of]) swaps[name] = { name, img: path(s.img), of: s.of };
  const overlays = {};
  for (const [name, o] of Object.entries(json.overlays ?? {})) overlays[name] = { name, img: path(o.img), on: o.on };
  const errors = [];
  for (const p of Object.values(parts)) {
    if (p.parent && !parts[p.parent]) errors.push(`${p.name}: parent ${p.parent} missing`);
    if (!Array.isArray(p.pivot) || p.pivot.length !== 2) errors.push(`${p.name}: no pivot`);
  }
  for (const [name, s] of Object.entries(json.swaps ?? {})) if (!parts[s.of]) errors.push(`swap ${name}: part ${s.of} missing`);
  const roots = Object.values(parts).filter((p) => !p.parent).map((p) => p.name);
  if (roots.length !== 1) errors.push(`expected one root part, found ${roots.join(', ') || 'none'}`);
  return { canvas: json.canvas, master: path(json.master), floorY: json.floorY, fighter: json.fighter ?? null, note: json.note ?? '',
    parts, swaps, overlays, root: roots[0], errors,
    missing: BIPED.parts.filter((n) => !parts[n]), extras: Object.keys(parts).filter((n) => !(n in BIPED.parents)) };
}

// Builds a rig for render/rig.js from a read source. Images are drawn trimmed: boxes[img] = [x0, y0, x1, y1] on the
// canvas (default: the whole canvas). top = the master's highest silhouette row; height = screen px tall (game size).
// rest 0 everywhere: joint angle 0 = the master pose. Bands become draw order.
export function buildRig(src, { boxes = {}, top = 0, height = 136 } = {}) {
  const box = (img) => boxes[img] ?? [0, 0, ...src.canvas];
  const local = (img, [x, y]) => [x - box(img)[0], y - box(img)[1]];
  const scale = height / (src.floorY - top);
  const parts = {};
  for (const p of Object.values(src.parts)) {
    const swaps = {};
    for (const s of Object.values(src.swaps)) {
      if (s.of !== p.name) continue;
      swaps[s.name] = { img: s.img, offset: [box(s.img)[0] - box(p.img)[0], box(s.img)[1] - box(p.img)[1]] };
    }
    parts[p.name] = { img: p.img, pivot: local(p.img, p.pivot), order: p.band, rest: 0, swaps };
    if (p.parent) Object.assign(parts[p.name], { parent: p.parent, attach: local(src.parts[p.parent].img, p.pivot) });
  }
  const rootPivot = src.parts[src.root].pivot;
  return { id: 'bench', scale, rootY: (src.floorY - rootPivot[1]) * scale, parts, root: src.root,
    // where the root's pivot sits relative to the master's feet line, screen px (for placing the figure)
    canvasToScreen: ([x, y]) => [(x - rootPivot[0]) * scale, (y - src.floorY) * scale] };
}

const ease = {
  out: (t) => 1 - (1 - t) ** 3,
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  back: (t, s = 1.6) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2,
};

// A standard pose at time t: { channel: value } (waves evaluated), swaps and flags separate.
export function evalPose(pose, t) {
  const out = {};
  for (const [k, v] of Object.entries(pose ?? {})) {
    if (k === 'speed' || k === 'swap' || k === 'ground' || k === 'air') continue;
    out[k] = Array.isArray(v) ? v[0] + v[1] * Math.sin(2 * Math.PI * ((pose.speed ?? 1) * t * (v[3] ?? 1) + (v[2] ?? 0))) : v;
  }
  return out;
}
const mix = (a, b, k) => {
  const o = {};
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) o[key] = (a[key] ?? 0) + ((b[key] ?? 0) - (a[key] ?? 0)) * k;
  return o;
};

export const stripLength = (strip = BIPED.strip) => strip.reduce((s, st) => s + st.in + st.hold, 0);

// The strip at time t (wraps): standard joints, swap lists, ground flag, step index and label.
export function stripAt(t, strip = BIPED.strip, poses = BIPED.poses) {
  t = ((t % stripLength(strip)) + stripLength(strip)) % stripLength(strip);
  let t0 = 0, i = 0;
  while (t >= t0 + strip[i].in + strip[i].hold) t0 += strip[i].in + strip[i].hold, i++;
  const st = strip[i], prev = strip[(i - 1 + strip.length) % strip.length];
  const k = st.in > 0 ? Math.min(1, (t - t0) / st.in) : 1;
  const pose = poses[st.pose];
  const joints = mix(evalPose(poses[prev.pose], t), evalPose(pose, t - t0), ease[st.ease ?? 'inOut'](k));
  // `ground` lifts while blending in too (k scales it), so the fall lands rather than pops
  return { joints, swap: pose.swap ?? {}, ground: pose.ground ? k : 0, air: !!pose.air, step: i, pose: st.pose, label: st.label };
}

// Times of the exported strip's frames: each labelled step once fully reached (walk at each `frames` share of a stride).
export function stripFrames(strip = BIPED.strip, poses = BIPED.poses) {
  const out = [];
  let t0 = 0;
  for (const st of strip) {
    if (st.label) {
      const at = t0 + st.in + 0.001;
      if (st.frames) for (const f of st.frames) out.push({ label: `${st.label} ${f}`, t: at + f / (poses[st.pose].speed ?? 1) });
      else out.push({ label: st.label, t: at + Math.min(st.hold, 0.05) });
    }
    t0 += st.in + st.hold;
  }
  return out;
}

// Standard joints -> this rig's joints. Each standard part's turn adds up its standard chain (missing parts still turn
// their children); each rig part then gets its absolute turn minus its own parent's, so a rig with another hierarchy
// (legs on the torso, no pelvis) still ends up with every limb at the standard's angle. Extras ride on their parent.
export function rigJointsOf(src, std) {
  const absStd = {};
  const stdAbs = (n) => (n in absStd ? absStd[n] : (absStd[n] = (std[n] ?? 0) + (BIPED.parents[n] ? stdAbs(BIPED.parents[n]) : 0)));
  const abs = {};
  const absOf = (n) => {
    if (n in abs) return abs[n];
    const p = src.parts[n];
    return (abs[n] = n in BIPED.parents ? stdAbs(n) : (p.parent ? absOf(p.parent) : 0));
  };
  const out = { dx: std.dx ?? 0, dy: std.dy ?? 0 };
  for (const [n, p] of Object.entries(src.parts)) out[n] = absOf(n) - (p.parent ? absOf(p.parent) : 0);
  return out;
}

// Pose swap lists -> { part: swap name } using the first swap this character has; parts it lacks are skipped.
export function swapsOf(src, swap) {
  const out = {};
  for (const [part, names] of Object.entries(swap ?? {})) {
    if (!src.parts[part]) continue;
    const hit = [].concat(names).find((n) => src.swaps[n]?.of === part);
    if (hit) out[part] = hit;
  }
  return out;
}

// Whole-figure turn round the feet (body channel), as a matrix applied after layoutRig's.
export function bodyMatrix(deg = 0) {
  const c = Math.cos(deg * D), s = Math.sin(deg * D);
  return [c, s, -s, c, 0, 0];
}
