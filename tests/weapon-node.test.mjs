// T025 weapon node (render/weapon-node.js): a pose without `weapon` or a grip mode gets exactly the old frame; placing
// the node where the fist already holds it changes nothing; a placement lands where the pose says (grip and handle
// angle); out of reach the weapon follows the hand (still held); the grip hand copies the weapon's rotation; overhand puts
// the fist drawing over the shaft and underhand under it; reverse turns the head out of the other end of the fist;
// weapon placement blends between poses; the grip-hand overlay band; items declare tip, grip2 (two-handers) and stow.
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { ITEMS } from '../src/data/items/index.js';
import { targetPose, channelsOf } from '../src/render/rig-pose.js';
import { heldOf } from '../src/render/rig.js';
import { layoutRig } from '../src/render/rig-layout.js';
import { gripLayout } from '../src/render/rig-grip.js';
import { nodeOf } from '../src/render/weapon-node.js';
import HULLS from '../src/data/rigs/hulls.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const lin = (m, [x, y]) => [m[0] * x + m[2] * y, m[1] * x + m[3] * y];
const deg = ([x, y]) => Math.atan2(y, x) * 180 / Math.PI;
const wrap = (d) => ((d + 540) % 360) - 180;
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const D = Math.PI / 180;
const same = (A, B) => A.length === B.length && A.every((e, i) => e.name === B[i].name && e.order === B[i].order && e.img === B[i].img && (!e.m || e.m.every((v, k) => Math.abs(v - B[i].m[k]) < 1e-6)));

const fighter = (id, item, o = {}) => ({ def: FIGHTERS[id], state: 'idle', t: 0, mf: 0, move: null, hp: 10, weapon: item ? { def: ITEMS[item], uses: 5, hit: false, broken: false } : null, ...o });
const CASES = [['rat-spearman', null], ['rat-raider', null], ['rat-archer', null], ['mouse-fighter', null], ['mouse-fighter', 'rat-cutlass'], ['mouse-fighter', 'big-fish']];
// one frame: joints/swaps from the pose, extra joints laid over them. T026: the spearman's own poses place his spear and
// hold it overhand (rig.holds); these checks start from the unplaced side grip (NONE), checked on its own below.
const NONE = { 'weapon.at': 0, 'weapon.turn': 0 };
function frame(id, item, extra = {}, force, o) {
  const f = fighter(id, item, o), rig = RIGS[f.def.art.rig], tp = targetPose(f, rig, 0), held = heldOf(f, rig);
  force = { grip: 'side', ...force };
  const j = { ...tp.joints, ...NONE, ...extra }, L = gripLayout(rig, j, tp.swap, held, f, force);
  const N = nodeOf(rig, held), by = (n) => L.find((e) => e.name === n);
  const W = by(N.slot), H = by(N.hand), A = N.art;
  return { rig, held, N, L, tp, j, f, grip: apply(W.m, A.grip), handle: deg(lin(W.m, [A.gripEnd[0] - A.grip[0], A.gripEnd[1] - A.grip[1]])),
    slot: H && apply(H.base, N.at), axis: H && deg(lin(H.base, [Math.cos(N.axis * D), Math.sin(N.axis * D)])), H, W };
}

