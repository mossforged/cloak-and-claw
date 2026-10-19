// T031 drag to pose: the pose page's solves (src/viewer/pose-drag.js) on real clip frames, checked on the layout the game
// draws (rigFrame): a dragged hand or foot inside reach lands on the point, its wrist / ankle inside its limit, the elbow /
// knee bending the side it did; out of reach it stops at full stretch toward the point and never comes off its forearm;
// the hips move with the feet planted; the head turns inside the neck limit; a twist past the wrist limit turns the
// forearm; the weapon node and its second hand follow a dragged fist; the URL and the copied data line give the same pose.
import assert from 'node:assert/strict';
import { startPose, poseFrame, solveOf, handles, readout, poseLine, parsePose, applyUrl, formatPose, dragTo, dragNode, nodeAnchor } from '../src/viewer/pose-state.js';
import { dragLimb, dragHips, dragHead, twist, byName, pivotAt, layoutOf, limbOf, endTurn, jointBend } from '../src/viewer/pose-drag.js';
import { channelsOf } from '../src/render/rig-pose.js';
import { rigFrame, rigMemory } from '../src/render/rig.js';
import { createSlot } from '../src/viewer/sandbox.js';

let fails = 0;
const check = (name, fn) => { try { fn(); console.log('ok  ', name); } catch (e) { fails++; console.log('FAIL', name, '\n   ', e.stack.split('\n').slice(0, 4).join('\n    ')); } };
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
const wrap = (d) => ((d + 540) % 360) - 180;
const drawn = (P, joints) => { const Q = { ...P, joints }; return { Q, c: solveOf(Q), B: byName(poseFrame(Q).L) }; };

const IDLE = startPose({ id: 'rat-raider' }), STRIKE = startPose({ id: 'rat-raider', from: 'ratSlash:43' });
const STAFF = startPose({ id: 'rat-spearman', item: 'a021-staff' });

// Targets round each wrist / ankle: near (inside reach) and far (out of it)
const RING = [];
for (const r of [5, 12, 25, 60, 140]) for (let k = 0; k < 8; k++) RING.push([r * Math.cos(k * Math.PI / 4), r * Math.sin(k * Math.PI / 4)]);

function limbDrags(P, name) {
  check(`${name}: dragged hands and feet land, inside their limits, bend kept, full stretch out of reach`, () => {
    const c = solveOf(P), B0 = byName(poseFrame(P).L);
    for (const end of ['hand-near', 'hand-far', 'foot-near', 'foot-far']) {
      const l = limbOf(end), h = handles(P, poseFrame(P).L).find((x) => x.id === end);
      if (!h || h.kind !== 'limb') continue;
      const W0 = pivotAt(c, B0, end), side0 = Math.sign(jointBend(c, B0, l).bend), strong = Math.abs(jointBend(c, B0, l).bend) > 5;
      let landed = 0, stretched = 0;
      for (const d of RING) {
        // a foot at or below the floor is the floor-line rule's (planted); one above the hip isn't a foot drag
        if (/^foot/.test(end) && (d[1] > -3 || W0[1] + d[1] < pivotAt(c, B0, l.up)[1])) continue;
        const T = [W0[0] + d[0], W0[1] + d[1]], r = dragTo(P, end, T), { c: c2, B } = drawn(P, r.joints), W = pivotAt(c2, B, end);
        const at = `${end} by ${d.map((v) => v.toFixed(1))}`;
        const t = endTurn(c2, B, end);
        assert.ok(Math.abs(t.turn) <= t.lim + 0.5, `${at}: ${/^hand/.test(end) ? 'wrist' : 'ankle'} ${t.turn.toFixed(1)} past ${t.lim}`);
        const F = B[l.lo], Wf = apply(F.base, ...B[end].p.attach);
        assert.ok(dist(W, Wf) < 0.5, `${at}: came off its ${l.lo} by ${dist(W, Wf).toFixed(2)} px`);
        const b = jointBend(c2, B, l);
        if (strong) assert.equal(Math.sign(b.bend), side0, `${at}: ${l.arm ? 'elbow' : 'knee'} flipped (${b.bend.toFixed(1)})`);
        assert.ok(Math.abs(b.bend) <= Math.max(b.lim, Math.abs(jointBend(c, B0, l).bend)) + 0.5, `${at}: bent ${b.bend.toFixed(1)} past ${b.lim}`);
        if (r.stretched) {   // full stretch, pointing at the target (a leg: as near as the floor-line rule's re-solve leaves it)
          const S = pivotAt(c2, B, l.up), E = pivotAt(c2, B, l.lo), tol = l.arm ? [0.5, 1.5] : [1.5, 6];
          assert.ok(dist(S, W) >= dist(S, E) + dist(E, W) - tol[0], `${at}: not at full stretch`);
          assert.ok(Math.abs(wrap(ang(S, W) - ang(S, T))) < tol[1], `${at}: stretched ${wrap(ang(S, W) - ang(S, T)).toFixed(1)} deg off the line to the target`);
          stretched++;
        } else if (!r.folded) {
          assert.ok(dist(W, T) < 0.5, `${at}: landed ${dist(W, T).toFixed(2)} px off`);
          landed++;
        }
      }
      assert.ok(landed >= 6 && stretched >= (l.arm ? 2 : 0), `${end}: ${landed} landed, ${stretched} stretched`);
    }
  });
}
limbDrags(IDLE, 'raider idle');
limbDrags(STRIKE, 'turning slash strike (ratSlash:43)');

