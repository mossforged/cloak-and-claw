// Run log: counts what happened in one run by listening to bus events. Reads world, never writes it. Runs in Node.
import { bus } from '../core/events.js';

const FPS = 60;

function moveKey(f, move) {
  return Object.keys(f.def.moves).find((k) => f.def.moves[k] === move) ?? 'unknown';
}

// One logger per page/test. Listeners are registered once; begin(world) starts a fresh run.
export function createRunLog() {
  let world = null, c = null, swing = null;

  bus.on('swing', ({ f, move }) => {
    if (!world || f !== world.player) return;
    const k = moveKey(f, move);
    c.swings[k] = (c.swings[k] ?? 0) + 1;
    swing = { hit: false };
  });
  bus.on('hit', ({ attacker, target, damage, targetPhase }) => {
    if (!world) return;
    const p = world.player;
    if (attacker === p) {
      c.hitsLanded++;
      c.damageDealt += damage;
      if (targetPhase === 'windup') c.windupsInterrupted++;
      if (swing && !swing.hit) { swing.hit = true; c.swingsThatHit++; }
    } else if (target === p) {
      c.damageTaken += damage;
      if (p.state === 'knockdown') c.knockdowns++;
    }
  });

  return {
    begin(w) {
      world = w; swing = null;
      c = { hitsLanded: 0, damageDealt: 0, damageTaken: 0, swings: {}, swingsThatHit: 0, knockdowns: 0, windupsInterrupted: 0 };
    },
    summary() {
      const swings = Object.values(c.swings).reduce((a, b) => a + b, 0);
      return {
        at: null,   // set by the store when saved (wall-clock time stays out of the sim)
        frames: world.frame, seconds: +(world.frame / FPS).toFixed(1),
        wave: world.wave, kos: world.kos, xp: world.xp,
        damageDealt: c.damageDealt, damageTaken: c.damageTaken, hitsLanded: c.hitsLanded,
        swings, swingsByMove: { ...c.swings }, whiffs: swings - c.swingsThatHit,
        knockdowns: c.knockdowns, windupsInterrupted: c.windupsInterrupted,
      };
    },
  };
}

// The two lines shown under "Defeated!".
export function summaryLines(s) {
  const m = Math.floor(s.seconds / 60), sec = String(Math.floor(s.seconds % 60)).padStart(2, '0');
  return [
    `${m}:${sec}  wave ${s.wave}  KOs ${s.kos}  XP ${s.xp}  dealt ${s.damageDealt}  taken ${s.damageTaken}`,
    `hits ${s.hitsLanded}/${s.swings} swings  whiffs ${s.whiffs}  knocked down ${s.knockdowns}  windups cut ${s.windupsInterrupted}`,
  ];
}
