#!/usr/bin/env python3
import os, sys, urllib.parse, html

length = int(os.environ.get("CONTENT_LENGTH", "0") or "0")
ctype  = os.environ.get("CONTENT_TYPE", "")
body   = sys.stdin.read(length) if length > 0 else ""

print("Content-Type: text/html; charset=utf-8\n")
print("<!doctype html><h1>POST Echo (Python)</h1>")

if "application/x-www-form-urlencoded" in ctype:
    params = urllib.parse.parse_qs(body, keep_blank_values=True)
    if params:
        print("<table border=1 cellpadding=6><tr><th>Key</th><th>Value(s)</th></tr>")
        for k in sorted(params):
            vals = ", ".join(params[k])
            print(f"<tr><td>{html.escape(k)}</td><td>{html.escape(vals)}</td></tr>")
        print("</table>")
    else:
        print("<p>(no urlencoded fields)</p>")
else:
    print("<p>(content-type not urlencoded; showing raw body only)</p>")

print("<h2>Raw Body</h2><pre>"+html.escape(body)+"</pre>")
