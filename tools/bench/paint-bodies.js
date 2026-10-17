// The bodies the paint check runs on (T026 round 2): each game rig at rest against its delivery's master. Node only
// (reads the rig-source for the master, canvas, root pivot and foot_translations). exclude: drawings in the master that
// are not body parts; skipParts: rig parts drawn unlike the master on purpose (A010: head R, the fist round the cutlass).
import { readFileSync } from 'node:fs';
import { RIGS } from '../../src/data/rigs/index.js';
import { RAT_A010 } from '../../src/data/rigs/a010/index.js';

export const PAINT_BODIES = {
  'rat-a010': { rig: () => RAT_A010['rat-raider'], source: 'assets/source/A010-rat-raider-standard/rig-source.json', exclude: ['sword.png'], skipParts: ['head', 'hand-near'] },
  'rat': { rig: () => RIGS['rat-raider'], source: 'assets/source/A018-rat-parts/rig-source.json' },
};
export function bodyOf(name) {
  const b = PAINT_BODIES[name], src = JSON.parse(readFileSync(b.source, 'utf8')), dir = b.source.slice(0, b.source.lastIndexOf('/'));
  const root = Object.values(src.parts).find((p) => !p.parent);
  return { rig: b.rig(), master: `${dir}/${src.master}`, canvas: src.canvas, pelvis: root.pivot, exclude: (b.exclude ?? []).map((f) => `${dir}/${f}`), skipParts: b.skipParts,
    shift: src.foot_translations };
}
