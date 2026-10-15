# A003 - Harbor props: breakables and floor weapons (art builder)

**Read:** `docs/style-contract.md`, `docs/handoffs/asset-contract.md`, `docs/concepts/art-bible/contact-sheet.jpg`, `assets/art/stages/harbor-market.png` (the stage these sit on), `assets/art/enemies/rat-raider.png` (his sword).
**Autonomy:** human-gated (the user approves the look). **Deliver to:** `assets/source/A003-harbor-props/`

Stage 2 adds breakable crates with food inside and weapons on the floor that anyone can pick up (the user loves floor weapons and enemies dropping their weapons). These props sit on the Harbor Market floor next to 130 px characters.

## Make (separate PNGs, three-quarter view toward the camera, light from the upper left, flat #00FF00 background)
1. `crate.png`: a wooden harbor cargo crate, about knee-to-waist height on a mouse; rope or stencil detail fitting the harbor.
2. `crate-debris-1.png` ... `crate-debris-4.png`: four separate broken plank pieces from that crate (they fly out when it breaks).
3. `barrel.png` and `barrel-debris-1.png` ... `barrel-debris-3.png`: a small fish or cargo barrel and its staves/hoop pieces.
4. Floor weapons, each drawn **lying flat on its side** so it reads on the floor and can also be rotated into a hand:
   - `rat-cutlass.png`: the Rat Raider's notched sword (match `rat-raider.png`), dropped when he's knocked down.
   - `plank-club.png`: a broken crate plank with a nail, a heavy improvised club.
   - `big-fish.png`: a large dried fish, the comedy harbor weapon (wide swing, big knockback).
5. `prompt.md`, `review.png` (all props on grey; plus crate, barrel and each weapon placed at game size on the Harbor Market floor beside the 130 px Mouse Fighter standee), `HANDOFF.md`.

## Acceptance
- All files present, consistent light and outline weight with the characters, readable at game size.
- Human: do these fit the harbor and the characters?

Out of scope: food pickups (the art bible's pie, cheese and potions are reused), any code or game import.
