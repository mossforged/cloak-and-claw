# render: drawing and feel

**Owns:** backdrop, stage art, standees (pose, lean, squash, flash, tint), cutout rigs (part layout, joint poses, blends, held weapons in hand slots), props and floor items, effects (incl. debris), screen shake + hit-stop counters, HUD, debug overlay.
**Does not own:** gameplay state. Render reads `world` and listens to bus events; it never writes to fighters or world.

**Public API:** `createRenderer(ctx, assets)`, `createJuice()`, `drawStandee`, `drawRig`, `layoutRig`, `heldOf`, `drawHud`, `drawDebug`, `stepViewPose`.

**Rules:**
- Look numbers live in `src/data/juice.js`, move `pose`/`fx` blocks in `src/data/moves/` and rig parts/poses in `src/data/rigs/`.
- Render-only memory (rig pose blends) is kept in render, keyed by fighter, never written onto the fighter.
- Render-only randomness (sparks, shake) may use `Math.random`.
- Draw art from data paths only; a missing image shows a labeled placeholder.
- Part swaps (`swap` in rig poses) only change which image a part draws; pivots and attach points stay in the part's own pixels.
- Held weapons are generic: a kit's `grip` names a rig slot (`rig.slots`), the kit gives image, grip point, rest angle and `px` size; the weapon follows the slot part's joint. New grip types (two-hand, bow: T011) = a new slot + kit data. Debris pieces live only in render memory.
- `opts.pose` (C key) shows a named rig pose on the hero for viewing (once, from idle; `view-pose.js`); it never touches the fighter.
