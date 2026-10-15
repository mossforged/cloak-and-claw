# T005 - Rig: three-quarter parts + part swaps (code builder)

**Modules:** `src/data/rigs/`, `src/render/rig.js`, `src/render/rig-pose.js`, `assets/art/heroes/mouse-fighter/rig/`, `tests/rig.test.mjs`. **Read:** `src/render/CONTRACT.md`, `src/data/rigs/mouse-fighter.js`, `src/data/rigs/mouse-fighter-poses.js`, `assets/source/A002-mouse-fighter-rig-3q/HANDOFF.md`, `docs/playtests/log.md` (2026-10-14 rig entry), `docs/decisions.md` (three-quarter view, part swaps).
**Needs:** A002 merged and its look approved by the user. **Autonomy:** human-gated.

The user approved the rig system but wanted Mouse Fighter turned toward the camera like the standee, with a back view for big swings. A002 delivers three-quarter parts plus swap parts: `torso-back`, `head-neutral`, `head-shout`, `head-hurt`. Part swaps (alternate drawings switched at key moments) are how Vanillaware-style cutout games show turns and emotion.

## Do
1. Import A002's separate PNGs (not the sheets) into `assets/art/heroes/mouse-fighter/rig/` (key + trim with `tools/key_green.py`; keep A001's files only if something still uses them, otherwise remove). HANDOFF: every part sits on the reference's canvas, so `part-layout.json` / the canvas position can seed attach points.
2. Re-fit the rig data to the new parts: pivots, attach points, draw order, per-part scale. Match the standee's build (short sturdy legs, big head). HANDOFF warns limbs are slimmer and straighter than the reference: scale or angle them in data, don't repaint.
3. **Part swaps in data:** a pose (or a phase of a move) can set `swap: { torso: 'torso-back', head: 'head-shout' }`. The renderer switches the image at that moment; each swap image has its own pivot/offset so the swap doesn't jump (HANDOFF: shout/hurt heads can shift the chin).
   - slash3 windup: `torso-back` (body turns away), back to `torso` on the strike.
   - Attack strikes: `head-shout`. Hurt and knockdown: `head-hurt`. Otherwise `head-neutral`.
4. New pose `cast` (sword raised straight up, head-shout) as the user's flexibility test; reachable in the lab or by a debug key (not a gameplay move).
5. Hide joint ends by draw order; report any that still show.
6. Rig test: every swap image exists and has offsets; poses only reference known parts and swaps.

## Acceptance
- Headless: `npm test` passes; `src/sim/` unchanged; move timing/hitboxes unchanged.
- Windowed: `docs/screens/T005/`: idle next to the standee (same angle?), slash3 windup (back torso) and strike, hurt face, the `cast` pose; a short GIF/WebM of the combo if you can.
- Report: joint caps still visible, swap jumps you couldn't remove, anything for an art revision.
- Human: does he move the way you want now, and does the back-torso swap read as a body turn?

Out of scope: rigging other characters, new gameplay moves, block/throw (separate Stage 2 tasks).
