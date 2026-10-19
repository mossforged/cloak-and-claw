# T029: pass-bar tune (seam measure at the shoulders)

Written by `node tools/pass-bar-tune.mjs` on main's moves (T030's rat, before any T029 pose), every frame key of every
viewer clip. The seam measure counted open space under a raised or swung arm (armpit: between the arm and the torso) as a
seam gap. Tuned (`tools/bench/stretch.js` `LIMB_BODY`, `limbReach`; `tools/bench/pose-seams.js` `frameSeams`): at a
shoulder (the torso and an upper arm) a gap counts only when **both sides of it are those two pieces** and the gap lies
**within reach of the pivot**, the reach being the arm's own width across its bone at the pivot (at rest). Daylight
further out, beside the arm's shaft, is not a seam. Both measures (the core crack and the joint band) apply it; every
other joint measures as before. The stretch strip (`tests/stretch.test.mjs`) is unchanged.

**Shoulder flags (77 clip / joint pairs on main): 25 cleared, 12 smaller, 40 unchanged.**

## Cleared (armpit daylight, no longer a seam)
| Fighter | Clip | Joint | Before (px) | After |
|---|---|---|---|---|
| raider | idle | torso / arm-far-upper | 6 (@32) | 0 |
| raider | walk (in place) | torso / arm-far-upper | 3 (@1) | 0 |
| raider | walk across | torso / arm-far-upper | 5.5 (@125) | 0 |
| raider | turn around (x2) | torso / arm-far-upper | 6 (@32) | 0 |
| raider | ratSlash | torso / arm-far-upper | 5.5 (@66) | 0 |
| raider | hurt | torso / arm-far-upper | 5.5 (@39) | 0 |
| raider | knockdown, get up | torso / arm-far-upper | 15.5 (@34) | 0 |
| raider | thrown | torso / arm-far-upper | 16 (@31) | 0 |
| raider | cast | torso / arm-far-upper | 5.5 (@7) | 0 |
| raider | stance | torso / arm-far-upper | 3 (@1) | 0 |
| raider | jump | torso / arm-far-upper | 3 (@1) | 0 |
| raider | jumpSquat | torso / arm-far-upper | 7 (@3) | 0 |
| raider | hurt | torso / arm-far-upper | 3 (@1) | 0 |
| raider | knockdown | torso / arm-far-upper | 14 (@5) | 0 |
| raider | down | torso / arm-far-upper | 3 (@1) | 0 |
| raider | getup | torso / arm-far-upper | 3 (@1) | 0 |
| spearman | spearThrust | torso / arm-far-upper | 15 (@49) | 0 |
| spearman | hurt | torso / arm-far-upper | 8 (@43) | 0 |
| spearman | hurt | torso / arm-far-upper | 2.5 (@5) | 0 |
| archer | bowShot | torso / arm-far-upper | 16 (@12) | 0 |
| archer | knockdown, get up | torso / arm-far-upper | 15.5 (@33) | 0 |
| archer | thrown | torso / arm-far-upper | 16 (@31) | 0 |
| archer | jump | torso / arm-far-upper | 3 (@72) | 0 |
| archer | knockdown | torso / arm-far-upper | 15.5 (@3) | 0 |
| archer | getup | torso / arm-far-upper | 4.5 (@4) | 0 |

## Smaller (part of the old flag was daylight)
| Fighter | Clip | Joint | Before (px) | After (px) |
|---|---|---|---|---|
| raider | grabbed + kneed | torso / arm-far-upper | 16 (@10) | 2.5 (@5) |
| raider | held | torso / arm-far-upper | 15.5 (@3) | 2.5 (@3) |
| spearman | walk (in place) | torso / arm-near-upper | 14.5 (@12) | 11 (@7) |
| spearman | walk across | torso / arm-near-upper | 14.5 (@25) | 11.3 (@123) |
| spearman | knockdown, get up | torso / arm-near-upper | 14.8 (@109) | 13.5 (@102) |
| spearman | stance | torso / arm-near-upper | 8.8 (@63) | 8.5 (@1) |
| spearman | hurt | torso / arm-near-upper | 14.3 (@2) | 14 (@5) |
| archer | grabbed + kneed | torso / arm-far-upper | 16 (@10) | 2.5 (@5) |
| archer | cast | torso / arm-near-upper | 4.5 (@7) | 3.5 (@7) |
| archer | jumpSquat | torso / arm-near-upper | 11.5 (@5) | 11 (@5) |
| archer | held | torso / arm-far-upper | 16 (@3) | 2.5 (@3) |
| archer | getup | torso / arm-near-upper | 13 (@5) | 12.5 (@5) |

