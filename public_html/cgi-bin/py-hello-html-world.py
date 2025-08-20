#!/usr/bin/env python3
import os, html
from datetime import datetime

ip  = os.environ.get("REMOTE_ADDR", "unknown")
now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

print("Content-Type: text/html; charset=utf-8\n")
print(f"<!doctype html><h1>Hello, World!</h1>"
      f"<p><b>Current date/time:</b> {now}</p>"
      f"<p><b>Your IP:</b> {html.escape(ip)}</p>")
