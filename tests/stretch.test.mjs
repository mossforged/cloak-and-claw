// T024 stretch test (rig standard 8, G2), headless for the mouse and the rat: every cell builds, and the flags are only
// the known art debts in tools/bench/stretch-known.js (each with its fix), none worse by more than 1 px. Any floating or
// sunk foot, lying body off the floor or hidden far hand on a two-hander fails outright.
import { FAMILIES } from '../tools/bench/families.js';
import { stretchCells, flagsOf } from '../tools/bench/stretch.js';
import { KNOWN } from '../tools/bench/stretch-known.js';
import { readAlpha } from '../tools/bench/png.mjs';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const seen = new Set();
for (const [body, F] of Object.entries(FAMILIES)) {
  const cells = stretchCells(F.family, F.items), labels = cells.map((c) => c.label).join();
  check(cells.length > 20, `${body}: stretch cells built (${cells.length})`);
  for (const l of ['knee 90', 'knee 150', 'elbow 90', 'elbow 150', 'arms straight up', 'torso-side', 'torso-back', 'lying (floor)', '0.96x', '1.04x', '1.4x', 'stance (floor)'])
    check(labels.includes(l), `${body}: has a '${l}' cell`);
  for (const c of cells) {
    check(c.L.every((e) => !e.m || e.m.every(Number.isFinite)), `${body} ${c.label}: finite layout`);
    for (const f of flagsOf(c, readAlpha)) {
      const m = f.match(/^seam (.+): ([\d.]+) px$/), key = m && `${body} | ${c.label} | ${m[1]}`;
      if (!m) { check(false, `${body} ${c.label}: ${f}`); continue; }
      seen.add(key);
      check(KNOWN[key], `${body} ${c.label}: new flag ${f}`);
      if (KNOWN[key]) check(+m[2] <= KNOWN[key][0] + 1, `${body} ${c.label}: ${f} (worse than the known ${KNOWN[key][0]} px)`);
    }
  }
}
for (const k of Object.keys(KNOWN)) if (!seen.has(k)) console.log(`NOTE fixed (delete from stretch-known.js): ${k}`);
console.log(failed ? `${failed} failures` : `ALL OK (${seen.size} known flags waiting on art)`);
process.exit(failed ? 1 : 0);
