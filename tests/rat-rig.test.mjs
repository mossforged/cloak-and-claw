// Rat rigs (T018: A010 on the rig standard; T026: rebuilt on A018 + A019). raider / spearman / archer share the body. Every pose names only
// existing parts and swaps; uniform scale only (no per-part scale); grabbed/thrown use `held`; feet stay on their floor
// in the crouch and move poses, walk doesn't skate or sink; layouts finite. Weapons: the raider holds the rat-cutlass
// item (its grip on the near hand's shaft slot) and drops that same item, his hand empty once it has fallen; spear on
// the near grip hand with the far grip hand IK'd onto the shaft; bow through the far grip hand, near pinch hand on the
// string (drawn back at full draw).
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { ITEMS } from '../src/data/items/index.js';
import { targetPose, jointsOfRig } from '../src/render/rig-pose.js';
import { heldOf, layoutRig, rigFrame } from '../src/render/rig.js';
import { gripLayout } from '../src/render/rig-grip.js';
import { BIPED_PARTS } from '../src/data/rigs/biped-poses.js';
import { floorLine } from '../src/data/rigs/biped-floor.js';
import HULLS from '../src/data/rigs/hulls.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
// T026: a foot is on its floor when the lowest point of whichever drawing it shows (flat or A019 toe-off: its hull,
// rigs/hulls.js) is on that foot's floor line (rigs/biped-floor.js, the master's); x = its ankle (the same point in
// every drawing), for the walk's stride.
const FEET = ['foot-near', 'foot-far'];
const CHANNELS = new Set(['speed', 'swap', 'swapPhase', 'dx', 'dy', 'sx', 'weapon', 'view', 'order', 'carry']);   // T028: views, bands, carried object   // weapon.*: T025 node channels

for (const id of ['rat-raider', 'rat-spearman', 'rat-archer']) {
  const def = FIGHTERS[id], rig = RIGS[def.art.rig], P = rig.poses;
  const fighter = (o) => ({ def, state: 'idle', t: 0, mf: 0, move: null, weapon: null, hp: 10, ...o });
  const lay = (f) => { const tp = targetPose(f, rig, 0); return gripLayout(rig, tp.joints, tp.swap, heldOf(f, rig), f); };
  const soles = (L) => Object.fromEntries(FEET.filter((n) => L.some((e) => e.name === n)).map((n) => {
    const e = L.find((x) => x.name === n), ys = HULLS[e.img].map((p) => apply(e.m, p)[1]);
    return [n, { y: Math.max(...ys), x: apply(e.base, rig.parts[n].pivot)[0] }];
  }));

  check(BIPED_PARTS.every((n) => rig.parts[n]), `${id}: every standard part present`);
  check(Object.values(rig.parts).every((p) => p.scale === undefined), `${id}: uniform scale only (no per-part scale)`);

  // every pose (states, waves, move phases) names only parts the rig has, and swaps it has
  const poses = { ...P, ...Object.fromEntries(Object.entries(P.moves).flatMap(([k, M]) => Object.entries(M).map(([ph, v]) => [`${k}.${ph}`, v]))) };
  delete poses.timing; delete poses.moves;
  for (const [k, pose] of Object.entries(poses)) {
    for (const ch of Object.keys(pose)) {
      const part = ch.split('.')[0];
      check(CHANNELS.has(ch) || CHANNELS.has(part) || rig.parts[part], `${id} ${k}: '${ch}' names an existing part`);
    }
    for (const [part, sw] of Object.entries(pose.swap ?? {})) check(rig.parts[part]?.swaps?.[sw], `${id} ${k}: swap ${part} -> ${sw} exists`);
  }
  for (const G of Object.values(rig.grips ?? {})) for (const [part, sw] of Object.entries(G.swap ?? {})) check(rig.parts[part]?.swaps?.[sw], `${id} grip swap ${part} -> ${sw} exists`);

  for (const state of ['idle', 'walk', 'hurt', 'knockdown', 'down', 'getup', 'grabbed', 'thrown']) {
    const r = targetPose(fighter({ state, t: 7 }), rig, 1.3);
    check(Object.values(r.joints).every(Number.isFinite) && Object.keys(r.joints).every((j) => jointsOfRig(rig).includes(j)), `${id} ${state}: finite rig joints`);
    check(lay(fighter({ state, t: 7 })).every((e) => (e.m ?? e.line.flat()).every(Number.isFinite)), `${id} ${state}: layout finite`);
  }
  for (const state of ['grabbed', 'thrown']) check(targetPose(fighter({ state }), rig, 0).key === 'held', `${id} ${state}: held pose (hurt face)`);
  check(targetPose(fighter({ state: 'down' }), rig, 0).swap.head === 'head-ko', `${id} down: KO face`);

  // crouch stance and ground moves: both feet on their floor (T026: the frame before the strike and its last active
  // frame, each fully in its pose; a swap switching in on the first strike frame is the floor-line rule's, render/floor.js)
  const onFloor = (L, tol, label) => {
    const S = soles(L);
    for (const n of Object.keys(S)) {
      const d = Math.abs(S[n].y - floorLine(rig, n));
      check(d < tol, `${id} ${label}: ${n} on its floor (${d.toFixed(1)} px off)`);
    }
  };
  onFloor(lay(fighter({})), 2, 'stance');
  for (const [key, m] of Object.entries(def.moves)) for (const mf of [m.windup - 1, m.windup + m.active - 1]) onFloor(lay(fighter({ state: 'attack', move: m, moveKey: key, mf })), 2, `${key}@${mf}`);

  // walk: feet never sink under their floor and the planted foot sweeps back as far as the body moves (no skating)
  const need = def.move.walk * 60 / P.walk.speed / 2;
  for (const n of FEET) {
    let lo = Infinity, hi = -Infinity, sink = -Infinity;
    for (let i = 0; i < 60; i++) {
      const f = fighter({ state: 'walk', t: i / P.walk.speed, facing: 1, x: 0, y: 0, z: 0, vz: 0 }), mem = {};
      rigFrame(f, rig, -1, mem); const s = soles(rigFrame(f, rig, 0, mem).L)[n];   // as drawn: the floor-line rule holds planted feet
      lo = Math.min(lo, s.x); hi = Math.max(hi, s.x); sink = Math.max(sink, s.y - floorLine(rig, n));
    }
    check(sink < 3, `${id} walk ${n}: never sinks (deepest ${sink.toFixed(1)} px under)`);
    check(Math.abs((hi - lo) / need - 1) < 0.25, `${id} walk ${n}: stride ${(hi - lo).toFixed(1)} px ~ ${need.toFixed(1)} (no skating)`);
  }
}

