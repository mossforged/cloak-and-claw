// T020: weapons held right. In every rat pose (and the mouse with each floor weapon) the held weapon's handle axis
// (art grip -> gripEnd) runs along the grip hand's slot axis (rig.axes) on screen; the spearman's near fist is on `grip`
// and his far fist on `grip2`, closed round the shaft (its ring axis along it) and drawn above the spear; the archer's
// pinch hand reaches the drawn string, which full draw brings to the jaw anchor, with the arrow sticking out past the
// bow; the A012 near pinch drawing is used (no borrowed far hand); weapons with `floor` lie flat on the floor.
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { ITEMS } from '../src/data/items/index.js';
import { targetPose } from '../src/render/rig-pose.js';
import { heldOf, layoutRig } from '../src/render/rig.js';
import { gripLayout, at } from '../src/render/rig-grip.js';
import { movesOf } from '../src/sim/weapons.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const lin = (m, [x, y]) => [m[0] * x + m[2] * y, m[1] * x + m[3] * y];
const deg = ([x, y]) => Math.atan2(y, x) * 180 / Math.PI;
const wrap = (d) => ((d + 540) % 360) - 180;
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const D = Math.PI / 180;

// Every state and every move's windup / strike / recovery frame a fighter can be drawn in.
function poses(def, weapon) {
  const f = (o) => ({ def, state: 'idle', t: 0, mf: 0, move: null, weapon, hp: 10, ...o });
  const out = ['idle', 'walk', 'jump', 'hurt', 'getup'].map((s) => [s, f({ state: s, stun: 20 })]);
  for (const [k, m] of Object.entries(weapon ? movesOf({ weapon }) : def.moves)) {
    for (const mf of [0, m.windup - 1, m.windup + m.active - 1, m.windup + m.active + Math.floor(m.recovery / 2)]) out.push([`${k}@${mf}`, f({ state: m.air ? 'jump' : 'attack', move: m, moveKey: k, mf })]);
  }
  return out;
}
function layoutOf(rig, fi) { const tp = targetPose(fi, rig, 0); return gripLayout(rig, tp.joints, tp.swap, heldOf(fi, rig), fi); }

// Handle axis vs slot axis on screen, for a held item (parts named per slot type).
function axisError(rig, L, K) {
  const spec = rig.slots[K.grip], held = L.find((e) => e.name === 'held');
  const parent = L.find((e) => e.name === spec.parent);   // rats: the grip hand (rest 0, so its drawing's frame = its bone)
  const handle = lin(held.m, [K.art.gripEnd[0] - K.art.grip[0], K.art.gripEnd[1] - K.art.grip[1]]);
  const a = rig.axes[K.grip] * D, slot = lin(parent.base, [Math.cos(a), Math.sin(a)]);
  return Math.abs(wrap(deg(handle) - deg(slot)));
}

for (const id of ['rat-raider', 'rat-spearman', 'rat-archer']) {
  const def = FIGHTERS[id], rig = RIGS[def.art.rig], K = ITEMS[def.kit ?? def.art.held];
  check(rig.axes?.[K.grip] != null && K.art.gripEnd, `${id}: slot axis for ${K.grip} and the item's handle axis exist`);
  let worst = 0, where = '';
  for (const [label, fi] of poses(def, null)) {
    const e = axisError(rig, layoutOf(rig, fi), K);
    if (e > worst) { worst = e; where = label; }
  }
  check(worst < 2, `${id}: ${K.id} handle along the fist's slot in every pose (worst ${worst.toFixed(2)} deg, ${where})`);
}

// The mouse with each floor weapon: its handle where his own sword's handle is (146.4 deg in sword.png, the drawing
// his fist was made round), in the same pose.
{
  const def = FIGHTERS['mouse-fighter'], rig = RIGS[def.art.rig], SWORD = 146.4 * D;
  for (const K of Object.values(ITEMS).filter((k) => k.grip === 'one-hand')) {
    let worst = 0, where = '';
    for (const [label, fi] of poses(def, { def: K, uses: 5, hit: false, broken: false })) {
      const tp = targetPose(fi, rig, 0), held = gripLayout(rig, tp.joints, tp.swap, heldOf(fi, rig), fi).find((e) => e.name === 'sword');
      const own = layoutRig(rig, tp.joints, tp.swap).find((e) => e.name === 'sword');
      const e = Math.abs(wrap(deg(lin(held.m, [K.art.gripEnd[0] - K.art.grip[0], K.art.gripEnd[1] - K.art.grip[1]])) - deg(lin(own.m, [Math.cos(SWORD), Math.sin(SWORD)]))));
      if (e > worst) { worst = e; where = label; }
    }
    check(worst < 2, `mouse: ${K.id} handle along his fist (worst ${worst.toFixed(2)} deg, ${where})`);
  }
}

