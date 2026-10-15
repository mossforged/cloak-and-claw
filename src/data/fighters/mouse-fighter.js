import { MOUSE_SWORD } from '../moves/mouse-sword.js';
// Hero definition. stats are RPG hooks (River City Ransom-style growth later).
export default {
  id: 'mouse-fighter', name: 'Mouse Fighter', team: 'hero',
  // art: pose image paths (only idle exists yet; other poses fall back to idle).
  // height = on-screen px; facing = 1 if the image faces right; anchorX = feet centre as a fraction of width.
  // rig: draw with data/rigs/<id> instead of the standee (R toggles in play).
  art: { idle: 'assets/art/heroes/mouse-fighter.png', height: 128, facing: 1, anchorX: 0.47, rig: 'mouse-fighter' },
  body: { w: 40, h: 100 },                      // hurtbox
  stats: { maxHp: 100, power: 0, defense: 0, speed: 1 },
  move: { walk: 2.7, depth: 1.9, jump: 9.5 },   // px/frame; jump = launch speed
  moves: MOUSE_SWORD, attack: 'slash1', airAttack: 'jumpSlash',
};
