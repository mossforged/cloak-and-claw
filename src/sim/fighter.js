// Fighter entity + state machine. Pure logic: no drawing, no DOM.
// States: idle walk block jump attack hurt knockdown down getup dead
// Every fighter is driven by f.control = { mx, my, attack, jump, block?, face? } (set by input or AI).
// block (held) only works for fighters whose def has a `block` config.
import { RULES } from '../data/rules.js';
import { bus } from '../core/events.js';

let nextId = 1;

export function createFighter(def, x, y, opts = {}) {
  return {
    id: nextId++, def, team: def.team,
    x, y, z: 0, vx: 0, vy: 0, vz: 0, facing: opts.facing ?? 1,
    hp: def.stats.maxHp, maxHp: def.stats.maxHp,
    state: 'idle', t: 0, stun: 0, invuln: 0, lastHit: -999,
    move: null, mf: 0, queued: false, hitList: new Set(), bounced: false,
    control: { mx: 0, my: 0, attack: false, jump: false },
    ai: opts.ai ? { mode: 'hover', wait: 0, cool: 30, token: false, yOff: 0, attacked: false } : null,
    entering: !!opts.entering, remove: false,
  };
}

export const ACTIVE_STATES = ['idle', 'walk'];
export const HELPLESS = ['hurt', 'knockdown', 'down', 'getup', 'dead'];
export const canAct = (f) => ACTIVE_STATES.includes(f.state);

export function setState(f, s) { f.state = s; f.t = 0; }

// Which phase a move is in, and 0..1 progress through it.
export function phaseOf(f) {
  const m = f.move, k = f.mf;
  if (!m) return ['none', 0];
  if (k < m.windup) return ['windup', k / m.windup];
  if (k < m.windup + m.active) return ['active', (k - m.windup) / m.active];
  return ['recovery', Math.min(1, (k - m.windup - m.active) / m.recovery)];
}

export function startMove(f, key) {
  f.move = f.def.moves[key];
  f.mf = 0; f.queued = false; f.bounced = false; f.hitList.clear();
  if (f.control.mx) f.facing = Math.sign(f.control.mx);
  if (!f.move.air) setState(f, 'attack');
}

function stepMove(f) {
  const m = f.move;
  if (f.mf === m.windup) bus.emit('swing', { f, move: m });
  if (m.lunge && !m.air && !f.bounced && f.mf >= m.windup - 2 && f.mf < m.windup + m.active) f.vx = f.facing * m.lunge;
  if (f.control.attack && m.next && f.mf >= m.comboFrom) f.queued = true;
  f.mf++;
  if (m.next && f.queued && f.mf >= m.windup + m.active) return startMove(f, m.next);
  if (f.mf >= m.windup + m.active + m.recovery) {
    f.move = null;
    if (f.state === 'attack') setState(f, 'idle');
  }
}

function land(f) {
  f.z = 0; f.vz = 0;
  if (f.state === 'jump') { f.move = null; setState(f, 'idle'); bus.emit('land', { f, heavy: false }); }
  else if (f.state === 'knockdown') { f.vx *= 0.4; setState(f, 'down'); bus.emit('land', { f, heavy: true }); }
}

export function updateFighter(f, world) {
  const c = f.control, d = f.def, sp = d.stats.speed ?? 1, K = RULES.knockdown;
  f.t++;
  if (f.invuln > 0) f.invuln--;

  switch (f.state) {
    case 'idle': case 'walk': {
      if (c.block && d.block) { setState(f, 'block'); f.stun = 0; f.vx = f.vy = 0; break; }
      if (c.attack && d.attack) { startMove(f, d.attack); break; }
      f.vx = c.mx * d.move.walk * sp;
      f.vy = c.my * d.move.depth * sp;
      if (c.jump && d.move.jump) { f.vz = d.move.jump; f.z = 0.01; setState(f, 'jump'); bus.emit('jump', { f }); break; }
      if (c.mx) f.facing = Math.sign(c.mx);
      if (c.face) f.facing = c.face;
      const moving = c.mx || c.my;
      if (moving && f.state !== 'walk') setState(f, 'walk');
      if (!moving && f.state !== 'idle') setState(f, 'idle');
      break;
    }
    case 'block': {   // shield up: facing locked, no attacks; f.stun = frames of blockstun after a blocked hit
      const B = d.block;
      if (f.t < f.stun) { f.vx *= RULES.hurtFriction; f.vy = 0; break; }
      if (!c.block) { setState(f, 'idle'); f.vx = f.vy = 0; break; }
      f.vx = c.mx * B.walkSpeed * sp;
      f.vy = c.my * B.walkSpeed * sp;
      break;
    }
    case 'jump':
      if (c.attack && !f.move && d.airAttack) startMove(f, d.airAttack);
      if (f.move) stepMove(f);
      f.vz -= RULES.gravity;
      break;
    case 'attack': stepMove(f); f.vx *= 0.75; f.vy = 0; break;
    case 'hurt':
      f.vx *= RULES.hurtFriction; f.vy = 0;
      if (f.t >= f.stun) setState(f, 'idle');
      break;
    case 'knockdown': f.vz -= RULES.gravity; break;
    case 'down':
      f.vx *= 0.8;
      if (f.t >= K.downFrames) {
        if (f.hp <= 0) { setState(f, 'dead'); bus.emit('defeated', { f }); }
        else { setState(f, 'getup'); f.invuln = K.getupFrames + K.invulnAfter; }
      }
      break;
    case 'getup': if (f.t >= K.getupFrames) setState(f, 'idle'); break;
    case 'dead': if (f.team !== 'hero' && f.t >= RULES.deadLinger) f.remove = true; break;
  }

  // physics
  f.x += f.vx; f.y += f.vy;
  if (f.z > 0 || f.vz > 0) { f.z += f.vz; if (f.z <= 0) land(f); }
  const fl = world.stage.floor;
  if (!f.entering) f.x = Math.max(fl.left, Math.min(fl.right, f.x));
  f.y = Math.max(fl.top, Math.min(fl.bottom, f.y));
}
