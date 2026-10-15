// Rat rigs (T011): raider / spearman / archer share the A004+A005 body. Feet on the floor in the crouch and in move
// poses, walk doesn't skate, every pose finite; the kit sits in the hands: spear on the near fist with the far fist IK'd
// onto the shaft (point a little up), bow in the far fist with the near hand on the string (drawn back at full draw).
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { ITEMS } from '../src/data/items/index.js';
import { targetPose, jointsOfRig } from '../src/render/rig-pose.js';
import { heldOf, layoutRig } from '../src/render/rig.js';
import { gripLayout } from '../src/render/rig-grip.js';
import { readFileSync } from 'node:fs';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

for (const id of ['rat-raider', 'rat-spearman', 'rat-archer']) {
  const def = FIGHTERS[id], rig = RIGS[def.art.rig], P = rig.poses;
  const fighter = (o) => ({ def, state: 'idle', t: 0, mf: 0, move: null, weapon: null, ...o });
  const lay = (f) => { const tp = targetPose(f, rig, 0); return gripLayout(rig, tp.joints, tp.swap, heldOf(f, rig), f); };
  const sole = (L, leg) => { const p = rig.parts[leg]; return apply(L.find((e) => e.name === leg).m, [p.pivot[0], readFileSync(p.img).readUInt32BE(20) - 3]); };
  const feet = (L) => ['leg-front-lower', 'leg-back-lower'].map((l) => sole(L, l)[1]);

  for (const state of ['idle', 'walk', 'hurt', 'knockdown', 'down', 'getup']) {
    const r = targetPose(fighter({ state, t: 7 }), rig, 1.3);
    check(Object.values(r.joints).every(Number.isFinite) && Object.keys(r.joints).every((j) => jointsOfRig(rig).includes(j)), `${id} ${state}: finite rig joints`);
    check(lay(fighter({ state, t: 7 })).every((e) => (e.m ?? e.line.flat()).every(Number.isFinite)), `${id} ${state}: layout finite`);
  }

  // crouch stance and ground moves: both soles on the floor
  const S = feet(lay(fighter({})));
  check(S.every((y) => Math.abs(y) < 3), `${id} stance: soles on the floor (${S.map((y) => y.toFixed(1))})`);
  for (const [key, m] of Object.entries(def.moves)) for (const mf of [m.windup, m.windup + m.active - 1]) {
    const y = feet(lay(fighter({ state: 'attack', move: m, moveKey: key, mf })));
    check(y.every((v) => Math.abs(v) < 4), `${id} ${key}@${mf}: soles on the floor (${y.map((v) => v.toFixed(1))})`);
  }

  // walk: feet don't sink and the planted foot sweeps back as far as the body moves (same rule as the mouse rig)
  const need = def.move.walk * 60 / P.walk.speed / 2;
  for (const leg of ['leg-front-lower', 'leg-back-lower']) {
    let lo = Infinity, hi = -Infinity, deepest = -Infinity;
    for (let i = 0; i < 60; i++) {
      const [x, y] = sole(lay(fighter({ state: 'walk', t: i / P.walk.speed })), leg);
      lo = Math.min(lo, x); hi = Math.max(hi, x); deepest = Math.max(deepest, y);
    }
    check(deepest < 4, `${id} walk ${leg}: never sinks (deepest ${deepest.toFixed(1)})`);
    check(Math.abs((hi - lo) / need - 1) < 0.25, `${id} walk ${leg}: stride ${(hi - lo).toFixed(1)} px ~ ${need.toFixed(1)} (no skating)`);
  }
}

// Raider: no kit, his own cutlass part draws.
check(heldOf({ def: FIGHTERS['rat-raider'], weapon: null }, RIGS['rat-raider']) === null, 'raider: no kit, rig cutlass shows');

