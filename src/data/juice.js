// Feel tuning for render-side effects. Per-move hitstop/shake live on each move.
export const JUICE = {
  shake: { decay: 0.82, max: 16 },
  flashFrames: 5,                          // white flash on the target when hit
  numbers: { life: 48, rise: 1.1, font: '26px "Lilita One", sans-serif' },
  sparks: { count: 10, speed: 5, life: 16 },
  dust: { count: 8, life: 24 },
  slash: { life: 9, width: 14, color: 'rgba(255,255,240,0.95)', edge: 'rgba(255,214,110,0.9)' },
  koHitstop: 6, koShake: 6, heavyLandShake: 3,
};