check('the start pose draws as the clip frame does (same draw path)', () => {
  const slot = createSlot({ warm: (sb, t) => rigFrame(sb.hero, sb.rig, t, rigMemory(sb.hero), sb.pose ?? undefined) });
  slot.load({ f: 'rat-raider', v: 'current', item: 'own', grip: '', anim: 'ratSlash', flip: false, target: false, look: {}, gear: null });
  const sb = slot.seek(43), G = byName(rigFrame(sb.hero, sb.rig, 43 / 60, rigMemory(sb.hero)).L), B = byName(poseFrame(STRIKE).L);
  for (const n of ['pelvis', 'torso', 'head', 'hand-near', 'hand-far', 'foot-near', 'foot-far', 'held']) {
    if (!G[n]) continue;
    assert.ok(B[n], n);
    const p = (e) => apply(e.m, 0, 0);
    assert.ok(dist(p(G[n]), p(B[n])) < 0.5, `${n} ${dist(p(G[n]), p(B[n])).toFixed(2)} px off the game's frame`);
  }
  assert.equal(STRIKE.swap['@view.torso'], 'F');
});

check('hips: the body moves, the feet stay; too far, the hips stop and the feet still stay', () => {
  const c = solveOf(IDLE), B0 = byName(poseFrame(IDLE).L);
  for (const d of [[6, 4], [-7, 5], [3, 6], [0, -80], [60, 0]]) {
    const r = dragHips(c, d), { Q, c: c2, B } = drawn(IDLE, r.joints);
    for (const ft of ['foot-near', 'foot-far']) assert.ok(dist(pivotAt(c, B0, ft), pivotAt(c2, B, ft)) < 0.6, `${ft} moved ${dist(pivotAt(c, B0, ft), pivotAt(c2, B, ft)).toFixed(2)} px with hips ${d}`);
    if (Math.hypot(...d) < 10) assert.ok(!r.stopped && Math.abs(Q.joints.dx - (IDLE.joints.dx ?? 0) - d[0]) < 1e-6, `hips ${d} should move freely`);
    else assert.ok(r.stopped, `hips ${d} should stop`);
  }
});

check('head: turns on the neck, inside its limit', () => {
  const c = solveOf(IDLE);
  for (const deg of [15, -25, 90, -120]) {
    const r = dragHead(c, deg), { c: c2, B } = drawn(IDLE, r.joints), row = readout({ ...IDLE, joints: r.joints }, poseFrame({ ...IDLE, joints: r.joints }).L).find((x) => x.name === 'neck');
    assert.ok(Math.abs(row.value) <= row.lim + 0.5, `neck ${row.value} with ${deg}`);
    assert.equal(r.clamped, Math.abs(deg) > 45, `clamped ${deg}`);
    assert.ok(c2 && B.head);
  }
});

check('twist: the hand turns to its limit, then the forearm turns the rest', () => {
  const c = solveOf(IDLE), B0 = byName(layoutOf(c)), t0 = endTurn(c, B0, 'hand-far');
  for (const deg of [10, 90, -90]) {
    const r = twist(c, 'hand-far', deg), { c: c2, B } = drawn(IDLE, r.joints), t = endTurn(c2, B, 'hand-far');
    assert.ok(Math.abs(t.turn) <= t.lim + 0.5, `wrist ${t.turn.toFixed(1)}`);
    const world = (BB) => Math.atan2(BB['hand-far'].base[1], BB['hand-far'].base[0]) * 180 / Math.PI;
    if (Math.abs(t0.turn + deg) <= t.lim) assert.ok(Math.abs(wrap(world(B) - world(B0) - deg)) < 0.5 && !r.clamped, `twist ${deg}`);
    else {
      assert.ok(r.clamped && Math.abs(Math.abs(t.turn) - t.lim) < 0.5, `twist ${deg}: wrist ${t.turn.toFixed(1)} should sit at its limit`);
      assert.notEqual(r.joints['arm-far-lower'], IDLE.joints['arm-far-lower'], 'the forearm turns');
    }
  }
});

