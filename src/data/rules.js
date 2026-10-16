// Shared combat/physics rules. Units: pixels and frames (60 frames = 1 second).
export const RULES = {
  gravity: 0.55,
  depthHit: 16,           // default: max depth (y) gap at which a hit still connects
  maxAttackers: 1,        // how many enemies may commit to attacking at once (fairness); also the most on any one hero
  maxAttackersPerHero: 1, // T021: each extra living hero adds this many to the global limit (1 hero = maxAttackers exactly)
  // T021 enemy targeting with several heroes (sim/ai.js): cost = |dx| + lane * |dy| + crowd * (other enemies on that hero);
  // a target is kept `stick` frames, and only swapped for one cheaper by more than `margin`. One hero: always him.
  targeting: { stick: 90, lane: 2, crowd: 120, margin: 60 },
  hurtFriction: 0.85,     // knockback slowdown per frame while hurt
  knockdown: { vz: 6.5, vx: 4.5, downFrames: 45, getupFrames: 18, invulnAfter: 30 },
  waveDelay: 90,
  // scrolling stages (T013): at most enemyCap enemies on screen; a zone's rats walk in zoneStagger frames apart
  enemyCap: 5, zoneStagger: 24,          // frames between clearing a wave and the next arriving
  deadLinger: 50,         // frames a defeated enemy blinks before vanishing
  wallBounce: 0.5,        // thrown / knocked-down fighters hitting the floor's side edge bounce back at this share of their speed
  // floor items (T010): gravity on items popping out of crates / dropped weapons; flyGravity on a tossed weapon;
  // floorLife = frames a weapon lies on the floor before it vanishes (blinking for the last `blink`); food stays;
  // dropOnKnockdown = a held weapon falls out of your hand when you are knocked down; popVz/popVx = how items pop out.
  items: { gravity: 0.5, flyGravity: 0.12, floorLife: 720, blink: 150, dropOnKnockdown: true, popVz: 5, popVx: 1.6 },
  footprint: 0.5,         // share of a fighter's body width that props block (feet, not shoulders)
  // T022 helping (only with more than one hero; a lone hero dies at 0 hp as before). downed.frames = how long a hero at
  // 0 hp lies downed before he is out for the rest of the fight (hook: sim/heroes.js bleedOut); the timer waits while
  // someone is picking him up (pause). revive: hold grab (H / Y) within range px (x) / depth px (y) of a downed friend
  // for `frames`; he gets up with hpShare of his max hp and `invuln` frames on top of the getup.
  downed: { frames: 600, pause: true },
  revive: { range: 62, depth: 22, frames: 72, hpShare: 0.35, invuln: 60 },
  // potions (carried, one per hero; data/items/health-potion.js has the heal and splash). Use button (U / LB): released
  // before drinkHold frames = toss (wind, then it flies `flight` frames in an arc from height z to the ally it aims at,
  // at most `reach` px away; no ally = lands `fallback` px in front); held drinkHold frames = drink (`drink` frames, heals
  // at the end). A hit cancels either (the potion is kept). drops: chance a crate / barrel / KO'd enemy (def id) also
  // drops a potion (own rng); solo: false = no potion drops with a lone hero (his old game stays exactly as it was).
  potions: { drinkHold: 24, drink: 26, wind: 8, recovery: 12, flight: 34, z: 64, reach: 420, fallback: 140,
    drops: { solo: false, crate: 0.5, barrel: 0.35, 'rat-raider': 0.15, 'rat-spearman': 0.15, 'rat-archer': 0.2 } },
};
