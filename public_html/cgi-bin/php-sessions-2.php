<?php
header('Content-Type: text/html; charset=utf-8');
$name = htmlspecialchars($_COOKIE['state_name'] ?? 'stranger', ENT_QUOTES, 'UTF-8');
echo "<!doctype html><h1>State Demo (PHP) – Page 2</h1>
<p>Hello, <b>{$name}</b>!</p>
<p><a href='php-destroy-session.php'>Destroy Session</a></p>";
