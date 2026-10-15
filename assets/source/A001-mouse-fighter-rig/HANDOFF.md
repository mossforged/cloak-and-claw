# A001 — Mouse Fighter rig source

Branch: `a001-mouse-fighter-rig`. Source delivery for human look review; not an approved or assembled production rig.

## Delivered

- `reference.png`: assembled neutral-ish right-facing Mouse Fighter, 1159 × 1358, character silhouette over 1024 px tall.
- `parts-sheet.png`: 1536 × 1024, fourteen separated pieces; packet-approved sheet alternative to fourteen individual PNGs.
- `review.png`: all source art previewed on mid-grey and reference at 130 px silhouette height over Harbor Market. Preview keying only; original source pixels retained.
- `prompt.md`: tool, exact prompts, inputs and review-composition method.

## Sheet map

Read left to right within each row. Rows are visually spaced, not equal-sized slicing cells.

| Row | Parts in order |
|---|---|
| Top | head; torso; scarf-tail; tail; sword |
| Middle | arm-front-upper; arm-front-lower; arm-back-upper; arm-back-lower; shield |
| Bottom | leg-front-upper; leg-front-lower; leg-back-upper; leg-back-lower |

## Known flaws / acceptance gaps

- The tool did not maintain identical scale between reference and sheet. Parts are smaller than their reference counterparts, and proportions vary somewhat; this is not a pixel-aligned cut-apart reference. No inferred pivots or corrective rig code supplied.
- Reference is a slight three-quarter view, with the low sword crossing the legs and a mild action stance. Arms could be farther from torso. The isolated shield is face-on as requested; the assembled reference shield is angled.
- Rounded extensions are present, but the tool painted conspicuous ball-like caps, including blue caps on upper arms and torso. These need art review for suitability under overlaps.
- The scarf-tail piece includes its own knot while the torso also has a knot/wrap; the tool did not fully respect that separation. No source repainting workaround applied.
- Front lower hand is an empty closed grip for the separate sword, rather than visibly gripping a hilt in that isolated piece. Far-side arms are oriented differently and do not consistently use darker lighting.
- Generated green backgrounds are visually flat but have small RGB variation rather than guaranteed exact #00FF00. Preview keying shows clean major silhouettes; production edge cleanup has not been performed.
- Requested large landscape sheet resolved to 1536 × 1024. Sources satisfy the long-side minimum, but individual parts are below 1024 px tall. Individual PNGs omitted under the allowed sheet alternative.

All fourteen requested pieces are present with clear space and no inter-part overlap. No animation, game imports or changes to game code were made.

## Human gate

Does it still look like Mouse Fighter, and would you be happy seeing it move? Review the listed art gaps before authorizing the rig build. State `source` records delivery only, not acceptance.
