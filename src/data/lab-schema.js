// Tuning lab schema: which data objects lab.html exposes as sliders. Read by src/lab/.
// ROOTS maps a data file to the live object it exports; every field path is relative to its file's root.
// Section: { title, file, pick?, fields }. pick: true = choose one key of the root from a dropdown
// (e.g. a move), and field paths are relative to that key. A field may override `file`.
// Field: [path, min, max, step, fallback?]. fallback = value assumed when the field is absent
// (the slider can then add it); without one, an absent field shows as "not set".
import { MOUSE_SWORD } from './moves/mouse-sword.js';
import { RAT_BLADE } from './moves/rat-blade.js';
import mouseFighter from './fighters/mouse-fighter.js';
import ratRaider from './fighters/rat-raider.js';
import { RULES } from './rules.js';
import { JUICE } from './juice.js';
import harborMarket from './stages/harbor-market.js';

export const ROOTS = {
  'src/data/moves/mouse-sword.js': MOUSE_SWORD,
  'src/data/moves/rat-blade.js': RAT_BLADE,
  'src/data/fighters/mouse-fighter.js': mouseFighter,
  'src/data/fighters/rat-raider.js': ratRaider,
  'src/data/rules.js': RULES,
  'src/data/juice.js': JUICE,
  'src/data/stages/harbor-market.js': harborMarket,
};

const pose = (ph) => [
  [`pose.${ph}.rot`, -1, 1, 0.01, 0], [`pose.${ph}.sx`, 0.7, 1.3, 0.01, 1],
  [`pose.${ph}.sy`, 0.7, 1.3, 0.01, 1], [`pose.${ph}.dx`, -30, 30, 1, 0],
];
const RAT_MOVES = 'src/data/moves/rat-blade.js';

export const LAB_SCHEMA = [
  {
    title: 'Mouse Fighter moves', file: 'src/data/moves/mouse-sword.js', pick: true,
    fields: [
      ['windup', 1, 40, 1], ['active', 1, 30, 1], ['recovery', 1, 60, 1], ['comboFrom', 0, 30, 1],
      ['damage', 1, 50, 1], ['knockback', 0, 12, 0.1], ['hitstun', 0, 60, 1],
      ['hitstop', 0, 30, 1], ['shake', 0, 20, 0.5], ['lunge', 0, 8, 0.1],
      ['hitbox.x', -40, 80, 1], ['hitbox.z', -40, 120, 1], ['hitbox.w', 10, 200, 1], ['hitbox.h', 10, 200, 1],
      ...pose('windup'), ...pose('active'),
    ],
  },
  {
    title: 'Hero movement', file: 'src/data/fighters/mouse-fighter.js',
    fields: [['move.walk', 0.5, 8, 0.1], ['move.depth', 0.5, 6, 0.1], ['move.jump', 2, 20, 0.1]],
  },
  {
    title: 'Hero block (hold L)', file: 'src/data/fighters/mouse-fighter.js',
    fields: [
      ['block.walkSpeed', 0, 3, 0.1], ['block.chip', 0, 20, 1], ['block.pushback', 0, 10, 0.1], ['block.stun', 0, 40, 1],
      ['block.attackerPush', 0, 10, 0.1], ['block.hitstop', 0, 20, 1], ['block.shake', 0, 15, 0.5],
    ],
  },
  {
    title: 'Rules', file: 'src/data/rules.js',
    fields: [
      ['gravity', 0.1, 2, 0.01], ['depthHit', 2, 60, 1], ['maxAttackers', 0, 6, 1],
      ['knockdown.vz', 0, 15, 0.1], ['knockdown.vx', 0, 12, 0.1], ['knockdown.downFrames', 0, 150, 1],
    ],
  },
  {
    title: 'Rat Raider', file: 'src/data/fighters/rat-raider.js',
    fields: [
      ['move.walk', 0.5, 6, 0.1],
      { path: 'ratSlash.windup', min: 1, max: 60, step: 1, file: RAT_MOVES },
      { path: 'ratSlash.active', min: 1, max: 30, step: 1, file: RAT_MOVES },
      { path: 'ratSlash.recovery', min: 1, max: 80, step: 1, file: RAT_MOVES },
      { path: 'ratSlash.damage', min: 1, max: 50, step: 1, file: RAT_MOVES },
      { path: 'ratSlash.lunge', min: 0, max: 8, step: 0.1, fallback: 0, file: RAT_MOVES },
      { path: 'ratSlash.depth', min: 2, max: 60, step: 1, fallback: RULES.depthHit, file: RAT_MOVES },
      ['ai.range', 10, 200, 1], ['ai.hover', 30, 400, 1], ['ai.aggression', 0, 1, 0.01],
      ['ai.cooldown.0', 0, 300, 1], ['ai.cooldown.1', 0, 300, 1],
    ],
  },
  {
    title: 'Juice', file: 'src/data/juice.js',
    fields: [
      ['shake.decay', 0.5, 0.99, 0.01], ['shake.max', 0, 60, 1], ['flashFrames', 1, 30, 1],
      ['koHitstop', 0, 40, 1], ['koShake', 0, 30, 0.5],
      ['block.glint.dx', -40, 120, 1], ['block.glint.dy', 0, 140, 1], ['block.glint.size', 0, 60, 1],
      ['block.glint.life', 1, 60, 1], ['block.glint.delay', 0, 20, 1],
    ],
  },
  {
    title: 'Stage (Harbor Market)', file: 'src/data/stages/harbor-market.js',
    fields: [
      ['floor.top', 250, 540, 1], ['floor.bottom', 250, 540, 1], ['floor.left', 0, 480, 1], ['floor.right', 480, 960, 1],
      ['art.x', -800, 200, 1], ['art.y', -600, 200, 1], ['art.w', 900, 2600, 10],
    ],
  },
];
