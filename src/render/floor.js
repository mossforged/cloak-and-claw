// Floor-line rule (T024, rig standard 8). Grounded: each leg is re-solved by 2-bone IK so its foot's drawing touches
// that foot's floor line (rigs/biped-floor.js), raised only by the pose's '<foot>.lift'; the foot keeps its own tilt and
// the ankle its x (the IK target only moves the ankle up or down). It works on the figure as it is finally drawn (the
// standee's squash and offsets: `view`); the standee's lean turns the hips instead of tipping the figure round its feet
// (which lifted the trailing boot and sank the leading one).
// Lying: the body's lowest drawn point rests on the floor (never below it). Render only; pure, so tests run it.
import HULLS from '../data/rigs/hulls.js';
import { floorLine, turnToFloor, wholeLeg } from '../data/rigs/biped-floor.js';
import { limb } from '../data/rigs/biped-ik.js';
import { layoutRig } from './rig-layout.js';
import { limitLayer, limbGeometry, clampTurn } from './limits.js';
import { LIMIT_SOLVE as K } from '../data/limit-solve.js';

const D = Math.PI / 180;
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const bone = (rig, n) => sub(rig.parts[n].attach, rig.parts[rig.parts[n].parent].pivot);
const hull = (e) => (HULLS[e.img] ?? []).map((p) => apply(e.m, p));

// States whose feet are on the ground (and not lying): the rule applies when the fighter is also at z 0.
const OFF = new Set(['jump', 'knockdown', 'down', 'dead', 'downed', 'getup', 'grabbed', 'thrown']);
export const grounded = (f) => !(f.z > 0.01) && !OFF.has(f.state);
export const lying = (f) => ['knockdown', 'down', 'dead', 'downed', 'getup'].includes(f.state);

// view: { rot (radians, + = forward lean), sx, sy, dy } = how the standee places the drawing (render/rig.js).
// Height on screen of a figure point (x, y), relative to the fighter's feet: dy + a x + b y.
const heightOf = (view, bodySx = 1) => [Math.sin(view.rot) * view.sx * bodySx, Math.cos(view.rot) * view.sy];
const LEGS = ['near', 'far'].map((s) => [`leg-${s}-upper`, `leg-${s}-lower`, `foot-${s}`]);

// lean (radians, + = forward): the standee's lean, turned at the hips instead of round the feet (the upper body leans,
// the boots stay where they stand). A leg that can't reach its floor line lowers the hips instead of floating.
export function floorLayer(rig, joints, swap = {}, view = { rot: 0, sx: 1, sy: 1, dy: 0 }, lean = 0) {
  const bodySx = joints.sx ?? 1;
  if (Math.abs(bodySx) < 0.2) return joints;   // edge-on mid-turn: leave it
  const [a, b] = heightOf(view, bodySx), L0 = byName(rig, joints, swap), goals = [];
  for (const [up, lo, ft] of LEGS) {
    if (!L0[up] || !L0[lo] || !L0[ft]) continue;   // a whole-leg drawing (kneeling, folded) is posed as drawn
    const G = footGoal(rig, joints, L0, ft, view);
    if (!G) continue;
    const R1 = (joints.pelvis ?? 0) + (joints[up] ?? 0), Rf = R1 + (joints[lo] ?? 0) + (joints[ft] ?? 0);
    goals.push({ up, lo, ft, T: G.T, Rf, R1, moved: Math.abs(lean) > 1e-9 || Math.abs(G.T[1] - G.ankle[1]) > 1e-4 });
  }
  const whole = ['near', 'far'].map((s) => [s, wholeLeg(rig, swap, s)]).filter(([, w]) => w);
  if (!goals.some((g) => g.moved) && !whole.length) return joints;
  const out = { ...joints, pelvis: (joints.pelvis ?? 0) + lean / D };
  for (let pass = 0; pass < 2; pass++) {
    const L = byName(rig, out, swap);
    let drop = 0;
    for (const g of goals) {   // hips too high for this leg to reach: how far down they must come
      const hip = apply(L[g.up].base, rig.parts[g.up].pivot), max = rig.scale * (len(bone(rig, g.lo)) + len(bone(rig, g.ft))) - 0.05, dx = g.T[0] - hip[0];
      if (Math.abs(dx) < max) drop = Math.max(drop, g.T[1] - hip[1] - Math.sqrt(max * max - dx * dx));
    }
    if (drop > 1e-3 && pass === 0) { out.dy = (out.dy ?? 0) + drop; continue; }
    for (const g of goals) {
      const hip = apply(L[g.up].base, rig.parts[g.up].pivot), knee = apply(L[g.lo].base, rig.parts[g.lo].pivot), ankle = apply(L[g.ft].base, rig.parts[g.ft].pivot);
      const now = Math.sign(cross(sub(knee, hip), sub(ankle, knee))), master = Math.sign(cross(bone(rig, g.lo), bone(rig, g.ft)));
      const Rp = out.pelvis ?? 0, [r1, r2] = limb(rig, g.up, g.lo, g.ft, hip, g.T, g.Rf, rig.parts[g.ft].pivot, now && master && now !== master ? -1 : 1, g.R1);
      out[g.up] = r1 - Rp; out[g.lo] = r2 - r1; out[g.ft] = g.Rf - r2;
    }
    break;
  }
  for (const [side, w] of whole) {   // a whole-leg drawing turns at the hip onto its line (after any hip drop)
    const ft = `foot-${side}`, up = `leg-${side}-upper`;
    out[up] = turnToFloor(rig, out, up, w, floorLine(rig, ft) - Math.max(0, joints[`${ft}.lift`] ?? 0), { a, b, dy: view.dy });
  }
  return out;
}
// Where foot ft's ankle goes (unmirrored layout L of joints) for its drawing, at its own tilt, to touch its floor line
// (raised by its '.lift'): { ankle (now), T (the goal: same x) }; null = no outline. T035 r2: the limit-aware fix below
// uses it too.
export function footGoal(rig, joints, L, ft, view) {
  const [a, b] = heightOf(view, joints.sx ?? 1), ankle = apply(L[ft].base, rig.parts[ft].pivot), pts = hull(L[ft]);
  if (!pts.length) return null;
  const reach = Math.max(...pts.map(([x, y]) => a * (x - ankle[0]) + b * (y - ankle[1])));
  const target = floorLine(rig, ft) - Math.max(0, joints[`${ft}.lift`] ?? 0);
  return { ankle, T: [ankle[0], (target - view.dy - a * ankle[0] - reach) / b] };
}

