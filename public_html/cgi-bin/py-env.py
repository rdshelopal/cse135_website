#!/usr/bin/env python3
import os, html

print("Content-Type: text/html; charset=utf-8\n")
print("<!doctype html><h1>Environment (Python)</h1>")
print("<table border=1 cellpadding=6><tr><th>Var</th><th>Value</th></tr>")
for k in sorted(os.environ):
    v = os.environ[k]
    print(f"<tr><td>{html.escape(k)}</td><td>{html.escape(v)}</td></tr>")
print("</table>")
