// Model viewer (T027): the animation buttons for a model, built from its fighter def, rig poses and held item's kit (not
// a hand-kept list). Each clip drives the real sim in the slot's sandbox (sandbox.js): `input(sb, k)` = the model's
// controls on sim frame k, `act(sb, k)` = direct sim calls before the step (start a move, a hit landing on him),
// `partnerInput` = the partner's controls. Ends when `done(sb)` (plus `tail` frames) or after `frames`. Pure.
import { FIGHTERS } from '../data/fighters/index.js';
import { ITEMS } from '../data/items/index.js';
import { RIGS } from '../data/rigs/index.js';
import { startMove, setState } from '../sim/fighter.js';
import { attackOf } from '../sim/weapons.js';
import { applyHit } from '../sim/combat.js';
import { spawnItem } from '../sim/props.js';
import { goDown } from '../sim/revive.js';
import { partnerOf } from './models.js';

const settled = (f) => f.state === 'idle' && !f.move && f.z === 0;
const calm = (p) => !p || ['idle', 'walk', 'dead'].includes(p.state);
const done = (sb) => settled(sb.hero) && calm(sb.partner) && !sb.w.shots.length && !sb.w.items.some((i) => i.state !== 'floor');
const fwd = (sb) => ({ mx: sb.dir });
// Rig poses the states and moves already play (the rest are shown as held poses).
const STATE_POSES = new Set(['timing', 'kits', 'moves', 'walk', 'idle']);

// The partner swings at the model so the hit lands on frame `at` (its move started windup frames before), with `extra`
// on the move (knockdown). The partner's own hitbox is told it already hit, so it lands once, exactly then.
function swingAt(sb, k, at, extra = {}) {
  const p = sb.partner, key = attackOf(p), m = p.def.moves[key];
  at = Math.max(at, m.windup + 2);
  if (k === at - m.windup) { startMove(p, key); p.hitList.add(sb.hero.id); }
  if (k === at) applyHit(p, sb.hero, { ...m, ...extra }, sb.w, { x: sb.hero.x - sb.dir * 10, z: sb.hero.def.body.h * 0.6 });
}

function moveClip(key, m, own) {
  const hb = m.hitbox;
  return {
    key, label: m.label ?? key, group: 'Attacks', kind: 'attack', done, tail: 20,
    item: m.item, strap: m.strap,   // T029 r2: a rehearsal move's own items (sandbox.js puts them on him with the own item)
    gap: () => (hb ? hb.x + hb.w * 0.6 : 260),   // target on: where the swing lands (an arrow: down the lane)
    input: (sb, k) => (m.air && own.jump && k === 0 ? { jump: true } : {}),
    act: (sb, k) => {
      const h = sb.hero;
      if (!m.air && k === 0) startMove(h, key);
      if (m.air && h.state === 'jump' && !h.move && h.vz < own.jump * 0.6 && !sb.started) { startMove(h, key); sb.started = true; }
      if (m.air && !own.jump && k === 0) { startMove(h, key); setState(h, 'jump'); h.vz = 6; h.z = 0.01; }   // a body that can't jump: dropped from a hop
    },
  };
}

