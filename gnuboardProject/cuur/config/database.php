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

// 세션 시작
session_start();

// 파일 업로드 설정
$upload_dir = "uploads/";
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}
?> 