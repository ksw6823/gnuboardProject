<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once '../cuur/config/database.php';
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error'=>'로그인 필요']);
    exit;
}
$user_id = $_SESSION['user_id'];
$stmt = $pdo->prepare('SELECT name, email, phone FROM users WHERE id = ?');
$stmt->execute([$user_id]);
$user = $stmt->fetch();
if ($user) {
    echo json_encode($user);
} else {
    echo json_encode(['error'=>'정보 없음']);
} 