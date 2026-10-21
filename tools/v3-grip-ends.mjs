// T039: which way to run Art's grip lines where they sit square to the raider's (tools/v3-grip-lines.mjs TIE): plays every
// raider and spearman clip with its own item on v3 with each hand's line one way and the other, and reports how far (mean
// degrees on screen) v3's held item points from where the raider's points, per hand drawing that holds it. The smaller
// one is the end toward the item's head. Usage: node tools/v3-grip-ends.mjs
import { createSlot } from '../src/viewer/sandbox.js';
import { clipsFor } from '../src/viewer/clips.js';
import { rigFrame, rigMemory } from '../src/render/rig.js';
import * as LINES from '../src/data/rigs/rat-v3-grip-lines.js';
import { withLines, V3_SPEARMAN } from '../src/data/rigs/rat-v3.js';

const HANDS = ['hand-near-grip', 'hand-near-grip-overhand'];
const D = 180 / Math.PI, wrap = (d) => ((d + 540) % 360) - 180;
const flipped = (name) => ({ ...LINES, DRAWINGS: { ...LINES.DRAWINGS, [name]: { ...LINES.DRAWINGS[name], a: LINES.DRAWINGS[name].b, b: LINES.DRAWINGS[name].a } } });
const variants = { as: withLines(LINES), ...Object.fromEntries(HANDS.map((h) => [h, withLines(flipped(h))])) };
const itemAngle = (F) => {
  const e = F.held?.part && F.L.find((x) => x.name === F.held.slot), A = F.held?.kit?.art;
  if (!e || !A?.gripEnd) return null;
  const v = [A.gripEnd[0] - A.grip[0], A.gripEnd[1] - A.grip[1]];
  return Math.atan2(e.m[1] * v[0] + e.m[3] * v[1], e.m[0] * v[0] + e.m[2] * v[1]) * D;
};
const err = {};   // drawing -> variant -> [deg]
let frames = 0;
for (const fid of ['rat-raider', 'rat-spearman']) {
  for (const c of clipsFor(fid, 'own')) {
    const mems = {};
    const slot = createSlot({ warm: (sb, t) => {
      const f = sb.hero, src = rigFrame(f, sb.rig.retarget, t, (mems.src ??= {})), a0 = itemAngle(src);
      if (a0 == null) return;
      frames++;
      for (const [k, R] of Object.entries(variants)) {
        const rig = fid === 'rat-spearman' ? { ...R, poses: V3_SPEARMAN.poses, retarget: V3_SPEARMAN.retarget } : R;
        const F = rigFrame(f, rig, t, (mems[k] ??= {})), a = itemAngle(F), hand = F.L.find((x) => x.name === 'hand-near')?.swap;
        if (a == null || !HANDS.includes(hand)) continue;
        ((err[hand] ??= {})[k] ??= []).push(Math.abs(wrap(a - a0)));
      }
    } });
    slot.load({ f: fid, v: 'v3', item: 'own', anim: c.key, grip: '', target: false, flip: false, look: {}, gear: null });
    slot.seek(slot.len);
  }
}
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
console.log(`${frames} frames with an item`);
for (const h of HANDS) {
  const E = err[h] ?? {}, as = E.as ?? [], fl = E[h] ?? [];
  if (!as.length) { console.log(`${h}: never holds an item in the clips`); continue; }
  const cur = LINES.DRAWINGS[h];
  console.log(`${h}: ${as.length} frames; as written (${cur.a} -> ${cur.b}) ${mean(as).toFixed(1)} deg off the raider's item, the other way ${mean(fl).toFixed(1)} deg`);
}
