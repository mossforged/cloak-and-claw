# T012 - Wire A006 parts into the block, cast and spin (code builder)

**Modules:** `src/data/rigs/mouse-fighter.js` (swap images + offsets), `src/data/rigs/mouse-fighter-poses.js`, `src/render/rig-pose.js` (only if swaps need a new channel), `assets/art/heroes/mouse-fighter/rig/`, `tests/rig.test.mjs`. **Read:** `src/render/CONTRACT.md`, `assets/source/A006-mouse-fighter-touchup/HANDOFF.md`, `docs/screens/T007/`, `docs/screens/T008/`, `docs/playtests/log.md`.
**Needs:** T010 merged. **Autonomy:** human-gated: the user didn't like A006's rough assemblies and wants to judge the parts **in motion**.

A006 delivered swap parts for poses the A002 parts couldn't make: `shield-face`, `arm-back-guard`, `head-brace`, `torso-side`, `torso-back-full`, `head-back`, `arm-front-raised`.

## Do
1. Import them (same keying/scale as A002 parts) and register them as swaps with their own pivots/offsets so nothing jumps when they swap in.
2. **Block:** `arm-back-guard` + `shield-face` + `head-brace` while blocking; on a blocked hit, a short extra brace (shield pushed forward).
3. **Spin (slash2):** use `torso-back-full` + `head-back` for the mid-spin frames (replacing the mirrored-body trick if the true back reads better; keep whichever reads better and say which).
4. **Horizontal cut:** where a pose wants a side-on body (slash2 strike, possibly slash3), try `torso-side`.
5. **Cast (C):** `arm-front-raised` with the sword pointing straight up, `head-shout`.
6. Keep A002 parts for everything else. If a new part looks worse in motion than the old pose, keep the old one and report it.
7. Rig test: every new swap image exists and has offsets.

## Acceptance
- Headless: `npm test` passes; no gameplay changes (`src/sim/`, move timing/hitboxes untouched).
- Windowed (JPG): `docs/screens/T012/`: block (rig), slash2 filmstrip, cast; before/after side by side.
- Human: in play, do the guard, the spin and the cast look like Mouse Fighter and read clearly?

Out of scope: new moves, the raised-knee leg (no art yet), other characters.
