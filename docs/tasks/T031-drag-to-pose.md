# T031 - Drag to pose in the viewer (Code)

**Modules:** `src/viewer/` (a new pose mode, own files), `src/render/rig-ik.js` (read), the wrist/joint limits from T029 round 3, `src/data/` (limits, handles). **Read:** `src/viewer/CONTRACT.md`, `docs/design/rig-standard.md` 5b. **Needs:** T029 merged (joint limits). **Autonomy:** auto-ok up to the report; the user tries it on his phone and his Mac.

The user watched a Spine tutorial: the animator drags a foot and the knee and ankle follow, bending naturally and staying together. Our rig has the same skeleton and two-bone IK, but poses are typed as numbers and judged from stills, so bad bends reach the user. He agreed to try a drag-to-pose page (2026-10-19). It is a tool for looking and nudging, not a request that he animate.

## Do
1. **Pose mode in the viewer** (`viewer.html?pose=<fighter>&from=<clip>:<frame>`; default the idle): the rig at full phone width with a round handle on each hand, each foot, the head and the hips. Touch and mouse.
2. **Drag a hand or foot:** two-bone IK (shoulder/elbow, hip/knee) follows; the wrist or ankle stays inside its limit, the elbow/knee bends the natural way (no flipping). A held item stays in the fist; a two-hander's second hand follows the shaft. Drag the hips: the body moves, the feet stay planted. Drag the head: the neck turns within its limit.
3. **Twist handle** (a small ring on the hand or foot): turns the hand or foot within its limit; past the limit the forearm turns instead, as the solver does.
4. **Joint readout** under the rig: each joint's angle, red when at its limit. A **view picker** (Q, S, F, BQ, B) and a **swap picker** for the hand and foot drawings.
5. **Copy pose**: a button that copies the pose as the data line the move files use, and **Share**: a link with the pose in the URL, so the user can send a nudged pose to the lead in chat.
6. Same draw path as the game (rigFrame/drawRig): what you see is what the game shows.

## Acceptance
- Headless: tests for the drag solve (a dragged hand reaches inside the arm's length, wrist inside its limit, elbow bend side kept; out of reach it stops at full stretch, never detaches); `npm test` 0 failed.
- Windowed: links in `docs/screens/T031/views.json` (the raider's idle, the spearman holding the staff, the turning slash's strike frame); a short phone screen recording or a strip of four drags as JPGs.
- Human (user, phone): can he drag a foot up and see the knee and ankle bend and stay together, like the tutorial?
