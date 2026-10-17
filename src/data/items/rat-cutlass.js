import { CUTLASS } from '../moves/cutlass.js';
// Weapon kit (T010): image + grip type + moves + durability + toss. Fighters with `pickup` pick it up off the floor (H).
// art: img; px = screen px per image px (its size on the floor and in the hand); grip = the hand's point on the image
//   (image px); rest = degrees that turn the image so the blade points forward (0 = drawn pointing right).
// gripEnd (T020): a point along the handle from `grip` toward the blade; a rig with a slot axis for the grip type turns the
//   item so the handle runs through the fist (render/rig.js restIn). floor (optional): degrees the image turns lying on the floor.
// T025 (weapon node, render/weapon-node.js): tip = the business end's point (image px; sockets' weapon_tip); grip2 = the
//   second hand's marker on a two-hander (spear); stow = where it hangs sheathed or slung ('hip' / 'back': data only,
//   no stowed drawing yet); hold (optional) = default grip modes { grip, grip2 } (data/grip-modes.js), a rig's
//   holds[item id] and a pose's grip / grip2 win over it.
// grip: hand type (`one-hand`: replaces the rig's one-hand slot, the sword). durability: hits that land before it breaks.
// attack/airAttack: the moves J starts while holding it (airAttack absent = the fighter's own).
// toss (H while holding): spinning projectile; damage + knockdown on the first enemy, spin rad/frame, hitstop/shake on that hit.
export default {
  id: 'rat-cutlass', name: 'Cutlass', kind: 'weapon',
  art: { img: 'assets/art/items/rat-cutlass.png', px: 0.36, grip: [48, 56], gripEnd: [80, 51.3], tip: [239, 1], rest: 0, stow: 'hip' },
  grip: 'one-hand', durability: 14,
  moves: CUTLASS, attack: 'cut1',
  toss: { damage: 10, spin: 0.55, hitstop: 7, shake: 6 },
};
