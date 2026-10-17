// Hold strip (T025): bodies x held items x grip modes, drawn as the game draws them (render/rig.js rigFrame with forced
// grip modes), headless, as a JPG (tools/stretch_render.py), with each cell's hold flags (tests/weapon-hold.test.mjs's
// holdFlags) in red. Usage: node tools/hold-strip.mjs <body> <out.jpg> [cell ...]
//   body: mouse | rat (every item the body can hold, every grip mode, in idle / walk / windup / strike)
//   --only <regexp>: only cells whose label matches; --zoom N (default 1.2)
import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { holdCells } from './bench/hold.js';

const [body, out, ...rest] = process.argv.slice(2), only = rest.indexOf('--only'), title = rest[0]?.startsWith('--') ? null : rest[0];
const pick = only >= 0 ? new RegExp(rest[only + 1]) : null, zoom = rest.includes('--zoom') ? +rest[rest.indexOf('--zoom') + 1] : 1.2;
const cells = holdCells(body).filter((c) => !pick || pick.test(c.label)).map((c) => ({ label: c.label, flags: c.flags.map((x) => x.text), marks: c.flags.map((x) => x.at), floor: true,
  lines: [], strokes: c.strokes, parts: c.parts }));
const json = out.replace(/\.jpg$/, '.json');
writeFileSync(json, JSON.stringify({ title: title ?? `T025 hold sheet: ${body} (items x grip modes; red = hold flag)`, zoom, cells }));
const r = spawnSync('python3', ['tools/stretch_render.py', json, out], { encoding: 'utf8' });
spawnSync('rm', [json]);
if (r.status) { console.error(r.stderr); process.exit(1); }
console.log(`wrote ${out}: ${cells.length} cells, ${cells.reduce((a, c) => a + c.flags.length, 0)} flags`);
