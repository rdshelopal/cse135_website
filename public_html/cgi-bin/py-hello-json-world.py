#!/usr/bin/env python3
import os, json
from datetime import datetime

ip  = os.environ.get("REMOTE_ADDR", "unknown")
now = datetime.now().isoformat()

print("Content-Type: application/json; charset=utf-8\n")
print(json.dumps({
    "message": "Hello, World!",
    "timestamp": now,
    "ip": ip,
    "lang": "python"
}))
