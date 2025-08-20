#!/usr/bin/env python3
import os, urllib.parse, html

print("Content-Type: text/html; charset=utf-8\n")
print("<!doctype html><h1>GET Echo (Python)</h1>")

qs = os.environ.get("QUERY_STRING", "")
params = urllib.parse.parse_qs(qs, keep_blank_values=True)

if not params:
    print("<p>(no query string)</p>")
else:
    print("<table border=1 cellpadding=6><tr><th>Key</th><th>Value(s)</th></tr>")
    for k in sorted(params):
        vals = ", ".join(params[k])
        print(f"<tr><td>{html.escape(k)}</td><td>{html.escape(vals)}</td></tr>")
    print("</table>")
