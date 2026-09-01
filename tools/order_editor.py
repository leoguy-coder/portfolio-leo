#!/usr/bin/env python3
"""Serve the portfolio editor locally and save its project order safely."""

from __future__ import annotations

import argparse
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
ORDER_FILE = ROOT / "data" / "order.js"


class OrderEditorHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self):  # noqa: N802 - HTTP handler API
        if self.path != "/__save-order":
            self.send_error(404)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length))
            content = payload.get("content", "")
            if not isinstance(content, str):
                raise ValueError("invalid content")
            marker = "window.PROJECT_ORDER = "
            if not content.startswith("/* Ordre commun") or marker not in content:
                raise ValueError("invalid order file")
            array_text = content.split(marker, 1)[1].strip().removesuffix(";")
            order = json.loads(array_text)
            if len(order) != 41 or len(set(order)) != 41:
                raise ValueError("the project list changed")
            if not all(isinstance(key, str) for key in order):
                raise ValueError("invalid project key")
            ORDER_FILE.write_text(content, encoding="utf-8")
        except (ValueError, json.JSONDecodeError) as error:
            self.send_json(400, {"ok": False, "error": str(error)})
            return

        self.send_json(200, {"ok": True})

    def send_json(self, status: int, payload: dict):
        data = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def main():
    parser = argparse.ArgumentParser(description="Open the local project order editor")
    parser.add_argument("--port", type=int, default=4173)
    args = parser.parse_args()
    server = ThreadingHTTPServer(("127.0.0.1", args.port), OrderEditorHandler)
    print(f"Order editor: http://127.0.0.1:{args.port}/_ordre.html", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
