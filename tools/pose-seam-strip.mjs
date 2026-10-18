// Pose seam strip (T026 r4): the worst frame of each move (viewer clip) for a fighter, with its seam flags and a red ring
// on each gap, as one JPG (tools/stretch_render.py draws it). Headless; the test is tests/pose-seams.test.mjs.
// Usage: node tools/pose-seam-strip.mjs <fighter id> [out.jpg] [--zoom N] [--clip key,key] [--all]
//   default out: docs/screens/T026/pose-seams-<id>.jpg; --all: one cell per frame key of the chosen clips (not just the worst)
import { writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname } from 'node:path';
import { poseFrames, frameSeams } from './bench/pose-seams.js';
import { drawList } from './bench/stretch.js';
import { readAlpha } from './bench/png.mjs';
import { KNOWN } from './bench/pose-seams-known.js';

const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i < 0 ? null : args.splice(i, 2)[1]; };
const zoom = +(opt('--zoom') ?? 1.5), only = opt('--clip')?.split(','), all = args.includes('--all') && args.splice(args.indexOf('--all'), 1);
const [id = 'rat-raider', out = `docs/screens/T026/pose-seams-${id}.jpg`] = args;
const worst = new Map(), cells = [];
for (const fk of poseFrames(id, only)) {
  const seams = frameSeams(fk.cell, readAlpha), top = Math.max(0, ...seams.map((s) => s.px));
  const cell = { label: fk.label, flags: seams.sort((a, b) => b.px - a.px).map((s) => `${KNOWN[`${id} | ${fk.clip} | ${s.joint}`] ? '' : 'NEW '}${s.joint} ${s.px} (${s.by})`),
    marks: seams.map((s) => s.at), floor: false, lying: fk.cell.p.rot && Math.abs(fk.cell.p.rot) > 1, parts: drawList(fk.cell), lines: [] };
  if (all) cells.push(cell);
  else if (!worst.has(fk.clip) || top > worst.get(fk.clip).top) worst.set(fk.clip, { top, cell });
}
if (!all) cells.push(...[...worst.values()].map((w) => w.cell));
const json = out.replace(/\.jpg$/, '.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(json, JSON.stringify({ title: `${id}: worst frame per move, seam gaps over 2 px (pose seam test, T026 r4)`, zoom, cells }));
const r = spawnSync('python3', ['tools/stretch_render.py', json, out], { encoding: 'utf8' });
spawnSync('rm', [json]);
if (r.status) { console.error(r.stderr); process.exit(1); }
console.log(`wrote ${out}: ${cells.length} cells, ${cells.filter((c) => c.flags.length).length} with gaps`);
