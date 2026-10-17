// Model viewer (T027) overlays, drawn over a slot from the frame drawRig just drew (render/rig.js lastFrame): floor
// lines (near solid, far dashed), joint pivots, sockets, the stretch test's flags live on this frame (seams, feet off
// their floor lines, hold flags; tools/bench/stretch.js), hit and hurt boxes. Browser only.
import { lastFrame } from '../render/rig.js';
import { socketOf } from '../render/sockets.js';
import { grounded, lying } from '../render/floor.js';
import { hitboxOf, hurtboxOf } from '../sim/combat.js';
import { floorLine } from '../data/rigs/biped-floor.js';
import { flagsOf } from '../../tools/bench/stretch.js';

const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
// The rig's feet-relative view (as the stretch test's cells) and rig px -> world px (drawRig's placement).
const viewOf = (p, k) => { const c = Math.cos(p.rot), s = Math.sin(p.rot); return [p.sx * k * c, p.sx * k * s, -p.sy * k * s, p.sy * k * c, p.dx, p.dy]; };
const worldOf = (f, view) => mul([f.facing, 0, 0, 1, f.x, f.y - f.z], view);

// Image alpha for the seam check (cached per image path).
const alphas = new Map();
function alphaOf(assets, path) {
  if (!alphas.has(path)) {
    const im = assets.get(path);
    if (!im?.width) return null;
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data, a = new Uint8Array(c.width * c.height);
    for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3];
    alphas.set(path, { w: c.width, h: c.height, alpha: a });
  }
  return alphas.get(path);
}

// Live stretch flags on the model's current frame (cached by frame: they only change when the frame does).
let flagKey = null, flagOut = { flags: [], marks: [] };
function liveFlags(sb, F, assets) {
  const key = `${sb.cfg.f}|${sb.cfg.anim}|${sb.n}|${sb.cfg.item}|${sb.cfg.grip}|${sb.cfg.v}`;
  if (key === flagKey) return flagOut;
  const f = sb.hero, rest = ['down', 'dead'].includes(f.state);
  const cell = { rig: sb.rig, L: F.L, swap: F.swap, held: F.held, joints: F.joints, view: viewOf(F.p, F.k), k: F.k,
    floor: grounded(f) && !lying(f), lying: rest, twoHand: F.held?.kit?.grip === 'two-hand', hold: !!F.held?.part };
  let flags;
  try { flags = flagsOf(cell, (p) => alphaOf(assets, p)); } catch (e) { flags = [`(check failed: ${e.message})`]; }
  flagKey = key; flagOut = { flags, marks: cell.marks ?? [] };
  return flagOut;
}

export function drawOverlays(ctx, sb, M, o) {
  const ov = o.ov, f = sb.hero, F = lastFrame(f);
  if (!ov.length || !F) return [];
  const s = M[0], view = viewOf(F.p, F.k), W = worldOf(f, view), toScreen = mul(M, W);
  const dot = (pt, r, color) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(pt[0], pt[1], r, 0, 7); ctx.fill(); };
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.lineWidth = 1.5; ctx.font = '11px system-ui, sans-serif';
  if (ov.includes('floor')) for (const [foot, dash, color] of [['foot-near', [], '#ffe08a'], ['foot-far', [6, 4], '#9fd8ff']]) {
    if (!sb.rig.parts[foot]) continue;
    const y = apply(M, [0, f.y + floorLine(sb.rig, foot) * F.k * F.p.sy])[1];
    ctx.strokeStyle = color; ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ctx.canvas.width, y); ctx.stroke(); ctx.setLineDash([]);
  }
  if (ov.includes('pivots')) for (const e of F.L) {
    if (!e.m || !e.p?.pivot) continue;
    const at = apply(mul(toScreen, e.m), e.p.pivot);
    dot(at, 3.5, '#00e5ff'); ctx.strokeStyle = '#003a44'; ctx.lineWidth = 1; ctx.stroke();
  }
  if (ov.includes('sockets')) for (const name of Object.keys(sb.rig.sockets ?? {})) {
    const p = socketOf(f, name);
    if (!p) continue;
    const at = apply(M, p);
    dot(at, 4, '#ff7ad9'); ctx.fillStyle = '#fff'; ctx.fillText(name, at[0] + 6, at[1] - 4);
  }
  if (ov.includes('hitbox')) for (const g of sb.w.fighters) {
    const box = (b, color, fill) => {
      const [x0, y0] = apply(M, [b.x0, b.y - b.z1]), [x1, y1] = apply(M, [b.x1, b.y - b.z0]);
      if (fill) { ctx.fillStyle = fill; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); }
      ctx.strokeStyle = color; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    };
    box(hurtboxOf(g), 'rgba(90,255,120,0.9)');
    const hb = hitboxOf(g);
    if (hb) box(hb, 'rgba(255,60,60,1)', 'rgba(255,60,60,0.25)');
  }
  let flags = [];
  if (ov.includes('seams')) {
    const L = liveFlags(sb, F, o.assets);
    flags = L.flags;
    for (const m of L.marks) {
      const at = apply(M, apply([f.facing, 0, 0, 1, f.x, f.y - f.z], m));
      ctx.strokeStyle = '#ff2d2d'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(at[0], at[1], 7 + s * 3, 0, 7); ctx.stroke();
    }
  }
  return flags;
}
