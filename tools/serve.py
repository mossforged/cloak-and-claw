"""No-cache static dev server: python3 tools/serve.py [port]  (default 8000), from the repo root.
Same as `python3 -m http.server`, but every response says Cache-Control: no-store, so a plain reload
always picks up changed JS, data and art (no hard reload needed)."""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"Serving http://localhost:{port} (no-cache)")
    ThreadingHTTPServer(("", port), NoCache).serve_forever()
