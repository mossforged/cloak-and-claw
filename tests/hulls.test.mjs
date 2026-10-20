// T037: src/data/rigs/hulls.js is current. Every drawing a rig names where the code reads a hull (parts, their swaps, the
// dressed gear drawings: tools/rig-hulls.mjs imagesOf) has one, and the drawing file is the one the hull was read from
// (the content hash stored beside it). Fix either by re-running `node tools/rig-hulls.mjs`, then
// `node tools/hull-moves.mjs <old hulls.js>` to see what the new outlines move.
import { existsSync } from 'node:fs';
import HULLS, { HASHES } from '../src/data/rigs/hulls.js';
import { hullRigs, imagesOf, fileHash } from '../tools/rig-hulls.mjs';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };

// every problem with a hulls table (H hulls, S hashes) for the rigs' drawings
const named = new Map();   // drawing -> the first rig naming it
for (const [id, rig] of Object.entries(hullRigs())) for (const img of imagesOf(rig)) if (!named.has(img)) named.set(img, id);
const hashNow = new Map([...named.keys()].filter((img) => existsSync(img)).map((img) => [img, fileHash(img)]));
function problems(H, S) {
  const out = [];
  for (const [img, id] of named) {
    if (!existsSync(img)) out.push(`${id}: ${img} does not exist`);
    else if (!(H[img]?.length > 2)) out.push(`${id}: ${img} has no hull`);
    else if (!S[img]) out.push(`${id}: ${img} has no content hash beside its hull`);
    else if (S[img] !== hashNow.get(img)) out.push(`${id}: ${img} changed since its hull was read`);
  }
  for (const img of Object.keys(H)) if (!named.has(img)) out.push(`${img}: a hull no rig names (stale entry)`);
  for (const img of Object.keys(S)) if (!H[img]) out.push(`${img}: a hash with no hull`);
  return out;
}

check(named.size > 100, `the rigs name their drawings (${named.size})`);
for (const p of problems(HULLS, HASHES)) check(false, `${p} (run node tools/rig-hulls.mjs)`);

// the check itself: T030's case (a seat drawing with no hull, a redrawn far foot under its old hull) is caught
const seat = 'assets/art/enemies/rat-raider/rig/seat.png', foot = 'assets/art/enemies/rat-raider/rig/foot-far.png';
const H = { ...HULLS }, S = { ...HASHES, [foot]: '000000000000' };
delete H[seat]; delete S[seat];
const p = problems(H, S);
check(p.some((x) => x.includes(seat) && x.includes('no hull')), 'a named drawing without a hull is caught');
check(p.some((x) => x.includes(foot) && x.includes('changed')), 'a drawing redrawn after its hull was read is caught');
check(p.length === 2, `only those two (${p.length})`);

console.log(failed ? `${failed} failures` : 'hulls: all checks passed');
process.exit(failed ? 1 : 0);
