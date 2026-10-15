# T013 - Harbor Market as a scrolling layered stage (code builder)

**Modules:** `src/data/stages/harbor-run.js` (new) + registry line, `src/sim/` (camera + wave zones, new small file), `src/render/backdrop.js` (or a new `layers.js` if it grows), `src/data/lab-schema.js`, `assets/art/stages/harbor/`, `tests/`. **Read:** `assets/source/A007-harbor-stage-kit/HANDOFF.md` (the measurements), `src/data/stages/harbor-market.js`, `src/sim/waves.js`, `src/render/CONTRACT.md`, `src/sim/CONTRACT.md`.
**Needs:** T011 merged (queue order: T010, T012, T011, then this). **Autonomy:** build to the end; human gate is the look and feel.

A007 (approved by the user 2026-10-15) delivered a layered Harbor Market: `far.png`, `back-1/2/3.png`, `floor.png`, `front-post/net/lamp.png`. This task turns it into the first scrolling stage (Stage 5 core; touch controls are not in this task).

## Do
1. **New stage, old one untouched.** Add `harbor-run` as a new stage. `harbor-market` (single-screen arena) keeps giving exactly the old result; `START_STAGE` picks which one loads (default: `harbor-run` once it works; keep a `?stage=harbor-market` URL switch).
2. **Import the layers** with `tools/key_green.py --scale` (they already have alpha; just trim/scale). **One uniform scale per layer, then crop.** Do not copy the review's independent vertical squash: buildings must keep their proportions. Fit each back segment so its scenery baseline sits on the floor's back edge; crop sky or transparent margin as needed.
3. **Floor:** walkable belt about **120 px deep** (back edge ~y 390, front ~y 510, matching the review frame). The floor tiles horizontally under the camera.
4. **Floor contrast:** draw the floor slightly dimmed/flattened (data value, e.g. `floorShade: 0.15` black overlay or a saturation drop) so fighters read clearly on it. Pick a default that reads well; lab slider optional.
5. **Hide the joins:**
   - Back segments sit end to end (1 / 2 / 3 / 1 ... or a data-listed sequence). Place a foreground prop (`front-post`, `front-lamp` or `front-net`) so it covers each segment join on screen; place props in data (`x`, which prop, layer), not code.
   - The floor repeat seam: offset props or a narrow cross-fade so the seam isn't a hard vertical line. If a seam still shows, report it (it may go back to the art builder).
   - Foreground props stay low and sparse (HANDOFF suggests visible heights post ~48, net ~45, lamp ~64 px) and are drawn **in front of fighters** but must never hide a fighter's whole body; if one would, it goes semi-transparent while a fighter is behind it.
6. **Parallax and camera:** camera follows the player horizontally (deadzone, no vertical move). Parallax factors in data: far ~0.3, back 1.0 (it is the wall behind the floor), floor 1.0, front ~1.15. Sky: keep the existing gradient backdrop behind `far`.
7. **Wave zones (Golden Axe flow):** stage data lists zones `{ x, enemies }`. Reaching a zone's x locks the camera; enemies enter from the screen edges; when the zone is cleared, unlock and show a "GO" arrow. After the last zone, the stage end (for now: loop back to a tougher run, like the arena's wave loop). Side walls (bounce) follow the camera's screen edges while locked. Enemy cap of 5 on screen stays.
8. **Sim stays pure:** camera position and zone state live in `world` and run under Node; the renderer only reads them. Bot test: a scripted player walks right and clears every zone of `harbor-run` (no stuck locks, no enemy spawning off the floor).
9. Debug overlay (` key) shows the belt, zone markers and segment joins.

## Acceptance
- Headless: `npm test` passes; `harbor-market` arena tests still pass unchanged; new bot run clears `harbor-run`.
- Windowed (JPG) in `docs/screens/T013/`: a frame at each back segment, a frame at each join, a locked zone fight with 4-5 rats, the GO arrow, the debug overlay.
- Human: does walking through the market feel like Golden Axe? Can you always see the fighters on the floor? Do you notice any joins?

Out of scope: touch controls, new art, other stages, cutscenes or a boss, stage select UI.
