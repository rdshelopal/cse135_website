<?php
header('Content-Type: text/html; charset=utf-8');
function esc($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

$method = $_SERVER['REQUEST_METHOD'] ?? '';
$ctype  = $_SERVER['CONTENT_TYPE']  ?? '';
$clen   = $_SERVER['CONTENT_LENGTH']?? '0';
$qs     = $_SERVER['QUERY_STRING']  ?? '';
$raw    = file_get_contents('php://input');

echo "<!doctype html><h1>General Request Echo (PHP)</h1>";
echo "<p><b>Method:</b> ".esc($method)." | <b>Content-Type:</b> ".esc($ctype)." | <b>Content-Length:</b> ".esc($clen)."</p>";
echo "<h2>Query String</h2><pre>".esc($qs)."</pre>";
echo "<h2>Payload</h2><pre>".esc($raw)."</pre>";

if (stripos($ctype,'application/x-www-form-urlencoded') !== false) {
  parse_str($raw, $fields);
  echo "<h3>Parsed Fields</h3><table border=1 cellpadding=6><tr><th>Key</th><th>Value(s)</th></tr>";
  foreach ($fields as $k=>$v){ $v=is_array($v)?implode(', ',$v):$v;
    echo "<tr><td>".esc($k)."</td><td>".esc($v)."</td></tr>";
  }
  echo "</table>";
}
