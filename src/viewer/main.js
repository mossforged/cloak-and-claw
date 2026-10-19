// Model viewer (T027) page glue: loads the game's art, keeps one or two slots (sandbox.js) playing the picked clip,
// draws them (scene.js), runs the transport (play, pause, frame step, scrub, loop, speed), pinch / wheel zoom, and keeps
// the view in the URL (state.js). Render only: the game itself is never loaded or changed.
import { loadAssets, collectArtPaths } from '../core/assets.js';
import { FIGHTERS } from '../data/fighters/index.js';
import { RIGS } from '../data/rigs/index.js';
import { ITEMS } from '../data/items/index.js';
import { STAGES } from '../data/stages/index.js';
import { createEffects } from '../render/effects.js';
import { createPropFx } from '../render/prop-fx.js';
import { phaseOf } from '../sim/fighter.js';
import { BUILD } from '../config.js';
import { createSlot } from './sandbox.js';
import { clipsFor } from './clips.js';
import { itemsFor, versionsOf, VERSION_RIGS } from './models.js';
import { parseState, formatState } from './state.js';
import { drawSlot, warm } from './scene.js';
import { createUI } from './ui.js';
// T034: the page-wide rig switches (data/rigs/rat-raider-joints.js: `joints=old`, `order=his|all`) stay in the address
const SWITCHES = [...new URLSearchParams(location.search)].filter(([k]) => k === 'joints' || k === 'order').map(([k, v]) => `&${k}=${v}`).join('');

const S = parseState(location.search);
if (!new URLSearchParams(location.search).has('size') && innerWidth < 600) S.size = 1;   // a phone: 1x game size fits (pinch for more)
const canvas = document.getElementById('view'), ctx = canvas.getContext('2d'), hud = document.getElementById('hud');
const $ = (id) => document.getElementById(id);
hud.textContent = 'Loading art...';
const assets = await loadAssets(collectArtPaths(FIGHTERS, RIGS, ITEMS, STAGES, VERSION_RIGS));   // T026: + compare versions' art (old rats)
const fxOf = () => { const a = createEffects(), b = createPropFx(assets); return { a, b, update() { a.update(); b.update(); }, clear() { a.clear(); b.clear(); } }; };
const slots = [createSlot({ fx: fxOf, warm }), createSlot({ fx: fxOf, warm })];
let playing = !S.paused, acc = 0, last = performance.now(), dirty = true, flags = [];

const lookOf = () => ({ detail: S.detail, tint: S.tint, fur: S.fur, size: S.lsize });
function cfgs() {
  const fix = (f, item) => (itemsFor(f).includes(item) ? item : 'own');
  S.item = fix(S.f, S.item);
  if (!versionsOf(S.f).includes(S.v)) S.v = 'current';
  const clips = clipsFor(S.f, S.item);
  if (!clips.some((c) => c.key === S.anim)) S.anim = clips[0].key;
  const A = { f: S.f, v: S.v, item: S.item, grip: S.grip, anim: S.anim, flip: S.flip, target: S.target, look: lookOf(), gear: S.gear };
  if (!S.f2) return [A];
  const item2 = fix(S.f2, S.item2), anim2 = clipsFor(S.f2, item2).some((c) => c.key === S.anim) ? S.anim : 'idle';
  const v2 = versionsOf(S.f2).includes(S.v2) ? S.v2 : 'current', same = S.f2 === S.f;
  return [A, { ...A, f: S.f2, v: v2, item: item2, anim: anim2, look: same ? lookOf() : {}, gear: same ? S.gear : null }];
}
let active = [];
function reload() {
  active = cfgs().map((c, i) => { slots[i].load(c); return slots[i]; });
  const len = active[0].len;
  $('scrub').max = String(len);
  seek(S.paused ? Math.min(S.t, len) : 0);
}
function seek(n) { for (const s of active) s.seek(Math.min(n, s.len)); dirty = true; }
function frameNow() { return active[0].sb.n; }

function advance() {
  let moved = false;
  for (const s of active) moved = s.step() || moved;
  if (!moved) {
    if (S.loop) seek(0);
    else setPlaying(false);
  }
  dirty = true;
}
function setPlaying(p) {
  playing = p; S.paused = !p; S.t = frameNow();
  $('play').innerHTML = p ? '&#x23F8;' : '&#x25B6;';
  writeUrl();
}
function writeUrl() { const q = formatState(S) + SWITCHES; history.replaceState(null, '', `${location.pathname}${q ? '?' + q.replace(/^&/, '') : ''}`); }

const RELOAD_KEYS = ['f', 'v', 'item', 'grip', 'anim', 'flip', 'target', 'detail', 'tint', 'fur', 'lsize', 'gear', 'f2', 'v2', 'item2'];
const ui = createUI({
  set(patch, reloadIt = true) {
    Object.assign(S, patch);
    if (reloadIt && RELOAD_KEYS.some((k) => k in patch)) { reload(); if ('anim' in patch && !playing) setPlaying(true); }
    ui.render(S); writeUrl(); dirty = true;
  },
  screenshot() {
    canvas.toBlob((b) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b); a.download = `viewer-${S.f}-${S.anim.replace(':', '-')}-f${frameNow()}.png`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    });
  },
  pose() {   // T031: the drag-to-pose page on this frame
    location.href = `${location.pathname}?pose=${S.f}&from=${S.anim}:${frameNow()}${S.item !== 'own' ? `&item=${S.item}` : ''}${SWITCHES}`;
  },
  async share() {
    S.t = frameNow(); writeUrl();
    try { if (navigator.share) await navigator.share({ url: location.href, title: 'Model viewer' }); else await navigator.clipboard.writeText(location.href); hud.dataset.note = 'Link copied'; setTimeout(() => { delete hud.dataset.note; dirty = true; }, 2000); dirty = true; } catch {}
  },
});

