// Visual effects driven by sim events: slash swooshes, hit sparks, block clangs and glints, damage numbers, dust;
// grab clinch flash, whoosh trail on a thrown body, big impact burst when it bowls someone over. Render-only.
import { bus } from '../core/events.js';
import { JUICE } from '../data/juice.js';

const D2R = Math.PI / 180;

export function createEffects() {
  let list = [];
  const flashes = new Map();   // fighter id -> frames of white flash left
  const add = (e) => list.push({ t: 0, ...e });

  bus.on('swing', ({ f, move }) => { if (move.fx?.slash) add({ type: 'slash', f, ...move.fx.slash, life: JUICE.slash.life }); });
  bus.on('hit', ({ target, damage, x, y, z, ko, move }) => {
    flashes.set(target.id, JUICE.flashFrames);
    const S = JUICE.sparks, big = ko || move.knockdown;
    for (let i = 0; i < S.count * (big ? 1.6 : 1); i++) {
      const a = Math.random() * Math.PI * 2, s = S.speed * (0.5 + Math.random());
      add({ type: 'spark', x, y: y - z, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: S.life });
    }
    add({ type: 'ring', x, y: y - z, life: 10, r: big ? 46 : 28 });
    add({ type: 'num', x, y: y - z - 20, text: String(damage), hero: target.team === 'hero', big, life: JUICE.numbers.life });
  });
  bus.on('block', ({ target, damage, x, y, z }) => {
    const B = JUICE.block, out = target.facing, sy = y - z;   // sparks fly out of the shield face, toward the attacker
    for (let i = 0; i < B.sparks; i++) {
      const a = (out > 0 ? 0 : Math.PI) + (Math.random() - 0.5) * 2 * B.spread, s = B.speed * (0.5 + Math.random());
      add({ type: 'spark', x, y: sy, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: B.life, clang: true });
    }
    add({ type: 'shieldFlash', x, y: sy, dir: out, r: B.flashR, life: B.flashLife });
    const G = B.glint;   // star glint on the shield rim, just after the clang (t < 0 = not shown yet)
    add({ type: 'glint', x: target.x + out * G.dx, y: target.y - target.z - G.dy, size: G.size, life: G.life, t: -G.delay });
    add({ type: 'ring', x, y: sy, life: B.ringLife, r: B.ringR });
    add({ type: 'ring', x, y: sy, life: B.ringLife + 6, r: B.ringR * 1.7, thin: true });
    if (damage > 0) add({ type: 'num', x, y: sy - 20, text: String(damage), hero: target.team === 'hero', big: false, life: JUICE.numbers.life });
  });
  bus.on('grab', ({ target, x, y, z }) => {
    const G = JUICE.grab;
    flashes.set(target.id, JUICE.flashFrames);
    add({ type: 'clinch', x, y: y - z, r: G.flashR, life: G.life });
    add({ type: 'ring', x, y: y - z, life: G.life, r: G.ringR, thin: true });
  });
  bus.on('throw', ({ target }) => add({ type: 'trail', f: target, pts: [], life: 1e9 }));
  bus.on('thrownHit', ({ body, target, damage, x, y, z, ko }) => {
    const I = JUICE.impact, sy = y - z;
    flashes.set(target.id, JUICE.flashFrames * 2); flashes.set(body.id, JUICE.flashFrames);
    for (let i = 0; i < I.sparks; i++) {
      const a = Math.random() * Math.PI * 2, s = I.speed * (0.5 + Math.random());
      add({ type: 'spark', x, y: sy, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: I.life });
    }
    add({ type: 'clinch', x, y: sy, r: I.flashR, life: 10 });
    add({ type: 'ring', x, y: sy, life: 14, r: I.ringR });
    add({ type: 'ring', x, y: sy, life: 20, r: I.ringR * 1.6, thin: true });
    add({ type: 'num', x, y: sy - 24, text: String(damage), hero: false, big: true, life: JUICE.numbers.life });
  });
  bus.on('land', ({ f, heavy }) => {
    const n = JUICE.dust.count * (heavy ? 1.5 : 0.6);
    for (let i = 0; i < n; i++) add({ type: 'dust', x: f.x + (Math.random() - 0.5) * 50, y: f.y, vx: (Math.random() - 0.5) * 2.2, life: JUICE.dust.life, r: 6 + Math.random() * 8 });
  });

  return {
    clear() { list = []; flashes.clear(); },
    flashOf: (id) => (flashes.get(id) ?? 0) / JUICE.flashFrames,
    update() {
      for (const [id, n] of flashes) n <= 1 ? flashes.delete(id) : flashes.set(id, n - 1);
      for (const e of list) {
        e.t++;
        if (e.type === 'trail') trailStep(e);
        if (e.vx !== undefined) { e.x += e.vx; e.vx *= 0.88; }
        if (e.vy !== undefined) { e.y += e.vy; e.vy *= 0.88; }
      }
      list = list.filter((e) => e.t < e.life);
    },
    // drawBack: the far half of wrap-around swooshes, before the fighters; draw: everything else, after them.
    drawBack(ctx) { for (const e of list) if (e.wrap) DRAW.slash(ctx, e, e.t / e.life, 'back'); },
    draw(ctx) { for (const e of list) DRAW[e.type](ctx, e, e.t / e.life, 'front'); },
  };
}

