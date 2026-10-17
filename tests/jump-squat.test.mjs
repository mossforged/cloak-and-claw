// Jump squat A/B test (T014): mode off = the old jump; A = take-off delayed by move.jumpSquat frames in `jumpStart`
// (press kept, attack buffered into the air attack); B = sim identical to off, crouch drawn only (render/jump-squat.js).
import { createWorld, stepWorld } from '../src/sim/world.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { JUICE } from '../src/data/juice.js';
import { targetPose, squatLayer } from '../src/render/rig-pose.js';
import { layoutRig } from '../src/render/rig.js';
import { squatOf } from '../src/render/jump-squat.js';
import { botControl } from './bot.mjs';
import { soles } from './rig-soles.mjs';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const def = FIGHTERS['mouse-fighter'], SQ = def.move.jumpSquat, saved = def.jumpSquatMode;
const N = { mx: 0, my: 0, attack: false, jump: false, block: false, grab: false };
check(saved === 'A', `hero default is A, the user's pick (got ${saved})`);
check(SQ > 0, 'jumpSquat frames set');

// One jump from standing (press on frame 10, holding right); trace of the hero per frame.
function trace(mode, ctl = () => ({})) {
  def.jumpSquatMode = mode;
  const w = createWorld('harbor-market', 'mouse-fighter', 1), out = [];
  for (let i = 0; i < 70; i++) {
    stepWorld(w, { ...N, mx: i >= 10 ? 1 : 0, jump: i === 10, ...ctl(i) });
    const p = w.player;
    out.push({ state: p.state, x: p.x, z: p.z, move: p.moveKey && p.move ? p.moveKey : null });
  }
  return out;
}
const takeOff = (t) => t.findIndex((s) => s.state === 'jump');
const off = trace('off'), A = trace('A'), B = trace('B');
check(takeOff(off) === 10, `off: take-off on the press frame (${takeOff(off)})`);
check(JSON.stringify(B) === JSON.stringify(off), 'B: sim trace identical to off');
check(takeOff(A) - takeOff(off) === SQ, `A: take-off ${takeOff(A) - takeOff(off)} frames later (= jumpSquat ${SQ})`);
check(A.slice(10, 10 + SQ).every((s) => s.state === 'jumpStart' && s.z === 0), 'A: crouched on the ground in jumpStart meanwhile');
const air = (t) => t.slice(takeOff(t)).map((s) => s.z);
check(JSON.stringify(air(A).slice(0, 40)) === JSON.stringify(air(off).slice(0, 40)), 'A: same arc as off once airborne');
check(A[takeOff(A)].x - A[takeOff(A) - 1].x > 0, 'A: takes off moving the way the stick points');

// A: jump press is kept (no need to hold), an attack during the squat is the air attack at take-off.
const Aatk = trace('A', (i) => ({ attack: i === 11 }));
check(Aatk[takeOff(Aatk)].move === def.airAttack, `A: attack in the squat -> ${def.airAttack} at take-off (got ${Aatk[takeOff(Aatk)].move})`);
const offAtk = trace('off', (i) => ({ attack: i === 11 }));
check(offAtk[11].move === def.airAttack, 'off: attack after take-off is the air attack as before');

// Jumping bot, 3 min x 3 seeds: off and B end identical; A runs clean.
function botRun(mode, seed) {
  def.jumpSquatMode = mode;
  const w = createWorld('harbor-market', 'mouse-fighter', seed);
  let jumps = 0;
  for (let i = 0; i < 60 * 180 && !w.over; i++) {
    const c = botControl(w);
    if (!c.attack && i % 97 === 0) { c.jump = true; jumps++; }
    stepWorld(w, c);
    for (const f of w.fighters) if (![f.x, f.y, f.z, f.hp].every(Number.isFinite)) { check(false, `${mode}: NaN on ${f.def.id}`); return null; }
  }
  return { frame: w.frame, wave: w.wave, kos: w.kos, hp: w.player.hp, x: w.player.x.toFixed(3), jumps };
}
for (const seed of [1, 2, 3]) {
  const o = botRun('off', seed), b = botRun('B', seed), a = botRun('A', seed);
  check(JSON.stringify(o) === JSON.stringify(b), `seed ${seed}: jumping bot off ${JSON.stringify(o)} = B ${JSON.stringify(b)}`);
  check(a && a.kos > 0, `seed ${seed}: A bot still fights (kos ${a?.kos})`);
  console.log(`seed ${seed}: off/B kos=${o.kos} hp=${o.hp}; A kos=${a.kos} hp=${a.hp}`);
}

// Render: how crouched he looks (0..1).
const J = JUICE.jumpSquat;
const fake = (o) => ({ def, state: 'idle', t: 0, move: null, ...o });
for (const mode of ['off', 'A', 'B']) {
  def.jumpSquatMode = mode;
  const f = fake({ state: 'jump', t: 0 });
  const rise = squatOf(f, 0);
  f.state = 'idle'; f.t = 0;
  const land = squatOf(f, 0.01), later = squatOf(f, 0.01 + (J.land + 1) / 60);
  if (mode === 'off') check(rise === 0 && land === 0, 'off: never crouched');
  else check(rise === 1 && squatOf(fake({ state: 'jump', t: J.rise }), 0) === 0, `${mode}: full crouch at take-off, legs extended after rise`);
  if (mode !== 'off') check(land > 0.5 && later === 0, `${mode}: landing squash (${land.toFixed(2)}) gone after land frames`);
  if (mode === 'A') {
    const k = [0, SQ - 1].map((t) => squatOf(fake({ state: 'jumpStart', t }), 0));
    check(k[0] > 0 && k[1] === 1, `A: jumpStart crouches in (${k.map((v) => v.toFixed(2))})`);
  }
}
def.jumpSquatMode = saved;

// Rig crouch: both boots flat on the floor at full crouch (same check as block / reach in rig.test.mjs).
const rig = RIGS[def.art.rig];
for (const [foot, sy] of Object.entries(soles(rig, squatLayer(rig, targetPose(fake({}), rig, 0).joints, 1), rig.poses.jumpSquat.swap))) check(Math.abs(sy) < 2, `jumpSquat: ${foot} sole on the floor (y=${sy.toFixed(1)})`);

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
