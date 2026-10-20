# T036 joint checker calibration

Numbers (src/data/joint-check.js): samples 9, window {"factor":0.9,"min":60,"max":220},
gap {"close":10,"min":250}, fragment {"floor":4,"thin":3,"max":4000,"perR":1.2}, seam {"dark":70,"near":4,"edge":3,"floor":20,"perR":4}.

| case | joint | expected | got | ok |
| --- | --- | --- | --- | --- |
| a027-r1 (9779df4) | neck | flag at +10/+20 | gap 257px @-10 (-10 -5); seam 1058px @15 (5 10 15 20) [peak share of limit: gap 1.03, fragment 0.72, seam 1.54] | yes |
| a027-r1 (9779df4) | shoulder-near | flag gap at +28 | gap 416px @28 (-20 28) [peak share of limit: gap 1.66, fragment 0.03, seam 1.19] | yes |
| a027-r2 (1145a04) | neck | pass | pass [peak share of limit: gap 0.6, fragment 0.13, seam 0.66] | yes |
| a026-r3 (e8d5a46) | wrist-near | pass | pass [peak share of limit: gap 0.41, fragment 0.13, seam 0.4] | yes |
| a026-r3 (e8d5a46) | ankle-near | pass | pass [peak share of limit: gap 0.26, fragment 0.82, seam 0.31] | yes |