// Spearman: spear replaces the cutlass on the near fist; the far fist (grip forearm) closes on grip2; point a bit up.
{
  const def = FIGHTERS['rat-spearman'], rig = RIGS['rat-spearman'], K = ITEMS['rat-spear'], G = rig.grips['two-hand'];
  for (const [label, f] of [['stance', { state: 'idle' }], ['thrust windup', { state: 'attack', move: def.moves.spearThrust, moveKey: 'spearThrust', mf: 40 }],
    ['thrust strike', { state: 'attack', move: def.moves.spearThrust, moveKey: 'spearThrust', mf: 45 }]]) {
    const fi = { def, t: 0, mf: 0, move: null, weapon: null, ...f }, tp = targetPose(fi, rig, 0);
    const L = gripLayout(rig, tp.joints, tp.swap, heldOf(fi, rig), fi);
    const spear = L.find((e) => e.name === 'sword'), arm = L.find((e) => e.name === 'arm-back-lower');
    check(spear.img === K.art.img && arm.swap === 'arm-back-lower-grip', `spearman ${label}: spear in hand, far fist closed`);
    const s = rig.parts['arm-back-lower'].swaps['arm-back-lower-grip'], hand = apply(arm.m, [G.ik.hand[0] - s.offset[0], G.ik.hand[1] - s.offset[1]]);
    const d = dist(hand, apply(spear.m, K.art.grip2));
    check(d < 2, `spearman ${label}: far fist on the shaft (${d.toFixed(2)} px off)`);
    const dir = Math.atan2(-spear.m[3], -spear.m[2]) * 180 / Math.PI;   // image up (the point) on screen: 0 = forward, - = up
    if (label === 'stance') check(dir < 0 && dir > -25, `spearman stance: point angled slightly up (${dir.toFixed(0)} deg)`);
    if (label !== 'thrust windup') check(Math.abs(dir) < 30, `spearman ${label}: spear points at the enemy (${dir.toFixed(0)} deg)`);
  }
}

// Archer: bow upright in the far fist; near hand on the string's nock, pulled back `pull` at full draw; string + nocked
// arrow only while drawing; the cutlass hidden. Not drawing: the near arm stays as posed.
{
  const def = FIGHTERS['rat-archer'], rig = RIGS['rat-archer'], K = ITEMS['rat-bow'], G = rig.grips.bow, m = def.moves.bowShot;
  for (const [label, f, k] of [['stance', { state: 'idle' }, 0], ['full draw', { state: 'attack', move: m, moveKey: 'bowShot', mf: m.windup - 1 }, 1],
    ['loosed', { state: 'attack', move: m, moveKey: 'bowShot', mf: m.windup + 1 }, 0]]) {
    const fi = { def, t: 0, mf: 0, move: null, weapon: null, ...f }, tp = targetPose(fi, rig, 0);
    const L = gripLayout(rig, tp.joints, tp.swap, heldOf(fi, rig), fi);
    const bow = L.find((e) => e.name === 'held'), arm = L.find((e) => e.name === 'arm-front-lower');
    check(bow?.img === K.art.img && !L.some((e) => e.name === 'sword'), `archer ${label}: bow held, cutlass hidden`);
    check(Math.abs(Math.atan2(bow.m[1], bow.m[0])) < 0.01, `archer ${label}: bow upright`);
    const pulled = k > 0.9 ? K.art.pull * (1 - (1 / m.windup) ** 2) : 0;
    const d = dist(apply(arm.m, G.ik.hand), apply(bow.m, [K.art.nock[0] - pulled, K.art.nock[1]]));
    if (k) check(d < 2, `archer ${label}: near hand on the string (${d.toFixed(2)} px off)`);
    else check(L.find((e) => e.name === 'arm-front-upper').m.every((v, i) => Math.abs(v - layoutRig(rig, tp.joints, tp.swap).find((e) => e.name === 'arm-front-upper').m[i]) < 1e-9), `archer ${label}: near arm as posed (not drawing)`);
    const drawn = label === 'full draw';
    check(L.some((e) => e.line) === drawn && L.some((e) => e.name === 'arrow') === drawn, `archer ${label}: string + nocked arrow ${drawn ? 'shown' : 'hidden'}`);
  }
}

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
