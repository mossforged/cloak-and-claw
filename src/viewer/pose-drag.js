// Drag to pose (T031), pure: the solves behind the pose page's handles, on a pose `c` = { rig (strapped), joints, swap, held }
// in rig px (x forward, y down, feet at 0,0). Each returns new joints; the page then draws them through rigFrame like any
// pose, so the game's own grip, wrist-limit and floor-line layers run on top.
//   dragLimb: a hand or foot to a wrist / ankle point: 2-bone IK (render/rig-ik.js reach: the elbow / knee keeps the side it
//     bends to), the hand / foot keeps its turn on screen, then its wrist (data/wrists.js) or ankle (data/pose-limits.js)
//     inside its limit. Out of reach: full stretch toward the point; never folded deeper than the elbow / knee limit.
//   twist: a hand or foot turned; past its limit the forearm / shin turns the rest (about the elbow / knee).
//   dragHips: the body moved, every planted foot kept where it stands (the hips stop where a leg would leave its foot).
//   dragHead: the head turned on the neck, inside its limit.
//   turnNode / moveNode: a weapon on the weapon node (render/weapon-node.js: pose channels weapon.x/.y/.rot) moved or turned.
//   T035: a rig with per-joint `limits` (rat v3) has every drag's joints clamped into them (render/limits.js, as drawn);
//   T035 r2: its hands and feet are solved inside them (limbInLimits, as the retarget), not clamped after.
//   liftOf: a foot's drawing above its floor line (the pose's '<foot>.lift': the floor-line rule keeps it there).
import { layoutRig } from '../render/rig-layout.js';
import { reach } from '../render/rig-ik.js';
import { bendOf, turnOf } from '../render/wrist.js';
import { wristLimit, WRISTS } from '../data/wrists.js';
import { poseLimit, POSE_LIMITS } from '../data/pose-limits.js';
import { floorLine } from '../data/rigs/biped-floor.js';
import HULLS from '../data/rigs/hulls.js';
import { limitLayer, limbInLimits } from '../render/limits.js';

const D = Math.PI / 180;
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) / D;
const wrap = (d) => ((d + 540) % 360) - 180;
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const clamp = (v, lim) => Math.max(-lim, Math.min(lim, v));
const det = (m) => Math.sign(m[0] * m[3] - m[1] * m[2]) || 1;
const angOf = (m) => Math.atan2(m[1], m[0]) / D;   // a frame's x axis on screen

// hand-near -> arm-near-upper, arm-near-lower; foot-far -> leg-far-upper, leg-far-lower
export const limbOf = (end) => {
  const [kind, side] = end.split('-'), b = kind === 'hand' ? 'arm' : 'leg';
  return { up: `${b}-${side}-upper`, lo: `${b}-${side}-lower`, end, arm: kind === 'hand' };
};
export const byName = (L) => Object.fromEntries(L.filter((e) => e.m && !e.line).map((e) => [e.name, e]));
export const layoutOf = (c, j = c.joints) => layoutRig(c.rig, j, c.swap, c.held);
export const pivotAt = (c, B, n) => apply(B[n].base, ...c.rig.parts[n].pivot);

// The end's turn on its parent from its natural angle (a hand: from its drawing's neutral; a foot: as drawn) and its limit.
export function endTurn(c, B, end) {
  const F = B[c.rig.parts[end].parent], H = B[end];
  if (/^hand-/.test(end)) return { turn: turnOf(c.rig, F, H), lim: wristLimit(c.rig, end.slice(5)) };
  return { turn: bendOf(F, H), lim: poseLimit(c.rig, 'ankle') };
}
// The elbow / knee bend on screen (degrees between the two bones) and its limit.
export function jointBend(c, B, { up, lo, end, arm }) {
  const S = pivotAt(c, B, up), E = pivotAt(c, B, lo), W = pivotAt(c, B, end);
  return { bend: wrap(ang(E, W) - ang(S, E)), lim: arm ? WRISTS.elbowMax : poseLimit(c.rig, 'knee') };
}
// Whether a limb is drawn jointed (a whole-arm or whole-leg drawing hides its lower part: nothing to bend)
export const jointed = (B, { up, lo, end }) => !!(B[up] && B[lo] && B[end]);

