// Projectiles (T011): arrows. A move with a `shot` (data/moves/rat-bow.js) looses one on its first active frame; it flies
// straight along the shooter's facing in his lane (y) at shot.z, hits the first opposing fighter whose hurtbox it
// crosses within shot.depth of its lane, and is gone. A blocker facing it stops it (sim/combat.js block: chip, pushback).
// It drops (gone) after shot.range px or off the floor. w.shots; s.owner = the shooter (AI: one arrow in flight each).
import { bus } from '../core/events.js';
import { applyHit, vulnerable, hurtboxOf } from './combat.js';

let nextId = 1;

// Shooters whose shot move just reached its first active frame (stepMove has already counted it: mf = windup + 1).
export function fireShots(w) {
  for (const f of w.fighters) {
    const m = f.move;
    if (!m?.shot || f.mf !== m.windup + 1) continue;
    const S = m.shot;
    const s = { kind: 'shot', id: nextId++, def: S, owner: f, team: f.team, x: f.x + f.facing * S.x, y: f.y, z: S.z, vx: f.facing * S.speed, facing: f.facing, flown: 0, t: 0 };
    w.shots.push(s);
    bus.emit('shot', { f, shot: s });
  }
}

export const inFlight = (w, f) => w.shots.some((s) => s.owner === f);

export function stepShots(w) {
  const fl = w.stage.floor;
  for (const s of w.shots) {
    const S = s.def, x0 = s.x;
    s.x += s.vx; s.flown += Math.abs(s.vx); s.t++;
    const lo = Math.min(x0, s.x), hi = Math.max(x0, s.x);
    // nearest opposing fighter it crossed this frame
    let hit = null;
    for (const t of w.fighters) {
      if (t.team === s.team || !vulnerable(t) || Math.abs(t.y - s.y) > S.depth) continue;
      const hb = hurtboxOf(t);
      if (hb.x1 < lo || hb.x0 > hi || s.z < hb.z0 || s.z > hb.z1) continue;
      if (!hit || Math.abs(t.x - x0) < Math.abs(hit.x - x0)) hit = t;
    }
    if (hit) {
      // the arrow stands in for the shooter (so a block shoves the arrow, not an archer across the screen)
      const by = { id: s.owner.id, def: s.owner.def, team: s.team, x: hit.x - s.facing * 10, facing: s.facing, move: null, vx: 0, shot: s };
      applyHit(by, hit, S, w, { x: hit.x - s.facing * hit.def.body.w / 2, z: s.z });
      s.gone = true;
    } else if (s.flown > S.range || s.x < fl.left - 60 || s.x > fl.right + 60) s.gone = true;
  }
  w.shots = w.shots.filter((s) => !s.gone);
}
