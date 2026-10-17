// Floor-line rule (T024, rig standard 8). Grounded: each leg is re-solved by 2-bone IK so its foot's drawing touches
// that foot's floor line (rigs/biped-floor.js), raised only by the pose's '<foot>.lift'; the foot keeps its own tilt and
// the ankle its x (the IK target only moves the ankle up or down). It works on the figure as it is finally drawn (the
// standee's squash and offsets: `view`); the standee's lean turns the hips instead of tipping the figure round its feet
// (which lifted the trailing boot and sank the leading one).
// Lying: the body's lowest drawn point rests on the floor (never below it). Render only; pure, so tests run it.
import HULLS from '../data/rigs/hulls.js';
import { floorLine } from '../data/rigs/biped-floor.js';
import { limb } from '../data/rigs/biped-ik.js';
import { layoutRig } from './rig-layout.js';

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
    const ankle = apply(L0[ft].base, rig.parts[ft].pivot), pts = hull(L0[ft]);
    if (!pts.length) continue;
    const reach = Math.max(...pts.map(([x, y]) => a * (x - ankle[0]) + b * (y - ankle[1])));
    const target = floorLine(rig, ft) - Math.max(0, joints[`${ft}.lift`] ?? 0);
    const R1 = (joints.pelvis ?? 0) + (joints[up] ?? 0), Rf = R1 + (joints[lo] ?? 0) + (joints[ft] ?? 0);
    goals.push({ up, lo, ft, T: [ankle[0], (target - view.dy - a * ankle[0] - reach) / b], Rf, R1, moved: Math.abs(lean) > 1e-9 || Math.abs((target - view.dy - a * ankle[0] - reach) / b - ankle[1]) > 1e-4 });
  }
  if (!goals.some((g) => g.moved)) return joints;
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
  return out;
}
const len = (v) => Math.hypot(v[0], v[1]);
const byName = (rig, j, swap) => Object.fromEntries(layoutRig(rig, { ...j, sx: 1 }, swap).map((e) => [e.name, e]));

// Lying (and falling, getting up): how far down to place the figure so its body (not arms, tail, cloth or items) rests on
// the floor: returns the view dy that puts its lowest point at the floor (z = height off the floor), never lower.
const BODY = /^(pelvis|torso|head|leg-|foot-)/;
export function restDy(L, view, z = 0) {
  const [a, b] = heightOf(view);
  let low = -Infinity;
  for (const e of L) if (e.m && BODY.test(e.name)) for (const [x, y] of hull(e)) low = Math.max(low, a * x + b * y);
  return low === -Infinity ? view.dy : z - low;
}
