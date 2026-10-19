// Data integrity: every fighter, move and stage is complete and every art file exists.
// Catches broken data edits (by code or art builders) before anyone opens a browser.
import { existsSync } from 'node:fs';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { STAGES } from '../src/data/stages/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { jointsOfRig } from '../src/render/rig-pose.js';
import { ITEMS } from '../src/data/items/index.js';
import { PROPS } from '../src/data/props/index.js';
import { RULES } from '../src/data/rules.js';
import { segmentsOf, joinsOf } from '../src/render/layers.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const PHASES = ['windup', 'active', 'recovery'];
const IMG = /\.(png|webp|jpg)$/i;

for (const [id, f] of Object.entries(FIGHTERS)) {
  check(f.id === id, `${id}: registry key matches id`);
  check(['hero', 'enemy'].includes(f.team), `${id}: team`);
  check(existsSync(f.art.idle), `${id}: art.idle exists (${f.art.idle})`);
  for (const [pose, p] of Object.entries(f.art)) if (IMG.test(p)) check(existsSync(p), `${id}: art.${pose} exists (${p})`);
  if (f.art.rig) check(RIGS[f.art.rig], `${id}: art.rig '${f.art.rig}' is in the rig registry`);
  check(f.art.height > 0 && f.art.anchorX >= 0 && f.art.anchorX <= 1, `${id}: art height/anchorX`);
  check(f.stats.maxHp > 0, `${id}: maxHp`);
  for (const key of [f.attack, f.airAttack].filter(Boolean)) check(f.moves[key], `${id}: move '${key}' exists`);
  for (const [mk, m] of Object.entries(f.moves)) {
    for (const ph of PHASES) check(Number.isInteger(m[ph]) && m[ph] > 0, `${id}.${mk}: ${ph} is a positive integer`);
    check((m.damage > 0 && m.hitbox?.w > 0 && m.hitbox?.h > 0) || (m.shot?.damage > 0 && m.shot.speed > 0 && existsSync(m.shot.art.img)), `${id}.${mk}: damage and hitbox (or a shot)`);
    if (m.next) check(f.moves[m.next], `${id}.${mk}: combo next '${m.next}' exists`);
  }
  // T029: rehearsal moves: a hit (damage + hitbox) or a motion (no hit at all), phases set, a rig move pose on his rig
  for (const [mk, m] of Object.entries(f.rehearsal ?? {})) {
    check(!f.moves[mk], `${id}.${mk}: a rehearsal move isn't one of his own`);
    check(m.windup > 0 && m.active > 0 && m.recovery > 0, `${id}.${mk}: rehearsal phases`);
    // T029 r2: or a throw (a shot: the dagger flies), and the items it names (`item` in the hand, `strap` on the far hand) exist
    check(m.kind === 'motion' ? !m.hitbox && !m.damage && !m.shot : (m.damage > 0 && m.hitbox?.w > 0 && m.hitbox?.h > 0) || (m.shot?.damage > 0 && m.shot.speed > 0 && existsSync(m.shot.art.img)),
      `${id}.${mk}: a hit with a hitbox (or a shot), or a motion with none`);
    if (m.item) check(ITEMS[m.item] && RIGS[f.art.rig].slots?.[ITEMS[m.item].grip], `${id}.${mk}: item ${m.item} exists and fits a slot of his rig`);
    if (m.strap) check(ITEMS[m.strap]?.grip === 'shield' && RIGS[f.art.rig].itemLines?.[m.strap], `${id}.${mk}: strap ${m.strap} is a shield on the user's lines`);
    check(RIGS[f.art.rig]?.poses.moves?.[mk], `${id}.${mk}: rig ${f.art.rig} poses the rehearsal move`);
  }
  if (f.team === 'enemy') check(f.ai && f.ai.range > 0, `${id}: ai config`);
  if (f.kit) check(ITEMS[f.kit]?.kind === 'weapon' && f.moves === ITEMS[f.kit].moves, `${id}: kit '${f.kit}' is a weapon kit and gives his moves`);
}
for (const [id, s] of Object.entries(STAGES)) {
  if (s.art) check(existsSync(s.art.src), `stage ${id}: art exists`);
  const fl = s.floor;
  check(fl.left < fl.right && fl.top < fl.bottom, `stage ${id}: floor bounds`);
  check(s.playerStart.y >= fl.top && s.playerStart.y <= fl.bottom, `stage ${id}: playerStart on floor`);
  for (const w of [...s.waves, ...(s.zones ?? [])]) for (const e of w.enemies) check(FIGHTERS[e]?.team === 'enemy', `stage ${id}: wave enemy '${e}'`);
  check(s.art || s.layers, `stage ${id}: has art or layers`);
  if (s.layers) {   // T013 scrolling stage
    const L = s.layers, B = L.back, imgs = [L.far.src, L.floor.src, ...Object.values(B.segments).map((g) => g.src), ...Object.values(L.pieces).map((p) => p.src)];
    for (const src of imgs) check(existsSync(src), `stage ${id}: layer art ${src}`);
    for (const k of B.sequence) check(B.segments[k], `stage ${id}: back segment '${k}'`);
    const segs = segmentsOf(s), len = segs.at(-1).x + segs.at(-1).w;
    check(len === s.camera.length, `stage ${id}: camera.length ${s.camera.length} = back segments ${len}`);
    check(fl.left >= 0 && fl.right <= len, `stage ${id}: floor inside the stage`);
    for (const d of L.decor) check(L.pieces[d.piece] && ['back', 'front'].includes(d.layer), `stage ${id}: decor ${d.piece} ${d.layer}`);
    // every segment join is covered by a back-layer decor piece within 20 px
    for (const j of joinsOf(s)) check(L.decor.some((d) => d.layer === 'back' && Math.abs(d.x - j) <= 20), `stage ${id}: join at ${j} covered`);
    const xs = s.zones.map((z) => z.x);
    check(xs.every((x, i) => i === 0 || x > xs[i - 1]), `stage ${id}: zones in order`);
    check(xs.every((x) => x - 480 >= 0 && x + 480 <= len), `stage ${id}: zone screens inside the stage`);
    check(s.end > xs.at(-1) && s.end <= fl.right, `stage ${id}: end after the last zone, on the floor`);
  }
}
// T022: potion drop chances name real props / fighters
for (const [id, p] of Object.entries(RULES.potions.drops)) if (id !== 'solo') check((PROPS[id] || FIGHTERS[id]) && p >= 0 && p <= 1, `potion drop ${id}: a prop or fighter, chance 0..1`);

