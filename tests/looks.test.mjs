// Rat gear and individual looks (T019). A seeded run gives the same looks every time, and different rats differ; looks
// never change the fight (a run with looks stripped from every def plays out frame for frame the same); every overlay a
// loadout or variety list can show exists for every head/torso drawing it can appear with, and every mask matches its
// image's size; gear follows the head/torso swaps and hides with its part; tints keep shading and leave unmasked pixels.
import fs from 'node:fs';
import { createWorld, stepWorld } from '../src/sim/world.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { LOOKS, LOADOUTS, RAT_LOOKS, CHANNELS, PALETTES } from '../src/data/looks.js';
import { pickLook } from '../src/sim/looks.js';
import { createRng } from '../src/core/rng.js';
import { layoutRig } from '../src/render/rig.js';
import { RAT_A010 } from '../src/data/rigs/a010/index.js';
import { gearLayout, gearOf, tintPixels, rgbHsl, hexRgb } from '../src/render/looks.js';
import { botControl } from './bot.mjs';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const pngSize = (p) => { const b = fs.readFileSync(p); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };

// --- seeded run: same looks every time; a fight's numbers don't depend on looks
function run(seed, frames = 60 * 90) {
  const w = createWorld('harbor-market', 'mouse-fighter', seed), seen = new Map();
  let h = 0;
  for (let i = 0; i < frames && !w.over; i++) {
    stepWorld(w, botControl(w));
    for (const f of w.fighters) { if (f.ai && !seen.has(f.id)) seen.set(f.id, JSON.stringify([f.def.id, f.look])); h = (h * 31 + Math.round(f.x * 100) + f.hp) % 1e9; }
  }
  return { looks: [...seen.values()], hash: h, kos: w.kos, hp: w.player.hp };
}
const a = run(1), b = run(1);
check(a.looks.length >= 8, `enough rats spawned to compare (${a.looks.length})`);
check(JSON.stringify(a.looks) === JSON.stringify(b.looks), 'a seeded run gives the same looks every time');
check(new Set(a.looks).size >= a.looks.length * 0.6, `rats differ (${new Set(a.looks).size} distinct of ${a.looks.length})`);
check(a.looks.every((s) => JSON.parse(s)[1]), 'every spawned rat has a look');
const saved = Object.values(FIGHTERS).map((d) => [d, d.look]);
for (const [d] of saved) delete d.look;
const plain = run(1);
for (const [d, L] of saved) if (L) d.look = L;
check(plain.hash === a.hash && plain.kos === a.kos && plain.hp === a.hp, 'looks are render only: the fight is identical without them');
check(JSON.parse(plain.looks[0])[1] === null, 'no look data -> no look');

// --- picks stay inside the type's lists
const rng = createRng(9);
for (const [type, L] of Object.entries(RAT_LOOKS)) {
  for (let i = 0; i < 200; i++) {
    const k = pickLook({ look: L }, rng);
    check(k.detail === null || L.details[k.detail] > 0, `${type}: detail ${k.detail} is in its list`);
    check(Object.entries(k.tints).every(([ch, c]) => L.tints[ch].includes(c)), `${type}: tints from its palettes`);
    check(Math.abs(k.fur) <= 1 && Math.abs(k.size) <= 1, `${type}: fur/size in -1..1`);
  }
}

// --- every overlay a rat can wear exists for every drawing of its part; masks line up with their images
for (const def of Object.values(FIGHTERS)) {
  const rig = RIGS[def.art?.rig];
  if (!rig?.views) continue;
  const groups = new Set([...(def.art.gear ?? []), ...Object.keys(def.look?.details ?? {}).filter((d) => d !== 'none'),
    ...Object.values(LOADOUTS).flat(), ...Object.values(RAT_LOOKS).flatMap((L) => Object.keys(L.details))].filter((g) => g !== 'none'));
  for (const g of groups) {
    const G = rig.views[g];
    if (rig.dress?.[g]) { check(!G, `${def.id}: ${g} is a whole dressed drawing, not an overlay (T032; tests/gear.test.mjs)`); continue; }
    check(G, `${def.id}: gear group ${g} has views`);
    if (!G) continue;
    for (const d of [G.on, ...Object.keys(rig.parts[G.on].swaps ?? {})]) {
      const o = rig.overlays[G.views[d]];
      check(o, `${def.id}: ${g} has an overlay for ${d}`);
      if (o?.img) check(fs.existsSync(o.img), `${def.id}: ${o.img} exists`);
      if (o) check(o.on === G.on, `${def.id}: ${G.views[d]} rides ${G.on}`);
    }
  }
  for (const [img, M] of Object.entries(rig.masks)) {
    check(fs.existsSync(img), `masked image ${img} exists`);
    for (const k of ['cloth', 'fur']) if (M[k]) {
      check(fs.existsSync(M[k]) && String(pngSize(M[k])) === String(pngSize(img)), `${M[k]} matches its image's size`);
      if (k === 'cloth') check(CHANNELS[img.split('/').pop().replace('.png', '')], `${img}: cloth mask has a tint channel`);
    }
  }
}
for (const id of ['rat-archer', 'rat-spearman']) check(!RIGS[FIGHTERS[id].art.rig].tint, `${id}: T018 stopgap tint removed`);
check(String(FIGHTERS['rat-archer'].art.gear) === 'gear-hood,gear-quiver', 'archer wears hood + quiver');
check(String(FIGHTERS['rat-spearman'].art.gear) === 'gear-helmet,gear-jerkin', 'spearman wears helmet + jerkin');
check(!FIGHTERS['rat-raider'].art.gear, 'plain raider wears no gear');

