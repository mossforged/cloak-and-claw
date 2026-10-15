# T011 - Rat Raider rig + weapon kits (sword, spear, bow) (code builder)

**Modules:** `src/data/rigs/` (new rat rig + poses), `src/render/rig.js` / `rig-pose.js` (weapon kits, held-weapon attach, grip swaps), `src/data/fighters/` (rat variants), `src/data/moves/` (spear and bow moves), `src/sim/` (projectiles for arrows; AI ranges), `assets/art/enemies/rat-raider/rig/`, tests. **Read:** `src/render/CONTRACT.md`, `src/sim/CONTRACT.md`, `src/data/CONTRACT.md`, `docs/decisions.md` (weapon-kit assembly line, 2026-10-15), `docs/design/lessons.md`, `assets/source/A004-rat-raider-rig/HANDOFF.md`, `assets/source/A005-rat-raider-head-legs/HANDOFF.md`, `docs/playtests/log.md` (A004/A005 entries).
**Needs:** T010 merged (reuse its generic held-weapon attach and weapon-kit data; extend it with `two-hand` and `bow` grips). **Autonomy:** human-gated (look and feel). This is the start of Stage 4 (enemy variety).

## Do
1. **Import** the rat parts: A004 body, arms, torso, torso-back, tail, bandana, grip/pinch hands, sword (cutlass), spear, bow, arrow; **A005 heads (neutral, snarl, hurt) and A005 legs** (they replace A004's). Key/trim as for Mouse Fighter.
2. **Rig + stance (user's priority):** the rat's default stance is the **art bible crouch**: knees bent, feet wide, hips low, torso tipped forward, head pushed out (compare `assets/art/enemies/rat-raider.png`). He should read hunched and coiled next to the upright mouse, not tall and lanky. Shorten legs per part if the crouch alone isn't enough. **User on A008 review (2026-10-15): the legs "look very strange, weirdly spread, weirdly muscly but still thin".** Fix what the rig can (stance width, knee bend, part scale/offsets, overlap at the knee); if the A005 legs still read wrong in the crouch, say so in the report with a screenshot so the lead can order a leg redraw. Optional after the rig works: attach the A008 gear (hood + quiver on archer, helmet + jerkin on spearman, tricorn + sash on a captain) as overlay parts on the head/torso bones. Swaps: snarl head on attacks, hurt head on hits/knockdown, torso-back where a pose turns him.
3. **Weapon kits as data:** a kit = weapon image + grip type (`one-hand`, `two-hand`, `bow`) + moves + AI params. The renderer attaches the weapon to the hand bone and swaps the grip hand parts per grip type. Generic so later bodies (and floor weapons, T010) reuse it.
4. **Three rat variants** sharing the body, each a small fighter data file + registry line:
   - **Rat Raider (cutlass):** current behaviour, current `ratSlash`.
   - **Rat Spearman:** long reach, slower; a thrust with a long telegraph. **Spear hold:** rear hand low near the butt by the hip, front hand mid-shaft, point angled slightly up at the enemy (user found A004's mock-up hold "strange": spear flat across the chest with hands bunched). Keeps more distance (AI range ~ his reach).
   - **Rat Archer:** keeps away (retreats if approached), draws the bow with a visible telegraph, fires an arrow projectile along his lane (arrows can be blocked by the shield; dodged by stepping out of the lane). One arrow in flight per archer.
5. **Telegraph rule** (lessons): every new attack must be escapable at human reaction time (~15 frames); add tests like T004's for the spear thrust and the arrow.
6. **Fairness:** archers count toward the attack-token limit while drawing; keep `maxAttackers` behaviour. Waves: add the variants to Harbor Market waves gradually (e.g. wave 2 adds a spearman, wave 3 an archer).
7. Lab sliders for the new moves/AI (optional; good defaults).

## Small extras (do first, separate commits)
- **Dev server:** add `tools/serve.py`, a no-cache static server (`Cache-Control: no-store`) on port 8000; update README and `CLAUDE.md`-referenced run line in README so the user stops needing hard reloads.
- **Landing squash for jump mode A:** reuse B's render-only landing squash so the jump has a crouch at both ends. No sim change.

## Acceptance
- Headless: `npm test` passes; old cutlass rat behaves as before (old case = old result); escape tests for thrust and arrow; arrows blocked by the shield.
- Windowed: `docs/screens/T011/`: the three variants side by side (crouched stance) next to Mouse Fighter; spearman mid-thrust; archer at full draw with arrow in flight.
- Human: do the rats read as rats in a fighting crouch, and do the spear and bow rats ask different questions than the cutlass rat?

Out of scope: colour variants (next), other species, the enemy design workspace.
