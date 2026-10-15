# Style contract

## Screen
- Internal resolution 960x540, scaled to fit. Characters 120 to 145 px tall on screen (mouse smaller than rat).
- HUD font: Lilita One (fallback sans-serif). HUD never covers the floor belt.

## Characters
- Warm painted cartoon, **bold dark outlines**, readable silhouette at 130 px.
- **Three-quarter view toward the camera** (about 30 degrees turned toward the viewer, like the art bible standees), facing right. Both eyes visible. Not pure profile. The game mirrors them to face left.
- Light from the **upper left**. No ground shadow (the game draws one).
- Same scale and feet height across every image of one character.
- Generated on flat **#00FF00** green (or transparent). No green in the character.
- Palette: warm browns, muted reds, blues and golds as in the art bible. Avoid neon colours outside magic effects.

## Stages
- Current: one wide cutout per arena over a code-drawn sky/sea.
- Scrolling stages (later) come as layers: sky, far background, walkable floor strip, foreground props. Each layer a separate image, same light direction.

## Motion and feel
- Most tweens 150 to 400 ms. Every action gets feedback (move, swap or effect); nothing teleports.
- Hits: hit-stop, shake, white flash, sparks, number. Finishers: bigger versions of the same.
