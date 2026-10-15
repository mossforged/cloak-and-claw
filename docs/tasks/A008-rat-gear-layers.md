# A008 - Rat Raider gear layers: archer hood, spearman helmet + jerkin, captain hat + sash (art builder)

**Read:** `docs/style-contract.md`, `docs/handoffs/asset-contract.md`, `docs/decisions.md` (2026-10-15 assembly line: body x colour x weapon kit x **gear layer**), `assets/source/A004-rat-raider-rig/` (torso, torso-back, `part-layout.json`, reference), `assets/source/A005-rat-raider-head-legs/` (heads, `part-layout.json`), `assets/art/enemies/rat-raider.png`.
**Autonomy:** human-gated (look). **Deliver to:** `assets/source/A008-rat-gear-layers/`

Gear layers are **overlay parts** drawn on top of the existing rat parts (same canvas, scale, angle and light as A004/A005), so one rat body becomes visibly different enemies. The code builder will attach them to the head and torso bones in T011 or after it.

## Make (transparent PNGs on the A004/A005 canvas, aligned so they sit exactly on the part they cover)
1. **Archer:** `gear-hood.png`: a short green-brown hood that drapes over the A005 head shape with the ears **poking through slits** (ears stay visible: he must still read as a rat). Plus `gear-hood-back.png` for the torso-back view and `gear-quiver.png` (a quiver on the back, a few arrows, fits `torso.png`).
2. **Spearman:** `gear-helmet.png`: a dented open-faced iron cap, ears out; `gear-jerkin.png`: a padded leather jerkin over `torso.png`; `gear-jerkin-back.png` over `torso-back.png`.
3. **Captain (later mini-boss look):** `gear-captain-hat.png`: a battered tricorn with a feather; `gear-sash.png`: a wide red sash and belt over `torso.png` (matches the bandana red).
4. Each head-gear piece must fit **all three heads** (neutral, snarl, hurt) without redrawing; if one can't, deliver a variant and name it (`gear-helmet-hurt.png`).
5. `review.png`: the assembled rat in each loadout (plain, archer, spearman, captain) at 136 px next to Mouse Fighter at 130 px over Harbor Market, plus each gear piece on grey; a strip showing each head gear on all three heads. Plus `prompt.md`, `HANDOFF.md` (anchor offsets in `part-layout.json` coordinates).

## Acceptance
- At game size, each loadout reads as a **different enemy at a glance** (silhouette changes, not just colour), and still as the same rat people.
- Gear sits on the parts with no gaps or floating edges in the review assembly.
- Human: would you want to fight each of these?

Out of scope: new bodies, weapons (A004 has them), colour variants (code tints), animation.
