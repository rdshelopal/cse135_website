#!/usr/bin/env python3
print("Set-Cookie: sess_visits=; Max-Age=0; Path=/; HttpOnly")
print("Content-Type: text/html; charset=utf-8\n")
print("<!doctype html><h1>Session destroyed (Python)</h1><p><a href='py-sessions-1.py'>Start again</a></p>")