check('spearman with the staff: the gold fist moves the staff, the second fist stays on its shaft, wrists inside', () => {
  const L0 = poseFrame(STAFF).L, H = handles(STAFF, L0);
  assert.equal(H.find((h) => h.id === 'hand-near').kind, 'node');
  assert.equal(H.find((h) => h.id === 'hand-far').kind, 'shaft');
  const c = solveOf(STAFF), B0 = byName(L0), A0 = nodeAnchor(STAFF, L0);
  // the far wrist's distance from the shaft line (the fist round the shaft keeps it)
  const off = (cc, B, A) => { const a = A.rot * Math.PI / 180, W = pivotAt(cc, B, 'hand-far'); return (W[0] - A.grip[0]) * Math.sin(a) - (W[1] - A.grip[1]) * Math.cos(a); };
  const S = pivotAt(c, B0, 'arm-near-upper'), n = Math.hypot(S[0] - A0.grip[0], S[1] - A0.grip[1]), u = [(S[0] - A0.grip[0]) / n, (S[1] - A0.grip[1]) / n];
  let landed = 0;
  for (const d of [[u[0] * 8, u[1] * 8], [-6, 0], [0, -6], [4, 4], [0, 5], [-4, 2]]) {
    const r = dragNode(STAFF, L0, d), Q = { ...STAFF, joints: r.joints }, L = poseFrame(Q).L, B = byName(L), c2 = solveOf(Q), A = nodeAnchor(Q, L);
    const at = `fist by ${d.map((v) => v.toFixed(1))}`;
    // where both arms and wrists allow, the grip lands; where not, it goes part way and says so
    const miss = Math.hypot(A.grip[0] - A0.grip[0] - d[0], A.grip[1] - A0.grip[1] - d[1]), moved = `${[A.grip[0] - A0.grip[0], A.grip[1] - A0.grip[1]].map((v) => v.toFixed(1))}`;
    assert.ok(miss < 1 || (r.clamped && miss < 0.7 * Math.hypot(...d)), `${at}: the staff's grip moved ${moved}`);
    if (miss < 1) landed++;
    for (const h of ['hand-near', 'hand-far']) { const t = endTurn(c2, B, h); assert.ok(Math.abs(t.turn) <= t.lim + 0.5, `${at}: ${h} wrist ${t.turn.toFixed(1)}`); }
    assert.ok(Math.abs(off(c2, B, A) - off(c, B0, A0)) < 1.5, `${at}: far fist off its shaft by ${(off(c2, B, A) - off(c, B0, A0)).toFixed(2)} px`);
  }
  assert.ok(landed >= 3, `${landed} of 6 fist drags landed`);
});

check('share link and copied data line give back the same pose', () => {
  const c = solveOf(STRIKE), r = dragLimb(c, 'foot-far', [pivotAt(c, byName(layoutOf(c)), 'foot-far')[0] + 3, -20]);
  const P = { ...STRIKE, joints: r.joints, swap: { ...STRIKE.swap, 'hand-far': 'hand-far-open' } };
  const u = parsePose(formatPose(P)), Q = applyUrl(startPose(u), u);
  assert.equal(u.id, 'rat-raider'); assert.equal(u.from, 'ratSlash:43');
  assert.deepEqual(Q.swap, P.swap);
  for (const [k, v] of Object.entries(P.joints)) assert.ok(Math.abs((Q.joints[k] ?? 0) - v) < 0.006, `url ${k}: ${Q.joints[k]} vs ${v}`);
  const line = new Function(`return ${poseLine(P)}`)(), S = { ...channelsOf(P.rig), ...P.rig.poses.stance };
  const { swap, view, order, ...raw } = line, J = { ...S, ...raw };
  for (const [k, v] of Object.entries(P.joints)) assert.ok(Math.abs((J[k] ?? 0) - v) < 0.006, `line ${k}: ${J[k]} vs ${v}`);
  assert.deepEqual({ ...swap, ...Object.fromEntries(Object.entries(view ?? {}).map(([k, v]) => [`@view.${k}`, v])) }, P.swap);
});

check('readout: every jointed limb listed, red only at a limit', () => {
  const rows = readout(IDLE, poseFrame(IDLE).L), names = rows.map((r) => r.name);
  for (const n of ['neck', 'elbow near', 'wrist near', 'knee far', 'ankle far', 'shoulder far', 'hip near']) assert.ok(names.includes(n), n);
  for (const r of rows) if (r.lim != null && r.note !== 'full stretch') assert.equal(r.at, Math.abs(r.value) >= r.lim - 0.5, r.name);
});

console.log(`\n${fails ? fails + ' failed' : 'all passed'}`);
if (fails) process.exitCode = 1;
