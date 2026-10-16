// Pose authoring helper for standard-biped rigs (T023): turns a pose written as places and directions into the usual
// joint angles (degrees added to the master pose, rigs/*-poses.js). Pure math on the rig's own data, run once when the
// pose files load; the game then sees plain joint numbers. Only for rigs on the standard (rest 0 = master, uniform scale).
//   pose(rig, spec): spec keys
//     hand:   { at: [x, y] | off: [x, y], dir, bend?, up? }  near grip fist: its slot (rig.hands['hand-front-grip']) at screen point
//             (x forward, y down, feet at 0,0, before the pose's sx mirror; `off` = from the shoulder instead), blade pointing `dir` (screen degrees: 0 =
//             forward, -90 = up, 90 = down; unwrapped: a swing turns from one pose's dir to the next's the way the
//             numbers run). bend -1 = elbow the other way from the master's. up = the upper arm's direction to
//             unwrap next to (default dir: the arm follows the blade round).
//     shield: { at | off, turn = 0, bend? }  far fist's strap point; turn = the shield's tilt (degrees, + = top forward... as
//             drawn, clockwise) from the master.
//     feet:   { front: [x, lift, turn], back: [...] }  ankle x (screen px) and height off its planted height; turn =
//             the foot's tilt from flat (+ = toes down, facing right). Legs are bent by IK to put the ankles there.
//     anything else (pelvis, torso, head, dx, dy, tail, swap, '<part>.order', raw joints) passes through as given.
//   walkWaves(rig, opts): the walk's leg joints as waves (one per joint, rigs/*-poses.js format) fitted to IK on an
//     ankle path: planted sweep back at walk speed, lifted arc forward (3 harmonics each).
const D = Math.PI / 180;
const ang = (v) => Math.atan2(v[1], v[0]) / D;
const len = (v) => Math.hypot(v[0], v[1]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const turn = (deg, [x, y]) => { const c = Math.cos(deg * D), s = Math.sin(deg * D); return [x * c - y * s, x * s + y * c]; };
const near = (a, ref) => a + 360 * Math.round((ref - a) / 360);   // a, unwrapped to within 180 of ref
const wrap = (a) => near(a, 0);

// From a part's pivot to a child's attach point, in the part's own px (at rest 0 = the master pose).
const bone = (rig, child) => { const c = rig.parts[child], p = rig.parts[c.parent]; return sub(c.attach, p.pivot); };

// World turns (sum of joints up the chain) -> screen points of part pivots, feet at 0,0.
function placer(rig, j, R) {
  const at = {};
  const of = (n) => {
    if (at[n]) return at[n];
    const p = rig.parts[n];
    if (!p.parent) return (at[n] = [j.dx ?? 0, (j.dy ?? 0) - rig.rootY]);
    const o = of(p.parent), v = turn(R(p.parent), bone(rig, n));
    return (at[n] = [o[0] + rig.scale * v[0], o[1] + rig.scale * v[1]]);
  };
  return of;
}

// Two-bone IK: upper -> lower -> end, with the end part's world turn endR and its point `pt` (own px) on target T.
// Returns world turns for upper and lower. bend 1 = the master's elbow side.
function limb(rig, up, lo, end, S, T, endR, pt, bend = 1, ref) {
  const b1 = bone(rig, lo), b2 = bone(rig, end), k = rig.scale;
  const W = sub(T, turn(endR, [k * (pt[0] - rig.parts[end].pivot[0]), k * (pt[1] - rig.parts[end].pivot[1])]));
  const l1 = k * len(b1), l2 = k * len(b2), v = sub(W, S);
  const d = Math.max(Math.abs(l1 - l2) + 0.01, Math.min(l1 + l2 - 0.01, len(v)));
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))) / D;
  const side = -Math.sign(b1[0] * b2[1] - b1[1] * b2[0]) * bend || bend;
  const dir1 = near(ang(v) + side * a, ref ?? ang(b1));   // bone direction on screen, unwrapped next to ref
  const E = [S[0] + l1 * Math.cos(dir1 * D), S[1] + l1 * Math.sin(dir1 * D)];
  const dir2 = near(ang(sub(W, E)), dir1);
  return [dir1 - ang(b1), dir2 - ang(b2)];
}

