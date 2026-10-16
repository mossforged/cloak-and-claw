# T018 - Import the new rat (A010) into the game (Code)

**Modules:** `src/data/rigs/rat-raider*.js` (rebuilt from A010), `src/data/rigs/rat-raider-poses.js` (standard part names), `src/render/rig-grip.js` (hands as separate parts), `src/data/fighters/rat-*.js`, `assets/art/enemies/rat-raider/rig/`, `tools/rig_from_source.py`, tests. **Read:** `docs/design/rig-standard.md`, `assets/source/A010-rat-raider-standard/` (HANDOFF, `rig-source.json`), `src/render/CONTRACT.md`, `src/data/rigs/biped-poses.js`, `docs/decisions.md` (2026-10-16).
**Needs:** T017 merged, A010 merged. **Autonomy:** human-gated (look in game).

The new rat (A010, head R) passed the look check in the rig bench. The user: "he looks much better, much closer to the standee". This task replaces the stopgap T011 rat with him, in game, for all three rat types.

## Do
1. **Import with the draft importer** (`tools/rig_from_source.py`, T016) from A010's `rig-source.json`: key and trim the parts into `assets/art/enemies/rat-raider/rig/` (replacing the A004/A005 files), write the rig data. Remove the T011 scale fudges: **uniform scale only** (standard rule 5); if anything needs over 5%, report it instead of fudging.
2. **Standard part names:** the rig now has `pelvis`, separate `hand-*` and `foot-*`. Rework the rat poses (stance crouch, walk, attack, hurt, knockdown, down, get-up, held when grabbed, thrown) onto those names; start from `biped-poses.js` and the old rat poses. The crouch must still read hunched and coiled. Fix the bench's odd head roll in knockdown/down for the rat.
3. **Hands:** swap hands per action using the library (open when idle/hurt, fist on the far hand when walking, grip on weapons, pinch on the bow string). Rework `rig-grip.js` so the grip IK places the **hand parts** (no more far-forearm swaps).
4. **Weapons: the rat holds the cutlass he drops** (decision 2026-10-16): the Rat Raider's held weapon is the `rat-cutlass` item art, attached at `hand-front` with its grip point, like floor weapons. The KO drop is the same item, so what he swings is what falls. Spearman and archer keep their kits (spear, bow) on the new hands.
5. **Gear:** A008's overlays were drawn for the old head and won't fit. Until A011 delivers refitted gear, show spearman and archer apart with a **temporary tint** on the bandana/clothes (data, removed when gear lands) and hide the old gear. Note what's hidden in the report.
6. **Front upper arm:** A010 puts it behind the torso (band 590, to hide a seam). Check it during strikes when the arm crosses the body; report if it vanishes wrongly.
7. Bench fixture stays; `rig-bench.html?src=A010-rat-raider-standard` must still work.

## Acceptance
- Headless: `npm test` passes; sim unchanged (bot numbers identical: this is art and poses only); rig tests updated for the new part list (every pose names only existing parts; the cutlass attaches at the hand grip; the KO drop is the same item id).
- Windowed (JPG) in `docs/screens/T018/`: the three rat types crouched beside Mouse Fighter; a rat mid-swing with the cutlass; a KO with the dropped cutlass on the floor; hurt and knockdown; spearman thrust and archer draw with the new hands.
- Human: do the rats in game look like the standee, and does the crouch, swing and knockdown read well?

Out of scope: gear refit and face details (A011), new enemy types, any change to rat behaviour or numbers.
