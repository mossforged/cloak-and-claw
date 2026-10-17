// Stretch test (T024, rig standard 8, the G2 artefact): poses a rig at its limits and flags what breaks. Pure (no DOM):
// npm test runs it headless (tests/stretch.test.mjs), tools/stretch-strip.mjs exports the JPG strip, the rig bench shows
// it (tools/rig-bench.html?...&stretch). alphaOf(img) -> { w, h, alpha } is the caller's (Node: bench/png.mjs; browser:
// canvas pixels).
// Cells: each knee and elbow bent 90 and 150 degrees from straight; arms straight up; each torso view; each hand, foot and
// whole-limb drawing; each item each body holds (current grip; overhand / underhand / reverse come with T025); a crouch,
// the pose-budget crouches and lying with the floor lines; the rig at 0.96x, 1.04x, 1.4x.
// Flags: a seam gap over 2 px at a joint (a crack inside the joint's filled core at rest: empty with drawing on both sides), a foot below its floor line or floating
// over it without a named lift (floor cells), a lying body off the floor, a far hand hidden on a two-handed item.
import { layoutRig } from '../../src/render/rig-layout.js';
import { rigFrame } from '../../src/render/rig.js';
import { gripLayout } from '../../src/render/rig-grip.js';
import { channelsOf } from '../../src/render/rig-pose.js';
import { floorLine } from '../../src/data/rigs/biped-floor.js';
import { LOOKS } from '../../src/data/looks.js';

const D = Math.PI / 180;
const ang = (v) => Math.atan2(v[1], v[0]) / D;
const wrap = (a) => ((((a + 180) % 360) + 360) % 360) - 180;
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
const inv = (m) => { const d = m[0] * m[3] - m[1] * m[2]; return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[3] * m[4]) / d, (m[1] * m[4] - m[0] * m[5]) / d]; };
const bone = (rig, n) => { const c = rig.parts[n], p = rig.parts[c.parent]; return [c.attach[0] - p.pivot[0], c.attach[1] - p.pivot[1]]; };
const ITEM = new Set(['sword', 'shield', 'held']);
export const SEAM_PX = 2;

const fighterOf = (def, o = {}) => ({ def, state: 'idle', t: 0, mf: 0, move: null, z: 0, vz: 0, facing: 1, id: 1, x: 0, y: 0, stun: 10, grab: { knee: -1 }, ...o });
const viewOf = (p, k) => { const c = Math.cos(p.rot), s = Math.sin(p.rot); return [p.sx * k * c, p.sx * k * s, -p.sy * k * s, p.sy * k * c, p.dx, p.dy]; };
const childOf = (rig, n) => Object.keys(rig.parts).find((c) => rig.parts[c].parent === n && !ITEM.has(c));

