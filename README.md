# Tales of Cloak & Claw (working title)

A Golden Axe / D&D arcade / River City Ransom inspired belt-scroller beat 'em up, set in the animal world.
Plain JavaScript + canvas. No engine, no build step.

## Run it (Mac)
```
cd path/to/cloak-and-claw
python3 -m http.server 8000
```
Open http://localhost:8000. Add `?debug` to start with the debug overlay on.

## Controls
| Action | Keyboard | Gamepad |
|---|---|---|
| Move | WASD / Arrows | Stick / D-pad |
| Attack (tap for 3-hit combo) | J or Z | X / B |
| Jump (attack in the air to jump-slash) | K, X or Space | A |
| Debug overlay | ` | |
| Pause | P | |
| Restart after defeat | J or Enter | Start |

## Test
`npm test` runs the game headless with a bot (needs Node; no install step).

## For AI collaborators
Read `AGENTS.md` first. Docs: `docs/STATUS.md`, `docs/MODULES.md`, `docs/ART_PIPELINE.md`.
