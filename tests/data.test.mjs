// Data integrity: every fighter, move and stage is complete and every art file exists.
// Catches broken data edits (by code or art builders) before anyone opens a browser.
import { existsSync } from 'node:fs';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { STAGES } from '../src/data/stages/index.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const PHASES = ['windup', 'active', 'recovery'];

for (const [id, f] of Object.entries(FIGHTERS)) {
  check(f.id === id, `${id}: registry key matches id`);
  check(['hero', 'enemy'].includes(f.team), `${id}: team`);
  check(existsSync(f.art.idle), `${id}: art.idle exists (${f.art.idle})`);
  for (const [pose, p] of Object.entries(f.art)) if (typeof p === 'string') check(existsSync(p), `${id}: art.${pose} exists (${p})`);
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
console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