// family: [[rig, def], ...]: the body first, then variants that only add held items (the rat's spearman and archer).
// items: floor weapons the body can pick up (held in its one-hand slot).
export function stretchCells(family, items = []) {
  const [[rig, def]] = family, cells = [];
  const still = (r = rig) => { const S = { ...channelsOf(r) }; for (const [k, v] of Object.entries(r.poses.stance ?? {})) if (typeof v === 'number') S[k] = v; return S; };
  const S = still();
  const custom = (label, joints, swap = {}, o = {}) => {
    const r = o.rig ?? rig, f = fighterOf(o.def ?? def, o.f), held = o.held ?? null;
    cells.push({ label, rig: r, joints, swap, held, L: gripLayout(r, joints, swap, held, f), view: viewOf({ rot: 0, sx: 1, sy: 1, dx: 0, dy: 0 }, 1), k: 1, ...o.flags });
  };
  const frame = (label, o, pose, flags = {}) => {
    const f = fighterOf(def, o), mem = {};
    rigFrame(f, rig, -1, mem, pose); const fr = rigFrame(f, rig, 0, mem, pose);
    cells.push({ label, rig, joints: fr.joints, swap: mem.swap, held: fr.held, L: fr.L, view: viewOf(fr.p, fr.k), k: fr.k, p: fr.p, f, ...flags });
  };
  // bend a joint `flex` degrees from straight: knees fold the foot back, elbows bend the way the master's arm does
  const flexed = (lo, flex, knee) => {
    const c = childOf(rig, lo), cur = wrap(ang(bone(rig, c)) - ang(bone(rig, lo)));
    const sign = knee ? 1 : Math.sign(cur) || -1;   // + turns clockwise: the shin swings back (facing right)
    return sign * flex - cur;
  };
  for (const side of ['near', 'far']) for (const deg of [90, 150]) {
    if (rig.parts[`leg-${side}-lower`]) custom(`${side} knee ${deg}`, { ...S, [`leg-${side}-lower`]: S[`leg-${side}-lower`] + flexed(`leg-${side}-lower`, deg, true) });
    if (rig.parts[`arm-${side}-lower`]) custom(`${side} elbow ${deg}`, { ...S, [`arm-${side}-lower`]: S[`arm-${side}-lower`] + flexed(`arm-${side}-lower`, deg, false) });
  }
  const up = { ...S };
  for (const side of ['near', 'far']) {
    const u = `arm-${side}-upper`, l = `arm-${side}-lower`, h = childOf(rig, l);
    if (!rig.parts[u]) continue;
    up[u] = -90 - ang(bone(rig, l)) - (S.torso + S.pelvis);
    up[l] = ang(bone(rig, l)) - ang(bone(rig, h));
  }
  custom('arms straight up', up);
  const views = rig.parts.torso?.swaps ?? {};
  custom('torso three-quarter', S);
  for (const sw of Object.keys(views)) custom(sw, S, { torso: sw, ...(sw === 'torso-back' && rig.parts.head?.swaps?.['head-back'] ? { head: 'head-back' } : {}) });
  for (const [n, p] of Object.entries(rig.parts)) {
    if (!/^(hand|foot|arm|leg)-/.test(n)) continue;
    for (const sw of Object.keys(p.swaps ?? {})) custom(sw, S, { [n]: sw });
  }
  // items each body holds (its own, floor weapons in the one-hand slot, variants' kits), at the current grip
  for (const [r, d] of family) {
    const SR = still(r), own = d.kit ?? d.art?.held;
    if (own || r === rig) custom(`${d.name ?? d.id}: ${own ?? 'own weapon'} (current grip)`, SR, {}, { rig: r, def: d, held: own ? heldFor(r, d) : null, flags: { twoHand: r.slots?.['two-hand'] && heldFor(r, d)?.grip === 'two-hand' } });
  }
  for (const it of items) custom(`${it.id} (current grip)`, S, {}, { held: heldFor(rig, def, it), f: { weapon: { def: it } } });
  // floor cells: the drawn frame (floor-line rule, standee lean) with the floor lines
  frame('stance (floor)', {}, undefined, { floor: true });
  if (rig.poses.jumpSquat) frame('crouch: jump squat (floor)', {}, 'jumpSquat', { floor: true });
  for (const k of ['reach', 'downed', 'revive', 'getup']) if (rig.poses[k]?.swap && Object.keys(rig.poses[k].swap).some((n) => n.startsWith('leg-'))) frame(`${k} (floor)`, {}, k, { floor: true });
  frame('lying (floor)', { state: 'down', t: 30 }, undefined, { lying: true });
  for (const s of [0.96, 1.04, 1.4]) frame(`${s}x (floor)`, { look: { size: (s - 1) / LOOKS.size } }, undefined, { floor: true });
  return cells;
}
function heldFor(rig, def, item) {
  const f = fighterOf(def, item ? { weapon: { def: item } } : {});
  return (rigFrame(f, rig, 0, {}).held);
}

