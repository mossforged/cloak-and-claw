// Data integrity: every fighter, move and stage is complete and every art file exists.
// Catches broken data edits (by code or art builders) before anyone opens a browser.
import { existsSync } from 'node:fs';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { STAGES } from '../src/data/stages/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { jointsOfRig } from '../src/render/rig-pose.js';
import { ITEMS } from '../src/data/items/index.js';
import { PROPS } from '../src/data/props/index.js';

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
    check(m.damage > 0 && m.hitbox?.w > 0 && m.hitbox?.h > 0, `${id}.${mk}: damage and hitbox`);
    if (m.next) check(f.moves[m.next], `${id}.${mk}: combo next '${m.next}' exists`);
  }
  if (f.team === 'enemy') check(f.ai && f.ai.range > 0, `${id}: ai config`);
}
for (const [id, s] of Object.entries(STAGES)) {
  check(existsSync(s.art.src), `stage ${id}: art exists`);
  const fl = s.floor;
  check(fl.left < fl.right && fl.top < fl.bottom, `stage ${id}: floor bounds`);
  check(s.playerStart.y >= fl.top && s.playerStart.y <= fl.bottom, `stage ${id}: playerStart on floor`);
  for (const w of s.waves) for (const e of w.enemies) check(FIGHTERS[e]?.team === 'enemy', `stage ${id}: wave enemy '${e}'`);
}
// Items, weapon kits and props (T010)
const dropIds = (d) => (!d ? [] : typeof d === 'string' ? [d] : Object.keys(d));
for (const [id, it] of Object.entries(ITEMS)) {
  check(it.id === id && ['weapon', 'food'].includes(it.kind), `item ${id}: id and kind`);
  check(existsSync(it.art.img) && it.art.px > 0, `item ${id}: art exists, px set`);
  if (it.kind === 'food') check(it.heal > 0, `item ${id}: heal`);
  if (it.kind !== 'weapon') continue;
  check(it.durability > 0 && it.toss?.damage > 0 && it.art.grip?.length === 2, `item ${id}: durability, toss, grip point`);
  check(it.moves[it.attack] && (!it.airAttack || it.moves[it.airAttack]), `item ${id}: attack move exists`);
  for (const [mk, m] of Object.entries(it.moves)) {
    for (const ph of PHASES) check(Number.isInteger(m[ph]) && m[ph] > 0, `item ${id}.${mk}: ${ph} is a positive integer`);
    check(m.damage > 0 && m.hitbox?.w > 0 && m.hitbox?.h > 0, `item ${id}.${mk}: damage and hitbox`);
    if (m.next) check(it.moves[m.next], `item ${id}.${mk}: combo next '${m.next}' exists`);
    for (const r of Object.values(RIGS)) if (r.slots?.[it.grip]) check(r.poses.moves[m.rig ?? mk], `item ${id}.${mk}: rig ${r.id} has move pose '${m.rig ?? mk}'`);
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
  const known = new Set([...jointsOfRig(r), 'speed', 'swap']);   // swap contents: tests/rig.test.mjs
  const P = r.poses, M = P.moves ?? {};
  const named = { stance: P.stance, idle: P.idle, walk: P.walk, jump: P.jump, hurt: P.hurt, knockdown: P.knockdown, down: P.down, getup: P.getup };
  for (const [k, pose] of Object.entries(P)) if (!(k in named) && k !== 'timing' && k !== 'moves') named[k] = pose;   // extra named poses (cast)
  for (const [k, m] of Object.entries(M)) { named[`${k}.windup`] = m.windup; named[`${k}.strike`] = m.strike; if (m.through) named[`${k}.through`] = m.through; }
  for (const [k, pose] of Object.entries(named)) {
    check(pose, `rig ${id}: pose '${k}' exists`);
    for (const j of Object.keys(pose ?? {})) check(known.has(j), `rig ${id}: pose '${k}' names unknown joint '${j}'`);
  }
  for (const f of Object.values(FIGHTERS).filter((f) => f.art.rig === id))
    for (const k of Object.keys(M)) check(f.moves[k], `rig ${id}: move pose '${k}' matches a move of ${f.id}`);
  check(P.timing.blend > 0 && P.timing.strikeIn > 0 && P.timing.strikeIn <= 1, `rig ${id}: timing`);
}
console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
