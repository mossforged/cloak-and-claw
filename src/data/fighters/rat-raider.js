import { RAT_BLADE } from '../moves/rat-blade.js';
import { RAT_REHEARSAL } from '../moves/rat-rehearsal.js';
import { RAT_LOOKS } from '../looks.js';
export default {
  id: 'rat-raider', name: 'Rat Raider', team: 'enemy',
  art: { idle: 'assets/art/enemies/rat-raider.png', height: 136, facing: 1, anchorX: 0.56, rig: 'rat-raider',
    held: 'rat-cutlass' },   // T018: the weapon item drawn in his hand (render/rig.js heldOf); look only, his moves stay RAT_BLADE
  body: { w: 44, h: 108 },
  throwable: true,   // the hero can grab and throw him (T009)
  stats: { maxHp: 30, power: 0, defense: 0, speed: 1 },
  move: { walk: 2.0, depth: 1.4, jump: 0 },
  moves: RAT_BLADE, attack: 'ratSlash',
  rehearsal: RAT_REHEARSAL,   // T029: every rehearsal move his body is posed for (viewer only; no brain starts one)
  // ai: see src/sim/ai.js. range = attack distance; hover = waiting distance; think/cooldown = [min,max] frames.
  ai: { brain: 'brawler', range: 64, hover: 165, think: [20, 50], cooldown: [50, 110], aggression: 0.55 },
  look: RAT_LOOKS.raider,   // T019: each one spawns with its own face detail, tints, fur and size (render only)
  xp: 10,
  drop: { item: 'rat-cutlass', chance: 0.85 },   // knocked out: the cutlass he holds falls to the floor (T010)
};
