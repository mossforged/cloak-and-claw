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
| arm-near-upper under torso | 204 | rat-raider, Overhead chop (club, axe): strike | upper-arm top hidden under the torso / cap shows as the arm swings: rounded shoulder end, painted as fur |
| scarf-tail under torso | 158 | rat-raider, Slash 3 spin (finisher): back (mid-spin) | scarf tail root hidden under the torso shows as the scarf swings: shorter root, or paint it as cloth |
| foot-far under leg-far-lower | 54.5 | rat-raider, knockdown, get up @114 | foot top (hidden under the shin) is wider than the shin: narrow it to the shin hem, or widen the hem, so it stays covered as the ankle turns |
| torso under belt | 46.3 | rat-raider, Stagger (heavy): knee | waist: torso hem / pelvis top hidden under the belt or jerkin shows as the torso bends: finish it as cloth |
| arm-far-upper under torso | 35.5 | rat-spearman, staffOverhead @28 | upper-arm top hidden under the torso / cap shows as the arm swings: rounded shoulder end, painted as fur |
| pelvis under torso | 33.5 | rat-raider, spin @38 | waist: torso hem / pelvis top hidden under the belt or jerkin shows as the torso bends: finish it as cloth |
| torso under arm-near-upper | 33.3 | rat-raider, daggerStab @40 | torso paint under the arm (views where the arm draws in front) shows as the arm swings: finish it as chest |
| torso under arm-far-upper | 30.3 | rat-raider, Thrown (victim): mid-spin (back) | torso paint under the arm (views where the arm draws in front) shows as the arm swings: finish it as chest |
| torso under head | 23.3 | rat-raider, Throw the hero over the shoulder (back throw): lift | torso top under the head shows as the head turns: finish the collar / neck fur under the head |
| leg-far-upper under pelvis | 20.5 | rat-raider, Forward throw (rat throws): heave | thigh top (hidden under the seat / apron) shows as the thigh swings: trim it to the seat outline or paint it as trouser cloth |
| foot-near under leg-near-lower | 8.8 | rat-raider, guard @4 | foot top (hidden under the shin) is wider than the shin: narrow it to the shin hem, or widen the hem, so it stays covered as the ankle turns |

## Straight cut edges off the reference outline (game px long, 4 or more)

| Piece | Worst px | Worst frame | Fix |
|---|---|---|---|
| leg-far-upper | 6.7 | rat-raider, down @5 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| arm-near-upper | 6.4 | rat-raider, jumpAttack @8 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| arm-far-upper | 5.3 | rat-raider, grabbed + kneed @5 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| head | 5.3 | rat-raider, rally @63 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| foot-far | 5 | rat-raider, knockdown, get up @114 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| scarf-tail | 4.6 | rat-archer, walk across @27 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| arm-far-lower | 4.2 | rat-archer, bowShot @55 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
