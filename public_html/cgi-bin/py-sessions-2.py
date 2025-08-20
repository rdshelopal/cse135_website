#!/usr/bin/env python3
import os, urllib.parse, html

def cookie_get(name):
    raw = os.environ.get("HTTP_COOKIE","")
    for part in raw.split(";"):
        k, _, v = part.strip().partition("=")
        if k == name:
            return urllib.parse.unquote(v)
    return ""

name = cookie_get("state_name") or "stranger"
print("Content-Type: text/html; charset=utf-8\n")
print(f"<!doctype html><h1>State Demo (Python) – Page 2</h1>"
      f"<p>Hello, <b>{html.escape(name)}</b>!</p>"
      f"<p><a href='py-destroy-session.py'>Destroy Session</a></p>")
