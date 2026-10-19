// T034: the near arm's and leg's worst pose seam per move (tools/bench/pose-seams.js), old points vs the user's, for the moves
// the before / after strips show. Run once per side, then merge:
//   node tools/joint-points-compare.mjs --old-joints > scratch/old.json ; node tools/joint-points-compare.mjs > scratch/his.json
//   node tools/joint-points-compare.mjs --table scratch/old.json scratch/his.json  (markdown table on stdout)
// --order [--his-order[=all]]: the wrist's and ankle's seams and exposed hidden paint (bench/exposure-flags.js) in the walk
//   and the grips (idle, turning slash, overhead chop, dash attack), as one JSON line (for the draw-order comparison)
import { readFileSync } from 'node:fs';
import { poseSeams } from './bench/pose-seams.js';
import { readAlpha } from './bench/png.mjs';
import { exposureFlags } from './bench/exposure-flags.js';

export const MOVES = ['idle', 'walk', 'ratSlash', 'overheadChop', 'dashAttack', 'kick', 'jumpUp'];
const NEAR = /(arm-near|hand-near|leg-near|foot-near)/;
const args = process.argv.slice(2);
if (args[0] === '--table') {
  const [A, B] = args.slice(1).map((f) => JSON.parse(readFileSync(f, 'utf8')));
  const joints = [...new Set([...Object.values(A), ...Object.values(B)].flatMap((o) => Object.keys(o)))].sort();
  const out = ['| Move | Joint | Old points (px) | His points (px) |', '|---|---|---|---|'];
  for (const m of MOVES) for (const j of joints) {
    const a = A[m]?.[j], b = B[m]?.[j];
    if (a == null && b == null) continue;
    out.push(`| ${m} | ${j} | ${a ?? '-'} | ${b ?? '-'} |`);
  }
  console.log(out.join('\n'));
} else if (args.includes('--order')) {
  const ONLY = ['walk', 'idle', 'ratSlash', 'overheadChop', 'dashAttack'], END = /(hand-near|foot-near)/, res = { seams: {}, exposed: {} };
  for (const s of poseSeams('rat-raider', readAlpha, ONLY)) if (END.test(s.joint)) res.seams[`${s.clip} | ${s.joint}`] = s.px;
  for (const [k, w] of exposureFlags('rat-raider', ONLY)) if (END.test(k)) res.exposed[k.replace('rat-raider | ', '')] = Math.round(w.px * 10) / 10;
  console.log(JSON.stringify(res));
} else {
  const res = {};
  for (const s of poseSeams('rat-raider', readAlpha, MOVES)) {
    if (!NEAR.test(s.joint)) continue;
    (res[s.clip] ??= {})[s.joint] = Math.max(res[s.clip][s.joint] ?? 0, s.px);
  }
  console.log(JSON.stringify(res));
}
