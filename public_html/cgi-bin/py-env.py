#!/usr/bin/env python3
import os, html
print("Content-Type: text/html; charset=utf-8\n")
keys=["REQUEST_METHOD","QUERY_STRING","CONTENT_TYPE","CONTENT_LENGTH","REMOTE_ADDR","HTTP_USER_AGENT","HTTP_COOKIE","REQUEST_URI","SERVER_NAME","SERVER_PORT"]
print("<!doctype html><h1>Environment (Python)</h1><table border=1 cellpadding=6><tr><th>Var</th><th>Value</th></tr>")
for k in keys:
    print(f"<tr><td>{k}</td><td>{html.escape(os.environ.get(k,''))}</td></tr>")
print("</table>")
