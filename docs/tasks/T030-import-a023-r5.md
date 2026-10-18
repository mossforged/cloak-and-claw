# T030 - Import A023 round 5 and close the pass bar (Code)

**Modules:** `tools/rig_from_source.py`, `src/data/rigs/rat-raider*.js`, tests. **Read:** `assets/source/A023-rat-complete-kit/HANDOFF.md` (round 5 import instructions), `docs/screens/T028/r5-pass-bar.md`. **Needs:** T028 and A023 round 5 (both merged 2026-10-18). **Autonomy:** auto-ok up to the report; the user plays it after.

T028 is merged: the game now has the turning rat with holds on the user's grip lines. The pass bar missed only on what A023 round 5 covers. Import it and confirm.

## Do
1. Import A023 round 5: `seat` (pelvis child, pivot (774,1460), band 540, exactly the pelvis transform, never following a thigh), `seat-side` for S, `seat-front` for F, `seat` for BQ, hidden in B; the repaired `foot-far`, `arm-near-upper`, `arm-near-raised`, `scarf-tail`.
2. Add `seat over thigh tops` to the anatomy rules (Q, S, F, BQ) and teach the seam measure that the seat covers the far hip, without waiving any visible gap.
3. Rerun the pass bar (`tools/pass-bar.mjs`) and write `docs/screens/T030/pass-bar.md` with strips. Bar: zero flags in idle, walk, turning slash, turn-around; every other move under 20 game px² per piece.
4. Report anything left as a list for the lead (piece, move, frame, size).

## Acceptance
- Headless: tests pass; pass bar report.
- Windowed: viewer links (idle, walk, turning slash, bow draw) in `docs/screens/T030/views.json`.
- Human: the user plays the game with the rats.
