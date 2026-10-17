// Rig poses and layout (render-side, but pure): each state/move picks the right pose, move phases
// land on their windup/strike, blends start from the last drawn pose, and the layout is sane.
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { targetPose, rigJoints, jointsOfRig } from '../src/render/rig-pose.js';
import { layoutRig, heldOf } from '../src/render/rig.js';
import { ITEMS } from '../src/data/items/index.js';
import { readFileSync, existsSync } from 'node:fs';
import { soles, solePoints } from './rig-soles.mjs';
import { handleAngle } from '../src/render/rig.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const near = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;
const evalLike = (pose) => ({ ...P.stance, ...pose });   // a still pose's joints (no waves), stance where it leaves one out

const def = FIGHTERS['mouse-fighter'], rig = RIGS[def.art.rig], P = rig.poses;
check(rig, 'mouse-fighter uses a registered rig');
const fighter = (o) => ({ def, state: 'idle', t: 0, mf: 0, move: null, ...o });
const finite = (j) => Object.values(j).every(Number.isFinite);

// State -> pose key
const cases = { idle: 'idle', walk: 'walk', block: 'block', jump: 'jump', hurt: 'hurt', knockdown: 'knockdown', down: 'down', dead: 'down', getup: 'getup' };
for (const [state, key] of Object.entries(cases)) {
  const r = targetPose(fighter({ state, t: 7 }), rig, 1.3);
  check(r.key === key, `${state} -> pose ${key} (got ${r.key})`);
  check(finite(r.joints), `${state}: joints finite`);
  check(Object.keys(r.joints).every((j) => jointsOfRig(rig).includes(j)), `${state}: only rig joints`);
}

// Move phases: end of windup = windup pose; strike reached (with overshoot) inside active.
for (const [key, mp] of Object.entries(P.moves)) {
  const m = def.moves[key], state = m.air ? 'jump' : 'attack';
  const atWindupEnd = targetPose(fighter({ state, move: m, mf: m.windup }), rig, 0);
  check(atWindupEnd.key === key, `${key}: pose key is the move key`);
  for (const [j, v] of Object.entries(mp.windup)) if (j !== 'swap') check(near(atWindupEnd.joints[j], v), `${key}: ${j} at windup end = ${v}`);
  const done = targetPose(fighter({ state, move: m, mf: m.windup + m.active - 1 }), rig, 0);
  for (const [j, v] of Object.entries(mp.strike)) if (j !== 'swap') check(near(done.joints[j], v, 1), `${key}: ${j} at late active ~ ${v} (got ${done.joints[j]})`);
}

// Blending: a new pose starts from the last drawn one and reaches the target after timing.blend.
const mem = {}, f = fighter({ state: 'idle' });
const idle = rigJoints(f, rig, 0, mem);
f.state = 'hurt';
const start = rigJoints(f, rig, 0.5, mem);
check(Object.keys(idle).every((j) => near(start[j], idle[j])), 'blend starts at last drawn pose');
const end = rigJoints(f, rig, 0.5 + P.timing.blend, mem);
const hurt = targetPose(f, rig, 0).joints;
check(Object.keys(hurt).every((j) => near(end[j], hurt[j])), 'blend ends on target pose');

// Layout: every part once, in draw order, finite; root hip sits rootY above the feet; head above hips.
const L = layoutRig(rig, targetPose(fighter({}), rig, 0).joints);
check(L.length === Object.keys(rig.parts).length, 'layout has every part');
check(L.every((e, i) => i === 0 || L[i - 1].p.order <= e.p.order), 'layout sorted by order');
check(L.every((e) => e.m.every(Number.isFinite)), 'layout matrices finite');
const at = (name, [x, y]) => { const m = L.find((e) => e.name === name).m; return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; };
const hip = at('pelvis', rig.parts.pelvis.pivot);
check(Math.abs(hip[1] + rig.rootY) < 2, `hips about rootY above the feet (y=${hip[1].toFixed(1)})`);
check(at('head', rig.parts.head.pivot)[1] < hip[1], 'neck above hips');
const flat = (name, tp, eps = 1) => { for (const [ft, y] of Object.entries(soles(rig, tp.joints, tp.swap))) check(Math.abs(y) < eps, `${name}: ${ft} sole on the floor (y=${y.toFixed(2)})`); };
flat('idle', targetPose(fighter({}), rig, 0));

