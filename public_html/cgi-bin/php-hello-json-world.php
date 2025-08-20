<?php
header('Content-Type: application/json; charset=utf-8');
$ip  = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$now = date('c'); // ISO 8601
echo json_encode([
  'message'   => 'Hello, World!',
  'timestamp' => $now,
  'ip'        => $ip,
  'lang'      => 'php'
]);
