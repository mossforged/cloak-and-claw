// Drag to pose (T031), browser: viewer.html?pose=<fighter>&from=<clip>:<frame> (default the idle). The rig at full width
// with round handles on each hand, foot, the head and the hips (touch and mouse): drag a hand or foot and its arm or leg
// follows by IK inside its joint limits; the small ring beside a hand or foot twists it; the hips move the body with the
// feet planted; the head turns on the neck. Drawn with drawRig (the game's own draw path); solves in pose-drag.js.
import { loadAssets, collectArtPaths } from '../core/assets.js';
import { FIGHTERS } from '../data/fighters/index.js';
import { RIGS } from '../data/rigs/index.js';
import { ITEMS } from '../data/items/index.js';
import { POSE_LIMITS } from '../data/pose-limits.js';
import { BUILD } from '../config.js';
import { drawRig, rigMemory, lastFrame } from '../render/rig.js';
import { drawShadow } from '../render/standee.js';
import { startPose, poseRig, poseFrame, solveOf, dragTo, dragNode, handles, readout, poseLine, parsePose, applyUrl, formatPose, nodeAnchor } from './pose-state.js';
import { twist, dragHips, dragHead, turnNode, byName, pivotAt } from './pose-drag.js';
import { createPanel } from './pose-panel.js';
import { VERSION_RIGS, versionsOf } from './models.js';

const D = Math.PI / 180, ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) / D, wrap = (d) => ((d + 540) % 360) - 180;
const U = parsePose(location.search);
if (!FIGHTERS[U.id]) U.id = 'rat-raider';
if (!versionsOf(U.id).includes(U.version)) U.version = 'current';
document.body.className = 'posing';
document.body.innerHTML = '<div id="stage"><canvas id="view"></canvas><div id="hud"></div></div><div id="sheet"><section id="panel"></section></div>';
const canvas = document.getElementById('view'), ctx = canvas.getContext('2d'), hud = document.getElementById('hud');
hud.textContent = 'Loading art...';
const assets = await loadAssets(collectArtPaths(FIGHTERS, RIGS, ITEMS, VERSION_RIGS));   // T035: + compare versions (v3)

let P = applyUrl(startPose(U), U), L = [], H = [], M = [1, 0, 0, 1, 0, 0], drag = null, dirty = true;
const undo = [];
const writeUrl = () => history.replaceState(null, '', `${location.pathname}?${formatPose(P)}`);
const note = (msg) => { panel.show(poseLine(P), msg); };

// The drawn figure's extent in rig px [minX, minY, maxX] (every drawing's corners, a little floor room): the camera fits it
// once per start pose (not while dragging, so the rig never zooms under a finger)
let fit = null;
function fitOf(F) {
  const xs = [-70, 70], ys = [-150];
  for (const e of F.L) {
    const im = e.img && assets.get(e.img);
    if (!e.m || !im?.width) continue;
    for (const [x, y] of [[0, 0], [im.width, 0], [0, im.height], [im.width, im.height]]) { xs.push(e.m[0] * x + e.m[2] * y + e.m[4]); ys.push(e.m[1] * x + e.m[3] * y + e.m[5]); }
  }
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs)];
}

// rig px (the frame's own: feet at 0,0, x forward) <-> canvas px: the standee's placement (as drawRig) then the camera
function placement(F) {
  const f = P.f, fa = f.facing, p = F.p, c = Math.cos(p.rot * fa), s = Math.sin(p.rot * fa), ax = p.sx * fa * F.k, ay = p.sy * F.k;
  const W = [c * ax, s * ax, -s * ay, c * ay, f.x + p.dx * fa, f.y - f.z + p.dy];
  return [M[0] * W[0], M[0] * W[1], M[0] * W[2], M[0] * W[3], M[0] * W[4] + M[4], M[0] * W[5] + M[5]];
}
let toCanvas = (q) => q, toRig = (q) => q;

