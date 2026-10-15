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
  KeyC: 'cast',  // view only: play the rig's `cast` test pose once (from idle, ~1 s)
  KeyL: 'block', // hold to block; on the game-over screen a press downloads the stored run logs
  KeyH: 'grab',  // grab the rat in front of you (T009)
  KeyF: 'squat', // T014 test: cycle the jump squat off / A / B (label under the build line)
};
// Standard gamepad button indexes (Xbox layout: 0=A 1=B 2=X 3=Y 9=Start).
export const PAD = { attack: [2, 1], jump: [0], start: [9], block: [5], grab: [3], deadzone: 0.35 };   // 5 = RB, 3 = Y