// Raider: holds the rat-cutlass item art (the one he drops) with its grip on the near hand's slot; the strike swings
// the near arm in front of the body; once dropped (KO) his hand is empty.
{
  const def = FIGHTERS['rat-raider'], rig = RIGS['rat-raider'], K = ITEMS[def.art.held], slot = rig.slots['one-hand'];
  check(def.art.held === 'rat-cutlass' && def.drop.item === def.art.held, 'raider: holds the cutlass he drops (same item id)');
  check(K.grip === 'one-hand' && slot.parent === 'hand-near', 'raider: cutlass goes in the near hand slot');
  const f = (o) => ({ def, state: 'idle', t: 0, mf: 0, move: null, weapon: null, hp: 10, ...o });
  for (const [label, fi] of [['stance', f({})], ['strike', f({ state: 'attack', move: def.moves.ratSlash, moveKey: 'ratSlash', mf: def.moves.ratSlash.windup + 3 })]]) {
    const tp = targetPose(fi, rig, 0), L = gripLayout(rig, tp.joints, tp.swap, heldOf(fi, rig), fi);
    const blade = L.find((e) => e.name === 'held'), hand = L.find((e) => e.name === 'hand-near');
    check(blade?.img === K.art.img, `raider ${label}: the cutlass item drawn in his hand`);
    const d = dist(apply(blade.m, K.art.grip), apply(hand.base, slot.attach));   // slot in the hand part's px
    check(d < 0.01, `raider ${label}: cutlass grip on the hand's shaft slot (${d.toFixed(3)} px off)`);
    check(blade.order < hand.order, `raider ${label}: handle drawn behind the grip hand`);
    // T026 r2: at rest the near upper arm stays under the vest edge (band 590 < torso 600), the forearm in front of it;
    // T028: the strike turns his chest toward the camera (F) and the whole near arm swings in front of it
    const at = (n) => L.findIndex((e) => e.name === n);
    if (label === 'stance') check(at('arm-near-upper') < at('torso') && at('arm-near-lower') > at('torso'), 'raider stance: near upper arm under the vest, forearm in front of the torso');
    if (label === 'strike') check(tp.swap['@view.torso'] === 'F' && at('arm-near-upper') > at('torso') && at('arm-near-lower') > at('torso'), 'raider strike: chest toward the camera (F), whole near arm in front of the torso');
  }
  const ko = f({ state: 'dead', hp: 0, dropped: true }), tp = targetPose(ko, rig, 0);
  check(!gripLayout(rig, tp.joints, tp.swap, heldOf(ko, rig), ko).some((e) => e.name === 'held'), 'raider KO: dropped cutlass gone from his hand');
  check(heldOf(f({ state: 'dead', hp: 0 }), rig)?.part, 'raider KO before the drop roll: still holding it');
}

