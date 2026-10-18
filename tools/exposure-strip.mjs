// Exposed hidden paint strip (T028 r3): the worst frame of each move (viewer clip; the rehearsal sheet's keys as one
// more "move") for a fighter, drawn by the check itself at 2 px per game px: exposed hidden paint in red, straight
// unoutlined cut edges in blue, each cell labelled with its flags. Headless; the test is tests/exposure.test.mjs.
// Usage: node tools/exposure-strip.mjs <fighter id> [out.jpg] [--clip key,key] [--all] [--edges]
//   --edges: also every visible outline pixel off the reference (cyan), the cut runs' candidates
//   default out: docs/screens/T028/exposure-<id>.jpg; --all: every frame key of the chosen clips
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname } from 'node:path';
import { poseFrames, rehearsalFrames } from './bench/pose-seams.js';
import { frameExposure } from './bench/exposure.js';
import { readRGBA, encodePng } from './bench/png.mjs';
import { refFor } from './bench/exposure-refs.js';
import { FIGHTERS } from '../src/data/fighters/index.js';

const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i < 0 ? null : args.splice(i, 2)[1]; };
const only = opt('--clip')?.split(','), edges = args.includes('--edges') && args.splice(args.indexOf('--edges'), 1), all = args.includes('--all') && args.splice(args.indexOf('--all'), 1);
const [id = 'rat-raider', out = `docs/screens/T028/exposure-${id}.jpg`] = args, ref = refFor(FIGHTERS[id].art.rig);
const frames = [...poseFrames(id, only?.filter((c) => !['rehearsal', 'views'].includes(c))), ...rehearsalFrames(id).filter((f) => !only || only.includes(f.clip))];
const worst = new Map(), cells = [];
for (const fk of frames) {
  const r = frameExposure(fk.cell, readRGBA, { ref }), score = r.exposed.reduce((a, e) => a + e.px2, 0) + r.cuts.reduce((a, c) => a + c.len, 0);
  if (all) cells.push({ fk, score });
  else if (score && (!worst.has(fk.clip) || score > worst.get(fk.clip).score)) worst.set(fk.clip, { fk, score });
}
if (!all) cells.push(...worst.values());
// one sheet: cells of CW x CH game px at 2 px each (labels on top, the figure centred below); labels drawn by PIL
const SS = 2, CW = 190, CH = 270, HEAD = 70, cols = Math.min(6, cells.length), rows = Math.ceil(cells.length / cols);
const W = cols * CW * SS, H = rows * CH * SS, sheet = new Uint8Array(W * H * 4).fill(118), labels = [];
for (let i = 3; i < sheet.length; i += 4) sheet[i] = 255;
cells.forEach(({ fk }, n) => {
  const r = frameExposure(fk.cell, readRGBA, { ref, paint: edges ? 'all' : true }), { image } = r, ox = (n % cols) * CW, oy = Math.floor(n / cols) * CH;
  // the image's origin in screen px = the check's raster box (rebuilt from the frame the same way)
  const bx = Math.round(ox * SS + (CW * SS - image.W) / 2), by = Math.round((oy + HEAD) * SS + ((CH - HEAD) * SS - image.H) / 2);
  for (let y = 0; y < image.H; y++) for (let x = 0; x < image.W; x++) {
    const s = (y * image.W + x) * 4, X = bx + x, Y = by + y;
    if (!image.rgba[s + 3] || X < ox * SS || Y < oy * SS || X >= (ox + CW) * SS || Y >= (oy + CH) * SS) continue;
    sheet.set(image.rgba.subarray(s, s + 4), (Y * W + X) * 4);
  }
  labels.push({ x: ox * SS + 6, y: oy * SS + 4, text: [fk.label, ...r.exposed.map((e) => `${e.part} < ${e.under}: ${e.px2} px²`), ...r.cuts.map((c) => `cut ${c.part}: ${c.len} px`)] });
});
mkdirSync(dirname(out), { recursive: true });
const tmp = out.replace(/\.jpg$/, '.tmp.png');
writeFileSync(tmp, encodePng(W, H, sheet));
writeFileSync(tmp + '.json', JSON.stringify(labels));
const py = `import json,sys
from PIL import Image, ImageDraw, ImageFont
im=Image.open(sys.argv[1]).convert('RGB'); d=ImageDraw.Draw(im)
try: f=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 15)
except OSError: f=ImageFont.load_default()
for L in json.load(open(sys.argv[2])):
  for i,t in enumerate(L['text']): d.text((L['x'],L['y']+i*17),t,fill='white' if i==0 else (255,200,200),font=f,stroke_width=2,stroke_fill='black')
im.save(sys.argv[3], quality=80)`;
const p = spawnSync('python3', ['-c', py, tmp, tmp + '.json', out], { encoding: 'utf8' });
rmSync(tmp); rmSync(tmp + '.json');
if (p.status) { console.error(p.stderr); process.exit(1); }
console.log(`wrote ${out}: ${cells.length} frames`);
