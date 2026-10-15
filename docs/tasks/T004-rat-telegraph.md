# T004 - Rat telegraph you can escape (code builder)

**Modules:** `src/data/moves/rat-blade.js`, `src/data/lab-schema.js`. **Read:** `src/data/CONTRACT.md`, `docs/playtests/log.md` (2026-10-14 "Rat telegraph too short"). **Needs:** nothing (queue after T003; one code session at a time).
**Autonomy:** auto-ok for the data change; the user already confirmed the feel in the lab.

The user could not escape a Rat Raider's swing after seeing the warning flash. In the lab, a windup of about 34 frames fixed it (ASSUMPTION: 34 exactly; the user said "that fixed it" after the lead suggested ~34).

## Do
1. `ratSlash.windup`: 22 -> 34. `ratSlash.lunge`: 2.2 -> 1.2.
2. Add `ratSlash.lunge` and `ratSlash.depth` (fallback = `RULES.depthHit`, 16) to the lab schema so the user can tune them.
3. Leave `RULES.depthHit` and the hero's moves unchanged.

## Acceptance
- Headless: `npm test` passes. Add a test: from the moment the rat's windup starts, a player standing at the rat's attack position who starts moving away in depth 15 frames later (reaction time) is out of the hit lane before the active frames begin.
- The sim smoke test still shows the bot defeating enemies (numbers may shift; report them).

Out of scope: any other tuning, AI changes.