// Turns `end` (joint) so its turn on its parent is inside the limit; returns [joints, clamped].
function limitEnd(c, j, end) {
  let out = j, hit = false;
  for (let i = 0; i < 3; i++) {
    const { turn, lim } = endTurn(c, byName(layoutOf(c, out)), end);
    if (Math.abs(turn) <= lim + 1e-6) break;
    out = { ...out, [end]: out[end] - (turn - clamp(turn, lim - 1e-4)) };   // measured in the parent's px: same sense as the joint
    hit = true;
  }
  return [out, hit];
}

// Puts `end`'s turn on screen back to a (its world angle before the solve).
function keepTurn(c, j, end, a) {
  const e = byName(layoutOf(c, j))[end];
  return { ...j, [end]: j[end] + det(e.base) * wrap(a - angOf(e.base)) };
}

// IK of one limb to point T (rig px) for its wrist / ankle, the end keeping its screen turn. { joints, stretched, folded, clamped }
export function solveLimb(c, j, limb, T) {
  const B = byName(layoutOf(c, j));
  if (!jointed(B, limb)) return { joints: j, stretched: false, folded: false, clamped: false };
  const S = pivotAt(c, B, limb.up), l1 = dist(S, pivotAt(c, B, limb.lo)), l2 = dist(pivotAt(c, B, limb.lo), pivotAt(c, B, limb.end));
  const b0 = jointBend(c, B, limb), lim = Math.max(b0.lim, Math.abs(b0.bend)), dmax = l1 + l2 - 0.02;   // never deeper than the limit (or the pose had)
  const dmin = Math.sqrt(Math.max(0, l1 * l1 + l2 * l2 - 2 * l1 * l2 * Math.cos((180 - lim) * D))) + 0.02;
  let d = dist(S, T), stretched = false, folded = false;
  if (d > dmax) { d = dmax; stretched = true; } else if (d < dmin) { d = dmin; folded = true; }
  const a = d > 1e-6 ? ang(S, T) : 90, P = [S[0] + d * Math.cos(a * D), S[1] + d * Math.sin(a * D)];
  const a0 = angOf(B[limb.end].base), ik = { arm: [limb.up, limb.lo], end: limb.end, hand: c.rig.parts[limb.end].pivot };
  let out = j;
  for (let i = 0; i < 2; i++) out = reach(c.rig, out, c.swap, c.held, ik, () => P);
  const [lim2, clamped] = limitEnd(c, keepTurn(c, out, limb.end, a0), limb.end);
  return { joints: lim2, stretched, folded, clamped };
}

// A foot's drawing above its floor line (px, 0 = standing on it).
export function liftOf(c, j, foot) {
  const e = byName(layoutOf(c, j))[foot], pts = e && HULLS[e.img];
  if (!pts?.length) return 0;
  return Math.max(0, floorLine(c.rig, foot) - Math.max(...pts.map((p) => apply(e.m, ...p)[1])));
}
const withLifts = (c, j) => {
  const out = { ...j };
  for (const ft of ['foot-near', 'foot-far']) if (c.rig.parts[ft]) out[`${ft}.lift`] = Math.round(liftOf(c, j, ft) * 100) / 100;
  return out;
};

// T035: a solve's joints held inside the rig's per-joint limits (none: the result as it was)
function limited(c, r) {
  const j = limitLayer(c.rig, r.joints);
  if (j === r.joints) return r;
  const hit = Object.keys(c.rig.limits).some((k) => k in r.joints && Math.abs(wrap(j[k] - r.joints[k])) > 1e-6);
  return { ...r, joints: j, clamped: r.clamped || hit };
}

// T035 r2: on a rig with per-joint limits (rat v3), the retarget's solve (render/limits.js limbInLimits): elbow / knee and
// shoulder / hip picked inside their ranges, the bend kept on its side, the hand / foot keeping its turn on screen
function solveInLimits(c, limb, T) {
  const B = byName(layoutOf(c));
  if (!jointed(B, limb)) return { joints: c.joints, stretched: false, folded: false, clamped: false };
  const r = limbInLimits(c.rig, B, c.joints, [limb.up, limb.lo, limb.end], T);
  return { joints: r.joints, stretched: false, folded: false, clamped: r.err > 0.5 };
}

// A hand or foot dragged so its wrist / ankle goes to T (rig px).
export function dragLimb(c, end, T) {
  const r = c.rig.limits ? solveInLimits(c, limbOf(end), T) : solveLimb(c, c.joints, limbOf(end), T);
  return limited(c, { ...r, joints: /^foot-/.test(end) ? withLifts(c, r.joints) : r.joints });
}

