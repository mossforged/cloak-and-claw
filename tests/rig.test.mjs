// Rig poses and layout (render-side, but pure): each state/move picks the right pose, move phases
// land on their windup/strike, blends start from the last drawn pose, and the layout is sane.
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { targetPose, rigJoints, jointsOfRig } from '../src/render/rig-pose.js';
import { layoutRig } from '../src/render/rig.js';
import { readFileSync } from 'node:fs';

// Bottom row of a part image (PNG header height), i.e. the boot sole.
const soleY = (part) => readFileSync(rig.parts[part].img).readUInt32BE(20) - 3;

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
  const r = targetPose(fighter({ state, t: 7 }), rig, 1.3);
  check(r.key === key, `${state} -> pose ${key} (got ${r.key})`);
  check(finite(r.joints), `${state}: joints finite`);
  check(Object.keys(r.joints).every((j) => jointsOfRig(rig).includes(j)), `${state}: only rig joints`);
}

// Move phases: end of windup = windup pose; strike reached (with overshoot) inside active.
for (const [key, mp] of Object.entries(P.moves)) {
  const m = def.moves[key], state = m.air ? 'jump' : 'attack';
  const atWindupEnd = targetPose(fighter({ state, move: m, mf: m.windup }), rig, 0);
  check(atWindupEnd.key === key, `${key}: pose key is the move key`);
  for (const [j, v] of Object.entries(mp.windup)) check(near(atWindupEnd.joints[j], v), `${key}: ${j} at windup end = ${v}`);
  const done = targetPose(fighter({ state, move: m, mf: m.windup + m.active - 1 }), rig, 0);
  for (const [j, v] of Object.entries(mp.strike)) check(near(done.joints[j], v, 1), `${key}: ${j} at late active ~ ${v} (got ${done.joints[j]})`);
}

// Blending: a new pose starts from the last drawn one and reaches the target after timing.blend.
const mem = {}, f = fighter({ state: 'idle' });
const idle = rigJoints(f, rig, 0, mem);
f.state = 'hurt';
const start = rigJoints(f, rig, 0.5, mem);
check(Object.keys(idle).every((j) => near(start[j], idle[j])), 'blend starts at last drawn pose');
const end = rigJoints(f, rig, 0.5 + P.timing.blend, mem);
const hurt = targetPose(f, rig, 0).joints;
check(Object.keys(hurt).every((j) => near(end[j], hurt[j])), 'blend ends on target pose');

// Layout: every part once, in draw order, finite; root hip sits rootY above the feet; head above hips.
const L = layoutRig(rig, targetPose(fighter({}), rig, 0).joints);
check(L.length === Object.keys(rig.parts).length, 'layout has every part');
check(L.every((e, i) => i === 0 || L[i - 1].p.order <= e.p.order), 'layout sorted by order');
check(L.every((e) => e.m.every(Number.isFinite)), 'layout matrices finite');
const at = (name, [x, y]) => { const m = L.find((e) => e.name === name).m; return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; };
const hip = at('torso', rig.parts.torso.pivot);
check(Math.abs(hip[1] + rig.rootY) < 2, `hips about rootY above the feet (y=${hip[1].toFixed(1)})`);
check(at('head', rig.parts.head.pivot)[1] < hip[1], 'neck above hips');
for (const leg of ['leg-front-lower', 'leg-back-lower']) {
  const y = at(leg, [rig.parts[leg].pivot[0], soleY(leg)])[1];
  check(Math.abs(y) < 8, `${leg}: boot sole within 8 px of the ground in stance (y=${y.toFixed(1)})`);
}

// Walk: feet don't skate. While a foot is planted (half a stride cycle) the body moves walk * 60 / speed / 2 px;
// the foot's sweep from front to back relative to the hips must match that.
const walkSpeed = def.move.walk * 60, need = walkSpeed / P.walk.speed / 2;
for (const leg of ['leg-front-lower', 'leg-back-lower']) {
  let lo = Infinity, hi = -Infinity, deepest = -Infinity;
  for (let i = 0; i < 60; i++) {
    const t = i / 60 / P.walk.speed;
    const W = layoutRig(rig, targetPose(fighter({ state: 'walk', t: t * 60 }), rig, 0).joints);
    const m = W.find((e) => e.name === leg).m, [x, y] = [rig.parts[leg].pivot[0], soleY(leg)];
    const fx = m[0] * x + m[2] * y + m[4];
    lo = Math.min(lo, fx); hi = Math.max(hi, fx); deepest = Math.max(deepest, m[1] * x + m[3] * y + m[5]);
  }
  check(deepest < 4, `${leg}: walk never sinks the boot into the floor (deepest y=${deepest.toFixed(1)})`);
  check(Math.abs((hi - lo) / need - 1) < 0.25, `${leg}: stride sweep ${(hi - lo).toFixed(1)} px ~ needed ${need.toFixed(1)} px (feet don't skate)`);
}

// Pose stretch reaches the layout: slash2 (backhand) keeps the arm in front and flips the blade from back to front.
const s2 = def.moves.slash2, wind = layoutRig(rig, targetPose(fighter({ state: 'attack', move: s2, mf: s2.windup }), rig, 0).joints);
const idx = (Lx, n) => Lx.findIndex((e) => e.name === n);
check(idx(wind, 'arm-front-upper') > idx(wind, 'torso'), 'slash2 windup: front arm drawn in front of the torso');
const hit = layoutRig(rig, targetPose(fighter({ state: 'attack', move: s2, mf: s2.windup + s2.active - 1 }), rig, 0).joints);
check(idx(hit, 'arm-front-upper') > idx(hit, 'torso'), 'slash2 strike: front arm drawn in front of the torso');
const det = (Lx, n) => { const m = Lx.find((e) => e.name === n).m; return m[0] * m[3] - m[1] * m[2]; };
check(det(wind, 'sword') > 0 && det(hit, 'sword') < 0, 'slash2: sword.sx flips the blade from behind to in front');

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
