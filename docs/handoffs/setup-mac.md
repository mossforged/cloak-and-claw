# Setting up the Mac (once)

Two separate copies of the repo, one per builder, so they never trip over each other's work.

```
mkdir -p ~/Projects && cd ~/Projects
git clone https://github.com/mossforged/cloak-and-claw
git clone https://github.com/mossforged/cloak-and-claw cloak-and-claw-art
for d in cloak-and-claw cloak-and-claw-art; do
  git -C $d config user.name mossforged
  git -C $d config user.email 184468070+mossforged@users.noreply.github.com
done
```

Large-file storage (once; source art from A014 on is stored with Git LFS):
```
brew install git-lfs        # or download from https://git-lfs.com if Homebrew isn't installed
git lfs install
for d in cloak-and-claw cloak-and-claw-art; do git -C ~/Projects/$d lfs install; done
```
Check: `git lfs version` prints a version.

Shortcuts (run once, then open a new Terminal window):
```
cat >> ~/.zshrc <<'X'
alias cccode='cd ~/Projects/cloak-and-claw && claude'
alias ccart='cd ~/Projects/cloak-and-claw-art && codex'
alias ccplay='cd ~/Projects/cloak-and-claw && git pull && python3 -m http.server 8000'
X
```
Type these at the Terminal prompt (not inside an agent):
- `cccode` starts Claude Code in the code copy.
- `ccart` starts Codex in the art copy.
- `ccplay` updates the code copy and serves the game at http://localhost:8000 (lab: /lab.html once T001 is merged).

Starting a task: give the builder one line, for example
`Pull first. Do T001: read docs/STATUS.md and docs/tasks/T001-tuning-lab.md.`
When it reports a branch name, tell the lead.

## Phone reviews (once, in a browser; T027)
Every push builds a website with the game at the root and each branch that isn't merged yet under `preview/<branch>/`
(`.github/workflows/pages.yml`). The review hub lists them all, newest first, with their screenshots and the question
for you: **https://mossforged.github.io/cloak-and-claw/reviews.html** (bookmark it on the phone).

One-time switch, on github.com (phone or computer):
1. Open the repo -> **Settings** -> **Pages**.
2. Under "Build and deployment", **Source**: pick **GitHub Actions** (instead of "Deploy from a branch").

That's all. The game stays at the same address. The previews start after T027 is merged into main (the workflow
deploys from main); from then on each push to any branch refreshes the site within a few minutes (Actions tab shows
the `pages` runs). A merged or deleted branch drops off the hub on the next run.

The model viewer: `viewer.html` (on the site, in each preview, or locally via `tools/Play.command`). Links the lead
sends open an exact view, e.g. `.../preview/t026-import-new-rat/viewer.html?f=rat-raider&anim=walk&ov=floor`.
