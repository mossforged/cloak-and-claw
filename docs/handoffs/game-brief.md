# Game brief: Tales of Cloak & Claw (working title)

Paste this whole file to any new agent before giving it a task.

## Design pillars (the project must always honour these)
1. **Every hit lands.** Impact carries the feel (hit-stop, shake, knockback, flash, sparks), not animation frame count.
2. **Fair crowds.** Enemies take turns and telegraph their swings. You lose because you misplayed, never because you were swarmed or one hit wiped you out.
3. **You grow by fighting.** Like River City Ransom, your fighter visibly gets stronger across a run; a run fits a 30 to 60 minute session.
4. **The art stays doable.** Cartoon standees and cutout rigs, not hand-drawn frame animation. This game is also an animation study, so rig experiments are welcome, but the game never waits on them.

## Concept
A belt-scroller beat 'em up (you move left/right and up/down in depth, like Golden Axe and the D&D arcade games) with River City Ransom's light RPG growth. Set in the user's animal fantasy world (Tales of Cloak & Claw / Eldrith): small heroic animals against raiders, beasts and stranger things. Single player first; distinct heroes with their own move sets and local co-op come later.

## Tone
Heroic and over-the-top, warm and funny, never grim. Push past fantasy clichés toward choices that make the world feel specific.

## Look
Warm painted cartoon with bold dark outlines (see `docs/style-contract.md` and `docs/concepts/art-bible/`). Characters are flat standees that lean, squash, hop and flash; later, cutout rigs made of separate painted parts.

## Tech
Plain JavaScript ES modules + canvas 2D, no engine, no build step. Runs in any browser; public build on GitHub Pages: https://mossforged.github.io/cloak-and-claw/
