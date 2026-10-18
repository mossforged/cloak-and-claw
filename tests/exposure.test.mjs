// T028 r3 exposed-hidden-paint test (rig standard 5b.6; tools/bench/exposure.js): for every rigged fighter, every frame
// key of every viewer clip, each body view standing and the rehearsal sheet's keys: hidden paint (the cut ends a joint's
// cover hides at rest) showing over 4 game px^2, or a straight cut edge off the reference outline 4 px or longer. Fails
// on a flag not in tools/bench/exposure-known.js or one worse than listed. Strip: node tools/exposure-strip.mjs <id>.
import { exposureFlags } from '../tools/bench/exposure-flags.js';
import { KNOWN } from '../tools/bench/exposure-known.js';
import { frameExposure, hiddenZone } from '../tools/bench/exposure.js';
import { refOf, refFor, notes } from '../tools/bench/exposure-refs.js';
import { readRGBA } from '../tools/bench/png.mjs';
import { MODELS, rigOf } from '../src/viewer/models.js';
import { layoutRig } from '../src/render/rig-layout.js';
import { channelsOf } from '../src/render/rig-pose.js';

let failed = 0, flags = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const seen = new Set();
// first, in the writer's order: the poses depend on how many fighters the sim made before (an idle's phase follows the
// fighter's id), so the run must match tools/exposure-known.mjs call for call
const all = new Map();
for (const id of MODELS) {
  for (const [key, f] of exposureFlags(id)) {
    all.set(key, f);
    flags++;
    seen.add(key);
    const k = KNOWN[key];
    check(k, `${id} ${f.label}: new ${f.cut ? 'cut edge' : 'exposed hidden paint'} ${key.split(' | ')[2]} ${f.px} ${f.cut ? 'px' : 'px²'}`);
    if (k) check(f.px <= (f.cut ? k[0] + 1 : Math.max(k[0] + 2, k[0] * 1.1)), `${id} ${f.label}: ${key.split(' | ')[2]} ${f.px}, worse than the known ${k[0]}`);
  }
}
const rig = rigOf('rat-raider'), ref = refFor('rat-raider');
const restCell = (views = {}, drop = []) => ({ rig, k: 1, view: [1, 0, 0, 1, 0, 0], swap: views, held: null,
  L: layoutRig(rig, { ...channelsOf(rig) }, views).filter((e) => !drop.includes(e.name)) });

// the rest assembly shows no hidden paint by definition, in every view
for (const v of ['Q', 'S', 'F', 'BQ', 'B']) {
  const views = { '@view.torso': v, '@view.pelvis': rig.bodyViews.pelvis[v] ? v : 'Q' }, r = frameExposure(restCell(views), readRGBA, { ref });
  check(!r.exposed.length, `rest ${v}: nothing exposed (${r.exposed.map((e) => e.part).join(', ')})`);
}
// the foot top really is hidden under the shin at rest, and with the shin gone it shows (a flag), its cut too
check(hiddenZone(rig, 'Q/Q', 'foot-far', null, rig.parts['foot-far'].img, 1, readRGBA).deep.some((d) => d), 'far foot has a hidden top under its shin');
const noShin = frameExposure(restCell({}, ['leg-near-lower']), readRGBA, { ref });
check(noShin.exposed.some((e) => e.part === 'foot-near' && e.under === 'leg-near-lower'), 'near shin removed: the near foot top shows');
check(noShin.exposed.some((e) => e.part === 'leg-near-upper'), 'near shin removed: the thigh\'s hidden hem shows');
check(frameExposure(restCell({}, ['leg-far-lower']), readRGBA, { ref }).cuts.some((c) => c.part === 'foot-far'), 'far shin removed: the far foot top\'s straight cut shows');
check(frameExposure(restCell({ '@view.torso': 'B', '@view.pelvis': 'B' }, ['torso']), readRGBA, { ref }).cuts.some((c) => c.part === 'pelvis'), 'B, torso removed: the back pelvis\' straight top cut shows');
// the references: Q on the master as the paint check lays it, B moved onto A017's back reference by a small shift
const q = refOf(rig, 'rat-raider', 'Q/Q', 1), b = refOf(rig, 'rat-raider', 'B/B', 1);
if (q) check(q.off.join() === '0,0', 'Q reference: the paint check\'s mapping');
if (b) check(Math.hypot(...b.off) < 40, `B reference aligned by a small shift (${b.off})`);
// T028 r2's problem (the lead's walk frame 2: foot tops below the trousers) is found
check([...all.keys()].some((k) => /\| walk \| foot-(near|far) < leg-/.test(k)), 'the walk\'s exposed foot tops (T028 r2 review) are flagged');

for (const n of notes) console.log('NOTE', n);
for (const k of Object.keys(KNOWN)) if (!seen.has(k)) console.log(`NOTE fixed (rerun tools/exposure-known.mjs): ${k}`);
console.log(failed ? `${failed} failures` : `ALL OK (${flags} flags, all known: Art's repair list in tools/bench/exposure-known.js)`);
process.exit(failed ? 1 : 0);
