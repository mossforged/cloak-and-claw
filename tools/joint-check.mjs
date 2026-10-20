// T036 joint checker for Art deliveries. Node only (no browser, no Python).
// Usage: node tools/joint-check.mjs <rig-source.json> [--joints <joints.json>] [--out <dir>] [--only joint,joint]
//   Assembles the pieces at rest (the source's pivots, or the joints file's points and ranges), turns each joint through
//   its range (9 samples) with everything below it, and checks a window round the joint point for gaps / notches,
//   detached fragments and seam lines (new against rest), plus each PNG's own detached islands.
//   Writes <out>/joint-check.json (pass / fail per joint and kind, worst sample) and <out>/joint-check.jpg (flagged crops,
//   phone-sized). Default out: the source's folder. Exit 1 when anything fails. Numbers: src/data/joint-check.js.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { decodePng } from './bench/png.mjs';
import { loadRig, pieceIslands } from './bench/joint-rig.js';
import { checkJoint } from './bench/joint-check.js';
import { summarize } from './bench/joint-report.js';
import { contactSheet } from './bench/joint-sheet.js';
import { encodeJpeg } from './bench/jpeg.mjs';
import { JOINT_CHECK } from '../src/data/joint-check.js';

export function runCheck(srcPath, { joints = null, only = null, cfg = JOINT_CHECK } = {}) {
  const src = JSON.parse(readFileSync(srcPath, 'utf8')), dir = dirname(srcPath);
  const rig = loadRig(src, { joints, read: decodePng, resolve: (img) => join(dir, img), cfg });
  const results = rig.joints.filter((j) => !only || only.includes(j.name)).map((j) => checkJoint(rig, j, cfg));
  const islands = pieceIslands(rig, cfg);
  return { rig, results, islands, ...summarize(results, islands, rig.notes, cfg) };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : null; };
  const jointsPath = opt('--joints'), outOpt = opt('--out'), only = opt('--only')?.split(',');
  const [srcPath] = args;
  if (!srcPath) { console.log('usage: node tools/joint-check.mjs <rig-source.json> [--joints <joints.json>] [--out <dir>] [--only a,b]'); process.exit(2); }
  const out = resolve(outOpt ?? dirname(srcPath));
  const r = runCheck(srcPath, { joints: jointsPath ? JSON.parse(readFileSync(jointsPath, 'utf8')) : null, only });
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, 'joint-check.json'), JSON.stringify({ source: srcPath, joints: jointsPath, ...r.report }, null, 1) + '\n');
  const sheet = contactSheet(r.rig, r.results, r.report, { islands: r.islands });
  writeFileSync(join(out, 'joint-check.jpg'), encodeJpeg(sheet.w, sheet.h, sheet.rgb, 80));
  for (const l of r.lines) console.log(l);
  const shown = relative(process.cwd(), out) || '.';
  console.log(`${r.report.pass ? 'PASS' : 'FAIL'}: ${join(shown, 'joint-check.json')}, ${join(shown, 'joint-check.jpg')}`);
  process.exit(r.report.pass ? 0 : 1);
}
