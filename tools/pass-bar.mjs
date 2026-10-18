// T028 r4 pass bar (A023 round 4's gate, Art's handoff): every frame key of every viewer clip for the rat family, measured
// by the unfinished-paint check (bench/exposure.js), its straight-cut-edge check and the pose seam test (bench/pose-seams.js).
// Bar: idle, walk, the turning slash and the turn-around at zero unfinished-paint, cut-edge and seam flags; every other
// move under 20 game px^2 of unfinished paint per piece. Writes docs/screens/T028/r4-pass-bar.md (per clip: worst
// piece, worst cut, worst seam, pass or not) and prints a summary; strips: node tools/exposure-strip.mjs <id>.
// Usage: node tools/pass-bar.mjs [round] (T028 r5: the round names the report and its title: r5 -> r5-pass-bar.md; default r4)
//   T030: a task names its own folder: node tools/pass-bar.mjs T030 -> docs/screens/T030/pass-bar.md (strips: pass-bar-*.jpg)
import { writeFileSync } from 'node:fs';
import { poseFrames, frameSeams } from './bench/pose-seams.js';
import { frameExposure } from './bench/exposure.js';
import { refFor } from './bench/exposure-refs.js';
import { readRGBA, readAlpha } from './bench/png.mjs';
import { FIGHTERS } from '../src/data/fighters/index.js';

export const ZERO = ['idle', 'walk', 'walkAcross', 'turn', 'ratSlash'], OTHER_PX2 = 20;
const IDS = ['rat-raider', 'rat-spearman', 'rat-archer'], R = process.argv[2] ?? 'r4', TASK = /^T\d+$/.test(R);
const OUT = TASK ? `docs/screens/${R}/pass-bar.md` : `docs/screens/T028/${R}-pass-bar.md`, TITLE = TASK ? R : `T028 ${R}`, STRIPS = TASK ? 'pass-bar-rat-*.jpg' : `${R}-exposure-rat-*.jpg`;
const rows = [], fails = [];
for (const id of IDS) {
  const ref = refFor(FIGHTERS[id].art.rig), clips = new Map();
  for (const fk of poseFrames(id)) {
    const c = clips.get(fk.clip) ?? clips.set(fk.clip, { label: fk.label.replace(/ @\d+$/, ''), paint: null, cut: null, seam: null, frames: 0 }).get(fk.clip);
    c.frames++;
    const r = frameExposure(fk.cell, readRGBA, { ref });
    for (const e of r.exposed) if (!c.paint || e.px2 > c.paint.px) c.paint = { px: e.px2, what: `${e.part} < ${e.under}`, at: fk.label };
    for (const x of r.cuts) if (!c.cut || x.len > c.cut.px) c.cut = { px: x.len, what: x.part, at: fk.label };
    for (const s of frameSeams(fk.cell, readAlpha)) if (!c.seam || s.px > c.seam.px) c.seam = { px: s.px, what: s.joint, at: fk.label };
  }
  for (const [key, c] of clips) {
    const zero = ZERO.includes(key), pass = zero ? !c.paint && !c.cut && !c.seam : !c.paint || c.paint.px < OTHER_PX2;
    rows.push({ id, key, zero, pass, ...c });
    if (!pass) fails.push(`${id} ${c.label}`);
  }
}
const cell = (x) => (x ? `${x.what} ${x.px} (${x.at.split(' @')[1] ? '@' + x.at.split(' @')[1] : x.at})` : '0');
const table = (list) => ['| Fighter | Clip | Bar | Unfinished paint (worst piece, px²) | Cut edge (px) | Seam (px) | Pass |', '|---|---|---|---|---|---|---|',
  ...list.map((r) => `| ${r.id.replace('rat-', '')} | ${r.label} | ${r.zero ? 'zero' : `< ${OTHER_PX2} px²`} | ${cell(r.paint)} | ${cell(r.cut)} | ${cell(r.seam)} | ${r.pass ? 'yes' : '**no**'} |`)].join('\n');
writeFileSync(OUT, `# ${TITLE}: pass bar (rat family; art: the A023 round imported on this branch)

Written by \`node tools/pass-bar.mjs\`: every frame key of every viewer clip, through the unfinished-paint check (T028 r4:
exposed hidden paint counts only when flat or beside a straight cut), the straight-cut-edge check and the pose seam test
(both unchanged from round 3), with the user's grip lines in place. Bar: idle, walk, the turning slash (ratSlash) and the
turn-around at zero flags of all three kinds; every other move under ${OTHER_PX2} game px² of unfinished paint per piece
(cut edges and seams listed there for the record). Strips of the worst frame per move: \`${STRIPS}\`.

**Result: ${fails.length ? `${fails.length} clips miss the bar` : 'every clip passes'}.**

## Bar clips (zero flags)
${table(rows.filter((r) => r.zero))}

## Every other move (under ${OTHER_PX2} px² of unfinished paint per piece)
${table(rows.filter((r) => !r.zero))}
`);
console.log(`pass bar: ${rows.filter((r) => r.pass).length} of ${rows.length} clips pass${fails.length ? `; missing: ${fails.join(', ')}` : ''}`);
console.log(`wrote ${OUT}`);
