// Player slots (T021): key codes and gamepads -> one control object per slot. Pure (runs in Node); input.js feeds it.
// Slot 0 = KEYS + the first connected pad (exactly the old single-player controls); slots 1, 2 = the second and third
// pads. The optional second keyboard layout (KEYS2, KEYBOARD2.on) drives slot 1 and takes its keys away from slot 0.
// A control: { mx, my, attack, jump, grab, start, block, blockTap, grabHeld, use } (+ debug pause rig cast on slot 0). mx/my -1..1;
// buttons = pressed this step, block = held, blockTap = block pressed this step; T022: grabHeld = grab held, use = use
// held (both also true on the step of a press, so a tap shorter than a step still counts once).
import { KEYS, KEYS2, KEYBOARD2, PAD } from '../data/controls.js';

export const SLOTS = 3;
const BUTTONS = ['attack', 'jump', 'grab', 'start'];
const VIEW_KEYS = ['debug', 'pause', 'rig', 'cast'];

// [slot, action] a key code drives, or null.
export function keyAction(code, two = KEYBOARD2.on) {
  if (two && KEYS2[code]) return [1, KEYS2[code]];
  return KEYS[code] ? [0, KEYS[code]] : null;
}

function fromKeys(slot, held, pressed, two) {
  const has = (codes, action) => [...codes].some((c) => { const k = keyAction(c, two); return k && k[0] === slot && k[1] === action; });
  const ctl = { mx: (has(held, 'right') ? 1 : 0) - (has(held, 'left') ? 1 : 0), my: (has(held, 'down') ? 1 : 0) - (has(held, 'up') ? 1 : 0) };
  for (const a of slot === 0 ? [...BUTTONS, ...VIEW_KEYS] : BUTTONS) ctl[a] = has(pressed, a);
  ctl.block = has(held, 'block');
  ctl.blockTap = has(pressed, 'block');
  ctl.grabHeld = ctl.grab || has(held, 'grab');
  ctl.use = has(held, 'use') || has(pressed, 'use');
  return ctl;
}

// One pad onto a slot's control (prev = that pad's buttons last step, updated).
export function padInto(ctl, pad, prev) {
  const [ax, ay] = pad.axes;
  if (Math.abs(ax) > PAD.deadzone) ctl.mx = Math.sign(ax);
  if (Math.abs(ay) > PAD.deadzone) ctl.my = Math.sign(ay);
  const b = (i) => pad.buttons[i]?.pressed;
  if (b(14)) ctl.mx = -1; if (b(15)) ctl.mx = 1; if (b(12)) ctl.my = -1; if (b(13)) ctl.my = 1;
  for (const action of [...BUTTONS, 'block']) {
    const now = PAD[action].some(b);
    if (now && !prev[action]) ctl[action === 'block' ? 'blockTap' : action] = true;
    prev[action] = now;
  }
  if (PAD.block.some(b)) ctl.block = true;
  if (PAD.grab.some(b)) ctl.grabHeld = true;
  if (PAD.use.some(b)) ctl.use = true;
}

// held/pressed: Sets of key codes; pads: navigator.getGamepads() (nulls skipped, connected pads in order = slots);
// prevs: per-slot pad button memory (array, kept by the caller).
export function readSlots(held, pressed, pads, prevs, two = KEYBOARD2.on) {
  const out = [];
  for (let s = 0; s < SLOTS; s++) out.push(fromKeys(s, held, pressed, two));
  (pads ?? []).filter((p) => p).slice(0, SLOTS).forEach((pad, s) => padInto(out[s], pad, (prevs[s] ??= {})));
  return out;
}
