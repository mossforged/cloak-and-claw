// C test pose (view-only): plays `cast` once for timing.castHold s, only from idle; any other state drops it.
import { stepViewPose } from '../src/render/view-pose.js';
import { RIGS } from '../src/data/rigs/index.js';
import { FPS } from '../src/config.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const rig = RIGS['mouse-fighter'], hold = Math.round(rig.poses.timing.castHold * FPS);
const hero = { state: 'idle', move: null };

let v = { pose: null };
check(stepViewPose(v, hero, true, rig) === 'cast', 'C from idle starts the cast pose');
let n = 1;
while (stepViewPose(v, hero, false, rig) === 'cast') n++;
check(n === hold, `cast plays for castHold (${n} steps, want ${hold}) then ends by itself`);
check(stepViewPose(v, hero, false, rig) === null, 'stays off after it ends (no latch)');

v = { pose: null };
stepViewPose(v, hero, true, rig);
check(stepViewPose(v, hero, true, rig) === 'cast', 'a second C press while playing does not toggle it off');

for (const s of ['walk', 'attack', 'hurt', 'block', 'jump']) {
  v = { pose: null };
  check(stepViewPose(v, { state: s, move: s === 'attack' ? {} : null }, true, rig) === null, `C ignored while ${s}`);
  stepViewPose(v, hero, true, rig);
  check(stepViewPose(v, { state: s, move: null }, false, rig) === null, `leaving idle for ${s} drops the cast pose at once`);
}
check(stepViewPose({ pose: null }, hero, true, { poses: { timing: {} } }) === null, 'a rig without a cast pose ignores C');

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
