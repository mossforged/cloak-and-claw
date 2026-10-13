// Stage: a single-screen arena for now. Coordinates are in the 960x540 view.
export default {
  id: 'harbor-market', name: 'Harbor Market',
  art: { src: 'assets/art/stages/harbor-market.png', x: -90, y: -40, w: 1140 },
  backdrop: { sky: ['#6fb0e6', '#d6ecf8'], horizon: 400, sea: ['#4d93c4', '#1c4f7c'] },
  floor: { left: 40, right: 920, top: 352, bottom: 440 },   // walkable belt (toggle debug with ` to see it)
  playerStart: { x: 260, y: 400 },
  waves: [
    { enemies: ['rat-raider', 'rat-raider'] },
    { enemies: ['rat-raider', 'rat-raider', 'rat-raider'] },
    { enemies: ['rat-raider', 'rat-raider', 'rat-raider', 'rat-raider'] },
  ],
};
