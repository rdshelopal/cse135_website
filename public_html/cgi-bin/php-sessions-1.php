<?php
// Page 1: form → save name in a cookie, then show link to page 2
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = isset($_POST['name']) ? trim($_POST['name']) : '';
  setcookie('state_name', $name, 0, '/', '', false, true); // HttpOnly
  header('Content-Type: text/html; charset=utf-8');
  $safe = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
  echo "<!doctype html><h1>State Demo (PHP) – Page 1</h1>";
  echo "<p>Saved name: <b>{$safe}</b></p>";
  echo "<p><a href='php-sessions-2.php'>Go to page 2</a></p>";
  exit;
}
header('Content-Type: text/html; charset=utf-8');
$prefill = htmlspecialchars($_COOKIE['state_name'] ?? '', ENT_QUOTES, 'UTF-8');
echo "<!doctype html><h1>State Demo (PHP) – Page 1</h1>
<form method='post' action='php-sessions-1.php'>
  <label>Name: <input name='name' value='{$prefill}'></label>
  <button>Save</button>
</form>";
