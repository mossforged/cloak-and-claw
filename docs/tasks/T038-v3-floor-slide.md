# T038 - v3 planted feet in the hop, jump attack and kick (Code)

**Modules:** `src/render/retarget.js`, `src/render/floor.js`, `src/data/limit-solve.js`, tests. **Read:** T035 round 2 report and `docs/screens/T035/retarget.md`. **Needs:** T035 (merged). **Autonomy:** auto-ok up to the report.

On v3, the dodge hop, jump attack and kick still leave a planted foot up to about 23 px off its floor line with no joint at a limit, which points at the floor rule rather than the user's ranges (T035 r2). The run's slide (hips at their range ends) is expected and out of scope.

## Do
1. Find why: trace one bad frame of each (which foot, its goal, what the floor rule and the limit solve each did). Fix it so a planted foot lands on its line when the ranges allow; the old rat's clips must give exactly the old result.
2. Rerun `node tools/v3-retarget.mjs`; before/after table per clip.

## Acceptance
`npm test` 0 failed; the table; strips of the three moves before/after in `docs/screens/T038/`.
