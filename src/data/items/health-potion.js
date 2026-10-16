// Health potion (T022): carried, not used at once (one potion slot per hero). Use button: tap = toss it to an ally,
// hold = drink. heal = hp restored (up to max); splash = x / y px around the landing spot that a hero must be within to
// be healed (so a moving target still gets it); no hero there = it lies on the floor as a pickup. Timings: RULES.potions.
export default { id: 'health-potion', name: 'Potion', kind: 'potion', art: { img: 'assets/art/items/health-potion.png', px: 0.36 },
  heal: 35, splash: { x: 52, y: 30 } };