// A hand or foot turned by deg (rig px screen sense) from the pose c: its own turn inside the limit, the forearm / shin the
// rest (cut back if that would fold the elbow / knee past its limit). { joints, clamped }
export function twist(c, end, deg) {
  const limb = limbOf(end), B = byName(layoutOf(c));
  if (!B[end] || !B[limb.lo]) return { joints: c.joints, clamped: false };
  const { turn, lim } = endTurn(c, B, end), dj = det(B[limb.lo].base) * deg, want = turn + dj, own = clamp(want, lim);
  let out = { ...c.joints, [end]: c.joints[end] + own - turn }, rest = want - own;
  for (let k = 1; Math.abs(rest) > 1e-6 && k >= 0; k -= 0.1) {   // the forearm / shin turns what the wrist / ankle can't
    const j = { ...out, [limb.lo]: c.joints[limb.lo] + rest * k }, Bj = byName(layoutOf(c, j)), b = jointBend(c, Bj, limb);
    if (Math.abs(b.bend) <= b.lim || Math.abs(b.bend) <= Math.abs(jointBend(c, B, limb).bend)) { out = j; break; }
  }
  return limited(c, { joints: /^foot-/.test(end) ? withLifts(c, out) : out, clamped: Math.abs(rest) > 1e-6 });
}

// The hips (root) moved by d (rig px); each jointed leg re-solved so its ankle and foot stay put. If a leg can't (out of
// reach, or folded past the knee limit), the move is cut back to the furthest that keeps both feet.
export function dragHips(c, d) {
  const B = byName(layoutOf(c)), legs = ['near', 'far'].map((s) => limbOf(`foot-${s}`)).filter((l) => jointed(B, l));
  const keep = legs.map((l) => ({ l, A: pivotAt(c, B, l.end) }));
  const at = (k) => {
    let j = { ...c.joints, dx: (c.joints.dx ?? 0) + d[0] * k, dy: (c.joints.dy ?? 0) + d[1] * k }, ok = true;
    for (const { l, A } of keep) {
      const r = solveLimb(c, j, l, A);
      ok = ok && !r.stretched && !r.folded;
      j = r.joints;
    }
    return { j, ok };
  };
  let r = at(1);
  if (!r.ok) {   // cut back: the largest share of the move both legs still reach
    let lo = 0, hi = 1;
    const n = Math.max(4, Math.ceil(Math.log2(Math.hypot(...d) / POSE_LIMITS.hipStep + 1)));
    for (let i = 0; i < n; i++) { const m = (lo + hi) / 2; if (at(m).ok) lo = m; else hi = m; }
    r = { ...at(lo), stopped: true };
  }
  return limited(c, { joints: withLifts(c, r.j), stopped: !!r.stopped });
}

// The head turned by deg (screen sense) from the pose c, inside the neck limit. { joints, clamped }
export function dragHead(c, deg) {
  const B = byName(layoutOf(c)), H = B.head, T = H && B[c.rig.parts.head.parent];
  if (!T) return { joints: c.joints, clamped: false };
  const turn = bendOf(T, H), lim = poseLimit(c.rig, 'neck'), want = turn + det(T.base) * deg, got = clamp(want, lim);
  return limited(c, { joints: { ...c.joints, head: (c.joints.head ?? 0) + got - turn }, clamped: got !== want });
}

// The weapon node's placement moved by d (rig px) / turned by deg, from where it is drawn (A = { grip: the item's grip point,
// rot: its handle's angle as the pose's weapon.rot }: a placement the arm can't reach is drawn where the arm takes it, so a
// drag starts from the drawing, not from the unreachable spot).
const place = (j, A, d, deg) => {
  const sx = j.sx ?? 1;
  return { ...j, 'weapon.x': (A.grip[0] + d[0] - (j.dx ?? 0)) / sx, 'weapon.y': A.grip[1] + d[1] - (j.dy ?? 0), 'weapon.at': 1, 'weapon.rot': A.rot + sx * deg, 'weapon.turn': 1 };
};
export const moveNode = (c, d, A) => ({ joints: place(c.joints, A, d, 0) });
export const turnNode = (c, deg, A) => ({ joints: place(c.joints, A, [0, 0], deg) });
