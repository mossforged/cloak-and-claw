// Rig poses and layout (render-side, but pure): each state/move picks the right pose, move phases
// land on their windup/strike, blends start from the last drawn pose, and the layout is sane.
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { targetPose, rigJoints, jointsOfRig } from '../src/render/rig-pose.js';
import { layoutRig } from '../src/render/rig.js';
import { readFileSync, existsSync } from 'node:fs';

// Bottom row of a part image (PNG header height), i.e. the boot sole.
const soleY = (part) => readFileSync(rig.parts[part].img).readUInt32BE(20) - 3;

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
const hip = at('torso', rig.parts.torso.pivot);
check(Math.abs(hip[1] + rig.rootY) < 2, `hips about rootY above the feet (y=${hip[1].toFixed(1)})`);
check(at('head', rig.parts.head.pivot)[1] < hip[1], 'neck above hips');
for (const leg of ['leg-front-lower', 'leg-back-lower']) {
  const y = at(leg, [rig.parts[leg].pivot[0], soleY(leg)])[1];
  check(Math.abs(y) < 8, `${leg}: boot sole within 8 px of the ground in stance (y=${y.toFixed(1)})`);
}

// Block (shield-wall crouch): both boots stay on the floor.
const B = layoutRig(rig, targetPose(fighter({ state: 'block' }), rig, 0).joints);
for (const leg of ['leg-front-lower', 'leg-back-lower']) {
  const m = B.find((e) => e.name === leg).m, [x, y] = [rig.parts[leg].pivot[0], soleY(leg)];
  const sy = m[1] * x + m[3] * y + m[5];
  check(Math.abs(sy) < 4, `block: ${leg} boot sole on the floor (y=${sy.toFixed(1)})`);
}

// Walk: feet don't skate. While a foot is planted (half a stride cycle) the body moves walk * 60 / speed / 2 px;
// the foot's sweep from front to back relative to the hips must match that.
const walkSpeed = def.move.walk * 60, need = walkSpeed / P.walk.speed / 2;
for (const leg of ['leg-front-lower', 'leg-back-lower']) {
  let lo = Infinity, hi = -Infinity, deepest = -Infinity;
  for (let i = 0; i < 60; i++) {
    const t = i / 60 / P.walk.speed;
    const W = layoutRig(rig, targetPose(fighter({ state: 'walk', t: t * 60 }), rig, 0).joints);
    const m = W.find((e) => e.name === leg).m, [x, y] = [rig.parts[leg].pivot[0], soleY(leg)];
    const fx = m[0] * x + m[2] * y + m[4];
    lo = Math.min(lo, fx); hi = Math.max(hi, fx); deepest = Math.max(deepest, m[1] * x + m[3] * y + m[5]);
  }
  check(deepest < 4, `${leg}: walk never sinks the boot into the floor (deepest y=${deepest.toFixed(1)})`);
  check(Math.abs((hi - lo) / need - 1) < 0.25, `${leg}: stride sweep ${(hi - lo).toFixed(1)} px ~ needed ${need.toFixed(1)} px (feet don't skate)`);
}

// slash2 spin slash: front arm stays in front of the torso; the blade goes from flat behind (mid-spin)
// to flat in front (strike), and the sim frames of the move are untouched by the rig.
const s2 = def.moves.slash2, wind = layoutRig(rig, targetPose(fighter({ state: 'attack', move: s2, mf: s2.windup }), rig, 0).joints);
const idx = (Lx, n) => Lx.findIndex((e) => e.name === n);
check(idx(wind, 'arm-front-upper') > idx(wind, 'torso'), 'slash2 windup: front arm drawn in front of the torso');
const hit = layoutRig(rig, targetPose(fighter({ state: 'attack', move: s2, mf: s2.windup + s2.active - 1 }), rig, 0).joints);
check(idx(hit, 'arm-front-upper') > idx(hit, 'torso'), 'slash2 strike: front arm drawn in front of the torso');
const tipOf = (j) => ((['torso', 'arm-front-upper', 'arm-front-lower', 'sword'].reduce((a, k) => a + j[k], 0) % 360) + 360) % 360;
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

