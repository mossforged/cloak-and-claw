// Grab and throw (T009): grab only when the conditions are met; knee x3 knocks down; a thrown rat bowls over
// another; break-free timer; a hit drops the grab; wall bounce keeps fighters on the belt; AI tokens and
// separation around a grabbed rat; a grab-and-throw bot runs 3 min x 3 seeds without NaN or stuck rats.
import { createWorld, stepWorld } from '../src/sim/world.js';
import { createFighter, startMove } from '../src/sim/fighter.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RULES } from '../src/data/rules.js';
import { bus } from '../src/core/events.js';
import { createRunLog } from '../src/log/runlog.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };

const rat = FIGHTERS['rat-raider'], hero = FIGHTERS['mouse-fighter'], G = hero.grab, T = hero.throw;
const ev = { grab: [], throw: [], thrownHit: [], hit: [] };
for (const k of Object.keys(ev)) bus.on(k, (e) => ev[k].push(e));
const reset = () => { for (const k of Object.keys(ev)) ev[k].length = 0; };
const log = createRunLog();

const N = { mx: 0, my: 0, attack: false, jump: false, block: false };
const R = { ...N, mx: 1 };
// Hero at 260 facing right, rats at the given x offsets (same depth unless dy), no AI unless asked, no waves.
function setup(offsets = [45], { ai = false, dy = 0 } = {}) {
  reset();
  const w = createWorld('harbor-market', 'mouse-fighter', 1), p = w.player;
  w.waveTimer = 1e9;
  const rats = offsets.map((o) => createFighter(rat, p.x + o, p.y + dy, { facing: -Math.sign(o), ai }));
  w.fighters.push(...rats);
  log.begin(w);
  return { w, p, rats };
}
const run = (w, n, c = N) => { for (let i = 0; i < n; i++) stepWorld(w, typeof c === 'function' ? c(i) : c); };
// Walk into the rat until grabbed (or give up).
function grab(w, p, max = 40) { for (let i = 0; i < max && p.state !== 'grabbing'; i++) stepWorld(w, R); return p.state === 'grabbing'; }

