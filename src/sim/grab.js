// Grab and throw (T009). Pure logic. Numbers: the holder's def.grab / def.throw; RULES.wallBounce.
// Pressing grab (control.grab) with a `throwable` enemy in reach in front grabs him: holder `grabbing`,
// held `grabbed` (helpless). Walking into enemies never grabs on its own (round 2: always a choice). While holding: attack = knee (the
// grab.maxStrikes-th knocks down); attack + direction, or jump, = throw that way. He breaks free after
// grab.holdMax frames; a hit on the holder drops him. Throw: holder `throw` (wind, release, recovery);
// the body is `thrown`, an arc that knocks down enemies it touches (`thrownHit`) and lands knocked down.
// f.grab = { target, strikes, knee, queued, dir, back } lives through `grabbing` and `throw`.
import { RULES } from '../data/rules.js';
import { bus } from '../core/events.js';
import { setState } from './fighter.js';

const GRABBABLE = ['idle', 'walk', 'hurt'];
const BOWLABLE = ['idle', 'walk', 'attack', 'hurt', 'block'];
const damageOf = (by, t, base) => Math.max(1, Math.round(base + (by.def.stats.power ?? 0) - (t.def.stats.defense ?? 0)));

function knockDown(t, dir) {
  const K = RULES.knockdown;
  t.move = null; setState(t, 'knockdown');
  t.vz = K.vz; t.vx = dir * K.vx; t.vy = 0; t.z = Math.max(t.z, 0.01);
}

// The nearest throwable enemy in reach on the side the fighter faces (or is pushing toward), if any.
function targetOf(f, w) {
  const G = f.def.grab, dir = Math.sign(f.control.mx) || f.facing;
  let best = null;
  for (const t of w.fighters) {
    if (t.team === f.team || !t.def.throwable || !GRABBABLE.includes(t.state) || t.entering || t.z > 0 || t.invuln > 0) continue;
    const dx = t.x - f.x;
    if (Math.sign(dx) !== dir || Math.abs(dx) > G.range || Math.abs(t.y - f.y) > G.depth) continue;
    if (!best || Math.abs(dx) < Math.abs(best.x - f.x)) best = t;
  }
  return best;
}

const hold = (f, t) => { t.x = f.x + f.facing * f.def.grab.holdX; t.y = f.y + f.def.grab.holdY; t.z = 0; t.vx = t.vy = t.vz = 0; };

// Called from idle/walk when grab is pressed (after attack and block had their chance). true = grabbed.
export function tryGrab(f, w) {
  const G = f.def.grab, t = targetOf(f, w);
  if (!t) return false;
  f.facing = Math.sign(t.x - f.x) || f.facing;
  setState(f, 'grabbing'); f.vx = f.vy = 0;
  f.grab = { target: t, strikes: 0, knee: -1, queued: false, dir: 0, back: false };
  t.move = null; t.ai && (t.ai.token = false);
  setState(t, 'grabbed'); t.facing = -f.facing; t.heldBy = f;
  hold(f, t);
  bus.emit('grab', { f, target: t, x: f.x + f.facing * G.holdX * 0.5, y: f.y, z: G.clinchZ });
  return true;
}

// Holder loses the grip (hit, or the body slipped away): the held enemy stumbles free (falls if lifted).
export function releaseGrab(f) {
  const t = f.grab?.target, G = f.def.grab;
  f.grab = null;
  if (!t || t.state !== 'grabbed') return;
  t.heldBy = null;
  if (t.z > 0) { setState(t, 'knockdown'); t.vx = 0; t.vz = 0; return; }
  setState(t, 'hurt'); t.stun = G.dropStun; t.vx = f.facing * G.breakPush * 0.5;
}

function breakFree(f, t) {
  const G = f.def.grab;
  f.grab = null; t.heldBy = null;
  setState(t, 'hurt'); t.stun = G.breakStun; t.vx = f.facing * G.breakPush;
  setState(f, 'idle');
}

function knee(f, t, w) {
  const G = f.def.grab, g = f.grab;
  g.strikes++;
  const last = g.strikes >= G.maxStrikes;
  const move = last ? { ...G.knee, ...G.lastKnee, knockdown: true } : G.knee;
  const dmg = damageOf(f, t, move.damage);
  t.hp = Math.max(0, t.hp - dmg); t.lastHit = w.frame;
  if (last || t.hp <= 0) { g.target = null; t.heldBy = null; knockDown(t, f.facing); }
  else setState(t, 'grabbed');   // t restarts: the standee's jerk
  bus.emit('hit', { attacker: f, target: t, move, damage: dmg, x: t.x - f.facing * t.def.body.w * 0.3, y: t.y, z: G.clinchZ, ko: t.hp <= 0, targetPhase: 'none' });
}

