#!/bin/bash
# Cloak & Claw runner: starts Code (Claude Code) or Art (Codex) on job files the lead commits to docs/queue/.
# Runs every few minutes from launchd on the user's Mac. One job per agent at a time. Never pushes to main.
# Job file: docs/queue/<id>.md, header lines "key: value" (agent, branch, timeout_min), a line "---", then the prompt.
# Per job it: pulls main, makes the job's branch, runs the agent unattended, commits anything left uncommitted,
# writes docs/runs/<id>.md (exit code + the agent's last message), and pushes the branch. Logs: ~/.cloak-runner/logs/.
# bash 3.2 compatible (macOS). Settings at the top; override them in ~/.cloak-runner/config.

set -u
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
CODE_DIR="$HOME/Projects/cloak-and-claw"
ART_DIR="$HOME/Projects/cloak-and-claw-art"
STATE="$HOME/.cloak-runner"
CLAUDE_BIN="claude"
CODEX_BIN="codex"
DEFAULT_TIMEOUT_MIN=90
[ -f "$STATE/config" ] && . "$STATE/config"
mkdir -p "$STATE/done" "$STATE/logs" "$STATE/locks" "$STATE/jobs"

log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $*" >> "$STATE/logs/runner.log"; }
field() { sed -n "1,/^---\$/p" "$1" | sed -n "s/^$2:[[:space:]]*//p" | head -1; }
prompt_of() { sed '1,/^---$/d' "$1"; }

# Kill the agent after the time box (macOS has no `timeout`).
run_boxed() { # minutes, stdout file, stderr file, command...
  local mins="$1" outf="$2" errf="$3"; shift 3
  "$@" >> "$outf" 2>> "$errf" &
  local pid=$!
  ( sleep $((mins * 60)); kill -INT "$pid" 2>/dev/null; sleep 30; kill -TERM "$pid" 2>/dev/null ) &
  local watch=$!
  wait "$pid"; local rc=$?
  kill "$watch" 2>/dev/null; wait "$watch" 2>/dev/null
  return $rc
}

run_job() { # agent dir jobfile
  local agent="$1" dir="$2" job="$3"
  local id; id="$(basename "$job" .md)"
  local branch; branch="$(field "$job" branch)"
  local mins; mins="$(field "$job" timeout_min)"; [ -z "$mins" ] && mins=$DEFAULT_TIMEOUT_MIN
  local logf="$STATE/logs/$id.log"
  if [ -z "$branch" ] || [ "$branch" = "main" ]; then log "$id: no branch (or main) in job file, skipped"; touch "$STATE/done/$id"; return; fi
  touch "$STATE/done/$id"   # never run a job twice, even if it fails
  log "$id: start ($agent, branch $branch, ${mins} min)"
  cd "$dir" || return
  git fetch -q origin
  if git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
    git checkout -q -B "$branch" "origin/$branch"   # a follow-up round continues the existing branch
    git merge -q --no-edit origin/main >> "$logf" 2>&1 || { git merge --abort; log "$id: merge of main into $branch conflicts, agent will see it"; }
  else
    git checkout -q -B "$branch" origin/main
  fi
  local prompt; prompt="$(prompt_of "$job")
(Started unattended by the runner. The branch $branch is already checked out and main is merged in: do not switch branches and do not push; commit your work and the runner pushes it. If you hit a question only the user can answer, write it in your report and stop.)"
  local last="$STATE/logs/$id.last.md" rc
  if [ "$agent" = "code" ]; then
    : > "$last.json"
    run_boxed "$mins" "$last.json" "$logf" "$CLAUDE_BIN" -p "$prompt" \
      --permission-mode acceptEdits --permission-prompts none \
      --allowedTools "Read,Edit,Write,Glob,Grep,Bash(git status *),Bash(git diff *),Bash(git log *),Bash(git add *),Bash(git commit *),Bash(git show *),Bash(git lfs *),Bash(git fetch *),Bash(git merge *),Bash(npm test*),Bash(npm run *),Bash(node *),Bash(npx *),Bash(python3 *),Bash(ls *),Bash(cat *),Bash(mkdir *),Bash(cp *),Bash(mv *)" \
      --disallowedTools "Bash(git push *),Bash(git checkout *),Bash(git reset *),Bash(rm -rf *)" \
      --output-format json
    rc=$?
    python3 -c "import json,sys; print(json.load(open(sys.argv[1])).get('result',''))" "$last.json" > "$last" 2>/dev/null || cp "$last.json" "$last"
  else
    run_boxed "$mins" "$logf" "$logf" "$CODEX_BIN" exec --full-auto -C "$dir" -o "$last" "$prompt"
    rc=$?
  fi
  # Commit anything the agent left (Codex's sandbox may not write .git), then the run report.
  git add -A >> "$logf" 2>&1
  git diff --cached --quiet || git commit -q -m "$id: runner commit of uncommitted work" >> "$logf" 2>&1
  mkdir -p docs/runs
  { echo "# Run $id ($agent)"; echo; echo "- Branch: \`$branch\`"; echo "- Finished: $(date '+%Y-%m-%d %H:%M')"; echo "- Exit code: $rc"; echo; echo "## Agent's last message"; echo; cat "$last" 2>/dev/null; } > "docs/runs/$id.md"
  git add "docs/runs/$id.md" && git commit -q -m "$id: run report (exit $rc)" >> "$logf" 2>&1
  if git push -q -u origin "$branch" >> "$logf" 2>&1; then log "$id: pushed $branch (exit $rc)"; else log "$id: PUSH FAILED (see $logf)"; fi
  git checkout -q main 2>/dev/null
}

check_agent() { # agent dir
  local agent="$1" dir="$2"
  [ -d "$dir/.git" ] || { log "$agent: no clone at $dir"; return; }
  local lock="$STATE/locks/$agent"
  if ! mkdir "$lock" 2>/dev/null; then
    # stale lock (runner crashed) after 4 hours
    if [ -n "$(find "$lock" -maxdepth 0 -mmin +240 2>/dev/null)" ]; then rmdir "$lock"; mkdir "$lock"; else return; fi
  fi
  cd "$dir" || { rmdir "$lock"; return; }
  if [ -n "$(git status --porcelain)" ]; then log "$agent: clone has uncommitted changes, not touching it"; rmdir "$lock"; return; fi
  git checkout -q main 2>/dev/null && git pull -q --ff-only origin main 2>>"$STATE/logs/runner.log"
  local job
  for job in docs/queue/*.md; do
    [ -f "$job" ] || continue
    [ "$(basename "$job")" = "README.md" ] && continue
    [ -e "$STATE/done/$(basename "$job" .md)" ] && continue
    [ "$(field "$job" agent)" = "$agent" ] || continue
    cp "$job" "$STATE/jobs/$(basename "$job")"   # the job file may not exist on an older task branch
    run_job "$agent" "$dir" "$STATE/jobs/$(basename "$job")"
    break
  done
  rmdir "$lock"
}

# One agent per call (launchd runs one schedule per agent, so Code and Art can work at the same time).
case "${1:-both}" in
  code) check_agent code "$CODE_DIR" ;;
  art)  check_agent art "$ART_DIR" ;;
  *)    check_agent code "$CODE_DIR"; check_agent art "$ART_DIR" ;;
esac
