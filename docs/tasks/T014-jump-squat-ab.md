# T014 - Jump squat: A/B test of two versions (code builder)

**Modules:** `src/data/fighters/mouse-fighter.js` (or `src/data/rules.js`), `src/sim/fighter.js` (option A only), `src/render/` rig/standee pose (option B), `src/data/rigs/mouse-fighter-poses.js`, `src/data/lab-schema.js`, `tests/`. **Read:** `src/sim/CONTRACT.md`, `src/render/CONTRACT.md`, how T006 did its in-game framing toggle.
**Needs:** T012 merged. **Autonomy:** build both; the user picks in play.

The user wants a small crouch before the jump (a "jump squat") and wants to compare two versions in play.

## Do
1. **Option A, sim squat:** `jumpSquat` frames (default 4, about 67 ms) of a `jumpStart` crouch before take-off; the jump input is buffered, so the jump always happens. Attacks pressed during the squat come out as the air attack after take-off. AI is unaffected unless it jumps.
2. **Option B, view-only squat:** no delay; take-off is on the same frame as now. The render shows a quick squash (crouch pose / squash scale on the first frames of the rise) plus a landing squash. The sim is untouched.
3. **Toggle** in game: a key (e.g. `J`) cycles **off / A / B**, shown next to the BUILD label (like T006's framing toggle). Data field `jumpSquatMode` sets the default; set the default to **B** (no responsiveness cost) until the user picks.
4. Both modes use the rig crouch pose (bent legs, body lower); the standee fallback squashes.
5. Tests: mode off = exactly the old jump (same frames, same bot numbers); mode A take-off delay equals `jumpSquat`; mode B sim timing identical to off.

## Acceptance
- Headless: `npm test` passes; mode off reproduces main's bot numbers exactly.
- Windowed (JPG) `docs/screens/T014/`: filmstrip of the first frames of a jump in off / A / B.
- Human: jump a lot in each mode. Which feels better: weightier (A), snappy but alive (B), or neither?

Out of scope: changing jump height or air control, other characters' jumps.
