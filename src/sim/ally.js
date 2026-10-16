// AI ally brain (T022). A hero slot with controller { kind: 'ai' } (makeAlly); writes a control object like a pad does,
// so he uses the hero's own moves, block, revive and potions. Numbers: data/ally.js. Uses no rng.
// Rules, first that applies wins:
//  1. danger: an enemy in windup (or an arrow in flight) whose reach and lane hold him -> step out of the lane (and back),
//     after ALLY.react frames (before that he only holds still: he never swings into a telegraph);
//     cornered and facing the attacker -> block.
//  2. a downed friend -> go and pick him up (hold grab), unless an enemy in windup is right by him.
//  3. potions: toss his to a friend below potionAt; drink it below drinkAt when no enemy is near and no friend needs it;
//     an empty slot and a potion lying close by -> fetch it, but only once every player-hero already carries one.
//  4. leash: too far from his player-hero -> walk back to him.
//  5. fight the nearest enemy not engaging the player-hero: one slash at a time, swingGap apart, never on a reeling enemy.
//  6. else follow a little behind the player-hero.
import { ALLY } from '../data/ally.js';
import { RULES } from '../data/rules.js';
import { phaseOf, canAct } from './fighter.js';
import { isUp } from './heroes.js';
import { downedNear } from './revive.js';
import { itemUnder } from './weapons.js';

export function makeAlly(h) {
  h.controller = { kind: 'ai' };
  h.dmgScale = ALLY.damage;
  h.ally = { lastSwing: -999, plan: null, returning: false };
  return h;
}

const idle = () => ({ mx: 0, my: 0, attack: false, jump: false, block: false, grab: false, grabHeld: false, use: false });
const foes = (w) => w.fighters.filter((f) => f.team === 'enemy' && !f.entering && f.state !== 'dead');
const share = (h) => h.hp / h.maxHp;
const nearest = (list, f) => list.reduce((a, b) => (Math.abs(b.x - f.x) + 2 * Math.abs(b.y - f.y) < Math.abs(a.x - f.x) + 2 * Math.abs(a.y - f.y) ? b : a));

// The player-hero he sticks with: the first non-ally hero who is up (else the first non-ally hero).
function leaderOf(w, h) {
  const humans = w.heroes.filter((o) => o !== h && o.controller.kind !== 'ai');
  return humans.find(isUp) ?? humans[0] ?? null;
}

// Attacks that could reach him: [{ from, lane }] (from = an enemy in windup or swinging, or an arrow in flight; lane = the
// half-width in y he must be outside of). Only those whose reach (x) covers him.
function threats(w, h) {
  const D = ALLY.dodge, half = h.def.body.w / 2, out = [];
  for (const e of foes(w)) {
    const m = e.move, ph = e.move && phaseOf(e)[0];
    if (ph !== 'windup' && ph !== 'active') continue;
    const ahead = (h.x - e.x) * e.facing;   // + = in front of him
    const reach = m.shot ? m.shot.range : m.hitbox.x + m.hitbox.w + (m.lunge ?? 0) * Math.max(0, m.windup + m.active - e.mf) + half;
    if (ahead < -half || ahead > reach + D.reach || (m.shot && ph === 'active')) continue;
    out.push({ from: e, lane: (m.shot ? m.shot.depth : m.depth ?? RULES.depthHit) + D.lane, fresh: e.mf < ALLY.react });
  }
  for (const s of w.shots) {
    const ahead = (h.x - s.x) * Math.sign(s.vx);
    if (s.team !== h.team && ahead >= -half && ahead <= 300) out.push({ from: s, lane: s.def.depth + D.lane });
  }
  return out;
}

// The attack about to hit him if he stays in its lane, or null.
export const dangerTo = (w, h) => threats(w, h).find((d) => Math.abs(h.y - d.from.y) <= d.lane) ?? null;

// Whatever else he is doing, he never steps into a threatened lane (so a dodge doesn't undo itself).
function keepOut(c, h, w) {
  if (!c.my) return c;
  const y = h.y + c.my * h.def.move.depth * (h.def.stats.speed ?? 1);
  if (threats(w, h).some((d) => Math.abs(y - d.from.y) <= d.lane && Math.abs(y - d.from.y) < Math.abs(h.y - d.from.y))) c.my = 0;
  return c;
}

function go(c, h, fl, tx, ty, tol = 6) {
  const dx = tx - h.x, dy = ty - h.y;
  c.mx = Math.abs(dx) > tol ? Math.sign(dx) : 0;
  c.my = Math.abs(dy) > 3 ? Math.sign(dy) : 0;
  const p = h.blockedBy;   // a prop in the way: step round it on the side with room (as the enemies do)
  if (p && c.mx && Math.abs(dy) < p.def.body.d) {
    c.my = h.y >= p.y ? 1 : -1;
    if ((c.my > 0 ? fl.bottom - p.y : p.y - fl.top) - p.def.body.d / 2 < 12) c.my = -c.my;
  }
  return c;
}

