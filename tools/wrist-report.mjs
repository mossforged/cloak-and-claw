// T029 r3: worst wrist bend (and wrist-point offset) per fighter and clip.
// node tools/wrist-report.mjs [fighter,fighter] [--json] [--swaps: bend spread per hand drawing] [--hands: per clip and hand] [--clips a,b] [--no-wrists: before the limits]   (text: one line per clip, '!' past the limit or off > 0.5 px)
import { wristFrames } from './bench/wrist.js';
import { MODELS } from '../src/viewer/models.js';
import { wristLimit, WRISTS, inside } from '../src/data/wrists.js';
import { rigOf } from '../src/viewer/models.js';

const args = process.argv.slice(2), json = args.includes('--json'), swaps = args.includes('--swaps'), hands = args.includes('--hands'), per = {};
const ci = args.indexOf('--clips'), clipsArg = ci < 0 ? null : args.splice(ci, 2)[1].split(',');
if (args.includes('--no-wrists')) WRISTS.on = false;   // the frames before the limits
const ids0 = 0, ids = args.find((a) => !a.startsWith('--'))?.split(',') ?? MODELS, res = {};
for (const id of ids) {
  const worst = {}, rig = rigOf(id);
  for (const f of wristFrames(id, clipsArg)) for (const w of f.w) {
    const k = (f.clip === 'rehearsal' ? f.label : f.clip) + (hands ? ` ${w.hand}` : ''), cur = worst[k] ?? (worst[k] = { bend: 0, off: 0, over: false });
    if (Math.abs(w.bend) > Math.abs(cur.bend)) Object.assign(cur, { bend: +w.bend.toFixed(1), at: `@${f.n} ${w.hand} ${w.swap ?? ''}`.trim() });
    if (w.off > cur.off) Object.assign(cur, { off: +w.off.toFixed(2), offAt: `@${f.n} ${w.hand}` });
    if (!inside(w.bend, wristLimit(rig, w.hand, w.swap ?? `hand-${w.hand}`), 0.5)) cur.over = true;
    (per[`${id} ${w.hand} ${w.swap ?? '-'}`] ??= []).push(w.bend);
  }
  res[id] = worst;
}
if (swaps) for (const [k, v] of Object.entries(per)) { v.sort((a, b) => a - b); const q = (x) => v[Math.floor(x * (v.length - 1))].toFixed(0); console.log(`${k}: n ${v.length} min ${q(0)} p10 ${q(0.1)} med ${q(0.5)} p90 ${q(0.9)} max ${q(1)}`); }
else if (json) console.log(JSON.stringify(res, null, 1));
else for (const [id, c] of Object.entries(res)) for (const [k, v] of Object.entries(c)) {
  console.log(`${v.over || v.off > 0.5 ? '!' : ' '} ${id} | ${k} | ${v.bend} ${v.at ?? ''} | off ${v.off} ${v.offAt ?? ''}`);
}
