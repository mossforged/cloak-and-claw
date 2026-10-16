# T020 - New rat spear and bow in game; two-handed spear hold and a full bow draw (Code)

**Modules:** `src/data/items/rat-spear.js`, `rat-bow.js`, `rat-arrow` art, `src/render/rig-grip.js`, `src/data/rigs/rat-raider-poses.js` (spear and bow poses), `src/data/rigs/rat-*.js` (near pinch hand swap), `assets/art/items/`, tests. **Read:** `assets/source/A012-rat-spear-bow/` (HANDOFF, `weapons.json`, `rig-source.json`, review), `src/render/CONTRACT.md`, `docs/design/rig-standard.md` (section 6 draw order).
**Needs:** T019 merged, A012 merged. **Autonomy:** human-gated (look in game).

Art redrew the spear, bow and arrow to match the new rat and added a near hand that pinches the bowstring (A012). In the review mock-ups the user spotted two pose problems that are the rig's job: **"the spearman's missing an arm"** (only the near hand holds the spear; the far hand is hidden behind the body, so the spear looks one-handed) and **"the archer rat could be drawing the string back further"**.

## Do
1. **Import** `spear.png`, `bow.png` (stringless; code draws the string), `arrow.png` into `assets/art/items/` (replacing A004's), and convert `weapons.json`'s points (full-source pixels: subtract the trim origin, multiply by the import scale) into the items' `grip`, `grip2`, `nock`, `tips`, `tip` fields. Keep each item's in-game size about the same as now (the spear's 140 px reach must still match its art), and the floor size the same.
2. **Near pinch hand:** add `hand-front-pinch` (A012 `rig-source.json` swap of `hand-front`) and use it for the bow draw, replacing T018's borrowed far hand turned 180 degrees.
3. **Spear: two hands, both visible.** The far hand closes on `grip2` mid-shaft and must be **seen gripping it**: draw the far grip hand **above the shaft** while the spear is held (a draw-order override for that hand during two-hand grips), so its fingers wrap over the shaft. The far arm can stay behind the body; only the hand comes forward. Near hand low by the hip on `grip`, point angled slightly up (the user's original spear-hold note). Check idle, walk, windup, thrust and hurt.
4. **Bow: full draw.** At full draw the pinch hand pulls the string back to **the ear / jaw line** (a much deeper `pull`), the bow arm straight out toward the target, head behind the arrow line, elbow of the drawing arm raised and back. The windup reads as the draw building to that point (existing timing; only the pose and pull distance change). The arrow sits on the string at the pinch until loosed.
5. Old case: timing, hitboxes, reach and AI unchanged (bot numbers identical); this is art and pose only.
6. Build label `t020 rat weapons v1`.

## Acceptance
- Headless: `npm test` passes; bot numbers identical to main; a test that both spear hands sit on the shaft (near on `grip`, far on `grip2`) and the far hand draws above the spear while gripping; a test that the pinch hand reaches the full-draw point at the end of the windup.
- Windowed (JPG) in `docs/screens/T020/`: spearman idle and mid-thrust showing both hands on the shaft; archer at full draw (string to the ear) and just after the loose; all three weapons on the floor next to the cutlass.
- Human: does the spearman clearly hold the spear in two hands, and does the archer's full draw look strong?

Out of scope: weapon damage or reach changes, new weapons, the rat body.
