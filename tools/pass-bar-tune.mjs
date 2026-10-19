// T029 pass-bar tune report: every frame key of every viewer clip for the rat family, the pose seam measure as before
// (tune off) and tuned (bench/pose-seams.js frameSeams: at the shoulders only gaps between the arm and the torso within
// the arm's width of the pivot; armpit daylight no longer counts). Per clip and shoulder joint: worst seam before and
// after; and per clip the worst seam of any joint before and after (what the pass bar reads).
// Usage: node tools/pass-bar-tune.mjs [out.md] (default docs/screens/T029/pass-bar-tune.md)
import { writeFileSync } from 'node:fs';
import { poseFrames, frameSeams } from './bench/pose-seams.js';
import { readAlpha } from './bench/png.mjs';

const ZERO = ['idle', 'walk', 'walkAcross', 'turn', 'ratSlash'];   // the pass bar's zero-flag clips (tools/pass-bar.mjs)

const OUT = process.argv[2] ?? 'docs/screens/T029/pass-bar-tune.md', IDS = ['rat-raider', 'rat-spearman', 'rat-archer'];
const SHOULDER = /^(torso|shoulder-(near|far)) \/ arm-(near|far)-upper$/;
const rows = [], worst = [];
for (const id of IDS) {
  const clips = new Map();
  for (const fk of poseFrames(id)) {
    const c = clips.get(fk.clip) ?? clips.set(fk.clip, { label: fk.label.replace(/ @\d+$/, ''), j: {}, w: [null, null] }).get(fk.clip);
    [false, true].forEach((tune, i) => {
      for (const s of frameSeams(fk.cell, readAlpha, { tune })) {
        const at = fk.label.match(/@\d+$/)?.[0] ?? '';
        if (!c.w[i] || s.px > c.w[i].px) c.w[i] = { px: s.px, what: s.joint, at };
        if (!SHOULDER.test(s.joint)) continue;
        const r = (c.j[s.joint] ??= [null, null]);
        if (!r[i] || s.px > r[i].px) r[i] = { px: s.px, at };
      }
    });
  }
  for (const [key, c] of clips) {
    for (const [joint, [a, b]] of Object.entries(c.j)) rows.push({ id, key, label: c.label, joint, a, b });
    worst.push({ id, key, label: c.label, a: c.w[0], b: c.w[1] });
  }
}
const v = (x) => (x ? `${x.px} (${x.at})` : '0');
const short = (id) => id.replace('rat-', '');
const cleared = rows.filter((r) => r.a && !r.b), shrunk = rows.filter((r) => r.a && r.b && r.b.px < r.a.px), kept = rows.filter((r) => r.a && r.b && r.b.px >= r.a.px);
const bar = worst.filter((w) => ZERO.includes(w.key));
writeFileSync(OUT, `# T029: pass-bar tune (seam measure at the shoulders)

Written by \`node tools/pass-bar-tune.mjs\` on main's moves (T030's rat, before any T029 pose), every frame key of every
viewer clip. The seam measure counted open space under a raised or swung arm (armpit: between the arm and the torso) as a
seam gap. Tuned (\`tools/bench/stretch.js\` \`LIMB_BODY\`, \`limbReach\`; \`tools/bench/pose-seams.js\` \`frameSeams\`): at a
shoulder (the torso and an upper arm) a gap counts only when **both sides of it are those two pieces** and the gap lies
**within reach of the pivot**, the reach being the arm's own width across its bone at the pivot (at rest). Daylight
further out, beside the arm's shaft, is not a seam. Both measures (the core crack and the joint band) apply it; every
other joint measures as before. The stretch strip (\`tests/stretch.test.mjs\`) is unchanged.

**Shoulder flags (${rows.length} clip / joint pairs on main): ${cleared.length} cleared, ${shrunk.length} smaller, ${kept.length} unchanged.**

## Cleared (armpit daylight, no longer a seam)
| Fighter | Clip | Joint | Before (px) | After |
|---|---|---|---|---|
${cleared.map((r) => `| ${short(r.id)} | ${r.label} | ${r.joint} | ${v(r.a)} | 0 |`).join('\n')}

## Smaller (part of the old flag was daylight)
| Fighter | Clip | Joint | Before (px) | After (px) |
|---|---|---|---|---|
${shrunk.map((r) => `| ${short(r.id)} | ${r.label} | ${r.joint} | ${v(r.a)} | ${v(r.b)} |`).join('\n')}

## Remain (a gap at the shoulder joint itself, within the arm's width of the pivot)
Most are the near shoulder's back edge as the arm swings forward (the vest no longer covers the arm's top). A few read
up to 0.5 px wider than before: their sides are now measured to the arm and torso only, not to the scarf or the held item.
| Fighter | Clip | Joint | Before (px) | After (px) |
|---|---|---|---|---|
${kept.map((r) => `| ${short(r.id)} | ${r.label} | ${r.joint} | ${v(r.a)} | ${v(r.b)} |`).join('\n')}

## Bar clips (zero seams): worst seam of any joint, before and after
| Fighter | Clip | Before | After |
|---|---|---|---|
${bar.map((w) => `| ${short(w.id)} | ${w.label} | ${w.a ? `${w.a.what} ${v(w.a)}` : '0'} | ${w.b ? `${w.b.what} ${v(w.b)}` : '0'} |`).join('\n')}
`);
console.log(`shoulder flags: ${cleared.length} cleared, ${shrunk.length} smaller, ${kept.length} unchanged; wrote ${OUT}`);
