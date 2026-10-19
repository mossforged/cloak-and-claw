# T034 - Rig the rat on the user's joint points (Code)

**Read:** `docs/design/rigs/joint-points-rat.json`, `src/data/rigs/rat-raider.js`, `src/data/wrists.js`, `src/data/pose-limits.js`, `docs/design/rig-standard.md` 5b. **Needs:** T032 r2 and T033 merged first if they are (otherwise from main). **Autonomy:** auto-ok up to the report; the user compares before/after on his phone.

The user placed the near arm and leg joints himself in the Fitting Room (2026-10-19): for each joint, a point on the moving piece (`pivot`) and the matching point on the parent (`attach`), the limits each way, and which piece draws in front. This is the test of whether human joint points fix the anatomy.
1. **Joint points:** set `pivot` and `attach` for `arm-near-upper`, `arm-near-lower`, `hand-near`, `leg-near-upper`, `leg-near-lower`, `foot-near` from the file (Q view; the other views and the far side keep theirs for now). Every swap drawn on the same canvas as its base piece uses the same points unless it has its own; list any swap whose drawing doesn't fit them.
2. **Limits as data:** the six joints' `lo`/`hi` (degrees from rest, + clockwise on screen, rest = the angle as assembled at rest) into the joint-limit data (wrists, pose-limits); the drag page and the solvers use them. Then list every clip and rehearsal key that bends a near joint past the user's limit (clip, frame, joint, angle) and fix the poses that pose data can fix by staying inside. Hip -23..+25 is tight for walk, run and kicks: list those first rather than forcing them; the whole-leg key drawings (knee-up, kneeling, folded) are exempt.
3. **Draw order:** `front` = child over parent. The user's picks reverse two of rig standard 5b's cover rules: hand over the forearm's bracer (wrist) and foot over the shin (ankle). Build it as he picked behind a data switch, render before/after strips of the walk and a grip for those two joints, and say which one shows gaps; don't change the standard.
4. **Before/after:** `docs/screens/T034/`: the walk, idle, turning slash, overhead chop, dash attack, kick and the knee-up jump, old points vs his points, as phone strips and viewer links (`views.json`, preview of this branch). Pass bar and wrist test rerun.

## Acceptance
- `npm test` 0 failed; the limits test reports no clip past a limit except the listed ones.
- Human: do the arm and leg hold together better on his points?
