// Weapon feel (T017, render only): each floor weapon looks like itself (club heavy, fish silly, cutlass quick) without
// changing how it plays. Sim numbers of every kit are as on main; the bot plays the same with or without the view fields;
// kit pose variants are picked (and fall back to the borrowed sword pose); the fish wobble settles; the club shakes more.
import { createWorld, stepWorld } from '../src/sim/world.js';
import { STAGES } from '../src/data/stages/index.js';
import { ITEMS } from '../src/data/items/index.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { targetPose, channelsOf } from '../src/render/rig-pose.js';
import { feelLayer, stepWobble, squashCurve } from '../src/render/weapon-feel.js';
import { createJuice } from '../src/render/juice.js';
import { bus } from '../src/core/events.js';
import { botControl } from './bot.mjs';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const def = FIGHTERS['mouse-fighter'], rig = RIGS[def.art.rig], KP = rig.poses.kits;
const bare = (o = {}) => ({ def, state: 'idle', t: 0, mf: 0, move: null, ...o });
const holding = (id, o = {}) => bare({ weapon: { def: ITEMS[id], uses: 5 }, ...o });
const sword = (key, mf) => bare({ state: 'attack', move: def.moves[key], moveKey: key, mf });
const inMove = (id, key, mf) => holding(id, { state: 'attack', move: ITEMS[id].moves[key], moveKey: key, mf });

// 1. Sim numbers of each kit as on main (T016 merge): damage, frames, hitboxes, knockback, launch, hitstop, lunge, durability, toss
const MAIN = {
  'plank-club': { durability: 10, toss: 14, club1: [10, 10, 5, 16, '8,25,92,80', 6], club2: [14, 13, 5, 22, '5,15,100,95', 6] },
  'big-fish': { durability: 8, toss: 12, fishSlap: [8, 10, 6, 20, '-20,15,140,85', 8] },
  'rat-cutlass': { durability: 14, toss: 10, cut1: [7, 3, 4, 9, '10,30,84,70', 2.5], cut2: [7, 3, 4, 10, '10,20,86,70', 2.5], cut3: [11, 6, 4, 16, '5,15,98,90', 4] },
};
for (const [id, want] of Object.entries(MAIN)) {
  const K = ITEMS[id];
  check(K.durability === want.durability && K.toss.damage === want.toss, `${id}: durability and toss damage as on main`);
  for (const [mk, [dmg, wu, ac, rc, hb, kb]] of Object.entries(want).filter(([k]) => K.moves[k])) {
    const m = K.moves[mk], h = m.hitbox;
    check(m.damage === dmg && m.windup === wu && m.active === ac && m.recovery === rc && `${h.x},${h.z},${h.w},${h.h}` === hb && m.knockback === kb,
      `${id}.${mk}: damage, frames, hitbox and knockback as on main`);
  }
}

// 2. Bot runs (plain bot, and the weapon bot that picks up every floor weapon), with and without props: the same fight
// whether or not the kits carry their view fields (fx dust/shake/drops, feel). The sim never reads them.
function trace(seed, props, weaponBot) {
  const saved = STAGES['harbor-market'].props; if (!props) STAGES['harbor-market'].props = [];
  const w = createWorld('harbor-market', 'mouse-fighter', seed), out = [];
  for (let i = 0; i < 60 * 90 && !w.over; i++) {
    const c = { grab: false, ...botControl(w) }, p = w.player;
    if (weaponBot) {
      const it = w.items.find((x) => x.state === 'floor'), prop = w.props[0];
      if (it && !p.weapon && i % 2 === 0) { c.mx = Math.sign(it.x - p.x); c.my = Math.sign(it.y - p.y); if (Math.abs(it.x - p.x) < 20 && Math.abs(it.y - p.y) < 8) c.grab = true; }
      else if (prop && !w.fighters.some((f) => f.team === 'enemy' && !f.entering)) { c.mx = Math.sign(prop.x - 50 - p.x); c.my = Math.sign(prop.y - p.y); c.attack = Math.abs(prop.x - 50 - p.x) < 6 && i % 8 === 0; }
      if (p.weapon?.uses === 1 && i % 30 === 0) c.grab = true;
    }
    stepWorld(w, c);
    if (i % 30 === 0) out.push(w.fighters.map((f) => `${f.x.toFixed(2)},${f.y.toFixed(2)},${f.hp},${f.state}`).join(';'), p.weapon?.def.id ?? '-');
  }
  STAGES['harbor-market'].props = saved;
  return `${out.join('|')} frames=${w.frame} kos=${w.kos} hp=${w.player.hp}`;
}
const VIEW = ['plank-club', 'big-fish', 'rat-cutlass'].map((id) => ITEMS[id]);
function stripped(fn) {   // runs fn with every kit's view-only fields removed, then puts them back
  const saved = VIEW.map((K) => [K, K.feel, Object.entries(K.moves).map(([k, m]) => [m, m.fx])]);
  for (const K of VIEW) { delete K.feel; for (const m of Object.values(K.moves)) { const { dust, shake, drops, ...fx } = m.fx ?? {}; m.fx = fx; } }
  try { return fn(); } finally { for (const [K, feel, ms] of saved) { if (feel) K.feel = feel; for (const [m, fx] of ms) m.fx = fx; } }
}
for (const [props, weaponBot] of [[true, true], [false, false]]) {
  const a = trace(2, props, weaponBot), b = stripped(() => trace(2, props, weaponBot));
  check(a === b, `bot (props ${props}, weapon bot ${weaponBot}): same fight with and without the view fields`);
  if (weaponBot) check(/plank-club|big-fish|rat-cutlass/.test(a), 'the weapon bot really held floor weapons');
}

