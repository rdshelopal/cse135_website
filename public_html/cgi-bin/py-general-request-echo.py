#!/usr/bin/env python3
import os, sys, html, urllib.parse

method = os.environ.get("REQUEST_METHOD","")
ctype  = os.environ.get("CONTENT_TYPE","")
clen   = int(os.environ.get("CONTENT_LENGTH","0") or "0")
qs     = os.environ.get("QUERY_STRING","")
body   = sys.stdin.read(clen) if clen > 0 else ""

print("Content-Type: text/html; charset=utf-8\n")
print(f"<!doctype html><h1>General Request Echo (Python)</h1>"
      f"<p><b>Method:</b> {html.escape(method)} | <b>Content-Type:</b> {html.escape(ctype)} | <b>Content-Length:</b> {clen}</p>"
      f"<h2>Query String</h2><pre>{html.escape(qs)}</pre>"
      f"<h2>Payload</h2><pre>{html.escape(body)}</pre>")

if "application/x-www-form-urlencoded" in (ctype or ""):
    params = urllib.parse.parse_qs(body, keep_blank_values=True)
    print("<h3>Parsed Fields</h3><table border=1 cellpadding=6><tr><th>Key</th><th>Value(s)</th></tr>")
    for k in sorted(params):
        vals = ", ".join(params[k])
        print(f"<tr><td>{html.escape(k)}</td><td>{html.escape(vals)}</td></tr>")
    print("</table>")