// Block (shield-wall crouch): both boots stay on the floor.
// Block (T023 round 2): shield face to the camera in front of the body (over the torso and head), effort head; blockstun shoves it out.
{
  const bp = targetPose(fighter({ state: 'block' }), rig, 0), L = layoutRig(rig, bp.joints, bp.swap);
  const ord = (n) => L.find((e) => e.name === n).order;
  check(!bp.swap['arm-far-upper'] && bp.swap.head === 'head-effort', 'block: shield on the jointed arm (not the edge-on guard arm), effort head');
  check(ord('shield') > ord('torso') && ord('shield') > ord('head'), 'block: shield drawn in front of the body');
  const hit = targetPose(fighter({ state: 'block', t: 1, stun: 12 }), rig, 0);
  check(hit.key === 'block' && hit.joints['shield.sx'] > bp.joints['shield.sx'] + 0.08, 'blocked hit: shield shoved out (bigger), same pose key');
  const late = targetPose(fighter({ state: 'block', t: 12, stun: 12 }), rig, 0);
  check(near(late.joints['shield.sx'], bp.joints['shield.sx'], 1e-6), 'blockstun over: back to the block pose');
}
// Swap `carry`: a carried part hangs off the swapping part at the given point on the swap image (no jump).
{
  const s = rig.parts['arm-far-upper'].swaps['arm-far-guard'], j = targetPose(fighter({ state: 'block' }), rig, 0).joints;
  const L = layoutRig(rig, j, { 'arm-far-upper': 'arm-far-guard' });
  const arm = L.find((e) => e.name === 'arm-far-upper'), sh = L.find((e) => e.name === 'shield');
  const pt = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  const fist = pt(arm.m, ...s.carry.shield), piv = pt(sh.m, ...sh.p.pivot);
  check(Math.hypot(fist[0] - piv[0], fist[1] - piv[1]) < 0.01, 'carry: the shield pivot sits on the guard arm fist');
}

// Boots flat on the floor in the crouches and planted poses (block, pickup reach, grab hold, stow, cast).
flat('block', targetPose(fighter({ state: 'block' }), rig, 0));
flat('blockHit', targetPose(fighter({ state: 'block', t: 0, stun: 12 }), rig, 0));
flat('reach', { joints: { ...P.stance, ...P.reach }, swap: P.reach.swap });
for (const k of ['stow', 'cast', 'grabbing', 'getup']) flat(k, { joints: { ...P.stance, ...P[k] }, swap: P[k].swap });

// T023 footwork: planted poses stand on the turned-out near boot, walking (and jumping) on the forward one.
const footOf = (pose) => pose.swap?.['foot-near'] ?? 'foot-near';
for (const k of ['idle', 'block', 'blockHit', 'cast', 'grabbing', 'stow', 'reach']) check(footOf(P[k]) === 'foot-near-out', `${k}: planted on the turned-out near boot`);
for (const [k, m] of Object.entries(P.moves)) if (!def.moves[k].air) check(footOf(m.windup) === 'foot-near-out' || k === 'slash2', `${k} windup: planted (turned-out near boot)`);
for (const k of ['walk', 'jump']) check(footOf(P[k]) === 'foot-near', `${k}: forward near boot`);
// (T023 round 2: strikes stand on the turned-out trailing boot: tests/mouse-footwork.test.mjs)
// Attacks move the legs (render only): the leading (far) boot steps in on the strike, the trailing one pushes back.
for (const [k, m] of Object.entries(P.moves)) {
  if (def.moves[k].air) continue;
  const w = solePoints(rig, { ...P.stance, ...m.windup }, m.windup.swap), s = solePoints(rig, { ...P.stance, ...m.strike }, m.strike.swap);
  check(s['foot-far'][0] - s['foot-near'][0] > w['foot-far'][0] - w['foot-near'][0] + 8, `${k}: the stride opens on the strike (step in)`);
  check(s['foot-far'][1] > -1 && Math.abs(w['foot-near'][1]) < 1, `${k}: leading boot down on the strike, trailing boot planted in the windup`);
}
check(P.moves.slash3.strike['leg-near-upper'] !== P.moves.slash1.strike['leg-near-upper'], 'slash3: its own (bigger) stride');
{ const jw = solePoints(rig, { ...P.stance, ...P.moves.jumpSlash.windup }), js = solePoints(rig, { ...P.stance, ...P.moves.jumpSlash.strike });
  check(js['foot-far'][0] - js['foot-near'][0] > jw['foot-far'][0] - jw['foot-near'][0] + 15, 'jumpSlash: legs tuck in the windup, kick out on the cut'); }

