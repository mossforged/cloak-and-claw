# data: every tunable number and every content definition

**Owns:** rules, juice, controls, moves, fighters (+ registry), stages (+ registry).
**Does not own:** logic. Data files export plain objects only.

**Rules:**
- A designer-tunable number never goes in sim/ or render/ code; it goes here.
- New content = new file + one line in that folder's `index.js`.
- The `art:` block of a fighter or stage points at game-ready images under `assets/art/`. The art builder never edits these files; the code builder imports art and edits `art:` blocks.
- `npm test` includes a data check (`tests/data.test.mjs`): every move, combo link, wave enemy and art path must resolve.
