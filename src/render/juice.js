// Screen shake and hit-stop (brief freeze on impact), driven by sim events.
import { bus } from '../core/events.js';
import { JUICE } from '../data/juice.js';

export function createJuice() {
  const j = { freeze: 0, shake: 0, ox: 0, oy: 0 };
  const kick = (amount) => { j.shake = Math.min(JUICE.shake.max, j.shake + amount); };
  bus.on('hit', ({ move, ko }) => {
    j.freeze = Math.max(j.freeze, (move.hitstop ?? 0) + (ko ? JUICE.koHitstop : 0));
    kick((move.shake ?? 0) + (move.fx?.shake ?? 0) + (ko ? JUICE.koShake : 0));   // fx.shake: a weapon's extra (T017, view only)
  });
  bus.on('block', ({ target }) => {
    const B = target.def.block;
    j.freeze = Math.max(j.freeze, B.hitstop ?? 0);
    kick(B.shake ?? 0);
  });
  bus.on('grab', ({ f }) => { j.freeze = Math.max(j.freeze, f.def.grab.hitstop ?? 0); kick(f.def.grab.shake ?? 0); });
  bus.on('thrownHit', ({ thrower, ko }) => {
    const T = thrower.def.throw;
    j.freeze = Math.max(j.freeze, (T.hitstop ?? 0) + (ko ? JUICE.koHitstop : 0));
    kick((T.shake ?? 0) + (ko ? JUICE.koShake : 0));
  });
  bus.on('land', ({ heavy }) => heavy && kick(JUICE.heavyLandShake));
  const P = JUICE.props, WB = JUICE.weaponBreak;   // T010
  bus.on('propHit', () => { j.freeze = Math.max(j.freeze, P.hitstop); kick(P.shake); });
  bus.on('propBreak', () => { j.freeze = Math.max(j.freeze, P.breakHitstop); kick(P.breakShake); });
  bus.on('weaponBreak', () => { j.freeze = Math.max(j.freeze, WB.hitstop); kick(WB.shake); });
  j.tick = () => {
    j.shake *= JUICE.shake.decay;
    if (j.shake < 0.2) j.shake = 0;
    j.ox = (Math.random() * 2 - 1) * j.shake;
    j.oy = (Math.random() * 2 - 1) * j.shake;
  };
  j.reset = () => { j.freeze = 0; j.shake = 0; };
  return j;
}