// A thrown body's trail: its last few centre points while it flies; fades out once it lands.
function trailStep(e) {
  const f = e.f, T = JUICE.trail;
  if (f.state === 'thrown') {
    e.pts.push({ x: f.x, y: f.y - f.z - f.def.body.h * 0.5 });
    if (e.pts.length > T.points) e.pts.shift();
  } else if (e.life > e.t + 12) e.life = e.t + 12;
  if (f.state !== 'thrown' && e.pts.length) e.pts.shift();
}

const DRAW = {
  trail(ctx, e) {   // tapering streak behind the body (stops short of him so he stays visible), plus a few speed lines
    const T = JUICE.trail, n = e.pts.length - T.gap;
    if (n < 2) return;
    ctx.save(); ctx.lineCap = 'round';
    for (const [style, extra] of [[T.edge, 6], [T.color, 0]]) {   // gold edge, then the white core (like a slash swoosh)
      for (let i = 1; i < n; i++) {
        const k = i / n, a = e.pts[i - 1], b = e.pts[i];
        ctx.strokeStyle = `${style}${T.alpha * k})`; ctx.lineWidth = T.width * k + extra;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    const h = e.f.def.body.h * 0.35, head = e.pts[e.pts.length - 1], tail = e.pts[0];
    ctx.strokeStyle = `${T.color}0.8)`; ctx.lineWidth = 2.5;
    for (let j = 0; j < T.lines; j++) {
      const oy = (j - (T.lines - 1) / 2) * h * 0.7;
      ctx.beginPath(); ctx.moveTo(head.x + (tail.x - head.x) * 0.3, head.y + oy); ctx.lineTo(tail.x, tail.y + oy); ctx.stroke();
    }
    ctx.restore();
  },
  clinch(ctx, e, k) {   // quick white burst at the grip
    const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * (0.6 + k * 0.6));
    g.addColorStop(0, `rgba(255,255,255,${0.9 * (1 - k)})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r * (0.6 + k * 0.6), 0, Math.PI * 2); ctx.fill(); ctx.restore();
  },
  slash(ctx, e, k, layer) {   // wrap: the arc goes round the body; its far side (top of the ellipse) is drawn behind him
    const f = e.f, dir = f.facing;
    const cx = f.x + dir * e.cx, cy = f.y - f.z - e.cz;
    const ang = (deg) => (dir > 0 ? deg * D2R : Math.PI - deg * D2R);
    const head = Math.min(1, k * 2.5), tail = Math.max(0, k * 1.6 - 0.4);
    const steps = e.wrap ? 28 : 14, W = JUICE.slash.width * (e.big ? 1.4 : 1);
    ctx.save();   // flat < 1 squashes the arc into an ellipse: a sweep on the floor plane, across the body
    ctx.translate(cx, cy); if (!e.wrap) ctx.scale(1, e.flat ?? 1);   // wrap draws a true ellipse so the stroke keeps its width
    ctx.lineCap = 'round';
    for (let i = 0; i < steps; i++) {
      const a0 = tail + (head - tail) * (i / steps), a1 = tail + (head - tail) * ((i + 1) / steps);
      const t0 = e.from + (e.to - e.from) * a0, t1 = e.from + (e.to - e.from) * a1;
      const w = W * (i / steps) * (1 - k * 0.5);
      if (e.wrap && (Math.sin((t0 + t1) / 2 * D2R) < 0) !== (layer === 'back')) continue;
      ctx.beginPath();
      if (e.wrap) ctx.ellipse(0, 0, e.r, e.r * e.flat, 0, ang(t0), ang(t1), dir < 0 ? t1 > t0 : t1 < t0);
      else ctx.arc(0, 0, e.r, ang(t0), ang(t1), dir < 0 ? t1 > t0 : t1 < t0);
      ctx.strokeStyle = JUICE.slash.edge; ctx.lineWidth = w + 4; ctx.stroke();
      ctx.strokeStyle = JUICE.slash.color; ctx.lineWidth = w; ctx.stroke();
    }
    ctx.restore();
  },
  spark(ctx, e, k) {
    ctx.strokeStyle = e.clang ? `rgba(255,255,${235 - k * 170},${1 - k})` : `rgba(255,${230 - k * 120},120,${1 - k})`; ctx.lineWidth = (e.clang ? 4 : 3) * (1 - k) + 1;
    ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x - e.vx * 2.5, e.y - e.vy * 2.5); ctx.stroke();
  },
  ring(ctx, e, k) {
    ctx.strokeStyle = `rgba(255,255,255,${1 - k})`; ctx.lineWidth = (e.thin ? 2 : 4) * (1 - k) + 1;
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r * (0.3 + k), 0, Math.PI * 2); ctx.stroke();
  },
  shieldFlash(ctx, e, k) {   // white half-moon on the shield face, toward the attacker
    const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r);
    g.addColorStop(0, `rgba(255,255,255,${0.95 * (1 - k)})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g; ctx.beginPath();
    ctx.ellipse(e.x, e.y, e.r * 0.7, e.r * 1.3, 0, e.dir > 0 ? -Math.PI / 2 : Math.PI / 2, e.dir > 0 ? Math.PI / 2 : Math.PI * 1.5);
    ctx.fill(); ctx.restore();
  },
  glint(ctx, e, k) {   // four-point star that pops open and shrinks away, turning a little
    if (k < 0) return;
    const s = e.size * Math.sin(Math.PI * k), w = s * 0.16;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.translate(e.x, e.y); ctx.rotate(k * 0.6);
    ctx.fillStyle = 'rgba(255,250,215,0.95)';
    for (const [a, l] of [[0, 1], [Math.PI / 2, 1], [Math.PI / 4, 0.45], [-Math.PI / 4, 0.45]]) {
      ctx.save(); ctx.rotate(a); ctx.beginPath();
      ctx.moveTo(-s * l, 0); ctx.lineTo(0, -w); ctx.lineTo(s * l, 0); ctx.lineTo(0, w); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.beginPath(); ctx.arc(0, 0, w * 1.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
  num(ctx, e, k) {
    const N = JUICE.numbers, pop = k < 0.15 ? 1 + (0.15 - k) * 4 : 1;
    ctx.save();
    ctx.translate(e.x, e.y - e.t * N.rise);
    ctx.scale(pop * (e.big ? 1.35 : 1), pop * (e.big ? 1.35 : 1));
    ctx.globalAlpha = k > 0.7 ? (1 - k) / 0.3 : 1;
    ctx.font = N.font; ctx.textAlign = 'center';
    ctx.lineWidth = 5; ctx.strokeStyle = '#2a1630'; ctx.strokeText(e.text, 0, 0);
    ctx.fillStyle = e.hero ? '#ff5a4e' : e.big ? '#ffd23f' : '#fff'; ctx.fillText(e.text, 0, 0);
    ctx.restore();
  },
  dust(ctx, e, k) {
    ctx.fillStyle = `rgba(214,190,150,${0.55 * (1 - k)})`;
    ctx.beginPath(); ctx.arc(e.x, e.y - k * 14, e.r * (0.6 + k), 0, Math.PI * 2); ctx.fill();
  },
};
export const drawSlash = DRAW.slash;   // for tools/rig-preview.html
