# T033 - Import A024 limb repairs (Code)

**Read:** `assets/source/A024-rat-limb-repairs/HANDOFF.md`, `docs/tasks/A024-rat-limb-repairs.md`. **Needs:** A024 (branch `a024-rat-limb-repairs`, merge it in first). **Autonomy:** auto-ok.

Import the nine repaired drawings (same names, canvases, pivots): near overhand wrist end, raised near and far shoulder ends, back-view shoulder tops, scarf root, far foot top, arm and thigh cut regions. Then rerun the wrist test, the pass bar and the exposure list; report which T029 r3 flags cleared and what's left (Art says the `arm-far-lower` cuff cut is unchanged). Regenerate known lists only where a number went down.

## Acceptance
- `npm test` 0 failed; pass bar and exposure list before/after in `docs/screens/T033/`.
