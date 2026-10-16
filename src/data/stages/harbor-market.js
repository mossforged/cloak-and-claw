// Stage: a single-screen arena for now. Coordinates are in the 960x540 view.
export default {
  id: 'harbor-market', name: 'Harbor Market',
  art: { src: 'assets/art/stages/harbor-market.png', x: -220, y: -113, w: 1400 },
  backdrop: { sky: ['#6fb0e6', '#d6ecf8'], horizon: 400, sea: ['#4d93c4', '#1c4f7c'] },
  floor: { left: 30, right: 930, top: 400, bottom: 463 },   // walkable belt: the open stone floor only (toggle debug with ` to see it)
  playerStart: { x: 260, y: 432 },
  heroStarts: [{ x: 260, y: 432 }, { x: 200, y: 410 }, { x: 200, y: 456 }],   // T021: per player slot (slot 0 = playerStart), staggered in depth
  // breakables (data/props): type, x, y on the belt; drops overrides the prop's own (item id, { id: weight } or null)
  props: [
    { type: 'crate', x: 470, y: 412, drops: 'plank-club' },
    { type: 'crate', x: 640, y: 454 },
    { type: 'barrel', x: 800, y: 414, drops: 'big-fish' },
  ],
  waves: [
    { enemies: ['rat-raider', 'rat-raider'] },
    { enemies: ['rat-raider', 'rat-raider', 'rat-spearman'] },               // T011: the spearman joins in wave 2
    { enemies: ['rat-raider', 'rat-spearman', 'rat-raider', 'rat-archer'] },   // and an archer in wave 3
  ],
};
