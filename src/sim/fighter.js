// Fighter entity + state machine. Pure logic: no drawing, no DOM.
// States: idle walk block jumpStart jump attack hurt knockdown down getup dead, plus grab/throw (sim/grab.js):
// grabbing throw (holder), grabbed thrown (held / flying body); toss, pickup (held weapons, sim/weapons.js);
// T022: downed, revive (sim/revive.js), potion potionToss drink (sim/potions.js).
// Every fighter is driven by f.control = { mx, my, attack, jump, block?, grab?, face? } (set by input or AI).
// block (held) only works for fighters whose def has a `block` config.
// Jump squat (T014 A/B test): with def.jumpSquatMode 'A' a jump first crouches in `jumpStart` for def.move.jumpSquat frames
// (the press is kept, so the jump always comes; an attack pressed meanwhile is the air attack at take-off). 'B' / 'off': no delay.
import { RULES } from '../data/rules.js';
import { bus } from '../core/events.js';
import { stepGrabbing, stepThrow, landThrown } from './grab.js';
import { movesOf, attackOf, airAttackOf, pressGrab, stepToss, stepPickup, settleWeapon } from './weapons.js';
import { canGoDown, goDown, stepDowned, stepRevive } from './revive.js';
import { startPotion, stepPotion } from './potions.js';

let nextId = 1;

export function createFighter(def, x, y, opts = {}) {
  return {
    id: nextId++, def, team: def.team,
    x, y, z: 0, vx: 0, vy: 0, vz: 0, facing: opts.facing ?? 1,
    hp: def.stats.maxHp, maxHp: def.stats.maxHp,
    state: 'idle', t: 0, stun: 0, invuln: 0, lastHit: -999,
    move: null, mf: 0, queued: false, squatAttack: false, hitList: new Set(), bounced: false,
    grab: null, heldBy: null, thrower: null,   // grab/throw (sim/grab.js)
    weapon: null, pickup: null, moveKey: null, // held weapon + pickup in progress (sim/weapons.js); key of the current move
    potion: null, revive: null, downT: 0,      // T022: carried potion's def; friend being picked up; downed frames left
    control: { mx: 0, my: 0, attack: false, jump: false },
    ai: opts.ai ? { mode: 'hover', wait: 0, cool: 30, token: false, yOff: 0, attacked: false, target: null, targetT: 0 } : null,
    entering: !!opts.entering, remove: false,
  };
}

export const ACTIVE_STATES = ['idle', 'walk'];
export const HELPLESS = ['hurt', 'knockdown', 'down', 'getup', 'dead', 'grabbed', 'thrown', 'downed'];   // all but 'hurt' can't be hit
const BOUNCY = ['thrown', 'knockdown', 'down'];   // bounce off the floor's side edges (RULES.wallBounce)
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
  f.move = movesOf(f)[key] ?? f.def.moves[key]; f.moveKey = key;   // a kit without the move (jumpSlash with a cutlass) = the fighter's own
  if (f.weapon) f.weapon.hit = false;
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
  if (m.next && f.queued && !f.weapon?.broken && f.mf >= m.windup + m.active) return startMove(f, m.next);
  if (f.mf >= m.windup + m.active + m.recovery) {
    f.move = null;
    if (f.state === 'attack') setState(f, 'idle');
  }
}

function takeOff(f, d) { f.vz = d.move.jump; f.z = 0.01; setState(f, 'jump'); bus.emit('jump', { f }); }

function land(f) {
  f.z = 0; f.vz = 0;
  if (f.state === 'jump') { f.move = null; setState(f, 'idle'); bus.emit('land', { f, heavy: false }); }
  else if (f.state === 'knockdown') { f.vx *= 0.4; setState(f, 'down'); bus.emit('land', { f, heavy: true }); }
  else if (f.state === 'thrown') landThrown(f);
}

export function updateFighter(f, world) {
  const c = f.control, d = f.def, sp = d.stats.speed ?? 1, K = RULES.knockdown;
  f.t++;
  if (f.invuln > 0) f.invuln--;

  switch (f.state) {
    case 'idle': case 'walk': {
      if (c.block && d.block) { setState(f, 'block'); f.stun = 0; f.vx = f.vy = 0; break; }
      if (c.attack && attackOf(f)) { startMove(f, attackOf(f)); break; }
      if (c.use && f.potion) { startPotion(f); break; }
      if (c.grab && pressGrab(f, world)) break;
      f.vx = c.mx * d.move.walk * sp;
      f.vy = c.my * d.move.depth * sp;
      if (c.jump && d.move.jump) {
        if (d.jumpSquatMode === 'A' && d.move.jumpSquat > 0) { setState(f, 'jumpStart'); f.squatAttack = false; f.vx = f.vy = 0; }
        else takeOff(f, d);
        break;
      }
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
    case 'jumpStart':   // jump squat (mode A): crouched in place, then take off moving the way the stick points
      if (c.attack) f.squatAttack = true;
      if (f.t >= d.move.jumpSquat) {
        f.vx = c.mx * d.move.walk * sp; f.vy = c.my * d.move.depth * sp;
        takeOff(f, d);
        if (f.squatAttack && airAttackOf(f)) startMove(f, airAttackOf(f));
      }
      break;
    case 'jump':
      if (c.attack && !f.move && airAttackOf(f)) startMove(f, airAttackOf(f));
      if (f.move) stepMove(f);
      f.vz -= RULES.gravity;
      break;
    case 'attack': stepMove(f); f.vx *= 0.75; f.vy = 0; break;
    case 'hurt':
      f.vx *= RULES.hurtFriction; f.vy = 0;
      if (f.t >= f.stun) setState(f, 'idle');
      break;
    case 'knockdown': case 'thrown': f.vz -= RULES.gravity; break;
    case 'grabbing': stepGrabbing(f, world); break;
    case 'throw': stepThrow(f, world); break;
    case 'toss': stepToss(f, world); break;
    case 'pickup': stepPickup(f, world); break;
    case 'revive': stepRevive(f, world); break;
    case 'downed': stepDowned(f, world); break;
    case 'potion': case 'potionToss': case 'drink': stepPotion(f, world); break;
    case 'grabbed':   // positioned by the holder; freed if the holder let go without saying so
      f.vx = f.vy = 0;
      if (f.heldBy?.grab?.target !== f) { f.heldBy = null; f.z = 0; setState(f, 'idle'); }
      break;
    case 'down':
      f.vx *= 0.8;
      if (f.t >= K.downFrames) {
        if (f.hp <= 0 && canGoDown(f, world)) goDown(f);
        else if (f.hp <= 0) { setState(f, 'dead'); bus.emit('defeated', { f }); }
        else { setState(f, 'getup'); f.invuln = K.getupFrames + K.invulnAfter; }
      }
      break;
    case 'getup': if (f.t >= K.getupFrames) setState(f, 'idle'); break;
    case 'dead': if (f.team !== 'hero' && f.t >= RULES.deadLinger) f.remove = true; break;
  }

  settleWeapon(f, world);

  // physics
  f.x += f.vx; f.y += f.vy;
  if (f.z > 0 || f.vz > 0) { f.z += f.vz; if (f.z <= 0) land(f); }
  const fl = world.bounds;
  if (!f.entering) {
    const x = Math.max(fl.left, Math.min(fl.right, f.x));
    if (RULES.wallBounce && x !== f.x && BOUNCY.includes(f.state) && Math.sign(f.vx) === Math.sign(f.x - x)) f.vx = -f.vx * RULES.wallBounce;
    f.x = x;
  }
  f.y = Math.max(fl.top, Math.min(fl.bottom, f.y));
}
