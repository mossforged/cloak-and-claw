// Hit detection and damage. Boxes are in world space: x (left-right), z (height), plus a depth (y) tolerance.
import { RULES } from '../data/rules.js';
import { bus } from '../core/events.js';
import { phaseOf, setState, HELPLESS } from './fighter.js';

export function hitboxOf(f) {
  if (!f.move || phaseOf(f)[0] !== 'active') return null;
  const hb = f.move.hitbox;
  const x0 = f.facing > 0 ? f.x + hb.x : f.x - hb.x - hb.w;
  return { x0, x1: x0 + hb.w, z0: f.z + hb.z, z1: f.z + hb.z + hb.h, y: f.y, depth: f.move.depth ?? RULES.depthHit };
}

export function hurtboxOf(f) {
  const b = f.def.body;
  return { x0: f.x - b.w / 2, x1: f.x + b.w / 2, z0: f.z, z1: f.z + b.h, y: f.y };
}

const vulnerable = (f) => f.invuln <= 0 && !HELPLESS.slice(1).includes(f.state);

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

function applyHit(a, t, m, world, at) {
  const dmg = Math.max(1, Math.round(m.damage + (a.def.stats.power ?? 0) - (t.def.stats.defense ?? 0)));
  t.hp = Math.max(0, t.hp - dmg);
  t.lastHit = world.frame;
  const targetPhase = phaseOf(t)[0];   // for the run log: was the target mid-windup?
  t.move = null;
  const dir = Math.sign(t.x - a.x) || a.facing;
  t.facing = -dir;
  const K = RULES.knockdown;
  if (m.knockdown || t.hp <= 0 || t.z > 0) {
    setState(t, 'knockdown');
    t.vz = K.vz; t.vx = dir * K.vx; t.vy = 0; t.z = Math.max(t.z, 0.01);
  } else {
    setState(t, 'hurt');
    t.stun = m.hitstun; t.vx = dir * m.knockback;
  }
  bus.emit('hit', { attacker: a, target: t, move: m, damage: dmg, x: at.x, y: t.y, z: at.z, ko: t.hp <= 0, targetPhase });
}
