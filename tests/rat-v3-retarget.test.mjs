// T035 r2 rat v3 retargeted by position (render/retarget.js): the raider's rest maps onto v3's own rest; the turning slash
// wind-up's far fist is up at the chest as on the raider; walk and idle feet stay on their floor lines inside the limits
// (render/floor.js floorInLimits); the limit-aware solve (render/limits.js) reaches what its ranges can reach and never
// leaves them; drag-to-pose uses it; rigs without retarget / limits are untouched.
import assert from 'node:assert/strict';
import { createSlot } from '../src/viewer/sandbox.js';
import { rigOf } from '../src/viewer/models.js';
import { rigFrame, rigMemory } from '../src/render/rig.js';
import { layoutRig } from '../src/render/rig-layout.js';
import { retargetLayer, sourceLayout, goalOf, LIMBS } from '../src/render/retarget.js';
import { reachInLimits, limbGeometry, pivotOf, outside } from '../src/render/limits.js';
import { floorInLimits, grounded } from '../src/render/floor.js';
import { floorLine } from '../src/data/rigs/biped-floor.js';
import { phaseOf } from '../src/sim/fighter.js';
import { startPose, solveOf, poseFrame } from '../src/viewer/pose-state.js';
import { dragLimb, byName, pivotAt } from '../src/viewer/pose-drag.js';
import HULLS from '../src/data/rigs/hulls.js';
import V3 from '../src/data/rigs/rat-v3.js';

let fails = 0;
const check = (name, fn) => { try { fn(); console.log('ok  ', name); } catch (e) { fails++; console.log('FAIL', name, '\n   ', e.stack.split('\n').slice(0, 4).join('\n    ')); } };
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const by = (L) => Object.fromEntries(L.filter((e) => e.m && !e.line).map((e) => [e.name, e]));
const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const play = (anim, warm, f = 'rat-raider') => {
  const slot = createSlot({ warm: (sb, t) => { for (const x of sb.w.fighters) if (x !== sb.hero) rigFrame(x, rigOf(x.def.id), t, rigMemory(x)); warm(sb, t); } });
  slot.load({ f, v: 'v3', item: 'own', anim, grip: '', target: false, flip: false, look: {}, gear: null });
  slot.seek(slot.len);
};

check('the raider at rest (the master) puts v3 at its own rest', () => {
  const A = sourceLayout(V3.retarget, {}, {}, null, null), j = retargetLayer(V3, {}, A);
  for (const limb of LIMBS) for (const n of limb) assert.ok(Math.abs(j[n] ?? 0) < 0.5, `${n} ${j[n]}`);
});

check('no retarget / no limits: joints as given (the same object)', () => {
  const raider = rigOf('rat-raider'), j = { 'arm-near-upper': 12 };
  assert.equal(retargetLayer(raider, j, {}), j);
  assert.equal(floorInLimits(raider, j), j);
});

check('turning slash wind-up: v3\'s far fist is up at the chest, where the raider\'s is (4 px; round 1: 33 px off)', () => {
  let got = null;
  play('ratSlash', (sb, t) => {
    const f = sb.hero, F = rigFrame(f, sb.rig, t, rigMemory(f));
    if (!(f.move && phaseOf(f)[0] === 'windup')) return;
    const S = rigFrame(f, sb.rig.retarget, t, (sb.memS ??= {})), at = (R, L) => { const B = by(L); const c = apply(B.torso.base, R.sockets.chest.at), h = pivotOf(R, B, 'hand-far'); return [h[0] - c[0], h[1] - c[1]]; };
    got = [at(sb.rig.retarget, S.L), at(sb.rig, F.L)];
  });
  assert.ok(got, 'no wind-up frame');
  assert.ok(d(...got) < 4, `raider ${got[0]} v3 ${got[1]}`);
});

check('every clip: v3\'s hands within 6 px (mean) of where the raider puts them', () => {
  const err = { 'hand-near': [], 'hand-far': [] };
  for (const anim of ['idle', 'walk', 'ratSlash', 'backhand', 'overheadChop', 'daggerStab', 'guard']) play(anim, (sb, t) => {
    const f = sb.hero, F = rigFrame(f, sb.rig, t, rigMemory(f)), S = rigFrame(f, sb.rig.retarget, t, (sb.memS ??= {}));
    if (Math.abs((F.joints.sx ?? 1) - 1) > 1e-6) return;
    const A = by(S.L), B = by(F.L);
    for (const limb of LIMBS.slice(0, 2)) if (limb.every((n) => A[n] && B[n])) err[limb[2]].push(d(goalOf(sb.rig.retarget, A, sb.rig, B, limb), pivotOf(sb.rig, B, limb[2])));
  });
  for (const [end, e] of Object.entries(err)) { const m = e.reduce((a, b) => a + b, 0) / e.length; assert.ok(e.length > 100 && m < 6, `${end} mean ${m.toFixed(1)} over ${e.length}`); }
});

