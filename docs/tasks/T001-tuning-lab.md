# T001 - Tuning lab (code builder)

**Modules:** new `src/lab/`, small hooks in `src/game.js` if needed. **Read:** `src/data/CONTRACT.md`, `src/render/CONTRACT.md`, `src/data/moves/mouse-sword.js`, `src/data/rules.js`, `src/game.js`. **Needs:** nothing.
**Autonomy:** human-gated (the user judges whether the panel is easy to tune with).

The user wants to tune feel himself instead of describing it ("too floaty") and waiting for guesses. A lab page runs the real game with sliders that change the data live, then exports the changed numbers. In Stage 3 this same page grows into the cutout-rig tuning page, so build it to be extended.

## Do
1. New page `lab.html` (index.html stays as is). It runs the normal game plus a collapsible side panel (must not cover the arena on a 1280x800 laptop screen; on narrow screens it overlays and collapses).
2. Panel sections, built from a small schema file in `src/data/lab-schema.js` (which objects, which fields, slider min/max/step), not hard-coded UI:
   - Mouse Fighter moves (pick a move from a dropdown): windup, active, recovery, comboFrom, damage, knockback, hitstun, hitstop, shake, lunge, hitbox x/z/w/h, pose windup/active rot, sx, sy, dx.
   - Hero movement: walk, depth, jump. Rules: gravity, depthHit, maxAttackers, knockdown vz/vx/downFrames.
   - Rat Raider: walk, ratSlash windup/active/recovery/damage, ai range, hover, aggression, cooldown min/max.
   - Juice: shake decay/max, flashFrames, koHitstop, koShake.
3. Sliders write straight into the imported data objects, so changes apply on the next frame without reload.
4. Lab tools: slow motion (1x, 0.5x, 0.25x), "rats don't attack" toggle, "respawn wave", debug overlay on by default.
5. "Copy changes" button: copies only the values that differ from the defaults, as `file -> path: old -> new` lines, ready to paste to the lead or into a packet. "Reset" restores defaults. Save the current changes in localStorage (wrapped in try/catch) so a reload keeps them.
6. Link to the lab from the README.

## Acceptance
- Headless: `npm test` passes; sim files unchanged except where a hook is unavoidable (explain it). Add a test that the schema only names fields that exist in the data.
- Windowed: screenshots in `docs/screens/T001/`: panel open over the game; after changing slash3 hitstop to 20; the copied-changes text.
- Human: can the user make the combo feel the way he wants in under 10 minutes without asking anyone?

Out of scope: rig editing (Stage 3), changing default values, mobile touch controls.
