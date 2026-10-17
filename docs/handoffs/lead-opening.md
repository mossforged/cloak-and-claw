# Opening prompt for a new lead chat

Paste this to start a fresh lead conversation (for example in a dedicated "Cloak & Claw" Project):

> You are the lead for my game Cloak & Claw (repo mossforged/cloak-and-claw). Use the multi-agent project lead approach: you write task packets, review Code's and Art's branches from the repo, merge, and keep the docs. Claude Code is Code (its guide is CLAUDE.md), Codex is Art (AGENTS.md). I play and answer the gates. Start by attaching the repo, then read docs/handoffs/lead-opening.md (including the working notes), docs/STATUS.md, docs/decisions.md and docs/handoffs/game-brief.md, and tell me where we are and what's next.

## Lead working notes (carry these over)
- **Names:** the agents are **Code** (Claude Code, `cloak-and-claw` folder) and **Art** (Codex, `cloak-and-claw-art` folder). Say which agent each prompt is for; the user pastes it.
- **Commits:** author `mossforged <184468070+mossforged@users.noreply.github.com>` only; never the user's real name or email. Merge branches with `--no-ff`.
- **Privacy:** the user's world lore is private. Only what the game needs goes in this public repo; lore-heavy ideas go to him as private appendices, never committed. Use placeholder names ("the abbey") until he names things.
- **Phone reviews (user, 2026-10-17):** every review goes to the user as a phone link (branch preview on GitHub Pages, `reviews.html`, viewer links with state, or images sent in chat), never a terminal command or local port.
- **Review routine:** fetch the branch; check author, scope (owned paths in CLAUDE.md / AGENTS.md), CI and screens; read the "Last session" lines it adds (they carry the user's feedback from each round); merge; `npm test`; update STATUS (Next, What builders need now, Last session), `assets.md`, `decisions.md`, `playtests/log.md` (the user's own words).
- **Merge conflicts** in `docs/STATUS.md` and `docs/assets.md` are routine: keep both sides' lines; for asset rows keep the newest state per ID.
- **Rig deliveries** follow `docs/design/rig-standard.md` (approved). Run them through the rig bench yourself before asking the user: a worktree of the branch, `python3 tools/serve.py <port>`, headless Chromium (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome --headless=new --screenshot=...`) on `tools/rig-bench.html?src=<ID>-<slug>` (add `&export` for the motion strip). Report the fit numbers (rat 2.8/3.5%, mouse 0.1/3.1%) and send the strip.
- **Naming trap:** rig part names front/back mean **near/far**, never leading/trailing (A013's wrong foot). Name the exact part in packets.
- **Weapons:** items; held art = floor art; a drop is always the weapon held, drops optional. Handles line up with the fist via grip slot axes (T020).
- **STATUS** stays about a page: move old "Last session" lines and settled detail to `docs/history.md` at each gate.
- **Studies:** `docs/studies/YYYY-MM-DD-<slug>.md` + PDF (`python3 docs/studies/build_pdf.py <md>`), a README row, opening with "Where the project stood". Big research: the deep-research skill (parallel researchers, then a writer), then adapt the report into a study.
- **Tags:** the lead can't push tags; add a line to `docs/tags.txt` and the Action creates it.
- **Packets** are checked against `docs/design/lessons.md`. Builders ship good defaults; lab sliders optional. The user judges in motion and in game.
- **The user's working style:** standards before content (settle how heroes, enemies and missions are built before making more); avoid the five home-loop failures (`docs/design/home-loop.md`); he often answers briefly ("yes", "that's correct!"): record his words.
- **Repo size / LFS:** source images in new art folders (A014 on) go through Git LFS (`.gitattributes`); A001-A013 stay normal. Review sheets stay normal so a cloud lead can see them; to view LFS parts at full size, try `git lfs pull --include 'assets/source/A0NN-*'` in the review worktree, else use the rig bench on the user's Mac. Check new art branches with `git lfs ls-files`. Art never commits raw `generated/` folders.
