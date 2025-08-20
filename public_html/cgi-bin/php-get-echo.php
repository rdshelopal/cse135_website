<?php
header('Content-Type: text/html; charset=utf-8');
function esc($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

echo "<!doctype html><h1>GET Echo (PHP)</h1>";

if (empty($_GET)) { echo "<p>(no query string)</p>"; exit; }

echo "<table border=1 cellpadding=6><tr><th>Key</th><th>Value(s)</th></tr>";
foreach ($_GET as $k => $v) {
  $val = is_array($v) ? implode(', ', $v) : $v;
  echo "<tr><td>".esc($k)."</td><td>".esc($val)."</td></tr>";
}
echo "</table>";
