# T032: pass bar (rat family; art: the A023 round imported on this branch)

Written by `node tools/pass-bar.mjs`: every frame key of every viewer clip, through the unfinished-paint check (T028 r4:
exposed hidden paint counts only when flat or beside a straight cut), the straight-cut-edge check and the pose seam test
(both unchanged from round 3), with the user's grip lines in place. Bar: idle, walk, the turning slash (ratSlash) and the
turn-around at zero flags of all three kinds; every other move under 20 game px² of unfinished paint per piece
(cut edges and seams listed there for the record). Strips of the worst frame per move: `pass-bar-rat-*.jpg`.

**Result: 22 clips miss the bar.**

## Bar clips (zero flags)
| Fighter | Clip | Bar | Unfinished paint (worst piece, px²) | Cut edge (px) | Seam (px) | Pass |
|---|---|---|---|---|---|---|
| raider | idle | zero | 0 | 0 | torso / arm-far-upper 6 (@32) | **no** |
| raider | walk (in place) | zero | 0 | 0 | leg-far-upper / leg-far-lower 10.5 (@2) | **no** |
| raider | walk across | zero | 0 | 0 | torso / scarf-tail 9.5 (@13) | **no** |
| raider | turn around (x2) | zero | leg-far-upper < pelvis 6.8 (@24) | 0 | arm-far-upper / arm-far-lower 10.3 (@24) | **no** |
| raider | ratSlash | zero | 0 | 0 | pelvis / torso 13.5 (@49) | **no** |
| spearman | idle | zero | 0 | 0 | torso / arm-near-upper 11 (@70) | **no** |
| spearman | walk (in place) | zero | 0 | 0 | torso / arm-near-upper 14.3 (@12) | **no** |
| spearman | walk across | zero | 0 | 0 | torso / arm-near-upper 15 (@31) | **no** |
| spearman | turn around (x2) | zero | arm-near-upper < torso 18 (@24) | arm-near-upper 4.3 (@24) | arm-far-lower / hand-far 13.3 (@81) | **no** |
| archer | idle | zero | 0 | 0 | torso / arm-near-upper 6 (@17) | **no** |
| archer | walk (in place) | zero | 0 | 0 | torso / arm-near-upper 11.5 (@4) | **no** |
| archer | walk across | zero | scarf-tail < torso 18.8 (@27) | scarf-tail 4.6 (@27) | torso / arm-near-upper 11.5 (@7) | **no** |
| archer | turn around (x2) | zero | leg-far-upper < pelvis 6.8 (@24) | 0 | torso / arm-near-upper 13 (@25) | **no** |

