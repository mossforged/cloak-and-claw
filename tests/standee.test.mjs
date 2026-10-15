// Standee poses: every state and every move phase gives finite numbers for every channel the drawing uses
// (a missing channel turns the canvas transform into NaN and the fighter vanishes; T009 round 2 bug).
import { poseOf } from '../src/render/standee.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { ITEMS } from '../src/data/items/index.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const CHANNELS = ['rot', 'sx', 'sy', 'dx', 'dy', 'cy'];
const STATES = ['idle', 'walk', 'block', 'jumpStart', 'jump', 'hurt', 'knockdown', 'down', 'getup', 'dead', 'grabbing', 'throw', 'grabbed', 'thrown', 'toss'];
const finite = (p) => CHANNELS.every((k) => Number.isFinite(p[k]));

for (const def of Object.values(FIGHTERS)) {
  const base = { def, id: 1, t: 5, stun: 10, z: 20, vz: 1, move: null, mf: 0, facing: 1 };
  for (const state of STATES) {
    if ((state === 'grabbing' || state === 'throw') && !def.throw) continue;
    if (state === 'toss' && !def.toss) continue;
    check(finite(poseOf({ ...base, state }, 1.2)), `${def.id} ${state}: finite pose`);
  }
  for (const [k, m] of Object.entries(def.moves))
    for (const mf of [0, m.windup, m.windup + 1, m.windup + m.active + 2])
      check(finite(poseOf({ ...base, state: 'attack', move: m, mf }, 0)), `${def.id} ${k} frame ${mf}: finite pose`);
}
for (const it of Object.values(ITEMS)) for (const [k, m] of Object.entries(it.moves ?? {}))   // weapon kit moves (T010)
  for (const mf of [0, m.windup, m.windup + 1, m.windup + m.active + 2])
    check(finite(poseOf({ def: FIGHTERS['mouse-fighter'], id: 1, t: 5, z: 0, vz: 0, facing: 1, state: 'attack', move: m, mf }, 0)), `${it.id} ${k} frame ${mf}: finite pose`);

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
