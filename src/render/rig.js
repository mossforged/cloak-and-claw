// Draws a fighter as a cutout rig: parts in a hierarchy, posed by rig-pose.js, drawn into a
// buffer that is then placed like a standee (same lean/squash/flip, shadow, flash and tints).
import { phaseOf } from '../sim/fighter.js';
import { poseOf, BLOCK_LEAN } from './standee.js';
import { rigJoints } from './rig-pose.js';

const RES = 2;                                   // buffer px per screen px (keeps parts sharp)
const BOX = { w: 300, h: 260, ox: 150, oy: 200 };  // buffer area in screen px; (ox, oy) = feet
const D = Math.PI / 180;
const memory = new WeakMap();                    // fighter -> pose blend memory (render-only)

// 2D affine matrices [a, b, c, d, e, f] (same layout as canvas setTransform).
const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
const rot = (deg) => { const c = Math.cos(deg * D), s = Math.sin(deg * D); return [c, s, -s, c, 0, 0]; };
const tr = (x, y) => [1, 0, 0, 1, x, y];
const sc = (x, y = x) => [x, 0, 0, y, 0, 0];
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const scaleOf = (p) => (Array.isArray(p.scale) ? p.scale : [p.scale ?? 1, p.scale ?? 1]);
// image -> bone frame (no translation); pose stretch '<part>.sx/.sy' multiplies the data scale.
const shape = (name, p, j) => { const [x, y] = scaleOf(p); return mul(sc(x * (j[`${name}.sx`] ?? 1), y * (j[`${name}.sy`] ?? 1)), rot(p.rest ?? 0)); };

// A swap image is drawn so its pixel (x, y) lands on the part's own (offset + scale * (x, y)):
// pivot and children's attach points stay in the part's own pixels whichever image shows.
const swapMatrix = (s) => mul(tr(...(s.offset ?? [0, 0])), sc(s.scale ?? 1));

// Each part's image matrix (part px -> screen px, feet at 0,0) and image path, in draw order.
// swap: { part: swap name } from the pose. Pure; tests use it.
export function layoutRig(rig, joints, swap = {}) {
  const frames = {};
  const frameOf = (name) => {
    if (frames[name]) return frames[name];
    const p = rig.parts[name];
    let m;
    if (!p.parent) m = mul(mul(tr(joints.dx ?? 0, (joints.dy ?? 0) - rig.rootY), sc(rig.scale * (joints.sx ?? 1), rig.scale)), rot(joints[name] ?? 0));
    else {
      const q = rig.parts[p.parent];
      const [ax, ay] = apply(shape(p.parent, q, joints), p.attach[0] - q.pivot[0], p.attach[1] - q.pivot[1]);
      const pf = frameOf(p.parent);
      // upright parts (the shield) cancel their parents' turn: the pose angle is relative to the rig, not the arm
      const undo = p.upright ? -Math.atan2(pf[1], pf[0]) / D : 0;
      m = mul(mul(pf, tr(ax, ay)), rot(undo + (joints[name] ?? 0)));
    }
    return (frames[name] = m);
  };
  return Object.entries(rig.parts)
    .map(([name, p]) => {
      const m = mul(mul(frameOf(name), shape(name, p, joints)), tr(-p.pivot[0], -p.pivot[1]));
      const s = p.swaps?.[swap[name]];
      return { name, p, order: joints[`${name}.order`] ?? p.order, img: s ? s.img : p.img, swap: s ? swap[name] : null, m: s ? mul(m, swapMatrix(s)) : m };
    })
    .sort((a, b) => a.order - b.order);
}

let buf, tintBuf;
const canvas = () => { const c = document.createElement('canvas'); c.width = BOX.w * RES; c.height = BOX.h * RES; return c; };

function tinted(color) {
  tintBuf ??= canvas();
  const g = tintBuf.getContext('2d');
  g.globalCompositeOperation = 'copy'; g.drawImage(buf, 0, 0);
  g.globalCompositeOperation = 'source-in'; g.fillStyle = color; g.fillRect(0, 0, tintBuf.width, tintBuf.height);
  return tintBuf;
}

// pose: optional named pose to hold (view-only test poses such as `cast`).
export function drawRig(ctx, f, rig, assets, time, flash = 0, pose) {
  if (!memory.has(f)) memory.set(f, {});
  const mem = memory.get(f), joints = rigJoints(f, rig, time, mem, pose);
  buf ??= canvas();
  const g = buf.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, buf.width, buf.height);
  g.imageSmoothingQuality = 'high';
  for (const { img, m } of layoutRig(rig, joints, mem.swap)) {
    g.setTransform(RES, 0, 0, RES, BOX.ox * RES, BOX.oy * RES);
    g.transform(...m);
    g.drawImage(assets.get(img), 0, 0);
  }

  const p = { ...poseOf(f, time) };
  if (f.move) p.rot *= rig.poses.timing.bodyLean;   // the joints already lean into the swing
  if (f.state === 'walk' && !f.move) { p.dy = 0; p.rot = 0; }   // the rig's own walk cycle bobs in step
  if (f.state === 'block') { p.rot -= BLOCK_LEAN; p.sx = p.sy = 1; }   // the block pose leans and crouches; keep only the jolt
  let alpha = 1;
  if (f.state === 'dead') alpha = f.t % 8 < 4 ? 1 : 0.25;
  if (f.invuln > 0 && f.state === 'idle') alpha = f.invuln % 6 < 3 ? 1 : 0.55;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(f.x + p.dx * f.facing, f.y - f.z + p.dy);
  ctx.rotate(p.rot * f.facing);
  ctx.scale(p.sx * f.facing, p.sy);
  const put = (img) => ctx.drawImage(img, -BOX.ox, -BOX.oy, BOX.w, BOX.h);
  put(buf);
  if (f.state === 'hurt' || f.state === 'knockdown') { ctx.globalAlpha = alpha * 0.28; put(tinted('#ff3b30')); }
  if (f.move?.fx?.telegraph && phaseOf(f)[0] === 'windup') { ctx.globalAlpha = 0.25 + 0.25 * Math.sin(time * 40); put(tinted('#ffd23f')); }
  if (flash > 0) { ctx.globalAlpha = flash; put(tinted('#ffffff')); }
  ctx.restore();
}
