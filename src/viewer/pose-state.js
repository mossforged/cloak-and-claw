// Drag to pose (T031), pure: the pose page's pose. A pose = a viewer clip's frame (the fighter as the sim has him then:
// state, move, held item) with its joints and drawings taken over: P = { id, item, from, f, rig, joints, swap, time }.
// It is drawn as a held pose through rigFrame (`@pose` on a copy of the rig's poses), so the game's grip, wrist-limit,
// view and floor-line layers draw it exactly as they would a key in a move file.
//   startPose: the clip frame's pose; poseFrame: one frame of it (rigFrame); solveOf: what pose-drag.js solves on; dragTo:
//   a hand or foot onto a point of the drawing; dragNode: the weapon node's fist with the finger;
//   handles: the round handles (rig px) and what each does; readout: every joint's angle and limit; poseLine: the pose as
//   a move file's data line; parsePose / formatPose: the page's URL (?pose=<fighter>&from=<clip>:<frame>&item&j&sw; T035:
//   &version=v3 poses a viewer compare version).
import { createSlot } from './sandbox.js';
import { rigOf } from './models.js';
import { rigFrame, rigMemory, heldOf } from '../render/rig.js';
import { channelsOf } from '../render/rig-pose.js';
import { strapRig, strapOf } from '../render/strap.js';
import { nodeActive, modesOf } from '../render/weapon-node.js';
import { FPS } from '../config.js';
import { byName, limbOf, endTurn, jointBend, jointed, pivotAt, dragLimb, moveNode, layoutOf, liftOf } from './pose-drag.js';
import { bendOf } from '../render/wrist.js';
import { poseLimit, POSE_LIMITS } from '../data/pose-limits.js';
import HULLS from '../data/rigs/hulls.js';

const D = Math.PI / 180;
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const wrap = (d) => ((d + 540) % 360) - 180;
const r2 = (v) => Math.round(v * 100) / 100;
const TRANSIENT = /^@view(From|Mix)\./;   // a view's slide between two keys: not part of a pose

// The clip frame's pose: the sandbox played to frame n, that frame's blended joints and drawings (render memory).
export function startPose({ id, item = 'own', from = 'idle:0', grip = '', version = 'current' }) {
  const [anim, nn] = from.split(':'), n = Math.max(0, Math.round(+nn || 0));
  const warm = (sb, t) => { for (const f of sb.w.fighters) rigFrame(f, f === sb.hero ? sb.rig : rigOf(f.def.id), t, rigMemory(f), f === sb.hero ? sb.pose ?? undefined : undefined); };
  const slot = createSlot({ warm });
  slot.load({ f: id, v: version, item, grip, anim, flip: false, target: false, look: {}, gear: null });
  const sb = slot.seek(Math.min(n, slot.len)), mem = rigMemory(sb.hero);
  rigFrame(sb.hero, sb.rig, sb.n / FPS, mem, sb.pose ?? undefined);
  const swap = Object.fromEntries(Object.entries(mem.swap ?? {}).filter(([k]) => !TRANSIENT.test(k)));
  return { id, item, version, from: `${sb.clip.key}:${sb.n}`, f: sb.hero, rig: sb.rig, joints: { ...mem.last }, swap, time: sb.n / FPS, start: { joints: { ...mem.last }, swap } };
}

// The rig with the pose as its held `@pose` (one copy per rig, its poses object updated in place)
const copies = new WeakMap();
export function poseRig(P) {
  if (!copies.has(P.rig)) copies.set(P.rig, { ...P.rig, poses: { ...P.rig.poses } });
  const R = copies.get(P.rig);
  R.poses['@pose'] = { ...P.joints, swap: P.swap };
  return R;
}
// One frame of the pose as the game draws it ({ joints, held, L, p, k }); mem fresh each time (no blending).
export const poseFrame = (P, mem = {}) => rigFrame(P.f, poseRig(P), P.time, mem, '@pose');

