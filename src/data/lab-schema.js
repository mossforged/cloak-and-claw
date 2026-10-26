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
import mouseFighterBrace from './rigs/mouse-fighter-brace.js';
import { LOOKS } from './looks.js';
import { RIG_MOTION } from './rig-motion.js';
import { WRISTS } from './wrists.js';
import healthPotion from './items/health-potion.js';
import { ALLY } from './ally.js';
import { IMPACT } from './impact.js';
import { ITEM_LEAD } from './item-lead.js';

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
  'src/data/rigs/mouse-fighter-brace.js': mouseFighterBrace,
  'src/data/looks.js': LOOKS,
  'src/data/items/health-potion.js': healthPotion,
  'src/data/ally.js': ALLY,
  'src/data/rig-motion.js': RIG_MOTION,
  'src/data/wrists.js': WRISTS,
  'src/data/impact.js': IMPACT,
  'src/data/item-lead.js': ITEM_LEAD,
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
    title: 'Hero bracing loop (T015, while blocking)', file: 'src/data/rigs/mouse-fighter-brace.js',
    fields: [
      ['fade', 1, 40, 1], ['breath', 0.5, 3, 0.05], ['chest', 0, 0.1, 0.005], ['head', 0, 6, 0.1],
      ['shield', 0, 6, 0.1], ['arm', 0, 6, 0.1], ['lag', 0, 0.5, 0.01],
      ['sway', 1, 6, 0.1], ['hips', 0, 4, 0.1], ['swayFade', 1, 40, 1], ['sword', 0, 8, 0.1],
      { path: 'brace.squash', min: 0, max: 0.08, step: 0.005, file: 'src/data/juice.js', label: 'standee breath squash' },
      { path: 'brace.lean', min: 0, max: 0.06, step: 0.002, file: 'src/data/juice.js', label: 'standee breath lean' },
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
    title: 'Weapon feel (T017, look only)', file: 'src/data/items/big-fish.js',
    fields: [
      { path: 'feel.wobble.period', min: 0.05, max: 0.6, step: 0.01, label: 'fish wobble period (s)' },
      { path: 'feel.wobble.damping', min: 0.02, max: 1, step: 0.01, label: 'fish wobble damping' },
      { path: 'feel.wobble.gain', min: 0, max: 2, step: 0.05, label: 'fish wobble gain' },
      { path: 'feel.wobble.bob', min: 0, max: 1, step: 0.01, label: 'fish wobble from bob' },
      { path: 'feel.wobble.max', min: 0, max: 60, step: 1, label: 'fish wobble max (deg)' },
      { path: 'feel.squash.amount', min: 0, max: 0.6, step: 0.01, label: 'fish slap squash' },
      { path: 'feel.squash.time', min: 0.1, max: 1.2, step: 0.05, label: 'fish squash time (s)' },
      { path: 'feel.bend.sag', min: 0, max: 0.4, step: 0.01, label: 'fish sag per slice' },
      { path: 'feel.bend.flop', min: 0, max: 1, step: 0.05, label: 'fish wobble as bend' },
      { path: 'feel.bend.segs', min: 1, max: 24, step: 1, label: 'fish bend slices' },
      { path: 'feel.bend.fling.windup', min: 0, max: 1, step: 0.05, label: 'fish stiff by windup end' },
      { path: 'feel.bend.fling.release', min: 0.05, max: 1, step: 0.05, label: 'fish goes limp over (recovery share)' },
      { path: 'feel.bend.fling.period', min: 0.08, max: 0.8, step: 0.01, label: 'fish limp spring period (s)' },
      { path: 'feel.bend.fling.damping', min: 0.05, max: 1, step: 0.01, label: 'fish limp spring damping' },
      { path: 'club1.fx.dust', min: 0, max: 20, step: 1, file: 'src/data/moves/plank-club.js', label: 'club1 dust puffs' },
      { path: 'club1.fx.shake', min: 0, max: 10, step: 0.5, file: 'src/data/moves/plank-club.js', label: 'club1 extra shake' },
      { path: 'club2.fx.dust', min: 0, max: 20, step: 1, file: 'src/data/moves/plank-club.js', label: 'club2 dust puffs' },
      { path: 'club2.fx.shake', min: 0, max: 10, step: 0.5, file: 'src/data/moves/plank-club.js', label: 'club2 extra shake' },
    ],
  },
  {
    title: 'Rules', file: 'src/data/rules.js',
    fields: [
      ['gravity', 0.1, 2, 0.01], ['depthHit', 2, 60, 1], ['maxAttackers', 0, 6, 1],
      ['knockdown.vz', 0, 15, 0.1], ['knockdown.vx', 0, 12, 0.1], ['knockdown.downFrames', 0, 150, 1],
      // T021: several heroes (?heroes=2): extra attackers per extra hero, enemy target choice
      ['maxAttackersPerHero', 0, 3, 1], ['targeting.stick', 0, 300, 5], ['targeting.lane', 0, 6, 0.1],
      ['targeting.crowd', 0, 400, 10], ['targeting.margin', 0, 300, 5],
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
    title: 'Rat looks (T019, render only)', file: 'src/data/looks.js',
    fields: [
      { path: 'sat', min: 0, max: 1.5, step: 0.05, label: 'cloth tint saturation' },
      { path: 'mix', min: 0, max: 1, step: 0.05, label: 'cloth tint strength' },
      { path: 'fur', min: 0, max: 0.2, step: 0.01, label: 'fur shift range' },
      { path: 'size', min: 0, max: 0.1, step: 0.005, label: 'size range (+-)' },
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
  {
    title: 'Helping (T022: downed, revive, potions)', file: 'src/data/rules.js',
    fields: [
      ['downed.frames', 60, 1800, 10], ['revive.frames', 10, 240, 1], ['revive.hpShare', 0.05, 1, 0.05], ['revive.invuln', 0, 240, 5],
      ['revive.range', 20, 140, 1], ['revive.depth', 6, 60, 1],
      ['potions.drinkHold', 6, 90, 1], ['potions.drink', 4, 90, 1], ['potions.flight', 10, 80, 1], ['potions.reach', 100, 900, 10],
      ['potions.drops.crate', 0, 1, 0.05], ['potions.drops.barrel', 0, 1, 0.05], ['potions.drops.rat-raider', 0, 1, 0.05],
      { path: 'heal', min: 5, max: 100, step: 1, file: 'src/data/items/health-potion.js', label: 'potion heal' },
      { path: 'splash.x', min: 10, max: 140, step: 1, file: 'src/data/items/health-potion.js', label: 'potion splash x' },
    ],
  },
  {
    title: 'Rig views, turn and springs (T028, look only)', file: 'src/data/rig-motion.js',
    fields: [
      { path: 'capTurn', min: 0, max: 1, step: 0.05, label: 'shoulder cap turns with the arm' },
      { path: 'viewBlend', min: 0, max: 0.3, step: 0.01, label: 'view swap: joints slide (s)' },
      { path: 'springs.inertia', min: 0, max: 0.3, step: 0.005, label: 'tail/scarf lag per px/s (deg)' },
      { path: 'springs.strength', min: 10, max: 600, step: 5, label: 'tail/scarf pull back (1/s^2)' },
      { path: 'springs.damping', min: 0.1, max: 1.5, step: 0.05, label: 'tail/scarf damping (1 = no bounce)' },
      { path: 'springs.max', min: 0, max: 60, step: 1, label: 'tail/scarf max (deg)' },
    ],
  },
  {
    title: 'Wrists (T029 r3, look only)', file: 'src/data/wrists.js',
    fields: [
      { path: 'default.near', min: 10, max: 90, step: 1, label: 'near wrist limit (deg)' },
      { path: 'default.far', min: 10, max: 90, step: 1, label: 'far wrist limit (deg)' },
      { path: 'turn', min: 0.2, max: 6, step: 0.1, label: 'two-handed item: cost per deg turned' },
      { path: 'turn1', min: 0.2, max: 6, step: 0.1, label: 'one-handed item: cost per deg turned' },
      { path: 'trade', min: 0.1, max: 3, step: 0.05, label: 'cost per px the hand moves' },
      { path: 'armTurn', min: 0, max: 0.5, step: 0.01, label: 'cost per deg the arm turns' },
      { path: 'elbowMax', min: 60, max: 170, step: 1, label: 'deepest elbow bend (deg)' },
    ],
  },
  {
    title: 'Impact (T041, rat v3 attacks, look only)', file: 'src/data/impact.js',
    fields: [
      { path: 'over', min: 0, max: 0.5, step: 0.01, label: 'overshoot past the strike (share of the last swing)' },
      { path: 'stretch', min: 0, max: 0.08, step: 0.005, label: 'arm stretch at the hit' },
      { path: 'frames', min: 1, max: 2, step: 1, label: 'stretch frames' },
    ],
  },
  {
    title: 'Item-led two-handers (T041, rat v3, look only)', file: 'src/data/item-lead.js',
    fields: [
      { path: 'search.slide', min: 0, max: 30, step: 1, label: 'second fist may slide along the shaft (px)' },
      { path: 'search.max', min: 0, max: 60, step: 2, label: 'furthest the item moves to be held (px)' },
    ],
  },
  {
    title: 'AI ally (T022, ?ally=1)', file: 'src/data/ally.js',
    fields: [
      ['damage', 0.1, 1.5, 0.05], ['swingGap', 10, 150, 1], ['range', 40, 110, 1], ['leash', 100, 600, 10], ['back', 40, 400, 10],
      ['react', 0, 30, 1], ['dodge.reach', 0, 80, 1], ['dodge.lane', 0, 40, 1],
      ['potionAt', 0.05, 1, 0.05], ['drinkAt', 0.05, 1, 0.05], ['alone', 40, 400, 10],
    ],
  },
];
