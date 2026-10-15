// Breakable props and floor items (T010). Pure logic. Numbers: data/props, data/items, RULES.items / RULES.footprint.
// Props (w.props): obstacles on the belt that hero-team swings, thrown bodies and tossed weapons break after `hp` hits;
// on break they drop their contents (an item id or a weighted pick, rolled on w.itemRng so the fight's rng is untouched).
// Items (w.items): `pop` (falling, can't be picked up), `floor` (lying; weapons vanish after floorLife), `fly` (a tossed
// weapon: the first enemy or prop it touches is hit, then it bounces off and drops). Held weapons: sim/weapons.js.
import { RULES } from '../data/rules.js';
import { PROPS } from '../data/props/index.js';
import { ITEMS } from '../data/items/index.js';
import { bus } from '../core/events.js';
import { applyHit, vulnerable, hitboxOf } from './combat.js';

let nextId = 1;

export function createProps(stage) {
  return (stage.props ?? []).map((s) => {
    const def = PROPS[s.type];
    return { id: nextId++, def, x: s.x, y: s.y, hp: def.hp, drops: s.drops !== undefined ? s.drops : def.drops, lastHit: -999, broken: false };
  });
}

// An item id from a drops entry: an id, { id: weight }, or null.
function pick(drops, rng) {
  if (!drops || typeof drops === 'string') return drops ?? null;
  const all = Object.entries(drops), total = all.reduce((a, [, n]) => a + n, 0);
  let r = rng.next() * total;
  for (const [id, n] of all) if ((r -= n) < 0) return id;
  return all[all.length - 1][0];
}

// A new item popping up from (x, y) at height z. uses: a weapon's hits left (default: full durability).
export function spawnItem(w, id, x, y, z = 0, o = {}) {
  const def = ITEMS[id], I = RULES.items;
  const it = { id: nextId++, def, x, y, z, vx: o.vx ?? (w.itemRng.next() - 0.5) * 2 * I.popVx, vz: o.vz ?? I.popVz,
    state: 'pop', life: I.floorLife, uses: o.uses ?? def.durability, spin: 0, dir: 1, thrower: null };
  w.items.push(it);
  return it;
}

function damageProp(w, p, by, x, z) {
  if (p.broken) return;
  p.hp--; p.lastHit = w.frame;
  bus.emit('propHit', { by, prop: p, x, y: p.y, z });
  if (p.hp > 0) return;
  p.broken = true;
  bus.emit('propBreak', { by, prop: p, x: p.x, y: p.y });
  const id = pick(p.drops, w.itemRng);
  if (id) spawnItem(w, id, p.x, p.y + 1, p.def.body.h * 0.4);
}

const touches = (p, x0, x1, y, depth, z0) => !p.broken && x1 >= p.x - p.def.body.w / 2 && x0 <= p.x + p.def.body.w / 2
  && Math.abs(y - p.y) <= depth + p.def.body.d / 2 && z0 <= p.def.body.h;

// Hero-team swings hit props once per move (keys `prop:<id>` in the attacker's hitList); thrown bodies hit them as they pass.
export function hitProps(w) {
  for (const a of w.fighters) {
    if (a.team !== 'hero') continue;
    const hb = hitboxOf(a);
    if (!hb) continue;
    for (const p of w.props) {
      const k = `prop:${p.id}`;
      if (a.hitList.has(k) || !touches(p, hb.x0, hb.x1, hb.y, hb.depth, hb.z0)) continue;
      a.hitList.add(k);
      damageProp(w, p, a, Math.max(hb.x0, Math.min(hb.x1, p.x)), Math.min(hb.z1, p.def.body.h * 0.6));
    }
  }
  for (const b of w.fighters) {
    if (b.state !== 'thrown' || !b.thrower) continue;
    for (const p of w.props) {
      const k = `prop:${p.id}`, r = b.def.body.w / 2;
      if (b.hitList.has(k) || !touches(p, b.x - r, b.x + r, b.y, b.thrower.def.throw.depth, b.z)) continue;
      b.hitList.add(k);
      damageProp(w, p, b.thrower, p.x, p.def.body.h * 0.5);
    }
  }
  w.props = w.props.filter((p) => !p.broken);
}

