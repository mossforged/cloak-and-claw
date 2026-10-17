# T025 - Weapon node, grip modes and the hand that follows the weapon (Code)

**Modules:** `src/render/rig-grip.js`, `src/data/items/*` (grip metadata), `src/data/rigs/*` (grip slots), `tools/hold-sheet.html`, `tests/weapon-hold.test.mjs`. **Read:** `docs/studies/2026-10-17-rig-art-inventory.md` sections 5-6 (weapons); T020's notes in `docs/history.md`; `docs/design/rig-standard.md` section 5a (weapons, 2026-10-17). **Needs:** T024 (near/far names, stretch test). **Autonomy:** human-gated (the user judges holds in the hold sheet and in game).

T020 took four rounds because the hand led and the weapon followed: a short near arm could not hold an overhand fist low, and the cutlass needed a per-pose flip. The professional method (Spine's two-handed weapon rig) is the reverse: the weapon is a node of its own, the hands are placed on its grip markers, and the hand drawing copies the weapon's rotation. Overhand, underhand and reverse holds then become data, not art.

## Do
1. **Weapon node.** A held item is a node parented to the rig root (not to the hand), positioned by the pose (`weapon: { x, y, rot }` per pose, with sensible per-kit defaults). Items keep `grip` / `gripEnd` (handle axis: grip at the pivot, business end along +X) and gain `grip2` where two-handed (the spear has it), `tip`, and a `stow` anchor (hip / back) for sheathed drawing.
2. **Hands follow the weapon.** For each grip marker the matching hand's 2-bone IK reaches the marker (existing `reach`), and the hand part's rotation copies the weapon's rotation with a per-grip-mode offset. **Grip modes** as data on the pose or kit: `side` (today's), `overhand` (fist over the shaft, 180 offset, uses `hand-near-grip-overhand` when the drawing exists, else the side grip turned), `underhand`, `reverse`. Unarmed poses are untouched (mix 0 when no item).
3. **Far hand draw order on two-handers:** the far hand on a spear/bow/club draws in a band above the shaft (an overlay band, as Spine's Goblins thumb overlay), so the spearman never "loses an arm".
4. **Per-pose flip** stays as a flag but should rarely be needed; report where it still is.
5. **Grip test:** extend the stretch strip (T024) and `tools/hold-sheet.html` with every item x every body that can hold it x every grip mode, flagged when the handle axis leaves the fist by over 2 px or the hand draws under the shaft. `npm test` runs it.

## Acceptance
- Headless: tests pass; hold test zero flags for cutlass, club, fish, spear, bow on mouse and rat; bot runs identical (render only).
- Windowed: `docs/screens/T025/` hold sheet per body; in-game stills: spearman overhand low, archer at full draw, mouse with cutlass in idle / strike / walk.
- Human: do the holds look held, with no flip, in every pose? Does the overhand spear read?

Out of scope: new hand drawings (polish rows in the rig sheet), smears, gear.
