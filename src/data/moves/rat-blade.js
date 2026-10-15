// Rat Raider moves. Long windup = readable telegraph the player can interrupt.
export const RAT_BLADE = {
  ratSlash: {
    windup: 34, active: 5, recovery: 28,
    damage: 8, hitbox: { x: 10, z: 30, w: 70, h: 70 }, knockback: 3, hitstun: 20,
    hitstop: 6, shake: 5, lunge: 1.2,
    pose: { windup: { rot: -0.22, sx: 0.93, sy: 1.07, dx: -8 }, active: { rot: 0.24, sx: 1.1, sy: 0.93, dx: 10 } },
    fx: { slash: { r: 50, from: -120, to: 30, cx: 24, cz: 64 }, telegraph: true },
  },
};
