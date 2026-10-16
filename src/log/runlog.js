// Run log: counts what happened in one run by listening to bus events. Reads world, never writes it. Runs in Node.
// T021: counted per hero (player slot); the summary keeps slot 0's numbers in the old fields and adds `heroes`
// (one entry per slot: slot, id and the same counts).
import { bus } from '../core/events.js';

const FPS = 60;

function moveKey(f, move) {
  if (f.move === move && f.moveKey) return f.moveKey;   // weapon kit moves too (T010)
  return Object.keys(f.def.moves).find((k) => f.def.moves[k] === move) ?? 'unknown';
}

const fresh = () => ({ hitsLanded: 0, damageDealt: 0, damageTaken: 0, swings: {}, swingsThatHit: 0, knockdowns: 0, windupsInterrupted: 0, blocks: 0, grabs: 0, throws: 0, thrownHits: 0,
  breaks: 0, foodEaten: 0, healed: 0, weaponPickups: 0, weaponThrows: 0, weaponBreaks: 0, swing: null });

function countsOf(c) {
  const swings = Object.values(c.swings).reduce((a, b) => a + b, 0);
  return {
    damageDealt: c.damageDealt, damageTaken: c.damageTaken, hitsLanded: c.hitsLanded,
    swings, swingsByMove: { ...c.swings }, whiffs: swings - c.swingsThatHit,
    knockdowns: c.knockdowns, windupsInterrupted: c.windupsInterrupted, blocks: c.blocks,
    grabs: c.grabs, throws: c.throws, thrownHits: c.thrownHits,
    breaks: c.breaks, foodEaten: c.foodEaten, healed: c.healed, weaponPickups: c.weaponPickups, weaponThrows: c.weaponThrows, weaponBreaks: c.weaponBreaks,
  };
}

// One logger per page/test. Listeners are registered once; begin(world) starts a fresh run.
export function createRunLog() {
  let world = null, per = [];
  const of = (f) => (world && f?.slot != null && world.heroes[f.slot] === f ? per[f.slot] : null);   // that hero's counts

  bus.on('swing', ({ f, move }) => {
    const c = of(f); if (!c) return;
    const k = moveKey(f, move);
    c.swings[k] = (c.swings[k] ?? 0) + 1;
    c.swing = { hit: false };
  });
  bus.on('hit', ({ attacker, target, damage, targetPhase }) => {
    const a = of(attacker), t = of(target);
    if (a) {
      a.hitsLanded++;
      a.damageDealt += damage;
      if (targetPhase === 'windup') a.windupsInterrupted++;
      if (a.swing && !a.swing.hit) { a.swing.hit = true; a.swingsThatHit++; }
    } else if (t) {
      t.damageTaken += damage;
      if (target.state === 'knockdown') t.knockdowns++;
    }
  });

  bus.on('block', ({ target, damage }) => {
    const c = of(target); if (!c) return;
    c.blocks++;
    c.damageTaken += damage;
  });

  // grab/throw (T009): knees and the thrown body's landing arrive as hero `hit` events; bowling as `thrownHit`
  bus.on('grab', ({ f }) => { const c = of(f); if (c) { c.grabs++; c.swing = null; } });
  bus.on('throw', ({ f }) => { const c = of(f); if (c) c.throws++; });
  bus.on('thrownHit', ({ thrower, damage }) => {
    const c = of(thrower); if (!c) return;
    c.thrownHits++;
    c.damageDealt += damage;
  });

  // floor weapons, props, food (T010)
  bus.on('propBreak', ({ by }) => { const c = of(by); if (c) c.breaks++; });
  bus.on('eat', ({ f, heal }) => { const c = of(f); if (c) { c.foodEaten++; c.healed += heal; } });
  bus.on('pickup', ({ f }) => { const c = of(f); if (c) c.weaponPickups++; });
  bus.on('weaponThrow', ({ f }) => { const c = of(f); if (c) c.weaponThrows++; });
  bus.on('weaponBreak', ({ f }) => { const c = of(f); if (c) c.weaponBreaks++; });

  return {
    begin(w) { world = w; per = w.heroes.map(fresh); },
    summary() {
      return {
        at: null,   // set by the store when saved (wall-clock time stays out of the sim)
        frames: world.frame, seconds: +(world.frame / FPS).toFixed(1),
        wave: world.wave, kos: world.kos, xp: world.xp,
        ...countsOf(per[0]),
        heroes: world.heroes.map((h, i) => ({ slot: i, id: h.def.id, ...countsOf(per[i]) })),
      };
    },
  };
}

// The lines shown under "Defeated!" (slot 0's numbers).
export function summaryLines(s) {
  const m = Math.floor(s.seconds / 60), sec = String(Math.floor(s.seconds % 60)).padStart(2, '0');
  return [
    `${m}:${sec}  wave ${s.wave}  KOs ${s.kos}  XP ${s.xp}  dealt ${s.damageDealt}  taken ${s.damageTaken}`,
    `hits ${s.hitsLanded}/${s.swings} swings  whiffs ${s.whiffs}  knocked down ${s.knockdowns}  windups cut ${s.windupsInterrupted}  blocks ${s.blocks ?? 0}  throws ${s.throws ?? 0} (${s.thrownHits ?? 0} bowled)`,
    `crates broken ${s.breaks ?? 0}  food eaten ${s.foodEaten ?? 0} (+${s.healed ?? 0} hp)  weapons picked up ${s.weaponPickups ?? 0}  thrown ${s.weaponThrows ?? 0}  broken ${s.weaponBreaks ?? 0}`,
  ];
}