// Swaps reach the layout at the right moments: slash3 turns away in the windup and back on the strike,
// strikes shout, hurt winces, idle is the normal drawing.
const imgOf = (Lx, n) => Lx.find((e) => e.name === n).img;
const poseLayout = (o, override) => { const t = targetPose(fighter(o), rig, 0, override); return layoutRig(rig, t.joints, t.swap); };
const s3 = def.moves.slash3;
const s3w = poseLayout({ state: 'attack', move: s3, mf: s3.windup - 1 }), s3k = poseLayout({ state: 'attack', move: s3, mf: s3.windup + 1 });
check(imgOf(s3w, 'torso') === rig.parts.torso.swaps['torso-back'].img, 'slash3 windup: back torso');
check(imgOf(s3k, 'torso') === rig.parts.torso.img, 'slash3 strike: front torso again');
check(imgOf(s3k, 'head') === rig.parts.head.swaps['head-shout'].img, 'slash3 strike: shouting head');
// slash2 turns his back for one drawing mid-spin: front torso at the end of the windup, back torso
// (and the shouting head) one frame into active, front torso again from the next frame on.
const s2at = (mf) => poseLayout({ state: 'attack', move: s2, mf });
check(imgOf(s2at(s2.windup), 'torso') === rig.parts.torso.img, 'slash2 first active frame: front torso');
check(imgOf(s2at(s2.windup + 1), 'torso') === rig.parts.torso.swaps['torso-back'].img, 'slash2 mid-spin: back torso');
check(imgOf(s2at(s2.windup + 1), 'head') === rig.parts.head.swaps['head-shout'].img, 'slash2 mid-spin: shouting head');
for (const mf of [s2.windup + 2, s2.windup + 3])
  check(imgOf(s2at(mf), 'torso') === rig.parts.torso.img && imgOf(s2at(mf), 'head') === rig.parts.head.swaps['head-shout'].img, `slash2 frame ${mf}: front torso, shouting`);
check(imgOf(s2at(s2.windup - 1), 'torso') === rig.parts.torso.img, 'slash2 windup: front torso');
const late = poseLayout({ state: 'attack', move: s3, mf: s3.windup + s3.active + s3.recovery - 1 });
check(imgOf(late, 'head') === rig.parts.head.img, 'end of recovery: neutral head again');
check(imgOf(poseLayout({ state: 'hurt' }), 'head') === rig.parts.head.swaps['head-hurt'].img, 'hurt: hurt head');
check(imgOf(poseLayout({ state: 'knockdown' }), 'head') === rig.parts.head.swaps['head-hurt'].img, 'knockdown: hurt head');
const idleL = poseLayout({});
check(idleL.every((e) => e.img === e.p.img && !e.swap), 'idle: every part shows its normal image');
check(layoutRig(rig, targetPose(fighter({}), rig, 0).joints).every((e, i) => e.m.every((v, j) => v === idleL[i].m[j])), 'no swap argument = same layout as no swaps');
// a swapped part keeps its joint: the head's pivot lands on the same screen point with or without the swap
const hurtJ = targetPose(fighter({ state: 'hurt' }), rig, 0).joints;
const pivotAt = (Lx) => { const e = Lx.find((x) => x.name === 'arm-front-upper'); return [e.m[4], e.m[5]]; };
check(pivotAt(layoutRig(rig, hurtJ, {})).every((v, i) => near(v, pivotAt(layoutRig(rig, hurtJ, { torso: 'torso-back' }))[i])), 'swapping the torso does not move the arms');

// cast (view-only test pose): sword straight up, shouting, reachable as an override whatever the state.
const cast = targetPose(fighter({ state: 'walk', t: 9 }), rig, 0, 'cast');
check(cast.key === 'cast' && cast.swap.head === 'head-shout', 'cast override: key cast, shouting head');
const tip = ['torso', 'arm-front-upper', 'arm-front-lower', 'sword'].reduce((a, j) => a + cast.joints[j], 0);
check(near(((tip % 360) + 360) % 360, 270, 1), `cast: sword points straight up (sum ${tip})`);

console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
