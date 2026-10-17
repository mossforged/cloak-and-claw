// T020: weapons held right. In every rat pose (and the mouse with each floor weapon) the held weapon's handle axis
// (art grip -> gripEnd) runs along the grip hand's slot axis (rig.axes) on screen; the spearman's near fist is on `grip`
// and his far fist on the shaft (at `grip2`, sliding back only where out of reach), closed round the shaft (its ring axis along it) and drawn above the spear; the archer's
// pinch hand reaches the drawn string, which full draw brings to the jaw anchor, with the arrow sticking out past the
// bow; the A012 near pinch drawing is used (no borrowed far hand); weapons with `floor` lie flat on the floor.
// T025: the hold matrix (bodies x items x grip modes x every frame, tools/bench/hold.js) has no hold flags.
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { ITEMS } from '../src/data/items/index.js';
import { targetPose } from '../src/render/rig-pose.js';
import { heldOf, layoutRig } from '../src/render/rig.js';
import { gripLayout, at } from '../src/render/rig-grip.js';
import { movesOf } from '../src/sim/weapons.js';
import { HOLDERS, holdFrames, holdFrame } from '../tools/bench/hold.js';
import { GRIP_MODE_NAMES } from '../src/data/grip-modes.js';
import { SPEAR_HOLDS, withSpearHold } from '../src/data/rigs/rat-spearman-holds.js';

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

// T023: the mouse's own sword (a gear item in his grip fist) and every floor weapon: the handle runs along the slot of
// the fist holding it, in every pose (the whole raised arm's fist has its own slot axis, A013 slotDirection), and the
// test poses (cast, toss, grab, stow) too.
{
  const def = FIGHTERS['mouse-fighter'], rig = RIGS[def.art.rig];
  const named = ['cast', 'grabbing', 'knee', 'throwWind', 'throwRelease', 'toss', 'stow', 'block'];
  for (const K of [ITEMS['mouse-sword'], ...Object.values(ITEMS).filter((k) => k.grip === 'one-hand' && k.kind === 'weapon')]) {
    const weapon = K.kind === 'weapon' ? { def: K, uses: 5, hit: false, broken: false } : null;
    let worst = 0, where = '';
    const list = [...poses(def, weapon), ...named.map((n) => [n, { def, state: 'idle', t: 0, mf: 0, move: null, weapon, hp: 10, override: n }])];
    for (const [label, fi] of list) {
      const tp = targetPose(fi, rig, 0, fi.override), L = gripLayout(rig, tp.joints, tp.swap, heldOf(fi, rig), fi);
      if (tp.joints['sword.sx'] !== 1 || tp.joints['sword.sy'] !== 1) continue;   // the spin's foreshortened blade (slash2 / fish slap) skews on purpose
      const raised = !!tp.swap['arm-near-upper'], RA = raised && rig.parts['arm-near-upper'].swaps[tp.swap['arm-near-upper']];   // a whole-arm drawing (raised; T024 cocked)
      const fist = L.find((e) => e.name === (raised ? 'arm-near-upper' : 'hand-near')), sw = L.find((e) => e.name === 'sword');
      const ax = (raised ? RA.axis : rig.axes['one-hand']) * D, m = raised ? fist.m : fist.base;
      const e = Math.abs(wrap(deg(lin(sw.m, [K.art.gripEnd[0] - K.art.grip[0], K.art.gripEnd[1] - K.art.grip[1]])) - deg(lin(m, [Math.cos(ax), Math.sin(ax)]))));
      const gap = dist(apply(sw.m, sw.p.pivot), raised ? apply(m, RA.grip) : at(rig, L, 'hand-near', rig.hands['hand-near-grip'].at));
      if (e > worst) { worst = e; where = label; }
      if (gap > 0.01) { worst = Math.max(worst, 99); where = `${label} (grip ${gap.toFixed(2)} px off the slot)`; }
    }
    check(worst < 2, `mouse: ${K.id} handle along his fist's slot, grip on it (worst ${worst.toFixed(2)} deg, ${where})`);
  }
}

// Raider (T020 r4): the cutlass flipped across its handle while holding (idle, walk, hurt), as drawn in the swing.
{
  const def = FIGHTERS['rat-raider'], rig = RIGS['rat-raider'], m = def.moves.ratSlash;
  const flipped = (o) => { const h = heldOf({ def, state: 'idle', t: 0, mf: 0, move: null, weapon: null, hp: 10, ...o }, rig); return Array.isArray(h.part.scale) && h.part.scale[1] < 0; };
  check(flipped({}) && flipped({ state: 'walk' }) && flipped({ state: 'hurt' }), 'raider: cutlass flipped while holding');
  check(!flipped({ state: 'attack', move: m, moveKey: 'ratSlash', mf: 0 }) && !flipped({ state: 'attack', move: m, moveKey: 'ratSlash', mf: m.windup + 2 }), 'raider: cutlass as drawn while swinging');
}

