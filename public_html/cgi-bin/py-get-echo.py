#!/usr/bin/env python3
import os, html, urllib.parse
params = urllib.parse.parse_qs(os.environ.get("QUERY_STRING",""), keep_blank_values=True)
print("Content-Type: text/html; charset=utf-8\n")
print("<!doctype html><h1>GET Echo (Python)</h1><table border=1 cellpadding=6><tr><th>Key</th><th>Value</th></tr>")
for k, vals in sorted(params.items()):
    print(f"<tr><td>{html.escape(k)}</td><td>{html.escape(', '.join(vals))}</td></tr>")
print("</table>")
