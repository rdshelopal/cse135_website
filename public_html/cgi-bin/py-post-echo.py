#!/usr/bin/env python3
import os, sys, html, urllib.parse
length = int(os.environ.get("CONTENT_LENGTH","0") or "0")
body = sys.stdin.read(length) if length>0 else ""
params = {}
if "application/x-www-form-urlencoded" in (os.environ.get("CONTENT_TYPE","")):
    params = urllib.parse.parse_qs(body, keep_blank_values=True)
print("Content-Type: text/html; charset=utf-8\n")
print("<!doctype html><h1>POST Echo (Python)</h1><table border=1 cellpadding=6><tr><th>Key</th><th>Value</th></tr>")
for k, vals in sorted(params.items()):
    print(f"<tr><td>{html.escape(k)}</td><td>{html.escape(', '.join(vals))}</td></tr>")
print("</table><h2>Raw Body</h2><pre>"+html.escape(body)+"</pre>")
