// T032 rat gear for every view (A020 round 3): every gear pick dresses every head / torso drawing (or is listed), the
// dressed drawing replaces the bare one at its own offset while overlays and views still go by the bare drawing,
// headwear and expressions combine, the first dress wins, the hood covers the ears, gear stays on through every
// rehearsal key (turns included), the line-up check is within 2 game px (or listed for Art), and recolour is unchanged
// on the bare drawings while the new ones show as drawn.
import fs from 'node:fs';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { LOADOUTS, COVERS } from '../src/data/looks.js';
import { layoutRig } from '../src/render/rig.js';
import { gearLayout, dressOf } from '../src/render/looks.js';
import { keyFrame } from '../src/viewer/rehearse-frames.js';
import { REHEARSALS } from '../src/data/rehearsal/index.js';
import { UNTINTED, LINEUP, SWAPS, OVERLAYS } from '../src/data/rigs/rat-raider-gear-a020.js';
import HULLS from '../src/data/rigs/hulls.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const rig = RIGS['rat-raider'];
const name = (p) => p?.split('/').pop().replace('.png', '');

// --- every gear pick covers every drawing of its part; the gaps are exactly the listed ones
const LISTED = { 'detail-ear-notch': 'A020: the notch is drawn on the neutral head only' };
const gaps = [];
for (const [g, D] of Object.entries(rig.dress)) {
  for (const d of [D.on, ...Object.keys(rig.parts[D.on].swaps)]) {
    const s = D.views[d];
    if (!s) { gaps.push(`${g} on ${d}`); continue; }
    check(rig.dressed[s]?.of === D.on && rig.dressed[s].drawing === d, `${g}: ${s} dresses ${D.on} drawing ${d}`);
    check(fs.existsSync(rig.dressed[s].img), `${s}: image exists`);
    check(HULLS[rig.dressed[s].img]?.length > 2, `${s}: has a hull (a lying rat rests on it)`);
  }
}
for (const gap of gaps) check(LISTED[gap.split(' on ')[0]], `unlisted gap: ${gap} shows the bare drawing`);
if (gaps.length) console.log(`listed fallbacks (bare drawing): ${gaps.join(', ')}`);
for (const g of ['gear-hood', 'gear-helmet', 'gear-captain-hat']) check(Object.keys(rig.dress[g].views).length === 9, `${g}: all nine heads`);
check(Object.keys(rig.dress['gear-jerkin'].views).length === 7, 'jerkin: all seven torsos');
for (const g of ['gear-sash', 'gear-quiver']) for (const d of ['torso', ...Object.keys(rig.parts.torso.swaps)]) check(rig.views[g].views[d], `${g}: a view for ${d}`);
check(!rig.overlays[rig.views['gear-quiver'].views['torso-front']].img, 'quiver hidden on the front torso (occlusion not proven)');
check(!rig.overlays[rig.views['detail-eyepatch'].views['head-shout']].img, 'no face detail on the shout head yet');
for (const d of ['head-front', 'head-drink']) for (const g of ['detail-eyepatch', 'detail-scar2', 'detail-earring']) check(rig.overlays[rig.views[g].views[d]].img?.includes('/gear-a020/'), `${g} on ${d}: A020's`);

// --- layout: the dressed drawing replaces the bare one at its offset; swap stays bare; order unchanged
const wear = (groups, swap = {}) => gearLayout(rig, layoutRig(rig, {}, swap), groups);
const at = (L, n) => L.find((e) => e.name === n);
for (const [swap, part, want] of [[{}, 'head', 'head-hood'], [{ head: 'head-attack' }, 'head', 'head-attack-hood'], [{ head: 'head-back' }, 'head', 'head-back-hood']]) {
  const bare = at(layoutRig(rig, {}, swap), part), e = at(wear(['gear-hood'], swap), part), o = rig.dressed[want].offset;
  check(name(e.img) === want && e.dressed === want && e.swap === bare.swap && e.order === bare.order, `${JSON.stringify(swap)}: hood -> ${want}`);
  check(Math.abs(e.m[4] - (e.base[0] * o[0] + e.base[2] * o[1] + e.base[4])) < 1e-9 && String(e.base) === String(bare.base), `${want} at its offset on the head's own image`);
}
for (const [code, want] of [['S', 'torso-side-jerkin'], ['F', 'torso-front-jerkin'], ['B', 'torso-back-jerkin'], ['BQ', 'torso-away-jerkin']]) {
  const L = wear(['gear-jerkin', 'gear-sash', 'gear-quiver'], { '@view.torso': code });
  check(name(at(L, 'torso').img) === want, `torso view ${code} -> ${want}`);
  check(name(at(L, 'gear-sash')?.img)?.startsWith('gear-sash'), `torso view ${code}: sash on`);
  check(code === 'F' ? !at(L, 'gear-quiver') : !!at(L, 'gear-quiver'), `torso view ${code}: quiver ${code === 'F' ? 'hidden' : 'on'}`);
}
check(!gearLayout(rig, layoutRig(rig, {}).filter((e) => e.name !== 'head'), ['gear-hood']).some((e) => e.name === 'head'), 'a hidden head stays hidden');
check(String(wear([])) === String(layoutRig(rig, {})), 'no gear: the layout as before');

