# T003 - Mouse Fighter cutout rig (code builder)

**Modules:** new `src/render/rig.js`, new `src/data/rigs/`, `src/render/standee.js` (choose rig vs standee), `tools/` (sheet slicer), `assets/art/heroes/mouse-fighter/rig/`. **Read:** `src/render/CONTRACT.md`, `src/data/CONTRACT.md`, `src/render/standee.js`, `src/data/moves/mouse-sword.js`, `assets/source/A001-mouse-fighter-rig/HANDOFF.md` (sheet map and known flaws).
**Needs:** A001 (merged; look approved by the user 2026-10-14). Independent of T001; if T001 merges first, rebase.
**Autonomy:** human-gated (the user judges whether the rig looks alive).

Stage 3's question is whether a cutout rig makes Mouse Fighter look alive enough that we want every character rigged. This task builds a first rig fast so the user can see it move. Fine-tuning tools (pivot and pose editor in the lab) come in a later task, so keep placement and pose numbers in data where an editor can reach them.

## Do
1. **Slice the sheet:** a `tools/slice_sheet.py` that keys the green, finds the separate parts (connected regions), trims each and saves them by the names in HANDOFF.md's sheet map to `assets/art/heroes/mouse-fighter/rig/<part>.png`. Re-runnable for a future A001-02.
2. **Rig data** `src/data/rigs/mouse-fighter.js`: for each part: image, parent, pivot point (in the part's own pixels), attach point (in the parent's pixels), draw order, per-part scale, rest angle. Root = torso (hips). Build by eye using `reference.png` as a rough guide; HANDOFF says its scale differs from the parts.
   - **Fix proportions with per-part scale:** the legs on the sheet are too long for the body. Aim for the build of the current standee (`assets/art/heroes/mouse-fighter.png`): short legs, big head.
   - **Hide the joint caps** where you can, with draw order (forearm over upper arm, torso over thighs, head over neck knob). Report which caps still show.
   - Sword attaches to the front hand; shield to the back forearm; scarf tail and tail to the torso.
3. **Rig renderer** `src/render/rig.js`: draws the part hierarchy with transforms, flips by facing, and keeps the standee's extras (shadow, white hit flash, red hurt tint, telegraph glow) working on the whole rig.
4. **Poses as data** `src/data/rigs/mouse-fighter-poses.js`: joint angles (plus root offset) per pose. Code blends between them with easing and a little overshoot:
   - idle: breathing, gentle tail and scarf sway (continuous, sine-driven);
   - walk: leg swing cycle, small body bob, arms counter-swing;
   - slash1, slash2, slash3, jumpSlash: windup, strike (sword swinging across the body), recovery, keyed to the move's existing phases (`phaseOf`). slash3 is the big one;
   - jump (tuck), hurt (recoil), knockdown/down (lying), getup.
5. **Switch:** a fighter whose `art` has `rig: 'mouse-fighter'` draws with the rig; otherwise the standee. Key **R** toggles rig/standee in play so the user can compare. Rat Raider stays a standee.
6. Add a rig check to `tests/data.test.mjs`: every part image exists, every parent exists, every pose names only known joints.

## Acceptance
- Headless: `npm test` passes; `src/sim/` unchanged.
- Windowed: screenshots in `docs/screens/T003/`: idle, mid-walk, each slash at the strike, knockdown; plus the same frame with R toggled to the standee. If you can, a short screen recording (GIF or WebM) of the combo.
- Report: which joint caps still show, proportions you had to fudge, and anything the art needs in a revision (A001-02).
- Human: does the rig look alive enough that you want every character rigged? (No = pose swaps instead.)

Out of scope: the lab editor for pivots and poses (later task), rigging other characters, changing gameplay timing or hitboxes.
