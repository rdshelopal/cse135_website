#!/usr/bin/env python3
import os, sys, urllib.parse, html

def cookie_get(name):
    raw = os.environ.get("HTTP_COOKIE","")
    for part in raw.split(";"):
        k, _, v = part.strip().partition("=")
        if k == name:
            return urllib.parse.unquote(v)
    return ""

method = os.environ.get("REQUEST_METHOD","GET")
if method == "POST":
    length = int(os.environ.get("CONTENT_LENGTH","0") or "0")
    body = sys.stdin.read(length) if length>0 else ""
    fields = urllib.parse.parse_qs(body, keep_blank_values=True)
    name = (fields.get("name", [""])[0]).strip()
    # send cookie header BEFORE the blank line
    print(f"Set-Cookie: state_name={urllib.parse.quote(name)}; Path=/; HttpOnly")
    print("Content-Type: text/html; charset=utf-8\n")
    print(f"<!doctype html><h1>State Demo (Python) – Page 1</h1>"
          f"<p>Saved name: <b>{html.escape(name)}</b></p>"
          f"<p><a href='py-sessions-2.py'>Go to page 2</a></p>")
else:
    current = cookie_get("state_name")
    print("Content-Type: text/html; charset=utf-8\n")
    print(f"<!doctype html><h1>State Demo (Python) – Page 1</h1>"
          f"<form method='post' action='py-sessions-1.py'>"
          f"<label>Name: <input name='name' value='{html.escape(current)}'></label> "
          f"<button>Save</button></form>")
