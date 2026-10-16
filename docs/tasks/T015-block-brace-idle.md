# T015 - Bracing behind the shield: subtle idle motion while blocking (code builder)

**Modules:** `src/data/rigs/mouse-fighter-poses.js` (block pose), `src/render/rig-pose.js` (if a looping layer needs a small hook), `src/data/juice.js` or the pose file for the numbers, `src/data/lab-schema.js` (optional), tests. **Read:** `src/render/CONTRACT.md`, the `block` / `blockHit` poses, `docs/design/lessons.md`.
**Needs:** T013 merged. **Autonomy:** human-gated (feel).

User (2026-10-16): "maybe he should have some subtle movement while bracing behind his shield?" Right now holding block freezes him in one pose, which reads as a still image. A small living loop makes him look tense and ready without changing what blocking does.

## Do
1. **Render only.** No sim change: block timing, pushback, chip and facing stay exactly as they are (old case = old result in the block tests).
2. While in `block` (not during `blockHit`), layer a slow loop on top of the block pose:
   - a **breath**: torso and head rise and settle a little (about 1 to 2 px at game size, a 1.2 to 1.6 s cycle);
   - the **shield** shifts a hair with the breath, slightly out of step so it doesn't move as one rigid piece with the body;
   - a slight **weight shift** between the feet (hips sway 1 px side to side on a longer, offset cycle); boots stay planted;
   - the **sword** point twitches slightly, like a ready grip (very small).
   Keep it subtle: tense and alert, not bouncing. Default numbers in data; lab sliders optional.
3. **Entering block** blends into the loop (no pop); a blocked hit (`blockHit`) still plays its shove and then eases back into the loop.
4. If the shuffle-walk while blocking (walkSpeed 0.6) already moves the legs, the sway pauses while he walks.
5. Standee mode (R): a gentle squash-and-lean breath on the standee while blocking, same cycle.

## Acceptance
- Headless: `npm test` passes; block tests unchanged; a test that holding block for 3 s keeps the feet on the floor line and changes no sim state.
- Windowed: a short filmstrip (6 to 8 frames across one breath) in `docs/screens/T015/` (JPG); build label `t015 brace v1`.
- Human: hold block for a few seconds: does he look braced and alive, not frozen or jittery?

Out of scope: new art, parry, a guard-break, changes to the block pose itself.
