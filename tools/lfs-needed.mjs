// T042: the Git LFS source images the headless tests read, as one comma list for `git lfs pull --include` (CI).
// Derived from the sources themselves, so a new swap in A028's rig-source.json is pulled without editing the workflow.
//   node tools/lfs-needed.mjs            -> "a.png,b.png,..."
import { readFileSync } from 'node:fs';
import { join, dirname, normalize } from 'node:path';

// paint check (T026 r3: the A018 reference) and exposure check (T028 r3: the A017 back master)
const MASTERS = ['assets/source/A018-rat-parts/reference.png', 'assets/source/A017-rat-setup-master/master-back.png'];

// tests/rat-v3-swaps.test.mjs: every A028 swap and the drawing it replaces (trim boxes re-measured on the PNGs)
const V3 = 'assets/source/A028-rat-v3-kit/rig-source.json';
function v3Swaps() {
  const S = JSON.parse(readFileSync(V3, 'utf8')), out = [];
  for (const s of Object.values(S.swaps)) out.push(s.img, S.parts[s.replaces].img);
  return out.map((f) => normalize(join(dirname(V3), f)).split('\\').join('/'));
}

export const lfsNeeded = () => [...new Set([...MASTERS, ...v3Swaps()])].sort();

if (import.meta.url === `file://${process.argv[1]}`) console.log(lfsNeeded().join(','));