// Items, weapon kits and props (T010)
const dropIds = (d) => (!d ? [] : typeof d === 'string' ? [d] : Object.keys(d));
for (const [id, it] of Object.entries(ITEMS)) {
  check(it.id === id && ['weapon', 'food', 'potion', 'gear'].includes(it.kind), `item ${id}: id and kind`);
  check(existsSync(it.art.img) && it.art.px > 0, `item ${id}: art exists, px set`);
  if (it.kind === 'food') check(it.heal > 0, `item ${id}: heal`);
  if (it.kind === 'potion') check(it.heal > 0 && it.splash?.x > 0 && it.splash?.y > 0, `item ${id}: potion heal and splash`);
  if (it.kind !== 'weapon') continue;
  check(it.durability > 0 && it.toss?.damage > 0 && it.art.grip?.length === 2, `item ${id}: durability, toss, grip point`);
  check(it.moves[it.attack] && (!it.airAttack || it.moves[it.airAttack]), `item ${id}: attack move exists`);
  for (const [mk, m] of Object.entries(it.moves)) {
    for (const ph of PHASES) check(Number.isInteger(m[ph]) && m[ph] > 0, `item ${id}.${mk}: ${ph} is a positive integer`);
    check((m.damage > 0 && m.hitbox?.w > 0 && m.hitbox?.h > 0) || m.shot?.damage > 0, `item ${id}.${mk}: damage and hitbox (or a shot)`);
    if (m.next) check(it.moves[m.next], `item ${id}.${mk}: combo next '${m.next}' exists`);
    // rigs of fighters that can wield it: pick-up heroes (any floor weapon) and fighters carrying it as their kit (T011)
    const users = Object.values(FIGHTERS).filter((f) => f.art.rig && (f.pickup || f.kit === id)).map((f) => RIGS[f.art.rig]);
    for (const r of users) if (r.slots?.[it.grip]) check(r.poses.moves[m.rig ?? mk], `item ${id}.${mk}: rig ${r.id} has move pose '${m.rig ?? mk}'`);
  }
}
for (const [id, p] of Object.entries(PROPS)) {
  check(p.id === id && p.hp > 0 && p.body.w > 0 && p.body.d > 0 && p.body.h > 0, `prop ${id}: hp and body`);
  for (const a of [p.art.img, ...p.art.debris]) check(existsSync(a), `prop ${id}: art exists (${a})`);
  for (const d of dropIds(p.drops)) check(ITEMS[d], `prop ${id}: drop '${d}' is an item`);
}
for (const [id, s] of Object.entries(STAGES)) for (const p of s.props ?? []) {
  check(PROPS[p.type], `stage ${id}: prop type '${p.type}'`);
  check(p.y >= s.floor.top && p.y <= s.floor.bottom && p.x >= s.floor.left && p.x <= s.floor.right, `stage ${id}: ${p.type} at ${p.x},${p.y} on the floor`);
  for (const d of dropIds(p.drops)) check(ITEMS[d], `stage ${id}: ${p.type} drop '${d}' is an item`);
}
for (const [id, f] of Object.entries(FIGHTERS)) if (f.drop) check(ITEMS[f.drop.item] && f.drop.chance >= 0 && f.drop.chance <= 1, `${id}: drop item and chance`);

