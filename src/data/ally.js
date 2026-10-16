// AI ally brain numbers (T022, sim/ally.js). An ally is a hero slot with controller { kind: 'ai' }.
// Rule order: dodge telegraphed danger > pick up a downed friend > potions > stay on the leash > fight > follow.
export const ALLY = {
  react: 4,              // frames after an enemy's windup starts before the ally steps out of its lane (he holds still until then)
  dodge: { reach: 26, lane: 10 },   // extra px on an attack's reach (x) and lane (y) that he counts as danger (he steps past it)
  leash: 230, back: 120,  // px (x) from the player-hero beyond which he walks back, until within `back`
  hover: 70, laneTol: 6,  // follow spot: px behind the player-hero; lane slack (y) when lining up a swing
  range: 66,              // px (x) from an enemy at which he swings
  swingGap: 48,           // frames between his swings (no combos: one slash each, so he never stun-locks)
  waitHurt: true,         // never swings at an enemy that is still reeling from a hit
  damage: 0.6,            // his hits deal this share of a human's damage (he helps, the player wins the fight)
  rescueSafe: 90,         // px: he holds off a revive while an enemy in windup is this close to the downed friend
  potionAt: 0.45,         // tosses his potion to a hero below this share of max hp (within RULES.potions.reach)
  drinkAt: 0.35, alone: 170,   // drinks it himself below this share when no enemy is within `alone` px and no friend needs it
  fetch: 160,             // px: walks to a potion on the floor this close when his slot is empty and no enemy is near
};