// Props are solid: fighters on the ground (below the prop's top) are pushed out along the shallower side.
// f.blockedBy = the prop that pushed it this step (the AI steps round it).
export function blockProps(w) {
  for (const f of w.fighters) {
    f.blockedBy = null;
    if (!w.props.length || f.entering || f.state === 'thrown' || f.state === 'grabbed') continue;
    const fw = f.def.body.w * RULES.footprint / 2;
    for (const p of w.props) {
      if (f.z >= p.def.body.h) continue;
      const dx = f.x - p.x, dy = f.y - p.y;
      const ox = p.def.body.w / 2 + fw - Math.abs(dx), oy = p.def.body.d / 2 + 4 - Math.abs(dy);
      if (ox <= 0 || oy <= 0) continue;
      if (ox < oy) f.x += (dx >= 0 ? 1 : -1) * ox;
      else f.y += (dy >= 0 ? 1 : -1) * oy;
      f.blockedBy = p;
    }
  }
}

// A tossed weapon in flight: the first enemy it touches is knocked down (a `hit` from the thrower), or the first prop is damaged.
function flyHit(w, it) {
  const by = it.thrower, d = it.def, r = 18;
  for (const t of w.fighters) {
    if (t.team === by.team || !vulnerable(t) || t.entering || Math.abs(t.y - it.y) > by.def.toss.depth) continue;
    const b = t.def.body;
    if (Math.abs(t.x - it.x) > b.w / 2 + r || it.z < t.z - 10 || it.z > t.z + b.h + 10) continue;
    applyHit(by, t, { damage: d.toss.damage, knockdown: true, hitstop: d.toss.hitstop, shake: d.toss.shake, tossed: d.id }, w, { x: it.x, z: it.z });
    return true;
  }
  for (const p of w.props) {
    if (!touches(p, it.x - r, it.x + r, it.y, by.def.toss.depth, it.z)) continue;
    damageProp(w, p, by, it.x, it.z);
    return true;
  }
  return false;
}

function wear(w, it) {   // a tossed weapon's hit costs one use; at 0 it breaks where it hit
  if (--it.uses > 0) return;
  it.gone = true;
  bus.emit('weaponBreak', { f: it.thrower, weapon: it.def, x: it.x, y: it.y, z: it.z });
}

export function stepItems(w) {
  const I = RULES.items, fl = w.stage.floor;
  for (const it of w.items) {
    if (it.state === 'floor') { if (it.def.kind === 'weapon' && --it.life <= 0) it.gone = true; continue; }
    it.x += it.vx; it.z += it.vz;
    it.vz -= it.state === 'fly' ? I.flyGravity : I.gravity;
    it.spin += it.state === 'fly' ? it.dir * it.def.toss.spin : it.vx * 0.04;
    if (it.state === 'fly' && flyHit(w, it)) {
      wear(w, it);
      it.state = 'pop'; it.vx = -it.vx * 0.2; it.vz = 4;
    }
    if (it.x < fl.left || it.x > fl.right) { it.x = Math.max(fl.left, Math.min(fl.right, it.x)); it.vx = -it.vx * 0.3; if (it.state === 'fly') it.state = 'pop'; }
    if (it.z <= 0) { it.z = 0; it.vx = it.vz = 0; it.state = 'floor'; it.thrower = null; it.life = I.floorLife; bus.emit('itemLand', { item: it }); }
  }
  w.items = w.items.filter((it) => !it.gone);
}

// Enemies with a `drop` config leave their weapon when knocked out (once; rolled on w.itemRng).
export function dropOnKO(w) {
  for (const f of w.fighters) {
    if (f.hp > 0 || f.dropped || !f.def.drop) continue;
    f.dropped = true;
    if (w.itemRng.next() < f.def.drop.chance) spawnItem(w, f.def.drop.item, f.x, f.y, 50, { vx: -f.facing * 1.5, vz: 4.5 });
  }
}
