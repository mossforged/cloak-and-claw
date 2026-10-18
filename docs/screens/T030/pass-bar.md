# T030: pass bar (rat family; art: the A023 round imported on this branch)

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
| spearman | walk (in place) | zero | 0 | 0 | torso / arm-near-upper 14.5 (@12) | **no** |
| spearman | walk across | zero | 0 | 0 | torso / arm-near-upper 14.5 (@25) | **no** |
| spearman | turn around (x2) | zero | arm-near-upper < torso 19.8 (@24) | arm-near-upper 4.3 (@24) | arm-far-lower / hand-far 13.3 (@81) | **no** |
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
| spearman | spearThrust | < 20 px² | arm-near-upper < torso 128.8 (@40) | arm-near-upper 7.2 (@40) | torso / arm-far-upper 15 (@49) | **no** |
| spearman | hurt | < 20 px² | 0 | 0 | torso / scarf-tail 16 (@45) | yes |
| spearman | knockdown, get up | < 20 px² | foot-far < leg-far-lower 54.5 (@114) | foot-far 5 (@114) | torso / scarf-tail 16 (@35) | **no** |
| spearman | grabbed + kneed | < 20 px² | 0 | 0 | torso / scarf-tail 15 (@79) | yes |
| spearman | thrown | < 20 px² | arm-near-upper < torso 5 (@52) | 0 | torso / arm-near-upper 12 (@46) | yes |
| spearman | cast | < 20 px² | arm-near-upper < torso 124.3 (@7) | 0 | arm-far-lower / hand-far 7.5 (@7) | **no** |
| spearman | stance | < 20 px² | 0 | 0 | arm-far-lower / hand-far 10.8 (@1) | yes |
| spearman | jump | < 20 px² | 0 | 0 | torso / arm-near-upper 11.5 (@2) | yes |
| spearman | jumpSquat | < 20 px² | leg-far-upper < pelvis 4.3 (@1) | leg-far-upper 4.9 (@1) | torso / arm-near-upper 13.5 (@4) | yes |
| spearman | hurt | < 20 px² | 0 | 0 | torso / scarf-tail 15.5 (@5) | yes |
| spearman | held | < 20 px² | arm-near-upper < torso 5 (@1) | 0 | torso / arm-near-upper 8.5 (@1) | yes |
| spearman | knockdown | < 20 px² | 0 | 0 | torso / scarf-tail 13 (@5) | yes |
| spearman | down | < 20 px² | leg-far-upper < pelvis 5 (@2) | leg-far-upper 4.9 (@2) | torso / scarf-tail 13.5 (@4) | yes |
| spearman | getup | < 20 px² | 0 | 0 | torso / arm-near-upper 13 (@3) | yes |
| archer | bowShot | < 20 px² | 0 | arm-far-lower 4.2 (@55) | torso / arm-near-upper 16 (@9) | yes |
| archer | hurt | < 20 px² | 0 | 0 | torso / arm-near-upper 11 (@55) | yes |
| archer | knockdown, get up | < 20 px² | foot-far < leg-far-lower 54.5 (@114) | foot-far 5 (@114) | torso / arm-near-upper 16 (@63) | **no** |
| archer | grabbed + kneed | < 20 px² | 0 | 0 | torso / arm-far-upper 16 (@10) | yes |
| archer | thrown | < 20 px² | 0 | 0 | torso / arm-far-upper 16 (@31) | yes |
| archer | cast | < 20 px² | arm-near-upper < torso 50.5 (@7) | 0 | arm-far-lower / hand-far 6.5 (@8) | **no** |
| archer | stance | < 20 px² | 0 | 0 | arm-far-lower / hand-far 5.5 (@1) | yes |
| archer | jump | < 20 px² | 0 | 0 | torso / arm-near-upper 11.5 (@2) | yes |
| archer | jumpSquat | < 20 px² | leg-far-upper < pelvis 4.8 (@1) | leg-far-upper 4.5 (@78) | arm-near-lower / hand-near 13.8 (@3) | yes |
| archer | hurt | < 20 px² | 0 | 0 | pelvis / torso 8 (@5) | yes |
| archer | held | < 20 px² | arm-near-upper < torso 24.3 (@5) | arm-near-upper 4.6 (@5) | torso / arm-far-upper 16 (@3) | **no** |
| archer | knockdown | < 20 px² | 0 | 0 | torso / arm-far-upper 15.5 (@3) | yes |
| archer | down | < 20 px² | leg-far-upper < pelvis 4.8 (@1) | leg-far-upper 6.4 (@2) | torso / arm-near-upper 16 (@7) | yes |
| archer | getup | < 20 px² | 0 | 0 | torso / arm-near-upper 13 (@5) | yes |