export function stepGrabbing(f, w) {
  const G = f.def.grab, K = G.knee, g = f.grab, t = g?.target, c = f.control;
  f.vx = f.vy = 0;
  if (!g) return setState(f, 'idle');
  if (g.knee >= 0) {
    if (c.attack) g.queued = true;
    if (t) hold(f, t);
    if (++g.knee === K.windup && t) knee(f, t, w);
    if (g.knee < K.windup + K.active + K.recovery) return;
    g.knee = -1;
  }
  if (!g.target) { f.grab = null; return setState(f, 'idle'); }
  if (f.t >= G.holdMax) return breakFree(f, t);
  hold(f, t);
  const dir = Math.sign(c.mx);
  if ((c.attack && dir) || c.jump) {
    g.dir = dir || f.facing; g.back = g.dir !== f.facing; g.queued = false;
    return setState(f, 'throw');
  }
  if (c.attack || g.queued) { g.queued = false; g.knee = 0; }
}

// `throw`: wind (the body swings with him; over his head for a back throw), release, recovery.
export function stepThrow(f, w) {
  const T = f.def.throw, g = f.grab, t = g?.target;
  f.vx = f.vy = 0;
  if (t && f.t < T.wind) {
    const k = f.t / T.wind, hx = f.def.grab.holdX;
    const off = g.back ? hx * Math.cos(Math.PI * k) : hx * (1 - 0.35 * k);
    t.x = f.x + f.facing * off; t.y = f.y + f.def.grab.holdY;
    t.z = T.z * k + (g.back ? T.overZ * Math.sin(Math.PI * k) : 0);
  } else if (t) {
    g.target = null; t.heldBy = null; t.thrower = f;
    t.x = f.x + g.dir * f.def.grab.holdX * (g.back ? 1 : 0.65); t.z = T.z;
    setState(t, 'thrown'); t.facing = -g.dir; t.hitList.clear();
    t.vx = g.dir * T.vx; t.vz = T.vz; t.vy = 0;
    f.facing = g.dir;
    bus.emit('throw', { f, target: t, dir: g.dir, back: g.back });
  }
  if (f.t >= T.wind + T.recovery) { f.grab = null; setState(f, 'idle'); }
}

// A thrown body hits the floor: knocked down with throw.damage.
export function landThrown(f) {
  const by = f.thrower, T = by.def.throw, dmg = damageOf(by, f, T.damage);
  f.hp = Math.max(0, f.hp - dmg); f.lastHit = -999; f.thrower = null;
  f.vx *= 0.4; setState(f, 'down');
  bus.emit('land', { f, heavy: true });
  bus.emit('hit', { attacker: by, target: f, move: { damage: T.damage, knockdown: true, hitstop: T.landHitstop, shake: T.landShake },
    damage: dmg, x: f.x, y: f.y, z: 20, ko: f.hp <= 0, targetPhase: 'none' });
}

// Crowd bowling: a thrown body knocks down every other enemy it touches once (throw.hitDamage).
export function resolveThrown(w) {
  for (const b of w.fighters) {
    if (b.state !== 'thrown' || !b.thrower) continue;
    const T = b.thrower.def.throw, dir = Math.sign(b.vx) || -b.facing;
    for (const t of w.fighters) {
      if (t === b || t.team !== b.team || b.hitList.has(t.id) || t.invuln > 0 || !BOWLABLE.includes(t.state)) continue;
      if (Math.abs(t.y - b.y) > T.depth || Math.abs(t.x - b.x) > (b.def.body.w + t.def.body.w) / 2 || b.z > t.def.body.h + t.z) continue;
      b.hitList.add(t.id);
      const dmg = damageOf(b.thrower, t, T.hitDamage);
      t.hp = Math.max(0, t.hp - dmg); t.lastHit = w.frame; t.facing = -dir;
      knockDown(t, dir);
      b.vx *= T.hitSlow;
      bus.emit('thrownHit', { thrower: b.thrower, body: b, target: t, damage: dmg, x: (b.x + t.x) / 2, y: t.y, z: Math.min(b.z + 30, 80), ko: t.hp <= 0 });
    }
  }
}
