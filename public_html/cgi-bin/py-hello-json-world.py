#!/usr/bin/env python3
import json
print("Content-Type: application/json; charset=utf-8\n")
print(json.dumps({"message":"Hello, Python!","lang":"python"}))
