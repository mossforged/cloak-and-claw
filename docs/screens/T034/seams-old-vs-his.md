# T034: near-limb pose seams, old points vs his

Worst pose seam (game px, tools/bench/pose-seams.js) per near joint over each move the strips show, rat raider. - = no seam over 2 px.
Regenerate: tools/joint-points-compare.mjs (header comment).

| Move | Joint | Old points (px) | His points (px) |
|---|---|---|---|
| idle | arm-near-lower / hand-near | 5 | - |
| idle | arm-near-upper / arm-near-lower | - | 9.8 |
| walk | arm-near-lower / hand-near | 4.5 | - |
| walk | arm-near-upper / arm-near-lower | - | 11.3 |
| walk | leg-near-upper / leg-near-lower | 7.5 | 10.5 |
| walk | pelvis / leg-near-upper | 6.5 | 9 |
| ratSlash | arm-near-lower / hand-near | 7 | - |
| ratSlash | arm-near-upper / arm-near-lower | - | 8.5 |
| ratSlash | leg-near-lower / foot-near | - | 2.5 |
| ratSlash | leg-near-upper / leg-near-lower | 12 | 15 |
| ratSlash | torso / arm-near-upper | 14 | - |
| overheadChop | arm-near-lower / hand-near | 7 | 6 |
| overheadChop | arm-near-upper / arm-near-lower | - | 12.3 |
| overheadChop | leg-near-upper / leg-near-lower | 12 | 14.5 |
| overheadChop | torso / arm-near-upper | 11 | 2.5 |
| dashAttack | arm-near-lower / hand-near | 5.5 | 5.5 |
| dashAttack | arm-near-upper / arm-near-lower | - | 10 |
| dashAttack | leg-near-lower / foot-near | - | 3 |
| dashAttack | leg-near-upper / leg-near-lower | 11.5 | 11.5 |
| dashAttack | torso / arm-near-upper | 9 | - |
| kick | arm-near-lower / hand-near | 5.3 | - |
| kick | arm-near-upper / arm-near-lower | - | 10.5 |
| kick | leg-near-upper / leg-near-lower | 9 | 12.5 |
| kick | pelvis / leg-near-upper | 7 | 14.5 |
| jumpUp | arm-near-lower / hand-near | 7 | 6.5 |
| jumpUp | arm-near-upper / arm-near-lower | - | 12.3 |
| jumpUp | leg-near-lower / foot-near | - | 2.5 |
| jumpUp | leg-near-upper / leg-near-lower | 14 | 14 |
| jumpUp | pelvis / leg-near-upper | - | 8.5 |
| jumpUp | torso / arm-near-upper | 12.5 | - |
