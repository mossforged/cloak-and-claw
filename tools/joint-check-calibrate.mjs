// T036 calibration: the joint checker on the known Art rounds (out of git history, LFS smudged into a scratch folder).
// Usage: node tools/joint-check-calibrate.mjs [out.md] [--sheets <dir>]   (default docs/screens/T036/calibration.md)
//   A027 r1 (9779df4, its own pivots and ranges): neck at +10/+20 and the near-shoulder notch must flag.
//   A027 r2 (1145a04, Fitting Room v4 joints): the neck must pass.  A026 r3 (e8d5a46): wrist and ankle must pass.
// Needs git + git-lfs (the old images). Exit 1 when a case misses.
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { extractRound } from './bench/git-round.mjs';
import { runCheck } from './joint-check.mjs';
import { contactSheet } from './bench/joint-sheet.js';
import { encodeJpeg } from './bench/jpeg.mjs';
import { JOINT_CHECK } from '../src/data/joint-check.js';

const BODY = ['A026-rat-v3-arm-leg', 'A027-rat-v3-body'];
export const CASES = [
  { id: 'a027-r1', commit: '9779df4', folders: BODY, src: 'A027-rat-v3-body', joints: null,
    expect: [{ joint: 'neck', flag: true, at: [10, 20] }, { joint: 'shoulder-near', flag: true, kind: 'gap', at: [28] }] },
  { id: 'a027-r2', commit: '1145a04', folders: BODY, src: 'A027-rat-v3-body', joints: 'docs/design/rigs/rat-v3-joints-v4.json',
    expect: [{ joint: 'neck', flag: false }] },
  { id: 'a026-r3', commit: 'e8d5a46', folders: ['A026-rat-v3-arm-leg'], src: 'A026-rat-v3-arm-leg', joints: null,
    expect: [{ joint: 'wrist-near', flag: false }, { joint: 'ankle-near', flag: false }] },
];

// did the case come out as expected: flag = some kind failed (at the listed angles / of the listed kind)
export function judge(report, e) {
  const j = report.joints[e.joint];
  if (!j) return { ok: false, got: 'not checked' };
  const kinds = ['gap', 'fragment', 'seam'].filter((k) => !j[k].pass && (!e.kind || k === e.kind));
  const at = (k) => j[k].flagged;
  const peaks = ['gap', 'fragment', 'seam'].map((k) => `${k} ${j[k].peak.share}`).join(', ');
  const got = (kinds.length ? kinds.map((k) => `${k} ${j[k].worst.px}px @${j[k].worst.deg} (${at(k).join(' ')})`).join('; ') : 'pass') + ` [peak share of limit: ${peaks}]`;
  if (!e.flag) return { ok: !kinds.length, got };
  const hit = e.at ? e.at.every((deg) => kinds.some((k) => at(k).includes(deg))) : kinds.length > 0;   // e.at: sampled angles
  return { ok: hit, got };
}

if (import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const args = process.argv.slice(2), si = args.indexOf('--sheets'), sheets = si >= 0 ? args.splice(si, 2)[1] : null;
  const out = args[0] ?? 'docs/screens/T036/calibration.md', rows = [];
  for (const c of CASES) {
    const root = extractRound(c.commit, c.folders);
    const r = runCheck(join(root, c.src, 'rig-source.json'), { joints: c.joints && JSON.parse(readFileSync(c.joints, 'utf8')), only: c.expect.map((e) => e.joint) });
    for (const e of c.expect) rows.push({ c, e, ...judge(r.report, e) });
    if (sheets) { mkdirSync(sheets, { recursive: true }); const s = contactSheet(r.rig, r.results, r.report, { islands: r.islands }); writeFileSync(join(sheets, `${c.id}.jpg`), encodeJpeg(s.w, s.h, s.rgb, 80)); }
  }
  const want = (e) => (e.flag ? `flag${e.kind ? ` ${e.kind}` : ''}${e.at ? ` at ${e.at.map((d) => `+${d}`).join('/')}` : ''}` : 'pass');
  const md = ['# T036 joint checker calibration', '', `Numbers (src/data/joint-check.js): samples ${JOINT_CHECK.samples}, window ${JSON.stringify(JOINT_CHECK.window)},`,
    `gap ${JSON.stringify(JOINT_CHECK.gap)}, fragment ${JSON.stringify(JOINT_CHECK.fragment)}, seam ${JSON.stringify(JOINT_CHECK.seam)}.`, '',
    '| case | joint | expected | got | ok |', '| --- | --- | --- | --- | --- |',
    ...rows.map(({ c, e, got, ok }) => `| ${c.id} (${c.commit}) | ${e.joint} | ${want(e)} | ${got} | ${ok ? 'yes' : '**NO**'} |`), ''];
  writeFileSync(out, md.join('\n'));
  console.log(md.join('\n'));
  process.exit(rows.every((r) => r.ok) ? 0 : 1);
}
