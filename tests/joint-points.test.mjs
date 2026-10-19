// T034: the user's joint points and limits for the rat's near arm and leg (docs/design/rigs/joint-points-rat.json).
// The points are on the rig as he placed them (and the file's old points were the rig's); at rest each near part's pivot
// sits on its parent's attach; every other view keeps its own shoulder / hip points and the back view its cuts; switches off = the rig
// as it was; the draw-order switch puts the hand over the forearm and the foot over the shin. Limits: every clip and
// rehearsal key of the rat body stays inside the user's ranges except the known list (tools/bench/joint-limits-known.js,
// none > 1 deg worse), the near wrist always inside -42..17.
import { readFileSync } from 'node:fs';
import { RIGS } from '../src/data/rigs/index.js';
import rat, { BEFORE_POINTS } from '../src/data/rigs/rat-raider.js';
import { RAT_JOINTS, RAT_BODY, orderPicks } from '../src/data/rigs/rat-raider-joints.js';
import { withJointPoints } from '../src/data/rigs/joint-points.js';
import { layoutRig, apply } from '../src/render/rig-layout.js';
import { VIEW_CODES } from '../src/render/rig-views.js';
import { turnRange } from '../src/data/pose-limits.js';
import { wristLimit } from '../src/data/wrists.js';
import { limitFrames, worstPast } from '../tools/bench/joint-limits.js';
import KNOWN from '../tools/bench/joint-limits-known.js';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const near = (a, b, t = 1e-6) => Math.abs(a[0] - b[0]) < t && Math.abs(a[1] - b[1]) < t;

// the file, the data and the rig agree
const FILE = JSON.parse(readFileSync('docs/design/rigs/joint-points-rat.json', 'utf8')).joints;
for (const j of Object.values(FILE)) {
  const d = RAT_JOINTS[j.child];
  check(d && d.joint && FILE[d.joint] === j, `${j.child}: in rat-raider-joints.js under its joint name`);
  check(near(d.pivot, j.pivot) && near(d.attach, j.attach) && d.lo === j.limits.lo && d.hi === j.limits.hi && d.front === j.front, `${j.child}: points, limits and draw order as the file`);
  check(near(BEFORE_POINTS.parts[j.child].pivot, j.rigPivot) && near(BEFORE_POINTS.parts[j.child].attach, j.rigAttach), `${j.child}: the file's old points are the importer's`);
  check(near(rat.parts[j.child].pivot, j.pivot) && near(rat.parts[j.child].attach, j.attach), `${j.child}: the rig uses his points`);
  for (const id of RAT_BODY) check(near(RIGS[id].parts[j.child].pivot, j.pivot), `${id}: ${j.child} on his points (one body)`);
  const R = turnRange(rat, j.child);
  check(R && R[0] === j.limits.lo && R[1] === j.limits.hi, `${j.child}: range in the joint-limit data`);
}
check(JSON.stringify(wristLimit(rat, 'near', 'hand-near-grip')) === JSON.stringify([-42, 17]) && wristLimit(rat, 'near', 'hand-near-grip-overhand') === 45 && wristLimit(rat, 'far') === 45,
  'wrist limits: near -42..17 (his) on the drawings that hang as drawn, the turned overhand fist and the far hand 45 (as before)');
check(turnRange(RIGS['mouse-fighter'], 'hand-near') == null && wristLimit(RIGS['mouse-fighter'], 'near') === 45, 'the mouse keeps its limits');

// at rest (Q) each near part's pivot is on its parent's attach
const by = (L) => Object.fromEntries(L.map((e) => [e.name, e]));
{
  const B = by(layoutRig(rat, {}));
  for (const n of Object.keys(RAT_JOINTS)) {
    const p = rat.parts[n], P = apply(B[n].base, ...p.pivot), A = apply(B[p.parent].base, ...p.attach);
    check(near(P, A, 1e-6), `rest: ${n}'s pivot on its parent's attach`);
  }
}
// every other view keeps its own points: its upper arm / thigh (on that view's shoulder / hip anchor) and the back view's
// limb cuts are drawn at rest exactly where they were; the elbow, wrist, knee and ankle elsewhere are his (same drawings)
for (const slot of ['torso', 'pelvis']) for (const code of VIEW_CODES) {
  if (code === 'Q' || !rat.bodyViews[slot][code]) continue;
  const sw = { [`@view.${slot}`]: code }, A = by(layoutRig(BEFORE_POINTS, {}, sw)), B = by(layoutRig(rat, {}, sw));
  for (const n of Object.keys(RAT_JOINTS)) {
    if (!A[n] || (slot === 'torso') !== /^(arm|hand)/.test(n)) continue;
    const own = /-upper$/.test(n) || code === 'B', same = A[n].m.every((v, i) => Math.abs(v - B[n].m[i]) < 1e-6);
    if (own) check(same, `${slot} ${code}: ${n} drawn where it was (the view's own point)`);
    else check(near(apply(B[n].base, ...rat.parts[n].pivot), apply(B[rat.parts[n].parent].base, ...rat.parts[n].attach)), `${slot} ${code}: ${n} on his points`);
  }
}
// switches
check(withJointPoints(BEFORE_POINTS, RAT_JOINTS, { points: false, order: [] }, orderPicks) === BEFORE_POINTS, 'switches off: the rig as it was');
{
  const R = withJointPoints(BEFORE_POINTS, RAT_JOINTS, { points: true, order: ['wrist-near', 'ankle-near'] }, orderPicks), L = layoutRig(R, {});
  const ix = (n) => L.findIndex((e) => e.name === n);
  check(ix('hand-near') > ix('arm-near-lower') && ix('foot-near') > ix('leg-near-lower'), 'his order: hand over the forearm, foot over the shin');
  const L0 = layoutRig(rat, {}), ix0 = (n) => L0.findIndex((e) => e.name === n);
  check(ix0('hand-near') < ix0('arm-near-lower') && ix0('foot-near') < ix0('leg-near-lower'), 'default order: rig standard 5b.1 (bracer over the hand, shin over the foot)');
}

// limits: every frame, the known list only
let flags = 0, frames = 0;
const seen = new Set();
for (const id of RAT_BODY) {
  const F = limitFrames(id);
  frames += F.length;
  for (const f of F) for (const r of f.j) if (r.joint === 'wrist-near' && !r.exempt) check(r.past <= 0.5, `${id} ${f.label}: near wrist ${r.swap} ${r.turn.toFixed(1)} past ${r.range.join('..')}`);
  for (const [k, v] of Object.entries(worstPast(id, F))) {
    flags++; seen.add(k);
    check(KNOWN[k] != null, `${k}: ${v.label} turns ${v.turn.toFixed(1)} (range ${v.range.join('..')}), ${v.past.toFixed(1)} past: not in the known list`);
    check(KNOWN[k] == null || v.past <= KNOWN[k] + 1, `${k}: ${v.past.toFixed(1)} past, known ${KNOWN[k]}: worse`);
  }
}
const gone = Object.keys(KNOWN).filter((k) => !seen.has(k));
console.log(`joint limits: ${frames} frames, ${flags} known flags${gone.length ? `, ${gone.length} cleared (rerun tools/joint-limits-report.mjs --known): ${gone.join('; ')}` : ''}`);
console.log(failed ? `${failed} failures` : 'all joint point checks passed');
process.exit(failed ? 1 : 0);