// Walk: feet don't skate. While a foot is planted (half a stride cycle) the body moves walk * 60 / speed / 2 px;
// the foot's sweep from front to back relative to the hips must match that.
const walkSpeed = def.move.walk * 60, need = walkSpeed / P.walk.speed / 2;
const walkSoles = Array.from({ length: 60 }, (_, i) => { const tp = targetPose(fighter({ state: 'walk', t: i / P.walk.speed }), rig, 0); return solePoints(rig, tp.joints, tp.swap); });
for (const leg of ['foot-near', 'foot-far']) {
  const xs = walkSoles.map((s) => s[leg][0]), lo = Math.min(...xs), hi = Math.max(...xs), deepest = Math.max(...walkSoles.map((s) => s[leg][1]));
  check(deepest < 2, `${leg}: walk never sinks the boot into the floor (deepest y=${deepest.toFixed(1)})`);
  check(Math.abs((hi - lo) / need - 1) < 0.25, `${leg}: stride sweep ${(hi - lo).toFixed(1)} px ~ needed ${need.toFixed(1)} px (feet don't skate)`);
}

// slash2 spin slash: front arm stays in front of the torso; the blade goes from flat behind (mid-spin)
// to flat in front (strike), and the sim frames of the move are untouched by the rig.
const s2 = def.moves.slash2, wind = layoutRig(rig, targetPose(fighter({ state: 'attack', move: s2, mf: s2.windup }), rig, 0).joints);
const idx = (Lx, n) => Lx.findIndex((e) => e.name === n);
check(idx(wind, 'arm-near-upper') > idx(wind, 'torso'), 'slash2 windup: front arm drawn in front of the torso');
const hit = layoutRig(rig, targetPose(fighter({ state: 'attack', move: s2, mf: s2.windup + s2.active - 1 }), rig, 0).joints);
check(idx(hit, 'arm-near-upper') > idx(hit, 'torso'), 'slash2 strike: front arm drawn in front of the torso');
// blade direction on screen (0 forward, 90 down): the sword lies along the fist's slot axis
const tipOf = (j) => (((['pelvis', 'torso', 'arm-near-upper', 'arm-near-lower', 'hand-near', 'sword'].reduce((a, k) => a + (j[k] ?? 0), rig.axes['one-hand'])) % 360) + 360) % 360;
check(near(tipOf(evalLike(P.moves.slash2.through)), 180, 5), 'slash2 through: blade flat out behind');
check(near(tipOf(evalLike(P.moves.slash2.strike)), 0, 5) || near(tipOf(evalLike(P.moves.slash2.strike)), 360, 5), 'slash2 strike: blade flat out in front');
check(s2.windup === 5 && s2.active === 4 && s2.recovery === 12 && s2.damage === 6, 'slash2: sim timing and damage unchanged (5/4/12, 6)');
check(JSON.stringify(s2.hitbox) === JSON.stringify({ x: 10, z: 20, w: 82, h: 70 }), 'slash2: hitbox unchanged');
check(s2.fx.slash.wrap && s2.fx.slash.to - s2.fx.slash.from > 180, 'slash2 swoosh wraps round the body (more than half a turn)');

