<?php
header('Content-Type: text/html; charset=utf-8');
function esc($s){return htmlspecialchars((string)$s,ENT_QUOTES,'UTF-8');}
$keys=['REQUEST_METHOD','QUERY_STRING','CONTENT_TYPE','CONTENT_LENGTH','REMOTE_ADDR','HTTP_USER_AGENT','HTTP_COOKIE','REQUEST_URI','SERVER_NAME','SERVER_PORT'];
echo "<!doctype html><h1>Environment (PHP)</h1><table border=1 cellpadding=6><tr><th>Var</th><th>Value</th></tr>";
foreach($keys as $k){ echo "<tr><td>$k</td><td>",esc($_SERVER[$k]??''),"</td></tr>"; }
echo "</table>";