// Spearman: both fists on the shaft line, far fist closed round it and over it.
{
  const def = FIGHTERS['rat-spearman'], rig = RIGS['rat-spearman'], K = ITEMS['rat-spear'], G = rig.grips['two-hand'];
  for (const [label, fi] of poses(def, null)) {
    const L = layoutOf(rig, fi), spear = L.find((e) => e.name === 'held'), far = L.find((e) => e.name === 'hand-back'), near = L.find((e) => e.name === 'hand-front');
    const dn = dist(apply(spear.m, K.art.grip), apply(near.base, rig.slots['two-hand'].attach));
    const df = dist(apply(spear.m, K.art.grip2), apply(far.base, G.ik.hand));
    check(dn < 0.01 && df < 2, `spearman ${label}: near fist on grip (${dn.toFixed(2)} px), far fist on grip2 (${df.toFixed(2)} px)`);
    const shaft = deg(lin(spear.m, [0, -1])), ring = deg(lin(far.base, [Math.cos(G.align * D), Math.sin(G.align * D)]));
    const e = Math.abs(wrap(shaft - ring)), e2 = Math.min(e, 180 - e);
    check(e2 < 3, `spearman ${label}: far fist closed round the shaft (${e2.toFixed(1)} deg off)`);
    check(far.order > spear.order && near.order > spear.order, `spearman ${label}: both fists drawn over the spear`);
  }
  check(!Object.values(rig.poses).some((p) => p?.['hand-back.order']), 'spearman: far fist order comes from the grip, not poses');
}

// Archer: the pinch hand reaches the drawn string; full draw = the string at the jaw anchor; the arrow past the bow.
{
  const def = FIGHTERS['rat-archer'], rig = RIGS['rat-archer'], K = ITEMS['rat-bow'], G = rig.grips.bow, m = def.moves.bowShot;
  check(rig.parts['hand-front'].swaps['hand-front-pinch'].img.endsWith('hand-front-pinch.png'), 'archer: A012 near pinch drawing (not the borrowed far hand)');
  for (const mf of [Math.round(m.windup * 0.5), m.windup - 1]) {
    const fi = { def, state: 'attack', t: 0, mf, move: m, moveKey: 'bowShot', weapon: null, hp: 10 }, L = layoutOf(rig, fi);
    const near = L.find((e) => e.name === 'hand-front'), N = L.find((e) => e.line).line[1];
    const d = dist(apply(near.base, G.ik.hand), N);
    check(d < 1.5, `archer draw @${mf}: pinch on the string (${d.toFixed(2)} px off)`);
    if (mf !== m.windup - 1) continue;
    const ear = at(rig, L, G.anchor.part, G.anchor.at), bow = L.find((e) => e.name === 'held');
    check(dist(N, ear) < 4, `archer full draw: string at the jaw (${dist(N, ear).toFixed(1)} px off)`);
    const pull = dist(N, apply(bow.m, K.art.nock));
    check(pull > 30, `archer full draw: a deep draw (${pull.toFixed(0)} px back)`);
    const S = m.shot.art, arrow = L.find((e) => e.name === 'arrow'), tip = apply(arrow.m, S.tip), grip = apply(bow.m, K.art.grip);
    check(tip[0] > grip[0] + 10, `archer full draw: arrow head past the bow (${(tip[0] - grip[0]).toFixed(0)} px)`);
    check(Math.abs(wrap(deg(lin(arrow.m, [1, 0])))) < 5, 'archer full draw: arrow level, pointing forward');
  }
}

// Floor: spear and bow lie flat (turned by `floor`); others unchanged.
for (const K of Object.values(ITEMS).filter((k) => k.kind === 'weapon')) {
  const upright = ['rat-spear', 'rat-bow'].includes(K.id);
  check(upright ? K.art.floor === 90 : !K.art.floor, `${K.id}: lies flat on the floor`);
}

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
