<?php
header('Content-Type: text/html; charset=utf-8');
function esc($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

echo "<!doctype html><h1>POST Echo (PHP)</h1>";

$raw = file_get_contents('php://input');
$ctype = $_SERVER['CONTENT_TYPE'] ?? '';

if (stripos($ctype, 'application/x-www-form-urlencoded') !== false && !empty($_POST)) {
  echo "<table border=1 cellpadding=6><tr><th>Key</th><th>Value(s)</th></tr>";
  foreach ($_POST as $k=>$v) {
    $val = is_array($v) ? implode(', ', $v) : $v;
    echo "<tr><td>".esc($k)."</td><td>".esc($val)."</td></tr>";
  }
  echo "</table>";
} else {
  echo "<p>(no urlencoded form fields parsed)</p>";
}

echo "<h2>Raw Body</h2><pre>".esc($raw)."</pre>";
