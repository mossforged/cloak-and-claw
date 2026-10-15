# Code builder guide (Claude Code)

You are the **code builder**. A lead chat writes task packets in `docs/tasks/` and reviews your branch. The user plays the results.

## Start of every session
1. `git pull` on main.
2. Read `docs/STATUS.md`, then the packet you were given (`docs/tasks/T0NN-*.md`), then only the contracts and files it names. Use `docs/MODULES.md` to find anything else; do not read the whole repo.
3. Create a branch: `git checkout -b t0nn-<short-slug>`. Never commit task work to main.

## You own
`src/`, `tests/`, `tools/`, `index.html`, `lab.html`, `README.md` (links and run instructions), `assets/art/` (game-ready art you import), `package.json`, `.github/`.
You never edit `assets/source/` (the art builder's) and never change `docs/` except: `docs/MODULES.md`, module `CONTRACT.md` files, `docs/screens/T0NN/`, and the "Last session" lines of `docs/STATUS.md`.

## Module rules
- `src/sim/` is pure logic: no imports from `src/render/`, no DOM, uses `world.rng`. Must run under Node.
- `src/render/` reads state and listens to events; it never changes gameplay state.
- **Every tunable number goes in `src/data/`.** New content = data file + registry line.
- Files stay under ~200 lines; split and update `docs/MODULES.md` when they grow.
- Extending a system: the old case must give exactly the old result.

## Importing art
When a packet says to import an asset: run `python3 tools/key_green.py assets/source/<ID>-<slug>/<file>.png assets/art/<...>.png <max_px>`, wire the `art:` block in data, check the feet anchor with the debug overlay (` key), and mark the asset `game-ready` in `docs/assets.md`.

## Commands
- `npm test` runs every `tests/*.test.mjs` headless (sim bot run + data integrity). Must end `0 failed`.
- `python3 -m http.server 8000` then http://localhost:8000 (`?debug` for the overlay). `window.game.world` in the console exposes state.

## End of task
1. `npm test` passes. Add tests for new logic.
2. Windowed acceptance: save screenshots to `docs/screens/T0NN/` if you can; otherwise list exactly what the user should look at.
3. Update `docs/MODULES.md` / contracts if files, exports or events changed.
4. Two lines under "Last session" in `docs/STATUS.md`.
5. Commit (author is the repo's configured anonymous handle), `git push -u origin <branch>`, and report the branch name and anything you could not do.
- Found a problem outside your task? Note it in your report; don't fix it.
- The user asks for something outside the packet? Note it in your report for the lead; don't build it.
- Gate tags (`stage-N`): only when the lead asks.