// T035 r2: a rig with joint limits (rat v3): after the rule above, each jointed leg is solved again inside its limits so
// its sole, not its ankle, lands on its floor line: every knee turn in its range (K.step degrees, then K.fine), the hip
// aimed at the ankle point that puts the sole on the line at the tilt the ankle range leaves the foot (re-measured), the
// foot as near the tilt the rule gave it as its range lets. Off the line costs 1 per px, away from the rule's ankle x
// K.slideCost per px (a trailing leg past its hip limit slides along the line, up to K.slide px, rather than sink), off the
// wanted tilt K.tiltCost per degree. No limits: as given.
// pick(ft, L): which feet (L: the layout inside the limits), and onto what lift (null = leave the leg as it is; default: every foot at its own lift).
export function floorInLimits(rig, joints, swap = {}, view = { rot: 0, sx: 1, sy: 1, dy: 0 }, pick = (ft) => joints[`${ft}.lift`]) {
  if (!rig.limits || Math.abs(joints.sx ?? 1) < 0.2) return joints;
  let out = limitLayer(rig, joints);
  const L0 = byName(rig, joints, swap);
  for (const leg of LEGS) {
    const L = byName(rig, out, swap), [up, lo, ft] = leg;
    if (!L[up] || !L[lo] || !L[ft] || !L0[ft] || !hull(L[ft]).length) continue;
    const lift = pick(ft, L), key = `${ft}.lift`;
    if (lift === null) continue;
    const j = legOnLine(rig, L, { ...out, [key]: lift }, leg, view, turnOf(L0[ft].base), apply(L0[ft].base, rig.parts[ft].pivot)[0]);
    out = { ...j, [key]: out[key] };
    if (out[key] === undefined) delete out[key];
  }
  return out;
}

// T038: a key posed off the floor (`aloft`: render/rig.js skips the rule above) while the fighter is on the ground: the
// hop's take-off and landing frames (the key shows at once, its height blends in) and the kick (aloft so the kicking leg
// stays up) left a planted foot 10-23 px off its line on rat v3. With limits only: a planted foot (lift under
// K.planted px) goes onto its line as above; a raised one that would sink below the floor stops on it; the rest as posed.
export function aloftInLimits(rig, joints, swap = {}, view = { rot: 0, sx: 1, sy: 1, dy: 0 }) {
  if (!rig.limits) return joints;
  return floorInLimits(rig, joints, swap, view, (ft, L) => {
    const lift = Math.max(0, joints[`${ft}.lift`] ?? 0);
    if (lift < K.planted) return lift;
    const G = footGoal(rig, { ...joints, [`${ft}.lift`]: 0 }, L, ft, view);
    return G && G.T[1] < G.ankle[1] - 1e-6 ? 0 : null;   // the sole below the floor: up onto it
  });
}

