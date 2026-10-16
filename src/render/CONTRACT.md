# render: drawing and feel

**Owns:** backdrop, stage art, standees (pose, lean, squash, flash, tint), cutout rigs (part layout, joint poses, blends, held weapons in hand slots), props and floor items, effects (incl. debris), screen shake + hit-stop counters, HUD, debug overlay.
**Does not own:** gameplay state. Render reads `world` and listens to bus events; it never writes to fighters or world.

**Public API:** `createRenderer(ctx, assets)`, `createJuice()`, `drawStandee`, `drawRig`, `braceLayer`, `layoutRig`, `heldOf`, `restIn`, `handleAngle`, `gripLayout`, `gearLayout`, `tintPixels`, `drawHud`, `drawDebug`, `stepViewPose`, `squatOf`, `feelLayer`.

**Rules:**
- Look numbers live in `src/data/juice.js`, move `pose`/`fx` blocks in `src/data/moves/` and rig parts/poses in `src/data/rigs/`.
- Render-only memory (rig pose blends) is kept in render, keyed by fighter, never written onto the fighter.
- Render-only randomness (sparks, shake) may use `Math.random`.
- Draw art from data paths only; a missing image shows a labeled placeholder.
- Part swaps (`swap` in rig poses) only change which image a part draws; pivots and attach points stay in the part's own pixels. A swap may also hide other parts and carry children onto its own image (`hide`, `carry`): still drawing only, no bones or gameplay change.
- Held weapons are generic: a kit's `grip` names a rig slot (`rig.slots`), the kit gives image, grip point, rest angle and `px` size; the weapon follows the slot part's joint. New grip types (two-hand, bow: T011) = a new slot + `rig.grips` entry + kit data; `rig-grip.js` bends the second arm by IK onto the kit's point (spear shaft, bow string) and draws the bow string and nocked arrow. T020: a rig's `axes[grip]` (the fist's slot axis) and the item's `gripEnd` (handle axis) turn the item so its handle runs through the fist (`restIn`); a grip may `align` the IK fist round the shaft, change draw `order` while gripping, and draw a bow to an `anchor` on the body (the ear). A fighter's `kit` (or look-only `art.held`, T018) is drawn the same way; once a KO'd fighter has dropped that item his hand is empty. Debris pieces live only in render memory.
- Scrolling stages (T013, `layers.js`): far/back/floor/back decor drawn before the world, front decor after it; the world layer is shifted by `-round(w.cam.x)`. The HUD and debug get `camX` for anything placed at world positions.
- `opts.poses[slot]` (C key, slot 0) shows a named rig pose on that hero for viewing (once, from idle; `view-pose.js`); it never touches the fighter.
- Bracing loop (T015, `brace.js`): a rig with `brace` data breathes, sways and twitches while blocking (not in blockstun); legs are re-solved so the boots never leave their spot. Render memory only.
- Weapon feel (T017, `weapon-feel.js` + rig `kits` poses): a held floor weapon may have its own idle/walk and move poses on a rig (`poses.kits[<item id>]`, falling back to the borrowed sword pose) and a kit `feel` (wobble spring, impact squash); moves may carry view-only `fx.dust`, `fx.shake`, `fx.drops`. None of these change sim numbers.
- Heroes (T021): HUD draws one panel per hero (slot x 320 px along the top); heroes on slots 1, 2 are drawn with `JUICE.heroes.filter[slot]` (a canvas filter: the test hero is a tinted Mouse Fighter) and tagged P1-P3 when there is more than one.
- Gear and looks (T019, `looks.js`): gear overlays (a fighter's `art.gear` loadout + its `look.detail`) ride their part, picking the variant for the part's current swap from `rig.views`; cloth/fur masks (`rig.masks`) recolour images per look, cached per image + look (never per frame); `look.size` scales the drawn rig only. Render reads `f.look`, never writes it.
