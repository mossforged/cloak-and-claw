# T002 - Run log (code builder)

**Modules:** new `src/log/` (or `src/core/runlog.js`), `src/render/hud.js` (game-over text only). **Read:** `src/sim/CONTRACT.md`, docs/MODULES.md events table. **Needs:** nothing (can run before or after T001).
**Autonomy:** auto-ok (all acceptance is objective).

So the lead can read what happened in a playtest next to the user's words, each run records a small summary.

## Do
1. A run logger that listens to bus events (no changes to sim logic) and counts per run: duration (frames and seconds), wave reached, KOs, XP, damage dealt, damage taken, hits landed, swings (by move key), swings that hit nothing, times the player was knocked down, enemy hits avoided by interrupting a windup (enemy hit during its windup).
2. Works headless: the sim smoke test can create a logger and read it.
3. On game over, show a 2-line summary under "Defeated!". Keep the last 20 runs in localStorage (try/catch). Key `L` downloads all stored runs as `runs-YYYY-MM-DD.json`.
4. Document the log fields in `docs/MODULES.md`.

## Acceptance
- Headless: new test runs the bot for 3 minutes and checks the log adds up (hits landed = `hit` events from the player; damage dealt = sum of damage on enemies; swings >= hits landed).
- Windowed: screenshot of the game-over summary in `docs/screens/T002/`.

Out of scope: sending logs anywhere, charts.
