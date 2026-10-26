// T041: two-handers item-led (render/item-lead.js, data/item-lead.js) and the impact overshoot + stretch (render/impact.js,
// data/impact.js). Rat v3's spear and staff keys pose the item; every frame of those clips has both fists on the shaft,
// joints inside the limits; at a key the item is at the key's angle; an unreachable place moves the item the least
// distance; the lead fades. Impact: v3's attacks overshoot one frame and stretch the weapon arm (<= 8%, 1-2 frames) at the
// hit frame; the old rats (game rigs) have no item poses, no impact, no new channels, so their clips are as before.
import assert from 'node:assert/strict';
import { RIGS } from '../src/data/rigs/index.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { channelsOf, targetPose } from '../src/render/rig-pose.js';
import { layoutRig } from '../src/render/rig-layout.js';
import { at } from '../src/render/rig-ik.js';
import { ITEM_LEAD, leadOf } from '../src/data/item-lead.js';
import { IMPACT, impactOf } from '../src/data/impact.js';
import { solveItem, holdsAt, itemLeadLayer } from '../src/render/item-lead.js';
import { hitFrame, impactFrame } from '../src/render/impact.js';
import V3, { V3_SPEARMAN } from '../src/data/rigs/rat-v3.js';
import { framesOf, keyFrame, itemOf, limitFaults } from '../tools/v3-own-check.mjs';

let fails = 0;
const check = (name, fn) => { try { fn(); console.log('ok  ', name); } catch (e) { fails++; console.log('FAIL', name, '\n   ', e.stack.split('\n').slice(0, 4).join('\n    ')); } };
const by = (L) => Object.fromEntries(L.filter((e) => e.m && !e.line).map((e) => [e.name, e]));
const wrap = (d) => ((d + 540) % 360) - 180;
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const traced = (fn) => { ITEM_LEAD.trace = []; try { fn(); return ITEM_LEAD.trace; } finally { ITEM_LEAD.trace = null; } };
const SPEAR_CLIPS = ['idle', 'walk', 'spearThrust', 'staffSwing', 'staffOverhead'];

check('who leads is data: one-handers hand, two-handers and the bow item', () => {
  assert.equal(leadOf('one-hand', 'ratSlash'), 'hand');
  assert.equal(leadOf('two-hand', 'spearThrust'), 'item');
  assert.equal(leadOf('bow', 'shot'), 'item');
  assert.equal(leadOf('unknown', null), 'hand');
});

check('the old rats: no item poses, no impact, no new channels; v3\'s one-handed clips never run the item solve', () => {
  for (const id of ['rat-raider', 'rat-spearman', 'rat-archer']) {
    const R = RIGS[FIGHTERS[id].art.rig];
    assert.ok(!R.itemPoses && !R.impact, id);
    assert.ok(!Object.keys(channelsOf(R)).some((k) => k.startsWith('item.') || k.endsWith('.len')), id);
    assert.ok(!JSON.stringify(R.poses).includes('"item":'), id);
  }
  for (const clip of ['ratSlash', 'overheadChop', 'guard']) assert.equal(traced(() => framesOf('rat-raider', clip, V3)).length, 0, clip);
});

check('a layout without stretch is the same as before (len 1 = no change)', () => {
  const j = targetPose({ def: FIGHTERS['rat-raider'], state: 'idle', t: 0, facing: 1, z: 0 }, V3, 0).joints;
  const a = layoutRig(V3, { ...j, 'arm-near-upper.len': 1 }), b = layoutRig(V3, Object.fromEntries(Object.entries(j).filter(([k]) => !k.endsWith('.len'))));
  assert.deepEqual(a.map((e) => e.m), b.map((e) => e.m));
});

// the far fist's grip-line point off the shaft line (px), and along it from grip2 back toward the near fist
function farOnShaft(F) {
  const G = V3_SPEARMAN.grips['two-hand'], it = itemOf(F), P = at(V3_SPEARMAN, F.L, 'hand-far', G.ik.hand), u = [Math.cos(it.angle * Math.PI / 180), Math.sin(it.angle * Math.PI / 180)];
  const T = apply(it.e.m, F.held.kit.art.grip2), v = [P[0] - T[0], P[1] - T[1]];
  return { across: Math.abs(v[0] * u[1] - v[1] * u[0]), along: v[0] * u[0] + v[1] * u[1] };
}

check('every frame of v3\'s spear and staff clips: both fists on the shaft (far fist within 1 px of it, at grip2 or slid back <= 16 px), inside the limits', () => {
  const bad = [];
  for (const clip of SPEAR_CLIPS) {
    for (const { i, F } of framesOf('rat-spearman', clip, V3_SPEARMAN)) {
      if (by(F.L)['hand-far'].swap !== 'hand-far-grip-overhand') { bad.push(`${clip}@${i}: far fist let go`); continue; }
      const o = farOnShaft(F);
      if (o.across > 1 || o.along > 1 || o.along < -ITEM_LEAD.search.slide - 1) bad.push(`${clip}@${i}: far fist ${o.across.toFixed(2)} off, ${o.along.toFixed(1)} along`);
      for (const x of limitFaults(V3_SPEARMAN, F)) bad.push(`${clip}@${i}: ${x}`);
    }
  }
  assert.deepEqual(bad, []);
});