// --- gear follows the head / torso drawings, hides with its part
const rig = RIGS['rat-archer'], f = { def: FIGHTERS['rat-archer'], look: { detail: 'detail-eyepatch' } };
check(String(gearOf(f)) === 'gear-hood,gear-quiver,detail-eyepatch', 'gearOf: loadout then detail');
const lay = (swap, hide) => {
  let L = layoutRig(rig, {}, swap);
  if (hide) L = L.filter((e) => e.name !== hide);
  return gearLayout(rig, L, gearOf(f));
};
const img = (L, n) => L.find((e) => e.name === n)?.img?.split('/').pop();
// T032: the rebuilt rat's hood is a whole dressed head (tests/gear.test.mjs); its face details still ride the bare drawing
check(img(lay({}), 'head') === 'head-hood.png', 'hooded default head');
check(img(lay({ head: 'head-hurt' }), 'detail-eyepatch') === 'detail-eyepatch-hurt.png', 'hurt head -> eyepatch-hurt');
check(!img(lay({ head: 'head-back' }), 'detail-eyepatch'), 'rear head: no eyepatch (face hidden)');
check(!img(lay({}, 'head'), 'detail-eyepatch'), 'a hidden head hides its detail');
// torso gear as T019 drew it, on the A010 rats it was drawn for (viewer compare slot)
const sp = RAT_A010['rat-spearman'], sf = { def: FIGHTERS['rat-spearman'], look: null };
check(img(gearLayout(sp, layoutRig(sp, {}, { torso: 'torso-side' }), gearOf(sf)), 'gear-jerkin') === 'gear-jerkin-side.png', 'A010 rat: side torso -> jerkin-side');
const old = RAT_A010['rat-archer'], Lq = gearLayout(old, layoutRig(old, {}), gearOf(f));
check(Lq.findIndex((e) => e.name === 'gear-quiver') >= 0 && Lq.findIndex((e) => e.name === 'gear-quiver') < Lq.findIndex((e) => e.name === 'torso'), 'A010 rat: quiver behind the torso');
const L0 = gearLayout(old, layoutRig(old, {}), gearOf(f)), at = (n) => L0.findIndex((e) => e.name === n);
check(at('torso') < at('head') && at('head') < at('detail-eyepatch') && at('detail-eyepatch') < at('gear-hood'),
  'A010 rat draw order: detail over the head, hood over the detail');
const head = L0.find((e) => e.name === 'head'), hood = L0.find((e) => e.name === 'gear-hood'), o = old.overlays['gear-hood'].offset;
check(Math.abs(hood.m[4] - (head.m[0] * o[0] + head.m[2] * o[1] + head.m[4])) < 1e-9, 'A010 rat: hood sits at its offset on the head image');
check(String(gearLayout(rig, layoutRig(rig, {}), [])) === String(layoutRig(rig, {})), 'no gear -> layout unchanged');

// --- tints: unmasked pixels untouched, cloth lands on the palette colour with shading kept, fur shift is small
const px = (...c) => new Uint8ClampedArray(c.flat());
const red = [[174, 20, 14, 255], [230, 40, 30, 255], [90, 10, 8, 255]], full = px(...red.map(() => [255, 255, 255, 255]));
const none = tintPixels(px(...red), px(...red.map(() => [0, 0, 0, 255])), null, { color: PALETTES.trousers[0], clothL: 0.37, clothS: 0.9 });
check(String(none) === String(px(...red)), 'an empty mask changes nothing');
const T = tintPixels(px(...red), full, null, { color: '#4f5338', clothL: 0.37, clothS: 0.9 }, { ...LOOKS, sat: 1, mix: 1 });
const hs = [0, 4, 8].map((i) => rgbHsl(T[i] / 255, T[i + 1] / 255, T[i + 2] / 255)), target = rgbHsl(...hexRgb('#4f5338'));
check(hs.every((h) => Math.abs(h[0] - target[0]) < 0.02), 'tinted cloth takes the palette hue');
check(hs[1][2] > hs[0][2] && hs[0][2] > hs[2][2], 'shading kept (light stays light, dark stays dark)');
check(Math.abs(hs[0][2] - target[2]) < 0.03, 'a mean-lightness pixel lands on the palette lightness');
const furred = tintPixels(px([120, 80, 50, 255]), null, px([255, 255, 255, 255]), { fur: 1 }, LOOKS);
check(furred[0] > 120 && furred[0] < 120 * (1 + 2 * LOOKS.fur) + 1 && furred[2] / furred[1] < 50 / 80, 'fur +1: a little lighter and warmer');
check(LOOKS.size <= 0.04 + 1e-9, 'size stays within +-4%');

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
