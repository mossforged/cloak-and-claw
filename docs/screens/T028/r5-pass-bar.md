# T028 r5: pass bar (rat family; art: the A023 round imported on this branch)

Written by `node tools/pass-bar.mjs`: every frame key of every viewer clip, through the unfinished-paint check (T028 r4:
exposed hidden paint counts only when flat or beside a straight cut), the straight-cut-edge check and the pose seam test
(both unchanged from round 3), with the user's grip lines in place. Bar: idle, walk, the turning slash (ratSlash) and the
turn-around at zero flags of all three kinds; every other move under 20 game px² of unfinished paint per piece
(cut edges and seams listed there for the record). Strips of the worst frame per move: `r5-exposure-rat-*.jpg`.

**Result: 18 clips miss the bar.**

## Bar clips (zero flags)
| Fighter | Clip | Bar | Unfinished paint (worst piece, px²) | Cut edge (px) | Seam (px) | Pass |
|---|---|---|---|---|---|---|
| raider | idle | zero | 0 | pelvis 4 (@9) | pelvis / leg-far-upper 13 (@0) | **no** |
| raider | walk (in place) | zero | foot-far < leg-far-lower 21.5 (@25) | foot-far 4 (@25) | pelvis / leg-far-upper 15 (@19) | **no** |
| raider | walk across | zero | foot-far < leg-far-lower 21.5 (@25) | foot-far 4 (@25) | pelvis / leg-far-upper 15 (@19) | **no** |
| raider | turn around (x2) | zero | leg-far-upper < pelvis 9 (@24) | 0 | pelvis / leg-far-upper 15 (@29) | **no** |
| raider | ratSlash | zero | 0 | 0 | pelvis / leg-far-upper 16 (@8) | **no** |
| spearman | idle | zero | 0 | 0 | pelvis / leg-far-upper 13 (@0) | **no** |
| spearman | walk (in place) | zero | foot-far < leg-far-lower 21.5 (@25) | foot-far 4 (@25) | pelvis / leg-far-upper 15 (@19) | **no** |
| spearman | walk across | zero | foot-far < leg-far-lower 21.5 (@25) | foot-far 4 (@25) | pelvis / leg-far-upper 15 (@19) | **no** |
| spearman | turn around (x2) | zero | leg-far-upper < pelvis 9 (@24) | 0 | pelvis / leg-far-upper 15 (@29) | **no** |
| archer | idle | zero | 0 | 0 | pelvis / leg-far-upper 13 (@0) | **no** |
| archer | walk (in place) | zero | foot-far < leg-far-lower 21.5 (@25) | foot-far 4 (@25) | pelvis / leg-far-upper 15 (@19) | **no** |
| archer | walk across | zero | foot-far < leg-far-lower 21.5 (@25) | foot-far 4 (@25) | pelvis / leg-far-upper 15 (@19) | **no** |
| archer | turn around (x2) | zero | leg-far-upper < pelvis 9 (@24) | 0 | pelvis / leg-far-upper 15 (@29) | **no** |

