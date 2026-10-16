// Bracing loop while blocking (T015, render only): holding block for 3 s keeps both boots planted and changes no sim
// state; the loop is visible but small; none during blockstun; fades in; the hip sway rests while shuffle-walking;
// every other state draws exactly as before; the standee breathes on the same cycle.
import { createWorld, stepWorld } from '../src/sim/world.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { rigJoints } from '../src/render/rig-pose.js';
import { braceLayer, braceWeight, solesOf } from '../src/render/brace.js';
import { layoutRig } from '../src/render/rig.js';
import { at } from '../src/render/rig-grip.js';
import { poseOf } from '../src/render/standee.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const def = FIGHTERS['mouse-fighter'], rig = RIGS[def.art.rig], B = rig.brace;
check(B && B.plant, 'mouse-fighter rig has brace data');
const HOLD = { mx: 0, my: 0, attack: false, jump: false, block: true };
const snap = (w) => JSON.stringify(w.fighters.map(({ def: _d, id: _i, ...f }) => f));   // ids come from a global counter
const headTop = (j, swap) => { const L = layoutRig(rig, j, swap); return at(rig, L, 'head', rig.parts.head.pivot)[1]; };

// 3 s of block: draw every frame (as drawRig does) and compare with a world that is never drawn
{
  const a = createWorld('harbor-market', 'mouse-fighter', 7), b = createWorld('harbor-market', 'mouse-fighter', 7);
  const mem = {}, plain = {};
  let maxSole = 0, headMin = Infinity, headMax = -Infinity, dxMin = Infinity, dxMax = -Infinity;
  for (let n = 0; n < 180; n++) {
    stepWorld(a, HOLD); stepWorld(b, HOLD);
    const p = a.player, before = snap(a), time = n / 60;
    const base = rigJoints(p, rig, time, plain);
    const j = braceLayer(rig, p, rigJoints(p, rig, time, mem), time, mem, mem.swap);
    poseOf(p, time);
    check(snap(a) === before, `frame ${n}: drawing changed no sim state`);
    const s0 = solesOf(rig, base, plain.swap), s1 = solesOf(rig, j, mem.swap);
    for (let i = 0; i < s0.length; i++) maxSole = Math.max(maxSole, Math.hypot(s1[i][0] - s0[i][0], s1[i][1] - s0[i][1]));
    if (n > B.fade + 10) {
      const h = headTop(j, mem.swap) - headTop(base, plain.swap);
      headMin = Math.min(headMin, h); headMax = Math.max(headMax, h);
      dxMin = Math.min(dxMin, j.dx - base.dx); dxMax = Math.max(dxMax, j.dx - base.dx);
    }
  }
  check(a.player.state === 'block', 'still blocking after 3 s');
  check(snap(a) === snap(b), 'drawn world = undrawn world after 3 s');
  check(maxSole < 0.1, `boots stay planted on the floor line (max sole drift ${maxSole.toFixed(3)} px)`);
  const rise = headMax - headMin;
  check(rise > 0.6 && rise < 2.5, `breath lifts the head about 1-2 px (got ${rise.toFixed(2)})`);
  check(dxMax - dxMin > 1 && dxMax - dxMin < 2.5, `hips sway ~1 px each way (got ${dxMin.toFixed(2)}..${dxMax.toFixed(2)})`);
}

// weight: 0 outside block and during blockstun, eases in after entering and after a blocked hit
{
  const f = (o) => ({ def, state: 'block', t: 0, stun: 0, vx: 0, vy: 0, ...o });
  check(braceWeight(f({ state: 'idle', t: 50 }), B) === 0, 'no loop outside block');
  check(braceWeight(f({ t: 0 }), B) === 0, 'entering block: starts from 0 (no pop)');
  check(braceWeight(f({ t: B.fade / 2 }), B) > 0 && braceWeight(f({ t: B.fade / 2 }), B) < 1, 'eases in');
  check(braceWeight(f({ t: B.fade }), B) === 1, 'fully in after fade');
  check(braceWeight(f({ t: 5, stun: 12 }), B) === 0, 'none during blockstun (blockHit shove)');
  check(braceWeight(f({ t: 12 + B.fade, stun: 12 }), B) === 1, 'back after the shove');
}

// other states: the old joints, untouched (same object)
for (const state of ['idle', 'walk', 'attack', 'hurt', 'jump']) {
  const p = { def, state, t: 30, stun: 0, vx: 1, vy: 0, mf: 0, move: null }, j = rigJoints(p, rig, 1, {});
  check(braceLayer(rig, p, j, 1, {}) === j, `${state}: no brace layer`);
}

// shuffle-walk while blocking: the sway fades out (and back in after stopping); the breath goes on
{
  const p = { def, state: 'block', t: 100, stun: 0, vx: 0.6, vy: 0, mf: 0, move: null }, mem = {};
  let j;
  for (let n = 0; n <= B.swayFade + 2; n++) j = braceLayer(rig, p, rigJoints(p, rig, n / 60, {}), n / 60, mem);
  check(mem.swayW === 0, `sway rests while walking (swayW ${mem.swayW})`);
  check(j.dx === rigJoints(p, rig, 0, {}).dx, 'walking: no hip offset');
  p.vx = 0;
  for (let n = 0; n <= B.swayFade + 2; n++) braceLayer(rig, p, rigJoints(p, rig, 1 + n / 60, {}), 1 + n / 60, mem);
  check(mem.swayW === 1, 'sway back after stopping');
}

// standee: breathes in block on the same cycle; the old block pose at the breath's low point / during the shove
{
  const p = { def, state: 'block', t: 100, stun: 0, id: 1, move: null };
  const lo = poseOf(p, 0.75 * B.breath), hi = poseOf(p, 0.25 * B.breath);
  check(Math.abs(lo.sy - 0.96) < 1e-9 && Math.abs(lo.sx - 1.03) < 1e-9, 'standee: out-breath = the old block squash');
  check(hi.sy > lo.sy && hi.rot > lo.rot, 'standee: taller and leaning in on the in-breath');
  const shove = poseOf({ ...p, t: 3, stun: 12 }, 0.25 * B.breath);
  check(Math.abs(shove.sy - 0.96) < 1e-9, 'standee: no breath during the shove');
}

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
