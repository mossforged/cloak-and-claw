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
- Compare versions of a rig (old vs new during an import) are registered in `models.js` `VERSIONS`, view only; their art
  is preloaded (`VERSION_RIGS`). T026: `a010` = the rats before the rebuild (`src/data/rigs/a010/`). T035: `v3` = the
  redrawn rat (`src/data/rigs/rat-v3.js`) for the raider and the spearman; the pose page takes `&version=<v>`.
- The URL holds the whole view (`state.js`); a new option = a state field + parse/format + the round-trip test.
- T028 rehearsal sheet: `viewer.html?rehearse=<body>` (`rehearse.js`, browser; `rehearse-frames.js`, pure) draws every key of
  `src/data/rehearsal/<body>.js` with the real rigFrame; a drawing not in the rig yet is a labelled red box, never invented art.
- T031 drag to pose: `viewer.html?pose=<fighter>&from=<clip>:<frame>&item=<id>[&j=...&sw=...]` (`pose.js`, `pose-panel.js`, browser;
  `pose-drag.js`, `pose-state.js`, pure: Node tests `tests/pose-drag.test.mjs`). The pose is a clip frame's joints and drawings,
  drawn as a held pose through the game's rigFrame / drawRig; drags change only the page's copy (never the data files). Limits:
  wrists from `data/wrists.js`, ankle / neck / knee from `data/pose-limits.js`, the elbow's from `WRISTS.elbowMax`.
