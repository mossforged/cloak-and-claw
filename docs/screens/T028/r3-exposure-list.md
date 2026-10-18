# T028 r3: exposed hidden paint and cut edges, Rat Raider family (Art's repair list)

Written by `node tools/exposure-known.mjs` (check: `tools/bench/exposure.js`, test `tests/exposure.test.mjs`). Every frame key of every
viewer clip for the raider, spearman and archer (they share the A018-A023 drawings), each body view standing, and the
rehearsal sheet's stand-in keys. Worst frame per piece; strips of the worst frame per move:
`r3-exposure-rat-raider.jpg`, `r3-exposure-rat-spearman.jpg`, `r3-exposure-rat-archer.jpg` (exposed paint red, cut runs blue).
Frames named `view: X` (the idle in that body view) and rehearsal keys (`Move: key`) are stand-in poses until T029
poses every move: their flags are real for those drawings but the pose may change; the viewer clips' flags come first.

## Exposed hidden paint (game px², shown over 4)
"Piece under cover": the piece's paint that the cover hides at rest, showing in the frame.

| Piece under cover | Worst px² | Worst frame | Fix |
|---|---|---|---|
| scarf-tail under torso | 156 | rat-raider, Thrown (victim): mid-spin (back) | scarf tail root hidden under the torso shows as the scarf swings: shorter root, or paint it as cloth |
| arm-near-upper under torso | 138.5 | rat-spearman, spearThrust @50 | upper-arm top hidden under the torso / cap shows as the arm swings: rounded shoulder end, painted as fur |
| torso under belt | 111 | rat-raider, Overhead chop (club, axe): follow (two-hand) | waist: torso hem / pelvis top hidden under the belt or jerkin shows as the torso bends: finish it as cloth |
| foot-far under leg-far-lower | 102.8 | rat-raider, walk across @8 | foot top (hidden under the shin) is wider than the shin: narrow it to the shin hem, or widen the hem, so it stays covered as the ankle turns |
| torso under head | 101.3 | rat-raider, ratSlash @59 | torso top under the head shows as the head turns: finish the collar / neck fur under the head |
| foot-near under leg-near-lower | 98.8 | rat-raider, Walk, approach, circle, back-walk: walk 5/9 | foot top (hidden under the shin) is wider than the shin: narrow it to the shin hem, or widen the hem, so it stays covered as the ankle turns |
| pelvis under leg-near-upper | 93.5 | rat-spearman, Spear thrust: lunge | pelvis paint under the thigh (reconstruction) shows as the thigh swings: paint it as finished seat cloth with its seam |
| hand-far under arm-far-lower | 92 | rat-raider, hurt @52 | wrist end hidden under the bracer shows as the fist turns: shorter, rounded wrist end in the hand drawing |
| torso under arm-near-upper | 78.3 | rat-raider, Dagger stab: draw back | torso paint under the arm (views where the arm draws in front) shows as the arm swings: finish it as chest |
| arm-far-upper under torso | 58.3 | rat-archer, Bow draw / aim / release: aim | upper-arm top hidden under the torso / cap shows as the arm swings: rounded shoulder end, painted as fur |
| pelvis under torso | 53.8 | rat-raider, Slash 3 spin (finisher): back (mid-spin) | waist: torso hem / pelvis top hidden under the belt or jerkin shows as the torso bends: finish it as cloth |
| leg-near-upper under pelvis | 43 | rat-raider, Thrown (victim): mid-spin (back) | thigh top (hidden under the seat / apron) shows as the thigh swings: trim it to the seat outline or paint it as trouser cloth |
| leg-far-upper under torso | 42.3 | rat-raider, Dodge roll: roll (back) | thigh top (hidden under the seat / apron) shows as the thigh swings: trim it to the seat outline or paint it as trouser cloth |
| leg-far-upper under pelvis | 37.5 | rat-raider, Slash 2 (backhand): in front | thigh top (hidden under the seat / apron) shows as the thigh swings: trim it to the seat outline or paint it as trouser cloth |
| torso under arm-far-upper | 31.3 | rat-raider, Thrown (victim): mid-spin (back) | torso paint under the arm (views where the arm draws in front) shows as the arm swings: finish it as chest |
| arm-near-upper under arm-near-lower | 28 | rat-raider, view: B | elbow: forearm top / upper-arm end hidden paint shows as the elbow bends: round both ends |
| hand-near under arm-near-lower | 27.8 | rat-raider, view: B | wrist end hidden under the bracer shows as the fist turns: shorter, rounded wrist end in the hand drawing |
| arm-near-upper under shoulder-near | 25.8 | rat-raider, Jump attack: chop | upper-arm top hidden under the torso / cap shows as the arm swings: rounded shoulder end, painted as fur |
| arm-far-upper under arm-far-lower | 23.5 | rat-raider, Dodge roll: roll (back) | elbow: forearm top / upper-arm end hidden paint shows as the elbow bends: round both ends |
| pelvis under leg-far-upper | 11.8 | rat-raider, view: B | pelvis paint under the thigh (reconstruction) shows as the thigh swings: paint it as finished seat cloth with its seam |
| arm-far-upper under shoulder-far | 10.8 | rat-spearman, view: B | upper-arm top hidden under the torso / cap shows as the arm swings: rounded shoulder end, painted as fur |
| tail under pelvis | 7.5 | rat-raider, turn around (x2) @22 | tail root hidden under the pelvis shows as the tail swings: shorter, tapered root |

## Straight cut edges off the reference outline (game px long, 4 or more)

| Piece | Worst px | Worst frame | Fix |
|---|---|---|---|
| foot-far | 9.1 | rat-archer, turn around (x2) @88 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| leg-far-upper | 7.1 | rat-raider, down @3 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| torso | 6.5 | rat-raider, Dodge roll: roll (back) | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| arm-far-upper | 6.5 | rat-archer, view: S | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| scarf-tail | 6.4 | rat-spearman, walk across @29 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| arm-near-upper | 5.3 | rat-archer, grabbed + kneed @22 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| hand-far | 5.3 | rat-raider, hurt @32 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| leg-near-upper | 5.3 | rat-raider, getup @4 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| foot-near | 5 | rat-raider, walk across @18 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| head | 4.6 | rat-raider, knockdown, get up @40 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| pelvis | 4.5 | rat-raider, turn around (x2) @23 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
| hand-near | 4 | rat-spearman, knockdown, get up @45 | straight cut edge showing: outline or round the cut, or extend the piece that covers it |
