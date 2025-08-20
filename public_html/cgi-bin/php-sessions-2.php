<?php
$visits = isset($_COOKIE['sess_visits']) ? (int)$_COOKIE['sess_visits'] : 0;
header('Content-Type: text/html; charset=utf-8');
echo "<!doctype html><h1>Sessioning (PHP) – page 2</h1><p>visits: $visits</p><p><a href='php-destroy-session.php'>Destroy Session</a></p>";
