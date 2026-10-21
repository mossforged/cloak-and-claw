# T040 - v3's own poses for the big held-item moves (Code)

**Modules:** new `src/data/rigs/rat-v3-poses.js` (v3 pose overrides, data), `src/render/retarget.js` (use an override when a key has one), tests, views. **Read:** T039 round 2 report (`docs/screens/T039/r2-item-angles.md`), `docs/design/rigs/rat-v3-joints-v4.json` (the user's limits: near wrist −49..9 stays), the rehearsal (`docs/design/rigs/rat-raider-rehearsal.md`) for what each move should read as. **Needs:** T039 r2 (merged). **Autonomy:** auto-ok up to the report; the user judges on his phone.

The user chose (2026-10-21) to re-pose the moves that the retarget can't carry, rather than loosen his wrist limit or ask Art for whole-arm drawings. The old rat's big moves leaned on whole-arm drawings (cocked, raised, guard) and wrist turns past v3's range, so on v3: the spear crosses the face, the slash wind-up sticks straight back at shoulder height, the overhead chop's axe stays low, and the guard puts the shield over the face.

## Do
1. **Overrides as data:** for a move key, v3 may name its own hand / foot / head / hip places and the held item's angle; such a key skips the retarget and is solved with the same limit IK as drag-to-pose. Everything without an override stays retargeted. The old rat's clips stay exactly as they are.
2. **Pose these on v3, inside the user's limits, with no new drawings:**
   - **Spearman:** stance / idle / walk carry and the spear thrust (wind-up, thrust, recover): spear held low along the forearm line, point forward and slightly up, the far hand on the shaft; the shaft never crosses the head.
   - **Staff** swing and overhead (two hands on the shaft).
   - **Turning slash wind-up:** blade raised above the shoulder line behind the head (the elbow does the lifting the cocked drawing used to), then the existing swing and strike.
   - **Overhead chop:** axe head above the head at the top of the wind-up, then down through the strike.
   - **Guard and shield bash:** shield in front of the chest / shoulder (rim at about chin height, the eyes visible over it), the cutlass ready behind it; the bash pushes it forward.
   Use the rehearsal's descriptions for timing and read; when a key can't read as its move within the limits, say which joint stops it.
3. **Checks (tests):** for each of those clips, every frame: joints inside the limits, item in its grip fist (as T039), the held item doesn't overlap the head's drawing (except the drink), and the item angle at the named keys within the target the move names (spear thrust point within 20° of forward at the thrust key; the slash wind-up's blade above the shoulder; the chop's axe head above the head at the top key; the shield's centre below the eyes in guard).
4. **Views:** side by side (old rat / v3) for spear thrust, staff overhead, turning slash, overhead chop, guard, shield bash, plus drag-to-pose from the guard key; phone strips of each, v3 only, with the old rat's strip beside.

## Acceptance
`npm test` 0 failed; the checks above; the per-move table (move, key, target, got); the links and strips in `docs/screens/T040/`.
