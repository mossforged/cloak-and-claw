// T016 rig bench: the old (A002) mouse fixture builds a rig whose joints stay joined (at rest on the master's points, and in every
// strip pose); biped-poses names only standard parts; missing standard parts are skipped but still turn their children;
// the draft importer (tools/rig_from_source.py) writes a rig with the same joints.
import { readFileSync, mkdtempSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { BIPED, BIPED_PARTS, BIPED_PARENTS, POSE_CHANNELS } from '../src/data/rigs/biped-poses.js';
import { readSource, buildRig, stripAt, stripFrames, stripLength, rigJointsOf, swapsOf } from '../tools/bench/source.js';
import { layoutRig } from '../src/render/rig.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed++; console.log('FAIL', msg); } };
const near = (a, b, eps = 1e-6) => Math.abs(a[0] - b[0]) < eps && Math.abs(a[1] - b[1]) < eps;
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

const url = 'tools/fixtures/mouse-fighter-a002.rig-source.json';   // T023: the old A002 mouse (no pelvis/hands/feet)
const src = readSource(JSON.parse(readFileSync(join(root, url), 'utf8')), url);
ok(src.errors.length === 0, `fixture reads cleanly: ${src.errors}`);
ok(src.root === 'torso', 'mouse root is the torso');
ok(['pelvis', 'hand-front', 'hand-back', 'foot-front', 'foot-back'].every((n) => src.missing.includes(n)), 'missing standard parts listed');
ok(src.extras.includes('sword') && src.extras.includes('shield'), 'extras listed');
for (const p of Object.values(src.parts)) ok(existsSync(join(root, p.img)), `image exists: ${p.img}`);
ok(existsSync(join(root, src.master)), 'master exists');

// trimmed boxes as the bench makes them (A002's real trims) so offsets are exercised
const BOX = { torso: [478, 510], head: [365, 80], 'scarf-tail': [345, 408], tail: [110, 574], 'arm-front-upper': [412, 529],
  'arm-front-lower': [325, 636], sword: [2, 718], 'arm-back-upper': [811, 575], 'arm-back-lower': [871, 631], shield: [925, 481],
  'leg-back-upper': [803, 855], 'leg-back-lower': [864, 934], 'leg-front-upper': [405, 849], 'leg-front-lower': [249, 933] };
const boxes = {};
for (const [n, [x, y]] of Object.entries(BOX)) boxes[src.parts[n].img] = [x, y, x + 300, y + 300];
boxes[src.swaps['head-attack'].img] = [365, 80, 1038, 601];
const top = 79, height = 128;
const rig = buildRig(src, { boxes, top, height });
ok(Math.abs(rig.scale - height / (src.floorY - top)) < 1e-9, 'scale fits game height');

// At rest (all joints 0) every part sits where it is on the canvas: its pivot and image corner land on the master's points.
const rest = Object.fromEntries(layoutRig(rig, {}, {}).map((e) => [e.name, e]));
for (const [n, p] of Object.entries(src.parts)) {
  const e = rest[n];
  ok(near(apply(e.m, rig.parts[n].pivot), rig.canvasToScreen(p.pivot)), `${n}: joint on the master's point at rest`);
  ok(near(apply(e.m, [0, 0]), rig.canvasToScreen(boxes[p.img])), `${n}: image placed at its canvas spot`);
  if (p.parent) ok(near(apply(e.m, rig.parts[n].pivot), apply(rest[p.parent].m, rig.parts[n].attach)), `${n}: joint on parent's joint at rest`);
}
// the swap image lands where the head does (shares the pivot)
const sw = layoutRig(rig, {}, { head: 'head-attack' }).find((e) => e.name === 'head');
ok(sw.img === src.swaps['head-attack'].img && near(apply(sw.m, [0, 0]), rig.canvasToScreen([365, 80])), 'swap shares the canvas');

// Every strip frame: joints stay joined, numbers finite.
for (let t = 0; t < stripLength(); t += 1 / 30) {
  const s = stripAt(t);
  const joints = rigJointsOf(src, s.joints);
  ok(Object.values(joints).every(Number.isFinite), `finite joints at ${t.toFixed(2)}`);
  ok(layoutRig(rig, joints, swapsOf(src, s.swap)).length === Object.keys(src.parts).length, `every part drawn at ${t.toFixed(2)}`);
  const L = Object.fromEntries(layoutRig(rig, joints).map((e) => [e.name, e]));   // swaps change only the image, not the joints
  for (const [n, p] of Object.entries(src.parts)) {
    if (!p.parent) continue;
    const a = apply(L[n].m, rig.parts[n].pivot), b = apply(L[p.parent].m, rig.parts[n].attach);
    if (!near(a, b, 1e-6)) { ok(false, `${n} came off ${p.parent} at t=${t.toFixed(2)} (${s.pose})`); break; }
  }
}

// biped-poses: only standard parts and known channels; swaps on standard parts; strip names real poses.
for (const [name, pose] of Object.entries(BIPED.poses)) {
  for (const k of Object.keys(pose)) ok(BIPED_PARTS.includes(k) || POSE_CHANNELS.includes(k), `pose ${name}: ${k} is a standard part`);
  for (const k of Object.keys(pose.swap ?? {})) ok(BIPED_PARTS.includes(k), `pose ${name}: swap on standard part ${k}`);
}
for (const st of BIPED.strip) ok(BIPED.poses[st.pose] && st.in >= 0 && st.hold >= 0, `strip step ${st.pose}`);
const labels = stripFrames().map((f) => f.label).join();
for (const l of ['stance', 'idle breath', 'walk', 'windup', 'strike', 'follow-through', 'hurt', 'knockdown', 'down', 'get-up'])
  ok(labels.includes(l), `strip frame ${l}`);
ok(BIPED_PARENTS.pelvis === null && BIPED_PARENTS['foot-front'] === 'leg-front-lower', 'standard skeleton');

// A full standard rig gets the pose's angles as they are; the mouse (legs on the torso, no pelvis) gets each leg's
// absolute angle unchanged, and no joint for parts he lacks.
const strike = stripAt(stripFrames().find((f) => f.label === 'strike').t).joints;
const full = { parts: Object.fromEntries(Object.entries(BIPED_PARENTS).map(([n, p]) => [n, { parent: p }])) };
const fj = rigJointsOf(full, strike);
for (const n of BIPED_PARTS) ok(Math.abs(fj[n] - (strike[n] ?? 0)) < 1e-9, `standard rig keeps ${n}`);
const mj = rigJointsOf(src, strike);
ok(Math.abs(mj.torso - ((strike.pelvis ?? 0) + strike.torso)) < 1e-9, 'pelvis turn goes to the mouse root');
ok(Math.abs(mj.torso + mj['leg-front-upper'] - ((strike.pelvis ?? 0) + strike['leg-front-upper'])) < 1e-9, 'mouse leg keeps its standard angle');
ok(!('hand-front' in mj), 'missing part has no joint');
ok(Object.keys(swapsOf(src, { head: ['head-ko', 'head-hurt'], 'hand-front': ['hand-front-grip'] })).join() === 'head', 'swap fallback; missing hand skipped');
ok(swapsOf(src, { head: ['head-ko', 'head-hurt'] }).head === 'head-hurt', 'first swap the character has');

// Draft importer on the fixture (needs python3 + Pillow; CI has neither, so it says so instead).
const py = spawnSync('python3', ['-c', 'import PIL, numpy'], { encoding: 'utf8' });
if (py.status !== 0) console.log('NOTE importer check skipped: python3 with Pillow + numpy not available');
else {
  const out = mkdtempSync(join(tmpdir(), 'rig-import-'));
  const r = spawnSync('python3', ['tools/rig_from_source.py', url, '--id', 'mouse-bench', '--art', join(out, 'art'), '--out', join(out, 'mouse-bench.js'), '--height', '128'],
    { cwd: root, encoding: 'utf8' });
  ok(r.status === 0, `importer runs: ${r.stderr}`);
  if (r.status === 0) {
    const drafted = (await import(pathToFileURL(join(out, 'mouse-bench.js')))).default;
    ok(Object.keys(drafted.parts).length === Object.keys(src.parts).length, 'importer writes every part');
    ok(drafted.parts.head.swaps['head-attack'], 'importer writes swaps');
    for (const n of Object.keys(src.parts)) ok(existsSync(join(out, 'art', `${n}.png`)), `importer keyed ${n}`);
    const L = Object.fromEntries(layoutRig(drafted, {}, {}).map((e) => [e.name, e]));
    for (const [n, p] of Object.entries(src.parts)) {
      const at = apply(L[n].m, drafted.parts[n].pivot), want = rig.canvasToScreen(p.pivot);
      ok(near(at, [want[0], want[1]], 0.6), `imported ${n} joint on the master's point (${at.map((v) => v.toFixed(2))} vs ${want.map((v) => v.toFixed(2))})`);
    }
  }
}

// T023: the bench's mouse fixture is the A013 mouse in game: on the standard (nothing missing, pelvis root), and its
// whole-arm swaps' extra fields reach the importer's output (hide, item grip, slot axis) as in the game rig.
{
  const u = 'tools/fixtures/mouse-fighter.rig-source.json', s13 = readSource(JSON.parse(readFileSync(join(root, u), 'utf8')), u);
  ok(s13.errors.length === 0 && s13.root === 'pelvis' && s13.missing.length === 0, `A013 fixture: on the standard (${s13.errors} / missing ${s13.missing})`);
  for (const p of Object.values(s13.parts)) ok(existsSync(join(root, p.img)), `A013 image exists: ${p.img}`);
  const r13 = buildRig(s13, { top: 0, height: 130 }), R = Object.fromEntries(layoutRig(r13, {}, {}).map((e) => [e.name, e]));
  for (const [n, p] of Object.entries(s13.parts)) if (p.parent) ok(near(apply(R[n].m, r13.parts[n].pivot), apply(R[p.parent].m, r13.parts[n].attach)), `A013 ${n}: joint on parent's joint at rest`);
  if (py.status === 0) {
    const out = mkdtempSync(join(tmpdir(), 'rig-import-'));
    const r = spawnSync('python3', ['tools/rig_from_source.py', u, '--id', 'mouse-13', '--art', join(out, 'art'), '--out', join(out, 'mouse-13.js'), '--height', '130'], { cwd: root, encoding: 'utf8' });
    ok(r.status === 0, `importer runs on A013: ${r.stderr}`);
    if (r.status === 0) {
      const d = (await import(pathToFileURL(join(out, 'mouse-13.js')))).default;
      const game = (await import(pathToFileURL(join(root, 'src/data/rigs/mouse-fighter.js')))).default;
      for (const [part, sw] of [['arm-front-upper', 'arm-front-raised'], ['arm-back-upper', 'arm-back-guard']]) {
        const a = d.parts[part].swaps[sw], g = game.parts[part].swaps[sw];
        ok(a.hide?.length === 2 && near(a.grip, g.grip, 0.01) && a.axis === g.axis, `importer keeps ${sw}'s hide / grip / axis (as in the game rig)`);
      }
      for (const [n, h] of Object.entries(d.hands ?? {})) ok(game.hands[n] && near(h.at, game.hands[n].at, 0.01) && h.axis === game.hands[n].axis, `importer writes grip hand ${n} (as in the game rig)`);
      ok(Object.keys(d.hands ?? {}).length === 3, 'importer writes the three grip hands');
      ok(Math.abs(d.scale - game.scale) < 1e-4 && Math.abs(d.rootY - game.rootY) < 1e-3, 'game rig scale/rootY = importer output at 130 px');
    }
  }
}

console.log(failed ? `${failed} failed` : 'rig bench ok');
process.exit(failed ? 1 : 0);
