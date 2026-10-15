# A009 - Rat Raider rig parts redrawn from the art-bible standee (art builder)

*(Replaces the A004/A005 body for rigging; delivered as its own ID.)*

**Read:** `docs/style-contract.md`, `docs/handoffs/asset-contract.md`, `assets/art/enemies/rat-raider.png` (**the target: the art-bible rat standee**), `assets/art/heroes/mouse-fighter.png` + `assets/source/A002-mouse-fighter-rig-3q/` (how the mouse parts matched their standee), `assets/source/A004-rat-raider-rig/HANDOFF.md` and `assets/source/A005-rat-raider-head-legs/HANDOFF.md` (part list, canvas, what went wrong), `docs/screens/T011/5-body-variants-vs-standee.jpg` (the in-game rig rat beside the standee), `docs/playtests/log.md` (rat entries).
**Autonomy:** human-gated (look). **Deliver to:** `assets/source/A009-rat-raider-standee-rig/`

## Why
The rigged rat in the game does not look like the art-bible rat. User (T011): the rats "don't match the original standee in quality", aren't crouching, and their "arms and legs are skinny". Thickening the parts in code did not fix it. The cause is the drawings: A004 drew a **new, taller, rangier rat** as its reference, and A005 pushed the head toward a long weasel snout with small ears. The standee is a different character: **stocky, brown, big round ears, thick arms and legs, chunky boots and wraps, hunched in a wide fighting crouch.**

The Mouse Fighter rig matches his standee because his parts were drawn to it. Do the same for the rat: **the standee is the reference; do not design a new rat.**

## Make (same file names as A004/A005 so they drop into the existing rig)
1. **`reference.png`: the standee rat, redrawn at high resolution, as close to `rat-raider.png` as the tool allows**: same proportions, same crouch (knees bent, feet wide, hips low, torso tipped forward, head pushed out), same outfit, same fur colours, same chunky limbs. Use the standee image as an input/reference image. Cutlass in the near hand, far fist open or clenched as in the standee. Keep A004's **1536 x 2304 #00FF00 canvas** and give the silhouette about the same height as A004's (so import scale carries over).
2. **Parts drawn to that reference** (each separate on the same canvas, placed where it sits in the reference, rounded extended joint ends per the asset contract): `head-neutral.png` (+ byte-identical `head.png`), `torso.png`, `torso-back.png`, `scarf-tail.png`, `tail.png`, `arm-front-upper.png`, `arm-front-lower.png`, `arm-back-upper.png`, `arm-back-lower.png`, `arm-back-lower-grip.png`, `arm-back-lower-pinch.png`, `hand-front-grip.png`, `leg-front-upper.png`, `leg-front-lower.png`, `leg-back-upper.png`, `leg-back-lower.png`.
   - **Limb thickness must match the standee.** Measure thigh, calf, upper arm, forearm and boot width against body height on the standee and on your reference, and hit them; this is the main thing the user will judge. Feet: the standee's wrapped boots/feet, not thin rat toes.
   - Weapons stay as they are (A004 `sword`, `spear`, `bow`, `arrow`); don't redraw them.
3. **Heads (the one open look question).** The standee head has big round ears; earlier the user said A004's head read "a bit more mouse than rat", and A005 answered with a long snout and small ears, which now looks like a different animal. Deliver **two head sets** so the user can pick in context:
   - **Set S (standee):** neutral, snarl, hurt, faithful to the standee head (ears, snout length, eyes, scar).
   - **Set R (standee, a touch rattier):** the same head with a slightly longer muzzle and visible front incisors, ears the same size or slightly smaller. Still clearly the standee rat, not a weasel.
   - Name them `head-neutral.png`, `head-snarl.png`, `head-hurt.png` for set S and `head-neutral-r.png`, `head-snarl-r.png`, `head-hurt-r.png` for set R.
   - **Hurt face: keep the A004/A005 expression the user loves** (squeezed-shut eyes, gritted wince) on the new head shape. Snarl: mouth wide, teeth bared.
4. **`fit-check.png`**: every part at its delivered placement over a faded `reference.png`, **and** the assembled parts over a faded standee (scaled to the same body height), so gaps in proportion are visible.
5. **`review.png`**: (a) the assembled new rat beside the standee and beside the T011 rig rat, same height; (b) **at game size**: Mouse Fighter standee at 130 px and the new rat at 136 px over Harbor Market, once with head set S and once with set R; (c) all parts on grey. Plus `prompt.md`, `HANDOFF.md` (what you measured, where fit is approximate).

## Acceptance
- Assembled at game size next to the standee, a viewer would call them **the same character**: same bulk, same limb thickness, same crouch, same outfit.
- Parts sit on the reference with no visible gaps at the joints in the fit check.
- Both head sets delivered; hurt face keeps its expression.
- Human: does this rat match the standee? Which head, S or R?

Out of scope: gear (A008's hood, helmet and hat get refitted to the chosen head in a later task, once the head is approved), weapons, colour variants, animation, importing into the game.