## What A023 round 5 fixed (T030 import)
- **Crotch / far hip:** the seat closes the pelvis / thigh seam in idle and walk for all three rats (was 13-15 px in every
  bar clip); elsewhere the hip seam fell from 16 to 9.5-12.5 px. The rehearsal's seat paint (pelvis under the near thigh,
  92-99 px²) is gone.
- **Far foot top:** no cut end in the walk any more (was 21.5 px² + a 4 px cut at @25).
- **Scarf root:** the spear thrust no longer shows it (was 68 px²).
- **Turn-around far thigh:** 9 -> 6.8 px² (still over zero, see below).

How the checks treat the seat: the seam measure counts it as cover wherever it is drawn (nothing waived). The
unfinished-paint check builds its hidden zones *without* the seat (`surface: true` in `src/data/rigs/anatomy.js`): the
thigh cloth under it was finished, visible paint before round 5 and shouldn't count as hidden paint. Paint that the
pelvis or torso hides still flags.

## Left for the lead (piece, move, frame, size)
**Why the bar clips still miss:** the zero-seam bar was never only about the crotch. The r5 report listed only the worst seam per
clip, and the 13-16 px crotch seam hid these, all on the known list since T026 / T028 at about the same sizes:
| Clip | Seams still open (game px) |
|---|---|
| idle | raider: far shoulder 6, near wrist 5, neck 3, scarf 2.5. spearman: near armpit 11, far wrist 10.8, waist 5.5, neck 3. archer: near shoulder 6, far wrist 5.5, neck 2.5, scarf 2.5 |
| walk | far knee 10.5 (was 9.5), near knee 8, near hip 7.5 (raider, archer), armpit 11.5-14.5 (spearman, archer), scarf 4-9.5, wrists 4.5-10.8, waist 5 (spearman), neck 3 |
| turn around | far elbow 10.3 @24 (raider), far wrist 13.3 @81 (spearman), near elbow 11.8 (archer), tail joints 7.5-11, near ankle 8.8 |
| ratSlash | waist 13.5 @49, neck 12.5, far hip 9.5 |

**Unfinished paint / cut edges in bar clips:**
- leg-far-upper under pelvis, turn around @24, 6.8 px² (all three rats).
- arm-near-upper under torso, spearman turn around @24, 19.8 px² + 4.3 px cut.
- scarf-tail under torso, archer walk across @27, 18.8 px² + 4.6 px cut.

**Other moves over 20 px²:**
- arm-near-upper under torso: cast @10 124.8 (raider), @7 124.3 (spearman), 50.5 (archer); spearman spearThrust @40 128.8
  + a new 7.2 px cut; archer held @5 24.3. The repainted shoulder end didn't clear the cast.
- foot-far under leg-far-lower: knockdown @3 66.5, knockdown/get up @114 54.5 + 5 px cut. The new domed top shows
  above the shin when the far leg folds (spearman's known 68.8 is now 54.5; raider / archer were listed at 21.5).

**New since round 5 (small):**
- cut arm-near-upper 4.6 px, knockdown/get up @103 (raider, archer); 7.2 px spearThrust @40 (spearman).
- cut leg-far-upper 6 px, down @5 (raider, spearman).
- seam arm-near-upper / shoulder-near 8.5 px, raider cast @9.
- Paint at rest vs the master: 1.68% -> 2.17% of the silhouette (the seat paints the crotch unlike A017; map
  `paint-rat.jpg`). Known level raised in `src/data/paint-check.js`. Not a gap, but it isn't the master either.
