# A012 - Rat spear, bow and arrow redrawn to match the new rat; near pinch hand (Art)

**Read:** `docs/design/rig-standard.md`, `docs/style-contract.md`, `docs/handoffs/asset-contract.md`, `assets/source/A010-rat-raider-standard/` (master, hands, `rig-source.json`, `cutlass-grip-check.png`), `assets/source/A003-harbor-props/rat-cutlass.png` (the style and finish to match), `assets/source/A004-rat-raider-rig/` (`spear.png`, `bow.png`, `arrow.png`: the old designs), `assets/art/enemies/rat-archer.png` (the art bible archer and his bow), `src/data/items/rat-spear.js` and `rat-bow.js` (how code uses the weapon points).
**Autonomy:** human-gated (look). **Deliver to:** `assets/source/A012-rat-spear-bow/` on branch `a012-rat-spear-bow`.

The rat is finished (A010 body, A011 gear) and in game, but the Rat Spearman and Rat Archer still carry the old A004 weapons, drawn for the old rat in a thinner style. Redraw them so they look like they belong with the new rat and the A003 cutlass: the same chunky, worn, hand-painted finish, bold outline, chipped edges. Weapons are items: the same drawing is held in the hand and lies on the floor (decision 2026-10-16), so each is drawn on its own, not on the rat canvas.

## Make
1. **`spear.png`**: a rough raider's spear. Wooden shaft with wraps and a red rag tied below the head (keep A004's idea), an iron head, chipped. Drawn **point-up, vertical**, about the old proportions (long enough for the 140 px thrust reach at game size). Look like the same smithy as the A003 cutlass.
2. **`bow.png`**: a short, recurved rat bow with wrapped grip, matching the art bible archer's bow. Drawn **vertical, belly facing right, with NO string** (code draws the string and pulls it back).
3. **`arrow.png`**: a crude arrow, fletching that matches the archer's hood colours, drawn **horizontal, point right**.
4. **`hand-front-pinch.png`**: the near hand pinching a bowstring, on **A010's canvas** with the same pivot as `hand-front` (cut from the existing near hands; paint only what's hidden). Add it to a small `rig-source.json` swaps block (`of: "hand-front"`).
5. **`weapons.json`**: measured points in each image's own pixels (so code can drop the numbers into `items/*.js`):
   - spear: `grip` (near hand, low on the shaft by the butt), `grip2` (far hand, mid-shaft), `tip`;
   - bow: `grip` (centre of the handle), `tips` (top and bottom string nocks), `nock` (string middle at rest);
   - arrow: `nock` (string end), `tip`.
6. **Review:**
   - Each weapon in the new rat's hands at game size: the spearman's two-handed hold (rear hand low by the hip, front hand mid-shaft, point angled slightly up), the archer at full draw (mock the string from `tips` to the pinch hand). Use the A011 helmet/jerkin and hood/quiver so they read in context.
   - All three on the Harbor Market floor at item size next to the A003 cutlass.
   - Old A004 vs new, side by side.
   - Plus `prompt.md` and `HANDOFF.md`.

## Acceptance
- At game size the spear, bow and arrow look like the same world and finish as the cutlass and the new rat.
- The measured points sit where the hands go (checked in the review mock-ups).
- Human: do these look right in the new rats' hands?

Out of scope: new weapon types, rat body changes, animation (code wires the points in a later task).
