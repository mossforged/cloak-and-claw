// T034: does each swap drawing of the six near parts fit the user's joint points? A swap shares its part's pivot through its
// offset (render/rig-layout.js), so his pivot lands at (pivot - offset) on the swap's own image. Listed per swap: whether
// that point is on the drawing (alpha) or how far off it is, against the old pivot's. "doesn't fit" = his point is more
// than 3 px off the drawing (and more than 6 px further off than the old one was); back-view cuts keep their own points,
// a split grip's under piece has no wrist end (it draws with its face piece).
// Usage: node tools/joint-points-swaps.mjs [out.md]   (default docs/screens/T034/swaps.md)
import { writeFileSync } from 'node:fs';
import { BEFORE_POINTS } from '../src/data/rigs/rat-raider.js';
import { RAT_JOINTS } from '../src/data/rigs/rat-raider-joints.js';
import { readAlpha } from './bench/png.mjs';

const out = process.argv[2] ?? 'docs/screens/T034/swaps.md';
// px from (x, y) to the nearest pixel with alpha > 32 on image A (0 = on it)
function offDrawing(A, x, y) {
  const at = (i, j) => i >= 0 && j >= 0 && i < A.w && j < A.h && A.alpha[j * A.w + i] > 32;
  if (at(Math.round(x), Math.round(y))) return 0;
  for (let r = 1; r < 200; r++) for (let i = -r; i <= r; i++) for (const j of [-r, r]) {
    if (at(Math.round(x + i), Math.round(y + j)) || at(Math.round(x + j), Math.round(y + i))) return r;
  }
  return Infinity;
}
const rows = [], misfits = [];
for (const [part, J] of Object.entries(RAT_JOINTS)) {
  const p = BEFORE_POINTS.parts[part];
  for (const [name, s] of [[part, { img: p.img, offset: [0, 0] }], ...Object.entries(p.swaps ?? {})]) {
    const A = readAlpha(s.img), o = s.offset ?? [0, 0], k = s.scale ?? 1;
    const his = offDrawing(A, (J.pivot[0] - o[0]) / k, (J.pivot[1] - o[1]) / k), old = offDrawing(A, (p.pivot[0] - o[0]) / k, (p.pivot[1] - o[1]) / k);
    const own = /-back$/.test(name), under = /-under$/.test(name), whole = !!s.hide?.length;
    const fits = under ? 'under piece (drawn with its grip face; no wrist end)' : own || his <= 3 || his <= old + 6 ? (own ? 'own points (B view)' : 'fits') : "**doesn't fit**";
    if (/doesn't/.test(fits)) misfits.push(`${name} (${his} px off)`);
    rows.push(`| ${J.joint} | ${name}${whole ? ' (whole limb)' : ''} | ${his === 0 ? 'on' : `${his} px off`} | ${old === 0 ? 'on' : `${old} px off`} | ${fits} |`);
  }
}
writeFileSync(out, ['# T034: swaps on the user\'s joint points', '',
  'Each swap of the six near parts shares the part\'s pivot (through its offset): where his pivot lands on the swap\'s own',
  'drawing, against where the old pivot landed. Off = px from the nearest drawn pixel. Regenerate: `node tools/joint-points-swaps.mjs`.', '',
  `**Doesn't fit:** ${misfits.length ? misfits.join(', ') : 'none'}.`, '',
  '| Joint | Drawing | His pivot | Old pivot | |', '|---|---|---|---|---|', ...rows, ''].join('\n'));
console.log(`wrote ${out}; doesn't fit: ${misfits.join(', ') || 'none'}`);
