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
