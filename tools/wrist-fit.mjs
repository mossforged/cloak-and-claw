// T029 r3 posing aid: for one move key that places its weapon (`weapon.x/.y/.rot`), the placement nearest the posed one
// at which both wrists sit inside their limits (wrist limits off: what the pose itself asks) and the second fist still
// grips. Grid around the pose: x +-dx, y +-dy (2 px), rot +-dr (4 deg). Prints the best few.
// node tools/wrist-fit.mjs <fighter> <move> <key> [dx dy dr]
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { rigFrame } from '../src/render/rig.js';
import { keyMf } from '../src/viewer/rehearse-frames.js';
import { ITEMS } from '../src/data/items/index.js';
import { WRISTS, wristLimit, rangeOf } from '../src/data/wrists.js';
import { wrists } from './bench/wrist.js';

WRISTS.on = false;
const [id, mv, key, ...lim] = process.argv.slice(2), [DX = 14, DY = 16, DR = 60] = lim.map(Number), def = FIGHTERS[id], rig = RIGS[def.art.rig], m = def.moves[mv] ?? def.rehearsal?.[mv];
const P = rig.poses.moves[mv][key], o = { x: P['weapon.x'], y: P['weapon.y'], r: P['weapon.rot'] }, n = keyMf(rig, m, mv, key);
const frame = () => {
  const f = { def, state: m.air ? 'jump' : 'attack', t: n, mf: n, move: m, moveKey: mv, z: 0, vz: 0, facing: 1, id: 1, x: 0, y: 0, stun: 10, grab: { knee: -1 },
    ...(m.item && { weapon: { def: ITEMS[m.item], uses: 999, hit: false, broken: false } }) };
  const mem = {};
  rigFrame(f, rig, -1, mem);
  return rigFrame(f, rig, 0, mem).L;
};
const out = [];
for (let x = o.x - DX; x <= o.x + DX; x += 2) for (let y = o.y - DY; y <= o.y + DY; y += 2) for (let r = o.r - DR; r <= o.r + DR; r += 4) {
  Object.assign(P, { 'weapon.x': x, 'weapon.y': y, 'weapon.rot': r });
  const L = frame(), w = wrists(L, rig), grips = L.some((e) => e.name === 'hand-far' && /grip/.test(e.swap ?? ''));
  const over = w.reduce((s, h) => s + (([lo, hi]) => Math.max(0, h.bend - (hi - 5), (lo + 5) - h.bend))(rangeOf(wristLimit(rig, h.hand, h.swap ?? `hand-${h.hand}`))), 0);
  out.push({ x, y, r, over: +over.toFixed(1), grips, w: w.map((h) => `${h.hand} ${h.bend.toFixed(0)}`).join(' '), cost: over * 10 + (grips ? 0 : 1000) + Math.abs(x - o.x) + Math.abs(y - o.y) + Math.abs(r - o.r) / 2 });
}
Object.assign(P, { 'weapon.x': o.x, 'weapon.y': o.y, 'weapon.rot': o.r });
console.log(`${mv}:${key} posed at ${o.x}, ${o.y}, ${o.r}`);
for (const b of out.sort((a, b) => a.cost - b.cost).slice(0, 5)) console.log(JSON.stringify(b));
