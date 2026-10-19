# T034: swaps on the user's joint points

Each swap of the six near parts shares the part's pivot (through its offset): where his pivot lands on the swap's own
drawing, against where the old pivot landed. Off = px from the nearest drawn pixel. Regenerate: `node tools/joint-points-swaps.mjs`.

**Doesn't fit:** arm-near-cocked (15 px off), arm-near-smear-o (7 px off), arm-near-mouth (39 px off), hand-near-open (16 px off), hand-near-grip (8 px off), hand-near-grip-overhand (14 px off), hand-near-pinch (16 px off), hand-near-palm (18 px off), hand-near-cup (14 px off), hand-near-point (17 px off).

| Joint | Drawing | His pivot | Old pivot | |
|---|---|---|---|---|
| shoulder-near | arm-near-upper | on | on | fits |
| shoulder-near | arm-near-cocked (whole limb) | 15 px off | on | **doesn't fit** |
| shoulder-near | arm-near-raised (whole limb) | on | on | fits |
| shoulder-near | arm-near-smear-h (whole limb) | on | 11 px off | fits |
| shoulder-near | arm-near-smear-o (whole limb) | 7 px off | on | **doesn't fit** |
| shoulder-near | arm-near-mouth (whole limb) | 39 px off | 7 px off | **doesn't fit** |
| shoulder-near | arm-near-upper-back | 7 px off | on | own points (B view) |
| elbow-near | arm-near-lower | on | on | fits |
| elbow-near | arm-near-lower-back | on | on | own points (B view) |
| wrist-near | hand-near | on | on | fits |
| wrist-near | hand-near-fist | on | on | fits |
| wrist-near | hand-near-open | 16 px off | on | **doesn't fit** |
| wrist-near | hand-near-grip | 8 px off | on | **doesn't fit** |
| wrist-near | hand-near-grip-overhand | 14 px off | 7 px off | **doesn't fit** |
| wrist-near | hand-near-pinch | 16 px off | on | **doesn't fit** |
| wrist-near | hand-near-palm | 18 px off | on | **doesn't fit** |
| wrist-near | hand-near-cup | 14 px off | 2 px off | **doesn't fit** |
| wrist-near | hand-near-point | 17 px off | on | **doesn't fit** |
| wrist-near | hand-near-back | on | on | own points (B view) |
| wrist-near | hand-near-grip-under | 60 px off | 38 px off | under piece (drawn with its grip face; no wrist end) |
| wrist-near | hand-near-grip-overhand-under | 48 px off | 26 px off | under piece (drawn with its grip face; no wrist end) |
| wrist-near | hand-near-pinch-under | 60 px off | 38 px off | under piece (drawn with its grip face; no wrist end) |
| hip-near | leg-near-upper | on | on | fits |
| hip-near | leg-near-kneeling (whole limb) | on | on | fits |
| hip-near | leg-near-kneeup (whole limb) | on | on | fits |
| hip-near | leg-near-upper-back | on | on | own points (B view) |
| knee-near | leg-near-lower | on | on | fits |
| knee-near | leg-near-lower-back | on | on | own points (B view) |
| ankle-near | foot-near | on | on | fits |
| ankle-near | foot-near-toe | on | on | fits |
| ankle-near | foot-near-heel | on | on | fits |
| ankle-near | foot-near-out | on | on | fits |
| ankle-near | foot-near-back | on | on | own points (B view) |