// 3. Kit pose variants: the club's own windup (raised arm overhead, leaning back) and low slam; the cutlass's own chops;
// kits without a variant (the fish's slap) and rigs without kits (rats) keep the borrowed sword pose (old case).
{
  const w = targetPose(inMove('plank-club', 'club1', 9), rig, 0);
  check(w.swap['arm-front-upper'] === 'arm-front-raised', 'club1 windup: the whole raised arm, club overhead');
  check(w.joints.torso < 0, 'club1 windup: leaning back');
  const sw = targetPose(bare({ state: 'attack', move: ITEMS['plank-club'].moves.club1, moveKey: 'club1', mf: 9 }), rig, 0);
  check(!sw.swap['arm-front-upper'], 'no kit held: the move borrows the sword pose (slash1)');
  const hold = KP['plank-club'].moves.club1.hold, top = Math.ceil(10 * (1 - hold));   // club1 windup = 10 frames
  const a = targetPose(inMove('plank-club', 'club1', top), rig, 0).joints, b = targetPose(inMove('plank-club', 'club1', 9), rig, 0).joints;
  check(Math.abs(a.sword - b.sword) < 1e-9 && Math.abs(a.torso - b.torso) < 1e-9, 'club1: a held beat at the top of the windup');
  const k = targetPose(inMove('plank-club', 'club1', 14), rig, 0).joints, k2 = targetPose(inMove('plank-club', 'club2', 17), rig, 0).joints;
  check(k.dy > 4 && k.torso > 15, 'club1 strike: the body follows through low');
  check(k2.dy > k.dy, 'club2: lower than club1');
  for (const s of ['idle', 'walk']) {
    const j = targetPose(holding('plank-club', { state: s, t: 10 }), rig, 0.4).joints;
    check(j['sword.order'] < rig.parts.torso.order, `club ${s}: shouldered (behind the body)`);
  }
  const fishSlap = targetPose(inMove('big-fish', 'fishSlap', 15), rig, 0), slash2 = targetPose(sword('slash2', 8), rig, 0);   // both at the strike
  check(fishSlap.joints.sx === slash2.joints.sx && fishSlap.joints.sword === slash2.joints.sword, 'fish slap: slash2 spin pieces');
  const cut = targetPose(inMove('rat-cutlass', 'cut1', 2), rig, 0).joints, slash = targetPose(sword('slash1', 2), rig, 0).joints;
  const tip = (j) => j.torso + j['arm-front-upper'] + j['arm-front-lower'] + j.sword;
  check(tip(cut) > tip(slash), 'cutlass: a smaller wind-back than the sword');
  check(ITEMS['rat-cutlass'].moves.cut1.fx.slash.r < def.moves.slash1.fx.slash.r, 'cutlass: a tighter swoosh than the sword');
  const ratRig = RIGS[FIGHTERS['rat-raider'].art.rig], rat = { def: FIGHTERS['rat-raider'], state: 'attack', t: 0, mf: 3, move: ITEMS['plank-club'].moves.club1, moveKey: 'club1', weapon: { def: ITEMS['plank-club'] } };
  if (ratRig.poses.moves?.slash1) check(!targetPose(rat, ratRig, 0).swap['arm-front-upper'], 'a rig without kits keeps the borrowed pose');
  const plain = targetPose(bare({ state: 'walk', t: 10 }), rig, 0.4).joints;
  check(plain.sword === targetPose(holding('rat-cutlass', { state: 'walk', t: 10 }), rig, 0.4).joints.sword, 'a kit without a walk variant walks as before');
}

