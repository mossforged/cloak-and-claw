// Exposure flags per fighter (T028 r3): every frame key of every viewer clip (pose-seams.js poseFrames), each body view
// standing (clip 'views') and the rehearsal sheet's keys (clip 'rehearsal': stand-in poses until T029) run through the
// exposed-hidden-paint check (exposure.js), worst per key. Keys: '<fighter> | <clip> | <part> < <cover>' (exposed hidden
// paint, px = game px^2) and '<fighter> | <clip> | cut <part>' (straight cut edge, px = game px long); clip is the clip
// for STRICT ones, '*' (worst over the rest) otherwise. Node only (the references read the masters).
import { poseFrames, rehearsalFrames } from './pose-seams.js';
import { frameExposure } from './exposure.js';
import { refFor } from './exposure-refs.js';
import { readRGBA } from './png.mjs';
import { FIGHTERS } from '../../src/data/fighters/index.js';

export const STRICT = ['idle', 'walk', 'views', 'rehearsal'];
// -> Map key -> { px, label, clips, part, under (exposure) | cut: true, cell, at }
export function exposureFlags(id, only = null) {
  const ref = refFor(FIGHTERS[id].art.rig), worst = new Map();
  const frames = [...poseFrames(id, only?.filter((c) => !['views', 'rehearsal'].includes(c))), ...rehearsalFrames(id).filter((f) => !only || only.includes(f.clip))];
  for (const fk of frames) {
    const r = frameExposure(fk.cell, readRGBA, { ref }), clip = STRICT.includes(fk.clip) ? fk.clip : '*';
    const add = (key, px, f) => {
      const w = worst.get(key);
      if (!w || px > w.px) worst.set(key, { px, label: fk.label, clips: [fk.clip], cell: fk.cell, fk, ...f });
      else if (px === w.px && !w.clips.includes(fk.clip)) w.clips.push(fk.clip);
    };
    for (const e of r.exposed) add(`${id} | ${clip} | ${e.part} < ${e.under}`, e.px2, { part: e.part, under: e.under, at: e.at });
    for (const c of r.cuts) add(`${id} | ${clip} | cut ${c.part}`, c.len, { part: c.part, cut: true, at: c.at });
  }
  return worst;
}
