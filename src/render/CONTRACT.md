# render: drawing and feel

**Owns:** backdrop, stage art, standees (pose, lean, squash, flash, tint), cutout rigs (part layout, joint poses, blends), effects, screen shake + hit-stop counters, HUD, debug overlay.
**Does not own:** gameplay state. Render reads `world` and listens to bus events; it never writes to fighters or world.

**Public API:** `createRenderer(ctx, assets)`, `createJuice()`, `drawStandee`, `drawRig`, `drawHud`, `drawDebug`.

**Rules:**
- Look numbers live in `src/data/juice.js`, move `pose`/`fx` blocks in `src/data/moves/` and rig parts/poses in `src/data/rigs/`.
- Render-only memory (rig pose blends) is kept in render, keyed by fighter, never written onto the fighter.
- Render-only randomness (sparks, shake) may use `Math.random`.
- Draw art from data paths only; a missing image shows a labeled placeholder.
- Part swaps (`swap` in rig poses) only change which image a part draws; pivots and attach points stay in the part's own pixels.
- `opts.pose` (C key) holds a named rig pose on the hero for viewing; it never touches the fighter.
