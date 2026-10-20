// T035 rat v3 (the redrawn rat, the raider's viewer compare version): every viewer clip plays on it with every limited
// joint inside the user's range in every frame (as drawn, 0.5 deg) and every child's pivot on its parent's point (0.5 px);
// the pivots are the user's fitted points; the draw order is the source's; drag-to-pose stays inside the limits; a rig
// without limits is untouched.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { versionsOf, rigOf } from '../src/viewer/models.js';
import { clipsFor } from '../src/viewer/clips.js';
import { createSlot } from '../src/viewer/sandbox.js';
import { rigFrame, rigMemory } from '../src/render/rig.js';
import { layoutRig } from '../src/render/rig-layout.js';
import { bendOf } from '../src/render/wrist.js';
import { limitLayer, clampTurn } from '../src/render/limits.js';
import { startPose, solveOf, poseFrame, readout, formatPose, parsePose } from '../src/viewer/pose-state.js';
import { dragLimb, dragHead, twist, dragHips, byName, pivotAt } from '../src/viewer/pose-drag.js';
import V3, { BANDS, V3_SPEARMAN } from '../src/data/rigs/rat-v3.js';

let fails = 0;
const check = (name, fn) => { try { fn(); console.log('ok  ', name); } catch (e) { fails++; console.log('FAIL', name, '\n   ', e.stack.split('\n').slice(0, 4).join('\n    ')); } };
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const JOINTS = JSON.parse(readFileSync('docs/design/rigs/rat-v3-joints-v4.json', 'utf8')).joints;
const SRC = JSON.parse(readFileSync('assets/source/A027-rat-v3-body/rig-source.json', 'utf8'));

check('v3 is a compare version of the raider (and the spearman, for his moves)', () => {
  assert.ok(versionsOf('rat-raider').includes('v3') && versionsOf('rat-spearman').includes('v3'));
  assert.ok(!versionsOf('rat-archer').includes('v3') && !versionsOf('mouse-fighter').includes('v3'));
  assert.equal(rigOf('rat-spearman', 'v3').parts, V3.parts);
  assert.equal(rigOf('rat-raider', 'v3'), V3);
  assert.equal(Object.keys(V3.parts).length, 21);
  assert.equal(Object.keys(V3.limits).length, 17);
});

// as drawn: each limited part's turn on its parent, every pivot on its parent's attach point
function frameFaults(L) {
  const B = byName(L), out = [];
  for (const [part, [lo, hi]] of Object.entries(V3.limits)) {
    const H = B[part], F = H && B[V3.parts[part].parent];
    if (!F) continue;
    const t = bendOf(F, H);
    if (t < lo - 0.5 || t > hi + 0.5) out.push(`${part} ${t.toFixed(1)} outside ${lo}..${hi}`);
  }
  for (const [n, p] of Object.entries(V3.parts)) {
    if (!p.parent || !B[n] || !B[p.parent]) continue;
    const a = apply(B[n].base, ...p.pivot), b = apply(B[p.parent].base, ...p.attach), d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    if (d > 0.5) out.push(`${n} pivot ${d.toFixed(2)} px off ${p.parent}`);
  }
  return out;
}

check('every v3 clip frame: joints inside the user\'s limits, pivots on their parents', () => {
  const bad = [];
  let frames = 0, clips = 0;
  const warm = (sb, t) => {
    const f = sb.hero, { L } = rigFrame(f, sb.rig, t, rigMemory(f), sb.pose ?? undefined);
    frames++;
    for (const m of frameFaults(L)) if (bad.length < 20) bad.push(`${sb.hero.def.id} ${sb.clip.key} frame ${sb.n}: ${m}`);
  };
  const slot = createSlot({ warm: (sb, t) => { for (const f of sb.w.fighters) if (f !== sb.hero) rigFrame(f, rigOf(f.def.id), t, rigMemory(f)); warm(sb, t); } });
  for (const [f, rig] of [['rat-raider', V3], ['rat-spearman', V3_SPEARMAN]]) for (const c of clipsFor(f, 'own')) {
    slot.load({ f, v: 'v3', item: 'own', anim: c.key, grip: '', target: false, flip: false, look: {}, gear: null });
    assert.equal(slot.sb.rig, rig);
    slot.seek(slot.len);
    clips++;
  }
  console.log(`     ${clips} clips, ${frames} frames`);
  assert.ok(clips > 30 && frames > 1000);
  assert.deepEqual(bad, []);
});