// T039: a frame whose thigh is pinned at the end of its hip range (the raider's stride past the user's ranges, T038's
// table) may miss by up to PINNED px: A028's heel drawing reaches 2 px lower than the old foot, so the walk's last heel
// frame (32) sinks 3.6 px with the near hip at -23
const PINNED = 4;
check('idle and walk: every planted foot on its floor line (idle 0.5 px, walk 2 px; a hip pinned at its range end 4 px), every joint inside its range', () => {
  for (const [anim, tol] of [['idle', 0.5], ['walk', 2]]) {
    const bad = [];
    play(anim, (sb, t) => {
      const f = sb.hero, F = rigFrame(f, sb.rig, t, rigMemory(f)), B = by(F.L);
      for (const o of outside(sb.rig, F.joints)) bad.push(`${sb.n} ${o.part} ${o.turn.toFixed(1)}`);
      if (!grounded(f) || F.joints['@aloft']) return;
      for (const ft of ['foot-near', 'foot-far']) {
        const lift = Math.max(0, F.joints[`${ft}.lift`] ?? 0);
        if (lift > 0.5) continue;
        const g = F.p.dy + F.p.sy * F.k * Math.max(...HULLS[B[ft].img].map((p) => apply(B[ft].m, p)[1])) - floorLine(sb.rig, ft) + lift;
        const up = ft.replace('foot', 'leg') + '-upper', pinned = sb.rig.limits[up].some((e) => Math.abs((F.joints[up] ?? 0) - e) < 0.05);
        if (Math.abs(g) > (pinned ? PINNED : tol)) bad.push(`${anim} ${sb.n} ${ft} ${g.toFixed(2)} px`);
      }
    });
    assert.ok(!bad.length, bad.slice(0, 12).join('; '));
  }
});

check('reachInLimits: an in-range goal is reached on the asked side; an out-of-range one never leaves the ranges', () => {
  const B = by(layoutRig(V3, {})), limb = LIMBS[0], g = limbGeometry(V3, B, {}, limb), L = V3.limits;
  const W = g.W, T = [W[0] + 3, W[1] - 6];
  const r = reachInLimits(g, T, L[limb[0]], L[limb[1]], Math.sign(g.bend));
  assert.ok(r.err < 0.1, `err ${r.err}`);
  for (const T2 of [[W[0] + 80, W[1]], [g.S[0], g.S[1] + 1], [W[0] - 40, W[1] - 60]]) {
    const q = reachInLimits(g, T2, L[limb[0]], L[limb[1]], 1);
    assert.ok(q.up >= L[limb[0]][0] - 1e-9 && q.up <= L[limb[0]][1] + 1e-9 && q.lo >= L[limb[1]][0] - 1e-9 && q.lo <= L[limb[1]][1] + 1e-9, JSON.stringify(q));
  }
});

check('drag-to-pose on v3 starts from the retargeted frame and puts a dragged hand on the point inside the limits', () => {
  const P = startPose({ id: 'rat-raider', from: 'ratSlash:30', version: 'v3' }), c = solveOf(P), B = byName(poseFrame(P).L);
  const mem = {}; rigFrame(P.f, P.rig, P.time, mem);
  assert.ok(Math.abs(P.joints['arm-far-lower'] - mem.last['arm-far-lower']) > 1, 'the pose page starts from the raider\'s angles');
  const W = pivotAt(c, B, 'hand-far'), T = [W[0] - 4, W[1] + 3], r = dragLimb(c, 'hand-far', T);
  const B2 = byName(poseFrame({ ...P, joints: r.joints }).L);
  assert.ok(d(pivotAt(c, B2, 'hand-far'), T) < 0.6 || r.clamped, `${pivotAt(c, B2, 'hand-far')} vs ${T}`);
  assert.deepEqual(outside(V3, r.joints), []);
});

console.log(fails ? `${fails} failed` : 'all passed');
process.exit(fails ? 1 : 0);
