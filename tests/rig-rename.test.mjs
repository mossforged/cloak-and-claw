// T024 near/far rename: every rig (parts, swaps, grips, every pose's joint numbers) is the T023 data with only the names
// changed (`arm-front-*` -> `arm-near-*`, `*-back-*` limbs/hands/feet -> `*-far-*`; head/torso back views keep theirs).
// tests/fixtures/t023-rigs-front-back.json = RIGS as on main before the rename (overlays/masks left out). Poses T024
// rebuilt on purpose (floor-line rule, A016 drawings, the new walk) are listed in CHANGED and compared nowhere else here.
// The bench reader reads an old-name source exactly as the same source with new names.
import { readFileSync } from 'node:fs';
import { RIGS } from '../src/data/rigs/index.js';
import { nearFar, readSource } from '../tools/bench/source.js';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const url = new URL('./fixtures/t023-rigs-front-back.json', import.meta.url);
const rename = (v) => (Array.isArray(v) ? v.map(rename) : v && typeof v === 'object'
  ? Object.fromEntries(Object.entries(v).map(([k, x]) => [nearFar(k), rename(x)])) : typeof v === 'string' ? nearFar(v) : v);
const old = rename(JSON.parse(readFileSync(url, 'utf8')));

// rig id -> pose paths (dot-separated under `poses`) and part paths (under `parts`) T024 changed on purpose
const CHANGED = {};
const drop = (o, path) => { const ks = path.split('.'), last = ks.pop(), at = ks.reduce((a, k) => a?.[k], o); if (at) delete at[last]; };

for (const [id, r] of Object.entries(RIGS)) {
  const { overlays, views, masks, ...now } = r;
  const was = old[id], cur = JSON.parse(JSON.stringify(now));
  check(was, `${id} in the snapshot`);
  if (!was) continue;
  for (const p of CHANGED[id] ?? []) { drop(was, p); drop(cur, p); }
  const a = JSON.stringify(was), b = JSON.stringify(cur);
  if (a !== b) {
    const keys = new Set([...Object.keys(was.poses ?? {}), ...Object.keys(cur.poses ?? {})]);
    const diff = [...keys].filter((k) => JSON.stringify(was.poses?.[k]) !== JSON.stringify(cur.poses?.[k]));
    const rest = Object.keys({ ...was, ...cur }).filter((k) => k !== 'poses' && JSON.stringify(was[k]) !== JSON.stringify(cur[k]));
    check(false, `${id}: same as T023 with new names (differs in poses ${diff.join(', ') || '-'}; fields ${rest.join(', ') || '-'})`);
  }
  for (const n of Object.keys(r.parts)) check(!/(arm|leg|hand|foot)-(front|back)/.test(n), `${id}: part ${n} uses near/far`);
}

// old spellings in a rig-source.json read exactly as new ones
const src = 'tools/fixtures/mouse-fighter.rig-source.json', json = JSON.parse(readFileSync(new URL(`../${src}`, import.meta.url), 'utf8'));
const asNew = JSON.parse(JSON.stringify(json));
const keyed = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [nearFar(k), v]));
asNew.parts = keyed(asNew.parts); for (const p of Object.values(asNew.parts)) if (p.parent) p.parent = nearFar(p.parent);
asNew.swaps = keyed(asNew.swaps); for (const s of Object.values(asNew.swaps)) s.of = nearFar(s.of);
check(JSON.stringify(readSource(json, src)) === JSON.stringify(readSource(asNew, src)), 'reader: front/back source = near/far source');
check(readSource(json, src).parts['hand-near'] && readSource(json, src).swaps['foot-near-out']?.of === 'foot-near', 'reader: old names come out near/far');
check(readSource(json, src).swaps['torso-back'] && readSource(json, src).swaps['head-back'], 'reader: back views keep their names');

console.log(failed ? `${failed} failures` : 'ALL OK');
process.exit(failed ? 1 : 0);
