# T029: pass bar (rat family; art: the A023 round imported on this branch)

Written by `node tools/pass-bar.mjs`: every frame key of every viewer clip, through the unfinished-paint check (T028 r4:
exposed hidden paint counts only when flat or beside a straight cut), the straight-cut-edge check and the pose seam test
(both unchanged from round 3), with the user's grip lines in place. Bar: idle, walk, the turning slash (ratSlash) and the
turn-around at zero flags of all three kinds; every other move under 20 game px² of unfinished paint per piece
(cut edges and seams listed there for the record). Strips of the worst frame per move: `pass-bar-rat-*.jpg`.

**Result: 23 clips miss the bar.**

## Bar clips (zero flags)
| Fighter | Clip | Bar | Unfinished paint (worst piece, px²) | Cut edge (px) | Seam (px) | Pass |
|---|---|---|---|---|---|---|
| raider | idle | zero | 0 | 0 | arm-near-lower / hand-near 5 (@70) | **no** |
| raider | walk (in place) | zero | 0 | 0 | leg-far-upper / leg-far-lower 10.5 (@2) | **no** |
| raider | walk across | zero | 0 | 0 | torso / scarf-tail 9.5 (@13) | **no** |
| raider | turn around (x2) | zero | leg-far-upper < pelvis 4.8 (@22) | 0 | leg-near-upper / leg-near-lower 10.5 (@29) | **no** |
| raider | ratSlash | zero | 0 | 0 | pelvis / torso 13.5 (@42) | **no** |
| spearman | idle | zero | 0 | 0 | torso / arm-near-upper 11.5 (@39) | **no** |
| spearman | walk (in place) | zero | 0 | 0 | torso / arm-near-upper 11 (@7) | **no** |
| spearman | walk across | zero | 0 | 0 | torso / arm-near-upper 11.3 (@123) | **no** |
| spearman | turn around (x2) | zero | leg-far-upper < pelvis 4.8 (@22) | 0 | arm-far-lower / hand-far 13.3 (@24) | **no** |
| archer | idle | zero | 0 | 0 | torso / arm-near-upper 6 (@17) | **no** |
| archer | walk (in place) | zero | 0 | 0 | torso / arm-near-upper 11.5 (@4) | **no** |
| archer | walk across | zero | scarf-tail < torso 18.8 (@27) | scarf-tail 4.6 (@27) | torso / arm-near-upper 11.5 (@7) | **no** |
| archer | turn around (x2) | zero | leg-far-upper < pelvis 4.8 (@22) | 0 | torso / arm-near-upper 11.5 (@26) | **no** |

