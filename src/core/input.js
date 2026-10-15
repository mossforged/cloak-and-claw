// Keyboard + gamepad -> one control object per sim step:
// { mx, my, attack, jump, start, debug, pause, rig, alt }  (mx/my are -1..1; buttons are "pressed this step")
import { KEYS, PAD } from '../data/controls.js';

const held = new Set();      // key codes held
const pressed = new Set();   // action names pressed since last read
let padPrev = {};

export function initInput() {
  addEventListener('keydown', (e) => {
    const action = KEYS[e.code];
    if (!action) return;
    e.preventDefault();
    if (!e.repeat) pressed.add(action);
    held.add(e.code);
  });
  addEventListener('keyup', (e) => held.delete(e.code));
  addEventListener('blur', () => held.clear());
}

const isHeld = (action) => [...held].some((c) => KEYS[c] === action);

function readPad(ctl) {
  const pad = navigator.getGamepads?.().find((p) => p);
  if (!pad) return;
  const [ax, ay] = pad.axes;
  if (Math.abs(ax) > PAD.deadzone) ctl.mx = Math.sign(ax);
  if (Math.abs(ay) > PAD.deadzone) ctl.my = Math.sign(ay);
  const b = (i) => pad.buttons[i]?.pressed;
  if (b(14)) ctl.mx = -1; if (b(15)) ctl.mx = 1; if (b(12)) ctl.my = -1; if (b(13)) ctl.my = 1;
  for (const action of ['attack', 'jump', 'start']) {
    const now = PAD[action].some(b);
    if (now && !padPrev[action]) ctl[action] = true;
    padPrev[action] = now;
  }
}

export function readControl() {
  const ctl = {
    mx: (isHeld('right') ? 1 : 0) - (isHeld('left') ? 1 : 0),
    my: (isHeld('down') ? 1 : 0) - (isHeld('up') ? 1 : 0),
  };
  for (const a of ['attack', 'jump', 'start', 'debug', 'pause', 'rig', 'alt']) ctl[a] = pressed.has(a);
  pressed.clear();
  readPad(ctl);
  return ctl;
}