// transport
$('play').onclick = () => setPlaying(!playing);
const stepBy = (d) => { setPlaying(false); seek(Math.max(0, Math.min(active[0].len, frameNow() + d))); S.t = frameNow(); writeUrl(); };
$('back').onclick = () => stepBy(-1);
$('fwd').onclick = () => stepBy(1);
$('scrub').oninput = (e) => { if (playing) setPlaying(false); seek(+e.target.value); S.t = frameNow(); };
$('scrub').onchange = () => writeUrl();
const loopBtn = () => { $('loop').className = S.loop ? 'on' : ''; };
$('loop').onclick = () => { S.loop = !S.loop; loopBtn(); writeUrl(); };
const speedBtn = () => { $('speed').textContent = `${S.speed}x`; };
$('speed').onclick = () => { S.speed = S.speed === 1 ? 0.25 : S.speed === 0.25 ? 0.5 : 1; speedBtn(); writeUrl(); };
addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === ' ') { e.preventDefault(); setPlaying(!playing); }
  if (e.key === 'ArrowLeft') stepBy(-1);
  if (e.key === 'ArrowRight') stepBy(1);
});

// pinch (two fingers) and wheel zoom on the character; a tap plays / pauses
const pts = new Map();
let pinch = null, tap = null;
canvas.addEventListener('pointerdown', (e) => { pts.set(e.pointerId, [e.clientX, e.clientY]); tap = pts.size === 1 ? [e.clientX, e.clientY] : null; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => {
  if (!pts.has(e.pointerId)) return;
  pts.set(e.pointerId, [e.clientX, e.clientY]);
  if (pts.size !== 2) return;
  const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
  pinch ??= { d, z: S.zoom };
  S.zoom = Math.min(4, Math.max(0.25, pinch.z * d / pinch.d)); dirty = true;
});
const up = (e) => {
  if (tap && pts.size === 1 && Math.hypot(e.clientX - tap[0], e.clientY - tap[1]) < 8) setPlaying(!playing);
  pts.delete(e.pointerId);
  if (pts.size < 2 && pinch) { pinch = null; writeUrl(); ui.render(S); }
  tap = null;
};
canvas.addEventListener('pointerup', up);
canvas.addEventListener('pointercancel', up);
canvas.addEventListener('wheel', (e) => { e.preventDefault(); S.zoom = Math.min(4, Math.max(0.25, S.zoom * Math.exp(-e.deltaY * 0.0015))); dirty = true; }, { passive: false });

function draw() {
  const dpr = devicePixelRatio || 1, W = Math.round(canvas.clientWidth * dpr), H = Math.round(canvas.clientHeight * dpr);
  if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const n = active.length, scale = S.size * S.zoom * dpr;
  flags = [];
  active.forEach((s, i) => {
    const r = { x: (W / n) * i, y: 0, w: W / n, h: H };
    const label = n > 1 ? `${FIGHTERS[s.cfg.f].name}${s.cfg.v !== 'current' ? ' ' + s.cfg.v : ''}` : '';
    const f = drawSlot(ctx, s.sb, r, { scale, bg: S.bg, ov: S.ov, assets, fx: s.fx, juice: s.juice, label });
    if (i === 0) flags = f;
  });
  if (n > 1) { ctx.fillStyle = '#16141c'; ctx.fillRect(W / 2 - dpr, 0, 2 * dpr, H); }
  const h = active[0].sb.hero, [ph] = phaseOf(h), nNow = frameNow();
  $('scrub').value = String(nNow);
  $('frame').textContent = `${nNow}/${active[0].len}`;
  const info = `${FIGHTERS[S.f].name} · ${S.anim} · ${h.state}${h.move ? ` ${h.moveKey} ${ph}` : ''}${active[0].juice.freeze > 0 ? ' · hit-stop' : ''} · ${BUILD}`;
  hud.replaceChildren(document.createTextNode(hud.dataset.note ? `${hud.dataset.note} · ${info}` : info));
  if (S.ov.includes('seams')) hud.append(Object.assign(document.createElement('div'), { className: 'flags', textContent: flags.length ? flags.join(' · ') : 'no stretch flags on this frame' }));
}

function frame(now) {
  const dt = Math.min(0.25, (now - last) / 1000); last = now;
  if (playing) { acc += dt * S.speed; while (acc >= 1 / 60) { acc -= 1 / 60; advance(); } }
  if (dirty) { draw(); dirty = false; }
  requestAnimationFrame(frame);
}
new ResizeObserver(() => { dirty = true; }).observe(canvas);
loopBtn(); speedBtn();
reload();
setPlaying(playing);
ui.render(S);
requestAnimationFrame(frame);
window.viewer = { S, slots, seek, get active() { return active; } };