## Every other move (under 20 px² of unfinished paint per piece)
| Fighter | Clip | Bar | Unfinished paint (worst piece, px²) | Cut edge (px) | Seam (px) | Pass |
|---|---|---|---|---|---|---|
| raider | hurt | < 20 px² | 0 | 0 | arm-near-lower / hand-near 10.8 (@45) | yes |
| raider | knockdown, get up | < 20 px² | foot-far < leg-far-lower 54.5 (@114) | foot-far 5 (@114) | torso / scarf-tail 16 (@35) | **no** |
| raider | grabbed + kneed | < 20 px² | arm-far-upper < torso 9.3 (@5) | arm-far-upper 5.3 (@5) | torso / arm-far-upper 16 (@10) | yes |
| raider | thrown | < 20 px² | hand-near < arm-near-lower 4.8 (@47) | hand-near 4.6 (@47) | torso / arm-far-upper 16 (@31) | yes |
| raider | cast | < 20 px² | arm-near-upper < torso 124.8 (@10) | 0 | arm-near-upper / shoulder-near 8.5 (@9) | **no** |
| raider | stance | < 20 px² | 0 | 0 | arm-near-lower / hand-near 4 (@1) | yes |
| raider | jump | < 20 px² | 0 | 0 | arm-near-lower / hand-near 13.5 (@63) | yes |
| raider | jumpSquat | < 20 px² | leg-far-upper < pelvis 4.5 (@1) | leg-far-upper 7.8 (@1) | leg-near-upper / leg-near-lower 12.5 (@4) | yes |
| raider | hurt | < 20 px² | 0 | 0 | torso / arm-near-upper 9.5 (@5) | yes |
| raider | held | < 20 px² | arm-far-upper < torso 8.3 (@3) | arm-far-upper 5 (@3) | torso / arm-far-upper 15.5 (@3) | yes |
| raider | knockdown | < 20 px² | foot-far < leg-far-lower 66.5 (@3) | foot-far 4.5 (@3) | torso / arm-far-upper 14 (@5) | **no** |
| raider | down | < 20 px² | leg-far-upper < pelvis 5 (@5) | leg-far-upper 4.2 (@2) | arm-near-lower / hand-near 14.8 (@5) | yes |
| raider | getup | < 20 px² | 0 | 0 | pelvis / leg-far-upper 9.5 (@2) | yes |
| spearman | spearThrust | < 20 px² | arm-near-upper < torso 132 (@40) | arm-near-upper 7.2 (@40) | torso / arm-far-upper 16 (@49) | **no** |
| spearman | hurt | < 20 px² | 0 | 0 | torso / scarf-tail 16 (@45) | yes |
| spearman | knockdown, get up | < 20 px² | foot-far < leg-far-lower 54.5 (@114) | foot-far 5 (@114) | torso / scarf-tail 16 (@35) | **no** |
| spearman | grabbed + kneed | < 20 px² | 0 | 0 | torso / scarf-tail 15 (@79) | yes |
| spearman | thrown | < 20 px² | 0 | 0 | torso / arm-near-upper 11 (@65) | yes |
| spearman | cast | < 20 px² | arm-near-upper < torso 124.3 (@7) | 0 | pelvis / torso 6 (@7) | **no** |
| spearman | stance | < 20 px² | 0 | 0 | arm-far-lower / hand-far 10.8 (@1) | yes |
| spearman | jump | < 20 px² | 0 | 0 | torso / arm-near-upper 11.5 (@3) | yes |
| spearman | jumpSquat | < 20 px² | leg-far-upper < pelvis 4.3 (@1) | leg-far-upper 4.9 (@1) | pelvis / torso 11.5 (@6) | yes |
| spearman | hurt | < 20 px² | 0 | 0 | torso / scarf-tail 15.5 (@5) | yes |
| spearman | held | < 20 px² | 0 | 0 | leg-near-upper / leg-near-lower 7.5 (@2) | yes |
| spearman | knockdown | < 20 px² | 0 | 0 | torso / scarf-tail 13 (@5) | yes |
| spearman | down | < 20 px² | leg-far-upper < pelvis 5 (@2) | leg-far-upper 4.9 (@2) | torso / scarf-tail 13.5 (@4) | yes |
| spearman | getup | < 20 px² | 0 | 0 | torso / arm-near-upper 9.5 (@2) | yes |
| archer | bowShot | < 20 px² | 0 | arm-far-lower 4.2 (@55) | torso / arm-near-upper 16 (@9) | yes |
| archer | hurt | < 20 px² | 0 | 0 | torso / arm-near-upper 11 (@55) | yes |
| archer | knockdown, get up | < 20 px² | foot-far < leg-far-lower 54.5 (@114) | foot-far 5 (@114) | torso / arm-near-upper 16 (@63) | **no** |
| archer | grabbed + kneed | < 20 px² | 0 | 0 | torso / arm-far-upper 16 (@10) | yes |
| archer | thrown | < 20 px² | 0 | 0 | torso / arm-far-upper 16 (@31) | yes |
| archer | cast | < 20 px² | arm-near-upper < torso 50.5 (@7) | 0 | torso / head 8 (@8) | **no** |
| archer | stance | < 20 px² | 0 | 0 | arm-far-lower / hand-far 5.5 (@1) | yes |
| archer | jump | < 20 px² | 0 | 0 | torso / arm-near-upper 11.5 (@2) | yes |
| archer | jumpSquat | < 20 px² | leg-far-upper < pelvis 4.8 (@1) | leg-far-upper 4.5 (@78) | arm-near-lower / hand-near 13.8 (@3) | yes |
| archer | hurt | < 20 px² | 0 | 0 | torso / scarf-tail 7 (@3) | yes |
| archer | held | < 20 px² | arm-near-upper < torso 24.3 (@5) | arm-near-upper 4.6 (@5) | torso / arm-far-upper 16 (@3) | **no** |
| archer | knockdown | < 20 px² | 0 | 0 | torso / arm-far-upper 15.5 (@3) | yes |
| archer | down | < 20 px² | leg-far-upper < pelvis 4.8 (@1) | leg-far-upper 6.4 (@2) | torso / arm-near-upper 16 (@7) | yes |
| archer | getup | < 20 px² | 0 | 0 | torso / arm-near-upper 13 (@5) | yes |
