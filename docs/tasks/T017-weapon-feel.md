# T017 - Weapon feel: the club looks heavy, the fish looks silly (Code)

**Modules:** `src/data/rigs/mouse-fighter-poses.js` (per-weapon pose variants), `src/data/moves/plank-club.js`, `big-fish.js`, `cutlass.js` (view fields only), `src/render/rig-pose.js` / `rig.js` (a small hook if a held weapon needs its own wobble), `src/render/effects.js` or `prop-fx.js` (dust, squash), `src/data/juice.js`, tests. **Read:** `src/render/CONTRACT.md`, `src/data/items/rat-cutlass.js` (kit fields), `docs/design/lessons.md`.
**Needs:** T016 merged. **Autonomy:** human-gated (feel).

The user likes the floor weapons ("those special weapons are great"). Their numbers already differ (the club is slow and launches; the fish is one wide knockdown slap), but all three borrow the sword's three swing poses, so they **look** alike. This task makes each read as its own weapon **without changing how it plays**.

## Do
1. **Render only.** Damage, timing, hitboxes, knockback and durability stay exactly as they are (old case = old result: bot numbers identical to main, with and without props).
2. **Plank club: heavy.**
   - Windup: lift the club **high overhead** (reuse the A006 raised arm swap `arm-front-raised`, as the cast pose does), body leaning back, a held beat at the top before the swing (within the existing windup frames).
   - Strike: a downward **slam** with the body following through low; on hit, a **dust puff** at the target's feet and a slightly bigger shake (view-only juice numbers).
   - Second swing (`club2`): wider and lower, ending with the club near the floor.
   - Walking while holding the club: shoulder it (resting on the shoulder) rather than holding it out like a sword.
3. **Big fish: silly.**
   - The fish **wobbles** (floppy, a few degrees of springy rotation on the held image) while walking and after a swing, settling over about half a second.
   - The slap: a full body spin (reuse the slash2 spin pieces), then a **squash-stretch on the fish** at impact, and the existing "SLAP!" word.
   - Optional: a few water droplets flick off on the swing.
4. **Cutlass: quick.** Keep the sword poses but snappier: a smaller windup angle, a tighter swoosh. The point is that the cutlass feels lighter than his own sword.
5. Numbers in data (per weapon kit: pose overrides, wobble spring, dust); lab sliders optional.
6. Build label `t017 weapon feel v1`.

## Acceptance
- Headless: `npm test` passes; a test that each kit's sim numbers (damage, frames, hitboxes) are unchanged from main; bot numbers identical with and without props.
- Windowed (JPG) in `docs/screens/T017/`: club windup (overhead), club slam with dust, fish mid-wobble, fish slap impact squash, cutlass strike.
- Human: pick up each weapon and fight a wave: does the club feel heavy, the fish silly, and the cutlass quick?

Out of scope: new art (the weapons' own drawings stay), new moves, changing any weapon's damage or timing, rat weapon animations.
