// Joint checker numbers (T036: tools/joint-check.mjs, tools/bench/joint-check.js). All lengths in source canvas px (the
// master's px; the rat is ~1900 px tall there, ~14 canvas px = 1 game px at 130 px tall). Calibrated on A027 r1 (neck at
// +10..+20 and the near-shoulder notch flagged), A027 r2 (neck passes) and A026 r3 (wrist and ankle pass, user-accepted):
// `node tools/joint-check-calibrate.mjs` -> docs/screens/T036/calibration.md (the numbers each case got).
export const JOINT_CHECK = {
  samples: 9,                       // angles per joint, evenly over its range (ends included)
  key: { solid: 60 },               // green-keyed RGB: opaque where g - max(r, b) < solid (key_green.py's half-alpha point)
  window: { factor: 0.9, min: 60, max: 220 },   // check radius R round the joint point = the turning piece's width there x factor
  // notch: transparent px filled by closing the union (disc radius `close`) inside R, new vs rest; flag one >= min px
  // (A027 r1 shoulder notch 851 at +28; accepted: A027 r2 neck 176, A026 r3 wrist 133)
  gap: { close: 10, min: 250 },
  // breakup: detached visible bits of the join's pieces (new vs rest, each <= max px), the thin ones (<= `thin` px thick,
  // >= floor px) added up per sample; flag when the total >= perR x R (accepted A026 r3 ankle: 0.98 R)
  fragment: { floor: 4, thin: 3, max: 4000, perR: 1.2 },
  // seam: the covered piece's dark px (luminance < dark) within `near` px of the piece covering it across the join, not
  // within `edge` px of the outside, new vs rest; bits >= floor px added up per sample; flag when the total >= perR x R
  // (A027 r1 neck +10: 5.8 R; accepted: A027 r2 neck 2.6 R, A026 r3 wrist 1.6 R)
  seam: { dark: 70, near: 4, edge: 3, floor: 20, perR: 4 },
  island: { min: 30, grow: 2 },     // a PNG's own detached islands (8-connected, after growing `grow` px), >= min px
  crop: { px: 300 },                // contact sheet cell (the window scaled to fit)
  // the piece that turns at a joint when several share its point (seat, belt, scarf ride their parent)
  turns: {
    neck: 'head', waist: 'torso', 'tail-root': 'tail-1', 'tail-mid': 'tail-2', 'tail-end': 'tail-3',
    'shoulder-near': 'arm-near-upper', 'elbow-near': 'arm-near-lower', 'wrist-near': 'hand-near',
    'hip-near': 'leg-near-upper', 'knee-near': 'leg-near-lower', 'ankle-near': 'foot-near',
    'shoulder-far': 'arm-far-upper', 'elbow-far': 'arm-far-lower', 'wrist-far': 'hand-far',
    'hip-far': 'leg-far-upper', 'knee-far': 'leg-far-lower', 'ankle-far': 'foot-far',
  },
};
