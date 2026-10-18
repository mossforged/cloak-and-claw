// T026 round 2 paint check (rig standard 8, G2): every body in tools/bench/paint-bodies.js, laid out at rest from its
// game-ready cuts, matches its master colour for colour within the A010 rat's numbers (data/paint-check.js limit); and
// the rat's game-ready cuts carry no detached islands (tools/islands.py; needs python3 + Pillow + numpy).
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { PAINT_BODIES, bodyOf } from '../tools/bench/paint-bodies.js';
import { paintCheck } from '../tools/bench/paint.js';
import { readRGBA } from '../tools/bench/png.mjs';
import { PAINT } from '../src/data/paint-check.js';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
// T026 r3: a source image still a Git LFS pointer (a clone without `git lfs pull`) can't be compared: skip that body
const lfsPointer = (f) => readFileSync(f).subarray(0, 40).toString().startsWith('version https://git-lfs');
for (const name of Object.keys(PAINT_BODIES)) {
  const pointers = [bodyOf(name).master, ...bodyOf(name).exclude].filter(lfsPointer);
  if (pointers.length) { console.log(`NOTE ${name} paint check skipped: LFS pointer, not the image (git lfs pull --include "${pointers.join(',')}")`); continue; }
  const r = paintCheck(bodyOf(name), readRGBA), share = (100 * r.strongShare).toFixed(2), region = r.region.gamePx.toFixed(0);
  console.log(`${name}: mean ${r.mean.toFixed(1)}, p95 ${r.p95.toFixed(1)}, strong ${share}%, largest region ${region} game px^2`);
  const K = PAINT.known?.[name], lim = { strongShare: Math.max(PAINT.limit.strongShare, K?.strongShare ?? 0), region: Math.max(PAINT.limit.region, K?.region ?? 0) };
  if (K && (r.strongShare > PAINT.limit.strongShare || r.region.gamePx > PAINT.limit.region)) console.log(`NOTE ${name}: over the limit, known (${K.why})`);
  if (K && r.strongShare <= PAINT.limit.strongShare && r.region.gamePx <= PAINT.limit.region) console.log(`NOTE ${name}: back under the limit: delete PAINT.known.${name}`);
  check(r.strongShare <= lim.strongShare + 1e-4, `${name}: ${share}% of the silhouette paints unlike the master (limit ${100 * PAINT.limit.strongShare}%; map: node tools/paint-map.mjs ${name})`);
  check(r.region.gamePx <= lim.region + 0.5, `${name}: a ${region} game px^2 region paints unlike the master (limit ${PAINT.limit.region}; map: node tools/paint-map.mjs ${name})`);
}
// the check sees a painted disc (the T026 review's hard-edged wrist disc): a flat disc of another paint, 24 cut px
// (6 game px) across, on the torso at rest fails it
if (lfsPointer(bodyOf('rat').master)) console.log('NOTE painted-disc check skipped: the rat master is an LFS pointer');
else {
  const b = bodyOf('rat'), part = b.rig.parts.torso, A = readRGBA(part.img), disc = { ...A, rgba: A.rgba.slice() };
  for (let y = 0; y < A.h; y++) for (let x = 0; x < A.w; x++) if (Math.hypot(x - A.w / 2, y - A.h / 2) < 12) disc.rgba.set([220, 200, 150, 255], (y * A.w + x) * 4);
  const r = paintCheck(b, (p) => (p === part.img ? disc : readRGBA(p)));
  check(r.region.gamePx > PAINT.limit.region, `a painted disc on the torso is caught (${r.region.gamePx.toFixed(0)} game px^2 > ${PAINT.limit.region})`);
}
const py = spawnSync('python3', ['-c', 'import PIL, numpy'], { encoding: 'utf8' });
if (py.status !== 0) console.log('NOTE island check skipped: python3 with Pillow + numpy not available');
else {
  const dir = 'assets/art/enemies/rat-raider/rig', files = readdirSync(dir).filter((f) => f.endsWith('.png')).map((f) => `${dir}/${f}`);
  const r = spawnSync('python3', ['tools/islands.py', ...files], { encoding: 'utf8' });
  check(r.status === 0, `rat cuts without detached islands:\n${r.stdout}`);
}
console.log(failed ? `${failed} failures` : 'ALL OK');
process.exit(failed ? 1 : 0);
