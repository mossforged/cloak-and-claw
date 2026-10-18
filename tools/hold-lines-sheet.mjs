// T028 r4 hold sheet: every rat hand drawing (grip hands and the whole-arm keys that carry an item) holding each item it
// can hold, placed by the one rule on the user's grip lines (data/rigs/grip-lines.js): the item's grip point (a) on the
// hand's grip centre, its handle direction (a -> b) along the hand's (pommel -> head). Split grips draw [under, item,
// face]. Each drawing as drawn (no pose), at game size (--zoom 1) or larger. The second hand's point (c) and the line
// are marked when --lines. Headless, drawn by tools/stretch_render.py.
// Usage: node tools/hold-lines-sheet.mjs <out.jpg> [--zoom N] [--lines]
import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import rig from '../src/data/rigs/rat-raider.js';
import { ITEMS } from '../src/data/items/index.js';
import { A021_HOLDS } from '../src/data/items/a021-holds.js';
import { mul, rot, tr, sc, apply } from '../src/render/rig-layout.js';

const args = process.argv.slice(2), out = args[0] ?? 'docs/screens/T028/r4-holds.jpg';
const zoom = args.includes('--zoom') ? +args[args.indexOf('--zoom') + 1] : 1, lines = args.includes('--lines');
const ONE = ['rat-cutlass', 'plank-club', 'big-fish', 'mouse-sword', 'a021-dagger', 'a021-axe'], SHAFT = ['rat-spear', 'a021-staff'];
// hand drawing -> the items it holds (rat hand table: docs/design/rigs/rat-raider.md; A021 items with them)
const HOLDS = {
  'hand-near-grip': [...ONE, 'rat-spear'], 'hand-near-grip-overhand': [...SHAFT, 'a021-dagger', 'a021-axe', 'plank-club'],
  'hand-near-pinch': ['rat-arrow'], 'hand-far-grip': ['rat-bow', 'rat-cutlass', ...SHAFT], 'hand-far-grip-overhand': SHAFT,
  'hand-far-shield': ['a021-shield'], 'arm-near-cocked': ONE, 'arm-near-raised': ONE, 'arm-near-smear-h': ONE, 'arm-near-smear-o': ONE,
  'arm-near-mouth': ['a021-dagger'], 'arm-far-raised-back': ['rat-bow'], 'arm-far-raised': SHAFT, 'arm-far-guard': ['a021-shield'],
};
const ARROW = { art: { img: 'assets/art/items/rat-arrow.png', px: 0.29 } };
const itemDef = (id) => ITEMS[id] ?? A021_HOLDS[id] ?? (id === 'rat-arrow' ? ARROW : null);
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
const k = rig.scale, cells = [];
for (const [name, items] of Object.entries(HOLDS)) {
  const part = Object.keys(rig.parts).find((p) => rig.parts[p].swaps?.[name]), s = rig.parts[part].swaps[name], o = s.offset ?? [0, 0];
  // the hand's line in its own image px: a grip hand's point is in its part's px, a whole-arm key's in its image px
  const H = rig.hands[name], at = H ? [H.at[0] - o[0], H.at[1] - o[1]] : s.grip, axis = H ? H.axis : s.axis;
  const base = mul(sc(k), tr(-at[0], -at[1])), face = { img: s.img, m: base };   // the hand's grip centre on the cell's point
  const under = s.under && { img: rig.parts[part].swaps[s.under].img, m: mul(base, tr((rig.parts[part].swaps[s.under].offset[0] - o[0]), (rig.parts[part].swaps[s.under].offset[1] - o[1]))) };
  for (const id of items) {
    const D = itemDef(id), L = rig.itemLines[id];
    const m = mul(mul(rot(axis - ang(L.grip, L.gripEnd)), sc(D.art.px)), tr(-L.grip[0], -L.grip[1]));
    const item = { img: D.art.img, m: [m[0], m[1], m[2], m[3], m[4], m[5] - 100] }, lift = (q) => ({ ...q, m: [q.m[0], q.m[1], q.m[2], q.m[3], q.m[4], q.m[5] - 100] });
    const marks = [], strokes = [];
    if (lines) {
      const C = apply(item.m, ...L.grip), E = apply(item.m, ...L.gripEnd);
      strokes.push([[C[0] - (E[0] - C[0]) * 2, C[1] - (E[1] - C[1]) * 2], [C[0] + (E[0] - C[0]) * 3, C[1] + (E[1] - C[1]) * 3]]);
      if (L.grip2) marks.push(apply(item.m, ...L.grip2));
    }
    cells.push({ label: `${name} + ${id.replace('a021-', '')}`, flags: [], marks, floor: false, lines: [], strokes,
      parts: [...(under ? [lift(under)] : []), item, lift(face)] });
  }
}
const json = out.replace(/\.jpg$/, '.json');
writeFileSync(json, JSON.stringify({ title: `T028 r4 hold sheet: every rat hand drawing x the items it holds, on the user's grip lines${zoom === 1 ? ' (game size)' : ` (${zoom}x)`}`, zoom, cells }));
const r = spawnSync('python3', ['tools/stretch_render.py', json, out], { encoding: 'utf8' });
spawnSync('rm', [json]);
if (r.status) { console.error(r.stderr); process.exit(1); }
console.log(`wrote ${out}: ${cells.length} holds`);
