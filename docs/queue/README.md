# Job queue (the lead writes these; the runner on the user's Mac runs them)

One file per job: `docs/queue/<NNN>-<slug>.md`. Header lines, a `---` line, then the prompt the agent gets.

```
agent: code            # code (Claude Code, cloak-and-claw folder) or art (Codex, cloak-and-claw-art folder)
branch: t031-some-task # the task branch; an existing branch is continued (follow-up rounds), main merged in first
timeout_min: 90        # optional
---
Do T031: read docs/STATUS.md and docs/tasks/T031-some-task.md. ...
```

Rules for the lead: queue a job only when its packet is committed and nothing it needs is still waiting on the user; one job per agent at a time is all the runner runs, oldest first; never `branch: main`. A job runs once (markers on the Mac); a follow-up round is a new job file on the same branch. Results come back as the pushed branch plus `docs/runs/<id>.md` (exit code and the agent's last message).