// Is screen point P covered by entry e's drawing?
const covers = (alphaOf, e, P) => {
  const A = alphaOf(e.img);
  if (!A) return false;
  const [u, v] = apply(e.inv ??= inv(e.m), P), x = Math.floor(u), y = Math.floor(v);
  return x >= 0 && y >= 0 && x < A.w && y < A.h && A.alpha[y * A.w + x] > 127;
};
// Largest radius (step 0.25, up to 8 px) round J that the entries fill completely.
function core(alphaOf, list, J) {
  let r = 0;
  for (let R = 0.25; R <= 8; R += 0.25) {
    for (let a = 0; a < 40; a++) {
      const P = [J[0] + R * Math.cos(a * Math.PI / 20), J[1] + R * Math.sin(a * Math.PI / 20)];
      if (!list.some((e) => covers(alphaOf, e, P))) return r;
    }
    r = R;
  }
  return r;
}
// The widest crack inside the disc (J, r): an empty point with drawing on both sides of it (across 8 directions, up to
// 8 px apart) measures the narrowest such span; a point at the silhouette's edge (drawing on one side only) is no crack.
// out: unit vector to the outer side of the bend (null = nearly straight: every side counts).
function crack(alphaOf, list, J, r, out = null) {
  const hit = (P) => list.some((e) => covers(alphaOf, e, P));
  const reach = (P, c, s) => { for (let d = 0.25; d <= 8; d += 0.25) if (hit([P[0] + c * d, P[1] + s * d])) return d; return Infinity; };
  let worst = 0;
  for (let R = 0; R <= r; R += 0.5) for (let a = 0; a < (R ? 24 : 1); a++) {
    const P = [J[0] + R * Math.cos(a * Math.PI / 12), J[1] + R * Math.sin(a * Math.PI / 12)];
    if (hit(P) || (out && (P[0] - J[0]) * out[0] + (P[1] - J[1]) * out[1] < 0)) continue;   // the inner crease is anatomy
    let w = Infinity;
    for (let k = 0; k < 8; k++) { const c = Math.cos(k * Math.PI / 8), s = Math.sin(k * Math.PI / 8); w = Math.min(w, reach(P, c, s) + reach(P, -c, -s)); }
    if (w < Infinity) worst = Math.max(worst, w);
  }
  return worst;
}

// The outer side of a bend at joint J (parent p, child entry e): away from the bisector of the directions to the parent's
// far end and to the child's; null when the limb is nearly straight (over 150 degrees open).
function outward(rig, by, e, p, J, alphaOf) {
  const unit = (v) => { const n = Math.hypot(v[0], v[1]); return n > 1e-6 ? [v[0] / n, v[1] / n] : null; };
  const toParent = unit(apply(by[p].base, rig.parts[p].pivot).map((v, i) => v - J[i]));
  const gc = Object.keys(rig.parts).find((c) => rig.parts[c].parent === e.name && !ITEM.has(c) && by[c]);
  const A = alphaOf(e.img), far = gc ? apply(e.base, rig.parts[gc].attach) : A && apply(e.m, [A.w / 2, A.h / 2]);
  const toChild = far && unit(far.map((v, i) => v - J[i]));
  if (!toParent || !toChild) return null;
  const cos = toParent[0] * toChild[0] + toParent[1] * toChild[1];
  if (cos < Math.cos(150 * D)) return null;
  const b = unit([toParent[0] + toChild[0], toParent[1] + toChild[1]]);
  return b && [-b[0], -b[1]];
}

