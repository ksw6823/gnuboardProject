<?php
session_start();
require_once '../cuur/config/database.php';

// 로그인 체크
if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.php');
    exit;
}

$user_id = $_SESSION['user_id'];

// 포트폴리오 목록 조회
$stmt = $pdo->prepare('SELECT p.*, u.username FROM portfolios p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.user_id = ? 
    ORDER BY p.created_at DESC');
$stmt->execute([$user_id]);
$portfolios = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>내 포트폴리오 목록</title>
    <link rel="stylesheet" href="../cuur/css/style.css">
</head>
<body>
    <div class="container">
        <h1>내 포트폴리오 목록</h1>
        
        <div class="portfolio-list">
            <?php foreach ($portfolios as $portfolio): ?>
                <div class="portfolio-item">
                    <h3><?php echo htmlspecialchars($portfolio['title']); ?></h3>
                    <p><?php echo htmlspecialchars($portfolio['summary']); ?></p>
                    <div class="portfolio-actions">
                        <a href="edit_portfolio.php?id=<?php echo $portfolio['id']; ?>" class="btn btn-primary">수정</a>
                        <a href="delete_portfolio.php?id=<?php echo $portfolio['id']; ?>" class="btn btn-danger" onclick="return confirm('정말 삭제하시겠습니까?');">삭제</a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        
        <div class="actions">
            <a href="create_portfolio.php" class="btn btn-success">새 포트폴리오 만들기</a>
            <a href="../index.php" class="btn btn-secondary">메인으로</a>
        </div>
    </div>
</body>
</html> 