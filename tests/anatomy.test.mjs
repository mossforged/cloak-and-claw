// T026 r5 anatomy rule test (rig standard 5b.1): for every rigged fighter and every frame key of every viewer clip (the
// pose seam test's frames: tools/bench/pose-seams.js poseFrames), each cover pair in src/data/rigs/anatomy.js holds on
// the draw list as drawn. A break fails with the fighter, the frame and the pair named, unless the rig's pair is waived.
import { poseFrames, rehearsalFrames } from '../tools/bench/pose-seams.js';
import { coverPairs, WAIVED, HAND_TABLES, GRIP_DRAWING, FACE, holdRows, sideOf } from '../src/data/rigs/anatomy.js';
import { modesOf } from '../src/render/weapon-node.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { MODELS, rigOf } from '../src/viewer/models.js';

let failed = 0, frames = 0, checked = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const used = new Set(), seen = new Set();
const overlayOrders = (rig, part) => Object.values(rig.grips ?? {}).map((g) => g.order?.[part]).filter((o) => o != null);
for (const id of MODELS) {
  const rig = rigOf(id), pairs = coverPairs(rig);
  check(pairs.some((p) => p.joint === 'near ankle'), `${id}: the cover rules find its parts`);
  for (const fk of [...poseFrames(id), ...rehearsalFrames(id)]) {   // T028 r3: + the rehearsal keys (the only B frames)
    frames++;
    const by = Object.fromEntries(fk.cell.L.filter((e) => e.m && !e.line).map((e) => [e.name, e]));
    for (const p of pairs) {
      const ts = p.tops.map((n) => by[n]).filter(Boolean), u = by[p.under], t = ts[0];
      if (!t || !u) continue;   // a whole-limb swap or a view hides one of the pair
      if (p.side && p.side !== sideOf(fk.cell.swap, p.by)) continue;   // T028 r3: a rule for the front or back views only
      if (p.overlay && overlayOrders(rig, p.under).includes(u.order)) continue;
      checked++;
      if (ts.some((x) => x.order > u.order)) continue;
      const key = `${id} | ${p.top} / ${p.under}`;
      if (WAIVED[key]) { used.add(key); continue; }
      if (seen.has(`${key} | ${fk.clip}`)) continue;   // one failure per clip and pair
      seen.add(`${key} | ${fk.clip}`);
      check(false, `${id} ${fk.label}: ${p.joint} broken (${p.rule}): ${p.top} ${t.order} not over ${p.under} ${u.order}`);
    }
  }
}
// T028 r2 hand table (5b.2): every hold uses a drawing named in its rig's table for that hand; a hold with no row fails.
// Holds in a frame: the drawing the held item hangs from (a hand's grip drawing, or the whole-arm drawing carrying it) and
// every hand showing a grip drawing (the far hand on a shaft, the bow hand, the pinch). Split grips: the item is never
// drawn over the solid face of its hand (the face over the item, the under piece below it).
// T029: and the drawing the table names for that hold (holdRows: the item's own hand by grip type and grip mode, the
// second hand by its role, a whole-arm drawing carrying the item); near rows show the back of the hand, far rows the palm.
// A wrong drawing fails with the pose, the hand and the hold named; split grips [under, item, face] on every hold.
let holds = 0;
for (const id of MODELS) {
  const T = HAND_TABLES[FIGHTERS[id]?.art?.rig ?? id] ?? HAND_TABLES[id], rig = rigOf(id);
  if (!T) { console.log(`NOTE ${id}: no hand table (rig standard 5b.2 table comes with its rebuild)`); continue; }
  for (const r of T) {
    check(rig.parts[r.drawing] || Object.values(rig.parts).some((p) => p.swaps?.[r.drawing]), `${id}: hand table drawing ${r.drawing} exists`);
    check(r.face === FACE[r.hand] || /hidden|knuckles/.test(r.face), `${id}: hand table ${r.drawing} (${r.hold}) shows the ${FACE[r.hand]} side of the ${r.hand} hand, not ${r.face}`);
  }
  const seenHold = new Set();
  for (const fk of [...poseFrames(id), ...rehearsalFrames(id).filter((f) => f.posed)]) {
    const L = fk.cell.L.filter((e) => e.m && !e.line), H = fk.cell.held, item = H?.part && L.find((e) => e.name === H.slot);
    if (!item) continue;
    const grip = H.kit.grip, mode = modesOf(rig, H, fk.cell.swap).grip, parent = H.part.parent, own = parent.slice(5);
    const used = [];   // [hand, role, drawing, entry, carried]
    for (const e of L) {
      if (/^hand-(near|far)$/.test(e.name) && GRIP_DRAWING.test(e.swap ?? '')) used.push([e.name.slice(5), e.name === parent ? 'item' : 'second', e.swap, e, false]);
      if (e.p?.swaps?.[e.swap]?.carry?.held) used.push([e.name.includes('near') ? 'near' : 'far', 'item', e.swap, e, true]);
    }
    const pe = L.find((e) => e.name === parent);
    if (pe && !pe.swap) used.push([own, 'item', parent, pe, false]);   // the bare default fist holding the item
    for (const [hand, role, drawing, e, carried] of used) {
      holds++;
      const key = `${id} | ${hand} | ${role} | ${grip} ${mode} | ${drawing}`;
      if (seenHold.has(key)) continue;
      seenHold.add(key);
      const rows = holdRows(T, { hand, role, grip, mode, carried }), hold = `${role === 'item' ? `holding the ${H.kit.id}` : `second hand on the ${H.kit.id}`} (${grip}, ${mode})`;
      check(rows.length, `${id} ${fk.label}: ${hand} hand ${hold}: no row in the hand table`);
      if (rows.length) check(rows.some((r) => r.drawing === drawing), `${id} ${fk.label}: ${hand} hand ${hold} uses ${drawing}; the hand table names ${rows.map((r) => r.drawing).join(' or ')}`);
      const under = L.find((x) => x.name === `${e.name}:under`);
      if (e.p?.swaps?.[drawing]?.under) {
        check(e.order > item.order, `${id} ${fk.label}: ${drawing} face drawn over the held item (${e.order} vs ${item.order})`);
        check(under && under.order < item.order, `${id} ${fk.label}: ${drawing} under piece drawn below the held item`);
      }
    }
  }
}
// the check catches a wrong drawing: the raider's guard with the overhand drawing on a side grip, the far fist's grip on a shaft
{
  const T = HAND_TABLES['rat-raider'];
  check(!holdRows(T, { hand: 'near', role: 'item', grip: 'one-hand', mode: 'side' }).some((r) => r.drawing === 'hand-near-grip-overhand'), 'hand table: a side grip may not use the overhand drawing');
  check(holdRows(T, { hand: 'far', role: 'second', grip: 'two-hand', mode: 'overhand' }).map((r) => r.drawing).join() === 'hand-far-grip-overhand', 'hand table: the far fist on a shaft is the overhand drawing only');
  check(!holdRows(T, { hand: 'far', role: 'second', grip: 'two-hand', mode: 'side' }).some((r) => r.drawing === 'hand-far-grip'), 'hand table: the far palm grip is not a shaft hold');
}
// T028 r3: the tail rule splits by view, and the rat's B and BQ frames are checked (the rehearsal sheet)
check(coverPairs(rigOf('rat-raider')).filter((p) => p.joint === 'tail root').map((p) => p.side).join() === 'front,back', 'tail root rule split: pelvis over (front), tail over (back)');
check(poseFrames('rat-raider', ['ratSlash']).some((f) => sideOf(f.cell.swap) === 'back') && rehearsalFrames('rat-raider').some((f) => f.cell.swap['@view.pelvis'] === 'B'), 'the rat\'s BQ and B frames are in the check');
// the rat itself waives nothing
check(Object.keys(WAIVED).every((k) => k.startsWith('mouse-fighter |')), 'only the mouse (rebuild pending) has waivers');
for (const k of Object.keys(WAIVED)) if (!used.has(k)) console.log(`NOTE waiver no longer needed: ${k}`);
console.log(failed ? `${failed} failures` : `ALL OK (${frames} frame keys, ${checked} cover pairs, ${holds} holds; ${used.size} mouse waivers in use)`);
process.exit(failed ? 1 : 0);