export function flagsOf(cell, alphaOf) {
  const { rig, L } = cell, flags = [], marks = (cell.marks = []), drawn = L.filter((e) => e.m && !e.line), by = Object.fromEntries(drawn.map((e) => [e.name, e]));
  const carried = new Set(drawn.flatMap((e) => Object.keys(e.p?.swaps?.[e.swap]?.carry ?? {})));
  const rest = Object.fromEntries(layoutRig(rig, { ...channelsOf(rig) }, cell.swap, cell.held).filter((e) => e.m).map((e) => [e.name, e]));
  // seams: the filled core round each joint, at rest (parent + child) and as posed (anything drawn over it)
  for (const e of drawn) {
    const p = rig.parts[e.name]?.parent;
    if (!p || ITEM.has(e.name) || carried.has(e.name) || !by[p] || !rest[e.name] || !rest[p]) continue;
    const J0 = apply(rest[e.name].base, rig.parts[e.name].pivot), r0 = core(alphaOf, [rest[e.name], rest[p]], J0);
    if (r0 < 1) continue;   // the joint barely inside the drawings at rest: nothing to keep closed
    const J = apply(e.base, rig.parts[e.name].pivot), out = outward(rig, by, e, p, J, alphaOf), gap = crack(alphaOf, drawn, J, r0, out) * cell.k;
    if (gap > SEAM_PX) { flags.push(`seam ${p} / ${e.name}: ${gap.toFixed(1)} px`); marks.push(apply(cell.view, J)); }
  }
  const H = cell.view, height = ([x, y]) => H[1] * x + H[3] * y + H[5];
  const lowest = (e) => { const A = alphaOf(e.img); let lo = -Infinity; if (!A) return lo; for (let y = 0; y < A.h; y += 2) for (let x = 0; x < A.w; x += 2) if (A.alpha[y * A.w + x] > 127) lo = Math.max(lo, height(apply(e.m, [x + 0.5, y + 0.5]))); return lo; };
  if (cell.floor) for (const e of drawn) {
    const foot = /^foot-/.test(e.name) ? e.name : e.p?.swaps?.[e.swap]?.hide?.find((n) => n.startsWith('foot-'));
    if (!foot) continue;
    const want = floorLine(rig, foot) - Math.max(0, cell.joints[`${foot}.lift`] ?? 0), got = lowest(e);
    const at = apply(cell.view, apply(e.base, rig.parts[e.name].pivot));
    if (got > want + 0.75) { flags.push(`${foot} ${(got - want).toFixed(1)} px below its floor line`); marks.push(at); }
    else if (got < want - 0.75) { flags.push(`${foot} floating ${(want - got).toFixed(1)} px`); marks.push(at); }
  }
  if (cell.lying) {
    let lo = -Infinity;
    for (const e of drawn) if (/^(pelvis|torso|head|leg-|foot-)/.test(e.name)) lo = Math.max(lo, lowest(e));
    if (Math.abs(lo) > 0.75) flags.push(`lying body ${lo > 0 ? 'under' : 'over'} the floor by ${Math.abs(lo).toFixed(1)} px`);
  }
  if (cell.twoHand && by['hand-far']) {   // share of the far hand's pixels nothing drawn later covers
    const e = by['hand-far'], A = alphaOf(e.img), later = drawn.slice(drawn.indexOf(e) + 1);
    let n = 0, seen = 0;
    for (let y = 0; y < A.h; y += 3) for (let x = 0; x < A.w; x += 3) if (A.alpha[y * A.w + x] > 127) { n++; const P = apply(e.m, [x + 0.5, y + 0.5]); if (!later.some((o) => covers(alphaOf, o, P))) seen++; }
    if (n && seen / n < 0.3) flags.push(`far hand hidden on the two-hander (${Math.round(100 * seen / n)}% shows)`);
  }
  return flags;
}

// Screen matrix of each drawn entry in a cell (feet at 0,0), for drawing the strip.
export const drawList = (cell) => cell.L.filter((e) => e.m && !e.line).map((e) => ({ img: e.img, m: mul(cell.view, e.m) }));
export const floorLines = (cell) => ['foot-near', 'foot-far'].filter((n) => cell.rig.parts[n]).map((n) => ({ foot: n, y: floorLine(cell.rig, n) }));
