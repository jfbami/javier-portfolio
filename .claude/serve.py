"""Local dev server that disables caching so the preview always reflects the
latest files. Dev-only. GitHub Pages serves the static files directly."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("Pragma", "no-cache")
        super().end_headers()


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 4321), NoCacheHandler).serve_forever()