// grab: walking into him grabs after `delay` frames of pushing
{
  const { w, p, rats: [r] } = setup();
  run(w, G.idleFrames);
  run(w, G.delay - 1, R);
  check(p.state === 'walk', `no grab before delay (state ${p.state})`);
  stepWorld(w, R);
  check(p.state === 'grabbing' && r.state === 'grabbed' && p.grab?.target === r, `grab after ${G.delay} frames pushing (state ${p.state}/${r.state})`);
  check(ev.grab.length === 1 && ev.grab[0].f === p && ev.grab[0].target === r, 'grab event');
  check(Math.abs(r.x - (p.x + G.holdX)) < 1e-9 && r.y === p.y + G.holdY, 'held in front at holdX/holdY');
  check(log.summary().grabs === 1, 'run log counts the grab');
}
// no grab: standing next to him, walking away, out of depth, too far, enemy attacking, airborne, mid-combo
{
  let s = setup(); run(s.w, 30); check(s.p.state === 'idle', 'standing still never grabs');
  s = setup(); run(s.w, 30, { ...N, mx: -1 }); check(s.p.state === 'walk', 'walking away never grabs');
  s = setup([45], { dy: G.depth + 2 }); run(s.w, 20, { ...R, mx: 0 }); run(s.w, 6, R);
  check(s.p.state !== 'grabbing', 'out of depth: no grab');
  s = setup([200]); run(s.w, 12, R); check(s.p.state === 'walk', 'too far: no grab');
  s = setup(); startMove(s.rats[0], rat.attack); run(s.w, 15, R); check(s.p.state !== 'grabbing', 'attacking rat: no grab');
  s = setup(); s.rats[0].invuln = 60; run(s.w, 15, R); check(s.p.state !== 'grabbing', 'invulnerable (getting up) rat: no grab');
}
// attack pressed while pushing in still attacks; a combo pressed with forward held never grabs
{
  const { w, p } = setup();
  run(w, G.idleFrames);
  run(w, G.delay - 2, R);
  stepWorld(w, { ...R, attack: true });
  check(p.state === 'attack' && ev.grab.length === 0, `attack inside the delay attacks (state ${p.state})`);
  const s = setup([60]);
  let grabbed = false;
  for (let i = 0; i < 90; i++) { stepWorld(s.w, { ...R, attack: i % 6 === 0 }); grabbed ||= s.p.state === 'grabbing'; }
  check(!grabbed, 'mashing attack while holding forward never grabs');
  // right after a move ends, idleFrames must pass before a grab
  const t = setup([45]);
  startMove(t.p, 'slash1');
  const m = hero.moves.slash1;
  t.rats[0].invuln = 1e9;   // keep the rat standing through the swing
  run(t.w, m.windup + m.active + m.recovery);
  t.rats[0].invuln = 0; t.rats[0].state = 'idle'; t.rats[0].x = t.p.x + 45; t.rats[0].y = t.p.y;
  run(t.w, G.idleFrames - 1, R);
  check(t.p.state !== 'grabbing', 'no grab within idleFrames of a move');
}
// knee x3: two knees keep the hold, the third knocks down; damage adds up
{
  const { w, p, rats: [r] } = setup();
  check(grab(w, p), 'knee setup grab');
  const K = G.knee, len = K.windup + K.active + K.recovery;
  stepWorld(w, { ...N, attack: true }); run(w, len);
  check(r.state === 'grabbed' && r.hp === r.maxHp - K.damage, `knee 1: still held, hp ${r.hp}`);
  stepWorld(w, { ...N, attack: true }); run(w, len);
  check(r.state === 'grabbed', 'knee 2: still held');
  stepWorld(w, { ...N, attack: true }); run(w, K.windup);
  check(r.state === 'knockdown' && r.hp === r.maxHp - 2 * K.damage - G.lastKnee.damage, `knee 3 knocks down (state ${r.state}, hp ${r.hp})`);
  check(ev.hit.length === 3 && ev.hit.every((e) => e.attacker === p && e.target === r), '3 hit events from the knees');
  run(w, len);
  check(p.state === 'idle' && !p.grab, `after knee 3 the hero is free (state ${p.state})`);
}
// throw forward: the body flies, bowls over a rat in its path, lands knocked down with throw.damage
{
  const { w, p, rats: [r, r2] } = setup([45, 150]);
  check(grab(w, p), 'throw setup grab');
  stepWorld(w, { ...R, attack: true });
  check(p.state === 'throw', `attack + forward starts a throw (state ${p.state})`);
  run(w, T.wind + 1);
  check(r.state === 'thrown' && r.vx > 0 && ev.throw.length === 1 && ev.throw[0].dir === 1, `thrown forward (state ${r.state})`);
  let maxZ = 0;
  for (let i = 0; i < 80 && r.state === 'thrown'; i++) { stepWorld(w, N); maxZ = Math.max(maxZ, r.z); }
  check(maxZ > T.z, `thrown in an arc (max z ${maxZ.toFixed(1)})`);
  check(ev.thrownHit.length === 1 && ev.thrownHit[0].target === r2 && ev.thrownHit[0].body === r, 'thrownHit on the rat in the path');
  check(['knockdown', 'down'].includes(r2.state) && r2.hp === r2.maxHp - T.hitDamage, `bowled rat knocked down (state ${r2.state}, hp ${r2.hp})`);
  check(r.state === 'down' && r.hp === r.maxHp - T.damage, `thrown rat lands knocked down (state ${r.state}, hp ${r.hp})`);
  check(r.x > p.x + 120, `thrown well forward (dx ${(r.x - p.x).toFixed(0)})`);
  const s = log.summary();
  check(s.throws === 1 && s.thrownHits === 1, `run log: throws ${s.throws}, thrownHits ${s.thrownHits}`);
  check(s.damageDealt === T.damage + T.hitDamage, `run log damage dealt includes landing + bowling (${s.damageDealt})`);
}
// throw backward (attack + back) and with jump (forward)
{
  let { w, p, rats: [r] } = setup();
  grab(w, p);
  stepWorld(w, { ...N, mx: -1, attack: true }); run(w, T.wind + 1);
  check(r.state === 'thrown' && r.vx < 0 && p.facing === -1, `back throw goes behind and turns him (vx ${r.vx.toFixed(1)}, facing ${p.facing})`);
  ({ w, p, rats: [r] } = setup());
  grab(w, p);
  stepWorld(w, { ...N, jump: true }); run(w, T.wind + 1);
  check(r.state === 'thrown' && r.vx > 0, 'jump throws forward');
  run(w, T.recovery + 2);
  check(p.state === 'idle' && !p.grab, 'throw recovery ends in idle');
}
// break free after holdMax; a hit on the holder drops the grab
{
  let { w, p, rats: [r] } = setup();
  grab(w, p);
  run(w, G.holdMax - 1);
  check(r.state === 'grabbed', 'still held just before holdMax');
  run(w, 2);
  check(r.state === 'hurt' && p.state === 'idle' && r.vx > 0 && !r.heldBy, `breaks free and stumbles back at holdMax (state ${r.state})`);
  ({ w, p, rats: [r] } = setup([45, -60]));
  grab(w, p);
  const r2 = w.fighters[2];
  r2.facing = 1; startMove(r2, rat.attack);
  run(w, r2.move.windup + r2.move.active);
  check(p.state === 'hurt' && !p.grab && r.state === 'hurt' && !r.heldBy, `hit from behind drops the grab (hero ${p.state}, rat ${r.state})`);
}
// wall bounce: a thrown body and a knocked-down rat at the edge bounce back and stay on the belt
{
  const { w, p, rats: [r] } = setup([45]);
  const fl = w.stage.floor;
  p.x = fl.right - 120; r.x = p.x + 45;
  grab(w, p);
  stepWorld(w, { ...R, attack: true });
  let minX = 1e9, maxX = -1e9, bounced = false;
  for (let i = 0; i < 90; i++) { stepWorld(w, N); minX = Math.min(minX, r.x); maxX = Math.max(maxX, r.x); bounced ||= r.vx < 0; }
  check(bounced && maxX <= fl.right, `thrown body bounces off the right edge (max x ${maxX.toFixed(0)}, vx<0 seen ${bounced})`);
  check(r.x < fl.right - 5 && r.x >= fl.left, `ends back on the belt (x ${r.x.toFixed(0)})`);
  const s = setup([0]), k = s.rats[0];
  k.x = fl.left + 5; k.state = 'knockdown'; k.vx = -RULES.knockdown.vx; k.vz = 3; k.z = 1;
  run(s.w, 3);
  check(k.vx > 0 && k.x >= fl.left, `knocked-down rat bounces off the left edge (vx ${k.vx.toFixed(2)})`);
  const old = RULES.wallBounce;
  RULES.wallBounce = 0;
  const s0 = setup([0]), k0 = s0.rats[0];
  k0.x = fl.left + 5; k0.state = 'knockdown'; k0.vx = -RULES.knockdown.vx; k0.vz = 3; k0.z = 1;
  run(s0.w, 3);
  check(k0.vx < 0 && k0.x === fl.left, 'wallBounce 0: old behaviour (clamped, no bounce)');
  RULES.wallBounce = old;
}
// AI: a grabbed rat drops its token; others keep moving, don't stack on him, and may still attack the holder
{
  const { w, p, rats: [r, r2, r3] } = setup([45, 160, -160], { ai: true });
  r.ai.token = true;
  grab(w, p);
  check(p.state === 'grabbing', 'AI setup grab');
  stepWorld(w, N);
  check(!r.ai.token, 'grabbed rat released its token');
  const start = [r2.x, r3.x];
  let tokens = 0, overlap = 0, swings = 0;
  bus.on('swing', (e) => { if (e.f !== p) swings++; });
  for (let i = 0; i < G.holdMax - 20 && p.state === 'grabbing'; i++) {
    stepWorld(w, N);
    tokens = Math.max(tokens, w.fighters.filter((f) => f.ai?.token).length);
    for (const o of [r2, r3]) if (Math.abs(o.x - r.x) < 20 && Math.abs(o.y - r.y) < 8) overlap++;
  }
  check(tokens <= RULES.maxAttackers, `token limit kept (${tokens})`);
  check(Math.abs(r2.x - start[0]) > 5 || Math.abs(r3.x - start[1]) > 5, 'other rats keep moving');
  check(overlap < 10, `other rats don't stack on the grabbed one (${overlap} frames)`);
  check(swings > 0 || p.state === 'hurt', 'other rats still attack the holder');
}
// grab-and-throw bot: 3 min x 3 seeds, no NaN, nobody stuck grabbed, tokens fair, enemies defeated
{
  for (const seed of [1, 2, 3]) {
    reset();
    const w = createWorld('harbor-market', 'mouse-fighter', seed), p = w.player;
    let stuck = 0;
    for (let i = 0; i < 60 * 180 && !w.over; i++) {
      const foes = w.fighters.filter((f) => f.team === 'enemy' && !f.entering && f.state !== 'dead');
      const e = foes.sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      let c = N;
      if (p.state === 'grabbing') c = p.t > 20 ? { ...N, mx: (i >> 7) % 2 ? -p.facing : p.facing, attack: true } : { ...N, attack: p.t % 25 === 5 };
      else if (e) {   // push into the nearest rat; swing at him if he's winding up (can't grab an attacker)
        const near = Math.abs(e.x - p.x) < 75 && Math.abs(e.y - p.y) < 10;
        c = { ...N, mx: Math.sign(e.x - p.x), my: Math.abs(e.y - p.y) > 4 ? Math.sign(e.y - p.y) : 0, attack: near && e.state === 'attack' && i % 6 === 0 };
      }
      stepWorld(w, c);
      for (const f of w.fighters) {
        if (![f.x, f.y, f.z, f.hp, f.vx].every(Number.isFinite)) { check(false, `NaN on ${f.def.id} frame ${w.frame}`); break; }
        if (f.state === 'grabbed' && f.heldBy !== p) stuck++;
      }
      check(w.fighters.filter((f) => f.ai?.token).length <= RULES.maxAttackers, 'grab bot: more attackers than allowed');
    }
    console.log(`grab bot seed ${seed}: kos=${w.kos} hp=${p.hp} grabs=${ev.grab.length} throws=${ev.throw.length} bowled=${ev.thrownHit.length}`);
    check(stuck === 0, `no rat stuck grabbed (${stuck})`);
    check(ev.grab.length > 0 && ev.throw.length > 0 && w.kos > 0, 'grab bot grabs, throws and defeats enemies');
  }
}

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
