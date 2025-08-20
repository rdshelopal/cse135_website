<?php
setcookie('state_name','', time()-3600, '/'); // delete
header('Content-Type: text/html; charset=utf-8');
echo "<!doctype html><h1>Session destroyed (PHP)</h1>
<p><a href='php-sessions-1.php'>Back to page 1</a></p>";
