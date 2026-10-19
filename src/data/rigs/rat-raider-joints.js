// T034: the user's joint points for the rat's near arm and leg (Fitting Room, 2026-10-19; docs/design/rigs/joint-points-rat.json,
// view Q). Per joint, keyed by the moving part: `pivot` (on that part, its own image px), `attach` (on the parent, the parent's
// own px), the limits `lo` / `hi` (degrees from rest, + = clockwise on screen, rest = the angle as assembled at rest: joint 0
// on these points) and `front` (the user's draw order: true = the part draws over its parent). Applied by joint-points.js
// withJointPoints at the end of rat-raider.js (the spearman and archer spread that rig, so the whole rat body gets them).
// The other views keep their own shoulder / hip points and the back view its own limb cuts (joint-points.js); the far side
// keeps its old points.
// Switches (build time, so every pose authored on the rig follows): `points` false = the old (A023 r5) points and limits,
// for before / after sheets: `?joints=old` on any page, `--old-joints` on a Node tool. `order` = the joints whose `front`
// pick is applied (ORDER_PICKS below; default none: rig standard 5b.1 holds): `?order=his` / `--his-order` = the two the
// lead asked about (wrist, ankle), `?order=all` / `--his-order=all` = all six picks.
const Q = globalThis.location?.search ?? '', ARGV = globalThis.process?.argv ?? [];
const ORDER_ALL = /[?&]order=all\b/.test(Q) || ARGV.includes('--his-order=all');
const ORDER_TWO = /[?&]order=his\b/.test(Q) || ARGV.includes('--his-order');

export const RAT_JOINTS = {
  'arm-near-upper': { joint: 'shoulder-near', pivot: [102, 15], attach: [54.5, 33.5], lo: -61, hi: 59, front: true },
  'arm-near-lower': { joint: 'elbow-near', pivot: [51.2, 11.1], attach: [21.7, 118], lo: -73, hi: 5, front: false },
  'hand-near': { joint: 'wrist-near', pivot: [43.1, 6.3], attach: [24.9, 64.9], lo: -42, hi: 17, front: true },
  'leg-near-upper': { joint: 'hip-near', pivot: [79.7, 52.9], attach: [50.8, 105.1], lo: -23, hi: 25, front: true },
  'leg-near-lower': { joint: 'knee-near', pivot: [37.7, 16.7], attach: [48.7, 137.3], lo: -23, hi: 51, front: false },
  'foot-near': { joint: 'ankle-near', pivot: [35, 12.3], attach: [26.7, 66], lo: -19, hi: 40, front: true },
};

// The user's `front` picks as Q-view bands (only where they differ from the rig's: the hip already has the thigh over the
// pelvis). Wrist: the hand over the forearm's bracer (820). Ankle: the foot over the shin (520). With all six: the upper arm
// over the torso (822, the cap 830 still over it) and over its forearm (818), the hand over both (825), the thigh over the
// shin (505) and the foot over the shin (507).
const ORDER_PICKS = {
  'wrist-near': { 'hand-near': 825 },
  'ankle-near': { 'foot-near': 525 },
  'shoulder-near': { 'arm-near-upper': 822 },
  'elbow-near': { 'arm-near-lower': 818 },
  'knee-near': { 'leg-near-lower': 505, 'foot-near': 507 },
};
const ALL_ORDER = ['shoulder-near', 'elbow-near', 'wrist-near', 'knee-near', 'ankle-near'];

export const JOINT_SWITCH = {
  points: !/[?&]joints=old\b/.test(Q) && !ARGV.includes('--old-joints'),
  order: ORDER_ALL ? ALL_ORDER : ORDER_TWO ? ['wrist-near', 'ankle-near'] : [],
};

// bands for the picked joints (with the knee picked, the ankle's foot goes under the thigh with its shin: 507)
export const orderPicks = (joints) => Object.assign({}, ...joints.map((j) => ORDER_PICKS[j] ?? {}),
  joints.includes('knee-near') ? ORDER_PICKS['knee-near'] : {});

// The rat body's rigs (one body, one set of points and limits)
export const RAT_BODY = ['rat-raider', 'rat-spearman', 'rat-archer'];
// [lo, hi] per part, on the switch (data/wrists.js and data/pose-limits.js read them)
export const RAT_RANGES = JOINT_SWITCH.points ? Object.fromEntries(Object.entries(RAT_JOINTS).map(([p, j]) => [p, [j.lo, j.hi]])) : null;
