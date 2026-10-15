import { RAT_BLADE } from '../moves/rat-blade.js';
export default {
  id: 'rat-raider', name: 'Rat Raider', team: 'enemy',
  art: { idle: 'assets/art/enemies/rat-raider.png', height: 136, facing: 1, anchorX: 0.56, rig: 'rat-raider' },
  body: { w: 44, h: 108 },
  throwable: true,   // the hero can grab and throw him (T009)
  stats: { maxHp: 30, power: 0, defense: 0, speed: 1 },
  move: { walk: 2.0, depth: 1.4, jump: 0 },
  moves: RAT_BLADE, attack: 'ratSlash',
  // ai: see src/sim/ai.js. range = attack distance; hover = waiting distance; think/cooldown = [min,max] frames.
  ai: { brain: 'brawler', range: 64, hover: 165, think: [20, 50], cooldown: [50, 110], aggression: 0.55 },
  xp: 10,
  drop: { item: 'rat-cutlass', chance: 0.85 },   // knocked out: his cutlass falls to the floor (T010)
};
