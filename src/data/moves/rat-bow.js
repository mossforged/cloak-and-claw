// Rat Archer moves (T011): draw (windup = the telegraph, the string comes back to his cheek), loose (the arrow leaves on
// the first active frame), recover. No hitbox: the arrow (sim/shots.js) does the hitting.
// shot: art (img, px; T020 A012 arrow drawn pointing right: nock and tip points), speed px/frame along his facing, z = flight height, depth = lane
//   half-width (y) it hits in, range px it flies before dropping, damage/knockback/hitstun/hitstop/shake on a hit.
export const RAT_BOW = {
  bowShot: {
    windup: 42, active: 4, recovery: 30,
    shot: { art: { img: 'assets/art/items/rat-arrow.png', px: 0.29, nock: [8.04, 16.32], tip: [245.16, 16.08] }, x: 34, z: 62, speed: 7, depth: 12, range: 560,
      damage: 8, knockback: 3, hitstun: 18, hitstop: 5, shake: 3 },
    pose: { windup: { rot: -0.06, sx: 0.97, sy: 1.02, dx: -4 }, active: { rot: 0.04, sx: 1.03, sy: 0.98, dx: 2 } },
    fx: { telegraph: true },
  },
};
