// T023 round 2 (user notes): the Mouse Fighter's trailing boot. Every ground strike / release (his sword, the kits, throw
// and toss) stands on the turned-out near boot, flat on the floor (a braced lunge, never toes-up or hovering behind him);
// the walk's strides are gathered in from the wide 3/4 hips so the near foot steps past the far one (not locked behind);
// walkWaves with gather 0 is the old walk exactly.
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { ACTION_POSES } from '../src/data/rigs/mouse-fighter-action-poses.js';
import { walkWaves } from '../src/data/rigs/biped-ik.js';
import { targetPose } from '../src/render/rig-pose.js';
import { soles, solePoints } from './rig-soles.mjs';
import { layoutRig } from '../src/render/rig.js';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const def = FIGHTERS['mouse-fighter'], rig = RIGS[def.art.rig], P = rig.poses;
const footOf = (pose) => layoutRig(rig, pose, pose.swap ?? {}).find((e) => e.name === 'foot-near').img.split('/').pop().replace('.png', '');

const strikes = [...Object.entries(P.moves), ...Object.values(P.kits).flatMap((k) => Object.entries(k.moves ?? {}))]
  .filter(([k]) => k !== 'jumpSlash').map(([k, m]) => [`${k} strike`, m.strike]);
for (const k of ['throwRelease', 'tossRelease']) strikes.push([k, ACTION_POSES[k]]);
for (const [name, pose] of strikes) {
  check(footOf(pose) === 'foot-near-out', `${name}: turned-out trailing boot`);
  const y = soles(rig, pose, pose.swap)['foot-near'];
  check(Math.abs(y) < 0.5, `${name}: trailing sole flat on the floor (y=${y.toFixed(2)})`);
}
check(footOf(P.moves.jumpSlash.strike) === 'foot-near', 'jumpSlash strike: forward near boot (in the air)');

// Walk: over a stride the near ankle comes out in front of the far ankle and goes back behind it.
const fighter = (o) => ({ def, state: 'walk', t: 0, mf: 0, move: null, ...o });
const gaps = Array.from({ length: 60 }, (_, i) => {
  const tp = targetPose(fighter({ t: i / 60 * 60 / P.walk.speed }), rig, 0), s = solePoints(rig, tp.joints, tp.swap);
  return s['foot-near'][0] - s['foot-far'][0];
});
check(Math.max(...gaps) > 8 && Math.min(...gaps) < -8, `walk: near foot steps past the far one (gap ${Math.min(...gaps).toFixed(1)}..${Math.max(...gaps).toFixed(1)} px)`);

// gather 0 = the old (T023 round 1) walk.
const opts = { speed: 2.1, walk: 162, lift: 6, dy: 6 }, a = walkWaves(rig, opts), b = walkWaves(rig, { ...opts, gather: 0 });
check(JSON.stringify(a) === JSON.stringify(b), 'walkWaves: gather 0 gives the old result');

console.log(failed ? `${failed} failures` : 'ALL OK');
process.exit(failed ? 1 : 0);
