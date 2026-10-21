// T040: rat v3's own poses (data/rigs/rat-v3-poses.js) for the spear, staff, slash, chop, guard and bash. Every frame of
// those clips: joints inside the user's limits as drawn, the held item in its grip fist, the held item off the head's
// drawing (known exceptions: the slash and chop blade rising back to the raider's idle carry, which already lies over the
// ear); at the named keys, the targets the move names (tools/v3-own-check.mjs). The old rat's poses carry no places, so its
// clips are as before; a v3 key without a place is retargeted as before (the T035 / T039 tests).
import assert from 'node:assert/strict';
import { RIGS } from '../src/data/rigs/index.js';
import { channelsOf, targetPose } from '../src/render/rig-pose.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import V3, { V3_SPEARMAN } from '../src/data/rigs/rat-v3.js';
import { RAIDER, SPEARMAN, withOwn } from '../src/data/rigs/rat-v3-poses.js';
import raiderPoses from '../src/data/rigs/rat-raider-poses.js';
import { CLIPS, TARGETS, framesOf, keyFrame, limitFaults, inFist, headOverlap, itemOf } from '../tools/v3-own-check.mjs';

let fails = 0;
const check = (name, fn) => { try { fn(); console.log('ok  ', name); } catch (e) { fails++; console.log('FAIL', name, '\n   ', e.stack.split('\n').slice(0, 4).join('\n    ')); } };
const by = (L) => Object.fromEntries(L.filter((e) => e.m && !e.line).map((e) => [e.name, e]));

check('the old rats\' poses are untouched: no places, no place channels; withOwn copies, never edits', () => {
  for (const id of ['rat-raider', 'rat-spearman']) {
    const R = RIGS[FIGHTERS[id].art.rig];
    assert.ok(!JSON.stringify(R.poses).includes('"place"'), id);
    assert.ok(!Object.keys(channelsOf(R)).some((k) => k.startsWith('place.')), id);
  }
  assert.ok(!JSON.stringify(raiderPoses).includes('"place"'));
  const P = withOwn(raiderPoses, RAIDER);
  assert.notEqual(P.moves.ratSlash, raiderPoses.moves.ratSlash);
  assert.equal(P.moves.backhand, raiderPoses.moves.backhand);   // a move without places: the same object
  assert.equal(P.idle, raiderPoses.idle);
  assert.equal(V3_SPEARMAN.poses.moves.spearThrust.windup.place['hand-near'].at.length, 2);
  assert.ok(Object.keys(SPEARMAN.moves).every((k) => V3_SPEARMAN.poses.moves[k]));
});

check('a key\'s place blends as a weight: half way from a key without one, the place is the key\'s own', () => {
  const def = FIGHTERS['rat-raider'], M = def.rehearsal.guard;
  const f = { def, state: 'attack', move: M, moveKey: 'guard', mf: 2, t: 2, facing: 1, z: 0, grab: { knee: -1 } };
  const j = targetPose(f, V3, 0).joints, w = j['place.hand-far.at'];
  assert.ok(w > 0 && w < 1, `weight ${w}`);
  assert.ok(Math.abs(j['place.hand-far.x'] / w - 20) < 1e-9 && Math.abs(j['place.hand-far.y'] / w + 82) < 1e-9);
});

// Frames the held item overlaps the head (more than TOL item px, every 2nd px), known per clip: the slash's first through
// frame (the blade over the top) and its recovery rising back to the rest; the chop the same, and its start from the
// rest (the raider's idle carry: the axe head beside the ear). Never more frames or deeper than recorded here.
const TOL = 5, KNOWN = { ratSlash: { frames: 20, worst: 640 }, overheadChop: { frames: 30, worst: 470 } };
check('every frame of the clips v3 poses: joints inside the limits, item in its fist, item off the head', () => {
  const bad = [];
  for (const [id, clip, rig] of CLIPS) {
    let over = 0, worst = 0;
    for (const { i, F } of framesOf(id, clip, rig)) {
      for (const x of limitFaults(rig, F)) bad.push(`${clip}@${i}: ${x}`);
      if (!inFist(rig, F)) bad.push(`${clip}@${i}: item out of its fist`);
      const o = headOverlap(F);
      if (o > TOL) { over++; worst = Math.max(worst, o); }
    }
    const K = KNOWN[clip] ?? { frames: 0, worst: 0 };
    if (over > K.frames || worst > K.worst) bad.push(`${clip}: item over the head in ${over} frames (worst ${worst}), known ${K.frames} (${K.worst})`);
  }
  assert.deepEqual(bad, []);
});

check('the named keys reach their targets (the chop\'s axe head: known short of the head\'s top)', () => {
  const miss = [];
  for (const T of TARGETS) {
    const rig = T.fighter === 'rat-spearman' ? V3_SPEARMAN : V3, r = T.got(keyFrame(T.fighter, T.clip, T.key, rig), rig);
    if (!r.ok) miss.push(`${T.clip} ${T.key}`);
  }
  assert.deepEqual(miss, ['overheadChop windup']);
  // what the chop does reach: the axe head above the near shoulder and up behind the head, nothing over the head
  const F = keyFrame('rat-raider', 'overheadChop', 'windup', V3), m = by(F.L)['arm-near-upper'].base, [px, py] = V3.parts['arm-near-upper'].pivot;
  const S = m[1] * px + m[3] * py + m[5], it = itemOf(F);
  assert.ok(it.tip[1] < S - 15, `axe head well above the near shoulder (${it.tip[1].toFixed(1)} vs ${S.toFixed(1)})`);
  assert.equal(headOverlap(F), 0);
});

check('both fists on the spear and staff at every key (the far fist on the shaft)', () => {
  for (const [clip, keys] of [['spearThrust', ['windup', 'strike', 'recover']], ['staffSwing', ['windup', 'strike']], ['staffOverhead', ['windup', 'strike']]])
    for (const k of keys) assert.equal(by(keyFrame('rat-spearman', clip, k, V3_SPEARMAN).L)['hand-far'].swap, 'hand-far-grip-overhand', `${clip} ${k}`);
  for (const t of [0, 30]) assert.equal(by(keyFrame('rat-spearman', 'idle', t, V3_SPEARMAN).L)['hand-far'].swap, 'hand-far-grip-overhand', `idle ${t}`);
});

console.log(fails ? `${fails} failed` : 'all passed');
process.exit(fails ? 1 : 0);
