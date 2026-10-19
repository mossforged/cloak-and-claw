# T030: unfinished exposed paint and cut edges, Rat Raider family (A023 round 5 imported)

Written by `node tools/exposure-known.mjs` (check: `tools/bench/exposure.js`, test `tests/exposure.test.mjs`). Every frame key of every
viewer clip for the raider, spearman and archer (they share the A018-A023 drawings), each body view standing, and the
rehearsal sheet's stand-in keys. Worst frame per piece; strips of the worst frame per move:
`r4-exposure-rat-raider.jpg`, `r4-exposure-rat-spearman.jpg`, `r4-exposure-rat-archer.jpg` (unfinished exposed paint red, cut runs blue).
T028 r4: exposed hidden paint counts only when unfinished: flat over the region (30% or more of it plain fill) or beside a straight cut run;
finished paint meant to show (A023 round 4's repaint) passes. Pass bar: `r4-pass-bar.md`.
Frames named `view: X` (the idle in that body view) and rehearsal keys (`Move: key`) are stand-in poses until T029
poses every move: their flags are real for those drawings but the pose may change; the viewer clips' flags come first.

## Unfinished exposed hidden paint (game px², shown over 4)
"Piece under cover": the piece's paint that the cover hides at rest, showing in the frame.

| Piece under cover | Worst px² | Worst frame | Fix |
|---|---|---|---|
| arm-near-upper under torso | 262.5 | rat-archer, view: B | upper-arm top hidden under the torso / cap shows as the arm swings: rounded shoulder end, painted as fur |
| scarf-tail under torso | 158 | rat-raider, Slash 3 spin (finisher): back (mid-spin) | scarf tail root hidden under the torso shows as the scarf swings: shorter root, or paint it as cloth |
| leg-near-upper under pelvis | 90.5 | rat-raider, Thrown (victim): mid-spin (back) | thigh top (hidden under the seat / apron) shows as the thigh swings: trim it to the seat outline or paint it as trouser cloth |
| torso under arm-near-upper | 78.8 | rat-raider, daggerStab @8 | torso paint under the arm (views where the arm draws in front) shows as the arm swings: finish it as chest |
| foot-far under leg-far-lower | 54.3 | rat-raider, knockdown, get up @114 | foot top (hidden under the shin) is wider than the shin: narrow it to the shin hem, or widen the hem, so it stays covered as the ankle turns |
| pelvis under torso | 33.5 | rat-raider, spin @38 | waist: torso hem / pelvis top hidden under the belt or jerkin shows as the torso bends: finish it as cloth |
| torso under arm-far-upper | 30.3 | rat-raider, Thrown (victim): mid-spin (back) | torso paint under the arm (views where the arm draws in front) shows as the arm swings: finish it as chest |
| torso under head | 29.5 | rat-raider, Stagger (heavy): knee | torso top under the head shows as the head turns: finish the collar / neck fur under the head |
| leg-far-upper under pelvis | 20.5 | rat-raider, Forward throw (rat throws): heave | thigh top (hidden under the seat / apron) shows as the thigh swings: trim it to the seat outline or paint it as trouser cloth |
| arm-near-upper under arm-near-lower | 15 | rat-raider, run @71 | elbow: forearm top / upper-arm end hidden paint shows as the elbow bends: round both ends |
| arm-far-upper under torso | 14 | rat-spearman, staffOverhead @14 | upper-arm top hidden under the torso / cap shows as the arm swings: rounded shoulder end, painted as fur |
| pelvis under leg-near-upper | 14 | rat-archer, knockdown @2 | pelvis paint under the thigh (reconstruction) shows as the thigh swings: paint it as finished seat cloth with its seam |
| torso under belt | 7.3 | rat-spearman, view: LB | waist: torso hem / pelvis top hidden under the belt or jerkin shows as the torso bends: finish it as cloth |

## Straight cut edges off the reference outline (game px long, 4 or more)

| Piece | Worst px | Worst frame | Fix |
|---|---|---|---|
| foot-near | 7.8 | rat-raider, thrown @56 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| leg-far-upper | 6.7 | rat-raider, down @5 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| foot-far | 6.4 | rat-raider, grabbed + kneed @78 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| hand-near | 6.4 | rat-raider, jumpSquat @3 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| arm-far-upper | 5.3 | rat-raider, grabbed + kneed @5 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| head | 5.3 | rat-raider, rally @63 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| scarf-tail | 5.3 | rat-raider, down @51 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| arm-near-upper | 4.5 | rat-raider, Slash 3 spin (finisher): back (mid-spin) | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
