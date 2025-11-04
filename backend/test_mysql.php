<?php
// Test MySQL connection
$passwords = ['', 'root', 'password', 'admin'];

foreach ($passwords as $pwd) {
    try {
        $conn = new mysqli('127.0.0.1', 'root', $pwd);
        if ($conn->connect_error) {
            echo "❌ Password '$pwd': " . $conn->connect_error . "\n";
        } else {
            echo "✅ SUCCESS! Password is: '" . ($pwd ?: '(empty)') . "'\n";
            echo "   MySQL Version: " . $conn->server_info . "\n";
            $conn->close();
            break;
        }
    } catch (Exception $e) {
        echo "❌ Password '$pwd': " . $e->getMessage() . "\n";
    }
}
