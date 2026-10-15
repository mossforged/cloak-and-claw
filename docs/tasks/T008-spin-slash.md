# T008 - slash2 becomes a spinning horizontal cut (code builder)

**Modules:** `src/data/rigs/mouse-fighter-poses.js`, `src/data/moves/mouse-sword.js` (`pose`/`fx` blocks only), maybe `src/render/rig-pose.js`. **Read:** `src/render/CONTRACT.md`, `src/data/rigs/mouse-fighter-poses.js`, `docs/screens/T005/`.
**Needs:** T005 (merged). Run after T006/T007 (one code session at a time). **Autonomy:** human-gated (looks).

The user's idea: now that Mouse Fighter has a back-view torso, slash2 can be a flat horizontal cut where he **turns his back mid-swing**. It also fixes slash2 never being horizontal (the back view was the missing drawing). Classic beat 'em up spin slashes read as a turn because one in-between drawing (the back) is swapped in during the fastest part.

## Do
1. slash2 rig poses, keyed to its existing phases:
   - windup: sword drawn back low across the body, `torso` front, slight crouch;
   - early active: swap to `torso-back` (+ head turned with it if it reads better; try `head-shout`), sword arm extended flat behind, body rotated;
   - late active: swap back to `torso`, sword sweeping flat out in front at shoulder height, `head-shout`;
   - recovery: settle to idle.
2. Swoosh: a flat, wide arc that wraps around the body (the `flat` ellipse from T003), drawn behind him for the back half and in front for the front half if possible.
3. **Gameplay unchanged:** same windup/active/recovery frames, hitbox and damage. (A hitbox that also hits behind is a later design call: noted for a possible crowd-clearing spin special.)
4. Update the rig test for the new slash2 swap timing.

## Acceptance
- Headless: `npm test` passes; `src/sim/` and move timing/hitbox unchanged.
- Windowed: `docs/screens/T008/`: filmstrip of slash2 (every 2 frames), and the full combo filmstrip.
- Human: does slash2 now read as a flat spinning cut?

Out of scope: a 360 special move, changing hitboxes, the cast pose.

## Addendum (lead, 2026-10-14)
- **Cast pose key bug (from T006 report):** pressing C latches the `cast` pose until C is pressed again, and he can move and attack while drawn in it. Make C play the cast pose once (about 1 s, then back to normal), only from idle, and ignore it during attacks/hurt. Keep it a view-only test pose (no gameplay effect).
