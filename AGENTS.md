# Working rules for AI agents (Claude, Codex, anyone)

This is a browser beat 'em up in plain JavaScript (ES modules, canvas 2D, no build step, no engine).
The codebase is split so that **any change should need only a few small files**. Keep it that way.

## Before you touch anything
1. Read `docs/STATUS.md` (where things stand) and `docs/MODULES.md` (what every file does).
2. Open **only** the files your task needs. Do not read the whole repo.
3. Art tasks: read `docs/ART_PIPELINE.md` only.

## Boundaries (do not break these)
- `src/sim/` is pure game logic. It never imports from `src/render/`, never touches the DOM. It runs headless in Node.
- `src/render/` only reads world state and listens to events. It never changes gameplay state.
- Sim talks to render through events on `src/core/events.js` (list in MODULES.md).
- **All tuning numbers live in `src/data/`** (moves, fighters, stages, rules, juice). Logic files hold no magic numbers.
- New hero / enemy / move / stage = new data file + one line in the matching `index.js` registry.
- Keep files under ~200 lines. If one grows past that, split it and update MODULES.md.

## After a change
- Run `npm test` (headless sim smoke test; must print ALL OK).
- Update `docs/MODULES.md` if you added/renamed a file, export or event.
- Update `docs/STATUS.md` (done / next / undecided) in a line or two.
- Commit with a message saying what changed and why.

## Who does what
- Claude: code and systems.
- Codex / ComfyUI: art and animation assets, following `docs/ART_PIPELINE.md`. Art agents only add files under `assets/` and edit the `art:` block of data files.