// A hand or foot dragged so its wrist / ankle lands on T in the drawn layout (rig px): pose-drag.js dragLimb solves on the
// pose's joints; the game's layers on top (a move's lean turned at the hips, the floor-line rule) move the drawn limb a
// little, so the aim is corrected by what the drawing missed (a few passes). At full stretch only its direction is
// corrected (the aim turned about the shoulder / hip); folded as far as it goes, nothing is (it can't get closer).
export function dragTo(P, end, T) {
  const c = solveOf(P), limb = limbOf(end), up = limb.up, b0 = jointBend(c, byName(poseFrame(P).L), limb);
  const deepest = Math.max(b0.lim, Math.abs(b0.bend)) + 0.3;
  let aim = T, best = null;
  for (let i = 0; i < 6; i++) {
    const r = dragLimb(c, end, aim), Q = { ...P, joints: r.joints }, B = byName(poseFrame(Q).L), W = pivotAt(solveOf(Q), B, end);
    const err = Math.hypot(T[0] - W[0], T[1] - W[1]), deep = jointed(B, limb) && Math.abs(jointBend(c, B, limb).bend) > deepest;
    if (!deep && (!best || err < best.err)) best = { ...r, err };
    if (deep) {   // drawn folded past the limit (a leg re-solved on a lean): aim a little further from the hip / shoulder
      const O = pivotAt(c, byName(layoutOf(c)), up), v = [aim[0] - O[0], aim[1] - O[1]], n = Math.hypot(...v) || 1;
      aim = [aim[0] + (v[0] / n) * 1.5, aim[1] + (v[1] / n) * 1.5];
      continue;
    }
    if (r.folded || err < 0.05) break;
    if (r.stretched) {
      const S = pivotAt(c, B, up), da = (Math.atan2(T[1] - S[1], T[0] - S[0]) - Math.atan2(W[1] - S[1], W[0] - S[0])), O = pivotAt(c, byName(layoutOf(c)), up);
      const v = [aim[0] - O[0], aim[1] - O[1]], cs = Math.cos(da), sn = Math.sin(da);
      if (Math.abs(da) < 1e-4) break;
      aim = [O[0] + cs * v[0] - sn * v[1], O[1] + sn * v[0] + cs * v[1]];
    } else aim = [aim[0] + T[0] - W[0], aim[1] + T[1] - W[1]];
  }
  const { err: _e, ...r } = best ?? { ...dragLimb(c, end, aim), folded: true };
  return /^foot-/.test(end) ? { ...r, ...ankleDrawn(P, r.joints, end) } : r;
}
// The floor-line rule re-solves a planted leg on top of the pose (keeping the foot's tilt): the ankle as drawn is put back
// inside its limit (and the foot's lift kept true to its drawing).
function ankleDrawn(P, joints, foot) {
  let j = joints, hit = false;
  for (let i = 0; i < 3; i++) {
    const Q = { ...P, joints: j }, c = solveOf(Q), t = endTurn(c, byName(poseFrame(Q).L), foot);
    if (Math.abs(t.turn) <= t.lim) break;
    j = { ...j, [foot]: j[foot] - (t.turn - Math.sign(t.turn) * (t.lim - 0.05)) };
    j[`${foot}.lift`] = Math.round(liftOf(c, j, foot) * 100) / 100;
    hit = true;
  }
  return hit ? { joints: j, clamped: true } : {};
}

// What the drag solves work on: the strapped rig, the pose's joints and drawings, the item held.
export function solveOf(P) {
  const rig = strapRig(P.rig, strapOf(P.f));
  return { rig, joints: P.joints, swap: P.swap, held: P.swap['@free'] ? null : heldOf(P.f, rig, false) };
}

