# T034: pass bar (rat family; art: the A023 round imported on this branch)

Written by `node tools/pass-bar.mjs`: every frame key of every viewer clip, through the unfinished-paint check (T028 r4:
exposed hidden paint counts only when flat or beside a straight cut), the straight-cut-edge check and the pose seam test
(both unchanged from round 3), with the user's grip lines in place. Bar: idle, walk, the turning slash (ratSlash) and the
turn-around at zero flags of all three kinds; every other move under 20 game px² of unfinished paint per piece
(cut edges and seams listed there for the record). Strips of the worst frame per move: `pass-bar-rat-*.jpg`.

**Result: 30 clips miss the bar.**

## Bar clips (zero flags)
| Fighter | Clip | Bar | Unfinished paint (worst piece, px²) | Cut edge (px) | Seam (px) | Pass |
|---|---|---|---|---|---|---|
| raider | idle | zero | 0 | foot-near 5.5 (@54) | arm-near-upper / arm-near-lower 9.8 (@9) | **no** |
| raider | walk (in place) | zero | foot-far < leg-far-lower 43.5 (@2) | foot-near 5 (@3) | arm-near-upper / arm-near-lower 11.3 (@13) | **no** |
| raider | walk across | zero | 0 | foot-near 5 (@124) | arm-near-upper / arm-near-lower 13.8 (@12) | **no** |
| raider | turn around (x2) | zero | leg-far-upper < pelvis 4.8 (@22) | foot-near 5.5 (@93) | tail / tail-2 10 (@21) | **no** |
| raider | ratSlash | zero | 0 | hand-near 5.1 (@62) | leg-near-upper / leg-near-lower 15 (@52) | **no** |
| spearman | idle | zero | 0 | foot-near 5.5 (@54) | arm-far-lower / hand-far 7.5 (@91) | **no** |
| spearman | walk (in place) | zero | 0 | foot-near 5 (@3) | leg-far-upper / leg-far-lower 10.5 (@2) | **no** |
| spearman | walk across | zero | 0 | foot-near 5 (@124) | arm-far-lower / hand-far 13 (@122) | **no** |
| spearman | turn around (x2) | zero | 0 | foot-near 5.5 (@93) | arm-far-lower / hand-far 13 (@88) | **no** |
| archer | idle | zero | 0 | foot-near 5.5 (@54) | arm-far-lower / hand-far 5.5 (@0) | **no** |
| archer | walk (in place) | zero | foot-far < leg-far-lower 43.5 (@2) | foot-near 5 (@3) | leg-far-upper / leg-far-lower 10.5 (@2) | **no** |
| archer | walk across | zero | scarf-tail < torso 18.8 (@27) | foot-near 5 (@124) | leg-near-upper / leg-near-lower 10.5 (@24) | **no** |
| archer | turn around (x2) | zero | leg-far-upper < pelvis 4.8 (@22) | foot-near 5.5 (@93) | tail / tail-2 10 (@21) | **no** |

