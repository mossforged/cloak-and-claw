// Downed heroes and picking a friend up (T022). Pure logic; numbers in RULES.downed / RULES.revive.
// With more than one hero, a hero at 0 hp lies 'downed' (can't act, can't be hit, enemies leave him: sim/ai.js) for
// RULES.downed.frames, then bleeds out ('dead' for the rest of the fight, sim/heroes.js). A friend standing by him who
// presses and holds grab (H / Y) goes into 'revive' (f.revive = { target }); after RULES.revive.frames the downed hero
// gets up with hpShare of his health and some invulnerability. Letting go, or being hit (any state change), cancels it.
import { RULES } from '../data/rules.js';
import { bus } from '../core/events.js';
import { setState } from './fighter.js';
import { bleedOut } from './heroes.js';

// Only a hero with a friend in the world goes downed; a lone hero dies at 0 hp as before.
export const canGoDown = (f, w) => f.team === 'hero' && w.heroes.length > 1 && w.heroes.includes(f);

export function goDown(f) {
  setState(f, 'downed'); f.downT = RULES.downed.frames;
  bus.emit('downed', { f });
}

// The hero picking h up right now (or undefined).
export const reviverOf = (h, w) => w.heroes.find((r) => r.state === 'revive' && r.revive?.target === h);

export function stepDowned(f, w) {
  f.vx *= 0.8; f.vy = 0;
  if (RULES.downed.pause && reviverOf(f, w)) return;
  if (--f.downT <= 0) bleedOut(f);
}

// The nearest downed friend within reach of f's feet.
export function downedNear(f, w) {
  const R = RULES.revive;
  let best = null;
  for (const h of w.heroes) {
    if (h === f || h.state !== 'downed' || Math.abs(h.x - f.x) > R.range || Math.abs(h.y - f.y) > R.depth) continue;
    if (!best || Math.abs(h.x - f.x) < Math.abs(best.x - f.x)) best = h;
  }
  return best;
}

// Grab pressed in idle/walk by a downed friend: start picking him up. true = started.
export function startRevive(f, w) {
  const t = downedNear(f, w);
  if (!t) return false;
  setState(f, 'revive'); f.vx = f.vy = 0;
  f.revive = { target: t };
  f.facing = Math.sign(t.x - f.x) || f.facing;
  bus.emit('reviveStart', { f, target: t });
  return true;
}

// 0..1 how far f is through picking his friend up (0 when not reviving).
export const reviveProgress = (f) => (f.state === 'revive' ? Math.min(1, f.t / RULES.revive.frames) : 0);

export function stopRevive(f, why) {
  if (!f.revive) return;
  bus.emit('reviveStop', { f, target: f.revive.target, why });
  f.revive = null;
}

export function stepRevive(f, w) {
  const R = RULES.revive, t = f.revive?.target;
  f.vx = f.vy = 0;
  if (!f.control.grabHeld || t?.state !== 'downed') { stopRevive(f, 'letGo'); setState(f, 'idle'); return; }
  if (f.t < R.frames) return;
  t.hp = Math.max(1, Math.round(t.maxHp * R.hpShare));
  setState(t, 'getup'); t.invuln = RULES.knockdown.getupFrames + R.invuln;
  bus.emit('revive', { f, target: t, x: t.x, y: t.y });
  f.revive = null; setState(f, 'idle');
}
