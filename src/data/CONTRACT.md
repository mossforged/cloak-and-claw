# data: every tunable number and every content definition

**Owns:** rules, juice, controls, moves, fighters (+ registry), rigs + poses (+ registry), stages (+ registry), items: weapon kits + food (+ registry), props (+ registry).
**Does not own:** logic. Data files export plain objects only.

**Rules:**
- A designer-tunable number never goes in sim/ or render/ code; it goes here.
- New content = new file + one line in that folder's `index.js`.
- The `art:` block of a fighter or stage points at game-ready images under `assets/art/`. The art builder never edits these files; the code builder imports art and edits `art:` blocks.
- A fighter's `art.rig: '<id>'` draws it with `rigs/<id>.js` (+ `<id>-poses.js`) instead of the standee; the standee `idle` image stays as fallback and HUD portrait.
- `art.held: '<item id>'` (T018): a weapon item drawn in a rigged fighter's hand when he has no `kit` and holds nothing else; look only (no moves). A fighter whose `drop` is that item drops what he holds.
- A weapon kit (`items/*.js`, kind `weapon`) = image + grip type + moves + durability + toss (+ `ai` for carriers); its moves name the rig move pose they borrow (`rig`). An enemy carrying a kit (fighter `kit: '<id>'`, T011) takes its moves and ai from it; a new enemy variant = body def spread + kit + rig variant with gear (`rigs/rat-spearman.js`). Stage `props` place breakables; a prop or stage entry's `drops` is an item id or `{ id: weight }`.
- `npm test` includes a data check (`tests/data.test.mjs`): every move, combo link, wave enemy, item, prop, drop and art path must resolve.
