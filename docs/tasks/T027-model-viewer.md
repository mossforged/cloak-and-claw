# T027 - Model viewer: review any character's moves and held items without playing a level (Code)

**Modules:** new `viewer.html` + `src/viewer/` (page only; reads the game's data and renders with the game's own renderer), `README.md` (link), `tools/Play.command` (open the viewer too). **Read:** `src/render/CONTRACT.md`, `src/render/rig.js` (`drawRig`, `rigFrame`, `heldOf`, `forceGrip`), `src/data/rigs/index.js`, `src/data/fighters/index.js`, `src/data/items/index.js`, `tools/hold-sheet.html` and `tools/look-sheet.html` (they already drive the renderer outside the game), `tools/bench/stretch.js`. **Needs:** T025 merged. **Autonomy:** human-gated (the user uses it for every rig review from now on).

The user (2026-10-17): "rather than [loading] the model I need to review into a level, we create a small model viewer app that lets me load the current version of each model and press buttons to see different animations or change object held." From now on every rig review happens here first: the user judges a character in motion in seconds, in exactly the pose data and renderer the game uses.

## Do
1. **One page, `viewer.html`**, linked from `index.html` and the README, opened by `tools/Play.command` alongside the game (`/viewer.html`). Desktop and phone (buttons, not keys; nothing covers the character).
2. **Pick a character:** every fighter that has a rig (Mouse Fighter, Rat Raider, Rat Spearman, Rat Archer, and new ones automatically when added to the registries). One big character in the middle at a selectable size (game size 1x, 2x, 3x), facing right, with a **Flip** button.
3. **Animations as buttons**, built from the rig's poses and the fighter's moves (not a hand-kept list): idle, walk (walking in place, or **across the floor** at the sim walk speed so foot sliding shows), every attack (plays wind-up, strike, recovery with the move's real frame timing, hit-stop and swoosh), jump (squat, rise, fall, land), block + block hit, hurt, knockdown -> lying -> get-up, grab / knee / throws, pickup / stow / draw, cast, downed / revive, and any pose the rig defines. **Loop** toggle; **speed** 0.25x / 0.5x / 1x; **pause** and **frame step** (back / forward); a scrubber across the current move.
4. **Held item picker:** none, or any item the character can hold (its own weapon, every floor weapon, spear, bow, shield, potion). **Grip mode** picker (side / overhand / underhand / reverse) from T025. Attacks use the held item's kit moves when it has them.
5. **Look options** (rats and any body with variety): colourway / tint pick or "random", gear picks (hood, helmet, hat), face details, size variant; a **Randomise** button.
6. **Overlays (toggles):** floor line, joint pivots, sockets, the stretch test's seam flags live on the current frame, hit box during attacks, and a "ghost" of the rest pose.
7. **Background:** neutral grey or Harbor Market at game scale.
8. **Side by side:** an optional second slot to compare two characters or two versions (e.g. the old rat beside the new one during T026; the mouse beside the rat for scale).
9. **Share a view:** the URL holds the state (`?f=rat-spearman&anim=spearThrust&item=rat-spear&grip=overhand&speed=0.5`) so the lead can send the user straight to the thing to look at; a **Screenshot** button saves a PNG.
10. No gameplay state is changed (render only); the game itself is untouched.

## Acceptance
- Headless: a test loads every rigged fighter in the viewer's model list and steps every animation button for its full length without throwing; the URL state round-trips; `npm test` passes.
- Windowed: `docs/screens/T027/`: the viewer with the mouse mid-attack, the spearman with an overhand spear, two characters side by side, overlays on.
- Human: can you review a character's moves and holds faster here than in a level? What's missing?

Out of scope: editing poses or numbers in the viewer (that's the lab), new art, new moves.

## Addendum (lead, 2026-10-17): every review on the phone, no terminal
User: "going forward, I want to do all our asset reviews, whether animations, still images, models, whatever ... in a way that I can do on my phone rather than having to go through a terminal or a port." So this task also builds the review path:

11. **Branch previews on GitHub Pages.** New workflow `.github/workflows/pages.yml`: on every push to any branch (and on main), assemble one site: `main` at the root, and every remote branch **not yet merged into main** under `preview/<branch>/`. Each copy includes the game, `viewer.html`, `src/`, `assets/art/` and that branch's `docs/screens/` and `docs/tasks/`; it excludes `assets/source/` (LFS; Pages can't serve it) and `node_modules`. Deploy with `actions/upload-pages-artifact` + `actions/deploy-pages`. Keep the build small (skip unchanged copies if easy). Document the one-time switch the user makes in a browser: repo Settings -> Pages -> Source: **GitHub Actions** (`docs/handoffs/setup-mac.md`, new "Phone reviews" section).
12. **Review hub, `reviews.html`** (root of the site; the user's one bookmark): lists every open preview branch, newest first, read from a small `previews.json` the workflow writes (branch, task ID, packet title, last commit time). Each entry: **Open in viewer** (the branch's viewer), its screenshots and review sheets (`docs/screens/<TASK>/` images, tap to enlarge, swipe), and the packet's **Human** acceptance question shown as text. Phone-first layout; works offline of any terminal.
13. **Viewer is phone-first:** large touch buttons in a bottom sheet, the character always in view, pinch or a slider to zoom, no hover-only controls. Check on a 390 x 844 viewport in the screenshots.
14. The viewer's share URL (item 9) works on the preview copies, so the lead can send a link to an exact view on a branch.

Acceptance additions: the workflow runs green on this branch and the preview of `t027-*` itself opens; `docs/screens/T027/` includes phone-size shots of `reviews.html` and the viewer.
