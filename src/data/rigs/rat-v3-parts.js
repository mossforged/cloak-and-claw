// DRAFT rig from assets/source/A027-rat-v3-body/rig-source.json (tools/rig_from_source.py, T016). Images keyed into assets/art/enemies/rat-raider/rig-v3 at x0.4.
// Points are in each image's own px; rest 0 = the master pose (rig bench convention). Write its poses before use.
const P = 'assets/art/enemies/rat-raider/rig-v3/';

export default {
  id: 'rat-v3',
  scale: 0.25185,
  rootY: 51.217,
  parts: {
    'tail-3': { img: P + 'tail-3.png', parent: 'tail-2', attach: [15.2, 52.4], pivot: [48.4, 33.2], order: 100 },
    'tail-2': { img: P + 'tail-2.png', parent: 'tail', attach: [10.0, 87.2], pivot: [52.4, 10.0], order: 140 },
    'tail': { img: P + 'tail.png', parent: 'pelvis', attach: [6.4, 69.6], pivot: [52.4, 9.6], order: 180 },
    'scarf-tail': { img: P + 'scarf-tail.png', parent: 'torso', attach: [21.12, 71.68], pivot: [133.52, 92.88], order: 220 },
    'arm-far-upper': { img: P + 'arm-far-upper.png', parent: 'torso', attach: [166.0, 62.4], pivot: [9.6, 10.8], order: 300 },
    'arm-far-lower': { img: P + 'arm-far-lower.png', parent: 'arm-far-upper', attach: [32.56, 65.92], pivot: [18.16, 17.52], order: 260 },
    'hand-far': { img: P + 'hand-far.png', parent: 'arm-far-lower', attach: [57.76, 61.6], pivot: [26.56, 23.2], order: 340 },
    'leg-far-lower': { img: P + 'leg-far-lower.png', parent: 'leg-far-upper', attach: [82.96, 86.8], pivot: [48.16, 17.6], order: 380 },
    'foot-far': { img: P + 'foot-far.png', parent: 'leg-far-lower', attach: [11.92, 91.2], pivot: [28.72, 14.0], order: 420 },
    'leg-far-upper': { img: P + 'leg-far-upper.png', parent: 'pelvis', attach: [140.16, 57.36], pivot: [38.56, 30.96], order: 460 },
    'pelvis': { img: P + 'pelvis.png', pivot: [108.88, 40.24], order: 500 },
    'leg-near-lower': { img: P + 'leg-near-lower.png', parent: 'leg-near-upper', attach: [63.68, 86.0], pivot: [51.68, 27.6], order: 540 },
    'foot-near': { img: P + 'foot-near.png', parent: 'leg-near-lower', attach: [26.88, 82.8], pivot: [34.08, 17.6], order: 580 },
    'leg-near-upper': { img: P + 'leg-near-upper.png', parent: 'pelvis', attach: [42.56, 54.24], pivot: [66.56, 12.24], order: 620 },
    'seat': { img: P + 'seat.png', parent: 'pelvis', attach: [42.56, 54.24], pivot: [50.56, 31.84], order: 660 },
    'torso': { img: P + 'torso.png', parent: 'pelvis', attach: [108.88, 40.24], pivot: [105.28, 167.04], order: 700 },
    'belt': { img: P + 'belt.png', parent: 'pelvis', attach: [108.88, 40.24], pivot: [118.48, 51.44], order: 740 },
    'head': { img: P + 'head.png', parent: 'torso', attach: [123.04, 49.2], pivot: [139.84, 218.8], order: 780 },
    'arm-near-upper': { img: P + 'arm-near-upper.png', parent: 'torso', attach: [21.12, 71.68], pivot: [77.12, 74.08], order: 820 },
    'arm-near-lower': { img: P + 'arm-near-lower.png', parent: 'arm-near-upper', attach: [34.56, 114.24], pivot: [55.76, 11.84], order: 860 },
    'hand-near': { img: P + 'hand-near.png', parent: 'arm-near-lower', attach: [24.48, 61.44], pivot: [41.68, 29.04], order: 900 },
  },
  limits: { 'arm-near-upper': [-116, 67], 'arm-near-lower': [-113, 5], 'hand-near': [-49, 9], 'leg-near-upper': [-23, 34], 'leg-near-lower': [-23, 87], 'foot-near': [-1, 40], 'head': [-20, 61], 'torso': [-4, 15], 'arm-far-upper': [-116, 76], 'arm-far-lower': [0, 124], 'hand-far': [0, 59], 'leg-far-upper': [-23, 34], 'leg-far-lower': [-23, 70], 'foot-far': [-19, 40], 'tail': [-40, 40], 'tail-2': [-40, 40], 'tail-3': [-3, 7] },
  sockets: { hand_near: { part: 'hand-near', at: [39.32, 40.8] }, hand_far: { part: 'hand-far', at: [28.95, 45.54] }, chest: { part: 'torso', at: [114.16, 108.12] }, head_top: { part: 'head', at: [79.73, 0.0] }, mouth: { part: 'head', at: [315.2, 184.52] }, tail_tip: { part: 'tail-3', at: [3.2, 4.0] }, feet: { parts: ['foot-near', 'foot-far'] }, weapon_tip: { item: 'tip' } },
};
