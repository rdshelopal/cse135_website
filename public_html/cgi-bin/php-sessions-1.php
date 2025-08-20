<?php
$visits = isset($_COOKIE['sess_visits']) ? (int)$_COOKIE['sess_visits'] : 0;
$visits++; setcookie('sess_visits',(string)$visits,0,'/', '', false, true);
header('Content-Type: text/html; charset=utf-8');
echo "<!doctype html><h1>Sessioning (PHP) – page 1</h1><p>visits: $visits</p><p><a href='php-sessions-2.php'>Go to page 2</a></p>";