const centre = (e, fallback) => {
  const h = e && HULLS[e.img];
  return h?.length ? h.map((p) => apply(e.m, ...p)).reduce((a, q) => [a[0] + q[0] / h.length, a[1] + q[1] / h.length], [0, 0]) : fallback;
};
// Handles in drawn rig px (L = poseFrame's layout): { id, at, kind: limb | node | shaft | hips | head, ring? (twist ring point),
// pivot (the point a turn is measured about) }. node: the weapon node's grip hand (drag moves the weapon, the ring turns
// it); shaft: a two-hander's second hand (it follows the shaft; dragging it swings the item round its grip).
export function handles(P, L) {
  const c = solveOf(P), B = byName(L), out = [], R = POSE_LIMITS.ring.off;
  const N = c.held && nodeActive(c.rig, c.joints, c.swap, c.held, modesOf(c.rig, c.held, c.swap));
  const G = c.held?.part && c.rig.grips?.[c.held.grip], item = c.held?.part && B[c.held.slot];
  const grip = item && apply(item.m, ...(c.held.kit.art.grip ?? [0, 0]));
  for (const end of ['hand-near', 'hand-far', 'foot-near', 'foot-far']) {
    const l = limbOf(end);
    if (!B[end] || !B[l.lo]) continue;
    const at = centre(B[end], pivotAt(c, B, end)), E = pivotAt(c, B, l.lo);
    const u = l.arm ? [at[0] - E[0], at[1] - E[1]] : [Math.sign(at[0] - pivotAt(c, B, end)[0]) || 1, -0.7], n = Math.hypot(...u) || 1;   // past the hand; a foot's toward its toes, up
    const kind = N && N.hand === end ? 'node' : G && G.ik.end === end && item ? 'shaft' : 'limb';
    out.push({ id: end, at, kind, ring: kind === 'shaft' ? null : [at[0] + (u[0] / n) * R, at[1] + (u[1] / n) * R], pivot: kind === 'node' ? grip : pivotAt(c, B, end), grip });
  }
  if (B.pelvis) out.push({ id: 'pelvis', at: centre(B.pelvis, pivotAt(c, B, 'pelvis')), kind: 'hips' });
  if (B.head) out.push({ id: 'head', at: centre(B.head, pivotAt(c, B, 'head')), kind: 'head', pivot: pivotAt(c, B, 'head') });
  return out;
}

// The held item as drawn in layout L, for the weapon node's drags: { grip (rig px), rot (its handle's angle in the pose's
// weapon.rot sense) }, or null
export function nodeAnchor(P, L) {
  const c = solveOf(P), e = c.held?.part && byName(L)[c.held.slot], A = c.held?.kit?.art;
  if (!e || !A?.gripEnd) return null;
  const v = [A.gripEnd[0] - A.grip[0], A.gripEnd[1] - A.grip[1]], a = Math.atan2(e.m[1] * v[0] + e.m[3] * v[1], e.m[0] * v[0] + e.m[2] * v[1]) / D;
  return { grip: apply(e.m, ...A.grip), rot: (c.joints.sx ?? 1) > 0 ? a : 180 - a };
}

// The weapon node's fist dragged by d (rig px) from layout L: the item's grip moves with the finger; where the wrist
// limits would hold the fist back (the game's limiter moves a hand rather than bend a wrist past its limit), the item is
// turned too, the turn that lands the grip nearest (the smallest turn among equals). { joints, clamped }
export function dragNode(P, L, d) {
  const c = solveOf(P), A = nodeAnchor(P, L), want = [A.grip[0] + d[0], A.grip[1] + d[1]], sx = c.joints.sx ?? 1, gap0 = shaftGap(P, L);
  const tryTurn = (deg) => {
    const j = moveNode(c, d, { ...A, rot: A.rot + sx * deg }).joints, Q = { ...P, joints: j }, LQ = poseFrame(Q).L, g = nodeAnchor(Q, LQ).grip;
    return { joints: j, deg, err: Math.hypot(g[0] - want[0], g[1] - want[1]) + (gap0 == null ? 0 : 2 * Math.abs(shaftGap(Q, LQ) - gap0)) };
  };
  let best = tryTurn(0);
  const better = (r) => r.err < best.err - 0.05 || (Math.abs(r.err - best.err) <= 0.05 && Math.abs(r.deg) < Math.abs(best.deg));
  if (best.err > 0.5) {
    for (let deg = -60; deg <= 60; deg += 10) if (deg) { const r = tryTurn(deg); if (better(r)) best = r; }
    for (const step of [5, 2.5, 1]) for (const s of [-step, step]) { const r = tryTurn(best.deg + s); if (better(r)) best = r; }
  }
  return { joints: best.joints, clamped: best.err > 0.75 };
}

