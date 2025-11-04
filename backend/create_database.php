<?php
// Script to create database
$host = '127.0.0.1';
$username = 'root';
$password = '';
$database = 'coursflow';

try {
    // Connect to MySQL server (without selecting database)
    $conn = new mysqli($host, $username, $password);

    if ($conn->connect_error) {
        die("❌ Connection failed: " . $conn->connect_error . "\n");
    }

    // Create database
    $sql = "CREATE DATABASE IF NOT EXISTS $database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";

    if ($conn->query($sql) === TRUE) {
        echo "✅ Database '$database' created successfully!\n";
    } else {
        echo "❌ Error creating database: " . $conn->error . "\n";
    }

    $conn->close();
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
