# T040: v3's own poses against their targets

node tools/v3-own-check.mjs --out docs/screens/T040/table.md

| Move | Key | Target | Got | Pass |
|---|---|---|---|---|
| spearThrust | strike | spear point within 20 deg of forward | -16.5 deg | yes |
| ratSlash | windup | blade above the shoulder line, behind the head | tip 48.9 px above the near shoulder, 34.4 px behind the head's back | yes |
| overheadChop | windup | axe head above the head | axe head -34.1 px above the head's top | **no** |
| guard | strike | shield centre below the eyes, in front of the chest | centre 34.4 px below the eyes | yes |
| guard | windup | shield centre below the eyes, in front of the chest | centre 19.9 px below the eyes | yes |

| Fighter | Clip | Frames | Joints outside | Item out of its fist | Frames the item overlaps the head (worst px) |
|---|---|---|---|---|---|
| rat-spearman | idle | 61 | 0 | 0 | 0 |
| rat-spearman | walk | 61 | 0 | 0 | 0 |
| rat-spearman | spearThrust | 79 | 0 | 0 | 0 |
| rat-spearman | staffSwing | 57 | 0 | 0 | 0 |
| rat-spearman | staffOverhead | 71 | 0 | 0 | 6 (3) |
| rat-raider | ratSlash | 68 | 0 | 0 | 20 (636) |
| rat-raider | overheadChop | 73 | 0 | 0 | 30 (461) |
| rat-raider | guard | 75 | 0 | 0 | 4 (1) |
| rat-raider | shieldBash | 47 | 0 | 0 | 0 |
