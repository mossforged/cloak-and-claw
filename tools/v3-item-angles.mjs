// T039 r2: how far (degrees on screen) each item v3 holds points from where the raider's points, per clip: every raider
// and spearman clip played with its own items (the rehearsal moves' dagger, axe, staff; the strapped round shield), v3
// laid out on the same frames (its compare version). Held item: its handle line (grip -> gripEnd) as v3-grip-ends.mjs;
// shield: the image's own x axis (the same image on both rats). Writes a markdown table.
// Usage: node tools/v3-item-angles.mjs [--out docs/screens/T039/r2-item-angles.md]
import { writeFileSync } from 'node:fs';
import { createSlot } from '../src/viewer/sandbox.js';
import { clipsFor } from '../src/viewer/clips.js';
import { rigFrame } from '../src/render/rig.js';
import RAT_V3, { V3_SPEARMAN } from '../src/data/rigs/rat-v3.js';
import * as LINES from '../src/data/rigs/rat-v3-grip-lines.js';

const arg = (k) => { const i = process.argv.indexOf(k); return i < 0 ? null : process.argv[i + 1]; };
const out = arg('--out') ?? 'docs/screens/T039/r2-item-angles.md';
const D = 180 / Math.PI, wrap = (d) => ((d + 540) % 360) - 180;
const held = (F) => {
  const e = F.held?.part && F.L.find((x) => x.name === F.held.slot), A = F.held?.kit?.art;
  if (!e || !A?.gripEnd) return null;
  const v = [A.gripEnd[0] - A.grip[0], A.gripEnd[1] - A.grip[1]];
  return { id: F.held.kit.id, a: Math.atan2(e.m[1] * v[0] + e.m[3] * v[1], e.m[0] * v[0] + e.m[2] * v[1]) * D };
};
const shield = (F) => { const e = F.L.find((x) => x.name === 'shield' && x.m); return e ? Math.atan2(e.m[1], e.m[0]) * D : null; };
const rows = [], all = {};
for (const [fid, V3] of [['rat-raider', RAT_V3], ['rat-spearman', V3_SPEARMAN]]) {
  for (const c of clipsFor(fid, 'own')) {
    const per = {}, mems = { s: {}, v: {} };
    const slot = createSlot({ warm: (sb, t) => {
      const f = sb.hero, S = rigFrame(f, V3.retarget, t, mems.s), F = rigFrame(f, V3, t, mems.v);
      const hs = held(S), hv = held(F);
      if (hs && hv && hs.id === hv.id) (per[hs.id] ??= []).push(Math.abs(wrap(hv.a - hs.a)));
      const ss = shield(S), sv = shield(F);
      if (ss != null && sv != null) (per['a021-shield (strap)'] ??= []).push(Math.abs(wrap(sv - ss)));
    } });
    slot.load({ f: fid, v: 'v3', item: 'own', anim: c.key, grip: '', target: false, flip: false, look: {}, gear: null });
    slot.seek(slot.len);
    for (const [id, e] of Object.entries(per)) {
      rows.push({ fid, clip: c.key, id, n: e.length, mean: e.reduce((s, x) => s + x, 0) / e.length, max: Math.max(...e) });
      (all[id] ??= []).push(...e);
    }
  }
}
const f1 = (x) => x.toFixed(1);
const md = [`# T039 r2: v3's held items against the raider's (lines: ${LINES.SOURCE})`, '',
  'Mean and worst degrees on screen between the item v3 holds and the same item in the raider\'s hand, frame by frame (tools/v3-item-angles.mjs).', '',
  '## All clips', '', '| Item | Frames | Mean | Worst |', '|---|---|---|---|',
  ...Object.entries(all).map(([id, e]) => `| ${id} | ${e.length} | ${f1(e.reduce((s, x) => s + x, 0) / e.length)} | ${f1(Math.max(...e))} |`), '',
  '## Per clip', '', '| Fighter | Clip | Item | Frames | Mean | Worst |', '|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.fid} | ${r.clip} | ${r.id} | ${r.n} | ${f1(r.mean)} | ${f1(r.max)} |`), ''].join('\n');
writeFileSync(out, md);
console.log(md.split('## Per clip')[0]);
console.log(`wrote ${out} (${rows.length} rows)`);