// 4. Fish wobble: still hand = still fish; a hand turn sets it flopping, settled by ~0.5 s; clamped to max
{
  const W = ITEMS['big-fish'].feel.wobble, s = { a: 0, v: 0, t: 0, hand: 0, hv: 0, dy: 0, yv: 0 };
  for (let i = 1; i <= 30; i++) stepWobble(W, s, 0, 0, i / 60);
  check(s.a === 0, 'wobble: a still hand leaves the fish still');
  let peak = 0, late = 0;
  for (let i = 31; i <= 120; i++) {
    const hand = i < 36 ? (i - 30) * 15 : 90, a = Math.abs(stepWobble(W, s, hand, 0, i / 60));
    if (i < 66) peak = Math.max(peak, a); else if (i > 66) late = Math.max(late, a);
  }
  check(peak > 6 && peak <= W.max, `wobble: a fast swing flops it (peak ${peak.toFixed(1)} deg, max ${W.max})`);
  check(late < peak * 0.2, `wobble: settled about half a second after (late ${late.toFixed(2)} vs peak ${peak.toFixed(1)})`);
  check(squashCurve(0) === 1 && squashCurve(1) === 0 && squashCurve(0.33) < 0, 'squash: squashed at the hit, stretches, settles');
}

// 5. feelLayer: no feel (club, cutlass, nothing held) = the same joints (old case); the fish squashes when its slap lands
{
  const j = { ...channelsOf(rig), ...rig.poses.stance };
  for (const id of ['plank-club', 'rat-cutlass', null]) {
    const f = id ? holding(id) : bare();
    check(feelLayer(rig, f, j, 1, {}) === j, `feel: ${id ?? 'empty hand'} unchanged`);
  }
  const f = holding('big-fish'), mem = {};
  feelLayer(rig, f, j, 1, mem);
  bus.emit('hit', { attacker: f, target: {}, move: {}, damage: 0, x: 0, y: 0, z: 0 });
  const s = feelLayer(rig, f, j, 1 + 1 / 60, mem);
  check(s['sword.sx'] < 0.8 && s['sword.sy'] > 1.15, 'fish slap lands: squashed along its length, fattened');
  let last;
  for (let i = 2; i <= 60; i++) last = feelLayer(rig, f, j, 1 + i / 60, mem);   // one draw per frame, nothing frozen
  check(Math.abs(last['sword.sx'] - 1) < 1e-9, 'squash settles');
  const g = holding('big-fish', { state: 'attack', move: ITEMS['big-fish'].moves.fishSlap, mf: 11 }), m2 = {};
  feelLayer(rig, g, j, 1, m2); bus.emit('hit', { attacker: g, target: {}, move: {}, damage: 0, x: 0, y: 0, z: 0 });
  feelLayer(rig, g, j, 1.02, m2);
  check(feelLayer(rig, g, j, 1.15, m2)['sword.sx'] < 0.75, 'squash holds through the hit-stop (his swing frozen)');
}

// 6. Club hits shake harder than their sim shake (view-only extra); a move without fx.shake shakes as before
{
  const J = createJuice(), club = ITEMS['plank-club'].moves.club1;
  bus.emit('hit', { attacker: {}, target: {}, move: club, damage: 0, x: 0, y: 0, z: 0 });
  check(J.shake === club.shake + club.fx.shake, 'club hit: the move shake plus the club extra');
  J.reset(); const cut = ITEMS['rat-cutlass'].moves.cut1;
  bus.emit('hit', { attacker: {}, target: {}, move: cut, damage: 0, x: 0, y: 0, z: 0 });
  check(J.shake === cut.shake, 'cutlass hit: the same shake as before');
}

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
