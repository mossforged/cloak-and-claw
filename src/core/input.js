// Keyboard + gamepads -> one control object per player slot per sim step (T021; mapping in core/slots.js).
// readControls() = [slot0, slot1, slot2]; slot 0 = keyboard + first gamepad, as before:
// { mx, my, attack, jump, grab, start, debug, pause, rig, cast, block, blockTap }  (mx/my are -1..1; buttons are "pressed this step",
// except block = held; blockTap = block pressed this step, used as the run-log download on the game-over screen)
import { keyAction, readSlots } from './slots.js';

const held = new Set();      // key codes held
const pressed = new Set();   // key codes pressed since last read
const padPrev = [];          // per slot: pad buttons last step

export function initInput() {
  addEventListener('keydown', (e) => {
    if (!keyAction(e.code)) return;
    e.preventDefault();
    if (!e.repeat) pressed.add(e.code);
    held.add(e.code);
  });
  addEventListener('keyup', (e) => held.delete(e.code));
  addEventListener('blur', () => held.clear());
}

export function readControls() {
  const out = readSlots(held, pressed, navigator.getGamepads?.() ?? [], padPrev);
  pressed.clear();
  return out;
}

