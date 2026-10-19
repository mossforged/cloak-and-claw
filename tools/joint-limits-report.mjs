// T034: every clip and rehearsal key that turns a near joint past the user's range (tools/bench/joint-limits.js), worst frame
// per clip and joint, as docs/screens/T034/limits.md; `--known` also rewrites the test's known list
// (tools/bench/joint-limits-known.js). Usage: node tools/joint-limits-report.mjs [out.md] [--known]
import { writeFileSync } from 'node:fs';
import { limitFrames, worstPast } from './bench/joint-limits.js';
import { RAT_BODY, RAT_JOINTS } from '../src/data/rigs/rat-raider-joints.js';

const args = process.argv.slice(2), known = args.includes('--known'), out = args.find((a) => a.endsWith('.md')) ?? 'docs/screens/T034/limits.md';
const ORDER = ['hip-near', 'knee-near', 'ankle-near', 'shoulder-near', 'elbow-near', 'wrist-near'];   // the legs first (packet)
const rows = [], all = {};
for (const id of RAT_BODY) {
  const frames = limitFrames(id), W = worstPast(id, frames);
  Object.assign(all, W);
  let exempt = 0;
  for (const f of frames) for (const r of f.j) if (r.exempt) exempt++;
  rows.push({ id, frames: frames.length, exempt, W });
}
const md = ['# T034 joint limits: clips past the user\'s ranges', '',
  'Every frame of every viewer clip and every rehearsal key, measured on the drawn layout (turn on the parent, degrees from the',
  'rest assembled on his points, + = clockwise on screen; the wrist from the hand drawing\'s neutral). Worst frame per clip and',
  'joint; "past" = degrees outside the range. Whole-limb drawings (arm keys, knee-up, kneeling) and the back view\'s cuts are',
  'exempt. Regenerate: `node tools/joint-limits-report.mjs [--known]`.', '',
  '| Joint | Range |', '|---|---|', ...Object.values(RAT_JOINTS).map((j) => `| ${j.joint} | ${j.lo}..${j.hi} |`), ''];
for (const { id, frames, exempt, W } of rows) {
  md.push(`## ${id} (${frames} frames, ${Object.keys(W).length} clip x joint past, ${exempt} exempt joint-frames)`, '', '| Joint | Clip | Frame | Turn | Past |', '|---|---|---|---|---|');
  const list = Object.entries(W).sort(([a], [b]) => ORDER.indexOf(a.split(' | ')[2]) - ORDER.indexOf(b.split(' | ')[2]) || a.localeCompare(b));
  for (const [k, v] of list) { const [, clip, joint] = k.split(' | '); md.push(`| ${joint} | ${clip} | ${v.label} | ${v.turn.toFixed(1)} | ${v.past.toFixed(1)} |`); }
  md.push('');
}
writeFileSync(out, md.join('\n'));
console.log(`wrote ${out}: ${Object.keys(all).length} clip x joint past`);
if (known) {
  const lines = Object.entries(all).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `  '${k}': ${Math.ceil(v.past * 10) / 10},`);
  writeFileSync('tools/bench/joint-limits-known.js', ['// T034: known joint-limit flags (tools/joint-limits-report.mjs --known): \'fighter | clip | joint\' -> degrees past the',
    '// user\'s range at its worst frame (docs/screens/T034/limits.md). tests/joint-limits.test.mjs fails on any other, or one > 1 deg worse.',
    '// Each is a pose the user\'s ranges don\'t cover yet (his call: widen the range or re-pose), see the T034 report.',
    'export default {', ...lines, '};', ''].join('\n'));
  console.log('wrote tools/bench/joint-limits-known.js');
}
