# A010 - Rat Raider: bring A009 up to the rig standard (Art)

**Read:** `docs/design/rig-standard.md` (**approved; this packet follows it**), `docs/style-contract.md`, `docs/handoffs/asset-contract.md`, `assets/source/A009-rat-raider-standee-rig/` on branch `a009-rat-raider-standee-rig` (HANDOFF, reference, parts, part-layout.json, measurements.json), `assets/art/enemies/rat-raider.png` (the standee).
**Autonomy:** human-gated (look). **Deliver to:** `assets/source/A010-rat-raider-standard/` on branch `a010-rat-raider-standard`.

## Why
A009 was a big step: the user agrees the rat now reads as the standee's character. It was made before the rig standard was approved, so it misses pieces the standard requires, and the user noted **the sword looks worse than the standee's**. A009's `reference.png` is now the rat's **master** (G1 passed, with the head set below). This task finishes **G2** (the parts) and the minimum swap library.

**Head set: R** (the user's pick, 2026-10-16: the standee head with a slightly longer muzzle and visible front teeth). Drop set S.

## Do
0. **Repo size:** branch from `main` (not from the A009 branch). Copy A009's delivered files into the new folder as your starting point, but **do not copy A009's `generated/` folder** (32 MB of raw outputs). Keep `prompt.md` provenance as text. The lead merges A010 instead of A009.
1. **Cut, don't regenerate** (standard section 5): every new or changed part is cut from the master (`reference.png`), using the image tool only to paint in what was hidden at the joints.
2. **Missing parts** (standard section 3, exact names):
   - `pelvis`: hips and the seat of the trousers. The thighs pivot on it, so the crotch stays closed in the crouch.
   - `foot-front`, `foot-back`: split the wrapped feet off the shins at the ankle (round joint, hidden area painted).
   - `hand-back`: split the far claw off `arm-back-lower`.
   - Rename A009's `hand-front-grip` to the standard's names (below), and make sure `arm-front-lower` ends at the wrist.
3. **Hand library** for both hands (standard section 4): `hand-front-open`, `hand-front-fist`, `hand-front-grip` (closed round a handle, with a gap for the shaft), and `hand-back-open`, `hand-back-fist`, `hand-back-grip`, `hand-back-pinch` (bow string). The fists and grips are the standee's chunky wrapped paws.
4. **Sword:** redraw `sword.png` as the **standee's cutlass**: same blade shape, chipped edge, gold guard and grip, at the standee's size relative to the body. A009's review reused A004's old sword, which is why it looked worse.
5. **Heads in the chosen set:** add `head-effort` (gritted, bracing), `head-ko` (dazed, eyes shut), `head-back` (back of the head with ears), matching neutral/attack/hurt. Keep the hurt face's expression. (Snarl stays as the `attack` head: name it `head-attack.png`.) Drop the unchosen set.
6. **Torso library:** `torso-side` (turned side-on, for horizontal cuts) and keep `torso-back`. Deliver `master-back.png` (the whole rat from behind, same canvas) as the reference for the back views.
7. **Pivots measured:** deliver `rig-source.json` in the standard's format (section 5, rule 4): every part, its parent, its joint point measured on the master, its draw band, and every swap. Keep A009's `part-layout.json` only as provenance if useful.
8. **Review:**
   - `assembled.png`: all parts at rest over the faded master; it should look like the master, with no visible drift.
   - `review.png`: assembled rat beside the standee at full size and at game size (Mouse Fighter 130 px, rat 136 px over Harbor Market); every part and swap on grey with its name; the sword beside the standee's sword.
   - Plus `prompt.md` and `HANDOFF.md` (what's still approximate).

## Acceptance
- Every part name in the standard's biped list is present, plus the swaps listed here; nothing generated from scratch.
- Reassembled at rest, the rat matches the master.
- The sword matches the standee's.
- Human: does the reassembled rat still match the standee, and does the sword look right now?

Out of scope (later, G4 after the motion test): recolour masks, face-detail overlays (standard 7a), gear refit (hood, helmet, hat), key drawings for big moves, spear/bow redraws.

## Addendum (lead, 2026-10-16, after review): finish on the same branch
User on the review: the rat "looks much better, much closer to the standee". Look approved (G2 and the bench motion strip). Two fixes, as a follow-up commit on `a010-rat-raider-standard`:
1. **Add `rig-source.json`** in the standard's format (rig standard section 5, rule 4), generated from your `part-layout.json`: parts (`img`, `parent`, `pivot` = `pivot_canvas`, `band` = `depth`), swaps (entries with `replaces` become `swaps` with `of`), `master`, `floorY` (the baseline). The lead's bench run used exactly this conversion and it worked.
2. **The sword:** the user found the blade unfinished (the back edge stops short of the guard). **Decision: the rat holds the same cutlass he drops** (`assets/source/A003-harbor-props/rat-cutlass.png`, already in the game as the floor weapon). Leave `sword` out of `rig-source.json` (the weapon is attached by code from the item, like floor weapons) and don't redraw it. Keep `sword.png` in the folder only as provenance, or delete it. Check that `hand-front-grip`'s slot can take the A003 cutlass handle and say so in HANDOFF.
