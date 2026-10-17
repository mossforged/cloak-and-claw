// Floor-line helpers (T024, rig standard 8): where a rig's drawings reach down to, from the generated hulls (rigs/hulls.js).
// Each foot has its own floor line: the height its drawing touches down in the master (3/4 view: the far boot stands a
// little higher on screen than the near one). Pure maths on rig data (standard rigs: rest 0, one scale); render/floor.js
// uses the same lines on the drawn layout.
import HULLS from './hulls.js';

const D = Math.PI / 180;
const turn = (deg, [x, y]) => { const c = Math.cos(deg * D), s = Math.sin(deg * D); return [x * c - y * s, x * s + y * c]; };

// Screen points of every part's pivot and its world turn for joints j (feet at 0,0, before the pose's sx mirror).
export function fk(rig, j = {}) {
  const at = {}, R = {};
  const of = (n) => {
    if (at[n]) return at[n];
    const p = rig.parts[n];
    if (!p.parent) { R[n] = j[n] ?? 0; return (at[n] = [j.dx ?? 0, (j.dy ?? 0) - rig.rootY]); }
    const o = of(p.parent), q = rig.parts[p.parent];
    const b = [(p.attach[0] - q.pivot[0]) * (j[`${p.parent}.sx`] ?? 1), (p.attach[1] - q.pivot[1]) * (j[`${p.parent}.sy`] ?? 1)];
    const v = turn(R[p.parent], b);
    R[n] = R[p.parent] + (j[n] ?? 0);
    return (at[n] = [o[0] + rig.scale * v[0], o[1] + rig.scale * v[1]]);
  };
  for (const n of Object.keys(rig.parts)) of(n);
  return { at, R };
}

// A drawing's hull points in screen px for part n posed by fk (swap = that part's swap name or none).
export function hullAt(rig, F, n, swap) {
  const p = rig.parts[n], s = p.swaps?.[swap], H = HULLS[s ? s.img : p.img];
  if (!H) return [];
  const off = s?.offset ?? [0, 0], k = s?.scale ?? 1;
  return H.map(([x, y]) => {
    const v = turn(F.R[n], [off[0] + k * x - p.pivot[0], off[1] + k * y - p.pivot[1]]);
    return [F.at[n][0] + rig.scale * v[0], F.at[n][1] + rig.scale * v[1]];
  });
}
export const lowest = (pts) => pts.reduce((m, p) => Math.max(m, p[1]), -Infinity);

// The floor line of each foot: its drawing's lowest point in the master (screen px, - = above the feet line).
const lines = new WeakMap();
export function floorLine(rig, foot) {
  if (!lines.has(rig)) lines.set(rig, {});
  const L = lines.get(rig);
  return (L[foot] ??= lowest(hullAt(rig, fk(rig), foot)));
}

// How far a foot's drawing is lifted off its floor line in pose j (px, never below 0).
export function liftOf(rig, j, foot, swap) {
  const pts = hullAt(rig, fk(rig, j), foot, swap);
  return pts.length ? Math.max(0, floorLine(rig, foot) - lowest(pts)) : 0;
}

// A whole-leg drawing (kneeling, folded: a swap on the upper leg that hides the lower leg and foot) can't bend: it turns
// at the hip until its lowest point is on `target` (screen y). view = how the drawing is placed: height = dy + a x + b y.
// Returns the upper leg's joint angle nearest the posed one that does it (the posed angle if none within 90 degrees).
export function turnToFloor(rig, j, up, swap, target, view = { a: 0, b: 1, dy: 0 }) {
  const f = (d) => lowest(hullAt(rig, fk(rig, { ...j, [up]: d }), up, swap).map(([x, y]) => [0, view.dy + view.a * x + view.b * y])) - target;
  const d0 = j[up] ?? 0, f0 = f(d0);
  if (!Number.isFinite(f0) || Math.abs(f0) < 0.02) return d0;
  let best = null;
  for (const dir of [1, -1]) {
    let a = d0, fa = f0;
    for (let s = 2; s <= 90; s += 2) {
      const b = d0 + dir * s, fb = f(b);
      if (Math.sign(fb) !== Math.sign(fa)) {
        let lo = a, hi = b, flo = fa;
        for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2, fm = f(m); if (Math.sign(fm) === Math.sign(flo)) { lo = m; flo = fm; } else hi = m; }
        if (best === null || Math.abs((lo + hi) / 2 - d0) < Math.abs(best - d0)) best = (lo + hi) / 2;
        break;
      }
      a = b; fa = fb;
    }
  }
  return best ?? d0;
}
// The swap on a leg's upper part that replaces the whole leg (hides its foot), if the pose has one on.
export const wholeLeg = (rig, swap, side) => {
  const up = `leg-${side}-upper`, s = swap?.[up], sw = s && rig.parts[up]?.swaps?.[s];
  return sw?.hide?.includes(`foot-${side}`) ? s : null;
};
