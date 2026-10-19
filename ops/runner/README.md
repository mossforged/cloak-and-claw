# The runner (automatic handoffs)

The lead commits a job file to `docs/queue/`; a small script on the user's Mac Mini sees it within 5 minutes and starts the right agent in its own folder, unattended: Code (Claude Code) in `~/Projects/cloak-and-claw`, Art (Codex) in `~/Projects/cloak-and-claw-art`. The agent works on the job's branch; the runner commits anything left over, adds a run report (`docs/runs/<id>.md`), and pushes the branch. The phone preview updates; the user looks on his phone and tells the lead; the lead merges and queues the next job. Nobody pastes prompts.

Safety: one job per agent at a time; every job on its own branch (never main); a time box (default 90 min); Code may not push, switch branches, reset or `rm -rf` (the runner pushes); Codex runs in its `--full-auto` sandbox; a clone with uncommitted changes is left alone; each job runs once, even if it fails.

## One-time setup on the Mac Mini
1. Open Terminal. Make sure both folders are on `main` and clean:
   `cd ~/Projects/cloak-and-claw && git checkout main && git pull && git status`
   `cd ~/Projects/cloak-and-claw-art && git checkout main && git pull && git status`
   (each `git status` should say "nothing to commit").
2. Update both agents: `claude update`, then check `claude --version` is 2.1.259 or later. For Codex, update it the way you installed it (for example `brew upgrade codex` or `npm install -g @openai/codex`).
3. Install the runner: `bash ~/Projects/cloak-and-claw/ops/runner/install.sh`
4. Keep the Mac awake: System Settings > Energy, turn on "Prevent automatic sleeping when the display is off". The display can sleep; the Mac must not.
5. Watch the first two test jobs (they start within a minute): `tail -f ~/.cloak-runner/logs/runner.log` (Ctrl-C to stop watching). Each should end with "pushed ... (exit 0)".

Stop it: `bash ~/Projects/cloak-and-claw/ops/runner/install.sh --remove`. After the lead changes the runner script, re-run step 3.
Run a job again: delete its marker, e.g. `rm ~/.cloak-runner/done/001-runner-check-code`.
Settings (folders, time box, agent paths) can be overridden in `~/.cloak-runner/config`, e.g. `CODE_DIR="$HOME/Projects/cloak-and-claw"`.
