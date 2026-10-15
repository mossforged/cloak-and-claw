# A006 - Mouse Fighter touch-up: guard, turn and bracing parts (art builder)

**Read:** `docs/style-contract.md`, `docs/handoffs/asset-contract.md`, `assets/source/A002-mouse-fighter-rig-3q/` (reference, parts, HANDOFF: **match its canvas, scale, angle and light exactly**), `docs/screens/T007/` (current block pose), `docs/screens/T008/` (spin slash), `docs/playtests/log.md`.
**Autonomy:** human-gated. **Deliver to:** `assets/source/A006-mouse-fighter-touchup/`

Code tasks T005, T007 and T008 found poses the current parts can't make look right: the shield block, the raised "cast" pose, a true horizontal slash, and the mid-spin turn. These swap-in parts fix them. Each is a new drawing of an existing part, on A002's canvas so it drops in at the same joints.

## Make (same naming style; each on A002's reference canvas)
1. `shield-face.png`: the shield seen face-on (round, boss centred), for the raised guard.
2. `arm-back-guard.png`: the shield arm (upper + lower in one piece is fine) bent up in a raised guard, forearm across the chest, as if bracing behind the shield.
3. `head-brace.png`: gritted teeth, eyes narrowed, chin tucked: bracing for a hit (same head shape as A002's heads).
4. `torso-side.png`: torso turned side-on (profile, facing right), for the horizontal slash and the cast pose.
5. `torso-back-full.png` + `head-back.png`: a true back view (back of head with ears and scarf knot; torso from behind) for the middle of the spin.
6. `arm-front-raised.png`: the sword arm raised straight up overhead (for the cast pose), hand gripping as in A002.
7. `review.png`: each new part beside the A002 part it replaces; plus rough assemblies of (a) the block guard, (b) the cast pose, (c) the mid-spin back view, at 130 px over Harbor Market. `prompt.md`, `HANDOFF.md`.

## Acceptance
- Everything on A002's canvas and scale; consistent colours, outlines and light.
- Human: do the guard, the cast and the back view look like Mouse Fighter and read clearly?

Out of scope: animation, new weapons, other characters.
