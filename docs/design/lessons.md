# Standing lessons (checklist)

Distilled from the studies in `docs/studies/` (genre study 2026-10-14, developer lessons 2026-10-15). The lead checks new packets against this list; builders may cite it. Add to it when a lesson is learned the hard way. Each line: the lesson, then where it came from.

## Feel
- Responsiveness beats animation length: shorten slow moves; the next combo step starts the moment a hit lands. (SoR4)
- Big characters with few moves can still hit hard: build impact, not long move lists. (Final Fight)
- Dodging should be deliberate: shrink the depth hit area while moving up/down. (SoR4)
- Panic/special moves that cost health only if the health can be won back by attacking. (SoR4)
- Screen-clearing moves should hit part of the screen, not reset everything. (SoR4 star moves)
- Knocked enemies bounce off invisible side walls instead of leaving the screen. (SoR4)
- Find the fun first, balance second. (Absolum)

## Enemies and encounters
- Cap on-screen enemies (start at 5) so fights stay readable and learnable. (SoR4)
- Design enemies to work in combinations; level design is mostly enemy timing and placement. (SoR4)
- Cut enemies that are frustrating rather than hard (e.g. flying + immune to combos). (SoR4)
- Every telegraph must be escapable at human reaction time (~15 frames); test it like T004. (our playtest)
- New hero abilities break old AI: re-check AI whenever a hero gains reach, throws or mobility. (SoR4)
- Add surprises: an enemy that does one unexpected thing. (Final Fight)
- Expand the roster cheaply: colour variants and **weapon kits** on shared bodies. (Final Fight; decision 2026-10-15)

## Difficulty and co-op
- Challenging, not punishing. Restart at the current stage; offer an easy mode and assists. (SoR4)
- Co-op: don't rebalance everything; scale crowd and damage per extra player; keep clarity (per-player outlines, effect limits). (SoR4, Shredder's Revenge, Absolum, Castle Crashers)

## Process and scope
- Tools inside the game: slow motion, pause, frame-step, live reload. (SoR4) Our lab.
- Design each move's function before its art; let animation and gameplay adjust each other. (SoR4)
- Reuse frames and parts; tune by extremes with sliders. (SoR4)
- Even light RPG growth is a big balancing load: keep it small, use bot simulations. (Castle Crashers)
- Fix the weakest element first; no great mechanics on weak levels. (Castle Crashers)
- Cut what doesn't reach the bar, especially one-off sections needing special animation. (SoR4, Vanillaware)
- Let good art reshape the plan; but a discarded art direction can cost months. (Vanillaware)
- Stages from modular pieces; start familiar, get stranger. (Absolum)
- Set gameplay numbers (belt depth, sizes) first, then brief the art to them. (our decision)
- Study classics critically: keep what works, drop the frustrations. (SoR4)
- Show builds to strangers early; watch, don't coach. (SoR4)
- Part names use near/far for camera depth (renamed from front/back in T024); "lead/trail" only in pose descriptions; `back` is the back view. In packets name the exact part. (A013: the wrong foot was turned because a packet said "back foot".)
- A rigid cutout rig runs out of **whole-limb key drawings** (folded leg, kneeling leg, knee-up leg, cocked arm, toe-off feet, side/back torso), not hands or heads; write the character's pose budget before ordering art. (Rig art inventory study, 2026-10-17)
- Feet off the floor, hands that should follow the weapon, a far hand drawn under the shaft: runtime problems, not art; check the stretch strip before asking Art for anything. (Same study)
- Bodies freeze before gear, gear before moves. (A008 refit; Soulbound)
