# A011 - Rat Raider finishing set: gear refit, recolour masks, face details (Art)

**Read:** `docs/design/rig-standard.md` (sections 7 and 7a), `assets/source/A010-rat-raider-standard/` (master, parts, `rig-source.json`), `assets/source/A008-rat-gear-layers/` (the old gear, drawn for the old rat), `docs/decisions.md` (2026-10-16 entries).
**Needs:** A010 merged. **Autonomy:** human-gated (look). **Deliver to:** `assets/source/A011-rat-raider-finishing/` on branch `a011-rat-raider-finishing`.

The new rat (A010, head R) passed the look check. This is the standard's last gate (G4) for his body: the gear and variety pieces that turn one rat body into a crowd of different rats. All pieces sit on A010's canvas, aligned to the A010 parts, and are listed in a `rig-source.json` `overlays` block (`on` = the part they ride on).

## Make
1. **Gear refit** to the A010 body and head R (redraw from A008's designs, cut and fitted to the new parts; don't regenerate the rat): archer `gear-hood` (ears through slits) + `gear-quiver`; spearman `gear-helmet` + `gear-jerkin`; captain `gear-captain-hat` + `gear-sash`. Each head piece must fit **all six heads** (neutral, attack, hurt, effort, KO; back gets its own `-back` version) or come with named variants. The jerkin and sash need `-side` and `-back` versions for the torso swaps.
2. **Recolour masks** (standard section 7): a grey mask per part for the recolourable cloth: bandana and scarf tails, trousers, tunic/vest. Name `<part>-mask.png`, same canvas. Fur gets its own mask set (`<part>-fur-mask.png`) for small fur shifts.
3. **Face details** (standard 7a): 4 small overlays that fit all six heads: `detail-eyepatch`, `detail-scar2` (a second scar on the other cheek), `detail-ear-notch` (torn ear), `detail-earring`.
4. **Review:** the plain rat, archer, spearman and captain at game size over Harbor Market beside Mouse Fighter; each head gear on all six heads; a row of 6 "individual" rats (random detail + tint combinations, mocked up) to show the crowd variety; masks shown as tinted examples. Plus `prompt.md`, `HANDOFF.md`, updated `rig-source.json` overlays.

## Acceptance
- Gear sits on every head and torso view with no gaps or floating edges.
- Each loadout reads as a different enemy at a glance; six "individual" rats read as six different rats of the same people.
- Human: are these the rats you want to fight, and does the crowd look varied?

Out of scope: the spear and bow drawings (A004's stay for now), new enemy types, animation.
