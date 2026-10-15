// Held weapons and the grab button's other uses (T010). Pure logic. Weapon kits: data/items (kind 'weapon').
// f.weapon = { def, uses, hit, broken } while a fighter holds one: its moves replace the fighter's own
// (movesOf / attackOf), each move that lands on an enemy costs one use, and at 0 it breaks (`weaponBreak`; the
// empty hand finishes the swing, then the fighter's own moves return). Grab button (H), for fighters with `pickup`:
// holding a weapon -> eat food underfoot, else swap for a weapon underfoot, else toss the weapon (state `toss`:
// wind, release, recovery); empty-handed -> grab an enemy in reach (sim/grab.js) first, else eat / pick up the item underfoot.
// Picking up a weapon is state `pickup` (round 2): stow (sheathe the sword, or flick the held weapon aside: it lands
// behind him), reach (crouch; the weapon is in hand at the end), rise. Only one weapon is ever held.
import { RULES } from '../data/rules.js';
import { bus } from '../core/events.js';
import { setState } from './fighter.js';
import { tryGrab } from './grab.js';
import { spawnItem } from './props.js';

export const movesOf = (f) => f.weapon?.def.moves ?? f.def.moves;
export const attackOf = (f) => f.weapon?.def.attack ?? f.def.attack;
export const airAttackOf = (f) => f.weapon?.def.airAttack ?? f.def.airAttack;

// Nearest floor item within the fighter's pickup reach (optionally of one kind).
export function itemUnder(f, w, kind) {
  const P = f.def.pickup;
  let best = null;
  for (const it of w.items) {
    if (it.state !== 'floor' || (kind && it.def.kind !== kind)) continue;
    if (Math.abs(it.x - f.x) > P.range || Math.abs(it.y - f.y) > P.depth) continue;
    if (!best || Math.abs(it.x - f.x) < Math.abs(best.x - f.x)) best = it;
  }
  return best;
}

function eat(f, it, w) {
  const heal = Math.min(it.def.heal, f.maxHp - f.hp);
  f.hp += heal; it.gone = true;
  w.items = w.items.filter((i) => i !== it);
  bus.emit('eat', { f, item: it.def, heal, x: it.x, y: it.y });
  return true;
}

function startPickup(f, it, w) {
  setState(f, 'pickup'); f.vx = f.vy = 0;
  f.pickup = { item: it, swap: !!f.weapon };
  if (f.weapon) {   // flick the held one aside: it pops out behind him, uses kept
    const P = f.def.pickup;
    spawnItem(w, f.weapon.def.id, f.x - f.facing * 16, f.y, P.asideZ, { vx: -f.facing * P.asideVx, vz: P.asideVz, uses: f.weapon.uses });
    bus.emit('weaponDrop', { f, item: f.weapon.def, aside: true });
    f.weapon = null;
  }
  return true;
}

// `pickup`: the weapon comes into the hand at the end of the reach (if it is still lying there), then he rises.
export function stepPickup(f, w) {
  const P = f.def.pickup, it = f.pickup?.item;
  f.vx = f.vy = 0;
  if (f.t === P.stow + P.reach && it && w.items.includes(it) && it.state === 'floor') {
    w.items = w.items.filter((i) => i !== it);
    f.weapon = { def: it.def, uses: it.uses, hit: false, broken: false };
    bus.emit('pickup', { f, item: it.def, x: it.x, y: it.y });
  }
  if (f.t >= P.stow + P.reach + P.rise) { f.pickup = null; setState(f, 'idle'); }
}

// Grab button pressed in idle/walk. true = it did something (the fighter's step ends).
export function pressGrab(f, w) {
  if (!f.def.pickup) return !!(f.def.grab && tryGrab(f, w));
  if (f.weapon) {
    const food = itemUnder(f, w, 'food');
    if (food) return eat(f, food, w);
    const other = itemUnder(f, w, 'weapon');
    if (other) return startPickup(f, other, w);
    if (!f.def.toss) return false;
    setState(f, 'toss'); f.vx = f.vy = 0;
    return true;
  }
  if (f.def.grab && tryGrab(f, w)) return true;
  const it = itemUnder(f, w);
  if (!it) return false;
  return it.def.kind === 'food' ? eat(f, it, w) : startPickup(f, it, w);
}

// `toss`: wind, then the weapon leaves the hand as a spinning projectile (sim/props.js stepItems), recovery.
export function stepToss(f, w) {
  const T = f.def.toss;
  f.vx = f.vy = 0;
  if (f.t === T.wind && f.weapon) {
    const it = spawnItem(w, f.weapon.def.id, f.x + f.facing * 20, f.y, T.z, { vx: f.facing * T.vx, vz: T.vz, uses: f.weapon.uses });
    it.state = 'fly'; it.dir = f.facing; it.thrower = f;
    f.weapon = null;
    bus.emit('weaponThrow', { f, item: it });
  }
  if (f.t >= T.wind + T.recovery) setState(f, 'idle');
}

// A move that lands on an enemy costs the held weapon one use (once per move); at 0 it breaks.
export function wearWeapon(a, at, t) {
  const W = a.weapon;
  if (!W || W.broken || W.hit) return;
  W.hit = true;
  if (--W.uses > 0) return;
  W.broken = true;
  bus.emit('weaponBreak', { f: a, weapon: W.def, x: at.x, y: t.y, z: at.z });
}

// Every step: a broken weapon leaves the hand once its swing is over; a knockdown knocks a held weapon loose.
export function settleWeapon(f, w) {
  if (!f.weapon) return;
  if (f.weapon.broken) { if (!f.move) f.weapon = null; return; }
  if (f.state === 'knockdown' && RULES.items.dropOnKnockdown) {
    spawnItem(w, f.weapon.def.id, f.x, f.y, 50, { vx: -f.facing * 1.8, vz: 4, uses: f.weapon.uses });
    bus.emit('weaponDrop', { f, item: f.weapon.def });
    f.weapon = null;
  }
}