check('the pivots are the user\'s fitted points (master px, 0.5 px)', () => {
  const B = byName(layoutRig(V3, {})), k = V3.scale * 0.4;   // master px -> screen px
  const W = apply(B.pelvis.base, ...V3.parts.pelvis.pivot), w0 = SRC.parts.pelvis.pivot;
  const PART = { neck: 'head', waist: 'torso', 'tail-root': 'tail', 'tail-mid': 'tail-2', 'tail-end': 'tail-3' };
  for (const [j, { world }] of Object.entries(JOINTS)) {
    const [kind, side] = j.split('-');
    const part = PART[j] ?? { shoulder: `arm-${side}-upper`, elbow: `arm-${side}-lower`, wrist: `hand-${side}`, hip: `leg-${side}-upper`, knee: `leg-${side}-lower`, ankle: `foot-${side}` }[kind];
    const at = apply(B[part].base, ...V3.parts[part].pivot), want = [W[0] + (world[0] - w0[0]) * k, W[1] + (world[1] - w0[1]) * k];
    assert.ok(Math.hypot(at[0] - want[0], at[1] - want[1]) < 0.5 * k, `${j}: ${at} vs ${want}`);
    assert.deepEqual(V3.limits[part], JOINTS[j].limits, j);
  }
});

check('draw order = the source\'s drawOrder, on the raider\'s bands', () => {
  const near = (n) => (n === 'tail-1' ? 'tail' : n);
  const order = SRC.drawOrder.map(near);
  assert.deepEqual(Object.keys(V3.parts).sort((a, b) => V3.parts[a].order - V3.parts[b].order), order);
  assert.deepEqual(Object.keys(BANDS).sort(), Object.keys(V3.parts).sort());
});

check('clampTurn / limitLayer: inside kept, outside to the nearer end round the circle, no limits untouched', () => {
  assert.ok(Math.abs(clampTurn(-338.96, [-116, 67]) - 21.04) < 1e-9);
  assert.equal(clampTurn(80, [-116, 67]), 67);
  assert.equal(clampTurn(-150, [-116, 67]), -116);
  assert.equal(clampTurn(170, [-116, 67]), -116);   // 170 is 74 from -116 round the back, 103 from 67
  assert.equal(clampTurn(-30, [0, 124]), 0);
  const j = { 'arm-near-upper': 500 };
  assert.equal(limitLayer(rigOf('rat-raider'), j), j);
});

check('drag-to-pose on v3: hands, feet, head and hips stay inside the limits', () => {
  const P = startPose({ id: 'rat-raider', from: 'idle:0', version: 'v3' });
  assert.equal(P.rig, V3);
  const c = solveOf(P), B = byName(poseFrame(P).L), faults = [];
  const test = (what, r) => { const L = poseFrame({ ...P, joints: r.joints }).L; for (const m of frameFaults(L)) faults.push(`${what}: ${m}`); return r; };
  for (const end of ['hand-near', 'hand-far', 'foot-near', 'foot-far']) {
    const W = pivotAt(c, B, end);
    for (const d of [[-60, -60], [60, -40], [0, 50], [40, 40]]) test(`${end} ${d}`, dragLimb(c, end, [W[0] + d[0], W[1] + d[1]]));
    for (const deg of [-90, 90]) test(`${end} twist ${deg}`, twist(c, end, deg));
  }
  const h = test('head +90', dragHead(c, 90));
  assert.ok(h.clamped && Math.abs(h.joints.head - 61) < 0.01, `head ${h.joints.head}`);
  test('hips', dragHips(c, [6, 10]));
  assert.deepEqual(faults, []);
  const rows = readout(P, poseFrame(P).L);
  assert.ok(rows.some((r) => r.name === 'elbow far' && r.lim[0] === 0 && r.lim[1] === 124));
  assert.equal(parsePose('?' + formatPose(P)).version, 'v3');
});

console.log(fails ? `${fails} failed` : 'all passed');
process.exit(fails ? 1 : 0);
