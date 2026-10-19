# T034 joint limits: clips past the user's ranges

Every frame of every viewer clip and every rehearsal key, measured on the drawn layout (turn on the parent, degrees from the
rest assembled on his points, + = clockwise on screen; the wrist from the hand drawing's neutral). Worst frame per clip and
joint; "past" = degrees outside the range. Whole-limb drawings (arm keys, knee-up, kneeling) and the back view's cuts are
exempt. Regenerate: `node tools/joint-limits-report.mjs [--known]`.

| Joint | Range |
|---|---|
| shoulder-near | -61..59 |
| elbow-near | -73..5 |
| wrist-near | -42..17 |
| hip-near | -23..25 |
| knee-near | -23..51 |
| ankle-near | -19..40 |

## rat-raider (3605 frames, 131 clip x joint past, 2658 exempt joint-frames)

| Joint | Clip | Frame | Turn | Past |
|---|---|---|---|---|
| hip-near | backhand | backhand @28 | 52.3 | 27.3 |
| hip-near | daggerStab | daggerStab @35 | 67.2 | 42.2 |
| hip-near | daggerThrow | daggerThrow @23 | 47.6 | 22.6 |
| hip-near | dashAttack | dashAttack @14 | 47.8 | 22.8 |
| hip-near | dodgeHop | dodgeHop @30 | 34.4 | 9.4 |
| hip-near | grabbed | grabbed + kneed @82 | -45.0 | 22.0 |
| hip-near | hurt | hurt @32 | 40.5 | 15.5 |
| hip-near | jumpAttack | jumpAttack @48 | 38.1 | 13.1 |
| hip-near | jumpUp | jumpUp @51 | 40.9 | 15.9 |
| hip-near | kick | kick @22 | -91.2 | 68.2 |
| hip-near | knockdown | knockdown, get up @37 | -45.0 | 22.0 |
| hip-near | overheadChop | overheadChop @58 | 53.1 | 28.1 |
| hip-near | pose:held | held @11 | -39.5 | 16.5 |
| hip-near | pose:jumpSquat | jumpSquat @11 | 39.3 | 14.3 |
| hip-near | pose:knockdown | knockdown @7 | -40.9 | 17.9 |
| hip-near | pose:run | run @21 | -94.8 | 71.8 |
| hip-near | ratSlash | ratSlash @49 | 49.6 | 24.6 |
| hip-near | rehearsal | rehearsal Run (chase, flee): push-off 2 | -91.0 | 68.0 |
| hip-near | shieldBash | shieldBash @40 | 67.1 | 42.1 |
| hip-near | skidStop | skidStop @9 | 44.3 | 19.3 |
| hip-near | spin | spin @36 | 54.7 | 29.7 |
| hip-near | thrown | thrown @9 | -40.0 | 17.0 |
| hip-near | turn | turn around (x2) @23 | -59.2 | 36.2 |
| hip-near | walk | walk (in place) @28 | -68.2 | 45.2 |
| hip-near | walkAcross | walk across @28 | -68.2 | 45.2 |
| knee-near | backhand | backhand @40 | -65.0 | 42.0 |
| knee-near | daggerStab | daggerStab @16 | -84.2 | 61.2 |
| knee-near | daggerThrow | daggerThrow @23 | -55.6 | 32.6 |
| knee-near | dashAttack | dashAttack @14 | -84.0 | 61.0 |
| knee-near | dodgeHop | dodgeHop @30 | -81.3 | 58.3 |
| knee-near | dodgeRoll | dodgeRoll @38 | -66.3 | 43.3 |
| knee-near | grabbed | grabbed + kneed @171 | -109.7 | 86.7 |
| knee-near | guard | guard @27 | -65.4 | 42.4 |
| knee-near | hurt | hurt @32 | -53.4 | 30.4 |
| knee-near | jumpAttack | jumpAttack @47 | -89.3 | 66.3 |
| knee-near | jumpUp | jumpUp @51 | -93.8 | 70.8 |
| knee-near | kick | kick @36 | -99.7 | 76.7 |
| knee-near | knockdown | knockdown, get up @120 | -110.5 | 87.5 |
| knee-near | overheadChop | overheadChop @64 | -66.5 | 43.5 |
| knee-near | pose:hurt | hurt @2 | -24.6 | 1.6 |
| knee-near | pose:jumpSquat | jumpSquat @11 | -90.8 | 67.8 |
| knee-near | pose:run | run @14 | 175.5 | 124.5 |
| knee-near | ratSlash | ratSlash @58 | -83.5 | 60.5 |
| knee-near | rehearsal | rehearsal Run (chase, flee): both feet up | 131.8 | 80.8 |
| knee-near | shieldBash | shieldBash @18 | -84.0 | 61.0 |
| knee-near | skidStop | skidStop @9 | -52.5 | 29.5 |
| knee-near | spin | spin @45 | -62.4 | 39.4 |
| knee-near | thrown | thrown @131 | -110.8 | 87.8 |
| knee-near | turn | turn around (x2) @22 | 81.2 | 30.2 |
| knee-near | walk | walk (in place) @19 | 122.3 | 71.3 |
| knee-near | walkAcross | walk across @79 | 122.3 | 71.3 |
| ankle-near | backhand | backhand @26 | -23.1 | 4.1 |
| ankle-near | daggerStab | daggerStab @24 | -43.4 | 24.4 |
| ankle-near | dashAttack | dashAttack @23 | -46.3 | 27.3 |
| ankle-near | dodgeHop | dodgeHop @30 | 40.9 | 0.9 |
| ankle-near | grabbed | grabbed + kneed @171 | 69.1 | 29.1 |
| ankle-near | guard | guard @27 | 40.6 | 0.6 |
| ankle-near | jumpAttack | jumpAttack @47 | 45.0 | 5.0 |
| ankle-near | jumpUp | jumpUp @51 | 46.9 | 6.9 |
| ankle-near | kick | kick @35 | 102.7 | 62.7 |
| ankle-near | knockdown | knockdown, get up @120 | 69.8 | 29.8 |
| ankle-near | overheadChop | overheadChop @47 | -26.5 | 7.5 |
| ankle-near | pose:held | held @2 | -24.4 | 5.4 |
| ankle-near | pose:jumpSquat | jumpSquat @11 | 45.5 | 5.5 |
| ankle-near | pose:run | run @83 | -142.0 | 123.0 |
| ankle-near | rehearsal | rehearsal Run (chase, flee): both feet up | -114.7 | 95.7 |
| ankle-near | shieldBash | shieldBash @26 | -44.3 | 25.3 |
| ankle-near | skidStop | skidStop @6 | -24.2 | 5.2 |
| ankle-near | spin | spin @36 | -70.7 | 51.7 |
| ankle-near | thrown | thrown @131 | 70.0 | 30.0 |
| ankle-near | turn | turn around (x2) @22 | -35.9 | 16.9 |
| ankle-near | walk | walk (in place) @19 | -93.7 | 74.7 |
| ankle-near | walkAcross | walk across @19 | -93.7 | 74.7 |
| shoulder-near | backhand | backhand @5 | 172.0 | 113.0 |
| shoulder-near | daggerStab | daggerStab @5 | 173.6 | 114.6 |
| shoulder-near | daggerThrow | daggerThrow @25 | -166.9 | 105.9 |
| shoulder-near | dashAttack | dashAttack @6 | 176.3 | 117.3 |
| shoulder-near | dodgeRoll | dodgeRoll @12 | 169.4 | 110.4 |
| shoulder-near | grabbed | grabbed + kneed @109 | 143.5 | 84.5 |
| shoulder-near | hurt | hurt @36 | 98.9 | 39.9 |
| shoulder-near | jumpAttack | jumpAttack @51 | -134.1 | 73.1 |
| shoulder-near | jumpUp | jumpUp @16 | 133.3 | 74.3 |
| shoulder-near | knockdown | knockdown, get up @58 | 143.5 | 84.5 |
| shoulder-near | overheadChop | overheadChop @63 | -170.3 | 109.3 |
| shoulder-near | pose:down | down @7 | 113.1 | 54.1 |
| shoulder-near | pose:held | held @6 | 115.5 | 56.5 |
| shoulder-near | pose:hurt | hurt @6 | 98.9 | 39.9 |
| shoulder-near | pose:jump | jump @7 | 115.2 | 56.2 |
| shoulder-near | pose:knockdown | knockdown @7 | 136.3 | 77.3 |
| shoulder-near | rally | rally @66 | -172.7 | 111.7 |
| shoulder-near | ratSlash | ratSlash @35 | -159.6 | 98.6 |
| shoulder-near | rehearsal | rehearsal Slash 1 (forehand cut): over the shoulder (depth switch) | -176.0 | 115.0 |
| shoulder-near | spin | spin @63 | -167.5 | 106.5 |
| shoulder-near | thrown | thrown @64 | 129.7 | 70.7 |
| elbow-near | backhand | backhand @43 | -150.5 | 77.5 |
| elbow-near | cast | cast @0 | -138.9 | 65.9 |
| elbow-near | daggerStab | daggerStab @1 | -167.5 | 94.5 |
| elbow-near | daggerThrow | daggerThrow @22 | -166.7 | 93.7 |
| elbow-near | dashAttack | dashAttack @12 | -173.7 | 100.7 |
| elbow-near | dodgeHop | dodgeHop @55 | -142.1 | 69.1 |
| elbow-near | dodgeRoll | dodgeRoll @10 | 172.4 | 167.4 |
| elbow-near | fidget | fidget @30 | -145.3 | 72.3 |
| elbow-near | grabbed | grabbed + kneed @4 | -142.6 | 69.6 |
| elbow-near | guard | guard @66 | -144.7 | 71.7 |
| elbow-near | hurt | hurt @54 | -149.1 | 76.1 |
| elbow-near | idle | idle @55 | -142.1 | 69.1 |
| elbow-near | jumpAttack | jumpAttack @54 | -143.7 | 70.7 |
| elbow-near | jumpUp | jumpUp @60 | -142.0 | 69.0 |
| elbow-near | kick | kick @34 | -149.8 | 76.8 |
| elbow-near | knockdown | knockdown, get up @32 | -147.9 | 74.9 |
| elbow-near | overheadChop | overheadChop @69 | -141.8 | 68.8 |
| elbow-near | pose:cast | cast @0 | -138.9 | 65.9 |
| elbow-near | pose:down | down @0 | -138.9 | 65.9 |
| elbow-near | pose:getup | getup @0 | -138.9 | 65.9 |
| elbow-near | pose:held | held @2 | -142.6 | 69.6 |
| elbow-near | pose:hurt | hurt @0 | -138.9 | 65.9 |
| elbow-near | pose:jump | jump @2 | -147.2 | 74.2 |
| elbow-near | pose:jumpSquat | jumpSquat @0 | -138.9 | 65.9 |
| elbow-near | pose:knockdown | knockdown @2 | -147.9 | 74.9 |
| elbow-near | pose:run | run @0 | -138.9 | 65.9 |
| elbow-near | pose:stance | stance @7 | -140.4 | 67.4 |
| elbow-near | rally | rally @69 | -141.3 | 68.3 |
| elbow-near | ratSlash | ratSlash @68 | -156.0 | 83.0 |
| elbow-near | rehearsal | rehearsal Dash attack: dash | -172.9 | 99.9 |
| elbow-near | shieldBash | shieldBash @56 | -142.1 | 69.1 |
| elbow-near | skidStop | skidStop @27 | -145.6 | 72.6 |
| elbow-near | spin | spin @65 | -157.7 | 84.7 |
| elbow-near | thrown | thrown @4 | -142.6 | 69.6 |
| elbow-near | turn | turn around (x2) @55 | -142.1 | 69.1 |
| elbow-near | walk | walk (in place) @8 | -140.4 | 67.4 |
| elbow-near | walkAcross | walk across @151 | -142.0 | 69.0 |

## rat-spearman (2345 frames, 78 clip x joint past, 1288 exempt joint-frames)

| Joint | Clip | Frame | Turn | Past |
|---|---|---|---|---|
| hip-near | grabbed | grabbed + kneed @82 | -45.0 | 22.0 |
| hip-near | hurt | hurt @32 | 40.5 | 15.5 |
| hip-near | knockdown | knockdown, get up @37 | -45.0 | 22.0 |
| hip-near | pose:held | held @11 | -39.5 | 16.5 |
| hip-near | pose:jumpSquat | jumpSquat @11 | 39.3 | 14.3 |
| hip-near | pose:knockdown | knockdown @7 | -40.9 | 17.9 |
| hip-near | rehearsal | rehearsal Staff two-hand swing / overhead: swing | 50.8 | 25.8 |
| hip-near | spearThrust | spearThrust @49 | 45.7 | 20.7 |
| hip-near | staffOverhead | staffOverhead @56 | 53.1 | 28.1 |
| hip-near | staffSwing | staffSwing @42 | 52.8 | 27.8 |
| hip-near | thrown | thrown @9 | -40.0 | 17.0 |
| hip-near | turn | turn around (x2) @23 | -59.2 | 36.2 |
| hip-near | walk | walk (in place) @28 | -68.2 | 45.2 |
| hip-near | walkAcross | walk across @28 | -68.2 | 45.2 |
| knee-near | grabbed | grabbed + kneed @171 | -109.7 | 86.7 |
| knee-near | hurt | hurt @32 | -53.4 | 30.4 |
| knee-near | knockdown | knockdown, get up @120 | -110.5 | 87.5 |
| knee-near | pose:hurt | hurt @2 | -24.6 | 1.6 |
| knee-near | pose:jumpSquat | jumpSquat @11 | -90.8 | 67.8 |
| knee-near | rehearsal | rehearsal Staff two-hand swing / overhead: overhead strike | -65.1 | 42.1 |
| knee-near | spearThrust | spearThrust @1 | -52.0 | 29.0 |
| knee-near | staffOverhead | staffOverhead @34 | -92.8 | 69.8 |
| knee-near | staffSwing | staffSwing @24 | -91.5 | 68.5 |
| knee-near | thrown | thrown @131 | -110.8 | 87.8 |
| knee-near | turn | turn around (x2) @22 | 81.2 | 30.2 |
| knee-near | walk | walk (in place) @19 | 122.3 | 71.3 |
| knee-near | walkAcross | walk across @79 | 122.3 | 71.3 |
| ankle-near | grabbed | grabbed + kneed @171 | 69.1 | 29.1 |
| ankle-near | knockdown | knockdown, get up @120 | 69.8 | 29.8 |
| ankle-near | pose:held | held @2 | -24.4 | 5.4 |
| ankle-near | pose:jumpSquat | jumpSquat @11 | 45.5 | 5.5 |
| ankle-near | rehearsal | rehearsal Spear thrust: lunge | -20.0 | 1.0 |
| ankle-near | spearThrust | spearThrust @49 | -21.8 | 2.8 |
| ankle-near | staffOverhead | staffOverhead @34 | 54.9 | 14.9 |
| ankle-near | staffSwing | staffSwing @24 | 54.9 | 14.9 |
| ankle-near | thrown | thrown @131 | 70.0 | 30.0 |
| ankle-near | turn | turn around (x2) @22 | -35.9 | 16.9 |
| ankle-near | walk | walk (in place) @19 | -93.7 | 74.7 |
| ankle-near | walkAcross | walk across @19 | -93.7 | 74.7 |
| shoulder-near | cast | cast @0 | -64.3 | 3.3 |
| shoulder-near | grabbed | grabbed + kneed @157 | -65.9 | 4.9 |
| shoulder-near | hurt | hurt @36 | -87.3 | 26.3 |
| shoulder-near | idle | idle @75 | -64.5 | 3.5 |
| shoulder-near | knockdown | knockdown, get up @106 | -65.9 | 4.9 |
| shoulder-near | pose:cast | cast @0 | -64.3 | 3.3 |
| shoulder-near | pose:down | down @0 | -64.3 | 3.3 |
| shoulder-near | pose:getup | getup @0 | -64.3 | 3.3 |
| shoulder-near | pose:held | held @0 | -64.3 | 3.3 |
| shoulder-near | pose:hurt | hurt @7 | -83.8 | 22.8 |
| shoulder-near | pose:jump | jump @2 | -64.9 | 3.9 |
| shoulder-near | pose:jumpSquat | jumpSquat @0 | -64.3 | 3.3 |
| shoulder-near | pose:knockdown | knockdown @0 | -64.3 | 3.3 |
| shoulder-near | pose:stance | stance @0 | -64.3 | 3.3 |
| shoulder-near | rehearsal | rehearsal Staff two-hand swing / overhead: overhead strike | -98.4 | 37.4 |
| shoulder-near | spearThrust | spearThrust @49 | -75.5 | 14.5 |
| shoulder-near | staffOverhead | staffOverhead @34 | -132.5 | 71.5 |
| shoulder-near | staffSwing | staffSwing @32 | -79.8 | 18.8 |
| shoulder-near | thrown | thrown @117 | -65.9 | 4.9 |
| shoulder-near | turn | turn around (x2) @24 | -94.5 | 33.5 |
| shoulder-near | walk | walk (in place) @27 | -81.6 | 20.6 |
| shoulder-near | walkAcross | walk across @27 | -81.6 | 20.6 |
| elbow-near | grabbed | grabbed + kneed @157 | 17.5 | 12.5 |
| elbow-near | hurt | hurt @38 | 17.6 | 12.6 |
| elbow-near | idle | idle @75 | 5.6 | 0.6 |
| elbow-near | knockdown | knockdown, get up @106 | 17.5 | 12.5 |
| elbow-near | pose:down | down @5 | 17.4 | 12.4 |
| elbow-near | pose:held | held @1 | 17.3 | 12.3 |
| elbow-near | pose:hurt | hurt @3 | 16.9 | 11.9 |
| elbow-near | pose:jump | jump @7 | 10.1 | 5.1 |
| elbow-near | pose:knockdown | knockdown @1 | 17.3 | 12.3 |
| elbow-near | rehearsal | rehearsal Staff two-hand swing / overhead: wind | -119.2 | 46.2 |
| elbow-near | spearThrust | spearThrust @77 | 11.1 | 6.1 |
| elbow-near | staffOverhead | staffOverhead @19 | -172.2 | 99.2 |
| elbow-near | staffSwing | staffSwing @23 | -119.2 | 46.2 |
| elbow-near | thrown | thrown @117 | 17.5 | 12.5 |
| elbow-near | turn | turn around (x2) @24 | 46.4 | 41.4 |
| elbow-near | walk | walk (in place) @27 | 17.6 | 12.6 |
| elbow-near | walkAcross | walk across @27 | 17.6 | 12.6 |

## rat-archer (2206 frames, 58 clip x joint past, 1254 exempt joint-frames)

| Joint | Clip | Frame | Turn | Past |
|---|---|---|---|---|
| hip-near | grabbed | grabbed + kneed @82 | -45.0 | 22.0 |
| hip-near | hurt | hurt @32 | 40.5 | 15.5 |
| hip-near | knockdown | knockdown, get up @37 | -45.0 | 22.0 |
| hip-near | pose:held | held @11 | -39.5 | 16.5 |
| hip-near | pose:jumpSquat | jumpSquat @11 | 39.3 | 14.3 |
| hip-near | pose:knockdown | knockdown @7 | -40.9 | 17.9 |
| hip-near | thrown | thrown @9 | -40.0 | 17.0 |
| hip-near | turn | turn around (x2) @23 | -59.2 | 36.2 |
| hip-near | walk | walk (in place) @28 | -68.2 | 45.2 |
| hip-near | walkAcross | walk across @28 | -68.2 | 45.2 |
| knee-near | grabbed | grabbed + kneed @171 | -109.7 | 86.7 |
| knee-near | hurt | hurt @32 | -53.4 | 30.4 |
| knee-near | knockdown | knockdown, get up @120 | -110.5 | 87.5 |
| knee-near | pose:hurt | hurt @2 | -24.6 | 1.6 |
| knee-near | pose:jumpSquat | jumpSquat @11 | -90.8 | 67.8 |
| knee-near | thrown | thrown @131 | -110.8 | 87.8 |
| knee-near | turn | turn around (x2) @22 | 81.2 | 30.2 |
| knee-near | walk | walk (in place) @19 | 122.3 | 71.3 |
| knee-near | walkAcross | walk across @79 | 122.3 | 71.3 |
| ankle-near | grabbed | grabbed + kneed @171 | 69.1 | 29.1 |
| ankle-near | knockdown | knockdown, get up @120 | 69.8 | 29.8 |
| ankle-near | pose:held | held @2 | -24.4 | 5.4 |
| ankle-near | pose:jumpSquat | jumpSquat @11 | 45.5 | 5.5 |
| ankle-near | thrown | thrown @131 | 70.0 | 30.0 |
| ankle-near | turn | turn around (x2) @22 | -35.9 | 16.9 |
| ankle-near | walk | walk (in place) @19 | -93.7 | 74.7 |
| ankle-near | walkAcross | walk across @19 | -93.7 | 74.7 |
| shoulder-near | bowShot | bowShot @41 | -179.2 | 118.2 |
| shoulder-near | grabbed | grabbed + kneed @172 | 160.1 | 101.1 |
| shoulder-near | knockdown | knockdown, get up @121 | 160.1 | 101.1 |
| shoulder-near | pose:down | down @2 | -154.5 | 93.5 |
| shoulder-near | pose:getup | getup @2 | -178.4 | 117.4 |
| shoulder-near | pose:held | held @2 | -160.0 | 99.0 |
| shoulder-near | pose:jump | jump @2 | -155.8 | 94.8 |
| shoulder-near | pose:jumpSquat | jumpSquat @2 | 178.4 | 119.4 |
| shoulder-near | pose:knockdown | knockdown @3 | 157.5 | 98.5 |
| shoulder-near | rehearsal | rehearsal Bow draw / aim / release: aim | -179.2 | 118.2 |
| shoulder-near | thrown | thrown @132 | 160.1 | 101.1 |
| elbow-near | bowShot | bowShot @3 | 178.1 | 173.1 |
| elbow-near | cast | cast @0 | -100.4 | 27.4 |
| elbow-near | grabbed | grabbed + kneed @82 | -125.6 | 52.6 |
| elbow-near | hurt | hurt @37 | -167.1 | 94.1 |
| elbow-near | idle | idle @0 | -100.4 | 27.4 |
| elbow-near | knockdown | knockdown, get up @37 | -125.6 | 52.6 |
| elbow-near | pose:cast | cast @0 | -100.4 | 27.4 |
| elbow-near | pose:down | down @0 | -100.4 | 27.4 |
| elbow-near | pose:getup | getup @7 | -116.3 | 43.3 |
| elbow-near | pose:held | held @7 | -114.2 | 41.2 |
| elbow-near | pose:hurt | hurt @7 | -167.1 | 94.1 |
| elbow-near | pose:jump | jump @7 | -124.3 | 51.3 |
| elbow-near | pose:jumpSquat | jumpSquat @7 | -127.6 | 54.6 |
| elbow-near | pose:knockdown | knockdown @7 | -125.6 | 52.6 |
| elbow-near | pose:stance | stance @0 | -100.4 | 27.4 |
| elbow-near | rehearsal | rehearsal Bow draw / aim / release: aim | 158.0 | 153.0 |
| elbow-near | thrown | thrown @123 | -116.3 | 43.3 |
| elbow-near | turn | turn around (x2) @0 | -100.4 | 27.4 |
| elbow-near | walk | walk (in place) @0 | -100.4 | 27.4 |
| elbow-near | walkAcross | walk across @0 | -100.4 | 27.4 |
