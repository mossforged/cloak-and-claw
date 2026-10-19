# T029 round 2: what's left that only art can fix

Pass bar after round 2 (`pass-bar.md`, `node tools/pass-bar.mjs T029`): **50 of 73 clips pass** (round 1: 41).
Views now snap on their keys (no slide of the old view's joint points under a new drawing), which cleared the spin's
in-between frame (pelvis < far thigh 222 px², torso < head 143), every frame-1 slide (jumpUp, dashAttack, run, daggerStab,
spearThrust: 31-48 px²) and the shield bash's 202 px² (also a slide frame). The backhand's strike fist went 12 px lower
(pose data: 44 px² -> 0). The staff moves are clean with A021's staff.

## Over the bar, art only (piece, move, frame, size)
| Piece (hidden paint shown) | Move | Frame | px² | What the drawing needs |
|---|---|---|---|---|
| arm-near-upper under torso (raised near arm's shoulder end) | rally | @4 (also @2-8, @60-65) | 151.8 | the raised arm's shoulder end finished where the vest edge doesn't cover it (known since T030: cast 125) |
| arm-near-upper under torso | cast (raider / spearman / archer) | @10 / @8 / @7 | 125.5 / 124 / 49.8 | same raised-arm shoulder end |
| torso under arm-near-upper (side chest) | daggerStab | @39 (recovery), @8 (windup) | 45 / 42.8 | torso-side: the shoulder area under a low, forward near arm finished (the arm passes there between keys) |
| pelvis under torso (back view waist) | spin | @38 (just after the back key) | 33.5 | torso-back's waist hem reaching over pelvis-back's top when the chest tips forward a few degrees |
| arm-near-upper under torso (back view) | dodgeRoll | @18 | 29.8 | the near upper arm's top end finished for the back view (arm behind the back torso) |
| scarf-tail under torso (back view) | dodgeRoll | @13 | 24 | the scarf root finished for the back view |
| foot-far under leg-far-lower (far foot top) | knockdown, get up (all three) | @114 | 54.5 | known since T030 (far foot top above the shin when the far leg folds) |

## Bar clips (zero flags) still missing on the known seams
idle, walk, walk across, turn-around for all three rats and the turning slash: unchanged from round 1 and T030 (the
seam widths in `pass-bar.md`, all on the known list; shoulder / wrist / knee / scarf joints). Not new.

## Under the bar, listed for the record (over 15 px²)
- hand-near under arm-near-lower, jumpUp @18: 19 px² (wrist under the bracer on the rise).
- leg-far-upper under pelvis, spin @39-54 (front view): up to 17.5 px².

## Archer jump and getup (the "regression")
No archer pose changed. The fighter id comes from a global counter, and the standee's idle breathing uses it as its phase
(`render/standee.js`). Round 1 added raider clips, which shifted the archer's ids, so the pass bar measured a different
set of frame keys. The viewer sandbox now numbers fighters from 1 in every clip, so a clip plays the same whatever ran
before it: the archer's jump and getup pass again (as in T030), and the same probe run alone gives the same result.
