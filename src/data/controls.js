// Key and gamepad bindings -> action names. Player slots (T021, core/slots.js): slot 0 = KEYS + the first connected
// gamepad; slots 1 and 2 = the second and third gamepads. KEYS2 (arrows + numpad) is an optional second keyboard
// player on slot 1, off by default (KEYBOARD2.on, or ?keys2 in the URL); while on, its keys leave slot 0.
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
  KeyH: 'grab',  // grab the rat in front of you (T009); hold next to a downed friend to pick him up (T022)
  KeyU: 'use',   // T022: tap = toss your potion to an ally, hold = drink it
};
export const KEYS2 = {
  ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
  Numpad1: 'attack', Numpad2: 'jump', Numpad3: 'grab', Numpad4: 'use', Numpad0: 'block', NumpadEnter: 'start',
};
export const KEYBOARD2 = { on: false };
// Standard gamepad button indexes (Xbox layout: 0=A 1=B 2=X 3=Y 9=Start).
export const PAD = { attack: [2, 1], jump: [0], start: [9], block: [5], grab: [3], use: [4], deadzone: 0.35 };   // 5 = RB, 3 = Y, 4 = LB
