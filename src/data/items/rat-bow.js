import { RAT_BOW } from '../moves/rat-bow.js';
// Weapon kit (T011): the Rat Archer's bow. grip 'bow': held in the far fist (rig slot `bow`) at `grip`; the near hand
// draws the string: it goes to `nock` (string middle) over the first `reachIn` of the draw, then pulls it back to
// `pull` image px at full draw (render/rig-grip.js),
// the string runs from the tips to it and the shot's arrow sits nocked on it until it is loosed. T020: A012 art (keyed
// x0.25, stringless, points from its weapons.json), tip to tip as A004's (82 px); gripEnd: the handle runs straight up;
// a rig grip with an `anchor` (rigs/rat-raider.js) draws to that point (the ear) instead of `pull`. floor: lies on its side.
// ai: an archer keeps `range` px away in his target's lane, backs off when closer than `flee`, shoots when within
// `slack` px of his spot (or cornered), one arrow in flight at a time.
export default {
  id: 'rat-bow', name: 'Bow', kind: 'weapon',
  art: { img: 'assets/art/items/rat-bow.png', px: 0.25, grip: [63, 182.25], gripEnd: [63, 150], nock: [10.5, 182.25], pull: 100, reachIn: 0.25, tips: [[10.5, 18.75], [10.5, 346.25]], rest: 0, floor: 90 },
  grip: 'bow', durability: 10,
  moves: RAT_BOW, attack: 'bowShot',
  toss: { damage: 6, spin: 0.4, hitstop: 5, shake: 4 },
  ai: { brain: 'archer', range: 290, hover: 330, flee: 150, slack: 70, think: [20, 45], cooldown: [60, 110], aggression: 0.6 },
};
