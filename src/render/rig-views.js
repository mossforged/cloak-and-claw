// Body views (T028, rig standard 4 and 6): the direction the chest (torso) and hips (pelvis) face, picked separately.
// A rig's `bodyViews[slot][code]` = { swap: the drawing (a swap of that part; absent = its own drawing), anchors: joint
// points on that drawing (that part's own px: torso `neck`, `shoulder_near`, `shoulder_far`, `waist`; pelvis `waist`,
// `hip_near`, `hip_far`, `tail_root`; or any child part's name), bands: { part: draw order } (which limbs draw in front of
// the body in this view), swaps: { part: swap } other drawings the view brings (a front head), standIn: the drawing it
// waits for (rehearsal sheet); T028 r2: attach: { part: [x, y] } where a limb further down hangs on its parent in this
// view (the back view's limb cuts, parent px), hide: [parts] the view leaves out (B: the separate belt) }. View Q (or a missing code) = the part's own drawing, points and bands: a rig without
// bodyViews lays out exactly as before.
// A pose picks views and per-part bands through its swap list (render/rig-pose.js swapOf): '@view.<slot>' = code,
// '@order.<part>' = band (a shield guard in front of the chest). rigFrame adds '@viewFrom.<slot>' / '@viewMix.<slot>'
// while the children slide from the old view's points to the new one's (RIG_MOTION.viewBlend). Pure.
import { RIG_MOTION } from '../data/rig-motion.js';

// Q three-quarter, S side, F toward the camera, BQ turned away, B back; H hunched and LB leaning back: three-quarter
// torso drawings with their own joint points
export const VIEW_CODES = ['Q', 'S', 'F', 'BQ', 'B', 'H', 'LB'];
// rehearsal joint names -> the child part they attach (waist on the torso view = the torso's own pivot)
export const ANCHOR_PARTS = { neck: 'head', shoulder_near: 'arm-near-upper', shoulder_far: 'arm-far-upper', waist: 'torso',
  hip_near: 'leg-near-upper', hip_far: 'leg-far-upper', tail_root: 'tail' };

export const viewOf = (swap, slot) => swap?.[`@view.${slot}`] ?? 'Q';

// Every joint point a view moves, keyed by part: a child's attach (parent px) or, under the slot's own name, its pivot.
export function anchorsOf(rig, slot, code) {
  const out = { [slot]: rig.parts[slot].pivot };
  for (const [c, p] of Object.entries(rig.parts)) if (p.parent === slot) out[c] = p.attach;
  const V = rig.bodyViews?.[slot]?.[code];
  for (const [k, xy] of Object.entries(V?.anchors ?? {})) out[ANCHOR_PARTS[k] ?? k] = xy;
  return Object.assign(out, V?.attach);
}
// the rig's own point for a part a view moves (its pivot under the slot's name, else its attach)
const ownPoint = (rig, slot, c) => (c === slot ? rig.parts[c].pivot : rig.parts[c].attach);

const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// Applies the views named in `swap` to a copy of the rig's parts (`parts` is layoutRig's own copy: entries are replaced,
// never changed). Returns the swap list with each view's drawings added (a pose's own swap of that part wins), the
// view bands + pose band overrides ({ part: order }) and the parts the views hide.
export function applyViews(rig, parts, swap) {
  const bands = {}, hide = [];
  if (rig.bodyViews) {
    swap = { ...swap };
    for (const slot of Object.keys(rig.bodyViews)) {
      if (!parts[slot]) continue;
      const code = viewOf(swap, slot), V = rig.bodyViews[slot][code] ?? {};
      if (V.swap && !swap[slot]) swap[slot] = V.swap;
      for (const [p, s] of Object.entries(V.swaps ?? {})) if (!swap[p]) swap[p] = s;
      Object.assign(bands, V.bands);
      hide.push(...(V.hide ?? []));
      const to = anchorsOf(rig, slot, code), from = swap[`@viewFrom.${slot}`], k = swap[`@viewMix.${slot}`];
      const A = from != null && from !== code && k < 1 ? anchorsOf(rig, slot, from) : null;
      for (const c of new Set([...Object.keys(to), ...Object.keys(A ?? {})])) {
        if (!parts[c]) continue;
        const xy = to[c] ?? ownPoint(rig, slot, c), pt = A ? lerp2(A[c] ?? ownPoint(rig, slot, c), xy, k) : xy;
        if (pt === ownPoint(rig, slot, c)) continue;
        parts[c] = { ...parts[c], [c === slot ? 'pivot' : 'attach']: pt };
      }
    }
  }
  for (const [k, v] of Object.entries(swap)) if (k.startsWith('@order.')) bands[k.slice(7)] = v;
  return { swap, bands, hide };
}

// Shoulder caps (rig standard 4): a part with `cap: true` hangs off its upper arm, turns only RIG_MOTION.capTurn of the
// arm's swing (rig.capTurn overrides), draws just above it, and shows only while that arm draws in front of the torso.
// (the arm's turn from the master taken the short way round: poses unwrap arm angles past 180)
const wrap = (d) => ((((d + 180) % 360) + 360) % 360) - 180;
export const capTurn = (rig, p, joints) => -(1 - (rig.capTurn ?? RIG_MOTION.capTurn)) * wrap(joints[p.parent] ?? 0);
export const capShows = (orderOf, p) => orderOf(p.parent) > orderOf('torso');

// Per-frame view memory (rigFrame, after the pose): the turn-around when the facing flips (the body's width crossing
// zero, RIG_MOTION.turn, with the F view on its `front` frames; only a rig with an F torso), and the slide of the
// children from the old view's joint points (adds '@viewFrom.<slot>' / '@viewMix.<slot>'). mem = render memory.
// Returns { joints, swap }; a rig without bodyViews gets its own back.
export function viewLayer(rig, f, joints, swap, mem, time) {
  if (!rig.bodyViews) return { joints, swap };
  const T = RIG_MOTION.turn, sw = { ...swap };
  if (mem.facing != null && mem.facing !== f.facing && rig.bodyViews.torso?.F) mem.turnT0 = time;
  mem.facing = f.facing;
  const i = mem.turnT0 == null ? -1 : Math.floor((time - mem.turnT0) * 60 + 1e-6);
  if (i >= 0 && i < T.sx.length) {
    joints = { ...joints, sx: (joints.sx ?? 1) * T.sx[i] };
    if (T.front.includes(i)) for (const s of Object.keys(rig.bodyViews)) if (rig.bodyViews[s].F) sw[`@view.${s}`] = 'F';
  }
  mem.views ??= {};
  for (const s of Object.keys(rig.bodyViews)) {
    const v = viewOf(sw, s), m = (mem.views[s] ??= { cur: v, from: v, t0: -Infinity });
    if (m.cur !== v) Object.assign(m, { from: m.cur, cur: v, t0: time });
    const k = (time - m.t0) / RIG_MOTION.viewBlend;   // T029 r2: viewBlend 0 = the joint points snap with the drawing
    if (RIG_MOTION.viewBlend > 0 && k >= 0 && k < 1) Object.assign(sw, { [`@viewFrom.${s}`]: m.from, [`@viewMix.${s}`]: k });
  }
  return { joints, swap: sw };
}

// The rig as a view sees it ({ torso: 'F', pelvis: 'Q' }): parts on that view's joint points, for pose authoring (IK
// placing a fist from the shoulder the view actually draws). Pure.
export function viewRig(rig, views = {}) {
  const parts = { ...rig.parts };
  applyViews(rig, parts, Object.fromEntries(Object.entries(views).map(([k, v]) => [`@view.${k}`, v])));
  return { ...rig, parts };
}