// One leg of layout L (joints j) onto its floor line inside the limits, the foot near tilt `want`, its ankle near x X.
function legOnLine(rig, L, j, leg, view, want, X) {
  const [up, lo, ft] = leg, lim = rig.limits, g = limbGeometry(rig, L, j, leg), [a, b] = heightOf(view, j.sx ?? 1);
  const offs = hull(L[ft]).map(([x, y]) => [x - g.W[0], y - g.W[1]]), line = floorLine(rig, ft) - Math.max(0, j[`${ft}.lift`] ?? 0);
  const lineY = (phi, x) => {   // the ankle height that puts the foot's lowest point on the line at tilt phi
    const c = Math.cos((phi - g.endTurn) * D), s = Math.sin((phi - g.endTurn) * D);
    const reach = Math.max(...offs.map(([ox, oy]) => a * (ox * c - oy * s) + b * (ox * s + oy * c)));
    return (line - view.dy - a * x - reach) / b;
  };
  const e0 = (j[ft] ?? 0) + wrap(want - g.endTurn);   // the foot joint for the wanted tilt at the current hip and knee
  const at = (kn, x) => {
    const del = g.c2 - g.c1 + kn, ux = g.l1 + g.l2 * Math.cos(del * D), uy = g.l2 * Math.sin(del * D);
    let phi = want, r;
    for (let i = 0; i < 3; i++) {
      const T = [x, lineY(phi, x)], hip = clampTurn(Math.atan2(T[1] - g.S[1], T[0] - g.S[0]) / D - Math.atan2(uy, ux) / D - g.c1, lim[up] ?? [-180, 180]);
      const t = (g.c1 + hip) * D, W = [g.S[0] + Math.cos(t) * ux - Math.sin(t) * uy, g.S[1] + Math.sin(t) * ux + Math.cos(t) * uy];
      const free = e0 - wrap(hip - g.ju) - wrap(kn - g.jl), foot = lim[ft] ? clampTurn(free, lim[ft]) : free;
      phi = want + wrap(foot - free);
      r = { hip, kn, foot, W, phi, x };
    }
    const off = Math.abs(r.W[1] - lineY(r.phi, r.W[0]));
    return { ...r, off, cost: off + K.slideCost * Math.abs(r.W[0] - X) + K.tiltCost * Math.abs(r.phi - want) };
  };
  const [k0, k1] = lim[lo] ?? [-180, 180];
  let best = null;
  const tryAt = (kn, x) => { const r = at(kn, x); if (!best || r.cost < best.cost) best = r; };
  const sweep = (x) => { for (let kn = k0; kn <= k1; kn += K.step) tryAt(kn, x); tryAt(clampTurn(j[lo] ?? 0, [k0, k1]), x); };
  sweep(X);
  for (let n = 1; best.off > K.onLine && n <= K.slide / K.slideStep; n++) for (const x of [X + n * K.slideStep, X - n * K.slideStep]) sweep(x);
  for (let kn = Math.max(k0, best.kn - K.step); kn <= Math.min(k1, best.kn + K.step); kn += K.fine) tryAt(kn, best.x);
  return { ...j, [up]: best.hip, [lo]: best.kn, [ft]: best.foot };
}
const wrap = (d) => ((((d + 180) % 360) + 360) % 360) - 180;
const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
const turnOf = (m) => Math.atan2(m[1], m[0]) / D;
const len = (v) => Math.hypot(v[0], v[1]);
const byName =(rig, j, swap) => Object.fromEntries(layoutRig(rig, { ...j, sx: 1 }, swap).map((e) => [e.name, e]));

// Lying (and falling, getting up): how far down to place the figure so its body (not arms, tail, cloth or items) rests on
// the floor: returns the view dy that puts its lowest point at the floor (z = height off the floor), never lower.
const BODY = /^(pelvis|torso|head|leg-|foot-)/;
export function restDy(L, view, z = 0) {
  const [a, b] = heightOf(view);
  let low = -Infinity;
  for (const e of L) if (e.m && BODY.test(e.name)) for (const [x, y] of hull(e)) low = Math.max(low, a * x + b * y);
  return low === -Infinity ? view.dy : z - low;
}
