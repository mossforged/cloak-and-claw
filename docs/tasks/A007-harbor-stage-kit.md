# A007 - Harbor Market stage kit: layered, scrolling, 120 px floor (art builder)

**Read:** `docs/style-contract.md`, `docs/handoffs/asset-contract.md`, `docs/decisions.md` (target belt depth ~120 px; stage art briefed to gameplay numbers), `docs/design/lessons.md` (modular stage pieces), `assets/art/stages/harbor-market.png` (the current single-picture arena: **keep its look, palette and props**), `docs/concepts/art-bible/contact-sheet.jpg`.
**Autonomy:** human-gated (the user approves the look). **Deliver to:** `assets/source/A007-harbor-stage-kit/`

Stage 5 turns the single-screen arena into a stage you walk through from left to right (Golden Axe style). The current Harbor Market is one painting with a shallow floor (63 px of walkable depth). The new kit is **layers** so the camera can scroll, with a **floor deep enough to fight in (about 120 px)** at game scale. The game view is **960 x 540**; characters are about 130 px tall.

## Layers (separate PNGs, transparent or flat #00FF00 where things are cut out)
1. `far.png`: the distant view behind everything: sea, a far headland or lighthouse, distant sails. Scrolls slowly (parallax). Wide (at least 1920 px at game scale), seamless left-right if you can. No floor.
2. **Back wall segments** (`back-1.png`, `back-2.png`, `back-3.png`): the market behind the walkable floor, the same kind of scenery as now (stalls with blue-and-white awnings, houses, a moored ship, barrels, crates, lanterns). Each about **1440 px wide x 540 tall at game scale**, ending at the back edge of the floor. Put a natural divider at each segment's left and right edge (a post, an archway, a stack of crates) so segments can be placed side by side and the joins hide. Suggested order: (1) market entrance with an arch, (2) busy stalls and the ship, (3) the end of the pier with a warehouse door (a natural "boss" spot later).
3. `floor.png`: the walkable stone dock surface, **horizontally tileable**, at game scale **about 120 px from its back edge to its front lip**, plus the dock's front face (stone and timber, rope, a strip of water below) under it. Flat and readable: no big objects on the walking surface (props are placed by code). Low-contrast texture so fighters stand out.
4. `front-*.png` (3 to 5 pieces): foreground props that pass **in front of** fighters as the camera scrolls: dock posts with rope, a hanging net, a lamp post. Sparse, mostly at the bottom edge so they never hide a fighter's body.
5. `review.png`: a mock 960 x 540 frame: far + back segment 2 + floor + one front prop, with Mouse Fighter (130 px) and a rat (136 px) standing at the **back** and **front** of the floor, and the floor depth marked. Plus a wide strip showing back-1/2/3 placed in a row.
6. `prompt.md`, `HANDOFF.md` (note the scale used and any seams you couldn't hide).

## Acceptance
- Floor depth about 120 px at game scale, flat and readable; back wall meets the floor's back edge cleanly.
- Same look and palette as the current Harbor Market; segments line up with hidden joins.
- Human: does it look like the same market, and is it a place you want to fight through?

Out of scope: sky (the code draws it), animation, code.