function draw() {
  const dpr = devicePixelRatio || 1, cw = Math.round(canvas.clientWidth * dpr), ch = Math.round(canvas.clientHeight * dpr);
  if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
  const f = P.f, b = (fit ??= fitOf(poseFrame(P))), s = Math.min(cw / (b[2] - b[0] + 24), (ch * 0.86) / (-b[1] + 12));
  M = [s, 0, 0, s, cw / 2 - (f.x + (b[0] + b[2]) / 2) * s, ch * 0.88 - f.y * s];
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#7b7b84'; ctx.fillRect(0, 0, cw, ch);
  ctx.fillStyle = '#6a6a72'; ctx.fillRect(0, M[5] + f.y * s, cw, ch);
  ctx.setTransform(...M);
  drawShadow(ctx, f);
  const mem = rigMemory(f);
  for (const k of Object.keys(mem)) delete mem[k];   // a held pose, no blending from the last draw
  drawRig(ctx, f, poseRig(P), assets, P.time, 0, '@pose');
  const F = lastFrame(f), T = placement(F), det = T[0] * T[3] - T[1] * T[2];
  toCanvas = (q) => [T[0] * q[0] + T[2] * q[1] + T[4], T[1] * q[0] + T[3] * q[1] + T[5]];
  toRig = (q) => { const x = q[0] - T[4], y = q[1] - T[5]; return [(T[3] * x - T[2] * y) / det, (-T[1] * x + T[0] * y) / det]; };
  L = F.L; H = handles(P, L);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const R = POSE_LIMITS.handle * dpr, COL = { limb: '#ffffff', node: '#ffd23f', shaft: '#ffd23f', hips: '#7fc8ff', head: '#9be59b' };
  for (const h of H) {
    const at = toCanvas(h.at), on = drag?.h.id === h.id;
    if (h.ring) {
      const r = toCanvas(h.ring);
      ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1 * dpr; ctx.setLineDash([3 * dpr, 3 * dpr]);
      ctx.beginPath(); ctx.moveTo(...at); ctx.lineTo(...r); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = on && drag.ring ? '#e0a83a' : COL[h.kind]; ctx.lineWidth = 3 * dpr;
      ctx.beginPath(); ctx.arc(...r, POSE_LIMITS.ring.r * dpr, 0, 2 * Math.PI); ctx.stroke();
    }
    ctx.globalAlpha = on ? 0.85 : 0.55; ctx.fillStyle = on ? '#e0a83a' : COL[h.kind];
    ctx.beginPath(); ctx.arc(...at, R, 0, 2 * Math.PI);
    if (h.kind === 'shaft') { ctx.globalAlpha = 1; ctx.lineWidth = 4 * dpr; ctx.strokeStyle = ctx.fillStyle; ctx.stroke(); } else ctx.fill();
    ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1.5 * dpr; ctx.stroke();
  }
  hud.textContent = `${FIGHTERS[P.id].name}${P.version !== 'current' ? ` (${P.version})` : ''} · from ${P.from}${P.item !== 'own' ? ` · ${P.item}` : ''} · drag a handle; ring = twist; gold = the weapon · ${BUILD}`;
}

// What a drag at rig px q does, from the pose at its start (d0)
function solve(d0, q) {
  const c = d0.c, h = d0.h, dv = [q[0] - d0.q[0], q[1] - d0.q[1]], turn = (about) => wrap(ang(about, q) - ang(about, d0.q));
  const A = nodeAnchor(d0.P, d0.L);
  if (h.kind === 'hips') return dragHips(c, dv);
  if (h.kind === 'head') return dragHead(c, turn(h.pivot));
  if (h.kind === 'node') return d0.ring ? turnNode(c, turn(h.pivot), A) : dragNode(d0.P, d0.L, dv);
  if (h.kind === 'shaft') {   // swings the item round its grip: on the node, or by the hand that holds it
    if (H.some((x) => x.kind === 'node')) return turnNode(c, turn(h.grip), A);
    return twist(c, c.held.part.parent, turn(h.grip));
  }
  if (d0.ring) return twist(c, h.id, turn(h.pivot));
  const W = pivotAt(c, byName(d0.L), h.id);   // the wrist / ankle as drawn at the start, moved with the finger
  return dragTo(d0.P, h.id, [W[0] + dv[0], W[1] + dv[1]]);
}

