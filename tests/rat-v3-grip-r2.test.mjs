// T039 r2: rat v3 on the user's grip lines. A hand holding something turns so its line runs where the raider's item points
// (render/retarget.js itemTurn): the cutlass at rest and in the walk points as the raider's (1 deg); the round shield is
// strapped on hand-far-shield's line in guard and shield bash and, where the pose draws the raider's guard arm over the
// chest, v3's jointed far arm and the shield go over it too (rig.bandWith, render/rig-layout.js); a rig without bandWith
// lays out as before.
import assert from 'node:assert/strict';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { ITEMS } from '../src/data/items/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { rigFrame } from '../src/render/rig.js';
import { layoutRig } from '../src/render/rig-layout.js';
import V3 from '../src/data/rigs/rat-v3.js';
import * as LINES from '../src/data/rigs/rat-v3-grip-lines.js';

let fails = 0;
const check = (name, fn) => { try { fn(); console.log('ok  ', name); } catch (e) { fails++; console.log('FAIL', name, '\n   ', e.stack.split('\n').slice(0, 4).join('\n    ')); } };
const D = 180 / Math.PI, wrap = (d) => ((d + 540) % 360) - 180, def = FIGHTERS['rat-raider'];
const fighter = (key, mf) => {
  const m = key && def.rehearsal[key];
  return { def, state: m ? 'attack' : 'idle', move: m ?? null, moveKey: key, mf, t: mf, z: 0, vz: 0, facing: 1, id: 1, x: 0, y: 0, stun: 10,
    grab: { knee: -1 }, weapon: { def: ITEMS['rat-cutlass'], uses: 999, hit: false, broken: false }, ...(m?.strap ? { strap: { def: ITEMS[m.strap] } } : {}) };
};
const frame = (rig, f, t = 0) => { const mem = {}; rigFrame(f, rig, t - 1, mem); return rigFrame(f, rig, t, mem); };
const itemAngle = (F) => {
  const e = F.L.find((x) => x.name === F.held?.slot), A = F.held?.kit?.art, v = [A.gripEnd[0] - A.grip[0], A.gripEnd[1] - A.grip[1]];
  return Math.atan2(e.m[1] * v[0] + e.m[3] * v[1], e.m[0] * v[0] + e.m[2] * v[1]) * D;
};

check('the user\'s lines are the source', () => assert.equal(LINES.SOURCE, 'user'));

check('idle and walk: v3\'s cutlass points as the raider\'s (1 deg; round 1 on Art\'s lines ~90 off, the user\'s lines alone 8.7)', () => {
  for (const [state, ts] of [['idle', [0, 20, 40]], ['walk', [0, 10, 20, 30]]]) for (const t of ts) {
    const f = { ...fighter(null, 0), state, t };
    const a = itemAngle(frame(RIGS[def.art.rig], f, t)), b = itemAngle(frame(V3, f, t));
    assert.ok(Math.abs(wrap(a - b)) <= 1, `${state}@${t}: raider ${a.toFixed(1)}, v3 ${b.toFixed(1)}`);
  }
});

check('guard and shield bash: the shield is strapped on hand-far-shield and drawn over the torso with the far arm', () => {
  for (const [key, mfs] of [['guard', [10, 30]], ['shieldBash', [12, 20, 30]]]) for (const mf of mfs) {
    const F = frame(V3, fighter(key, mf)), by = (n) => F.L.find((e) => e.name === n);
    const sh = by('shield'), hand = by('hand-far'), torso = by('torso');
    assert.ok(sh?.m, `${key}@${mf}: the shield is drawn`);
    assert.equal(hand.swap, 'hand-far-shield', `${key}@${mf}`);
    assert.ok(sh.order > torso.order && hand.order > torso.order && by('arm-far-lower').order > torso.order, `${key}@${mf}: over the chest`);
    assert.ok(sh.order > hand.order, `${key}@${mf}: the shield rides its hand`);
  }
});

check('bandWith: only a rig that names it moves the follower; the raider lays out exactly as before', () => {
  const R = RIGS[def.art.rig], sw = { '@order.arm-far-upper': 805 };
  assert.equal(R.bandWith, undefined);
  const a = layoutRig(R, {}, sw).map((e) => [e.name, e.order]), b = layoutRig({ ...R, bandWith: {} }, {}, sw).map((e) => [e.name, e.order]);
  assert.deepEqual(a, b);
  const L = layoutRig(V3, {}, sw), o = (n) => L.find((e) => e.name === n).order;
  assert.equal(o('arm-far-lower'), 805 + V3.parts['arm-far-lower'].order - V3.parts['arm-far-upper'].order);
  assert.equal(o('hand-far'), 805 + V3.parts['hand-far'].order - V3.parts['arm-far-upper'].order);
  const L0 = layoutRig(V3, {}, {}), o0 = (n) => L0.find((e) => e.name === n).order;
  assert.equal(o0('hand-far'), V3.parts['hand-far'].order);   // no band override: its own
});

console.log(fails ? `${fails} failed` : 'all passed');
process.exit(fails ? 1 : 0);
