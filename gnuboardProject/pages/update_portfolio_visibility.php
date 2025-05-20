<?php
require_once '../cuur/config/database.php';

// 로그인 체크
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => '로그인이 필요합니다.']);
    exit;
}

// JSON 데이터 받기
$data = json_decode(file_get_contents('php://input'), true);
$portfolio_id = isset($data['portfolio_id']) ? intval($data['portfolio_id']) : 0;
$is_private = isset($data['is_private']) ? (bool)$data['is_private'] : false;

if (!$portfolio_id) {
    echo json_encode(['success' => false, 'message' => '잘못된 요청입니다.']);
    exit;
}

try {
    // 포트폴리오 소유자 확인
    $stmt = $pdo->prepare('SELECT user_id FROM portfolios WHERE id = ?');
    $stmt->execute([$portfolio_id]);
    $portfolio = $stmt->fetch();

    if (!$portfolio || $portfolio['user_id'] != $_SESSION['user_id']) {
        echo json_encode(['success' => false, 'message' => '권한이 없습니다.']);
        exit;
    }

    // 비공개 상태 업데이트
    $stmt = $pdo->prepare('UPDATE portfolios SET is_private = ? WHERE id = ? AND user_id = ?');
    $stmt->execute([$is_private ? 1 : 0, $portfolio_id, $_SESSION['user_id']]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => '데이터베이스 오류가 발생했습니다.']);
} 