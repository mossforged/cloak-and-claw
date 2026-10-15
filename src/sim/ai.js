// Enemy brains. Writes f.control just like the keyboard does for the player.
// "brawler": hovers at a distance; takes an attack token (RULES.maxAttackers) to step in and swing.
import { RULES } from '../data/rules.js';
import { HELPLESS } from './fighter.js';

const tokensInUse = (w) => w.fighters.filter((f) => f.ai?.token).length;

export function thinkAI(f, w) {
  const ai = f.ai, cfg = f.def.ai, c = f.control, p = w.player, fl = w.stage.floor;
  c.attack = false; c.jump = false; c.face = 0;

  if (HELPLESS.includes(f.state)) { ai.token = false; ai.attacked = false; return; }
  if (f.state === 'attack') { ai.attacked = true; return; }
  if (ai.attacked) { ai.attacked = false; ai.token = false; ai.cool = w.rng.int(...cfg.cooldown); }
  if (ai.cool > 0) ai.cool--;

  if (f.entering) {
    c.mx = f.x < fl.left + 30 ? 1 : f.x > fl.right - 30 ? -1 : 0; c.my = 0;
    if (!c.mx) f.entering = false;
    return;
  }
  if (p.state === 'dead') { c.mx = c.my = 0; return; }

  const side = Math.sign(f.x - p.x) || 1;
  if (--ai.wait <= 0) {
    ai.wait = w.rng.int(...cfg.think);
    ai.yOff = w.rng.range(-35, 35);
    if (!ai.token && ai.cool <= 0 && tokensInUse(w) < RULES.maxAttackers && w.rng.next() < cfg.aggression) ai.token = true;
  }

  let tx, ty;
  if (ai.token) { tx = p.x + side * cfg.range; ty = p.y; }
  else { tx = p.x + side * cfg.hover; ty = p.y + ai.yOff; }
  tx = Math.max(fl.left, Math.min(fl.right, tx));
  ty = Math.max(fl.top, Math.min(fl.bottom, ty));

  const dx = tx - f.x, dy = ty - f.y;
  c.mx = Math.abs(dx) > 5 ? Math.sign(dx) : 0;
  c.my = Math.abs(dy) > 3 ? Math.sign(dy) : 0;
  c.face = -side;
  const p0 = f.blockedBy;   // a prop in the way (sim/props.js): step round it on the side with room
  if (p0 && c.mx && Math.abs(dy) < p0.def.body.d) {
    const room = (s) => (s > 0 ? fl.bottom - p0.y : p0.y - fl.top) - p0.def.body.d / 2;
    const s = f.y >= p0.y ? 1 : -1;
    c.my = room(s) > 12 ? s : -s;
  }
  ai.mode = ai.token ? 'engage' : 'hover';

  if (ai.token && Math.abs(dx) < 14 && Math.abs(dy) < 6 && p.state !== 'down') {
    c.mx = c.my = 0; c.attack = true; f.facing = -side;
  }
}

// Keeps enemies from stacking on top of each other.
export function separate(w) {
  // a grabbed enemy is pinned (held in place: the other one steps aside); a thrown one flies through
  const es = w.fighters.filter((f) => f.ai && f.state !== 'dead' && f.state !== 'thrown');
  const pinned = (f) => (f.state === 'grabbed' ? 0 : 1);
  for (let i = 0; i < es.length; i++) for (let j = i + 1; j < es.length; j++) {
    const a = es[i], b = es[j], dx = b.x - a.x, dy = b.y - a.y;
    if (Math.abs(dx) < 34 && Math.abs(dy) < 14) {
      const px = (dx >= 0 ? 1 : -1) * 0.6, py = (dy >= 0 ? 1 : -1) * 0.4;
      const ka = pinned(a) * (2 - pinned(b)), kb = pinned(b) * (2 - pinned(a));   // both free: 1 each (as before)
      a.x -= px * ka; b.x += px * kb; a.y -= py * ka; b.y += py * kb;
    }
  }
}