## Every other move (under 20 px² of unfinished paint per piece)
| Fighter | Clip | Bar | Unfinished paint (worst piece, px²) | Cut edge (px) | Seam (px) | Pass |
|---|---|---|---|---|---|---|
| raider | fidget | < 20 px² | 0 | head 4.9 (@2) | arm-far-lower / hand-far 5.5 (@4) | yes |
| raider | skidStop | < 20 px² | hand-near < arm-near-lower 5 (@24) | hand-near 4.2 (@24) | pelvis / leg-far-upper 9.5 (@8) | yes |
| raider | jumpUp | < 20 px² | hand-near < arm-near-lower 19 (@18) | hand-near 4.6 (@18) | arm-near-lower / hand-near 14.8 (@15) | yes |
| raider | dodgeHop | < 20 px² | 0 | 0 | leg-near-upper / leg-near-lower 13.5 (@30) | yes |
| raider | dodgeRoll | < 20 px² | arm-near-upper < torso 29.8 (@18) | head 4 (@15) | pelvis / torso 15.5 (@10) | **no** |
| raider | backhand | < 20 px² | 0 | 0 | torso / arm-near-upper 15 (@6) | yes |
| raider | spin | < 20 px² | pelvis < torso 33.5 (@38) | 0 | torso / arm-near-upper 14 (@57) | **no** |
| raider | overheadChop | < 20 px² | leg-far-upper < pelvis 8 (@48) | 0 | leg-near-upper / leg-near-lower 12 (@61) | yes |
| raider | daggerStab | < 20 px² | torso < arm-near-upper 45 (@39) | 0 | arm-near-lower / hand-near 15.8 (@17) | **no** |
| raider | daggerThrow | < 20 px² | 0 | 0 | torso / arm-near-upper 16 (@40) | yes |
| raider | jumpAttack | < 20 px² | 0 | arm-near-upper 6.4 (@8) | leg-near-upper / leg-near-lower 14 (@50) | yes |
| raider | dashAttack | < 20 px² | leg-far-upper < pelvis 11 (@25) | 0 | leg-near-upper / leg-near-lower 11.5 (@1) | yes |
| raider | kick | < 20 px² | foot-far < leg-far-lower 9.5 (@33) | 0 | leg-near-upper / leg-near-lower 9 (@35) | yes |
| raider | guard | < 20 px² | foot-near < leg-near-lower 8.8 (@4) | 0 | pelvis / leg-far-upper 10 (@6) | yes |
| raider | shieldBash | < 20 px² | leg-far-upper < pelvis 8.8 (@35) | 0 | leg-near-upper / leg-near-lower 11.5 (@40) | yes |
| raider | rally | < 20 px² | arm-near-upper < torso 151.8 (@4) | head 5.3 (@63) | arm-near-upper / shoulder-near 9 (@6) | **no** |
| raider | hurt | < 20 px² | 0 | 0 | arm-near-lower / hand-near 10.8 (@45) | yes |
| raider | knockdown, get up | < 20 px² | foot-far < leg-far-lower 54.5 (@114) | foot-far 5 (@114) | torso / scarf-tail 16 (@35) | **no** |
| raider | grabbed + kneed | < 20 px² | arm-far-upper < torso 9.3 (@5) | arm-far-upper 5.3 (@5) | torso / scarf-tail 15 (@79) | yes |
| raider | thrown | < 20 px² | hand-near < arm-near-lower 4.8 (@47) | hand-near 4.6 (@47) | torso / arm-near-upper 16 (@67) | yes |
| raider | cast | < 20 px² | arm-near-upper < torso 125.5 (@10) | arm-near-upper 4.6 (@7) | arm-near-upper / shoulder-near 8.5 (@9) | **no** |
| raider | stance | < 20 px² | 0 | 0 | arm-near-lower / hand-near 4 (@1) | yes |
| raider | jump | < 20 px² | 0 | 0 | arm-near-lower / hand-near 13.5 (@59) | yes |
| raider | jumpSquat | < 20 px² | leg-far-upper < pelvis 5 (@1) | leg-far-upper 4.9 (@1) | leg-near-upper / leg-near-lower 12.5 (@4) | yes |
| raider | hurt | < 20 px² | 0 | 0 | torso / arm-near-upper 9.5 (@5) | yes |
| raider | held | < 20 px² | 0 | 0 | leg-near-upper / leg-near-lower 7.5 (@2) | yes |
| raider | knockdown | < 20 px² | 0 | 0 | torso / arm-near-upper 13.5 (@3) | yes |
| raider | down | < 20 px² | leg-far-upper < pelvis 5.8 (@3) | leg-far-upper 6.7 (@5) | torso / arm-near-upper 16 (@59) | yes |
| raider | getup | < 20 px² | 0 | 0 | pelvis / leg-far-upper 9.5 (@2) | yes |
| raider | run | < 20 px² | leg-far-upper < pelvis 5 (@21) | 0 | torso / scarf-tail 16 (@7) | yes |
| spearman | spearThrust | < 20 px² | leg-far-upper < pelvis 9.5 (@59) | 0 | arm-far-lower / hand-far 11.5 (@66) | yes |
| spearman | staffSwing | < 20 px² | foot-near < leg-near-lower 4.8 (@48) | 0 | torso / head 12.5 (@32) | yes |
| spearman | staffOverhead | < 20 px² | 0 | 0 | torso / arm-near-upper 13 (@63) | yes |
| spearman | hurt | < 20 px² | 0 | 0 | torso / scarf-tail 16 (@45) | yes |
| spearman | knockdown, get up | < 20 px² | foot-far < leg-far-lower 54.5 (@114) | foot-far 5 (@114) | torso / scarf-tail 16 (@35) | **no** |
| spearman | grabbed + kneed | < 20 px² | 0 | 0 | torso / scarf-tail 15 (@79) | yes |
| spearman | thrown | < 20 px² | arm-near-upper < torso 5 (@52) | 0 | torso / arm-near-upper 12.3 (@133) | yes |
| spearman | cast | < 20 px² | arm-near-upper < torso 124 (@8) | 0 | arm-far-lower / hand-far 7.5 (@7) | **no** |
| spearman | stance | < 20 px² | 0 | 0 | arm-far-lower / hand-far 10.8 (@1) | yes |
| spearman | jump | < 20 px² | 0 | 0 | torso / arm-near-upper 11.5 (@2) | yes |
| spearman | jumpSquat | < 20 px² | leg-far-upper < pelvis 5 (@1) | leg-far-upper 4.9 (@1) | torso / arm-near-upper 13.5 (@4) | yes |
| spearman | hurt | < 20 px² | 0 | 0 | torso / scarf-tail 15.5 (@5) | yes |
| spearman | held | < 20 px² | 0 | 0 | torso / arm-near-upper 8.5 (@1) | yes |
| spearman | knockdown | < 20 px² | 0 | 0 | torso / scarf-tail 13 (@5) | yes |
| spearman | down | < 20 px² | leg-far-upper < pelvis 5.8 (@3) | leg-far-upper 6.7 (@5) | torso / scarf-tail 13.5 (@4) | yes |
| spearman | getup | < 20 px² | 0 | 0 | torso / arm-near-upper 13 (@3) | yes |
| archer | bowShot | < 20 px² | 0 | arm-far-lower 4.2 (@55) | torso / arm-near-upper 16 (@9) | yes |
| archer | hurt | < 20 px² | 0 | 0 | torso / arm-near-upper 11 (@55) | yes |
| archer | knockdown, get up | < 20 px² | foot-far < leg-far-lower 54.5 (@114) | foot-far 5 (@114) | torso / arm-near-upper 16 (@63) | **no** |
| archer | grabbed + kneed | < 20 px² | 0 | 0 | torso / scarf-tail 15 (@79) | yes |
| archer | thrown | < 20 px² | 0 | hand-far 4.2 (@41) | torso / arm-near-upper 16 (@67) | yes |
| archer | cast | < 20 px² | arm-near-upper < torso 49.8 (@7) | 0 | arm-far-lower / hand-far 6.5 (@8) | **no** |
| archer | stance | < 20 px² | 0 | 0 | arm-far-lower / hand-far 5.5 (@1) | yes |
| archer | jump | < 20 px² | 0 | 0 | torso / arm-near-upper 11.5 (@2) | yes |
| archer | jumpSquat | < 20 px² | leg-far-upper < pelvis 5 (@1) | leg-far-upper 4.9 (@1) | arm-near-lower / hand-near 13.8 (@3) | yes |
| archer | hurt | < 20 px² | 0 | 0 | pelvis / torso 8 (@5) | yes |
| archer | held | < 20 px² | 0 | 0 | torso / arm-near-upper 10 (@2) | yes |
| archer | knockdown | < 20 px² | 0 | 0 | torso / scarf-tail 14.5 (@3) | yes |
| archer | down | < 20 px² | leg-far-upper < pelvis 5.8 (@3) | leg-far-upper 6.7 (@5) | torso / arm-near-upper 16 (@7) | yes |
| archer | getup | < 20 px² | 0 | 0 | torso / arm-near-upper 12.5 (@5) | yes |