## Remain (a gap at the shoulder joint itself, within the arm's width of the pivot)
Most are the near shoulder's back edge as the arm swings forward (the vest no longer covers the arm's top). A few read
up to 0.5 px wider than before: their sides are now measured to the arm and torso only, not to the scarf or the held item.
| Fighter | Clip | Joint | Before (px) | After (px) |
|---|---|---|---|---|
| raider | ratSlash | torso / arm-near-upper | 13.5 (@59) | 13.5 (@59) |
| raider | hurt | torso / arm-near-upper | 9.5 (@51) | 9.5 (@51) |
| raider | knockdown, get up | torso / arm-near-upper | 16 (@63) | 16 (@63) |
| raider | grabbed + kneed | torso / arm-near-upper | 12 (@77) | 12 (@77) |
| raider | thrown | torso / arm-near-upper | 16 (@67) | 16 (@67) |
| raider | cast | torso / arm-near-upper | 3.5 (@10) | 3.5 (@10) |
| raider | jump | torso / arm-near-upper | 10.5 (@3) | 10.5 (@3) |
| raider | hurt | torso / arm-near-upper | 9.5 (@5) | 9.5 (@5) |
| raider | held | torso / arm-near-upper | 6.5 (@4) | 6.5 (@4) |
| raider | knockdown | torso / arm-near-upper | 13.5 (@3) | 13.5 (@3) |
| raider | down | torso / arm-near-upper | 14.5 (@4) | 14.5 (@4) |
| raider | getup | torso / arm-near-upper | 4.5 (@5) | 4.5 (@5) |
| spearman | idle | torso / arm-near-upper | 11 (@70) | 11.5 (@39) |
| spearman | turn around (x2) | torso / arm-near-upper | 11 (@89) | 13.8 (@25) |
| spearman | spearThrust | torso / arm-near-upper | 12 (@13) | 12.5 (@70) |
| spearman | hurt | torso / arm-near-upper | 14 (@32) | 14 (@32) |
| spearman | grabbed + kneed | torso / arm-near-upper | 11.8 (@172) | 11.8 (@172) |
| spearman | thrown | torso / arm-near-upper | 12 (@46) | 12.3 (@133) |
| spearman | cast | torso / arm-near-upper | 3.5 (@7) | 3.5 (@7) |
| spearman | jump | torso / arm-near-upper | 11.5 (@2) | 11.5 (@2) |
| spearman | jumpSquat | torso / arm-near-upper | 13.5 (@4) | 13.5 (@4) |
| spearman | held | torso / arm-near-upper | 8.5 (@1) | 8.5 (@1) |
| spearman | knockdown | torso / arm-near-upper | 11.5 (@3) | 11.5 (@3) |
| spearman | down | torso / arm-near-upper | 12.5 (@4) | 12.5 (@4) |
| spearman | getup | torso / arm-near-upper | 13 (@3) | 13 (@3) |
| archer | idle | torso / arm-near-upper | 6 (@17) | 6 (@17) |
| archer | walk (in place) | torso / arm-near-upper | 11.5 (@4) | 11.5 (@4) |
| archer | walk across | torso / arm-near-upper | 11.5 (@7) | 11.5 (@7) |
| archer | turn around (x2) | torso / arm-near-upper | 13 (@25) | 13 (@25) |
| archer | bowShot | torso / arm-near-upper | 16 (@9) | 16 (@9) |
| archer | hurt | torso / arm-near-upper | 11 (@55) | 11 (@55) |
| archer | knockdown, get up | torso / arm-near-upper | 16 (@63) | 16 (@63) |
| archer | grabbed + kneed | torso / arm-near-upper | 14 (@173) | 14 (@173) |
| archer | thrown | torso / arm-near-upper | 16 (@67) | 16 (@67) |
| archer | stance | torso / arm-near-upper | 5.5 (@1) | 5.5 (@1) |
| archer | jump | torso / arm-near-upper | 11.5 (@2) | 11.5 (@2) |
| archer | hurt | torso / arm-near-upper | 6.5 (@2) | 6.5 (@2) |
| archer | held | torso / arm-near-upper | 10 (@2) | 10 (@2) |
| archer | knockdown | torso / arm-near-upper | 14 (@2) | 14 (@2) |
| archer | down | torso / arm-near-upper | 16 (@7) | 16 (@7) |

## Bar clips (zero seams): worst seam of any joint, before and after
| Fighter | Clip | Before | After |
|---|---|---|---|
| raider | idle | torso / arm-far-upper 6 (@32) | arm-near-lower / hand-near 5 (@70) |
| raider | walk (in place) | leg-far-upper / leg-far-lower 10.5 (@2) | leg-far-upper / leg-far-lower 10.5 (@2) |
| raider | walk across | torso / scarf-tail 9.5 (@13) | torso / scarf-tail 9.5 (@13) |
| raider | turn around (x2) | arm-far-upper / arm-far-lower 10.3 (@24) | arm-far-upper / arm-far-lower 10.3 (@24) |
| raider | ratSlash | pelvis / torso 13.5 (@49) | pelvis / torso 13.5 (@49) |
| spearman | idle | torso / arm-near-upper 11 (@70) | torso / arm-near-upper 11.5 (@39) |
| spearman | walk (in place) | torso / arm-near-upper 14.5 (@12) | torso / arm-near-upper 11 (@7) |
| spearman | walk across | torso / arm-near-upper 14.5 (@25) | torso / arm-near-upper 11.3 (@123) |
| spearman | turn around (x2) | arm-far-lower / hand-far 13.3 (@81) | torso / arm-near-upper 13.8 (@25) |
| archer | idle | torso / arm-near-upper 6 (@17) | torso / arm-near-upper 6 (@17) |
| archer | walk (in place) | torso / arm-near-upper 11.5 (@4) | torso / arm-near-upper 11.5 (@4) |
| archer | walk across | torso / arm-near-upper 11.5 (@7) | torso / arm-near-upper 11.5 (@7) |
| archer | turn around (x2) | torso / arm-near-upper 13 (@25) | torso / arm-near-upper 13 (@25) |