// Spearman: spear on the near grip hand; the far hand (grip drawing) closes on grip2; point a bit up, at the enemy.
{
  const def = FIGHTERS['rat-spearman'], rig = RIGS['rat-spearman'], K = ITEMS['rat-spear'], G = rig.grips['two-hand'];
  for (const [label, f] of [['stance', { state: 'idle' }], ['thrust windup', { state: 'attack', move: def.moves.spearThrust, moveKey: 'spearThrust', mf: 40 }],
    ['thrust strike', { state: 'attack', move: def.moves.spearThrust, moveKey: 'spearThrust', mf: 45 }]]) {
    const fi = { def, t: 0, mf: 0, move: null, weapon: null, hp: 10, ...f }, tp = targetPose(fi, rig, 0);
    const L = gripLayout(rig, tp.joints, tp.swap, heldOf(fi, rig), fi);
    const spear = L.find((e) => e.name === 'held'), hand = L.find((e) => e.name === 'hand-far');
    check(spear?.img === K.art.img && hand.swap === G.swap['hand-far'], `spearman ${label}: spear in hand, far hand gripping (${hand.swap})`);
    const s = rig.parts['hand-far'].swaps[G.swap['hand-far']], at = apply(hand.m, [G.ik.hand[0] - s.offset[0], G.ik.hand[1] - s.offset[1]]);
    const g1 = apply(spear.m, K.art.grip), g2 = apply(spear.m, K.art.grip2), L2 = dist(g1, g2);   // on the shaft line (T020: may slide back)
    const d = Math.abs((at[0] - g1[0]) * (g2[1] - g1[1]) - (at[1] - g1[1]) * (g2[0] - g1[0])) / L2;
    check(d < 2, `spearman ${label}: far hand on the shaft (${d.toFixed(2)} px off)`);
    const dir = Math.atan2(-spear.m[3], -spear.m[2]) * 180 / Math.PI;   // image up (the point) on screen: 0 = forward, - = up
    if (label === 'stance') check(dir < 0 && dir > -25, `spearman stance: point angled slightly up (${dir.toFixed(0)} deg)`);
    if (label !== 'thrust windup') check(Math.abs(dir) < 30, `spearman ${label}: spear points at the enemy (${dir.toFixed(0)} deg)`);
  }
}

// Archer: bow upright through the far grip hand; near (pinch) hand on the string's nock (drawn to the ear at full draw:
// tests/weapon-hold.test.mjs); string + nocked arrow only while drawing. Not drawing: the near arm stays as posed.
{
  const def = FIGHTERS['rat-archer'], rig = RIGS['rat-archer'], K = ITEMS['rat-bow'], G = rig.grips.bow, m = def.moves.bowShot;
  for (const [label, f, k] of [['stance', { state: 'idle' }, 0], ['full draw', { state: 'attack', move: m, moveKey: 'bowShot', mf: m.windup - 1 }, 1],
    ['loosed', { state: 'attack', move: m, moveKey: 'bowShot', mf: m.windup + 1 }, 0]]) {
    const fi = { def, t: 0, mf: 0, move: null, weapon: null, hp: 10, ...f }, tp = targetPose(fi, rig, 0);
    const L = gripLayout(rig, tp.joints, tp.swap, heldOf(fi, rig), fi);
    const bow = L.find((e) => e.name === 'held'), near = L.find((e) => e.name === 'hand-near'), far = L.find((e) => e.name === 'hand-far');
    check(bow?.img === K.art.img && far.swap === 'hand-far-grip' && near.swap === 'hand-near-pinch', `archer ${label}: bow in the far grip hand, near hand pinching`);
    check(Math.abs(Math.atan2(bow.m[1], bow.m[0])) < 0.01, `archer ${label}: bow upright (${(Math.atan2(bow.m[1], bow.m[0]) / Math.PI * 180).toFixed(2)} deg)`);
    const s = rig.parts['hand-near'].swaps['hand-near-pinch'], sk = s.scale ?? 1;
    const pinch = apply(near.m, [(G.ik.hand[0] - s.offset[0]) / sk, (G.ik.hand[1] - s.offset[1]) / sk]);
    const d = k ? dist(pinch, L.find((e) => e.line).line[1]) : 0;   // T020: on the drawn string's nock point
    if (k) check(d < 2, `archer ${label}: near hand on the string (${d.toFixed(2)} px off)`);
    else check(L.find((e) => e.name === 'arm-near-upper').m.every((v, i) => Math.abs(v - layoutRig(rig, tp.joints, tp.swap).find((e) => e.name === 'arm-near-upper').m[i]) < 1e-9), `archer ${label}: near arm as posed (not drawing)`);
    const drawn = label === 'full draw';
    check(L.some((e) => e.line) === drawn && L.some((e) => e.name === 'arrow') === drawn, `archer ${label}: string + nocked arrow ${drawn ? 'shown' : 'hidden'}`);
    if (drawn) check(L.find((e) => e.line).order > L.find((e) => e.name === 'torso').order, 'archer full draw: string drawn in front of the body');
  }
}

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
