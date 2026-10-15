# Tales of Cloak & Claw (working title)

A Golden Axe / D&D arcade / River City Ransom inspired belt-scroller beat 'em up, set in the animal world.
Plain JavaScript + canvas. No engine, no build step.

Play online: https://mossforged.github.io/cloak-and-claw/

## Run it (Mac)
**Easiest:** double-click `tools/Play.command` in Finder. It starts a no-cache server on port 8100 and opens the game; keep its Terminal window open while playing, close it to stop.

Or from a terminal:
```
cd path/to/cloak-and-claw
python3 tools/serve.py
```
Open http://localhost:8000 (a no-cache server on port 8000: a plain reload picks up every change; `python3 -m http.server 8000` also works but may need hard reloads). Add `?debug` to start with the debug overlay on.

**Tuning lab:** http://localhost:8000/lab.html (online: https://mossforged.github.io/cloak-and-claw/lab.html) runs the game with live sliders for moves, movement, rules, Rat Raider and juice, plus slow motion, passive rats and wave respawn. "Copy changes" gives `file -> path: old -> new` lines to paste to the lead. Changes survive a reload; "Reset all" restores the defaults.

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

## How this project is built
A lead chat writes task packets (`docs/tasks/`) and reviews branches; **Claude Code** builds code (`CLAUDE.md`); **Codex** builds art (`AGENTS.md`); the user plays and answers stage gates.
Start with `docs/STATUS.md`. Also: `docs/decisions.md`, `docs/handoffs/game-brief.md`, `docs/style-contract.md`, `docs/handoffs/asset-contract.md`, `docs/MODULES.md`, `docs/handoffs/setup-mac.md`.