// Rigs: every part image exists, every parent exists (no loops), every pose names only known joints.
for (const [id, r] of Object.entries(RIGS)) {
  const roots = Object.entries(r.parts).filter(([, p]) => !p.parent);
  check(roots.length === 1, `rig ${id}: exactly one root part`);
  for (const [name, p] of Object.entries(r.parts)) {
    check(existsSync(p.img), `rig ${id}.${name}: image exists (${p.img})`);
    check(p.pivot?.length === 2 && Number.isFinite(p.order), `rig ${id}.${name}: pivot and order`);
    if (p.parent) check(r.parts[p.parent] && p.attach?.length === 2, `rig ${id}.${name}: parent '${p.parent}' exists, attach set`);
    const seen = new Set();
    for (let q = name; q && !seen.has(q); q = r.parts[q]?.parent) seen.add(q);
    check(seen.size <= Object.keys(r.parts).length && !r.parts[[...seen].pop()]?.parent, `rig ${id}.${name}: parent chain reaches the root`);
  }
  const known = new Set([...jointsOfRig(r), 'speed', 'swap', 'swapPhase', 'view', 'order', 'carry', 'free', 'aloft', 'grip', 'grip2', 'weapon']);   // T029: free (released), aloft (off the floor)   // T028: views, bands, carried object   // swap contents: tests/rig.test.mjs
  const P = r.poses, M = P.moves ?? {};
  const named = { stance: P.stance, idle: P.idle, walk: P.walk, jump: P.jump, hurt: P.hurt, knockdown: P.knockdown, down: P.down, getup: P.getup };
  for (const [k, pose] of Object.entries(P)) if (!(k in named) && !['timing', 'moves', 'kits'].includes(k)) named[k] = pose;   // extra named poses (cast)
  const addMoves = (pre, ms) => { for (const [k, m] of Object.entries(ms)) { named[`${pre}${k}.windup`] = m.windup; named[`${pre}${k}.strike`] = m.strike; [m.through ?? []].flat().forEach((x, i) => { named[`${pre}${k}.through${i || ''}`] = x; }); if (m.recover) named[`${pre}${k}.recover`] = m.recover; } };
  addMoves('', M);
  for (const [kit, KP] of Object.entries(P.kits ?? {})) {   // T017 weapon feel: a kit's own state and move poses
    check(ITEMS[kit]?.kind === 'weapon', `rig ${id}: kits '${kit}' is a weapon kit`);
    for (const [k, pose] of Object.entries(KP)) if (k !== 'moves') { check(P[k], `rig ${id}: kit ${kit} pose '${k}' lays over an existing pose`); named[`${kit}.${k}`] = pose; }
    for (const k of Object.keys(KP.moves ?? {})) check(ITEMS[kit]?.moves?.[k], `rig ${id}: kit ${kit} move pose '${k}' is one of its moves`);
    addMoves(`${kit}.`, KP.moves ?? {});
  }
  for (const [k, pose] of Object.entries(named)) {
    check(pose, `rig ${id}: pose '${k}' exists`);
    for (const j of Object.keys(pose ?? {})) check(known.has(j), `rig ${id}: pose '${k}' names unknown joint '${j}'`);
  }
  for (const f of Object.values(FIGHTERS).filter((f) => f.art.rig === id))
    for (const k of Object.keys(M)) check(f.moves[k] || f.rehearsal?.[k], `rig ${id}: move pose '${k}' matches a move (or rehearsal move) of ${f.id}`);
  check(P.timing.blend > 0 && P.timing.strikeIn > 0 && P.timing.strikeIn <= 1, `rig ${id}: timing`);
}
console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