export function clipsFor(id, item = 'own') {
  const def = FIGHTERS[id], rig = RIGS[def.art.rig], P = rig.poses, kit = ITEMS[item];
  const moves = kit?.moves ?? def.moves, all = { ...moves };
  if (def.airAttack && !all[def.airAttack]) all[def.airAttack] = def.moves[def.airAttack];   // a kit without one keeps his own
  const cyc = Math.round((60 / (P.walk?.speed ?? 1)) * 2), L = [];
  const add = (c) => L.push(c);

  add({ key: 'idle', label: 'idle', group: 'Moves', frames: 240 });
  add({ key: 'walk', label: 'walk (in place)', group: 'Moves', frames: cyc, input: fwd, after: (sb) => { sb.hero.x = sb.x0; } });
  const across = Math.min(cyc * 2, Math.round(620 / def.move.walk));
  add({ key: 'walkAcross', label: 'walk across', group: 'Moves', follow: true, startX: (d) => (d > 0 ? 170 : 790),
    input: (sb, k) => (k < across ? fwd(sb) : {}), done: (sb) => sb.k > across && settled(sb.hero), tail: 30 });
  // T028: the turn-around through the front view (a rig with an F torso): a short step back, then forward again
  if (rig.bodyViews?.torso?.F) add({ key: 'turn', label: 'turn around (x2)', group: 'Moves', frames: 130,
    input: (sb, k) => (k >= 20 && k < 26 ? { mx: -sb.dir } : k >= 80 && k < 86 ? { mx: sb.dir } : {}) });
  if (def.move.jump) add({ key: 'jump', label: 'jump', group: 'Moves', input: (sb, k) => ({ jump: k === 4 }), done: (sb) => sb.k > 8 && settled(sb.hero), tail: 30 });
  if (def.block) {
    add({ key: 'block', label: 'block', group: 'Moves', frames: 120, input: (sb, k) => ({ block: k >= 4 && k < 100 }) });
    add({ key: 'blockHit', label: 'block + hit', group: 'Moves', partner: (f) => partnerOf(f), input: (sb, k) => ({ block: k >= 2 && k < 80 }),
      act: (sb, k) => swingAt(sb, k, 36), done: (sb) => sb.k > 80 && done(sb), gap: () => 62 });
  }
  for (const [key, m] of Object.entries(all)) add(moveClip(key, m, def.move));
  // T029: the rehearsal moves his body is posed for (def.rehearsal with a rig move pose; own item only: they're his body's)
  if (!kit) for (const [key, m] of Object.entries(def.rehearsal ?? {})) if (P.moves?.[key] && !all[key]) add({ ...moveClip(key, m, def.move), group: 'Rehearsal' });
  const first = attackOf({ def, weapon: kit?.moves ? { def: kit } : null });
  if (moves[first]?.next) add({ key: 'combo', label: 'combo', group: 'Attacks', kind: 'attack', done, tail: 20, gap: () => 60,
    input: (sb, k) => ({ attack: k < 40 && k % 3 === 0 }) });

  add({ key: 'hurt', label: 'hurt', group: 'Hits', partner: (f) => partnerOf(f), act: (sb, k) => swingAt(sb, k, 30), done: (sb) => sb.k > 31 && done(sb), gap: () => 62 });
  add({ key: 'knockdown', label: 'knockdown, get up', group: 'Hits', partner: (f) => partnerOf(f), act: (sb, k) => swingAt(sb, k, 30, { knockdown: true }),
    done: (sb) => sb.k > 31 && done(sb), gap: () => 62, max: 400 });

  const rat = partnerOf(id, true);
  if (def.grab && rat) {
    const grab = (extra) => ({ group: 'Grab', partner: () => rat, gap: () => def.grab.range * 0.6, done: (sb) => sb.k > 20 && done(sb), max: 500, tail: 20, ...extra });
    const K = def.grab.knee, knees = (k) => [12, 12 + K.windup + K.active + K.recovery + 2, 12 + 2 * (K.windup + K.active + K.recovery + 2)].includes(k);
    add(grab({ key: 'grabKnee', label: 'grab + knee x3', input: (sb, k) => ({ grab: k === 2, attack: knees(k) }) }));
    add(grab({ key: 'throw', label: 'throw', input: (sb, k) => ({ grab: k === 2, ...(k === 24 && { attack: true, mx: sb.dir }) }) }));
    add(grab({ key: 'throwBack', label: 'back throw', input: (sb, k) => ({ grab: k === 2, ...(k === 24 && { attack: true, mx: -sb.dir }) }) }));
  }
  const holder = Object.values(FIGHTERS).find((d) => d.grab && d.team !== def.team && d.art?.rig);
  if (def.throwable && holder) {
    const held = (extra) => ({ group: 'Grabbed', partner: () => holder.id, gap: () => holder.grab.range * 0.6, done: (sb) => sb.k > 20 && done(sb), max: 500, tail: 20, ...extra });
    add(held({ key: 'grabbed', label: 'grabbed + kneed', partnerInput: (sb, k) => ({ grab: k === 2, attack: [12, 34, 56].includes(k) }) }));
    add(held({ key: 'thrown', label: 'thrown', partnerInput: (sb, k) => ({ grab: k === 2, ...(k === 24 && { attack: true, mx: sb.partner.facing }) }) }));
  }

  if (def.pickup) {
    const floor = kit?.kind === 'weapon' ? kit.id : 'plank-club';
    add({ key: 'pickup', label: `pick up (${ITEMS[floor].name})`, group: 'Items', done: (sb) => sb.k > 12 && done(sb), tail: 20,
      setup: (sb) => { sb.hero.weapon = null; const it = spawnItem(sb.w, floor, sb.x0 + sb.dir * 8, sb.hero.y, 0, { vx: 0, vz: 0 }); it.state = 'floor'; },
      input: (sb, k) => ({ grab: k === 8 }) });
  }
  if (def.toss) {
    const w = kit?.kind === 'weapon' ? kit : ITEMS['plank-club'];
    add({ key: 'toss', label: `toss (${w.name}) + draw`, group: 'Items', setup: (sb) => { sb.hero.weapon = { def: w, uses: 999, hit: false, broken: false }; },
      input: (sb, k) => ({ grab: k === 8 }), done: (sb) => sb.k > 10 && done(sb), tail: Math.round((P.timing.drawSword ?? 0.4) * 60) + 20, max: 400 });
  }
  if (def.team === 'hero') {
    const pot = (s) => { s.hero.potion = ITEMS['health-potion']; s.hero.hp = Math.round(s.hero.maxHp / 2); };
    add({ key: 'drink', label: 'drink potion', group: 'Items', setup: pot, input: (sb, k) => ({ use: k >= 6 && k < 70 }), done: (sb) => sb.k > 8 && done(sb) });
    add({ key: 'potionToss', label: 'toss potion', group: 'Items', setup: pot, input: (sb, k) => ({ use: k === 6 }), done: (sb) => sb.k > 8 && done(sb), max: 300 });
    add({ key: 'downed', label: 'downed', group: 'Helping', heroes: 2, partner: () => id, gap: () => 900, frames: 150, act: (sb, k) => k === 4 && goDown(sb.hero) });
    add({ key: 'revive', label: 'revive a friend', group: 'Helping', heroes: 2, partner: () => id, gap: () => 44, max: 400,
      setup: (sb) => { goDown(sb.partner); sb.partner.facing = sb.dir; }, input: (sb, k) => ({ grab: k === 6, grabHeld: k >= 6 }),
      done: (sb) => sb.k > 10 && settled(sb.hero) && sb.partner.state === 'idle', tail: 20 });
  }
  if (P.cast) add({ key: 'cast', label: 'cast', group: 'Moves', viewPose: { name: 'cast', at: 6 }, frames: Math.round((P.timing.castHold ?? 1) * 60) + 40 });
  for (const name of Object.keys(P)) if (!STATE_POSES.has(name) && typeof P[name] === 'object') add({ key: `pose:${name}`, label: name, group: 'Poses', hold: name, frames: 90 });
  return L;
}
export const GROUPS = ['Moves', 'Attacks', 'Rehearsal', 'Hits', 'Grab', 'Grabbed', 'Items', 'Helping', 'Poses'];
