// T026 r4 pose seam test: every frame key of every animation button the model viewer has, for each rigged fighter (the
// three rats and the mouse), measured at every joint (tools/bench/pose-seams.js: the stretch strip's core seam measure +
// the joint-band measure); fails on a seam gap over 2 px not in tools/bench/pose-seams-known.js, or one more than 1 px
// worse than listed. The strip of each fighter's worst frames: node tools/pose-seam-strip.mjs <id>.
import { poseSeams, STRICT } from '../tools/bench/pose-seams.js';
import { KNOWN } from '../tools/bench/pose-seams-known.js';
import { readAlpha } from '../tools/bench/png.mjs';
import { MODELS } from '../src/viewer/models.js';

let failed = 0, flags = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const seen = new Set();
check(['rat-raider', 'rat-spearman', 'rat-archer', 'mouse-fighter'].every((id) => MODELS.includes(id)), 'the rats and the mouse are viewer models');
for (const id of MODELS) {
  const seams = poseSeams(id, readAlpha);
  for (const s of seams) {
    flags++;
    const key = STRICT.includes(s.clip) ? `${id} | ${s.clip} | ${s.joint}` : `${id} | * | ${s.joint}`, k = KNOWN[key];
    seen.add(key);
    check(k, `${id} ${s.label}: new seam gap ${s.joint} ${s.px} px (${s.by})`);
    if (k) check(s.px <= k[0] + 1, `${id} ${s.label}: ${s.joint} ${s.px} px (${s.by}), worse than the known ${k[0]} px`);
  }
}
// the round-4 idle: the gaps the user saw (crotch, waist, far trouser leg) closed by pose; only the shoulders' short
// hidden ends stay (art)
for (const k of Object.keys(KNOWN)) if (k.startsWith('rat-raider | idle |')) check(/arm-(near|far)-upper$/.test(k), `rat idle: only shoulder seams are known (${k})`);
for (const k of Object.keys(KNOWN)) if (!seen.has(k)) console.log(`NOTE fixed (rerun tools/pose-seams-known.mjs): ${k}`);
console.log(failed ? `${failed} failures` : `ALL OK (${flags} seam flags, all known: ${seen.size} keys waiting on art)`);
process.exit(failed ? 1 : 0);
