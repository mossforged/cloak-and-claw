// Writes tools/bench/exposure-known.js (T028 r3) from a full exposure run: every flag the test sees now, each with the
// fix it needs (Art's repair list; notes by piece and cover). Run it after a pose or art change the lead accepts as the
// new baseline, then review the diff: a line that went away is fixed; a new one is a problem to fix or to accept.
// Also writes docs/screens/T028/r3-exposure-list.md: the rat family's flags merged (the three rats share A018-A023's
// drawings), per piece and cover, worst first: the list Art repairs from.
// Usage: node tools/exposure-known.mjs
import { writeFileSync } from 'node:fs';
import { exposureFlags } from './bench/exposure-flags.js';
import { MODELS } from '../src/viewer/models.js';

const NOTE = (id, f) => {
  if (!id.startsWith('rat')) return 'MOUSE';
  if (f.cut) return 'CUT';
  const p = f.part, u = f.under;
  if (/^foot-/.test(p)) return 'FOOT_TOP';
  if (/^leg-.*-upper$/.test(p) && /^(pelvis|torso|belt)$/.test(u)) return 'THIGH_TOP';
  if (p === 'pelvis' && /^leg-/.test(u)) return 'SEAT';
  if (/^leg-/.test(p)) return 'KNEE';
  if (/^hand-/.test(p)) return 'WRIST';
  if (/^arm-.*-upper$/.test(p) && /^(torso|shoulder-)/.test(u)) return 'SHOULDER';
  if (/^arm-/.test(p)) return 'ELBOW';
  if (p === 'torso' && /^arm-/.test(u)) return 'CHEST';
  if (p === 'torso' && u === 'head') return 'NECK';
  if ((p === 'torso' && u === 'belt') || (p === 'pelvis' && u === 'torso')) return 'WAIST';
  if (/scarf/.test(p)) return 'SCARF';
  if (/tail/.test(p)) return 'TAIL';
  return 'OTHER';
};
const lines = [], rat = new Map();
for (const id of MODELS) {
  for (const [k, f] of [...exposureFlags(id)].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`  '${k}': [${f.px}, ${NOTE(id, f)}, '${f.label.replace(/'/g, "\\'")}'],`);
    if (!id.startsWith('rat')) continue;
    const what = k.split(' | ')[2], r = rat.get(what) ?? rat.set(what, { what, note: NOTE(id, f), px: 0, n: 0, cut: f.cut, clips: new Set() }).get(what);
    r.n++;
    f.clips.forEach((c) => r.clips.add(c === 'views' || c === 'rehearsal' ? c : c));
    if (f.px > r.px) Object.assign(r, { px: f.px, at: `${id}, ${f.label}` });
  }
}
const head = `// Exposed hidden paint and straight cut edges known at T028 r3 (tests/exposure.test.mjs), written by
// tools/exposure-known.mjs, each with the fix it needs (Art's repair list: A023 round 4 for the rat). The test fails on a
// flag not listed here or one worse than listed (exposure: over 2 game px^2 or 10%; cut: over 1 px); fix the pose or the
// art, rerun the writer and check the diff. Strip of the worst frames: node tools/exposure-strip.mjs <id>.
// Key: 'fighter | clip | piece < cover' (exposed: game px^2 of the piece's hidden paint on top; cover = the piece that
// hid it at rest) or 'fighter | clip | cut piece' (game px long); clip = idle, walk, views (each body view standing),
// rehearsal (the sheet's stand-in keys) or * (worst over every other viewer clip). Value: [px, fix, worst frame].
const FOOT_TOP = 'foot top (hidden under the shin) is wider than the shin: narrow it to the shin hem, or widen the hem, so it stays covered as the ankle turns';
const THIGH_TOP = 'thigh top (hidden under the seat / apron) shows as the thigh swings: trim it to the seat outline or paint it as trouser cloth';
const SEAT = 'pelvis paint under the thigh (reconstruction) shows as the thigh swings: paint it as finished seat cloth with its seam';
const KNEE = 'knee: thigh hem / shin top hidden paint shows as the knee bends: round the shin top, longer trouser hem';
const WRIST = 'wrist end hidden under the bracer shows as the fist turns: shorter, rounded wrist end in the hand drawing';
const SHOULDER = 'upper-arm top hidden under the torso / cap shows as the arm swings: rounded shoulder end, painted as fur';
const ELBOW = 'elbow: forearm top / upper-arm end hidden paint shows as the elbow bends: round both ends';
const CHEST = 'torso paint under the arm (views where the arm draws in front) shows as the arm swings: finish it as chest';
const NECK = 'torso top under the head shows as the head turns: finish the collar / neck fur under the head';
const WAIST = 'waist: torso hem / pelvis top hidden under the belt or jerkin shows as the torso bends: finish it as cloth';
const SCARF = 'scarf tail root hidden under the torso shows as the scarf swings: shorter root, or paint it as cloth';
const TAIL = 'tail root hidden under the pelvis shows as the tail swings: shorter, tapered root';
const CUT = 'straight cut edge showing: outline or round the cut, or extend the piece that covers it';
const OTHER = 'see the strip';
const MOUSE = 'mouse: waits for the mouse rebuild (rig lock-down order, after the rat)';
export const KNOWN = {
`;
writeFileSync('tools/bench/exposure-known.js', head + lines.join('\n') + '\n};\n');
const NOTES = Object.fromEntries([...head.matchAll(/^const (\w+) = '(.*)';$/gm)].map((m) => [m[1], m[2]]));
const row = (r) => `| ${r.cut ? r.what.replace('cut ', '') : r.what.replace(' < ', ' under ')} | ${r.px} | ${r.at} | ${NOTES[r.note]} |`;
const sorted = [...rat.values()].sort((a, b) => b.px - a.px);
writeFileSync('docs/screens/T028/r3-exposure-list.md', `# T028 r3: exposed hidden paint and cut edges, Rat Raider family (Art's repair list)

Written by \`node tools/exposure-known.mjs\` (check: \`tools/bench/exposure.js\`, test \`tests/exposure.test.mjs\`). Every frame key of every
viewer clip for the raider, spearman and archer (they share the A018-A023 drawings), each body view standing, and the
rehearsal sheet's stand-in keys. Worst frame per piece; strips of the worst frame per move:
\`r3-exposure-rat-raider.jpg\`, \`r3-exposure-rat-spearman.jpg\`, \`r3-exposure-rat-archer.jpg\` (exposed paint red, cut runs blue).
Frames named \`view: X\` (the idle in that body view) and rehearsal keys (\`Move: key\`) are stand-in poses until T029
poses every move: their flags are real for those drawings but the pose may change; the viewer clips' flags come first.

## Exposed hidden paint (game px², shown over 4)
"Piece under cover": the piece's paint that the cover hides at rest, showing in the frame.

| Piece under cover | Worst px² | Worst frame | Fix |
|---|---|---|---|
${sorted.filter((r) => !r.cut).map(row).join('\n')}

## Straight cut edges off the reference outline (game px long, 4 or more)

| Piece | Worst px | Worst frame | Fix |
|---|---|---|---|
${sorted.filter((r) => r.cut).map(row).join('\n')}
`);
console.log(`wrote tools/bench/exposure-known.js: ${lines.length} known flags; docs/screens/T028/r3-exposure-list.md`);
