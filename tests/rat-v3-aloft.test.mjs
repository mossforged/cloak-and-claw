// T038 rat v3's planted feet in a key posed off the floor (`aloft`) while on the ground (render/floor.js aloftInLimits):
// the dodge hop's take-off and landing, the jump attack's landing and the kick's standing toe stay on their floor lines
// (T035 r2: 23, 23 and 11 px off); a raised foot never sinks below the floor; rigs without limits are untouched.
import assert from 'node:assert/strict';
import { createSlot } from '../src/viewer/sandbox.js';
import { rigOf } from '../src/viewer/models.js';
import { rigFrame, rigMemory } from '../src/render/rig.js';
import { aloftInLimits, grounded } from '../src/render/floor.js';
import { floorLine } from '../src/data/rigs/biped-floor.js';
import HULLS from '../src/data/rigs/hulls.js';

let fails = 0;
const check = (name, fn) => { try { fn(); console.log('ok  ', name); } catch (e) { fails++; console.log('FAIL', name, '\n   ', e.stack.split('\n').slice(0, 4).join('\n    ')); } };
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const play = (anim, warm) => {
  const slot = createSlot({ warm: (sb, t) => { for (const x of sb.w.fighters) if (x !== sb.hero) rigFrame(x, rigOf(x.def.id), t, rigMemory(x)); warm(sb, t); } });
  slot.load({ f: 'rat-raider', v: 'v3', item: 'own', anim, grip: '', target: false, flip: false, look: {}, gear: null });
  slot.seek(slot.len);
};
// each foot's sole as drawn against its floor line (px, + = below) and its lift, on the ground in an aloft key
const soles = (anim) => {
  const out = [];
  play(anim, (sb, t) => {
    const f = sb.hero, mem = rigMemory(f), F = rigFrame(f, sb.rig, t, mem);
    if (!grounded(f) || !mem.swap?.['@aloft']) return;
    const B = Object.fromEntries(F.L.filter((e) => e.m && !e.line).map((e) => [e.name, e]));
    const a = Math.sin(F.p.rot) * F.p.sx * F.k, b = Math.cos(F.p.rot) * F.p.sy * F.k;
    for (const ft of ['foot-near', 'foot-far']) {
      if (!B[ft] || !(HULLS[B[ft].img] ?? []).length) continue;
      const y = Math.max(...HULLS[B[ft].img].map((p) => { const q = apply(B[ft].m, p); return a * q[0] + b * q[1]; }));
      out.push({ n: sb.n, ft, below: F.p.dy + y - floorLine(sb.rig, ft), lift: Math.max(0, F.joints[`${ft}.lift`] ?? 0), joints: F.joints });
    }
  });
  return out;
};

for (const [anim, tol] of [['dodgeHop', 1.5], ['jumpAttack', 2], ['kick', 1]]) check(`${anim}: planted feet in its aloft keys on their lines (${tol} px; T035 r2 up to 23)`, () => {
  const S = soles(anim), planted = S.filter((s) => s.lift < 0.5);
  assert.ok(planted.length, 'no planted foot in an aloft key');
  for (const s of planted) assert.ok(Math.abs(s.below + s.lift) < tol, `frame ${s.n} ${s.ft} ${(s.below + s.lift).toFixed(1)} px`);
});

check('hop, jump attack, kick, jump: a raised foot on the ground stops on the floor, never sinks below it (2 px)', () => {
  for (const anim of ['dodgeHop', 'jumpAttack', 'kick', 'jumpUp']) for (const s of soles(anim)) assert.ok(s.below < 2, `${anim} frame ${s.n} ${s.ft} ${s.below.toFixed(1)} px below`);
});

check('no limits (the game rat): aloft keys as given (the same object)', () => {
  const j = { 'leg-near-upper': 12, 'foot-near.lift': 0 };
  assert.equal(aloftInLimits(rigOf('rat-raider'), j), j);
});

console.log(fails ? `${fails} failed` : 'all passed');
process.exitCode = fails ? 1 : 0;
