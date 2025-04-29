<?php
$host = 'localhost';
$dbname = 'sns_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "데이터베이스 연결 실패: " . $e->getMessage();
    die();
}
?> 