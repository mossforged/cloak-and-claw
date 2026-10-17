# viewer: the model viewer (T027)

**Owns:** `viewer.html`'s page: which characters, clips, held items, grip modes, looks and compare versions it offers;
its private sandbox worlds; its drawing, overlays, transport and URL state.
**Does not own:** gameplay or look numbers (it reads `src/data/` and runs the real `src/sim/` and `src/render/`), the game
page (`index.html` / `src/game.js` are never loaded or changed).

**Rules:**
- Everything shown comes from the registries and rig data: a new fighter with a rig, a new move, item or rig pose shows
  up without touching the viewer. Clips drive the real sim (inputs and direct sim calls) so timing is the game's.
- Sandbox worlds are the viewer's own (`createWorld` + `stepWorld`, no props, no waves); the game's world is never touched.
- `models.js`, `clips.js`, `sandbox.js`, `state.js` are pure (Node tests: `tests/viewer.test.mjs`); `scene.js`,
  `overlays.js`, `ui.js`, `main.js` are browser only.
- Compare versions of a rig (old vs new during an import, hold variants) are registered in `models.js` `VERSIONS`, view only.
- The URL holds the whole view (`state.js`); a new option = a state field + parse/format + the round-trip test.
