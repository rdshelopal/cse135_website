<?php
header('Content-Type: text/html; charset=utf-8');
$ip  = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$now = date('Y-m-d H:i:s');
echo "<!doctype html><h1>Hello, World!</h1>
<p><b>Current date/time:</b> $now</p>
<p><b>Your IP:</b> ".htmlspecialchars($ip, ENT_QUOTES, 'UTF-8')."</p>";
