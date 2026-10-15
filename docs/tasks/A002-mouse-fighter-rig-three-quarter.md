# A002 - Mouse Fighter rig parts, three-quarter view + swap parts (art builder)

*(A revision of A001; delivered as its own ID per the asset contract.)*

**Read:** `docs/style-contract.md` (updated: three-quarter view), `docs/handoffs/asset-contract.md`, `assets/art/heroes/mouse-fighter.png` (**match this angle**), `assets/source/A001-mouse-fighter-rig/` (what we have; same part list), `docs/playtests/log.md` (2026-10-14 rig entry).
**Autonomy:** human-gated (the user approves the look).
**Deliver to:** `assets/source/A002-mouse-fighter-rig-3q/`

The user likes the rig, but A001's parts are too close to pure profile. Beat 'em ups draw characters turned toward the camera so the face and both arms read. The current standee has exactly the right angle. Big swings and emotion will use **part swaps**: alternate drawings of one part that the game switches at key moments.

## Make
1. `reference.png`: Mouse Fighter assembled, **three-quarter view toward the camera at the same angle as `assets/art/heroes/mouse-fighter.png`**, facing right, neutral stance, arms a little away from the body, sword held low in the near hand, shield on the far arm. Both eyes visible.
2. The same 14 parts as A001 (same names), drawn at that angle and **at exactly the reference's scale**: lay each part over the reference to check before cutting it out. Legs proportioned like the standee (short, sturdy).
3. Swap parts, same scale:
   - `torso-back.png`: torso turned three-quarter **away** from the camera (back and scarf knot visible) for the wind-up of big swings.
   - `head-neutral.png` (= `head.png`), `head-shout.png` (mouth open, battle cry), `head-hurt.png` (eyes squeezed, wince).
4. **Joint caps:** paint the rounded joint ends in the colour of the part they tuck under (fur or sleeve), not bright knobs. They must not show as coloured dots at elbows and knees.
5. Shield painted at the standee's angle (a slight ellipse), not face-on.
6. Light from the upper left on every part, shading like the standee.
7. Prefer separate PNG files per part. A sheet is acceptable only if every part is at the same scale as the reference.
8. `prompt.md`, `review.png` (parts on grey; reference at about 130 px over Harbor Market next to the current standee for angle comparison), `HANDOFF.md`.

## Acceptance
- All 14 parts + `torso-back` + 3 heads present, same scale as `reference.png` (state any part that isn't).
- Angle matches the standee in `review.png`'s side-by-side.
- No bright joint caps.
- Human: is this the angle and look you want him to move with?

Out of scope: animation, other characters, anything outside the delivery folder.
