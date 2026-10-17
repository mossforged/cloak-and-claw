// T028 rehearsal sheet (rig standard 9c): data/rehearsal/rat-raider.js transcribes every move row of
// docs/design/rigs/rat-raider-rehearsal.md; every key's pose, rig, views and drawings resolve; every key lays out
// (finite) with its views; every drawing not game-ready yet (and every stand-in view) gets a box at its part's place;
// the drawings the rig has are drawn (their swap in the layout, or hidden under a whole-limb drawing
// the key names, or replaced by the held weapon's grip hand).
import { readFileSync } from 'node:fs';
import { REHEARSALS } from '../src/data/rehearsal/index.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { VIEW_CODES } from '../src/render/rig-views.js';
import { keyFrame, ready, swapPart } from '../src/viewer/rehearse-frames.js';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const S = REHEARSALS['rat-raider'];
const md = readFileSync(new URL(`../${S.source}`, import.meta.url), 'utf8');
const body = md.slice(md.indexOf('## Key-by-key'), md.indexOf('## What this adds'));
const rows = body.split('\n').filter((l) => l.startsWith('| ') && !/^\| (Move|Pose) \|/.test(l)).map((l) => l.split('|')[1].trim());
const names = S.sections.flatMap((s) => s.moves.map((m) => m.name));
for (const r of rows) check(names.includes(r), `rehearsal row '${r}' is on the sheet`);
check(names.length === rows.length, `sheet has ${names.length} moves, the rehearsal ${rows.length}`);

let keys = 0, boxes = 0;
for (const sec of S.sections) for (const mv of sec.moves) for (const key of mv.keys) {
  const tag = `${mv.name} / ${key.key}`, def = FIGHTERS[key.f ?? S.fighter], rig = RIGS[def.art.rig];
  keys++;
  for (const v of key.view.split('/')) check(VIEW_CODES.includes(v), `${tag}: view ${v} is a view code`);
  const [a, b] = key.pose.split(':');
  check(def.moves[a] ? ['windup', 'through', 'strike', 'recover'].includes(b) : ['idle', 'walk', 'hurt', 'knockdown', 'down', 'getup', 'held'].includes(a) || rig.poses[a], `${tag}: pose '${key.pose}' resolves`);
  const r = keyFrame(S, key);
  check(r.L.every((e) => !e.m || e.m.every(Number.isFinite)), `${tag}: lays out`);
  for (const m of r.missing) { check(m.box && m.box.every(Number.isFinite), `${tag}: box for ${m.name}`); boxes++; }
  // drawn, unless a whole-limb drawing the key also names hides its part (the shield hand under the guard arm)
  // or the held weapon's grip puts its own hand drawing there (the bow's pinch)
  const hidden = (n) => r.L.some((e) => e.p?.swaps?.[e.swap]?.hide?.includes(swapPart(rig, n))) || rig.grips?.[r.held?.grip]?.swap?.[swapPart(rig, n)];
  for (const n of r.ready) if (!rig.parts[n]) check(r.L.some((e) => e.swap === n) || hidden(n), `${tag}: ${n} drawn`);
  for (const n of key.draw) check(ready(rig, n) || r.missing.some((m) => m.name === n), `${tag}: ${n} ready or boxed`);
}
check(keys > 100, `${keys} keys on the sheet`);
console.log(failed ? `${failed} failed` : `rehearsal: ${keys} keys, ${boxes} boxes; all passed`);
process.exit(failed ? 1 : 0);