check('at each key the item is where the key poses it: the key\'s angle (+ the body\'s lean), unmoved', () => {
  const keys = [['idle', 0], ['spearThrust', 'windup'], ['spearThrust', 'strike'], ['spearThrust', 'recover'], ['staffSwing', 'windup'], ['staffSwing', 'strike'], ['staffOverhead', 'windup'], ['staffOverhead', 'strike']];
  for (const [clip, key] of keys) {
    let F;
    const s = traced(() => { F = keyFrame('rat-spearman', clip, key, V3_SPEARMAN); }).at(-1);
    assert.ok(s.ok && s.moved === 0, `${clip} ${key}: moved ${s.moved}`);
    assert.ok(Math.abs(wrap(s.after.a - s.a)) < 0.6, `${clip} ${key}: solved at ${s.after.a.toFixed(2)} for ${s.a}`);
    // drawn: the solve turned by the move's body lean (the floor rule turns the hips after the solve; LEAN <= 0.2 x bodyLean)
    assert.ok(Math.abs(wrap(itemOf(F).angle - s.a)) < 5, `${clip} ${key}: drawn at ${itemOf(F).angle.toFixed(1)} for ${s.a}`);
  }
  assert.ok(Math.abs(itemOf(keyFrame('rat-spearman', 'spearThrust', 'strike', V3_SPEARMAN)).angle) <= 15, 'the thrust: point within 15 deg of forward');
});

check('an unreachable place: the item moves the least distance that lets both fists hold (no hold 1 px nearer)', () => {
  const s0 = traced(() => keyFrame('rat-spearman', 'spearThrust', 'strike', V3_SPEARMAN)).at(-1);
  const j = { ...s0.joints, 'item.x': s0.joints['item.x'] + 25 * s0.joints['item.lead'] }, s = solveItem(s0.rig, j, s0.B, s0.held);
  assert.ok(s.ok && s.moved > 5, `moved ${s.moved}`);
  for (let i = 0; i < 48; i++) {
    const t = (2 * Math.PI * i) / 48, r = s.moved - 1, G = [s.G0[0] + r * Math.cos(t), s.G0[1] + r * Math.sin(t)];
    assert.ok(!holdsAt(s0.rig, s0.B, j, s0.held, G, s.a).ok, `holds at ${r} px, dir ${i}`);
  }
});

check('itemLead fades: at 0.5 each arm joint is half way from its own pose to the item-led one', () => {
  const s0 = traced(() => keyFrame('rat-spearman', 'staffSwing', 'strike', V3_SPEARMAN)).at(-1), { rig, joints, B, held } = s0;
  const full = itemLeadLayer(rig, joints, B, held), half = { ...joints };
  for (const c of ['x', 'y', 'rot', 'chest', 'lead']) half[`item.${c}`] = joints[`item.${c}`] * 0.5;
  const mid = itemLeadLayer(rig, half, B, held);
  for (const p of ['arm-near-upper', 'arm-near-lower', 'hand-near', 'arm-far-upper', 'arm-far-lower', 'hand-far'])
    assert.ok(Math.abs(wrap(mid[p] - (joints[p] + wrap(full[p] - joints[p]) / 2))) < 1e-6, p);
  assert.deepEqual(itemLeadLayer(rig, { ...joints, 'item.lead': 0 }, B, held), { ...joints, 'item.lead': 0 });
});

// the near forearm's bone length on a frame's layout (elbow -> wrist)
const fore = (L) => { const B = by(L), E = apply(B['arm-near-lower'].base, V3.parts['arm-near-lower'].pivot), W = apply(B['hand-near'].base, V3.parts['hand-near'].pivot); return Math.hypot(W[0] - E[0], W[1] - E[1]); };

check('impact on v3\'s attacks: one overshoot frame past the strike, the weapon arm stretched 6% then 3%, then settled', () => {
  for (const [id, clip, rig] of [['rat-raider', 'ratSlash', V3], ['rat-raider', 'overheadChop', V3], ['rat-spearman', 'spearThrust', V3_SPEARMAN], ['rat-raider', 'shieldBash', V3]]) {
    const def = FIGHTERS[id], M = def.moves[clip] ?? def.rehearsal[clip], T = rig.poses.timing, h = M.windup + hitFrame(M, T), I = impactOf(rig, clip);
    const at = (mf) => targetPose({ def, state: 'attack', move: M, moveKey: clip, mf, t: mf, facing: 1, z: 0, grab: { knee: -1 } }, rig, 0).joints;
    const arm = I.limb[0];
    assert.ok(I.stretch <= 0.08 && I.frames <= 2, clip);
    assert.equal(at(h)[`${arm}.len`], 1 + IMPACT.stretch, `${clip} hit frame`);
    assert.equal(at(h + 1)[`${arm}.len`], 1 + IMPACT.stretch / 2, `${clip} next frame`);
    assert.equal(at(h + 2)[`${arm}.len`], 1, `${clip} settled`);
    assert.equal(at(h - 1)[`${arm}.len`], 1, `${clip} before`);
    const K = at(h + 1), O = at(h), moved = Object.keys(K).filter((c) => !c.endsWith('.len') && Math.abs(O[c] - K[c]) > 1e-9);
    assert.ok(moved.length > 0, `${clip}: the hit frame is past the strike`);
    assert.ok(impactFrame(rig, clip, M, T, h) && impactFrame(rig, clip, M, T, h + 1) && !impactFrame(rig, clip, M, T, h + 2), clip);
  }
  // drawn: the near forearm longer on the hit frame by the stretch
  const fr = framesOf('rat-raider', 'ratSlash', V3), M = FIGHTERS['rat-raider'].moves.ratSlash, h = M.windup + hitFrame(M, V3.poses.timing);
  assert.ok(Math.abs(fore(fr[h].F.L) / fore(fr[h + 2].F.L) - (1 + IMPACT.stretch)) < 1e-6, `${fore(fr[h].F.L)} vs ${fore(fr[h + 2].F.L)}`);
  // the raider's own rig: no impact, its strike as before
  assert.equal(impactOf(RIGS[FIGHTERS['rat-raider'].art.rig], 'ratSlash'), null);
});

console.log(fails ? `${fails} failed` : 'all passed');
process.exit(fails ? 1 : 0);