## Every other move (under 20 px² of unfinished paint per piece)
| Fighter | Clip | Bar | Unfinished paint (worst piece, px²) | Cut edge (px) | Seam (px) | Pass |
|---|---|---|---|---|---|---|
| raider | fidget | < 20 px² | 0 | foot-near 5 (@1) | arm-near-upper / arm-near-lower 8.3 (@59) | yes |
| raider | skidStop | < 20 px² | arm-near-upper < torso 50.3 (@24) | foot-near 5 (@27) | leg-near-upper / leg-near-lower 13 (@9) | **no** |
| raider | jumpUp | < 20 px² | arm-near-upper < torso 65 (@6) | foot-near 5 (@55) | leg-near-upper / leg-near-lower 14 (@12) | **no** |
| raider | dodgeHop | < 20 px² | arm-near-upper < torso 29.5 (@12) | foot-near 5 (@33) | leg-near-upper / leg-near-lower 12.5 (@3) | **no** |
| raider | dodgeRoll | < 20 px² | arm-near-upper < torso 50.3 (@6) | foot-near 5.5 (@42) | pelvis / torso 15.5 (@10) | **no** |
| raider | backhand | < 20 px² | 0 | foot-near 5.5 (@41) | leg-near-upper / leg-near-lower 14.5 (@40) | yes |
| raider | spin | < 20 px² | pelvis < torso 33.5 (@38) | foot-near 5.5 (@61) | leg-near-upper / leg-near-lower 14 (@49) | **no** |
| raider | overheadChop | < 20 px² | torso < head 7.5 (@55) | foot-near 5.5 (@86) | leg-near-upper / leg-near-lower 14.5 (@63) | yes |
| raider | daggerStab | < 20 px² | torso < arm-near-upper 78.8 (@8) | foot-near 5.5 (@56) | leg-near-upper / leg-near-lower 16 (@34) | **no** |
| raider | daggerThrow | < 20 px² | 0 | foot-near 5.5 (@44) | torso / scarf-tail 13.5 (@22) | yes |
| raider | jumpAttack | < 20 px² | scarf-tail < torso 4.3 (@46) | foot-near 5.5 (@53) | pelvis / torso 13.5 (@33) | yes |
| raider | dashAttack | < 20 px² | arm-near-upper < torso 26.8 (@1) | foot-near 5 (@41) | leg-near-upper / leg-near-lower 11.5 (@40) | **no** |
| raider | kick | < 20 px² | arm-near-upper < torso 45.8 (@29) | foot-near 5 (@43) | pelvis / leg-near-upper 14.5 (@14) | **no** |
| raider | guard | < 20 px² | arm-near-upper < torso 24 (@20) | foot-near 5.5 (@69) | leg-near-upper / leg-near-lower 15 (@22) | **no** |
| raider | shieldBash | < 20 px² | leg-far-upper < pelvis 8.8 (@35) | foot-near 5.5 (@52) | leg-near-upper / leg-near-lower 16 (@40) | yes |
| raider | rally | < 20 px² | arm-near-upper < torso 115.5 (@65) | head 5.3 (@63) | torso / arm-near-upper 11.5 (@3) | **no** |
| raider | hurt | < 20 px² | 0 | foot-near 5.5 (@31) | torso / scarf-tail 16 (@45) | yes |
| raider | knockdown, get up | < 20 px² | foot-far < leg-far-lower 54.3 (@114) | foot-near 6 (@37) | torso / scarf-tail 16 (@35) | **no** |
| raider | grabbed + kneed | < 20 px² | foot-far < leg-far-lower 16 (@78) | foot-far 6.4 (@78) | torso / scarf-tail 15 (@79) | yes |
| raider | thrown | < 20 px² | foot-far < leg-far-lower 18.8 (@54) | foot-near 7.8 (@56) | torso / scarf-tail 11.5 (@76) | yes |
| raider | cast | < 20 px² | arm-near-upper < torso 103.8 (@9) | foot-near 5 (@34) | torso / head 8.5 (@10) | **no** |
| raider | stance | < 20 px² | 0 | foot-near 5 (@1) | pelvis / torso 4.5 (@4) | yes |
| raider | jump | < 20 px² | leg-far-upper < pelvis 5 (@1) | 0 | arm-near-upper / arm-near-lower 10.3 (@5) | yes |
| raider | jumpSquat | < 20 px² | leg-far-upper < pelvis 5.3 (@1) | hand-near 6.4 (@3) | leg-near-upper / leg-near-lower 12.5 (@2) | yes |
| raider | hurt | < 20 px² | 0 | foot-near 5 (@1) | torso / scarf-tail 15.5 (@5) | yes |
| raider | held | < 20 px² | 0 | foot-near 5 (@1) | arm-far-lower / hand-far 8.5 (@5) | yes |
| raider | knockdown | < 20 px² | pelvis < leg-near-upper 13.8 (@2) | hand-near 4.2 (@59) | arm-near-upper / arm-near-lower 14 (@3) | yes |
| raider | down | < 20 px² | scarf-tail < torso 12.8 (@51) | leg-far-upper 6.7 (@5) | torso / scarf-tail 13.5 (@4) | yes |
| raider | getup | < 20 px² | 0 | 0 | pelvis / leg-far-upper 9.5 (@2) | yes |
| raider | run | < 20 px² | arm-near-upper < torso 58.8 (@17) | 0 | torso / scarf-tail 16 (@7) | **no** |
| spearman | spearThrust | < 20 px² | 0 | foot-near 5.5 (@78) | arm-far-lower / hand-far 9 (@49) | yes |
| spearman | staffSwing | < 20 px² | 0 | foot-near 5.5 (@58) | leg-near-upper / leg-near-lower 14.5 (@25) | yes |
| spearman | staffOverhead | < 20 px² | arm-near-upper < torso 14.5 (@4) | foot-near 5.5 (@89) | leg-near-upper / leg-near-lower 14.5 (@35) | yes |
| spearman | hurt | < 20 px² | 0 | foot-near 5.5 (@31) | torso / scarf-tail 16 (@45) | yes |
| spearman | knockdown, get up | < 20 px² | foot-far < leg-far-lower 47.3 (@114) | foot-near 6 (@37) | torso / scarf-tail 16 (@35) | **no** |
| spearman | grabbed + kneed | < 20 px² | foot-far < leg-far-lower 16 (@78) | foot-far 6.4 (@78) | torso / scarf-tail 15 (@79) | yes |
| spearman | thrown | < 20 px² | foot-far < leg-far-lower 18.8 (@54) | foot-near 7.8 (@56) | torso / scarf-tail 10 (@76) | yes |
| spearman | cast | < 20 px² | arm-near-upper < torso 100.5 (@7) | foot-near 5 (@34) | pelvis / torso 5.5 (@8) | **no** |
| spearman | stance | < 20 px² | 0 | foot-near 5 (@1) | pelvis / torso 5.5 (@1) | yes |
| spearman | jump | < 20 px² | leg-far-upper < pelvis 4.5 (@5) | 0 | arm-far-lower / hand-far 9 (@59) | yes |
| spearman | jumpSquat | < 20 px² | 0 | foot-near 5 (@1) | pelvis / torso 11.5 (@59) | yes |
| spearman | hurt | < 20 px² | 0 | foot-near 5 (@1) | torso / scarf-tail 15.5 (@5) | yes |
| spearman | held | < 20 px² | 0 | foot-near 5 (@1) | pelvis / leg-near-upper 7.5 (@2) | yes |
| spearman | knockdown | < 20 px² | 0 | 0 | torso / scarf-tail 13 (@5) | yes |
| spearman | down | < 20 px² | scarf-tail < torso 21.8 (@51) | leg-far-upper 6.7 (@5) | torso / scarf-tail 13.5 (@4) | **no** |
| spearman | getup | < 20 px² | 0 | 0 | pelvis / leg-far-upper 9.5 (@2) | yes |
| archer | bowShot | < 20 px² | 0 | foot-near 5 (@1) | arm-far-lower / hand-far 9.8 (@23) | yes |
| archer | hurt | < 20 px² | 0 | foot-near 5.5 (@31) | torso / scarf-tail 16 (@45) | yes |
| archer | knockdown, get up | < 20 px² | foot-far < leg-far-lower 54.3 (@114) | foot-near 6 (@37) | torso / scarf-tail 15.5 (@57) | **no** |
| archer | grabbed + kneed | < 20 px² | foot-far < leg-far-lower 16 (@78) | foot-far 6.4 (@78) | torso / scarf-tail 15 (@79) | yes |
| archer | thrown | < 20 px² | foot-far < leg-far-lower 18.8 (@54) | foot-near 7.8 (@56) | torso / scarf-tail 11.5 (@76) | yes |
| archer | cast | < 20 px² | 0 | foot-near 5 (@34) | torso / head 8 (@8) | yes |
| archer | stance | < 20 px² | 0 | foot-near 5 (@1) | arm-far-lower / hand-far 5.5 (@1) | yes |
| archer | jump | < 20 px² | leg-far-upper < pelvis 5 (@1) | hand-near 4 (@59) | arm-near-upper / arm-near-lower 11.3 (@59) | yes |
| archer | jumpSquat | < 20 px² | leg-far-upper < pelvis 5.3 (@1) | foot-near 5 (@1) | leg-near-upper / leg-near-lower 12.5 (@2) | yes |
| archer | hurt | < 20 px² | 0 | foot-near 5 (@1) | torso / scarf-tail 15.5 (@5) | yes |
| archer | held | < 20 px² | 0 | foot-near 5 (@1) | pelvis / leg-near-upper 7.5 (@2) | yes |
| archer | knockdown | < 20 px² | pelvis < leg-near-upper 14 (@2) | 0 | torso / scarf-tail 14.5 (@3) | yes |
| archer | down | < 20 px² | scarf-tail < torso 17.8 (@51) | leg-far-upper 6.7 (@5) | torso / scarf-tail 13.5 (@5) | yes |
| archer | getup | < 20 px² | 0 | 0 | pelvis / leg-far-upper 9.5 (@2) | yes |
