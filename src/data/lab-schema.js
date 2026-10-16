// Tuning lab schema: which data objects lab.html exposes as sliders. Read by src/lab/.
// ROOTS maps a data file to the live object it exports; every field path is relative to its file's root.
// Section: { title, file, pick?, fields }. pick: true = choose one key of the root from a dropdown
// (e.g. a move), and field paths are relative to that key. A field may override `file`.
// Field: [path, min, max, step, fallback?] or { path, min, max, step, fallback?, file?, label? }. fallback = value assumed when the field is absent
// (the slider can then add it); without one, an absent field shows as "not set".
import { MOUSE_SWORD } from './moves/mouse-sword.js';
import { RAT_BLADE } from './moves/rat-blade.js';
import mouseFighter from './fighters/mouse-fighter.js';
import ratRaider from './fighters/rat-raider.js';
import { RULES } from './rules.js';
import { JUICE } from './juice.js';
import harborMarket from './stages/harbor-market.js';
import harborRun from './stages/harbor-run.js';
import ratCutlass from './items/rat-cutlass.js';
import plankClub from './items/plank-club.js';
import bigFish from './items/big-fish.js';
import cheeseWedge from './items/cheese-wedge.js';
import berryPie from './items/berry-pie.js';
import crate from './props/crate.js';
import { CUTLASS } from './moves/cutlass.js';
import { PLANK_CLUB } from './moves/plank-club.js';
import { BIG_FISH } from './moves/big-fish.js';
import barrel from './props/barrel.js';
import ratSpearman from './fighters/rat-spearman.js';
import ratArcher from './fighters/rat-archer.js';
import { RAT_SPEAR } from './moves/rat-spear.js';
import { RAT_BOW } from './moves/rat-bow.js';

