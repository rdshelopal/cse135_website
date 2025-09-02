<?php
$servername = "localhost";
$username = "cse135user";
$password = "*Pizzaballs56!";
$database = "cse135"; // 🔁 Replace this!

$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
}
echo "✅ Connected successfully to MySQL!";
?>
