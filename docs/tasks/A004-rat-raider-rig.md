# A004 - Rat Raider rig parts, three-quarter view + swap parts (art builder)

**Read:** `docs/style-contract.md`, `docs/handoffs/asset-contract.md`, `assets/art/enemies/rat-raider.png` (**match this character and angle**), `assets/source/A002-mouse-fighter-rig-3q/` (follow the same part list, naming, canvas approach and review layout: it worked), `assets/source/A002-mouse-fighter-rig-3q/HANDOFF.md`.
**Autonomy:** human-gated (the user approves the look). **Deliver to:** `assets/source/A004-rat-raider-rig/`

The user approved cutout rigs for every character. The Rat Raider is the main enemy, so he's next. He shares the mouse's body plan (a rodent biped), so the same rig layout can be reused with his parts.

## Make
1. `reference.png`: Rat Raider assembled, three-quarter view toward the camera at the **same angle as Mouse Fighter's A002 reference**, facing right, neutral fighting stance, notched cutlass in the near hand, free clawed far hand open. Both eyes visible. He is a bit taller and rangier than the mouse (rat about 0.65 of a badger's height, mouse 0.5), scruffy, patched clothes, red bandana as in `rat-raider.png`.
2. The same part names as A002 where they apply: `head`, `torso`, `scarf-tail` (his bandana tails), `tail`, `sword` (the cutlass; match `assets/source/A003-harbor-props/rat-cutlass.png`), `arm-front-upper`, `arm-front-lower`, `arm-back-upper`, `arm-back-lower` (open claw hand), `leg-front-upper`, `leg-front-lower`, `leg-back-upper`, `leg-back-lower`. No shield.
3. Swap parts: `torso-back`; `head-neutral` (= head, sneering), `head-snarl` (attack: teeth bared, shouting), `head-hurt`.
4. Same rules as A002: every part on the reference's canvas and scale, joint ends in the colour of the part they tuck under, light from the upper left.
5. `prompt.md`, `review.png` (parts on grey; reference at about 136 px next to Mouse Fighter's reference at 130 px over Harbor Market; and next to the current `rat-raider.png` for character match), `HANDOFF.md`.

## Acceptance
- All parts + swaps present, same scale as the reference (state any that aren't).
- Clearly the same Rat Raider as the art bible; readable as a threat next to Mouse Fighter.
- Human: is this the rat you want to fight?

Out of scope: other enemies, animation, game import.

## Addendum (lead, 2026-10-15): weapon-kit parts, same delivery
The roster will be built from weapon kits on shared bodies (`docs/decisions.md`, 2026-10-15). Add these to the same folder, same canvas and scale as the reference:
- `hand-front-grip.png` and `hand-back-grip.png`: closed fists gripping a shaft (for two-handed spears/polearms), matching the forearm cuffs so they can replace the hands at the wrist. If the forearm and hand are one piece in your parts, deliver `arm-back-lower-grip.png` (forearm + gripping fist) instead.
- `hand-back-pinch.png` (or `arm-back-lower-pinch.png`): the far hand pinching a bowstring.
- `spear.png`: a rough-hewn raider spear (long shaft, iron head, rag tied below the head), drawn straight, about 1.5x the rat's height.
- `bow.png`: a short recurve raider bow, string undrawn; `arrow.png`: one arrow.
- Show in `review.png` a quick mock assembly of the rat holding the spear two-handed and drawing the bow (rough placement is fine; it's to check scale and grip).
