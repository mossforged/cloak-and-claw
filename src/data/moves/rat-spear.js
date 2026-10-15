// Rat Spearman moves (T011): one long thrust. Longest telegraph of the rats (he draws the spear back to the hip), then a
// straight jab with far reach; little lunge, so it's the reach that catches you. Escapable at reaction time (tests/rat-kits).
export const RAT_SPEAR = {
  spearThrust: {
    windup: 40, active: 6, recovery: 32,
    damage: 10, hitbox: { x: 40, z: 40, w: 115, h: 36 }, knockback: 4, hitstun: 22,
    hitstop: 7, shake: 5, lunge: 0.9, depth: 14,
    pose: { windup: { rot: -0.1, sx: 0.95, sy: 1.04, dx: -10 }, active: { rot: 0.05, sx: 1.04, sy: 0.97, dx: 4 } },
    fx: { slash: { r: 150, from: -4, to: 4, cx: -60, cz: 58, flat: 0.15 }, telegraph: true },
  },
};