export const ROOTS = {
  'src/data/moves/mouse-sword.js': MOUSE_SWORD,
  'src/data/moves/rat-blade.js': RAT_BLADE,
  'src/data/fighters/mouse-fighter.js': mouseFighter,
  'src/data/fighters/rat-raider.js': ratRaider,
  'src/data/fighters/rat-spearman.js': ratSpearman,
  'src/data/fighters/rat-archer.js': ratArcher,
  'src/data/moves/rat-spear.js': RAT_SPEAR,
  'src/data/moves/rat-bow.js': RAT_BOW,
  'src/data/rules.js': RULES,
  'src/data/juice.js': JUICE,
  'src/data/stages/harbor-market.js': harborMarket,
  'src/data/stages/harbor-run.js': harborRun,
  'src/data/items/rat-cutlass.js': ratCutlass,
  'src/data/items/plank-club.js': plankClub,
  'src/data/items/big-fish.js': bigFish,
  'src/data/items/cheese-wedge.js': cheeseWedge,
  'src/data/items/berry-pie.js': berryPie,
  'src/data/props/crate.js': crate,
  'src/data/props/barrel.js': barrel,
  'src/data/moves/cutlass.js': CUTLASS,
  'src/data/moves/plank-club.js': PLANK_CLUB,
  'src/data/moves/big-fish.js': BIG_FISH,
};
// One pick section per floor weapon's moves (T010).
const weaponMoves = (title, file) => ({
  title, file, pick: true,
  fields: [
    ['windup', 1, 40, 1], ['active', 1, 30, 1], ['recovery', 1, 60, 1], ['damage', 1, 50, 1],
    ['knockback', 0, 16, 0.1], ['hitbox.w', 10, 220, 1], ['launch.vx', 0, 20, 0.1, 4.5], ['launch.vz', 0, 16, 0.1, 6.5],
  ],
});

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
    fields: [['move.walk', 0.5, 8, 0.1], ['move.depth', 0.5, 6, 0.1], ['move.jump', 2, 20, 0.1], { path: 'move.jumpSquat', min: 0, max: 12, step: 1, label: 'jump squat frames (mode A)' }],
  },
  {
    title: 'Hero block (hold L)', file: 'src/data/fighters/mouse-fighter.js',
    fields: [
      ['block.walkSpeed', 0, 3, 0.1], ['block.chip', 0, 20, 1], ['block.pushback', 0, 10, 0.1], ['block.stun', 0, 40, 1],
      ['block.attackerPush', 0, 10, 0.1], ['block.hitstop', 0, 20, 1], ['block.shake', 0, 15, 0.5],
    ],
  },
  {
    title: 'Hero grab + throw', file: 'src/data/fighters/mouse-fighter.js',
    fields: [
      ['grab.range', 20, 120, 1], ['grab.depth', 2, 40, 1],
      ['grab.holdX', 20, 90, 1], ['grab.holdMax', 30, 400, 1], ['grab.maxStrikes', 1, 6, 1],
      ['grab.knee.damage', 1, 30, 1], ['grab.lastKnee.damage', 1, 40, 1],
      ['throw.vx', 1, 16, 0.1], ['throw.vz', 0, 14, 0.1], ['throw.damage', 1, 50, 1], ['throw.hitDamage', 1, 50, 1],
      ['throw.depth', 4, 60, 1], ['throw.hitSlow', 0.3, 1, 0.01], ['throw.hitstop', 0, 30, 1], ['throw.shake', 0, 20, 0.5],
      { path: 'wallBounce', min: 0, max: 1, step: 0.05, file: 'src/data/rules.js' },
      { path: 'thrownSpin', min: 0, max: 1, step: 0.01, file: 'src/data/juice.js' },
      { path: 'trail.width', min: 0, max: 60, step: 1, file: 'src/data/juice.js' },
    ],
  },
  {
    title: 'Floor weapons, props + food', file: 'src/data/items/plank-club.js',
    fields: [
      { path: 'durability', min: 1, max: 40, step: 1, label: 'club durability' },
      { path: 'toss.damage', min: 1, max: 50, step: 1, label: 'club toss damage' },
      { path: 'durability', min: 1, max: 40, step: 1, file: 'src/data/items/rat-cutlass.js', label: 'cutlass durability' },
      { path: 'durability', min: 1, max: 40, step: 1, file: 'src/data/items/big-fish.js', label: 'fish durability' },
      { path: 'toss.vx', min: 2, max: 24, step: 0.5, file: 'src/data/fighters/mouse-fighter.js' },
      { path: 'pickup.range', min: 8, max: 80, step: 1, file: 'src/data/fighters/mouse-fighter.js' },
      { path: 'heal', min: 1, max: 100, step: 1, file: 'src/data/items/cheese-wedge.js', label: 'cheese heal' },
      { path: 'heal', min: 1, max: 100, step: 1, file: 'src/data/items/berry-pie.js', label: 'pie heal' },
      { path: 'hp', min: 1, max: 10, step: 1, file: 'src/data/props/crate.js', label: 'crate hp' },
      { path: 'hp', min: 1, max: 10, step: 1, file: 'src/data/props/barrel.js', label: 'barrel hp' },
      { path: 'drop.chance', min: 0, max: 1, step: 0.05, file: 'src/data/fighters/rat-raider.js' },
      { path: 'items.floorLife', min: 60, max: 3000, step: 30, file: 'src/data/rules.js' },
    ],
  },
  weaponMoves('Cutlass moves', 'src/data/moves/cutlass.js'),
  weaponMoves('Plank club moves', 'src/data/moves/plank-club.js'),
  weaponMoves('Big fish moves', 'src/data/moves/big-fish.js'),
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
  {   // T011: spear kit (items/rat-spear.js gives the defaults; the fighter's own copy is what plays)
    title: 'Rat Spearman', file: 'src/data/fighters/rat-spearman.js',
    fields: [
      ['move.walk', 0.5, 6, 0.1],
      { path: 'spearThrust.windup', min: 1, max: 80, step: 1, file: 'src/data/moves/rat-spear.js' },
      { path: 'spearThrust.recovery', min: 1, max: 80, step: 1, file: 'src/data/moves/rat-spear.js' },
      { path: 'spearThrust.damage', min: 1, max: 50, step: 1, file: 'src/data/moves/rat-spear.js' },
      { path: 'spearThrust.hitbox.w', min: 20, max: 220, step: 1, file: 'src/data/moves/rat-spear.js', label: 'reach (hitbox.w)' },
      { path: 'spearThrust.lunge', min: 0, max: 8, step: 0.1, file: 'src/data/moves/rat-spear.js' },
      ['ai.range', 10, 260, 1], ['ai.hover', 30, 400, 1], ['ai.aggression', 0, 1, 0.01],
      ['ai.cooldown.0', 0, 300, 1], ['ai.cooldown.1', 0, 300, 1],
    ],
  },
  {   // T011: bow kit; the arrow is bowShot's `shot`
    title: 'Rat Archer', file: 'src/data/fighters/rat-archer.js',
    fields: [
      ['move.walk', 0.5, 6, 0.1],
      { path: 'bowShot.windup', min: 1, max: 90, step: 1, file: 'src/data/moves/rat-bow.js', label: 'draw (windup)' },
      { path: 'bowShot.recovery', min: 1, max: 80, step: 1, file: 'src/data/moves/rat-bow.js' },
      { path: 'bowShot.shot.speed', min: 1, max: 20, step: 0.5, file: 'src/data/moves/rat-bow.js', label: 'arrow speed' },
      { path: 'bowShot.shot.damage', min: 1, max: 40, step: 1, file: 'src/data/moves/rat-bow.js', label: 'arrow damage' },
      { path: 'bowShot.shot.depth', min: 2, max: 40, step: 1, file: 'src/data/moves/rat-bow.js', label: 'arrow lane depth' },
      { path: 'bowShot.shot.range', min: 100, max: 960, step: 10, file: 'src/data/moves/rat-bow.js', label: 'arrow range' },
      ['ai.range', 60, 500, 5], ['ai.flee', 0, 400, 5], ['ai.slack', 0, 200, 5], ['ai.aggression', 0, 1, 0.01],
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
      ['jumpSquat.rise', 0, 15, 1], ['jumpSquat.land', 0, 20, 1], ['jumpSquat.landDepth', 0, 1, 0.05],
      ['jumpSquat.squashX', 1, 1.4, 0.01], ['jumpSquat.squashY', 0.6, 1, 0.01],
    ],
  },
  {
    title: 'Stage (Harbor Market)', file: 'src/data/stages/harbor-market.js',
    fields: [
      ['floor.top', 250, 540, 1], ['floor.bottom', 250, 540, 1], ['floor.left', 0, 480, 1], ['floor.right', 480, 960, 1],
      ['art.x', -800, 200, 1], ['art.y', -600, 200, 1], ['art.w', 900, 2600, 10],
    ],
  },
  {
    title: 'Stage (Harbor Run, scrolling)', file: 'src/data/stages/harbor-run.js',
    fields: [
      ['layers.floor.shade', 0, 0.6, 0.01], ['layers.floor.backfill', 0, 120, 1], ['layers.floor.backfillShade', 0, 1, 0.01], ['layers.far.parallax', 0, 1, 0.01], ['layers.frontParallax', 1, 1.5, 0.01],
      ['layers.fade', 0, 1, 0.05], ['camera.follow', 200, 700, 5], ['camera.catchUp', 1, 20, 0.5], ['camera.edge', 0, 120, 1],
      ['floor.top', 300, 540, 1], ['floor.bottom', 300, 540, 1],
      { path: 'enemyCap', min: 1, max: 8, step: 1, file: 'src/data/rules.js' }, { path: 'zoneStagger', min: 1, max: 120, step: 1, file: 'src/data/rules.js' },
    ],
  },
];
