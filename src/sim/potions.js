// Potions (T022): carried, tossed to a friend, or drunk. Pure logic; numbers in RULES.potions and data/items/health-potion.js.
// f.potion = the carried potion's def (one slot), picked up with grab (H) like food (sim/weapons.js pressGrab).
// Use (U / LB) in idle/walk starts 'potion' (standing, deciding): let go before drinkHold frames = 'potionToss'
// (wind, then a lobbed item flies in an arc to the ally it aims at, w.items state 'lob'), keep holding = 'drink'
// (heals at the end). A hit cancels both and he keeps the potion. A lob that lands within the potion's splash of a hero
// who is up and hurt heals the nearest such hero (`heal`); otherwise it lies on the floor as a pickup.
// Drops: crates, barrels and KO'd enemies may also drop one (RULES.potions.drops, rolled on w.potionRng).
import { RULES } from '../data/rules.js';
import { ITEMS } from '../data/items/index.js';
import { bus } from '../core/events.js';
import { setState } from './fighter.js';
import { spawnItem } from './props.js';
import { isUp } from './heroes.js';

export function takePotion(f, it, w) {
  f.potion = it.def;
  w.items = w.items.filter((i) => i !== it);
  bus.emit('potionPickup', { f, item: it.def, x: it.x, y: it.y });
  return true;
}

export function startPotion(f) { setState(f, 'potion'); f.vx = f.vy = 0; }

function heal(w, h, item, by, x, y) {
  const n = Math.min(item.heal, h.maxHp - h.hp);
  h.hp += n;
  bus.emit('heal', { f: h, by, item, heal: n, x, y });
}

// Who a toss goes to: the nearest hero up in front of f (within reach), else the nearest anywhere within reach; null = nobody.
export function aimOf(f, w) {
  const P = RULES.potions, d = (h) => Math.hypot(h.x - f.x, h.y - f.y);
  const all = w.heroes.filter((h) => h !== f && isUp(h) && d(h) <= P.reach);
  const front = all.filter((h) => Math.sign(h.x - f.x) === f.facing || Math.abs(h.x - f.x) < 10);
  const pool = front.length ? front : all;
  return pool.length ? pool.reduce((a, b) => (d(b) < d(a) ? b : a)) : null;
}

function lob(f, w) {
  const P = RULES.potions, g = RULES.items.gravity, T = P.flight, fl = w.bounds, to = aimOf(f, w);
  if (to) f.facing = Math.sign(to.x - f.x) || f.facing;
  const x0 = f.x + f.facing * 14;
  const tx = Math.max(fl.left, Math.min(fl.right, to ? to.x + to.vx * T * 0.5 : f.x + f.facing * P.fallback));
  const ty = Math.max(fl.top, Math.min(fl.bottom, to ? to.y + to.vy * T * 0.5 : f.y));
  const it = spawnItem(w, f.potion.id, x0, f.y, P.z, { vx: (tx - x0) / T, vz: (g * T * (T - 1) / 2 - P.z) / T });   // z = 0 after T steps
  Object.assign(it, { state: 'lob', vy: (ty - f.y) / T, thrower: f, aim: to });
  f.potion = null;
  bus.emit('potionToss', { f, item: it, to });
}

export function stepPotion(f, w) {
  const P = RULES.potions;
  f.vx = f.vy = 0;
  if (f.state === 'potion') {
    if (!f.control.use) setState(f, 'potionToss');
    else if (f.t >= P.drinkHold) setState(f, 'drink');
  } else if (f.state === 'potionToss') {
    if (f.t === P.wind && f.potion) lob(f, w);
    if (f.t >= P.wind + P.recovery) setState(f, 'idle');
  } else if (f.state === 'drink' && f.t >= P.drink) {
    if (f.potion) heal(w, f, f.potion, f, f.x, f.y);
    f.potion = null;
    setState(f, 'idle');
  }
}

// A lobbed potion touched the floor: heal the nearest hurt hero up within its splash. true = caught (it is gone).
export function landPotion(w, it) {
  const S = it.def.splash;
  const near = w.heroes.filter((h) => isUp(h) && h.hp < h.maxHp && Math.abs(h.x - it.x) <= S.x && Math.abs(h.y - it.y) <= S.y);
  if (!near.length) return false;
  const h = near.reduce((a, b) => (Math.abs(b.x - it.x) < Math.abs(a.x - it.x) ? b : a));
  heal(w, h, it.def, it.thrower, it.x, it.y);
  it.gone = true;
  return true;
}

// Maybe drop a potion from a broken prop / KO'd fighter (def id in RULES.potions.drops). Never with a lone hero unless drops.solo.
export function dropPotion(w, id, x, y, z) {
  const D = RULES.potions.drops;
  if (!D[id] || (!D.solo && w.heroes.length < 2) || !ITEMS['health-potion']) return;
  const R = w.potionRng;   // its own rng (also for the pop), so food and weapon drops stay as they were
  if (R.next() < D[id]) spawnItem(w, 'health-potion', x, y, z, { vx: (R.next() - 0.5) * 2 * RULES.items.popVx });
}
