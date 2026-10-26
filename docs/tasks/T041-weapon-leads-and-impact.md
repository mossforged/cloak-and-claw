# T041 - Two-handers: the weapon leads; impact overshoot and stretch (Code)

**Modules:** `src/render/retarget.js`, the grip / IK solve (`src/render/rig-grip.js`, `weapon-node.js`, `src/render/limits.js`), `src/data/rigs/rat-v3-poses.js`, a new data file for impact keys, tests, views. **Read:** `docs/design/rigs/research-cutout-rigging.md` (items 1, 2, 5), T040's report (`docs/screens/T040/table.md`: staff overhead forward-only, chop low), `docs/design/rigs/grip-lines-rat-v3.json`. **Needs:** T040 (merged). **Autonomy:** auto-ok up to the report; the user judges on his phone.

The user read the research (2026-10-26) and agreed to adopt two findings. Today a held item follows the hand, so on two-handers the wrist limit decides where the shaft points. The professional setup for two-handers is the reverse.

## Do
1. **Who leads, as data per handling type and per move:** `hand` (one-handers: cutlass, dagger, axe, club; today's behaviour, unchanged) or `item` (spear, staff, bow).
2. **Item leads:** a key poses the item itself (its grip point's place and its angle, relative to the hips or chest); both arms are solved to their grip lines on it (the user's lines) inside the limits; each wrist takes what's left, inside its range. If an arm can't reach, the item moves the least distance that lets both reach (never a hand off its grip). Fading: an `itemLead` mix per key 0..1 (0 = arms in their own pose, 1 = on the item), so a pick-up, throw or one-hand release blends.
3. **Re-pose v3's spear (stance, walk, thrust) and staff (swing, overhead) item-led.** Targets: spear point forward at the thrust (within 15°), staff over the head at the overhead's top key (staff centre above the head top) if the limits allow; if they don't, report which joint stops it.
4. **Impact:** an optional per-move `impact` (data): one frame of overshoot past the strike pose and a brief stretch (scale along the striking limb, <= 8%, 1-2 frames) at the hit frame, then settle. On for v3's attacks; the raider's clips unchanged unless the user asks. The pass bar and seam tests ignore the stretch frames.
5. Side-by-side views (spear thrust, staff overhead, staff swing, turning slash with impact, overhead chop with impact) and strips; the target table.

## Acceptance
`npm test` 0 failed (limits, grips, both fists on the shaft every frame, the old rat unchanged); the target table; links and strips in `docs/screens/T041/`.