// Spearman: both fists on the shaft line, far fist closed round it and over it.
{
  const def = FIGHTERS['rat-spearman'], rig = RIGS['rat-spearman'], K = ITEMS['rat-spear'], G = rig.grips['two-hand'];
  for (const [label, fi] of poses(def, null)) {
    const L = layoutOf(rig, fi), spear = L.find((e) => e.name === 'held'), far = L.find((e) => e.name === 'hand-far'), near = L.find((e) => e.name === 'hand-near');
    const dn = dist(apply(spear.m, K.art.grip), apply(near.base, rig.slots['two-hand'].attach));
    // far fist: on the shaft line, at grip2 standing; elsewhere it may slide back toward the near fist (out of reach)
    const ring = apply(far.base, G.ik.hand), g1 = apply(spear.m, K.art.grip), g2 = apply(spear.m, K.art.grip2);
    const u = [(g2[0] - g1[0]) / dist(g1, g2), (g2[1] - g1[1]) / dist(g1, g2)], rel = [ring[0] - g1[0], ring[1] - g1[1]];
    const off = Math.abs(rel[0] * u[1] - rel[1] * u[0]), along = rel[0] * u[0] + rel[1] * u[1], slid = dist(g1, g2) - along;
    check(dn < 0.01 && off < 1.5 && slid > -1.5 && along > 15, `spearman ${label}: near fist on grip (${dn.toFixed(2)} px), far fist on the shaft (${off.toFixed(2)} px off, ${slid.toFixed(1)} px short of grip2)`);
    if (label === 'idle') check(slid < 1.5, `spearman ${label}: far fist reaches out to grip2 (${slid.toFixed(1)} px short)`);
    const shaft = deg(lin(spear.m, [0, -1])), fist = deg(lin(far.base, [Math.cos(G.align * D), Math.sin(G.align * D)]));
    const e = Math.abs(wrap(shaft - fist)), e2 = Math.min(e, 180 - e);
    check(e2 < 3, `spearman ${label}: far fist closed round the shaft (${e2.toFixed(1)} deg off)`);
    check(far.order > spear.order && near.order > spear.order, `spearman ${label}: both fists drawn over the spear`);
  }
  check(!Object.values(rig.poses).some((p) => p?.['hand-far.order']), 'spearman: far fist order comes from the grip, not poses');
}

// Archer: the pinch hand reaches the drawn string; full draw = the string at the jaw anchor; the arrow past the bow.
{
  const def = FIGHTERS['rat-archer'], rig = RIGS['rat-archer'], K = ITEMS['rat-bow'], G = rig.grips.bow, m = def.moves.bowShot;
  check(rig.parts['hand-near'].swaps['hand-near-pinch'].img.endsWith('hand-near-pinch.png'), 'archer: A012 near pinch drawing (not the borrowed far hand)');
  for (const mf of [Math.round(m.windup * 0.5), m.windup - 1]) {
    const fi = { def, state: 'attack', t: 0, mf, move: m, moveKey: 'bowShot', weapon: null, hp: 10 }, L = layoutOf(rig, fi);
    const near = L.find((e) => e.name === 'hand-near'), N = L.find((e) => e.line).line[1];
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

// T025 grip test: every item on every body that can hold it, in every grip mode, in every state and move frame, drawn
// through rigFrame: no hold flags (handle off the fist over 2 px, second fist off the shaft, a grip hand under the weapon);
// the spearman's overhand variants (?spear=B|C|D) too.
for (const [body, list] of Object.entries(HOLDERS)) {
  for (const [id, item] of list) for (const mode of GRIP_MODE_NAMES) {
    const bad = [];
    for (const [label, f] of holdFrames(id, item, true)) for (const x of holdFrame(f, { grip: mode }).flags) bad.push(`${label}: ${x.text}`);
    check(!bad.length, `${body} ${id} ${item ?? 'own'} ${mode}: no hold flags (${bad.slice(0, 3).join('; ')}${bad.length > 3 ? ` +${bad.length - 3}` : ''})`);
  }
}
{
  const base = RIGS['rat-spearman'];
  for (const k of Object.keys(SPEAR_HOLDS)) {
    RIGS['rat-spearman'] = withSpearHold(base, k);
    const bad = [];
    for (const [label, f] of holdFrames('rat-spearman', null, true)) for (const x of holdFrame(f).flags) bad.push(`${label}: ${x.text}`);
    check(!bad.length, `spearman hold ${k}: no hold flags (${bad.slice(0, 3).join('; ')})`);
  }
  RIGS['rat-spearman'] = base;
}

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
