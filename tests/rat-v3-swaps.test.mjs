// T039 rat v3's A028 swaps (hands, heads, feet): every swap in the source is on v3, on the part it `replaces`, a split
// grip's face naming its `pairedWith` under piece; each swap's image sits on the part's own px exactly where its source
// drawing sits on the shared canvas (same canvas, same joint point as the drawing it replaces: offset = the two cuts' trim
// boxes apart x the cut's 0.4, the importer's keying re-measured on the source PNGs); A028's three body repairs are the
// drawings v3 uses; the grip lines are Art's until the user's file exists, and switch to it on a re-run.
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { decodePng } from '../tools/bench/png.mjs';
import V3 from '../src/data/rigs/rat-v3.js';
import * as LINES from '../src/data/rigs/rat-v3-grip-lines.js';

let fails = 0, pending = Promise.resolve();
const check = (name, fn) => { pending = pending.then(async () => { try { await fn(); console.log('ok  ', name); } catch (e) { fails++; console.log('FAIL', name, '\n   ', e.stack.split('\n').slice(0, 4).join('\n    ')); } }); };
const PATH = 'assets/source/A028-rat-v3-kit/rig-source.json', SRC = JSON.parse(readFileSync(PATH, 'utf8')), DIR = dirname(PATH), CUT = 0.4;
const part = (n) => (n === 'tail-1' ? 'tail' : n);

// the importer's trim box top-left (tools/key_green.py: green keyed, alpha > 20; an image with its own alpha keeps it)
function trimOf(img) {
  const { w, h, rgba } = decodePng(join(DIR, img));
  let own = false;
  for (let i = 3; i < rgba.length && !own; i += 4) own = rgba[i] < 255;
  let x0 = w, y0 = h;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4, r = rgba[i], g = rgba[i + 1], b = rgba[i + 2];
    const a = own ? rgba[i + 3] : Math.min(1, Math.max(0, 1 - (g - Math.max(r, b) - 25) / 70)) * 255;
    if (a > 20) { if (x < x0) x0 = x; if (y < y0) y0 = y; }
  }
  return [x0, y0];
}

check('all 31 A028 swaps are on v3, on the part each replaces; split grips name their under piece', () => {
  const names = Object.keys(SRC.swaps);
  assert.equal(names.length, 31);
  for (const [n, s] of Object.entries(SRC.swaps)) {
    const sw = V3.parts[part(s.replaces)]?.swaps?.[n];
    assert.ok(sw, `${n} on ${s.replaces}`);
    assert.equal(sw.img, `assets/art/enemies/rat-raider/rig-v3/${n}.png`);
    assert.equal(sw.under, s.layer === 'in-front-of-item' ? s.pairedWith : undefined, n);
    assert.deepEqual(s.pivot, SRC.parts[s.replaces].pivot, `${n}: its joint is the drawing's it replaces`);
  }
  assert.equal(Object.values(V3.parts).reduce((k, p) => k + Object.keys(p.swaps ?? {}).length, 0), 31);
});

check('each swap sits on its joint exactly like the drawing it replaces (offset = trim boxes apart x 0.4, 0.01 px)', () => {
  const base = {}, bad = [];
  for (const [n, s] of Object.entries(SRC.swaps)) {
    const p = part(s.replaces), b = (base[p] ??= trimOf(SRC.parts[s.replaces].img)), t = trimOf(s.img), o = V3.parts[p].swaps[n].offset;
    const want = [(t[0] - b[0]) * CUT, (t[1] - b[1]) * CUT];
    if (Math.hypot(o[0] - want[0], o[1] - want[1]) > 0.01) bad.push(`${n}: offset ${o} vs ${want}`);
  }
  assert.deepEqual(bad, []);
});