// A two-hander's second fist: how far its wrist sits off the shaft's line (rig px; it lets go when it can't reach), or null
export function shaftGap(P, L) {
  const c = solveOf(P), G = c.held?.part && c.rig.grips?.[c.held.grip], B = byName(L), A = nodeAnchor(P, L);
  if (!G || !A || !B[G.ik.end]) return null;
  const a = (c.joints.sx ?? 1) > 0 ? A.rot * D : (180 - A.rot) * D, W = pivotAt(c, B, G.ik.end);
  return (W[0] - A.grip[0]) * Math.sin(a) - (W[1] - A.grip[1]) * Math.cos(a);
}

// Every joint on the drawn layout L: [{ name, value (deg), lim (deg or null), at (at its limit), note }]
// T035: each limited joint's own turn (wrapped) and its range [lo, hi]; `at` within half a degree of either end
const JOINT_NAMES = { torso: 'waist', head: 'neck', tail: 'tail root', 'tail-2': 'tail mid', 'tail-3': 'tail end' };
const jointName = (part) => JOINT_NAMES[part] ?? part.replace(/^arm-(\w+)-upper$/, 'shoulder $1').replace(/^arm-(\w+)-lower$/, 'elbow $1')
  .replace(/^hand-(\w+)$/, 'wrist $1').replace(/^leg-(\w+)-upper$/, 'hip $1').replace(/^leg-(\w+)-lower$/, 'knee $1').replace(/^foot-(\w+)$/, 'ankle $1');
function limitRows(c, B) {
  const rows = B.pelvis ? [{ name: 'pelvis', value: r2(wrap(c.joints.pelvis ?? 0)), lim: null, at: false, note: '' }] : [];
  for (const [part, [lo, hi]] of Object.entries(c.rig.limits)) {
    if (!B[part]) continue;
    const v = wrap(c.joints[part] ?? 0);
    rows.push({ name: jointName(part), value: r2(v), lim: [lo, hi], at: v <= lo + 0.5 || v >= hi - 0.5, note: '' });
  }
  return rows;
}

export function readout(P, L) {
  const c = solveOf(P), B = byName(L), rows = [], row = (name, value, lim, note = '') => rows.push({ name, value: r2(value), lim, at: lim != null && Math.abs(value) >= lim - 0.5, note });
  if (c.rig.limits) return limitRows(c, B);   // T035: a rig with per-joint ranges (rat v3)
  for (const n of ['pelvis', 'torso']) if (B[n]) row(n, wrap(c.joints[n] ?? 0), null);
  if (B.head && B[c.rig.parts.head.parent]) row('neck', bendOf(B[c.rig.parts.head.parent], B.head), poseLimit(c.rig, 'neck'));
  for (const end of ['hand-near', 'hand-far', 'foot-near', 'foot-far']) {
    const l = limbOf(end), side = end.split('-')[1], joint = l.arm ? 'elbow' : 'knee';
    if (!B[l.up]) continue;
    row(`${l.arm ? 'shoulder' : 'hip'} ${side}`, wrap(c.joints[l.up] ?? 0), null);
    if (!jointed(B, l)) { rows.push({ name: `${joint} ${side}`, value: null, lim: null, at: false, note: 'whole-limb drawing' }); continue; }
    const b = jointBend(c, B, l), full = Math.abs(b.bend) < 1.5;   // straight: it can't reach further
    row(`${joint} ${side}`, b.bend, b.lim, full ? 'full stretch' : '');
    if (full) rows[rows.length - 1].at = true;
    const t = endTurn(c, B, end);
    row(`${l.arm ? 'wrist' : 'ankle'} ${side}`, t.turn, t.lim, B[end].swap ?? '');
  }
  return rows;
}