// Part swaps: every swap image exists and has an offset; poses only name known parts and their swaps.
const pngSize = (img) => { const b = readFileSync(img); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
for (const [name, p] of Object.entries(rig.parts)) {
  for (const [sw, s] of Object.entries(p.swaps ?? {})) {
    check(existsSync(s.img), `${name}.${sw}: swap image exists (${s.img})`);
    check(s.offset?.length === 2 && s.offset.every(Number.isFinite), `${name}.${sw}: swap has a finite [x, y] offset`);
    if (!existsSync(s.img)) continue;
    // whole-limb swaps (T012) hide other parts and carry children: their shape differs by design, so check names instead
    for (const hName of s.hide ?? []) check(rig.parts[hName], `${name}.${sw}: hides known part '${hName}'`);
    for (const [c, xy] of Object.entries(s.carry ?? {})) check(rig.parts[c] && xy.length === 2 && xy.every(Number.isFinite), `${name}.${sw}: carries known part '${c}' at a finite point`);
    if (s.hide?.some((hName) => rig.parts[hName]?.parent === name)) continue;
    if (sw === 'foot-near-out') continue;   // A013 addendum 2: a painted perspective view (toes toward the camera), same ankle
    // no jump: the swap image's centre lands within 15% of the part image's size of the part's own centre
    const [w, h] = pngSize(p.img), [sw2, sh] = pngSize(s.img), k = s.scale ?? 1;
    const dx = s.offset[0] + k * sw2 / 2 - w / 2, dy = s.offset[1] + k * sh / 2 - h / 2;
    check(Math.abs(dx) < 0.15 * w && Math.abs(dy) < 0.15 * h, `${name}.${sw}: swap centred on the part (off by ${dx.toFixed(0)}, ${dy.toFixed(0)} px)`);
  }
}
const allPoses = { ...Object.fromEntries(Object.entries(P).filter(([k]) => k !== 'timing' && k !== 'moves')) };
for (const [k, m] of Object.entries(P.moves)) for (const ph of ['windup', 'through', 'strike']) if (m[ph]) allPoses[`${k}.${ph}`] = m[ph];
for (const [k, pose] of Object.entries(allPoses))
  for (const [part, sw] of Object.entries(pose.swap ?? {}))
    check(rig.parts[part]?.swaps?.[sw], `pose ${k}: swap ${part} -> '${sw}' is a known part and swap`);

// T023: every pose (states, moves, kit poses) names only this rig's channels and known swaps.
{
  const ch = new Set(jointsOfRig(rig)), META = new Set(['swap', 'speed', 'hold', 'tremble']), every = [];
  for (const [k, v] of Object.entries(P)) if (!['timing', 'moves', 'kits'].includes(k)) every.push([k, v]);
  for (const [k, m] of Object.entries(P.moves)) for (const ph of ['windup', 'through', 'strike']) if (m[ph]) every.push([`${k}.${ph}`, m[ph]]);
  for (const [kit, K] of Object.entries(P.kits)) {
    for (const st of ['idle', 'walk']) if (K[st]) every.push([`${kit}.${st}`, K[st]]);
    for (const [k, m] of Object.entries(K.moves ?? {})) for (const ph of ['windup', 'strike']) every.push([`${kit}.${k}.${ph}`, m[ph]]);
  }
  for (const [k, pose] of every) {
    const bad = Object.keys(pose).filter((c) => !ch.has(c) && !META.has(c));
    check(!bad.length, `pose ${k}: only rig channels (unknown: ${bad.join(', ')})`);
    for (const [part, sw] of Object.entries(pose.swap ?? {})) check(rig.parts[part]?.swaps?.[sw], `pose ${k}: swap ${part} -> '${sw}' exists`);
  }
}

// Swaps reach the layout at the right moments: slash3 turns away in the windup and back on the strike,
// strikes shout, hurt winces, idle is the normal drawing.
const imgOf = (Lx, n) => Lx.find((e) => e.name === n).img;
const poseLayout = (o, override) => { const t = targetPose(fighter(o), rig, 0, override); return layoutRig(rig, t.joints, t.swap); };
const s3 = def.moves.slash3;
const s3w = poseLayout({ state: 'attack', move: s3, mf: s3.windup - 1 }), s3k = poseLayout({ state: 'attack', move: s3, mf: s3.windup + 1 });
check(imgOf(s3w, 'torso') === rig.parts.torso.swaps['torso-side'].img && imgOf(s3w, 'head') === rig.parts.head.swaps['head-effort'].img, 'slash3 windup: turned side-on, effort face');
check(imgOf(s3k, 'torso') === rig.parts.torso.img, 'slash3 strike: front torso again');
check(imgOf(s3k, 'head') === rig.parts.head.swaps['head-attack'].img, 'slash3 strike: shouting head');
// slash2 spins: front torso through the windup, then mirrored with the true back view (A006 full back torso +
// back of the head, T012) for the first two active frames, then the side-on torso for the flat cut, shouting.
const s2at = (mf) => poseLayout({ state: 'attack', move: s2, mf });
const s2sx = (mf) => targetPose(fighter({ state: 'attack', move: s2, mf }), rig, 0).joints.sx;
check(imgOf(s2at(s2.windup - 1), 'torso') === rig.parts.torso.img && s2sx(s2.windup - 1) > 0, 'slash2 windup: front torso, facing forward');
for (const mf of [s2.windup, s2.windup + 1]) check(imgOf(s2at(mf), 'torso') === rig.parts.torso.swaps['torso-back'].img, `slash2 frame ${mf}: back torso`);
check(imgOf(s2at(s2.windup + 1), 'head') === rig.parts.head.swaps['head-back'].img, 'slash2 mid-spin: back of the head');
check(!s2at(s2.windup + 1).some((e) => e.name === 'scarf-tail'), 'slash2 mid-spin: separate scarf tail hidden (the back torso has its own)');
check(s2sx(s2.windup + 1) < -0.5, `slash2 mid-spin: body mirrored (sx ${s2sx(s2.windup + 1)})`);
for (const mf of [s2.windup + 2, s2.windup + 3])
  check(imgOf(s2at(mf), 'torso') === rig.parts.torso.swaps['torso-side'].img && imgOf(s2at(mf), 'head') === rig.parts.head.swaps['head-attack'].img && s2sx(mf) > 0.5, `slash2 frame ${mf}: side-on torso (flat cut), facing forward, shouting`);
check(['idle', 'walk', 'block', 'hurt'].every((st) => targetPose(fighter({ state: st }), rig, 0).joints.sx === 1), 'poses that leave sx out keep the body as drawn');
const late = poseLayout({ state: 'attack', move: s3, mf: s3.windup + s3.active + s3.recovery - 1 });
check(imgOf(late, 'head') === rig.parts.head.img, 'end of recovery: neutral head again');
check(imgOf(poseLayout({ state: 'hurt' }), 'head') === rig.parts.head.swaps['head-hurt'].img, 'hurt: hurt head');
check(imgOf(poseLayout({ state: 'knockdown' }), 'head') === rig.parts.head.swaps['head-hurt'].img, 'knockdown: hurt head');
const idleL = poseLayout({});
check(idleL.every((e) => (e.img === e.p.img && !e.swap) || (e.name === 'foot-near' && e.swap === 'foot-near-out')), 'idle: every part shows its normal image but the turned-out near boot');
const idleJ = targetPose(fighter({}), rig, 0).joints;
check(layoutRig(rig, idleJ).every((e, i) => e.m.every((v, j) => v === layoutRig(rig, idleJ, {})[i].m[j])), 'no swap argument = same layout as no swaps');
// a swapped part keeps its joint: the head's pivot lands on the same screen point with or without the swap
const hurtJ = targetPose(fighter({ state: 'hurt' }), rig, 0).joints;
const pivotAt = (Lx) => { const e = Lx.find((x) => x.name === 'arm-near-upper'); return [e.m[4], e.m[5]]; };
check(pivotAt(layoutRig(rig, hurtJ, {})).every((v, i) => near(v, pivotAt(layoutRig(rig, hurtJ, { torso: 'torso-back' }))[i])), 'swapping the torso does not move the arms');

// cast (view-only test pose): sword straight up, shouting, reachable as an override whatever the state.
const cast = targetPose(fighter({ state: 'walk', t: 9 }), rig, 0, 'cast');
check(cast.key === 'cast' && cast.swap.head === 'head-attack', 'cast override: key cast, attack head');
// T012: the whole raised arm hides the forearm and carries the sword, so the forearm drops out of the chain
const raised = cast.swap['arm-near-upper'] === 'arm-near-raised';
check(raised, 'cast: whole raised arm (A013)');
// the raised arm's fist holds the handle along its own slot axis (A013 slotDirection)
const tip = ['pelvis', 'torso', 'arm-near-upper', 'sword'].reduce((a, j) => a + cast.joints[j], rig.parts['arm-near-upper'].swaps['arm-near-raised'].axis);
check(near(((tip % 360) + 360) % 360, 270, 1), `cast: sword points straight up (sum ${tip})`);

// Grab and throw (T009): holding -> grabbing; a knee reaches the knee pose at its strike frame; a forward throw
// winds into throwWind, a back throw into throwWindBack (body mirrored by the end of the wind), then throwRelease.
const G = def.grab, TH = def.throw;
const gp = (o) => targetPose(fighter({ state: 'grabbing', grab: { knee: -1 }, ...o }), rig, 0);
check(gp({}).key === 'grabbing' && finite(gp({}).joints), 'grabbing -> pose grabbing');
const kneeAt = gp({ grab: { knee: G.knee.windup } });
check(kneeAt.key === 'knee' && near(kneeAt.joints['leg-far-upper'], P.knee['leg-far-upper']), 'knee strike frame reaches the knee pose');
check(kneeAt.swap.head === 'head-attack', 'knee: attack head');
const tw = (back, t) => targetPose(fighter({ state: 'throw', t, grab: { back } }), rig, 0);
check(tw(false, 2).key === 'throwWind' && tw(true, 2).key === 'throwWindBack', 'throw wind pose by direction');
check(tw(true, TH.wind - 1).joints.sx < -0.5 && tw(false, TH.wind - 1).joints.sx > 0.5, 'back throw mirrors the body by the end of the wind; forward does not');
check(tw(false, TH.wind + 1).key === 'throwRelease' && tw(false, TH.wind + TH.recovery).key === 'throwRelease', 'release pose after the wind');

// Held weapon (T010): replaces the hand slot's drawing on the same bone and order; empty hand when broken; toss poses.
{
  const j = targetPose(fighter({}), rig, 0).joints;
  const plain = layoutRig(rig, j), club = ITEMS['plank-club'];
  const held = layoutRig(rig, j, {}, heldOf({ weapon: { def: club, broken: false } }, rig));
  const slot = rig.slots['one-hand'], a = plain.find((e) => e.name === slot), b = held.find((e) => e.name === slot);
  check(b && b.img === club.art.img && b.order === a.order, 'held weapon drawn in the sword slot, same order');
  const grip = (e) => [e.m[0] * e.p.pivot[0] + e.m[2] * e.p.pivot[1] + e.m[4], e.m[1] * e.p.pivot[0] + e.m[3] * e.p.pivot[1] + e.m[5]];
  check(near(grip(a)[0], grip(b)[0], 1e-6) && near(grip(a)[1], grip(b)[1], 1e-6), 'weapon grip sits where the sword hilt was (same hand)');
  const sz = Math.hypot(b.m[0], b.m[1]);
  check(near(sz, club.art.px, 1e-6), `held weapon at its floor size (${sz.toFixed(3)} vs ${club.art.px})`);
  const broken = layoutRig(rig, j, {}, heldOf({ weapon: { def: club, broken: true } }, rig));
  check(!broken.some((e) => e.name === slot), 'broken weapon: empty hand (no sword either)');
  check(heldOf({ weapon: null }, rig) === null, 'nothing held: sword as usual');
  const PK = def.pickup;
  const pk = (t, o = {}) => targetPose(fighter({ state: 'pickup', t, ...o }), rig, 0).key;
  check(pk(1) === 'stow' && pk(PK.stow + 1) === 'reach' && pk(PK.stow + PK.reach + 1) === 'rise', 'pickup: stow -> reach -> rise');
  check(heldOf(fighter({ state: 'pickup', t: 1, pickup: { swap: false } }), rig) === null, 'pickup: sword shows while it is being stowed');
  check(heldOf(fighter({ state: 'pickup', t: PK.stow + 1, pickup: { swap: false } }), rig)?.part === null, 'pickup: sword sheathed once stowed');
  check(heldOf(fighter({ state: 'pickup', t: 1, pickup: { swap: true } }), rig)?.part === null, 'swap: empty hand from the start (old weapon flicked away)');
  check(heldOf(fighter({}), rig, true)?.part === null && heldOf(fighter({}), rig, false) === null, 'sword draw: sheathed in its first half only');
  const T = def.toss;
  check(targetPose(fighter({ state: 'toss', t: 2 }), rig, 0).key === 'toss' && targetPose(fighter({ state: 'toss', t: T.wind + 2 }), rig, 0).key === 'tossRelease', 'toss -> tossRelease poses');
  const m = club.moves.club2;
  check(targetPose(fighter({ state: 'attack', move: m, moveKey: 'club2', mf: m.windup }), rig, 0).joints['arm-near-upper'] === P.moves.slash3.windup['arm-near-upper'], 'weapon move borrows its rig move pose (club2 -> slash3)');
}

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
