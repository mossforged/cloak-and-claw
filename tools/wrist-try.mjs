// T029 r3 posing aid: the worst wrist turn per hand (deg, frame) in a clip with pose weapon placements changed (wrist
// limits off, so it shows what the poses themselves ask of the wrists). Changes apply in turn and add up; the clip is
// measured after each. node tools/wrist-try.mjs <fighter> <clip> <pose>=x,y,rot [...]   (pose: idle, or move:key)
import { wristFrames } from './bench/wrist.js';
import { rigOf } from '../src/viewer/models.js';
import { WRISTS } from '../src/data/wrists.js';

WRISTS.on = false;
const [id, clip, ...tries] = process.argv.slice(2), rig = rigOf(id);
for (const t of ['(as posed)', ...tries]) {
  if (t.includes('=')) {
    const [pose, v] = t.split('='), [mv, key] = pose.split(':'), P = key ? rig.poses.moves[mv][key] : rig.poses[pose], [x, y, r] = v.split(',').map(Number);
    Object.assign(P, { 'weapon.x': x, 'weapon.y': y, 'weapon.rot': r });
  }
  const worst = {};
  for (const f of wristFrames(id, [clip])) for (const w of f.w) if (Math.abs(w.bend) > Math.abs(worst[w.hand]?.[0] ?? 0)) worst[w.hand] = [+w.bend.toFixed(1), f.n];
  console.log(t, JSON.stringify(worst));
}
