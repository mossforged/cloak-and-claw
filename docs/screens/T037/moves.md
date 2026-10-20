# T037: what regenerating hulls.js moves

`node tools/rig-hulls.mjs` on today's art, compared with main's hulls.js by `node tools/hull-moves.mjs <main's hulls.js>`
(every game state and move of the three rats and the mouse, the rehearsal moves, the viewer's held poses, and a 2-second
walk plus each fighter's move played in a row with the tail and scarf springs running). Full output: `hull-moves.txt`.

## Hulls that changed (image px bounds)
| Drawing | Before | After |
|---|---|---|
| rat-raider/rig/arm-near-raised.png | 85 x 187 | 85 x 188 |
| rat-raider/rig/arm-near-upper.png | 115 x 127 | 118 x 129 |
| rat-raider/rig/foot-far.png | 139 x 95 | 139 x 97 (the repaired sole) |
| rat-raider/rig/scarf-tail.png | 138 x 176 | 143 x 176 |
| rat-raider/rig/seat.png, seat-side.png, seat-front.png | no hull | new hulls |

Every other drawing (217) is unchanged; the mouse, the A010 rats and rat v3 move by 0.

## Rig numbers
| Number | Before | After |
|---|---|---|
| Rat far-foot floor line (px from the feet line; raider, spearman, archer) | -0.35 | 0.15 (0.5 px lower: the far foot now stands on its real sole) |
| Rat near-foot floor line | 0.05 | 0.05 |
| Mouse floor lines | -0.47 / -1.86 | same |
| Lying rest (down, dead, knockdown, getup) | | unchanged (0.00 px) |

## In play (game states and the rats' game moves)
Largest move anywhere: **0.92 px** (far shin, walk frames 6 and 18). Idle 0.1 px, hurt 0.23 px, ratSlash / spearThrust /
bowShot under 0.1 px, scarf in motion 0.32 px. Nothing the user approved in play moves 2 px or more: accepted.

## Viewer only (rehearsal moves and held poses), over 2 px
| Frame | Moves | Why |
|---|---|---|
| jumpUp @16 (raider, Jump rise) | far folded leg 42 px | the folded whole-leg drawing turns to the far floor line; with the line 0.5 px lower the turn finds a different angle: the leg kicks forward instead of hanging down for this one frame. Strip: viewer-before/after.jpg |
| =jump, =down held as poses (all rats) | far thigh 2.8 px | the tilted far foot's lowest point is the repaired sole |
| dodgeRoll @0-6, jumpUp @0, dodgeHop @0 | far thigh 2.8-2.9 px | same |
| spin @32 | far shin 2.3 px | same (its near foot was already 2.5 px off its line before, unchanged) |

## Baselines regenerated
`tools/bench/exposure-known.js` (`node tools/exposure-known.mjs docs/screens/T037/exposure-list.md`); main's list
reproduces exactly with main's hulls, so every change is the hulls'. Worse: `cut leg-far-upper` 6.7 -> 8.9 px (the viewer's
held down pose, all three rats). Gone: archer `cut scarf-tail` 4.6, archer `scarf-tail < torso` 18.8. The rest moved by
0.2-0.7. Pose seams known list and pass bars: unchanged.
