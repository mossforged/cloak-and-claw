// Stretch strip export (T024): the stretch test of the mouse or the rat as one JPG, headless.
// Usage: node tools/stretch-strip.mjs mouse|rat [out.jpg] [--only <label>] [--zoom N]   (default docs/screens/T024/stretch-<body>.jpg;
// --only draws the one cell (~<regexp>: every matching cell), --zoom magnifies: for looking at a flag up close)
// Node builds the cells and flags (tools/bench/stretch.js), tools/stretch_render.py draws them with PIL.
import { writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname } from 'node:path';
import { FAMILIES } from './bench/families.js';
import { stretchCells, flagsOf, drawList, floorLines } from './bench/stretch.js';
import { readAlpha } from './bench/png.mjs';

const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i < 0 ? null : args.splice(i, 2)[1]; };
const only = opt('--only'), zoom = +(opt('--zoom') ?? 1.5);
const body = args[0] ?? 'mouse', out = args[1] ?? `docs/screens/T024/stretch-${body}.jpg`;
const F = FAMILIES[body];
if (!F) { console.error(`unknown body ${body} (${Object.keys(FAMILIES).join(', ')})`); process.exit(1); }
const cells = stretchCells(F.family, F.items).filter((c) => !only || c.label === only || (only.startsWith('~') && new RegExp(only.slice(1)).test(c.label))).map((c) => ({ label: c.label, flags: flagsOf(c, readAlpha), marks: c.marks, floor: !!(c.floor || c.lying), lying: !!c.lying, parts: drawList(c), lines: floorLines(c) }));
const json = out.replace(/\.jpg$/, '.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(json, JSON.stringify({ title: `${F.title}: stretch strip (G2, T024)`, zoom, cells }));
const r = spawnSync('python3', ['tools/stretch_render.py', json, out], { encoding: 'utf8' });
spawnSync('rm', [json]);
if (r.status) { console.error(r.stderr); process.exit(1); }
const flagged = cells.filter((c) => c.flags.length);
console.log(`wrote ${out}: ${cells.length} cells, ${flagged.length} flagged`);
for (const c of flagged) console.log(`  ${c.label}: ${c.flags.join('; ')}`);
