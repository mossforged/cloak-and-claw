// T029 r2: A021's items in the rehearsal moves. The shield on the far hand's strap (render/strap.js): hung on the strap
// drawing's grip line, its line along the hand's, drawn over the hand, and over the guard arm that carries it in front of
// the chest; the rig without a strap unchanged. Views change on keys (render/rig-pose.js): a list of through keys shows the
// last key reached. The viewer puts each move's own item in his hand; the dagger throw flies a spinning shot.
import { RIGS } from '../src/data/rigs/index.js';
import { ITEMS } from '../src/data/items/index.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { strapRig, strapOf } from '../src/render/strap.js';
import { layoutRig, apply } from '../src/render/rig-layout.js';
import { channelsOf, targetPose } from '../src/render/rig-pose.js';
import { rigFrame } from '../src/render/rig.js';
import { createSlot } from '../src/viewer/sandbox.js';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const D = 180 / Math.PI, wrap = (d) => ((d + 540) % 360) - 180;
const lin = (m, v) => [m[0] * v[0] + m[2] * v[1], m[1] * v[0] + m[3] * v[1]];
const ang = (v) => Math.atan2(v[1], v[0]) * D;

const rat = RIGS['rat-raider'], shield = ITEMS['a021-shield'], S = strapRig(rat, shield);
check(strapRig(rat, null) === rat && strapRig(rat, shield) === S, 'no strap: the rig itself; one strap rig per item (memoized)');
check(!rat.parts.shield && S.parts.shield?.parent === 'hand-far', 'the strap rig hangs the shield on the far hand; the rig is untouched');
{
  const L = layoutRig(S, channelsOf(S), {}), by = Object.fromEntries(L.map((e) => [e.name, e]));
  const H = S.hands['hand-far-shield'], A = S.itemLines['a021-shield'];
  check(by['hand-far'].swap === 'hand-far-shield', 'the far hand shows the strap drawing');
  const P = apply(by['hand-far'].base, ...H.at), G = apply(by.shield.m, ...A.grip);
  check(Math.hypot(P[0] - G[0], P[1] - G[1]) < 1e-6, 'the shield\'s strap point sits on the hand\'s grip centre (the user\'s lines)');
  const da = wrap(ang(lin(by.shield.m, [A.gripEnd[0] - A.grip[0], A.gripEnd[1] - A.grip[1]])) - ang(lin(by['hand-far'].base, [Math.cos(H.axis / D), Math.sin(H.axis / D)])));
  check(Math.abs(da) < 1e-6, 'the shield\'s line runs along the hand\'s');
  check(by.shield.order > by['hand-far'].order && by.shield.order > by['arm-far-lower'].order, 'the shield draws over the far hand and forearm');
}
// the block: the guard arm (in front of the chest) carries it, and it stays over that arm after the grip bands
{
  const f = { def: FIGHTERS['rat-raider'], state: 'attack', t: 9, mf: 9, move: FIGHTERS['rat-raider'].rehearsal.guard, moveKey: 'guard', z: 0, vz: 0, facing: 1, id: 1, x: 0, y: 0,
    grab: { knee: -1 }, strap: { def: shield } };
  check(strapOf(f) === shield, 'strapOf: the fighter\'s strap');
  const L = rigFrame(f, rat, 0, {}).L, arm = L.find((e) => e.name === 'arm-far-upper'), sh = L.find((e) => e.name === 'shield');
  check(arm?.swap === 'arm-far-guard' && sh?.p.parent === 'arm-far-upper', 'block: the guard arm carries the shield');
  check(sh && arm && sh.order > arm.order && sh.order > L.find((e) => e.name === 'torso').order, 'block: the shield over the guard arm, in front of the chest');
}
// views on keys: the spin's back view shows from its key, not before
{
  const def = FIGHTERS['rat-raider'], M = def.rehearsal.spin, T = rat.poses.timing;
  const at = (s) => targetPose({ def, state: 'attack', move: M, moveKey: 'spin', mf: M.windup + s * T.strikeIn * M.active, t: 0 }, rat, 0).swap['@view.torso'];
  check(at(0.6) === 'S' && at(2 / 3 + 0.01) === 'B' && at(1) === 'F', 'spin: side until the back key, back from it, front on the strike');
}
// the viewer: each rehearsal move's own item in hand, the dagger throw's shot spins
for (const [f, anim, item, strap] of [['rat-raider', 'daggerStab', 'a021-dagger'], ['rat-raider', 'overheadChop', 'a021-axe'], ['rat-spearman', 'staffOverhead', 'a021-staff'], ['rat-raider', 'shieldBash', 'rat-cutlass', 'a021-shield']]) {
  const slot = createSlot(), sb = slot.load({ f, v: 'current', anim, item: 'own', grip: '', look: {}, gear: null }), fr = rigFrame(sb.hero, sb.rig, 0, {});
  check(fr.held?.kit.id === item && (sb.hero.strap?.def.id ?? undefined) === strap, `${f} ${anim}: holds ${item}${strap ? ` and ${strap} on the strap` : ''}`);
}
check(FIGHTERS['rat-raider'].rehearsal.daggerThrow.shot?.art.spin > 0, 'dagger throw: a spinning shot');

console.log(failed ? `${failed} failures` : 'items-a021: all checks passed');
process.exit(failed ? 1 : 0);