const pointer = (e) => { const r = canvas.getBoundingClientRect(), dpr = devicePixelRatio || 1; return [(e.clientX - r.left) * dpr, (e.clientY - r.top) * dpr]; };
function pick(pc) {
  const dpr = devicePixelRatio || 1, g = POSE_LIMITS.grab * dpr;
  let best = null;
  for (const h of H) for (const [pt, ring] of [[h.at, false], ...(h.ring ? [[h.ring, true]] : [])]) {
    const d = Math.hypot(...toCanvas(pt).map((v, i) => v - pc[i])) * (ring ? 0.8 : 1);   // a ring wins a tie: it is the smaller
    if (d < g && (!best || d < best.d)) best = { h, ring, d };
  }
  return best;
}
function begin(h, ring, q) {
  undo.push({ joints: P.joints, swap: P.swap });
  drag = { h, ring, q, P: { ...P }, L, c: solveOf(P) };
}
function move(q) {
  if (!drag) return;
  const r = solve(drag, q);
  P = { ...P, joints: r.joints };
  dirty = true;
  note(r.stretched ? 'full stretch: it reaches no further' : r.folded ? 'bent as far as the joint goes' : r.stopped ? 'the hips stop: a foot would leave its spot' : r.clamped ? 'at its limit' : '');
}
function end() { if (!drag) return; drag = null; dirty = true; writeUrl(); panel.readout(); }
canvas.addEventListener('pointerdown', (e) => {
  const b = pick(pointer(e));
  if (!b) return;
  canvas.setPointerCapture(e.pointerId);
  begin(b.h, b.ring, toRig(pointer(e)));
});
canvas.addEventListener('pointermove', (e) => { if (drag) { move(toRig(pointer(e))); } });
canvas.addEventListener('pointerup', end);
canvas.addEventListener('pointercancel', end);

const copyText = async (t) => { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } };
const panel = createPanel(document.getElementById('panel'), {
  P: () => P,
  readout: () => readout(P, L.length ? L : (draw(), L)),
  set(patch) { undo.push({ joints: P.joints, swap: P.swap }); P = { ...P, ...patch }; dirty = true; writeUrl(); draw(); panel.render(); note(''); },
  restart(from) { P = startPose({ ...U, from, item: P.item }); fit = null; undo.length = 0; dirty = true; writeUrl(); draw(); panel.render(); note(''); },
  async copy() { note((await copyText(poseLine(P))) ? 'Pose copied (the data line below)' : 'Select the line below to copy it'); },
  async share() {
    writeUrl();
    try { if (navigator.share) await navigator.share({ url: location.href, title: 'Pose' }); else note((await copyText(location.href)) ? 'Link copied' : location.href); } catch {}
  },
  undo() { const u = undo.pop(); if (u) { P = { ...P, ...u }; dirty = true; writeUrl(); draw(); panel.render(); note(''); } },
  reset() { undo.push({ joints: P.joints, swap: P.swap }); P = { ...P, ...P.start }; dirty = true; writeUrl(); draw(); panel.render(); note(''); },
});

function frame() { if (dirty) { draw(); dirty = false; } requestAnimationFrame(frame); }
new ResizeObserver(() => { dirty = true; }).observe(canvas);
draw(); panel.render(); note('');
requestAnimationFrame(frame);
// tests and screenshots: drag a handle by (dx, dy) rig px (or turn its ring by deg) in steps, as a finger would
window.poser = {
  get P() { return P; }, handles: () => H,
  drag(id, dx, dy, { ring = false, steps = 8 } = {}) {
    draw();
    const h = H.find((x) => x.id === id), q0 = ring ? h.ring : h.at;
    begin(h, ring, q0);
    for (let i = 1; i <= steps; i++) move([q0[0] + (dx * i) / steps, q0[1] + (dy * i) / steps]);
    end(); draw();
  },
  turn(id, deg, { steps = 8 } = {}) {   // a ring dragged round its pivot by deg
    draw();
    const h = H.find((x) => x.id === id), piv = h.kind === 'shaft' ? h.grip : h.pivot, q0 = h.kind === 'shaft' ? h.at : h.ring;
    const r = Math.hypot(q0[0] - piv[0], q0[1] - piv[1]), a0 = ang(piv, q0);
    begin(h, h.kind !== 'shaft', q0);
    for (let i = 1; i <= steps; i++) { const a = (a0 + (deg * i) / steps) * D; move([piv[0] + r * Math.cos(a), piv[1] + r * Math.sin(a)]); }
    end(); draw();
  },
};
