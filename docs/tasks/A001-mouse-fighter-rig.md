# A001 - Mouse Fighter cutout rig parts (art builder)

**Read:** `docs/style-contract.md`, `docs/handoffs/asset-contract.md`, `assets/art/heroes/mouse-fighter.png` (current standee), `docs/concepts/art-bible/contact-sheet.jpg`.
**Autonomy:** human-gated (the user approves the look before the rig is built).
**Deliver to:** `assets/source/A001-mouse-fighter-rig/`

Stage 3 replaces the flat Mouse Fighter standee with a cutout ("paper doll") rig: separate painted parts joined at pivots and animated by code. The current art is a three-quarter action pose that cannot be cut apart, so we need the same character redrawn for rigging.

## Make
1. `reference.png`: Mouse Fighter assembled, **side view facing right**, standing in a neutral stance, arms slightly away from the body, sword held low in the front hand, shield on the back arm. At least 1024 px tall.
2. Parts, same scale as the reference, each a separate PNG on flat #00FF00 (or transparent), named:
   `head.png` (with ears, no neck), `torso.png` (tunic, belt, scarf knot), `scarf-tail.png`, `tail.png`,
   `arm-front-upper.png`, `arm-front-lower.png` (forearm + hand gripping the sword hilt), `sword.png` (separate blade+hilt),
   `arm-back-upper.png`, `arm-back-lower.png` (forearm + hand), `shield.png` (round, face-on),
   `leg-front-upper.png`, `leg-front-lower.png` (shin + boot), `leg-back-upper.png`, `leg-back-lower.png`.
   If the tool can only make a sheet, deliver `parts-sheet.png` with clear space between all parts instead.
3. Limb parts have rounded, slightly extended ends at the joints.
4. `prompt.md`, `review.png`, `HANDOFF.md` per the asset contract.

## Character (must match the art bible)
Grey mouse, large pink ears, red scarf, blue tunic with gold trim, brown belt and pouches, brown boots, pink tail, short steel sword with gold crossguard, round wooden shield with gold rim and boss. Warm painted cartoon, bold dark outlines, light from upper left, no shadows.

## Acceptance
- All files above present (or the sheet), consistent scale with the reference, no overlapping parts, no green in the character.
- `review.png` shows parts on grey and the reference at about 130 px over the Harbor Market stage.
- Human: does it still look like Mouse Fighter, and would you be happy seeing it move?

Out of scope: animation frames, other characters, editing anything outside the delivery folder.
