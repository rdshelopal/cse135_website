<?php
header('Content-Type: text/html; charset=utf-8');
function esc($s){return htmlspecialchars((string)$s,ENT_QUOTES,'UTF-8');}
echo "<!doctype html><h1>General Request Echo (PHP)</h1>";
echo "<p><b>Method:</b> ",esc($_SERVER['REQUEST_METHOD']??''),"</p>";
echo "<p><b>Content-Type:</b> ",esc($_SERVER['CONTENT_TYPE']??'')," | <b>Content-Length:</b> ",esc($_SERVER['CONTENT_LENGTH']??''),"</p>";
echo "<h2>Query String</h2><pre>",esc($_SERVER['QUERY_STRING']??''),"</pre>";
echo "<h2>Raw Body</h2><pre>",esc(file_get_contents('php://input')),"</pre>";
