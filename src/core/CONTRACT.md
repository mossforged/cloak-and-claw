# core: engine plumbing

**Owns:** fixed-step loop, input (keyboard + gamepad), event bus, image loading, seeded RNG.
**Does not own:** gameplay rules, drawing, tuning numbers.

**Public API:** `startLoop(update, render)`, `initInput()`, `readControl() -> {mx,my,attack,jump,start,debug,pause}`, `bus.on/emit`, `loadAssets(paths)`, `collectArtPaths(...data)`, `createRng(seed)`.

**Rules:** rarely changes. Bindings live in `src/data/controls.js`. Nothing here imports from sim/ or render/.