// --- headwear and expressions combine; the first dress wins; the hood covers the ears
for (const d of Object.keys(rig.parts.head.swaps)) for (const g of ['gear-hood', 'gear-helmet', 'gear-captain-hat'])
  check(dressOf(rig, [g, 'detail-ear-notch'], 'head', d) === rig.dress[g].views[d], `${g} + ${d} -> ${rig.dress[g].views[d]}`);
check(dressOf(rig, ['detail-ear-notch'], 'head', 'head') === 'head-notch' && !dressOf(rig, ['detail-ear-notch'], 'head', 'head-attack'), 'notch on the neutral head only');
check(name(at(wear(['gear-helmet', 'detail-ear-notch']), 'head').img) === 'head-helmet', 'helmet wins over the notch');
check(COVERS['gear-hood'].includes('detail-earring') && !at(wear(['gear-hood', 'detail-earring']), 'detail-earring'), 'the hood covers the earring');
check(!!at(wear(['gear-helmet', 'detail-earring']), 'detail-earring'), 'the helmet leaves the earring');

// --- gear picks per rat type dress every view: every rehearsal key wears it (turns, back views, the slash's F)
for (const [type, groups] of Object.entries(LOADOUTS)) for (const g of groups) check(rig.dress[g] || rig.views[g], `${type}: ${g} is on the rat rig`);
check(String(FIGHTERS['rat-archer'].art.gear) === 'gear-hood,gear-quiver' && String(FIGHTERS['rat-spearman'].art.gear) === 'gear-helmet,gear-jerkin', 'archer and spearman loadouts');
const sheet = REHEARSALS['rat-raider'];
let keys = 0;
for (const gear of [['gear-hood', 'gear-jerkin'], ['gear-captain-hat', 'gear-sash'], ['gear-helmet', 'gear-jerkin']]) {
  for (const sec of sheet.sections) for (const mv of sec.moves) for (const key of mv.keys) {
    const r = keyFrame(sheet, key, gear);
    if (RIGS[r.def.art.rig] !== rig && !RIGS[r.def.art.rig].dress) continue;
    keys++;
    for (const e of r.L.filter((x) => x.name === 'head' || x.name === 'torso')) {
      const want = gear.map((g) => rig.dress[g]).find((D) => D?.on === e.name)?.views[e.swap ?? e.name];
      if (want) check(e.dressed === want, `${gear} ${mv.name} ${key.key}: ${e.name} ${e.swap ?? e.name} dressed as ${want} (got ${e.dressed})`);
    }
  }
}
check(keys > 50, `rehearsal keys checked with gear (${keys})`);

// --- line-up: every point within 2 game px after the import's fix, or listed for Art
const ART = { 'head-back-helmet': 'neck 3.3 game px off after import (weak match: little bare fur round the neck)' };
for (const [s, L] of Object.entries(LINEUP)) {
  const worst = Math.max(0, ...Object.values(L.residual));
  check(worst <= 2 || ART[s], `${s}: line-up ${worst} game px, not listed`);
  check(!ART[s] || worst > 2, `${s}: listed for Art but now within 2 px (drop it from the list)`);
}

// --- recolour: bare drawings as before (head fur masks only); the new drawings show as drawn
check(Object.keys(rig.masks).every((p) => /\/rig\/head[^/]*\.png$/.test(p)), 'masks: the bare heads only, as before T032');
check(!Object.values(rig.dressed).some((s) => rig.masks[s.img]) && !Object.values(OVERLAYS).some((o) => rig.masks[o.img]), 'no mask on a new drawing');
check(String([...Object.keys(SWAPS), ...Object.keys(OVERLAYS)].sort()) === String(UNTINTED), 'every new drawing is on the untinted list');

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
