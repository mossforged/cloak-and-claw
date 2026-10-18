// Writes tools/bench/pose-seams-known.js (T026 r4) from a full pose seam run: every flag the test sees now, each with the
// art fix it needs (notes by joint). Run it after a pose or art change that the lead accepts as the new baseline, then
// review the diff: a line that went away is a gap fixed; a new one is a gap to fix or to accept.
// Keys: '<fighter> | <clip> | <joint>' for the clips the user judges most (STRICT: idle, walk), '<fighter> | * | <joint>'
// for the rest (the worst over every other clip; the clips at the worst are listed).
// Usage: node tools/pose-seams-known.mjs
import { writeFileSync } from 'node:fs';
import { poseSeams, STRICT } from './bench/pose-seams.js';
import { readAlpha } from './bench/png.mjs';
import { MODELS } from '../src/viewer/models.js';

const NOTE = (id, joint, px) => {
  const rat = id.startsWith('rat'), [p, c] = joint.split(' / ');
  if (!rat) return 'MOUSE';   // the mouse is rebuilt after the rat (rig lock-down order): its seams wait for that
  if (/^arm-.*-upper$/.test(c)) return px >= 9 ? 'ARMPIT' : 'SHOULDER';
  if (/^hand-/.test(c)) return 'WRIST';
  if (/^arm-.*-lower$/.test(c)) return 'ELBOW';
  if (p === 'pelvis' && /^leg-/.test(c)) return 'HIP';
  if (p === 'pelvis' && c === 'torso') return 'WAIST';
  if (/^leg-.*-lower$/.test(c)) return 'KNEE';
  if (/^foot-/.test(c)) return 'ANKLE';
  if (/tail/.test(c)) return 'TAIL';
  if (c === 'head') return 'NECK';
  return 'OTHER';
};
const lines = [];
for (const id of MODELS) {
  const by = new Map();
  for (const s of poseSeams(id, readAlpha)) {
    const key = STRICT.includes(s.clip) ? `${id} | ${s.clip} | ${s.joint}` : `${id} | * | ${s.joint}`, w = by.get(key);
    if (!w || s.px > w.px) by.set(key, { px: s.px, clips: [s.clip], joint: s.joint });
    else if (s.px === w.px) w.clips.push(s.clip);
  }
  for (const [k, w] of [...by].sort(([a], [b]) => a.localeCompare(b)))
    lines.push(`  '${k}': [${w.px}, ${NOTE(id, w.joint, w.px)}${k.includes(' * ') ? `, '${w.clips.slice(0, 3).join(', ')}'` : ''}],`);
}
const head = `// Pose seam flags known at T026 r4 (tests/pose-seams.test.mjs), written by tools/pose-seams-known.mjs, each with the
// fix it needs (the lead turns these into art repairs; A023 round 2 for the rat). The test fails on a flag not listed
// here or one more than 1 px worse; fix the pose or the art, rerun the writer and check the diff.
// Key: 'fighter | clip | joint' (idle, walk) or 'fighter | * | joint' (worst over the other clips); [px, fix, clips at the worst].
// px = the widest gap at that joint (screen px at game size), core or band measure (tools/bench/pose-seams.js).
const SHOULDER = 'longer plain-fur hidden end on the upper arm under the torso (A022 near arm at band 590 / far arm at 110: the end runs out when the arm swings off the master angle)';
const ARMPIT = 'mostly open space under an arm raised off the torso (the band measure cannot tell it from a seam): check the strip; any real crack is SHOULDER';
const WRIST = 'longer wrist end under the bracer (A022 hands): the fist turned or cocked off the forearm line opens it';
const ELBOW = 'rounded / longer forearm top under the upper arm at the elbow';
const HIP = 'thigh tops longer under the pelvis (trouser seat and apron): the thigh swung off the master angle shows the cut (A023 r2: already listed)';
const WAIST = 'torso and pelvis overlap more at the waist (A023 r2: already listed)';
const KNEE = 'longer trouser hem over the shin / rounder shin top (opens when the knee bends past the master)';
const ANKLE = 'longer shin end into the boot (back of the ankle opens at the heel lift / toe-off)';
const TAIL = 'tail root and scarf roots: longer hidden ends under the pelvis / torso';
const NECK = 'longer neck end on the head under the torso fur (head tipped back or down)';
const OTHER = 'see the strip';
const MOUSE = 'mouse: waits for the mouse rebuild (rig lock-down order, after the rat)';
export const KNOWN = {
`;
writeFileSync('tools/bench/pose-seams-known.js', head + lines.join('\n') + '\n};\n');
console.log(`wrote tools/bench/pose-seams-known.js: ${lines.length} known flags`);
