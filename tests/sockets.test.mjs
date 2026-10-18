// T024 sockets (rig standard 9a): every rig declares the eight sockets; at game size they sit where they should
// (head top over the mouth over the chest over the feet, tail behind, hand on the held item's grip, weapon tip at the
// item's far end), follow whole-limb swaps (the raised arm's fist) and the importer's derived values are what the rigs carry.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { RIGS } from '../src/data/rigs/index.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { layoutRig, heldOf } from '../src/render/rig.js';
import { targetPose } from '../src/render/rig-pose.js';
import { socketPoints, tipOf } from '../src/render/sockets.js';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const size = (img) => { const b = readFileSync(img); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const NAMES = ['hand_near', 'hand_far', 'weapon_tip', 'chest', 'head_top', 'feet', 'mouth', 'tail_tip'];
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

for (const [id, rig] of Object.entries(RIGS)) {
  for (const n of NAMES) check(rig.sockets?.[n], `${id}: declares ${n}`);
  const def = Object.values(FIGHTERS).find((d) => d.art?.rig === id);
  if (!def) continue;
  const f = { def, state: 'idle', t: 0, move: null };
  const tp = targetPose(f, rig, 0), held = heldOf(f, rig), L = layoutRig(rig, tp.joints, tp.swap, held), S = socketPoints(rig, L, held, size);
  for (const n of NAMES) check(S[n]?.every(Number.isFinite), `${id} idle: ${n} placed (${S[n]?.map((v) => v.toFixed(1))})`);
  if (!S.head_top) continue;
  check(S.head_top[1] < S.mouth[1] && S.mouth[1] < S.chest[1] && S.chest[1] < S.feet[1], `${id}: head top over mouth over chest over feet`);
  check(Math.abs(S.feet[1]) < 1.5, `${id} idle: feet socket on the floor line (${S.feet[1].toFixed(2)})`);
  check(S.mouth[0] > S.head_top[0] - 2 && S.tail_tip[0] < S.chest[0] - 20, `${id}: mouth to the front, tail tip behind`);
  check(S.head_top[1] < -def.art.height * 0.8, `${id}: head top near the top of the figure (${S.head_top[1].toFixed(1)} of ${def.art.height})`);
  if (held?.part) {
    const e = L.find((x) => x.name === held.slot), grip = apply(e.m, held.kit.art.grip);
    check(dist(S.weapon_tip, grip) > 0.4 * held.kit.art.px * Math.max(...size(held.kit.art.img)), `${id}: weapon tip at the far end of the ${held.kit.id}`);
  }
}

// Mouse: the near hand socket is the sword's grip; with the whole raised arm on (cast) it moves to that drawing's fist.
{
  const def = FIGHTERS['mouse-fighter'], rig = RIGS[def.art.rig];
  for (const state of ['idle', 'cast']) {
    const f = { def, state: 'idle', t: 0, move: null }, tp = targetPose(f, rig, 0, state === 'cast' ? 'cast' : undefined);
    const held = heldOf(f, rig), L = layoutRig(rig, tp.joints, tp.swap, held), S = socketPoints(rig, L, held, size);
    const sword = L.find((e) => e.name === 'sword');
    check(S.hand_near && dist(S.hand_near, apply(sword.m, sword.p.pivot)) < 1.5, `mouse ${state}: hand_near on the sword's grip (${S.hand_near && dist(S.hand_near, apply(sword.m, sword.p.pivot)).toFixed(2)} px)`);
  }
}
// tipOf: an item's own tip wins; otherwise the handle line leaves the drawing (the sword: blade end, not the pommel)
check(tipOf({ tip: [1, 2] }).join() === '1,2', 'tipOf: art.tip');
check(tipOf({ img: 'x', grip: [10, 50], gripEnd: [20, 50] }, () => [100, 100]).join() === '100,50', 'tipOf: along the handle to the edge');

// The game rigs carry the importer's sockets (derived, or the source's own: A018; needs python3 + Pillow + numpy).
const py = spawnSync('python3', ['-c', 'import PIL, numpy'], { encoding: 'utf8' });
if (py.status !== 0) console.log('NOTE importer socket check skipped: python3 with Pillow + numpy not available');
else for (const [id, srcDir, ...frags] of [['mouse-fighter', 'A013-mouse-fighter-standard'], ['rat-raider', 'A018-rat-parts', 'A019-rat-key-drawings', 'A022-rat-joint-repair']]) {
  const merge = frags.flatMap((f) => ['--merge', `assets/source/${f}/rig-source.json`]);   // T026 r2: the rat's fragments, as imported
  const r = spawnSync('python3', ['tools/rig_from_source.py', `assets/source/${srcDir}/rig-source.json`, '--id', id, '--sockets', ...merge], { encoding: 'utf8' });
  const sk = (0, eval)(`({${r.stdout.trim().replace(/,$/, '')}})`).sockets;
  for (const [n, s] of Object.entries(sk)) check(JSON.stringify(s) === JSON.stringify(RIGS[id].sockets[n]), `${id}: ${n} as derived by the importer`);
}

console.log(failed ? `${failed} failures` : 'ALL OK');
process.exit(failed ? 1 : 0);
