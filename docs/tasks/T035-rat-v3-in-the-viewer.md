# T035 - The redrawn rat (v3) in the viewer, three-quarter view (Code)

**Modules:** `tools/rig_from_source.py` (import), new `src/data/rigs/rat-v3*.js` (+ registry), `src/viewer/models.js` (`VERSIONS`), the pose-limit data (`src/data/pose-limits.js`, `wrists.js`), tests. **Read:** `docs/design/rigs/rat-v3-plan.md`, `assets/source/A027-rat-v3-body/rig-source.json` (21 pieces: A026's six + A027's fifteen, pivots in master px, draw order, covers), `docs/design/rigs/rat-v3-joints-v4.json` (**the user's fitted joint points and ranges: these win over the source's pivots**), `src/viewer/CONTRACT.md`, T031 (drag-to-pose). **Needs:** A026 + A027 round 1 (merged). **Autonomy:** auto-ok up to the report; the user looks on his phone.

The user rebuilt the rat with each piece drawn on its own around joint points he fitted himself in the Fitting Room. Art is still cleaning edges (A027 round 2, same PNG names, same points); this task gets the new rat moving so he can judge it in motion. **The old rat stays the game's rat**: v3 is a compare version in the viewer only.

## Do
1. **Import** the 21 pieces as a new rig `rat-v3` (three-quarter view only), same scale and floor as the raider. Each joint's pivot is the user's point from `rat-v3-joints-v4.json`; parents and draw order from the source (`drawOrder`, `covers`: hand over forearm, foot over shin, arm over torso, seat over thigh). Make the import a re-runnable command so Art's round 2 PNGs drop in by re-running it.
2. **Limits as data** from the same file, every joint (near and far, neck, waist, tail), used by the IK, the wrist solver and drag-to-pose, the same way the raider's are.
3. **Compare version** `v3` for the raider in the viewer (`VERSIONS`, beside `a010`): every move clip plays on it. Moves and poses are the raider's, mapped by joint name. A key that names another view (S, F, BQ, B) or a drawing v3 lacks (other heads, hand grips, whole-arm swaps) stays on the three-quarter drawing; list those keys (move, key, what's missing) for the lead, don't invent art. Held items on the fists by the existing grip lines where the fist is the same drawing; otherwise list it.
4. **Drag-to-pose** on v3 (`viewer.html?pose=...&version=v3`): hands, feet, head, hips; limits respected.
5. **Side by side**: a viewer link that plays the same clip on the current rat and v3 next to each other.

## Acceptance
- Headless: `npm test` 0 failed; tests that every v3 joint stays inside its limit in every clip frame (after clamping) and every child's pivot sits on its parent's point (0.5 px).
- Windowed: `docs/screens/T035/views.json` with links: v3 idle, walk, run, turning slash, backhand, overhead chop, spear thrust, dodge roll, jump attack, drag-to-pose, and the side-by-side for walk and turning slash; phone JPG strips of four of them.
- The missing-drawing list in the report.
- Human (user, phone): does the new rat move better than the old one?

Out of scope: other views, gear, replacing the game's rat.

## Round 2 (lead, 2026-10-20): copy where the hands and feet go, not the angles
Round 1 reviewed (`t035-rat-v3-viewer`, 9abbc61): import, limits, compare version, drag-to-pose and side by side all in, 43 files pass. Your far-arm question: the user dragged v3's far hand toward the chin in drag-to-pose and the elbow folds the right way inside 0..124, so **his limits stand**. The far arm hangs in the clips because the raider's poses are copied to v3 as joint angles, and v3's drawings rest at different angles from the old rat's (its far forearm especially), so the same number means a different bend.
1. **Retarget by position:** for v3, place each pose by where the old rat's hands, feet, head and hips are (relative to the hips, scaled by limb length), then solve v3's limbs to those places with the same IK and limits drag-to-pose uses. The torso, neck, waist and tail keep their angles (same rest on both). The old rat's clips stay exactly as they are.
2. **Re-import A027 round 2** (merged on main: same PNG names and points) with the round 1 command and re-run the hulls for v3 only (leave the game rat's stale hulls alone; that's its own task).
3. **Feet:** after retargeting, check the planted-foot dip you reported; a foot placed by position with the floor fix inside the IK should land on its line.
4. Refresh views.json, the strips and the side by side; report before/after for the far arm in the turning slash wind-up (the old rat's far fist is up at the chest, v3's should be too).
