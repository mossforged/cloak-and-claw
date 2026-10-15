// Stage: a single-screen arena for now. Coordinates are in the 960x540 view.
export default {
  id: 'harbor-market', name: 'Harbor Market',
  art: { src: 'assets/art/stages/harbor-market.png', x: -220, y: -113, w: 1400 },
  backdrop: { sky: ['#6fb0e6', '#d6ecf8'], horizon: 400, sea: ['#4d93c4', '#1c4f7c'] },
  floor: { left: 30, right: 930, top: 400, bottom: 463 },   // walkable belt: the open stone floor only (toggle debug with ` to see it)
  playerStart: { x: 260, y: 432 },
  waves: [
    { enemies: ['rat-raider', 'rat-raider'] },
    { enemies: ['rat-raider', 'rat-raider', 'rat-raider'] },
    { enemies: ['rat-raider', 'rat-raider', 'rat-raider', 'rat-raider'] },
  ],
};
