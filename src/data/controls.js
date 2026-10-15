// Key and gamepad bindings -> action names.
export const KEYS = {
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  KeyJ: 'attack', KeyZ: 'attack',
  KeyK: 'jump', KeyX: 'jump', Space: 'jump',
  Backquote: 'debug', KeyP: 'pause', Enter: 'start',
  KeyR: 'rig',   // view only: toggle cutout rig vs standee
  KeyV: 'alt',   // view only: A/B a rig move variant (rigs/*-poses.js alt)
};
// Standard gamepad button indexes (Xbox layout: 0=A 1=B 2=X 3=Y 9=Start).
export const PAD = { attack: [2, 1], jump: [0], start: [9], deadzone: 0.35 };
