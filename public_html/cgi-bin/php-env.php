<?php
header('Content-Type: text/html; charset=utf-8');
function esc($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

$vars = $_SERVER;               // includes HTTP_* request headers + server vars
ksort($vars, SORT_STRING);

echo "<!doctype html><h1>Environment (PHP)</h1>";
echo "<table border=1 cellpadding=6><tr><th>Var</th><th>Value</th></tr>";
foreach ($vars as $k => $v) {
  if (is_array($v)) $v = implode(', ', $v);
  echo "<tr><td>",esc($k),"</td><td>",esc($v),"</td></tr>";
}
echo "</table>";
