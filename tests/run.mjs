// Test runner: runs every tests/*.test.mjs in its own Node process, several at once (T026 r4: the pose seam test alone
// takes ~40 s), and prints the results in file order.
// A file that fails to load counts as a FAILURE (never silently skipped).
import { readdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { availableParallelism } from 'node:os';

const dir = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(dir).filter((f) => f.endsWith('.test.mjs')).sort();
const run = (f) => new Promise((done) => {
  const p = spawn(process.execPath, [join(dir, f)]);
  let out = '';
  p.stdout.on('data', (d) => { out += d; });
  p.stderr.on('data', (d) => { out += d; });
  p.on('close', (code) => done({ ok: code === 0, out }));
});
// the slow files first, so they don't finish last alone
const order = [...files].sort((a, b) => /pose-seams|stretch|viewer/.test(b) - /pose-seams|stretch|viewer/.test(a));
const results = {}, queue = [...order];
await Promise.all(Array.from({ length: Math.max(1, Math.min(availableParallelism() - 1, 8)) }, async () => {
  while (queue.length) { const f = queue.shift(); results[f] = await run(f); }
}));
let failed = 0;
for (const f of files) {
  const { ok, out } = results[f];
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${f}`);
  if (!ok) console.log(out.split('\n').map((l) => '      ' + l).join('\n'));
}
console.log(`\n${files.length} test files, ${files.length - failed} passed, ${failed} failed`);
process.exit(failed || files.length === 0 ? 1 : 0);
