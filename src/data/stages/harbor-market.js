// Stage: a single-screen arena for now. Coordinates are in the 960x540 view.
export default {
  id: 'harbor-market', name: 'Harbor Market',
  art: { src: 'assets/art/stages/harbor-market.png', x: -90, y: -40, w: 1140 },
  backdrop: { sky: ['#6fb0e6', '#d6ecf8'], horizon: 400, sea: ['#4d93c4', '#1c4f7c'] },
  floor: { left: 40, right: 920, top: 352, bottom: 440 },   // walkable belt (toggle debug with ` to see it)
  playerStart: { x: 260, y: 400 },
  // T006 test only: F cycles these (copied into art + floor live) so the user can pick a framing.
  framings: [
    { name: 'Old (before T006)', art: { x: -90, y: -40, w: 1140 }, floor: { left: 40, right: 920, top: 352, bottom: 440 } },
    { name: 'Same art, belt on open floor only (52 px)', art: { x: -90, y: -40, w: 1140 }, floor: { left: 75, right: 860, top: 377, bottom: 429 } },
    { name: 'B: mild zoom (63 px)', art: { x: -220, y: -113, w: 1400 }, floor: { left: 30, right: 930, top: 400, bottom: 463 } },
    { name: 'A: zoom (80 px)', art: { x: -410, y: -265, w: 1780 }, floor: { left: 30, right: 930, top: 387, bottom: 467 } },
    { name: 'C: big zoom (84 px)', art: { x: -460, y: -300, w: 1880 }, floor: { left: 30, right: 930, top: 388, bottom: 472 } },
  ],
  waves: [
    { enemies: ['rat-raider', 'rat-raider'] },
    { enemies: ['rat-raider', 'rat-raider', 'rat-raider'] },
    { enemies: ['rat-raider', 'rat-raider', 'rat-raider', 'rat-raider'] },
  ],
};
