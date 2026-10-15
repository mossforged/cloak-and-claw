# A005 - Rat Raider revision: rattier head, heavier legs (art builder)

*(Revision of A004; delivered as its own ID.)*

**Read:** `docs/style-contract.md`, `docs/handoffs/asset-contract.md`, `assets/source/A004-rat-raider-rig/` (reference, parts, HANDOFF), `assets/art/enemies/rat-raider.png` (the original art bible rat), `docs/playtests/log.md` (2026-10-15 A004 entry).
**Autonomy:** human-gated. **Deliver to:** `assets/source/A005-rat-raider-head-legs/`

User feedback on A004: "he reads a bit more mouse head than rat", "his legs look pretty skinny", "I love his pained expression", and the spear hold looked strange (the spear hold is a rig placement job for the code builder, not this task).

## Make (same canvas, scale, angle and light as A004's reference; same file names so they drop in)
1. **Heads, redrawn to read as a rat, not a mouse:** a **longer, pointed, tapering snout**; **smaller ears set further back** on the head; a **lower, flatter skull**; narrower, meaner eyes; **visible long front incisors**; scruffier cheek fur. Keep the scar, the red bandana tails, the brown fur colours and the art style.
   - `head-neutral.png` (= `head.png`, sneering), `head-snarl.png` (attack: mouth wide, incisors bared).
   - `head-hurt.png`: **keep the expression of A004's `head-hurt.png` (the user loves it)**: same squeezed eyes and gritted wince, on the new rat head shape.
2. **Legs, heavier:** `leg-front-upper`, `leg-front-lower`, `leg-back-upper`, `leg-back-lower` with thicker thighs and calves (wiry brawler, not a stick), same patched trousers and wraps, same joint positions as A004 so they swap in.
3. `review.png`: the new heads beside A004's heads and beside the art bible `rat-raider.png`, and the assembled rat (new head + legs on A004's body) at 136 px next to Mouse Fighter at 130 px over Harbor Market. Plus `prompt.md`, `HANDOFF.md`.

## Acceptance
- At game size, does he read as a rat at a glance (not a mouse)?
- Legs visibly sturdier; the hurt head keeps A004's expression.
- Human: is this the rat you want to fight?

Out of scope: torso, arms, weapons, animation, the spear hold.
