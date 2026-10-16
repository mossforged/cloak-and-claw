// Rat cutlass moves (a floor weapon's kit, T010): faster than the sword, a three-cut combo that knocks down on the third.
// Same fields as moves/mouse-sword.js (T017: swooshes tighter than the sword's: smaller r and arc, the quick blade); rig: which rig move pose the swing borrows (rigs/*-poses.js `moves`).
export const CUTLASS = {
  cut1: {
    rig: 'slash1', windup: 3, active: 4, recovery: 9, comboFrom: 1, next: 'cut2',
    damage: 7, hitbox: { x: 10, z: 30, w: 84, h: 70 }, knockback: 2.5, hitstun: 16,
    hitstop: 3, shake: 2, lunge: 1.8,
    pose: { windup: { rot: -0.12, sx: 0.96, sy: 1.03, dx: -4 }, active: { rot: 0.16, sx: 1.07, sy: 0.95, dx: 7 } },
    fx: { slash: { r: 48, from: -80, to: 30, cx: 28, cz: 62 } },
  },
  cut2: {
    rig: 'slash2', windup: 3, active: 4, recovery: 10, comboFrom: 1, next: 'cut3',
    damage: 7, hitbox: { x: 10, z: 20, w: 86, h: 70 }, knockback: 2.5, hitstun: 16,
    hitstop: 3, shake: 2, lunge: 1.8,
    pose: { windup: { rot: 0.05, sx: 1.03, sy: 0.97, dx: -3 }, active: { rot: 0.1, sx: 1.06, sy: 0.96, dx: 6, dy: 2 } },
    fx: { slash: { r: 58, from: 160, to: 390, cx: 8, cz: 60, flat: 0.26, wrap: true } },
  },
  cut3: {
    rig: 'slash3', windup: 6, active: 4, recovery: 16,
    damage: 11, knockdown: true, hitbox: { x: 5, z: 15, w: 98, h: 90 }, knockback: 4,
    hitstop: 8, shake: 7, lunge: 3,
    pose: { windup: { rot: -0.24, sx: 0.93, sy: 1.07, dx: -7 }, active: { rot: 0.3, sx: 1.1, sy: 0.9, dx: 11 } },
    fx: { slash: { r: 58, from: -110, to: 50, cx: 26, cz: 60 } },
  },
};
