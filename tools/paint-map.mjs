// Paint check maps (T026 round 2, rig standard 8): for each body in data/paint-check.js (or the ones named), the rest
// assembly, the master and the difference map side by side (map: the master in grey, colour steps over PAINT.strong in
// red, milder in yellow; the largest strong region boxed), saved as JPG (quality 80) with the numbers printed, and the
// body's idle height (T026 r2: top of the drawn body above the feet, game px).
// Usage: node tools/paint-map.mjs [body ...] [--out docs/screens/T026]
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { PAINT_BODIES, bodyOf } from './bench/paint-bodies.js';
import { paintCheck } from './bench/paint.js';
import { readRGBA, encodePng } from './bench/png.mjs';
import { PAINT } from '../src/data/paint-check.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { heightOf } from './bench/height.js';
import { readAlpha } from './bench/png.mjs';

const args = process.argv.slice(2), i = args.indexOf('--out'), dir = i < 0 ? 'docs/screens/T026' : args.splice(i, 2)[1];
mkdirSync(dir, { recursive: true });
for (const name of args.length ? args : Object.keys(PAINT_BODIES)) {
  const r = paintCheck(bodyOf(name), readRGBA), { W, H } = r, img = new Uint8Array(W * 3 * H * 4);
  const put = (x, y, c) => img.set(c, (y * W * 3 + x) * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const j = (y * W + x) * 4, over = (buf, q) => buf[j + q] + 128 * (1 - buf[j + 3]);   // over neutral grey
    put(x, y, [over(r.render, 0), over(r.render, 1), over(r.render, 2), 255]);
    put(W + x, y, [over(r.master, 0), over(r.master, 1), over(r.master, 2), 255]);
    const lum = (r.master[j] + r.master[j + 1] + r.master[j + 2]) / 3, g = 90 + 0.5 * (lum + 128 * (1 - r.master[j + 3])) / 2, d = r.diff[y * W + x];
    put(2 * W + x, y, d > PAINT.strong ? [255, 40, 40, 255] : d > PAINT.strong / 2 ? [250, 210, 60, 255] : [g, g, g, 255]);
  }
  const b = r.region.box;
  if (b) for (let x = b[0]; x < b[2]; x++) for (const y of [b[1], b[3] - 1]) put(2 * W + x, y, [0, 200, 255, 255]);
  if (b) for (let y = b[1]; y < b[3]; y++) for (const x of [b[0], b[2] - 1]) put(2 * W + x, y, [0, 200, 255, 255]);
  const png = `${dir}/paint-${name}.png`, jpg = png.replace(/\.png$/, '.jpg');
  writeFileSync(png, encodePng(W * 3, H, img));
  const py = spawnSync('python3', ['-c', 'import sys; from PIL import Image; Image.open(sys.argv[1]).convert("RGB").save(sys.argv[2], quality=80)', png, jpg]);
  rmSync(png);
  if (py.status) { console.error(String(py.stderr)); process.exit(1); }
  const def = Object.values(FIGHTERS).find((d) => d.art?.rig === bodyOf(name).rig.id), tall = def ? `, idle ${heightOf(def, bodyOf(name).rig, readAlpha).toFixed(1)} px tall` : '';
  console.log(`${jpg}: mean ${r.mean.toFixed(1)}, p95 ${r.p95.toFixed(1)}, strong ${(100 * r.strongShare).toFixed(2)}%, largest region ${r.region.gamePx.toFixed(0)} game px^2 at ${b}${tall}`);
}
