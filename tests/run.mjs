// Test runner: runs every tests/*.test.mjs in its own Node process.
// A file that fails to load counts as a FAILURE (never silently skipped).
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(dir).filter((f) => f.endsWith('.test.mjs')).sort();
let failed = 0;
for (const f of files) {
  const r = spawnSync(process.execPath, [join(dir, f)], { encoding: 'utf8' });
  const ok = r.status === 0;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${f}`);
  if (!ok) console.log((r.stdout + r.stderr).split('\n').map((l) => '      ' + l).join('\n'));
}
console.log(`\n${files.length} test files, ${files.length - failed} passed, ${failed} failed`);
process.exit(failed || files.length === 0 ? 1 : 0);
