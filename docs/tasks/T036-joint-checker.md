# T036 - Automatic joint checker for Art deliveries (Code)

**Modules:** new `tools/joint-check.mjs` (+ a small pure module under `tools/` or `src/render/` if shared), tests, `docs/MODULES.md`, Art's guide line (`AGENTS.md` self-check section: one line naming the command). **Read:** `docs/design/rigs/rat-v3-plan.md`, `assets/source/A027-rat-v3-body/rig-source.json` (the format), `docs/design/rigs/rat-v3-joints-v4.json`, A027's HANDOFF (the faults it found by eye). **Needs:** nothing. **Autonomy:** auto-ok up to the report.

Every Art round so far ended with the lead and the user finding joint faults by eye: a jagged neck at +10..+20 (A027 r1), a notch at the top of the near shoulder at positive turns, paint bars on the far limbs, outlines across the tail joins. Art measures silhouettes and overlap honestly, but overlap only proves the pieces touch. This tool turns most of that eye check into a pass/fail Art runs before handing in.

## Do
1. `node tools/joint-check.mjs <rig-source.json> [--joints <joints.json>] [--out <dir>]`: assembles the pieces at rest (the source's pivots, or the joints file's points and ranges when given), then turns each joint through its range (9 samples) with everything below it, and checks a window around the joint point (radius about the limb's width) in each sample for:
   - **Gap / notch:** transparent pixels inside the outline the two pieces should form (e.g. inside the convex hull of parent ∪ child in the window, minus what's transparent at rest too).
   - **Fragments:** after compositing, small detached islands of either piece in the window (and islands in each PNG on its own, over a size floor).
   - **Seam lines:** dark outline pixels of the covered piece showing outside the covering piece (doubled contours, outlines across a join).
   Each finding: joint, angle, kind, size in px, and a crop.
2. Output: `joint-check.json` (pass/fail per joint and kind, worst sample) and `joint-check.jpg` (a contact sheet of the flagged crops, phone-sized). Exit code 1 when anything fails, so Art can loop on it.
3. **Calibrate on known cases** (the commits are on main's history): A027 round 1 must flag the neck at +10/+20 and the near-shoulder notch; A027 round 2 must pass the neck; A026 round 3's wrist and ankle (the user accepted them) must pass. Tune thresholds as data (`src/data/` or a JSON beside the tool) until those hold; report the numbers.
4. Add one line to Art's self-check instructions in `AGENTS.md`: run it, include `joint-check.jpg` in the handoff, and say which flags are judged acceptable and why.

## Acceptance
- Headless: `npm test` 0 failed; a test on a tiny synthetic rig (two squares with a known gap / a known stray island / a known seam) that each kind is caught and a clean joint passes.
- The calibration table (case, expected, got) in the report and `docs/screens/T036/`.
- Runs on Art's machine with only Node and the repo's existing dependencies (no browser needed if possible; say what it needs).
