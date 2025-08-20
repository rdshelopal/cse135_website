#!/usr/bin/env python3
import os
cookie = os.environ.get("HTTP_COOKIE","")
visits = 0
for part in cookie.split(";"):
    part = part.strip()
    if part.startswith("sess_visits="):
        try: visits = int(part.split("=",1)[1])
        except: visits = 0
print("Content-Type: text/html; charset=utf-8\n")
print(f"<!doctype html><h1>Sessioning (Python) – page 2</h1><p>visits: {visits}</p><p><a href='py-destroy-session.py'>Destroy Session</a></p>")