export function pose(rig, spec) {
  const { hand, shield, feet, ...j } = spec;
  const R = { pelvis: j.pelvis ?? 0 };
  R.torso = R.pelvis + (j.torso ?? 0);
  const world = (n) => R[n] ?? 0, place = placer(rig, j, world), H = rig.hands;
  const target = (h, up) => h.at ?? [place(up)[0] + h.off[0], place(up)[1] + h.off[1]];
  if (hand) {
    const g = H['hand-front-grip'], endR = hand.dir - g.axis;
    [R['arm-front-upper'], R['arm-front-lower']] = limb(rig, 'arm-front-upper', 'arm-front-lower', 'hand-front',
      place('arm-front-upper'), target(hand, 'arm-front-upper'), endR, g.at, hand.bend, hand.up ?? hand.dir);
    j['arm-front-upper'] = R['arm-front-upper'] - R.torso;   // unwrapped too: the arm swings round the way the blade does
    j['arm-front-lower'] = R['arm-front-lower'] - R['arm-front-upper'];
    j['hand-front'] = endR - R['arm-front-lower'];   // unwrapped: the blade's world turn is exactly hand.dir
  }
  if (shield) {
    const g = H['hand-back-shield'], endR = shield.turn ?? 0;
    [R['arm-back-upper'], R['arm-back-lower']] = limb(rig, 'arm-back-upper', 'arm-back-lower', 'hand-back',
      place('arm-back-upper'), target(shield, 'arm-back-upper'), endR, g.at, shield.bend);
    j['arm-back-upper'] = wrap(R['arm-back-upper'] - R.torso);
    j['arm-back-lower'] = wrap(R['arm-back-lower'] - R['arm-back-upper']);
    j['hand-back'] = wrap(endR - R['arm-back-lower']);
  }
  for (const [side, v] of Object.entries(feet ?? {})) {
    const up = `leg-${side}-upper`, lo = `leg-${side}-lower`, ft = `foot-${side}`, [x, lift = 0, tilt = 0] = v;
    const y = planted(rig, ft) - lift;
    const [r1, r2] = limb(rig, up, lo, ft, place(up), [x, y], tilt, rig.parts[ft].pivot, 1);
    j[up] = wrap(r1 - R.pelvis); j[lo] = wrap(r2 - r1); j[ft] = wrap(tilt - r2);
  }
  for (const k of Object.keys(j)) if (typeof j[k] === 'number') j[k] = Math.round(j[k] * 100) / 100;
  return j;
}

// Screen y of a foot's ankle when it stands flat on the floor (the master's height above the feet line).
export function planted(rig, ft) {
  const of = placer(rig, {}, () => 0);
  return of(ft)[1];
}
// Screen point of a part's pivot in the master pose (feet at 0,0): where the master puts the ankles, hands, hips.
export const masterAt = (rig, part) => placer(rig, {}, () => 0)(part);

// Waves fitted to samples over one cycle: harmonics 1..H, as a list of waves that add up (rig-pose.js evalPose);
// the first carries the mean.
export function fitWave(vals, H = 3) {
  const N = vals.length, r = (x) => Math.round(x * 100) / 100, m = vals.reduce((a, v) => a + v, 0) / N, out = [];
  for (let h = 1; h <= H; h++) {
    let a = 0, b = 0;
    vals.forEach((v, i) => { const t = 2 * Math.PI * h * i / N; a += 2 * v * Math.sin(t) / N; b += 2 * v * Math.cos(t) / N; });
    out.push([h === 1 ? r(m) : 0, r(Math.hypot(a, b)), r((((Math.atan2(b, a) / (2 * Math.PI)) % 1) + 1) % 1), h]);
  }
  return out;
}

// Walk legs: speed cycles/s, walk px/s; each ankle sweeps back under its hip (planted half) and arcs forward lifted
// `lift` px (swing half); front and back half a cycle apart. dy = hips lowered (px). Returns waves (lists of harmonics) for the leg joints.
export function walkWaves(rig, { speed, walk, lift, dy = 0, reach = 0, N = 48 }) {
  const half = walk / speed / 4, hip = (s) => masterAt(rig, `leg-${s}-upper`)[0] + reach;
  const ankle = (s, u) => {
    if (u < 0.5) return [hip(s) + half - 4 * half * u, 0, 0];
    const k = (u - 0.5) * 2, e = k * k * (3 - 2 * k);
    return [hip(s) - half + 2 * half * e, lift * Math.sin(Math.PI * k), 8 * Math.sin(Math.PI * k)];
  };
  const out = {}, keys = ['leg-front-upper', 'leg-front-lower', 'foot-front', 'leg-back-upper', 'leg-back-lower', 'foot-back'];
  const series = Object.fromEntries(keys.map((k) => [k, []]));
  for (let i = 0; i < N; i++) {
    const u = i / N, j = pose(rig, { dy, feet: { front: ankle('front', u), back: ankle('back', (u + 0.5) % 1) } });
    for (const k of keys) series[k].push(near(j[k], series[k].at(-1) ?? j[k]));
  }
  for (const k of keys) out[k] = fitWave(series[k]);
  return out;
}
