<?php
setcookie('sess_visits','', time()-3600, '/');
header('Content-Type: text/html; charset=utf-8');
echo "<!doctype html><h1>Session destroyed (PHP)</h1><p><a href='php-sessions-1.php'>Start again</a></p>";
