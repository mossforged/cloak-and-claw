// Shared combat/physics rules. Units: pixels and frames (60 frames = 1 second).
export const RULES = {
  gravity: 0.55,
  depthHit: 16,           // default: max depth (y) gap at which a hit still connects
  maxAttackers: 1,        // how many enemies may commit to attacking at once (fairness)
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
};
