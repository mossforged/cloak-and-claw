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
  KeyC: 'cast',  // view only: hold the rig's `cast` test pose (press again to release)
  KeyL: 'log',   // download stored run logs as JSON
  KeyF: 'framing',   // T006 test: cycle stage framings (art placement + floor belt)
};
// Standard gamepad button indexes (Xbox layout: 0=A 1=B 2=X 3=Y 9=Start).
export const PAD = { attack: [2, 1], jump: [0], start: [9], deadzone: 0.35 };
