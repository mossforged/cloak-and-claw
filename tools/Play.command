#!/bin/bash
# Double-click in Finder to play: starts the no-cache dev server (tools/serve.py) on port 8100 and opens the game
# and the model viewer (T027).
# Port 8100 because Chrome holds stale copies for port 8000 from the old plain http.server (T011 freeze).
# Keep the Terminal window open while playing; close it (or press Ctrl+C in it) to stop the server.
cd "$(dirname "$0")/.." || exit 1
PORT=8100
URL="http://localhost:$PORT/"
if lsof -ti :$PORT >/dev/null 2>&1; then
  echo "Server already running on port $PORT; opening the game and the model viewer."
  open "$URL"
  open "${URL}viewer.html"
  exit 0
fi
python3 tools/serve.py $PORT &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 1
open "$URL"
open "${URL}viewer.html"
echo
echo "Game:        $URL"
echo "Viewer:      ${URL}viewer.html"
echo "Tuning lab:  ${URL}lab.html"
echo "Close this window (or press Ctrl+C) to stop the server."
wait $SERVER
