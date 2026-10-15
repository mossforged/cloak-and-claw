// Shield block (T007): a frontal hit on a blocking hero does chip damage only (no hurt, no knockdown) and
// emits `block`; a hit from behind lands; blocking can't attack; releasing returns to idle; enemies can't block.
import { createWorld, stepWorld } from '../src/sim/world.js';
import { createFighter, startMove } from '../src/sim/fighter.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { bus } from '../src/core/events.js';
import { createRunLog } from '../src/log/runlog.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };

const rat = FIGHTERS['rat-raider'], hero = FIGHTERS['mouse-fighter'], B = hero.block;
const events = { block: [], hit: [] };
bus.on('block', (e) => events.block.push(e));
bus.on('hit', (e) => events.hit.push(e));
const log = createRunLog();

const HOLD = { mx: 0, my: 0, attack: false, jump: false, block: true };

// Hero facing right, holding block; a rat at its attack spot on side `side` swings (heavy hits via override).
function swingAt(side, { control = HOLD, move } = {}) {
  events.block.length = events.hit.length = 0;
  const w = createWorld('harbor-market', 'mouse-fighter', 1);
  const p = w.player;
  log.begin(w);
  stepWorld(w, control);   // enter block
  const r = createFighter(rat, p.x + side * rat.ai.range, p.y, { facing: -side });
  w.fighters.push(r);
  startMove(r, rat.attack);
  if (move) r.move = { ...r.move, ...move };
  const startX = r.x;
  for (let k = 0; k < r.move.windup + r.move.active + 2; k++) stepWorld(w, control);
  return { w, p, r, startX };
}

// front hit: blocked
{
  const { p, r, startX } = swingAt(1);
  check(events.block.length === 1 && events.hit.length === 0, `front: one block event, no hit (got ${events.block.length}/${events.hit.length})`);
  check(p.hp === p.maxHp - B.chip, `front: chip damage only (hp ${p.hp})`);
  check(p.state === 'block', `front: still blocking (state ${p.state})`);
  check(p.facing === 1, 'front: facing locked');
  check(r.x > startX + 1, `front: attacker shoved back (x ${startX} -> ${r.x.toFixed(1)})`);
  const e = events.block[0];
  check(e && e.attacker === r && e.target === p && e.move === rat.moves.ratSlash && [e.x, e.y, e.z].every(Number.isFinite), 'front: block payload');
  check(e && e.x > p.x, 'front: block point on the shield side');
  check(log.summary().blocks === 1, 'run log counts the block');
}
// a knockdown move is still blocked
{
  const { p } = swingAt(1, { move: { knockdown: true, damage: 40 } });
  check(events.block.length === 1 && p.state === 'block' && p.hp === p.maxHp - B.chip, 'front: a knockdown hit is blocked too');
}
// chip damage when set, and chip never KOs
{
  const old = B.chip;
  B.chip = 5;
  let { p } = swingAt(1);
  check(p.hp === p.maxHp - 5 && events.block[0].damage === 5, `chip 5 takes 5 (hp ${p.hp})`);
  check(log.summary().damageTaken === 5, 'run log counts chip as damage taken');
  B.chip = 999;
  ({ p } = swingAt(1));
  check(p.hp === 1 && p.state === 'block', `chip never KOs (hp ${p.hp})`);
  B.chip = old;
}
// hit from behind: lands normally
{
  const { p } = swingAt(-1);
  check(events.hit.length === 1 && events.block.length === 0, 'behind: hit lands, no block');
  check(p.hp < p.maxHp && p.state === 'hurt', `behind: hurt (state ${p.state}, hp ${p.hp})`);
}
// no block pressed: same as before
{
  const { p } = swingAt(1, { control: { ...HOLD, block: false } });
  check(events.hit.length === 1 && p.state === 'hurt', 'not blocking: hit lands');
}
// blocking can't attack, facing locked while walking, release -> idle
{
  const w = createWorld('harbor-market', 'mouse-fighter', 1), p = w.player;
  for (let i = 0; i < 20; i++) stepWorld(w, { ...HOLD, attack: true, mx: -1 });
  check(p.state === 'block' && !p.move, `blocking: attack ignored (state ${p.state})`);
  check(p.facing === 1, 'blocking: facing locked while moving');
  check(Math.abs(p.vx) <= B.walkSpeed + 1e-9, `blocking: shuffle at walkSpeed (vx ${p.vx})`);
  stepWorld(w, { ...HOLD, block: false });
  check(p.state === 'idle', 'release: back to idle');
  stepWorld(w, { ...HOLD, block: false, attack: true });
  check(p.state === 'attack', 'after release: can attack');
}
// blockstun: can't act or leave block during it
{
  const { w, p } = swingAt(1);
  const e = events.block[0];
  check(e, 'blockstun setup');
  w.fighters = [p];   // rat gone; check from a fresh stun
  p.t = 0; p.stun = B.stun;
  stepWorld(w, { ...HOLD, block: false, attack: true });
  check(B.stun <= 1 || (p.state === 'block' && !p.move), 'blockstun: release + attack does nothing yet');
  for (let i = 0; i < B.stun + 1; i++) stepWorld(w, { ...HOLD, block: false });
  check(p.state === 'idle', 'after blockstun: release returns to idle');
}
// enemies have no block config: a rat told to block doesn't
{
  const w = createWorld('harbor-market', 'mouse-fighter', 1);
  const r = createFighter(rat, 500, w.player.y);
  r.control.block = true;
  w.fighters.push(r);
  for (let i = 0; i < 5; i++) stepWorld(w, { mx: 0, my: 0, attack: false, jump: false });
  check(!rat.block && r.state !== 'block', 'rat never blocks');
}

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
