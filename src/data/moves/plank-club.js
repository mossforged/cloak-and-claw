// Plank club moves (floor weapon kit, T010): slow and heavy. Big knockback; the second swing knocks down.
// launch: knockdown speed {vx, vz} instead of RULES.knockdown's (bigger = flies further).
// T017 view only: fx.dust = dust puffs at the target's feet on a hit; fx.shake = screen shake added to the move's own.
export const PLANK_CLUB = {
  club1: {
    rig: 'slash1', windup: 10, active: 5, recovery: 16, comboFrom: 3, next: 'club2',
    damage: 10, hitbox: { x: 8, z: 25, w: 92, h: 80 }, knockback: 6, hitstun: 24,
    hitstop: 7, shake: 5, lunge: 2,
    pose: { windup: { rot: -0.2, sx: 0.94, sy: 1.06, dx: -7 }, active: { rot: 0.24, sx: 1.1, sy: 0.92, dx: 9 } },
    fx: { slash: { r: 58, from: -120, to: 40, cx: 26, cz: 62, big: true }, dust: 7, shake: 2 },
  },
  club2: {
    rig: 'slash3', windup: 13, active: 5, recovery: 22,
    damage: 14, knockdown: true, launch: { vx: 7, vz: 7 }, hitbox: { x: 5, z: 15, w: 100, h: 95 }, knockback: 6,
    hitstop: 11, shake: 10, lunge: 3,
    pose: { windup: { rot: -0.3, sx: 0.9, sy: 1.1, dx: -9 }, active: { rot: 0.36, sx: 1.14, sy: 0.88, dx: 13 } },
    fx: { slash: { r: 76, from: -170, to: 80, cx: 26, cz: 46, big: true }, dust: 10, shake: 3 },
  },
};