// The pose as the data line a move file takes (raw channels: those that differ from the rig's stance; drawings, views and
// flags as the pose keys swap / view / grip / grip2 / order / aloft / free / carry).
export function poseLine(P) {
  const S = { ...channelsOf(P.rig), ...P.rig.poses.stance }, out = [], q = (s) => (/^[a-z]\w*$/i.test(s) ? s : `'${s}'`);
  const swap = {}, view = {}, order = {}, flags = {};
  for (const [k, v] of Object.entries(P.swap)) {
    if (k.startsWith('@view.')) view[k.slice(6)] = v;
    else if (k.startsWith('@order.')) order[k.slice(7)] = v;
    else if (k.startsWith('@')) flags[k.slice(1)] = v;
    else swap[k] = v;
  }
  const obj = (o) => `{ ${Object.entries(o).map(([k, v]) => `${q(k)}: ${typeof v === 'string' ? `'${v}'` : v}`).join(', ')} }`;
  if (Object.keys(view).length) out.push(`view: ${obj(view)}`);
  if (Object.keys(swap).length) out.push(`swap: ${obj(swap)}`);
  if (Object.keys(order).length) out.push(`order: ${obj(order)}`);
  for (const [k, v] of Object.entries(flags)) out.push(`${k}: ${typeof v === 'string' ? `'${v}'` : v}`);
  for (const [k, v] of Object.entries(P.joints)) if (typeof v === 'number' && Math.abs(v - (S[k] ?? 0)) > 0.005) out.push(`${q(k)}: ${r2(v)}`);
  return `{ ${out.join(', ')} }`;
}

// URL: ?pose=<fighter>&from=<clip>:<frame>&item=<id>&j=<channel>:<value>,...&sw=<part>:<drawing>,... (j = channels that
// differ from the stance; sw = the whole swap list, '-' = none). No j / sw: the clip frame's own pose.
export function parsePose(search) {
  const q = new URLSearchParams(search), list = (k) => (q.get(k) ? q.get(k).split(',').filter(Boolean).map((s) => { const i = s.lastIndexOf(':'); return [s.slice(0, i), s.slice(i + 1)]; }) : null);
  const j = list('j'), sw = q.get('sw') === '-' ? [] : list('sw');
  return { id: q.get('pose'), from: q.get('from') || 'idle:0', item: q.get('item') || 'own', version: q.get('version') || 'current', j: j && Object.fromEntries(j.map(([k, v]) => [k, +v])), sw: sw && Object.fromEntries(sw.map(([k, v]) => [k, v === 'true' ? true : v])) };
}
export function applyUrl(P, u) {
  const S = { ...channelsOf(P.rig), ...P.rig.poses.stance };
  if (u.j) P.joints = { ...S, ...u.j };
  if (u.sw) P.swap = u.sw;
  return P;
}
export function formatPose(P) {
  const S = { ...channelsOf(P.rig), ...P.rig.poses.stance };
  const j = Object.entries(P.joints).filter(([k, v]) => typeof v === 'number' && Math.abs(v - (S[k] ?? 0)) > 0.005).map(([k, v]) => `${k}:${r2(v)}`);
  const sw = Object.entries(P.swap).map(([k, v]) => `${k}:${v}`);
  const q = new URLSearchParams({ pose: P.id, from: P.from, ...(P.item !== 'own' && { item: P.item }), ...(P.version && P.version !== 'current' && { version: P.version }) });
  return `${q.toString()}&j=${encodeURIComponent(j.join(',')).replace(/%2C/g, ',').replace(/%3A/g, ':')}&sw=${sw.length ? encodeURIComponent(sw.join(',')).replace(/%2C/g, ',').replace(/%3A/g, ':') : '-'}`;
}
