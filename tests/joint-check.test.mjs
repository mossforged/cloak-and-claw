// T036 joint checker (tools/joint-check.mjs) on a tiny synthetic rig: a parent square and a child bar turning at a pivot.
// A round cap on the child = a clean joint (passes); a flat-ended child = a gap; a thin scrap of hidden parent paint
// under the child = a fragment (and a PNG island); a hidden dark line in the parent under the child = a seam.
// Plus the JPEG writer and the masks helpers.
import { loadRig, pieceIslands } from '../tools/bench/joint-rig.js';
import { checkJoint } from '../tools/bench/joint-check.js';
import { summarize } from '../tools/bench/joint-report.js';
import { contactSheet } from '../tools/bench/joint-sheet.js';
import { encodeJpeg } from '../tools/bench/jpeg.mjs';
import { edt, close, components } from '../tools/bench/masks.js';
import { JOINT_CHECK } from '../src/data/joint-check.js';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const W = 140, H = 120, PIVOT = [60, 60];
// the rat's numbers scaled to a ~40 px limb
const cfg = { ...JOINT_CHECK, window: { factor: 0.9, min: 20, max: 60 }, gap: { close: 4, min: 15 },
  fragment: { ...JOINT_CHECK.fragment, floor: 3, perR: 0.3 }, seam: { ...JOINT_CHECK.seam, floor: 4, perR: 0.3 }, island: { min: 4, grow: 1 } };

// painter: an image of W x H, either RGBA on transparent or RGB on #00FF00 (green = true)
function image(paint, green = false) {
  const rgba = new Uint8Array(W * H * 4);
  for (let i = 0; i < W * H; i++) rgba.set(green ? [0, 255, 0, 255] : [0, 0, 0, 0], i * 4);
  const put = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) rgba.set([...c, 255], (y * W + x) * 4); };
  paint(put);
  return { w: W, h: H, rgba };
}
const LIGHT = [200, 150, 100], DARK = [20, 15, 10];
const rect = (put, x0, y0, x1, y1, c = LIGHT) => { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) put(x, y, c); };
const disc = (put, [cx, cy], r, c = LIGHT) => { for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) put(x, y, c); };

function rigOf({ parent, child, green = false }) {
  const imgs = { 'p.png': image(parent, green), 'c.png': image(child, green) };
  const src = { parts: {
    'arm-near-upper': { img: 'p.png', parent: null, pivot: [30, 60], pivotPoint: 'shoulder-near', band: 1 },
    'arm-near-lower': { img: 'c.png', parent: 'arm-near-upper', pivot: PIVOT, pivotPoint: 'elbow-near', band: 2 },
  }, points: { 'elbow-near': PIVOT }, limits_deg: { 'shoulder-near': [-10, 10], 'elbow-near': [-25, 25] } };
  return loadRig(src, { read: (p) => imgs[p], resolve: (p) => p, cfg });
}
const run = (spec) => {
  const rig = rigOf(spec), results = rig.joints.map((j) => checkJoint(rig, j, cfg)), islands = pieceIslands(rig, cfg);
  return { rig, results, islands, ...summarize(results, islands, rig.notes) };
};
const parent = (put) => rect(put, 20, 42, 62, 78);
const capped = (put) => { rect(put, 60, 44, 120, 76); disc(put, PIVOT, 16); };

// clean: the child's round cap centred on the pivot, everything else plain (green-keyed source)
const clean = run({ parent, child: capped, green: true });
const el = clean.report.joints['elbow-near'];
check(clean.rig.joints.length === 1 && clean.rig.notes.length === 1, `one joint checked, the root shoulder skipped (${clean.rig.notes})`);
check(clean.report.pass, `clean joint passes: ${clean.lines.join(' / ')}`);
check(el && el.angles.length === 9 && el.angles[0] === -25 && el.angles[8] === 25, 'nine samples over the range, ends included');

// gap: a flat-ended child (no cap) opens a notch on the outside of the bend
const gap = run({ parent, child: (put) => rect(put, 60, 44, 120, 76) });
check(!gap.report.joints['elbow-near'].gap.pass, `flat child end flags a gap: ${gap.lines.join(' / ')}`);
const gw = gap.report.joints['elbow-near'].gap.worst;
check(gw && Math.abs(gw.deg) === 25, `the gap is worst at the range ends (${gw?.deg})`);

// fragment: a thin detached scrap of parent paint hidden under the child shows as it turns
const scrap = (put) => { parent(put); rect(put, 70, 50, 100, 52); rect(put, 70, 68, 100, 70); };
const frag = run({ parent: scrap, child: capped });
check(!frag.report.joints['elbow-near'].fragment.pass, `hidden scrap flags a fragment: ${frag.lines.join(' / ')}`);
check(frag.islands.some((i) => i.part === 'arm-near-upper' && i.px === 60), `the scrap is also a PNG island (${frag.islands.map((i) => `${i.part} ${i.px}`)})`);
check(!clean.islands.length, 'clean pieces have no islands');

// seam: the parent's own outline drawn on under the child's cap shows beside it as it turns
const lined = (put) => { parent(put); rect(put, 62, 30, 82, 90); rect(put, 74, 30, 76, 90, DARK); };
const seam = run({ parent: lined, child: capped });
check(!seam.report.joints['elbow-near'].seam.pass, `hidden dark line flags a seam: ${seam.lines.join(' / ')}`);
check(seam.report.joints['elbow-near'].gap.pass && seam.report.joints['elbow-near'].fragment.pass, 'the seam case flags only the seam');

// contact sheet + JPEG
const sheet = contactSheet(seam.rig, seam.results, seam.report, { islands: seam.islands, cfg });
const jpg = encodeJpeg(sheet.w, sheet.h, sheet.rgb, 80);
check(jpg[0] === 0xff && jpg[1] === 0xd8 && jpg.at(-2) === 0xff && jpg.at(-1) === 0xd9 && jpg.length > 1000, 'contact sheet encodes as a JPEG');

// masks: distance transform and closing
const m = new Uint8Array(25); m[12] = 1;
const d = edt(m, 5, 5);
check(d[12] === 0 && d[0] === 8 && d[2] === 4, `edt squared distances (${d[0]}, ${d[2]})`);
const slot = new Uint8Array(15 * 15); for (let i = 0; i < slot.length; i++) slot[i] = i % 15 === 7 ? 0 : 1;
check(close(slot, 15, 15, 2)[7 * 15 + 7] === 1, 'closing fills a 1 px slot');
check(components(slot, 15, 15, false).length === 2, 'two 4-connected halves either side of the slot');

for (const [n, r] of Object.entries({ clean, gap, frag, seam })) console.log(`${n}: ${r.lines[0]}`);
console.log(failed ? `${failed} failed` : 'joint-check: all passed');
process.exit(failed ? 1 : 0);
