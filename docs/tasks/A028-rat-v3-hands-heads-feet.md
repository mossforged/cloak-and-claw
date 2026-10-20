# A028 - Rat v3: the hands, heads and feet the moves use (three-quarter) (Art)

**Read:** `docs/design/rigs/rat-v3-plan.md`, `docs/design/rigs/rat-v3-joints-v4.json` (the user's points: wrist, neck, ankle), `assets/source/A027-rat-v3-body/` (the accepted v3 pieces and HANDOFF), `docs/screens/T035/missing.md` (what the moves ask for), the approved designs to rebuild: `assets/source/A018-rat-parts/` and `assets/source/A023-rat-complete-kit/` (hands, heads, feet). **Needs:** A027 (merged), T035 (merged). **Autonomy:** auto-ok up to the handoff. **Deliver to:** `assets/source/A028-rat-v3-kit/` (LFS) + phone JPGs in `docs/screens/A028/`.

The user watched the v3 rat play every move beside the old one and approved it (2026-10-20: "this is good"). Its moves still show the plain fists, the neutral head and flat feet where a move asks for another drawing, and it holds no weapons because it has no grip hands. This round draws those swaps for the three-quarter view, by the method that worked (A026/A027).

## Draw (each a swap of an existing v3 piece: same canvas, same joint point, same rules)
1. **Hands, near and far:** open, palm, back, cup, point (near), pinch + pinch-under (near), grip, grip-overhand, grip-under, grip-overhand-under, shield (far). Each one is the A018/A023 design of that hand rebuilt on v3's `hand-near` / `hand-far`: **the cuff is part of the hand** (as on v3), its hidden end the dome centred on the wrist point, and at rest it fits the v3 forearm exactly like the v3 fist. Split grips (`-under`) as A023 did them: the fingers in front of the item, the palm behind.
2. **Heads:** attack, effort, hurt, ko, shout, drink, each a swap of v3's `head` on the neck point, the same hidden neck dome under the collar (so the neck range −20..61 still holds).
3. **Feet, near and far:** heel, toe; `foot-near-out` (turned out). Swaps of v3's feet: the wrap on the foot, the dome on the ankle point.
4. Same look: A018/A023's designs, v3's line weight and light. No new designs.

## Self-check before delivering
- `swaps.jpg`: each swap beside the v3 drawing it replaces, at rest on the v3 rat, full size and 136 px; a flicker strip per joint (base ↔ swap) shows no jump at the wrist, neck or ankle.
- `sweep-*.jpg`: one hand, one head and one foot swap through the user's range (wrist, neck, ankle), five samples.
- For each grip hand, mark where the handle runs through the fist on `grips.jpg` (a straight line through the closed fingers), so the user can redraw his grip lines on them quickly.

## Deliver
The PNGs, `rig-source.json` (swaps per part, joint point, which item grips each hand takes), self-check images, `prompt.md`, `HANDOFF.md`; phone JPGs in `docs/screens/A028/`. `importReady: true` when every swap sits on its joint with no jump and no gap through its range.

Out of scope: other views (side, front, back: next), whole-limb drawings (v3's jointed limbs do those moves by IK), gear.

## Also (lead, 2026-10-20): the joint checker
T036 merged `tools/joint-check.mjs` (see AGENTS.md). Run it on your delivery with `--joints docs/design/rigs/rat-v3-joints-v4.json` and include `joint-check.jpg`. On the current v3 body it flags three faults to fix while you're in there: **near shoulder** gap at −116, −93 and +21 and seams at −47 / −25; **waist** seam (second outline under the belt) at +15; **far ankle** gap at +40 (`docs/screens/T036/a027-current/joint-check.jpg`).
