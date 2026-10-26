// T042: CI pulls only the LFS source images the tests read (tools/lfs-needed.mjs), and a test that reads one still a
// pointer fails with "run git lfs pull -I <path>", not a PNG decode error.
import { readFileSync, existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { lfsNeeded } from '../tools/lfs-needed.mjs';
import { decodePng } from '../tools/bench/png.mjs';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };

const L = lfsNeeded();
check(L.includes('assets/source/A018-rat-parts/reference.png') && L.includes('assets/source/A017-rat-setup-master/master-back.png'), 'the paint and exposure masters are pulled');
check(L.includes('assets/source/A026-rat-v3-arm-leg/hand-near.png') && L.includes('assets/source/A028-rat-v3-kit/head-shout.png'), 'v3 swaps and the drawings they replace are pulled');
const S = JSON.parse(readFileSync('assets/source/A028-rat-v3-kit/rig-source.json', 'utf8'));
check(L.filter((f) => f.startsWith('assets/source/A02')).length === new Set(Object.values(S.swaps).flatMap((s) => [s.img, S.parts[s.replaces].img])).size, 'one entry per v3 image the swaps test decodes');
for (const f of L) check(existsSync(f), `${f} exists`);
check(!L.join(',').includes(' '), 'no spaces in the include list');

const dir = mkdtempSync(join(tmpdir(), 't042-')), ptr = join(dir, 'pointer.png');
writeFileSync(ptr, 'version https://git-lfs.github.com/spec/v1\noid sha256:0000\nsize 123\n');
let msg = '';
try { decodePng(ptr); } catch (e) { msg = e.message; }
check(msg.includes(`git lfs pull -I "${ptr}"`), `a pointer says how to pull it (got: ${msg})`);

console.log(failed ? `${failed} failures` : 'ALL OK');
process.exit(failed ? 1 : 0);
