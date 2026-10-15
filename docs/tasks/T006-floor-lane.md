# T006 - Walkable lane matches the stage art (code builder)

**Modules:** `src/data/stages/harbor-market.js`, `src/data/lab-schema.js`. **Read:** `src/data/CONTRACT.md`, `docs/playtests/log.md` (Stage 1 gate: "the lane doesn't line up with the background").
**Needs:** nothing. **Autonomy:** human-gated (the user judges whether it looks right).

Fighters can walk where the art shows no floor (or can't reach floor that's there). The walkable belt is the `floor` box in the stage data; the stage image's position is `art.x/y/w`.

## Do
1. Add the stage's `floor.top/bottom/left/right` and `art.x/y/w` to the lab schema (a "Stage" section) so the user can adjust them live; the debug overlay already draws the floor box.
2. Set new defaults so the belt covers the open stone floor of the Harbor Market and nothing else: feet never stand on stall fronts, steps, the boat or the front dock posts; the whole visible open floor is reachable. Adjust the stage image placement too if that helps (e.g. lower the image so the floor band is deeper). Keep the belt at least ~85 px deep.
3. Check enemy spawn and entry still work (they enter from the sides onto the belt).

## Acceptance
- Headless: `npm test` passes (data test checks playerStart is on the floor).
- Windowed: `docs/screens/T006/`: debug overlay on, a fighter at each corner of the belt.
- Human: does where you can walk now match what you see?

Out of scope: scrolling, new stage art, obstacles.