for (const [id, item] of CASES) {
  const name = `${id}${item ? ` + ${item}` : ''}`;
  // 1. no node channels, side grip: the old frame (a layout with the weapon riding the hand)
  const a = frame(id, item), placed = targetPose(fighter(id, item), RIGS[FIGHTERS[id].art.rig], 0).joints;
  check(id === 'rat-spearman' ? placed['weapon.at'] === 1 && placed['weapon.turn'] === 1 : placed['weapon.at'] === 0 && placed['weapon.turn'] === 0,
    `${name}: ${id === 'rat-spearman' ? 'his stance places the spear (T026)' : 'no pose places the weapon yet (channels 0)'}`);
  // 2. the node placed exactly where the fist holds it: same frame
  const sx = a.j.sx ?? 1, x = (a.grip[0] - (a.j.dx ?? 0)) / sx, y = a.grip[1] - (a.j.dy ?? 0);
  const b = frame(id, item, { 'weapon.at': 1, 'weapon.turn': 1, 'weapon.x': x, 'weapon.y': y, 'weapon.rot': a.handle });
  // (the hand lines up with the weapon exactly; T020 held some poses up to 2 deg off the fist's axis: < 0.5 px)
  const moved = Math.max(...a.L.filter((e) => e.m).map((e, i) => Math.hypot(e.m[4] - b.L[i].m[4], e.m[5] - b.L[i].m[5])));
  check(a.L.every((e, i) => e.name === b.L[i].name && e.order === b.L[i].order) && moved < 0.5, `${name}: the node at the fist's own placement = the old frame (${moved.toFixed(3)} px)`);
  // 3. moved a little and turned: the grip lands there and the handle points there, the hand's slot on it, axis along it
  const up = a.rig.parts[a.rig.parts[a.N.hand].parent].parent, S = apply(a.L.find((e) => e.name === up).base, a.rig.parts[up].pivot);
  const k = 4 / dist(S, a.grip), T = [a.grip[0] + (S[0] - a.grip[0]) * k, a.grip[1] + (S[1] - a.grip[1]) * k];   // 4 px toward the shoulder: in reach
  const c = frame(id, item, { 'weapon.at': 1, 'weapon.turn': 1, 'weapon.x': (T[0] - (a.j.dx ?? 0)) / sx, 'weapon.y': T[1] - (a.j.dy ?? 0), 'weapon.rot': a.handle + 10 });
  check(dist(c.grip, T) < 0.05 && Math.abs(wrap(c.handle - a.handle - 10)) < 0.05, `${name}: weapon placed by the pose (${dist(c.grip, T).toFixed(2)} px off)`);
  check(dist(c.slot, c.grip) < 0.05, `${name}: fist on the grip (${dist(c.slot, c.grip).toFixed(2)} px)`);
  // 4. the hand copies the weapon's rotation: turned 15 with it
  check(Math.abs(wrap(c.axis - c.handle) - wrap(b.axis - b.handle)) < 0.05 && Math.abs(wrap(c.axis - b.axis - 10)) < 0.05, `${name}: grip hand turned with the weapon (${wrap(c.axis - b.axis).toFixed(2)} deg)`);
  // 5. out of reach: the weapon comes back to the hand
  const d = frame(id, item, { 'weapon.at': 1, 'weapon.x': x + 90, 'weapon.y': y - 90 });
  check(dist(d.slot, d.grip) < 0.05 && dist(d.grip, [x + 90, y - 90]) > 20, `${name}: out of reach the weapon follows the fist (${dist(d.slot, d.grip).toFixed(2)} px)`);
  // 6. reverse: the head comes out of the other end of the fist (slot axis against the handle). T028 r4: a rig on the
  // user's grip lines has no reverse or underhand drawing, so those modes hold as the side grip does
  const r = frame(id, item, {}, { grip: 'reverse' });
  if (a.rig.gripLines) {
    for (const mode of ['reverse', 'underhand']) check(same(frame(id, item, {}, { grip: mode }).L, a.L), `${name}: ${mode} (no drawing of its own) = the side grip`);
  } else check(Math.abs(wrap(r.axis - r.handle)) > 179.9 && Math.abs(wrap(b.axis - b.handle)) < 0.01, `${name}: reverse turns the head out of the fist's other end`);
  // 7. overhand: the fist drawing's middle over the shaft line; underhand under it
  // T028 r4: on the user's lines overhand puts on the overhand drawing as drawn on its line (tests/grip-align.test.mjs)
  if (a.rig.gripLines) check(frame(id, item, {}, { grip: 'overhand' }).H.swap?.endsWith('-overhand'), `${name}: overhand puts on the overhand drawing`);
  else for (const mode of ['overhand', 'underhand']) {
    const m = frame(id, item, {}, { grip: mode }), u = [Math.cos(m.handle * D), Math.sin(m.handle * D)], up = u[0] >= 0 ? [u[1], -u[0]] : [-u[1], u[0]];
    const hull = HULLS[m.H.img], mid = hull.reduce((p, q) => [p[0] + q[0] / hull.length, p[1] + q[1] / hull.length], [0, 0]), c2 = apply(m.H.m, mid);
    const h = (c2[0] - m.grip[0]) * up[0] + (c2[1] - m.grip[1]) * up[1];
    check(mode === 'overhand' ? h > 0 : h < 0, `${name}: ${mode} fist ${mode === 'overhand' ? 'over' : 'under'} the shaft (${h.toFixed(1)} px)`);
  }
}

// 8. blending: the weapon channels are plain numbers every rig carries (weights 0 when a pose leaves them out)
{
  const C = channelsOf(RIGS['rat-spearman']);
  check(['weapon.x', 'weapon.y', 'weapon.rot', 'weapon.at', 'weapon.turn'].every((k) => C[k] === 0), 'weapon channels default to 0 (no placement)');
  const rig = { ...RIGS['rat-spearman'], poses: { ...RIGS['rat-spearman'].poses, idle: { ...RIGS['rat-spearman'].poses.idle, weapon: { x: -5, y: -60, rot: 10 }, grip: 'overhand' } } };
  const tp = targetPose(fighter('rat-spearman'), rig, 0);
  check(tp.joints['weapon.x'] === -5 && tp.joints['weapon.at'] === 1 && tp.joints['weapon.turn'] === 1 && tp.swap['@grip'] === 'overhand', 'a pose\'s weapon and grip become channels and a mode');
}

// 9. overlay band: a grip hand ordered under its weapon is drawn over it
{
  const base = RIGS['rat-spearman'], G = base.grips['two-hand'];
  const rig = { ...base, grips: { ...base.grips, 'two-hand': { ...G, order: { 'hand-far': 100 } } } };
  const f = fighter('rat-spearman'), tp = targetPose(f, rig, 0), L = gripLayout(rig, tp.joints, tp.swap, heldOf(f, rig), f);
  const far = L.find((e) => e.name === 'hand-far'), spear = L.find((e) => e.name === 'held');
  check(far.order > spear.order, `far fist lifted over the shaft (${far.order} vs ${spear.order})`);
}

// 10. items: business end `tip`, two-handers' `grip2`, and a `stow` anchor on every weapon
for (const K of Object.values(ITEMS).filter((k) => k.kind === 'weapon' || k.id === 'mouse-sword')) {
  check(K.art.tip || K.art.tips, `${K.id}: tip`);
  check(['hip', 'back'].includes(K.art.stow), `${K.id}: stow anchor (hip / back)`);
  if (K.grip === 'two-hand') check(K.art.grip2, `${K.id}: grip2`);
}
// the layout without any grip is untouched by the node (unarmed)
{
  const f = fighter('rat-raider'), rig = RIGS['rat-raider'], tp = targetPose(f, rig, 0);
  check(same(gripLayout(rig, tp.joints, tp.swap, null, f), layoutRig(rig, tp.joints, tp.swap, null)), 'no held item: plain layout');
}

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