check('A028\'s body repairs (near upper arm, torso, far shin) are the drawings v3 uses', () => {
  for (const n of SRC.repairParts) {
    assert.equal(SRC.parts[n].img, `${n}.png`, `${n} from A028's own folder`);
    assert.equal(V3.parts[n].img, `assets/art/enemies/rat-raider/rig-v3/${n}.png`);
  }
});

check('grip lines: Art\'s until the user\'s file exists (then the user\'s); every grip face with a handle line has one', () => {
  assert.equal(LINES.SOURCE, existsSync('docs/design/rigs/grip-lines-rat-v3.json') ? 'user' : 'art');
  for (const [n, s] of Object.entries(SRC.swaps)) if (s.handleLine && s.layer !== 'behind-item') {
    assert.ok(V3.hands[n], `${n} holds`);
    if (LINES.SOURCE === 'art') {   // Art's line, run one way or the other
      const { a, b } = LINES.DRAWINGS[n], [p, q] = s.handleLine, same = (u, v) => u[0] === v[0] && u[1] === v[1];
      assert.ok((same(a, p) && same(b, q)) || (same(a, q) && same(b, p)), n);
    }
  }
  // T039 r2: the user drew a line on the shield hand (along the strap); Art drew none
  if (LINES.SOURCE === 'user') assert.ok(V3.hands['hand-far-shield'], 'the strap line');
  else assert.equal(V3.hands['hand-far-shield'], undefined);
});

check('T039 r2: the user\'s hands are his canvasA / canvasB, and the fraction reading agrees within 1 px', () => {
  if (LINES.SOURCE !== 'user') return;
  const U = JSON.parse(readFileSync('docs/design/rigs/grip-lines-rat-v3.json', 'utf8')).lines;
  for (const [n, L] of Object.entries(U)) if (L.kind === 'hand') {
    assert.deepEqual(LINES.DRAWINGS[n].a, L.canvasA, n); assert.deepEqual(LINES.DRAWINGS[n].b, L.canvasB, n);
    for (const [f, C] of [[L.a, L.canvasA], [L.b, L.canvasB]]) {
      const P = [L.origin[0] + f[0] * L.cropSize[0], L.origin[1] + f[1] * L.cropSize[1]];
      assert.ok(Math.hypot(P[0] - C[0], P[1] - C[1]) <= 1, `${n} fraction reading ${P} vs ${C}`);
    }
  }
});

check('T039 r2: a user file whose fractions miss its canvas points by more than 1 px is refused', () => {
  const dir = mkdtempSync(join(tmpdir(), 't039-')), bad = join(dir, 'bad.json');
  const L = { kind: 'hand', w: 47, h: 63, a: [0.5, 0.5], b: [0.5, 0.9], origin: [1000, 1000], cropSize: [100, 100], scale: 0.25, canvasA: [1050, 1050], canvasB: [1053, 1090] };
  writeFileSync(bad, JSON.stringify({ lines: { 'hand-far-grip': L } }));
  assert.throws(() => execFileSync(process.execPath, ['tools/v3-grip-lines.mjs', '--user', bad, '--out', join(dir, 'x.mjs')], { stdio: 'pipe' }));
});

check('the user\'s lines file switches the source: hands to canvas by origin + fraction x size / scale, his item lines', async () => {
  const out = join(mkdtempSync(join(tmpdir(), 't039-')), 'lines.mjs');
  execFileSync(process.execPath, ['tools/v3-grip-lines.mjs', '--user', 'tests/fixtures/t039-grip-lines-user.json', '--out', out]);
  const G = await import(pathToFileURL(out).href);
  assert.equal(G.SOURCE, 'user');
  assert.deepEqual(G.DRAWINGS['hand-near-grip'], { part: 'hand-near', a: [396.25, 1387], b: [396.25, 1499] });
  assert.deepEqual(G.ITEMS['rat-cutlass'], { size: [240, 81], a: [0.2, 0.7], b: [0.3, 0.6] });
});
await pending;

console.log(fails ? `${fails} failed` : 'all passed');
process.exit(fails ? 1 : 0);