## Every other move (under 20 px² of unfinished paint per piece)
| Fighter | Clip | Bar | Unfinished paint (worst piece, px²) | Cut edge (px) | Seam (px) | Pass |
|---|---|---|---|---|---|---|
| raider | hurt | < 20 px² | 0 | 0 | pelvis / leg-near-upper 16 (@35) | yes |
| raider | knockdown, get up | < 20 px² | 0 | head 4.6 (@40) | pelvis / leg-far-upper 16 (@109) | yes |
| raider | grabbed + kneed | < 20 px² | arm-far-upper < torso 9.3 (@5) | arm-far-upper 5.3 (@5) | torso / arm-far-upper 16 (@10) | yes |
| raider | thrown | < 20 px² | hand-near < arm-near-lower 4.8 (@47) | hand-near 4.6 (@47) | torso / arm-far-upper 16 (@31) | yes |
| raider | cast | < 20 px² | arm-near-upper < torso 124 (@10) | 0 | pelvis / leg-far-upper 13 (@7) | **no** |
| raider | stance | < 20 px² | 0 | 0 | pelvis / leg-far-upper 13 (@1) | yes |
| raider | jump | < 20 px² | 0 | leg-far-upper 4.6 (@63) | arm-near-lower / hand-near 13.5 (@63) | yes |
| raider | jumpSquat | < 20 px² | leg-far-upper < pelvis 7.8 (@1) | 0 | pelvis / leg-near-upper 14 (@4) | yes |
| raider | hurt | < 20 px² | 0 | 0 | pelvis / leg-far-upper 15.5 (@3) | yes |
| raider | held | < 20 px² | arm-far-upper < torso 8.3 (@3) | arm-far-upper 5 (@3) | torso / arm-far-upper 15.5 (@3) | yes |
| raider | knockdown | < 20 px² | foot-far < leg-far-lower 45.3 (@4) | foot-far 4.3 (@4) | torso / arm-far-upper 14 (@5) | **no** |
| raider | down | < 20 px² | leg-far-upper < pelvis 8.3 (@4) | leg-far-upper 7.1 (@3) | arm-near-lower / hand-near 14.8 (@5) | yes |
| raider | getup | < 20 px² | 0 | 0 | pelvis / leg-near-upper 15.5 (@4) | yes |
| spearman | spearThrust | < 20 px² | scarf-tail < torso 68 (@40) | scarf-tail 4.6 (@40) | pelvis / leg-far-upper 16 (@5) | **no** |
| spearman | hurt | < 20 px² | 0 | 0 | pelvis / leg-near-upper 16 (@35) | yes |
| spearman | knockdown, get up | < 20 px² | 0 | 0 | pelvis / leg-far-upper 16 (@109) | yes |
| spearman | grabbed + kneed | < 20 px² | 0 | pelvis 4 (@77) | pelvis / leg-near-upper 16 (@172) | yes |
| spearman | thrown | < 20 px² | arm-near-upper < torso 5 (@42) | 0 | pelvis / leg-far-upper 16 (@134) | yes |
| spearman | cast | < 20 px² | arm-near-upper < torso 124.3 (@9) | 0 | pelvis / leg-far-upper 13 (@7) | **no** |
| spearman | stance | < 20 px² | 0 | 0 | pelvis / leg-far-upper 13 (@1) | yes |
| spearman | jump | < 20 px² | 0 | leg-far-upper 4.6 (@1) | torso / arm-near-upper 11.5 (@2) | yes |
| spearman | jumpSquat | < 20 px² | leg-far-upper < pelvis 8 (@1) | leg-far-upper 4 (@6) | pelvis / leg-near-upper 14 (@4) | yes |
| spearman | hurt | < 20 px² | 0 | 0 | pelvis / leg-far-upper 15.5 (@3) | yes |
| spearman | held | < 20 px² | arm-near-upper < torso 5 (@1) | 0 | pelvis / leg-far-upper 13 (@1) | yes |
| spearman | knockdown | < 20 px² | 0 | pelvis 4 (@5) | torso / scarf-tail 13 (@5) | yes |
| spearman | down | < 20 px² | leg-far-upper < pelvis 8.3 (@1) | leg-far-upper 7.1 (@3) | torso / scarf-tail 13.5 (@4) | yes |
| spearman | getup | < 20 px² | 0 | 0 | pelvis / leg-near-upper 15.5 (@4) | yes |
| archer | bowShot | < 20 px² | 0 | arm-far-lower 4.2 (@55) | torso / arm-far-upper 16 (@12) | yes |
| archer | hurt | < 20 px² | 0 | pelvis 4 (@52) | pelvis / leg-near-upper 16 (@35) | yes |
| archer | knockdown, get up | < 20 px² | scarf-tail < torso 8.8 (@53) | scarf-tail 4.2 (@53) | pelvis / leg-far-upper 16 (@109) | yes |
| archer | grabbed + kneed | < 20 px² | 0 | pelvis 4 (@77) | torso / arm-far-upper 16 (@10) | yes |
| archer | thrown | < 20 px² | 0 | 0 | torso / arm-far-upper 16 (@31) | yes |
| archer | cast | < 20 px² | 0 | 0 | pelvis / leg-far-upper 13 (@7) | yes |
| archer | stance | < 20 px² | 0 | 0 | pelvis / leg-far-upper 13 (@1) | yes |
| archer | jump | < 20 px² | 0 | leg-far-upper 4.6 (@1) | torso / arm-near-upper 13 (@2) | yes |
| archer | jumpSquat | < 20 px² | leg-far-upper < pelvis 8 (@1) | 0 | pelvis / leg-near-upper 14 (@4) | yes |
| archer | hurt | < 20 px² | 0 | 0 | pelvis / leg-far-upper 15.5 (@3) | yes |
| archer | held | < 20 px² | 0 | 0 | torso / arm-far-upper 16 (@3) | yes |
| archer | knockdown | < 20 px² | 0 | 0 | torso / arm-far-upper 15.5 (@3) | yes |
| archer | down | < 20 px² | arm-near-upper < torso 34.3 (@3) | leg-far-upper 9.9 (@3) | torso / arm-near-upper 15 (@7) | **no** |
| archer | getup | < 20 px² | 0 | 0 | pelvis / leg-near-upper 15.5 (@4) | yes |
