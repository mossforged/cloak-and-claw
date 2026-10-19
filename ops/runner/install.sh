#!/bin/bash
# One-time setup on the Mac (re-run after the runner script changes): copies the runner to ~/.cloak-runner and
# schedules it every 5 minutes for Code and for Art. Uninstall: bash install.sh --remove
set -e
STATE="$HOME/.cloak-runner"; AGENTS="$HOME/Library/LaunchAgents"
mkdir -p "$STATE" "$AGENTS"
for a in code art; do
  plist="$AGENTS/com.mossforged.cloak-runner.$a.plist"
  launchctl bootout "gui/$(id -u)" "$plist" 2>/dev/null || true
  rm -f "$plist"
done
if [ "${1:-}" = "--remove" ]; then echo "Runner removed."; exit 0; fi
cp "$(dirname "$0")/cloak-runner.sh" "$STATE/cloak-runner.sh"; chmod +x "$STATE/cloak-runner.sh"
for a in code art; do
  plist="$AGENTS/com.mossforged.cloak-runner.$a.plist"
  cat > "$plist" <<PL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>com.mossforged.cloak-runner.$a</string>
  <key>ProgramArguments</key><array><string>/bin/bash</string><string>$STATE/cloak-runner.sh</string><string>$a</string></array>
  <key>StartInterval</key><integer>300</integer>
  <key>RunAtLoad</key><true/>
  <key>StandardOutPath</key><string>$STATE/launchd-$a.log</string>
  <key>StandardErrorPath</key><string>$STATE/launchd-$a.log</string>
</dict></plist>
PL
  launchctl bootstrap "gui/$(id -u)" "$plist"
done
echo "Runner installed: checks for new jobs every 5 minutes. Log: $STATE/logs/runner.log"
