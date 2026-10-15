// Rig poses and layout (render-side, but pure): each state/move picks the right pose, move phases
// land on their windup/strike, blends start from the last drawn pose, and the layout is sane.
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { targetPose, rigJoints, jointsOfRig } from '../src/render/rig-pose.js';
import { layoutRig } from '../src/render/rig.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const near = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

const def = FIGHTERS['mouse-fighter'], rig = RIGS[def.art.rig], P = rig.poses;
check(rig, 'mouse-fighter uses a registered rig');
const fighter = (o) => ({ def, state: 'idle', t: 0, mf: 0, move: null, ...o });
const finite = (j) => Object.values(j).every(Number.isFinite);

// State -> pose key
const cases = { idle: 'idle', walk: 'walk', jump: 'jump', hurt: 'hurt', knockdown: 'knockdown', down: 'down', dead: 'down', getup: 'getup' };
for (const [state, key] of Object.entries(cases)) {
  const r = targetPose(fighter({ state, t: 7 }), P, 1.3);
  check(r.key === key, `${state} -> pose ${key} (got ${r.key})`);
  check(finite(r.joints), `${state}: joints finite`);
  check(Object.keys(r.joints).every((j) => jointsOfRig(rig).includes(j)), `${state}: only rig joints`);
}

// Move phases: end of windup = windup pose; strike reached (with overshoot) inside active.
for (const [key, mp] of Object.entries(P.moves)) {
  const m = def.moves[key], state = m.air ? 'jump' : 'attack';
  const atWindupEnd = targetPose(fighter({ state, move: m, mf: m.windup }), P, 0);
  check(atWindupEnd.key === key, `${key}: pose key is the move key`);
  for (const [j, v] of Object.entries(mp.windup)) check(near(atWindupEnd.joints[j], v), `${key}: ${j} at windup end = ${v}`);
  const done = targetPose(fighter({ state, move: m, mf: m.windup + m.active - 1 }), P, 0);
  for (const [j, v] of Object.entries(mp.strike)) check(near(done.joints[j], v, 1), `${key}: ${j} at late active ~ ${v} (got ${done.joints[j]})`);
}

// Blending: a new pose starts from the last drawn one and reaches the target after timing.blend.
const mem = {}, f = fighter({ state: 'idle' });
const idle = rigJoints(f, P, 0, mem);
f.state = 'hurt';
const start = rigJoints(f, P, 0.5, mem);
check(Object.keys(idle).every((j) => near(start[j], idle[j])), 'blend starts at last drawn pose');
const end = rigJoints(f, P, 0.5 + P.timing.blend, mem);
const hurt = targetPose(f, P, 0).joints;
check(Object.keys(hurt).every((j) => near(end[j], hurt[j])), 'blend ends on target pose');

// Layout: every part once, in draw order, finite; root hip sits rootY above the feet; head above hips.
const L = layoutRig(rig, targetPose(fighter({}), P, 0).joints);
check(L.length === Object.keys(rig.parts).length, 'layout has every part');
check(L.every((e, i) => i === 0 || L[i - 1].p.order <= e.p.order), 'layout sorted by order');
check(L.every((e) => e.m.every(Number.isFinite)), 'layout matrices finite');
const at = (name, [x, y]) => { const m = L.find((e) => e.name === name).m; return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; };
const hip = at('torso', rig.parts.torso.pivot);
check(Math.abs(hip[1] + rig.rootY) < 2, `hips about rootY above the feet (y=${hip[1].toFixed(1)})`);
check(at('head', rig.parts.head.pivot)[1] < hip[1], 'neck above hips');
for (const leg of ['leg-front-lower', 'leg-back-lower']) {
  const y = at(leg, [rig.parts[leg].pivot[0], 140])[1];   // near the sole of the boot image
  check(Math.abs(y) < 8, `${leg}: boot sole within 8 px of the ground in stance (y=${y.toFixed(1)})`);
}

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
