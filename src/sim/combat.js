// Hit detection and damage. Boxes are in world space: x (left-right), z (height), plus a depth (y) tolerance.
import { RULES } from '../data/rules.js';
import { bus } from '../core/events.js';
import { phaseOf, setState, HELPLESS } from './fighter.js';
import { releaseGrab } from './grab.js';
import { wearWeapon } from './weapons.js';
import { stopRevive } from './revive.js';

export function hitboxOf(f) {
  if (!f.move?.hitbox || phaseOf(f)[0] !== 'active') return null;   // shot moves have no hitbox (sim/shots.js)
  const hb = f.move.hitbox;
  const x0 = f.facing > 0 ? f.x + hb.x : f.x - hb.x - hb.w;
  return { x0, x1: x0 + hb.w, z0: f.z + hb.z, z1: f.z + hb.z + hb.h, y: f.y, depth: f.move.depth ?? RULES.depthHit };
}

export function hurtboxOf(f) {
  const b = f.def.body;
  return { x0: f.x - b.w / 2, x1: f.x + b.w / 2, z0: f.z, z1: f.z + b.h, y: f.y };
}

export const vulnerable = (f) => f.invuln <= 0 && !HELPLESS.slice(1).includes(f.state);

export function resolveHits(world) {
  for (const a of world.fighters) {
    const hb = hitboxOf(a);
    if (!hb) continue;
    for (const t of world.fighters) {
      if (t.team === a.team || a.hitList.has(t.id) || !vulnerable(t)) continue;
      const hu = hurtboxOf(t);
      if (Math.abs(hb.y - hu.y) > hb.depth) continue;
      if (hb.x1 < hu.x0 || hb.x0 > hu.x1 || hb.z1 < hu.z0 || hb.z0 > hu.z1) continue;
      a.hitList.add(t.id);
      applyHit(a, t, a.move, world, {
        x: (Math.max(hb.x0, hu.x0) + Math.min(hb.x1, hu.x1)) / 2,
        z: (Math.max(hb.z0, hu.z0) + Math.min(hb.z1, hu.z1)) / 2,
      });
    }
  }
}

// A fighter with a `block` config, in the block state, facing the attacker (attacker in front or level).
const blocks = (a, t) => t.state === 'block' && t.def.block && Math.sign(a.x - t.x) !== -t.facing;

function applyBlock(a, t, m, at) {
  const B = t.def.block, dir = Math.sign(t.x - a.x) || a.facing;
  const dmg = Math.min(B.chip, t.hp - 1);   // chip never finishes the blocker
  if (dmg > 0) t.hp -= dmg;
  setState(t, 'block');
  t.stun = B.stun; t.vx = dir * B.pushback; t.vy = 0;
  a.vx = -dir * B.attackerPush; a.bounced = true;   // the attacker is shoved back (and its lunge stops)
  const x = t.x - dir * (t.def.body.w / 2 + 6);   // the shield face, on the attacker's side
  bus.emit('block', { attacker: a, target: t, move: m, damage: Math.max(0, dmg), x, y: t.y, z: at.z });
}

// Also used for a tossed weapon's hit (sim/props.js) and an arrow's (sim/shots.js: m = the shot). m.launch = {vx, vz} replaces RULES.knockdown's launch speed.
export function applyHit(a, t, m, world, at) {
  if (blocks(a, t)) return applyBlock(a, t, m, at);
  if (t.grab) releaseGrab(t);   // a hit on the holder drops the grab (T009)
  if (t.revive) stopRevive(t, 'hit');   // T022: a hit stops a friend's pick-up
  const base = m.damage + (a.def.stats.power ?? 0) - (t.def.stats.defense ?? 0);
  const dmg = Math.max(1, Math.round(a.dmgScale ? base * a.dmgScale : base));   // T022: an AI ally hits softer (ALLY.damage)
  t.hp = Math.max(0, t.hp - dmg);
  t.lastHit = world.frame;
  const targetPhase = phaseOf(t)[0];   // for the run log: was the target mid-windup?
  t.move = null;
  const dir = Math.sign(t.x - a.x) || a.facing;
  t.facing = -dir;
  const K = RULES.knockdown;
  if (m.knockdown || t.hp <= 0 || t.z > 0) {
    setState(t, 'knockdown');
    t.vz = m.launch?.vz ?? K.vz; t.vx = dir * (m.launch?.vx ?? K.vx); t.vy = 0; t.z = Math.max(t.z, 0.01);
  } else {
    setState(t, 'hurt');
    t.stun = m.hitstun; t.vx = dir * m.knockback;
  }
  if (a.move === m) wearWeapon(a, at, t);   // a held weapon wears on each move that lands
  bus.emit('hit', { attacker: a, target: t, move: m, damage: dmg, x: at.x, y: t.y, z: at.z, ko: t.hp <= 0, targetPhase });
}
