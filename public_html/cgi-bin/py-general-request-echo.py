#!/usr/bin/env python3
import os, sys, html
m = os.environ.get("REQUEST_METHOD","")
ct = os.environ.get("CONTENT_TYPE","")
cl = int(os.environ.get("CONTENT_LENGTH","0") or "0")
qs = os.environ.get("QUERY_STRING","")
body = sys.stdin.read(cl) if cl>0 else ""
print("Content-Type: text/html; charset=utf-8\n")
print("<!doctype html><h1>General Request Echo (Python)</h1>")
print(f"<p><b>Method:</b> {html.escape(m)} | <b>Content-Type:</b> {html.escape(ct)} | <b>Content-Length:</b> {cl}</p>")
print("<h2>Query String</h2><pre>"+html.escape(qs)+"</pre>")
print("<h2>Raw Body</h2><pre>"+html.escape(body)+"</pre>")