function dodge(c, h, w, d) {
  const fl = w.bounds, e = d.from, need = d.lane + 2;
  const room = (s) => (s > 0 ? fl.bottom - e.y : e.y - fl.top) >= need;
  let s = Math.sign(h.y - e.y) || (fl.bottom - h.y > h.y - fl.top ? 1 : -1);
  if (!room(s)) s = -s;
  if (!room(s) && h.def.block && Math.sign(e.x - h.x) === h.facing) { c.block = true; return c; }
  c.my = s;
  if (e.kind !== 'shot') c.mx = Math.sign(h.x - e.x) || 0;   // and back out of reach
  return c;
}

function potionPlan(c, h, w) {
  const A = ALLY, P = RULES.potions, M = h.ally;
  if (h.state === 'potion') { c.use = M.plan === 'drink'; return c; }
  if (h.state === 'potionToss' || h.state === 'drink') { c.use = M.plan === 'drink'; return c; }
  if (!h.potion || !canAct(h)) return null;
  const needy = w.heroes.filter((o) => o !== h && isUp(o) && share(o) < A.potionAt && Math.hypot(o.x - h.x, o.y - h.y) <= P.reach);
  if (needy.length) {
    const t = needy.reduce((a, b) => (share(b) < share(a) ? b : a)), s = Math.sign(t.x - h.x) || h.facing;
    if (s !== h.facing) { c.face = s; return c; }   // turn first, then toss (a toss goes to the friend in front)
    M.plan = 'toss'; c.use = true; return c;
  }
  const near = foes(w).some((e) => Math.abs(e.x - h.x) < A.alone && Math.abs(e.y - h.y) < 60);
  if (share(h) < A.drinkAt && !near) { M.plan = 'drink'; c.use = true; return c; }
  return null;
}

export const allyControl = (w, h) => (isUp(h) ? keepOut(think(w, h), h, w) : think(w, h));

function think(w, h) {
  const A = ALLY, M = h.ally, c = idle(), lead = leaderOf(w, h), fl = w.bounds;
  h.dmgScale = A.damage;   // read live (lab)
  if (!isUp(h)) return c;

  // 1. step out of telegraphed danger
  const d = dangerTo(w, h);
  if (d) return d.fresh ? c : dodge(c, h, w, d);   // the first `react` frames: he only holds off (no swing into it)

  // 2. pick up a downed friend
  const down = w.heroes.filter((o) => o !== h && o.state === 'downed');
  if (down.length) {
    const t = nearest(down, h);
    const threat = foes(w).some((e) => phaseOf(e)[0] === 'windup' && Math.abs(e.x - t.x) < A.rescueSafe && Math.abs(e.y - t.y) < 40);
    if (!threat) {
      if (h.state === 'revive') { c.grabHeld = true; return c; }
      if (canAct(h) && downedNear(h, w) === t) { c.grab = c.grabHeld = true; return c; }
      const side = Math.sign(h.x - t.x) || 1;
      return go(c, h, fl, Math.max(fl.left, Math.min(fl.right, t.x + side * 34)), t.y, 4);
    }
  }

  // 3. potions
  const pot = potionPlan(c, h, w);
  if (pot) return pot;
  const playersFull = w.heroes.every((o) => o === h || o.controller.kind === 'ai' || !isUp(o) || o.potion);
  if (!h.potion && playersFull && canAct(h) && !foes(w).some((e) => Math.abs(e.x - h.x) < A.alone)) {   // floor potions are the players' first
    const it = w.items.filter((i) => i.state === 'floor' && i.def.kind === 'potion' && Math.abs(i.x - h.x) < A.fetch && Math.abs(i.y - h.y) < 80);
    if (it.length) {
      const p = nearest(it, h);
      if (itemUnder(h, w, 'potion') === p) { c.grab = true; return c; }
      return go(c, h, fl, p.x, p.y, 4);
    }
  }
  if (!lead) return c;

  // 4. leash
  const far = Math.abs(h.x - lead.x);
  if (far > A.leash) M.returning = true;
  if (M.returning && far < A.back) M.returning = false;
  const home = () => go(c, h, fl, Math.max(fl.left, Math.min(fl.right, lead.x - lead.facing * A.hover)), Math.max(fl.top, Math.min(fl.bottom, lead.y + 18)), 10);
  if (M.returning) return home();

  // 5. fight an enemy that is not engaging the player-hero
  const free = foes(w).filter((e) => !(e.ai?.token && e.ai.target === lead.slot) && Math.abs(e.x - lead.x) < A.leash);
  if (free.length) {
    const e = nearest(free, h), side = Math.sign(h.x - e.x) || -lead.facing;
    const tx = Math.max(fl.left, Math.min(fl.right, e.x + side * A.range));
    go(c, h, fl, tx, e.y, 8);
    const lined = Math.abs(h.x - tx) <= 12 && Math.abs(h.y - e.y) <= A.laneTol;
    if (lined) {
      c.mx = 0; c.my = 0; c.face = -side;
      const open = !['hurt', 'knockdown', 'down', 'getup', 'grabbed', 'thrown'].includes(e.state) || !A.waitHurt;
      if (canAct(h) && h.facing === -side && open && w.frame - M.lastSwing >= A.swingGap) { c.attack = true; M.lastSwing = w.frame; }
    }
    return c;
  }

  // 6. follow
  home();
  if (!c.mx && !c.my) c.face = lead.facing;
  return c;
}
