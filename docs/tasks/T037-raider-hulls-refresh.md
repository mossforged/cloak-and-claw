# T037 - Regenerate the game rat's stale hulls safely (Code)

**Modules:** `src/data/rigs/hulls.js` (generated), `tools/rig-hulls.mjs`, pose baselines / known lists the change moves, tests. **Read:** T035's report ("Outside this task": T030 re-imported four raider drawings and the seat drawings without regenerating `hulls.js`). **Needs:** nothing. **Autonomy:** auto-ok up to the report.

`hulls.js` is out of date for the game rat (near upper arm, raised arm, far foot, scarf, seat drawings). Running `node tools/rig-hulls.mjs` today would move the rat's far-foot floor line and down-pose rest and shift pose baselines, so nobody can regenerate it safely.

## Do
1. Regenerate all hulls. List every rig number that changes (floor lines, rest heights, any test baseline or known list) with before/after.
2. Where a change is the stale data being corrected (the far foot now standing on its real sole), accept it and regenerate the baselines; where it moves something the user approved in play by more than 2 game px, say so with a strip so the lead can decide.
3. A test that fails when a rig names an image that has no hull, or a hull for an image whose file changed (store a content hash beside each hull).

## Acceptance
`npm test` 0 failed; the before/after list; phone strips of the raider's idle, walk and down pose before and after in `docs/screens/T037/`.
