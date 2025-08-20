<?php
header('Content-Type: text/html; charset=utf-8');
function esc($s){return htmlspecialchars((string)$s,ENT_QUOTES,'UTF-8');}
echo "<!doctype html><h1>GET Echo (PHP)</h1><table border=1 cellpadding=6><tr><th>Key</th><th>Value</th></tr>";
foreach($_GET as $k=>$v){ if(is_array($v))$v=implode(', ',$v); echo "<tr><td>",esc($k),"</td><td>",esc($v),"</td></tr>"; }
echo "</table>";
