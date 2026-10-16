# log: run log

**Owns:** per-run summary counts (from bus events), the last 20 runs in localStorage, the JSON download.
**Does not own:** gameplay state or drawing. Never changes `world` or fighters.

**Public API:** `createRunLog() -> { begin(world), summary() }`, `summaryLines(summary)` (runlog.js, runs in Node); `saveRun loadRuns downloadRuns` (store.js, browser only).

**Rules:**
- `runlog.js` imports only from `src/core/`; no DOM, no wall-clock time (so tests can use it headless).
- Listeners register once per logger; `begin(world)` starts a new run (restart reuses the same logger).
- Fields are listed in docs/MODULES.md. Counts are per hero (T021): slot 0's in the old fields, every hero's in `heroes`.
