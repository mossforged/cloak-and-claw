# render: drawing and feel

**Owns:** backdrop, stage art, standees (pose, lean, squash, flash, tint), effects, screen shake + hit-stop counters, HUD, debug overlay.
**Does not own:** gameplay state. Render reads `world` and listens to bus events; it never writes to fighters or world.

**Public API:** `createRenderer(ctx, assets)`, `createJuice()`, `drawStandee`, `drawHud`, `drawDebug`.

**Rules:**
- Look numbers live in `src/data/juice.js` and move `pose`/`fx` blocks in `src/data/moves/`.
- Render-only randomness (sparks, shake) may use `Math.random`.
- Draw art from data paths only; a missing image shows a labeled placeholder.
