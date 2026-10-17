// Walk variants for tools/walk-lab.html (T023 round 3). legs = walkWaves options (walk speed comes from the fighter);
// pose = the upper body's waves (rigs/*-poses.js format; it also holds the legs' `body` channels). game: true = the
// game's own walk (rigs/mouse-fighter-poses.js), drawn as is.
const ARMS = { 'arm-front-upper': [4, 9, 0.5], 'arm-front-lower': [0, 6, 0.6], 'arm-back-upper': [0, 7, 0], 'hand-back': [0, 3, 0.1],
  tail: [5, 12, 0.25], 'scarf-tail': [-4, 4, 0.4, 2], 'scarf-tail-2': [-18, 8, 0.6, 2] };
const narrow = (psx, legs, up) => ({ legs: { ...legs, body: { 'pelvis.sx': psx } }, pose: { ...ARMS, 'pelvis.sx': psx, ...up } });
export const VARIANTS = {
  A: { label: 'round 2 (wide hips, crouched)', legs: { speed: 2.1, lift: 6, dy: 6, gather: 0.6 },
    pose: { ...ARMS, dy: [6, 1, 0.75, 2], torso: [4, 1.5, 0, 2], head: [-4, 1.5, 0.1, 2] } },
  B: { label: 'IN GAME: hips together, upright, 2.6 strides/s', game: true },
  C: { label: 'hips together, bouncier, slower 2.2', ...narrow(0.3, { speed: 2.2, lift: 8, dy: 4, stride: 28 },
    { dy: [4, 1.8, 0.75, 2], torso: [-2, 2, 0, 2], head: [2, 2, 0.1, 2] }) },
  D: { label: 'hips together, low as round 2', ...narrow(0.4, { speed: 2.1, lift: 6, dy: 6 },
    { dy: [6, 1, 0.75, 2], torso: [4, 1.5, 0, 2], head: [-4, 1.5, 0.1, 2] }) },
};
