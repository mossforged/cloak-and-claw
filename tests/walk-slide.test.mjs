// T024 walk rebuild: through the real frame (floor-line rule on), each boot, while planted, moves back at the fighter's
// walk speed (so it stays put on the floor): the slide = how far a planted sole drifts over the floor per stance. T023's
// narrowed-hips walk slid 3.7 px per stance by this measure (both boots); the rebuilt walk keeps the wide hips (no
// 'pelvis.sx') and must slide < 2 px.
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { rigFrame } from '../src/render/rig.js';
import { floorLine } from '../src/data/rigs/biped-floor.js';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

// slide per stance (px over the floor) for each foot of a fighter's walk; planted = its lift channel ~0
export function walkSlide(def, rig, N = 120) {
  const speed = rig.poses.walk.speed, v = def.move.walk * 60, out = {};   // walk px/frame -> px/s
  const px = v / speed / N;   // body travel per sample (px), in rig space the floor moves back this much
  for (const foot of ['foot-near', 'foot-far']) {
    let worst = 0, run = null;
    for (let i = 0; i <= 2 * N; i++) {
      const f = { def, state: 'walk', t: (i / N) * 60 / speed, mf: 0, move: null, z: 0, vz: 0, facing: 1, id: 1, x: 0, y: 0 }, mem = {};
      rigFrame(f, rig, -1, mem); const fr = rigFrame(f, rig, 0, mem), e = fr.L.find((x) => x.name === foot);
      const planted = (fr.joints[`${foot}.lift`] ?? 0) < 0.3 && mem.swap[foot] !== `${foot}-toe`;
      const x = apply(e.base, rig.parts[foot].pivot)[0] + i * px;   // the ankle over the floor
      if (planted) { run ??= [x, x]; run[0] = Math.min(run[0], x); run[1] = Math.max(run[1], x); }
      else if (run) { worst = Math.max(worst, run[1] - run[0]); run = null; }
    }
    out[foot] = worst;
  }
  return out;
}

const def = FIGHTERS['mouse-fighter'], rig = RIGS[def.art.rig];
const s = walkSlide(def, rig);
console.log(`mouse walk slide per stance: near ${s['foot-near'].toFixed(2)} px, far ${s['foot-far'].toFixed(2)} px`);
for (const [foot, v] of Object.entries(s)) check(v < 2, `mouse walk: ${foot} slides ${v.toFixed(2)} px a stance (T023: 3.7)`);
check(!('pelvis.sx' in rig.poses.walk), 'mouse walk: no pelvis narrowing (uniform scale)');
check(floorLine(rig, 'foot-near') > floorLine(rig, 'foot-far'), 'far boot floor line above the near one (3/4 depth)');

console.log(failed ? `${failed} failures` : 'ALL OK');
process.exit(failed ? 1 : 0);
