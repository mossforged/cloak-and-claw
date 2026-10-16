# T023 - Import the new Mouse Fighter (A013) into the game (Code)

**Modules:** `src/data/rigs/mouse-fighter*.js` (rebuilt from A013), the mouse pose files (moved to standard part names), `src/render/rig-grip.js` / `rig.js` (sword and shield as held items on his grip hands), `src/data/items/` (his sword and shield as items, or a `hero kit` entry), `src/data/fighters/mouse-fighter.js`, `assets/art/heroes/mouse-fighter/rig/`, `tools/rig_from_source.py`, tests. **Read:** `docs/design/rig-standard.md`, `assets/source/A013-mouse-fighter-standard/` (HANDOFF, `rig-source.json` incl. `grips` and the whole-arm swaps' `hide` / `itemGrip` / `slotDirection` fields, `item-fits.json`, `sword-grip-check.png`, `shield-check.png`), `src/render/CONTRACT.md`, `docs/decisions.md` (2026-10-16).
**Needs:** T021 merged (the rig changes must not fight the multi-hero work), A013 merged. **Autonomy:** human-gated (look and feel in game).

The user approved the new Mouse Fighter (A013): one master drawn from his standee, standard parts (pelvis, separate hands and feet), a full swap library, and (addendum 2) a turned-out **near** foot for planted poses. The rig bench scores him 0.1% / 3.1% (the old mouse: 12.7% / 10.3%). This task replaces the old A002/A006 rig with him, keeping every move he has and how they feel.

## Do
1. **Import** with `tools/rig_from_source.py` from A013's `rig-source.json` into `assets/art/heroes/mouse-fighter/rig/` (replacing A002/A006 files), **uniform scale only**, no per-part fudges (report anything over 5%). Same in-game height as now (130 px).
2. **Carry the whole-arm swaps' extra fields** (`hide`, `itemGrip`, `slotDirection` on `arm-front-raised` and `arm-back-guard`): the importer and rig must keep them, so the raised arm still carries the sword (cast) and the guard arm still carries the shield (block).
3. **Sword and shield as held items** (as the rats' weapons in T020): the sword in `hand-front-grip`, the handle through the fist's slot (A013 `grips` gives each grip hand's slot direction); the shield on `hand-back-shield`. Floor weapons he picks up use the same grip. The old A002 sword and shield art stay as the items' images (A013 checked their fit).
4. **Re-pose every existing move on the standard part names**, starting from the current poses (stance, idle breath, walk, slash1/2/3, jump, jump squat, jump slash, block + brace loop, block hit, hurt, knockdown, down, getup, grab/knee/throws, pickup, stow/draw, cast, weapon kit poses from T017) and the swaps they use today. Then use what's new:
   - **feet:** `foot-front-out` (turned-out **near** foot) in planted poses: stance, idle, block/brace, cast, windups; the forward `foot-front` when walking, jumping and lunging;
   - **hands:** fist or open hand when empty-handed (grab, knee, throws, hurt), grip on weapons, the shield hand on the shield;
   - **heads:** `head-effort` for block/brace and heavy windups, `head-ko` when down, `head-back` and `torso-back` for the spin.
5. **Footwork on attacks (user, 2026-10-16):** "the mouse fighter doesn't move his legs when he attacks at all, we might want to look into that for dynamism." While re-posing, give every attack real leg work, render only (timing and hitboxes unchanged):
   - windup: weight shifts back (rear knee bends, front foot lightens or lifts slightly);
   - strike: a step or lunge into the hit (front foot slides forward, rear leg drives and straightens), hips turning with the swing;
   - follow-through/recovery: feet settle back to the planted stance (turned-out near foot);
   - slash3 / heavy hits: a bigger stride; spin (slash2): feet pivot with the body; jump slash: legs tuck then extend.
   Feet must not slide on the floor except where the move lunges (the sim's lunge distance is the step length).
6. **Depth note from Art:** the near upper arm (band 590) and forearm (580) sit behind the torso (600) at rest to hide the sleeve seam. Check every pose where the sword arm crosses his body (slash1, slash3, cast); if the arm vanishes wrongly, raise its band for those poses (data, per pose).
7. **Same feel:** timing, hitboxes and sim untouched (bot numbers identical to main). The user should feel the same fighter, drawn better.
8. Update the rig bench fixture to the new mouse; build label `t023 new mouse v1`.

## Acceptance
- Headless: `npm test` passes; bot numbers identical; rig tests updated (every pose names only existing parts; the sword's handle axis matches the grip slot in every pose; planted poses use `foot-front-out`, walking uses `foot-front`).
- Windowed (JPG) in `docs/screens/T023/`: new mouse beside the old one and the standee in stance; the full combo; block; cast; a grab and a throw; hurt, knockdown and down; holding the club and the fish.
- Human: does he look like the standee in game, does he still feel the same to play, and do his attacks feel more dynamic with the footwork?

Out of scope: new moves, a second hero, mouse face variety, changes to timing or damage.
