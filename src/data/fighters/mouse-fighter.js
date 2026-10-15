import { MOUSE_SWORD } from '../moves/mouse-sword.js';
// Hero definition. stats are RPG hooks (River City Ransom-style growth later).
export default {
  id: 'mouse-fighter', name: 'Mouse Fighter', team: 'hero',
  // art: pose image paths (only idle exists yet; other poses fall back to idle).
  // height = on-screen px; facing = 1 if the image faces right; anchorX = feet centre as a fraction of width.
  // rig: draw with data/rigs/<id> instead of the standee (R toggles in play).
  // hand: where a held floor weapon is drawn on the standee (px forward of / above the feet; rot = blade angle, rad, - = up).
  art: { idle: 'assets/art/heroes/mouse-fighter.png', height: 128, facing: 1, anchorX: 0.47, rig: 'mouse-fighter', hand: { x: 30, y: 58, rot: -0.7 } },
  body: { w: 40, h: 100 },                      // hurtbox
  stats: { maxHp: 100, power: 0, defense: 0, speed: 1 },
  move: { walk: 2.7, depth: 1.9, jump: 9.5, jumpSquat: 4 },   // px/frame; jump = launch speed; jumpSquat = crouch frames before take-off (mode A)
  // jump squat A/B test (T014; F cycles it in play): 'off' = old jump; 'A' = crouch in place for move.jumpSquat frames, then
  // take off (weightier, later); 'B' = take off at once, crouch shown only in the drawing (JUICE.jumpSquat) + a landing squash.
  jumpSquatMode: 'B',
  // block (hold L): walkSpeed px/frame while blocking (0 = planted); chip = damage through the shield (never KOs);
  // pushback = blocker slide px/frame; stun = frames the blocker can't act; attackerPush = attacker shoved back px/frame;
  // hitstop/shake = feel on a block. Hits from behind land normally.
  block: { walkSpeed: 0.6, chip: 0, pushback: 3, stun: 12, attackerPush: 4, hitstop: 4, shake: 3 },
  // grab (press grab, H / pad Y, with a `throwable` enemy in front): range/depth = max x/y gap (feet to feet) to grab;
  // holdX/holdY = where he is held (px in front; px of depth, - = just behind so the hero draws over him); holdMax = frames before he breaks free
  // (breakPush px/frame, breakStun frames); dropStun = his stumble when a hit makes you let go; clinchZ = grip height.
  // knee (attack while holding): windup/active/recovery frames, damage, hitstop, shake; the maxStrikes-th uses lastKnee and knocks down.
  grab: { range: 75, depth: 16, holdX: 52, holdY: -1, holdMax: 150, maxStrikes: 3,
    breakPush: 4, breakStun: 16, dropStun: 14, clinchZ: 62, hitstop: 3, shake: 2,
    knee: { windup: 6, active: 2, recovery: 12, damage: 4, hitstop: 5, shake: 3 },
    lastKnee: { damage: 8, hitstop: 9, shake: 7 } },
  // throw (attack + direction, or jump, while holding): wind/recovery frames; release height z (overZ extra lift over
  // the head on a back throw); vx/vz px/frame launch; damage when he lands; hitDamage to each enemy he touches
  // (within depth px of y), each touch keeps hitSlow of his speed; hitstop/shake on those touches, landHitstop/landShake on landing.
  throw: { wind: 10, recovery: 16, z: 36, overZ: 60, vx: 7.5, vz: 5.5, damage: 12, hitDamage: 10, depth: 22, hitSlow: 0.85,
    hitstop: 8, shake: 9, landHitstop: 5, landShake: 6 },
  // pickup (H with nothing grabbable in reach): items whose spot is within range px (x) and depth px (y) of his feet.
  // Weapons take stow (sheathe sword / flick the held weapon aside), reach (crouch; in hand at its end), rise frames;
  // the flicked-aside weapon leaves at height asideZ with speed asideVx back, asideVz up. Food is eaten at once.
  // toss (H while holding a weapon): wind/recovery frames; the weapon leaves his hand at height z with speed vx, vz (px/frame);
  // it hits enemies (and props) within depth px of its lane.
  pickup: { range: 34, depth: 14, stow: 7, reach: 7, rise: 8, asideZ: 50, asideVx: 2.6, asideVz: 4.5 },
  toss: { wind: 8, recovery: 14, z: 62, vx: 11, vz: 1.2, depth: 20 },
  moves: MOUSE_SWORD, attack: 'slash1', airAttack: 'jumpSlash',
};
