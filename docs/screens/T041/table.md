# T041: v3's own poses against their targets

node tools/v3-own-check.mjs --out docs/screens/T041/table.md

| Move | Key | Target | Got | Pass |
|---|---|---|---|---|
| spearThrust | strike | spear point within 15 deg of forward (T041; T040: 20) | -0.1 deg | yes |
| staffOverhead | windup | staff centre above the head top (T041) | centre -78.7 px above the head's top (shaft -29.4 deg) | **no** |
| ratSlash | windup | blade above the shoulder line, behind the head | tip 48.9 px above the near shoulder, 34.4 px behind the head's back | yes |
| overheadChop | windup | axe head above the head | axe head -34.1 px above the head's top | **no** |
| guard | strike | shield centre below the eyes, in front of the chest | centre 34.4 px below the eyes | yes |
| guard | windup | shield centre below the eyes, in front of the chest | centre 19.9 px below the eyes | yes |

| Fighter | Clip | Frames | Joints outside | Item out of its fist | Frames the item overlaps the head (worst px) |
|---|---|---|---|---|---|
| rat-spearman | idle | 61 | 0 | 0 | 18 (4) |
| rat-spearman | walk | 61 | 0 | 0 | 0 |
| rat-spearman | spearThrust | 79 | 0 | 0 | 1 (1) |
| rat-spearman | staffSwing | 57 | 0 | 0 | 0 |
| rat-spearman | staffOverhead | 71 | 0 | 0 | 21 (3) |
| rat-raider | ratSlash | 68 | 0 | 0 | 21 (636) |
| rat-raider | overheadChop | 73 | 0 | 0 | 31 (461) |
| rat-raider | guard | 75 | 0 | 0 | 4 (1) |
| rat-raider | shieldBash | 47 | 0 | 0 | 0 |

## T041 notes (item-led spear and staff, impact)

Every frame of v3's spear and staff clips has both fists on the shaft (far fist within 1 px of it, at grip2 or slid back
along it), every joint inside the limits (tests/item-lead.test.mjs). Every key holds its item exactly where it is posed
(the item never had to move at a key); the drawn angle differs from the key's only by the move's body lean.

Where v3 can hold a two-hander (node tools/item-lead-map.mjs <clip> <key> <angles> [--map] [--free=<joints>]): a window
about 8 x 20 px, 40-50 px behind the hips' point.
- Forward edge: the near wrist (-49..9). With only that limit lifted, the spear's near fist could go 56 px further
  forward at the thrust (x -48..+8 instead of -48..-40).
- Low edge: the far arm's reach to grip2 (lifting the far arm's limits lets the carry sit ~10 px lower). Keys sit on
  this edge so the shaft passes under the snout.
- Staff over the head: not reachable. Inside the limits the near wrist (-49) and near shoulder (+67) cap the raise at
  about -40 deg (at -40 the shaft crosses the face, so the key uses -30). With every arm limit lifted the staff's grip
  still can't rise more than 42 px above the hips: its centre lies between the two fists, ~30 px from the shoulders,
  so no joint range would put it over the head (the arms' length and the grip lines' place on the staff stop it).

Impact (data/impact.js; on for v3's slash, chop, spear thrust, staff swing, staff overhead, shield bash): the hit frame
(first active frame on the strike) carries the pose 15% past the strike, the weapon arm's bones 6% longer; next frame
3% longer on the strike pose; then settled. The slash and chop each gain one head-overlap frame (the overshoot frame;
depth unchanged). The raider's own clips have none (seam and pass-bar tests run the game rigs only).
