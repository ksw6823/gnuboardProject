<?php
session_start();
require_once '../cuur/config/database.php';

// 로그인 체크
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

// DB에서 사용자 정보 불러오기
$user_id = $_SESSION['user_id'];
$stmt = $pdo->prepare('SELECT username, email, name FROM users WHERE id = ?');
$stmt->execute([$user_id]);
$user = $stmt->fetch();

if (!$user) {
    // 사용자가 DB에 없으면 로그아웃 처리
    session_destroy();
    header('Location: login.php');
    exit;
}

// 사용자의 포트폴리오 목록 불러오기 (is_private 컬럼 추가)
$portfolio_stmt = $pdo->prepare('SELECT id, title, summary, is_private FROM portfolios WHERE user_id = ? ORDER BY created_at DESC');
$portfolio_stmt->execute([$user_id]);
$portfolios = $portfolio_stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>마이페이지</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .mypage-main { max-width: 700px; margin: 0 auto; padding-top: 120px; padding-bottom: 80px; }
        .mypage-title { font-size: 2rem; font-weight: 700; margin-bottom: 1.5rem; text-align: center; }
        .mypage-userinfo { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 2rem 2.5rem; margin-bottom: 2.5rem; }
        .mypage-userinfo dt { font-weight: 600; color: #555; margin-top: 0.7rem; }
        .mypage-userinfo dd { margin: 0 0 0.5rem 0; color: #222; }
        .mypage-portfolio-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; }
        .mypage-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .mypage-card { background: #f3f6fa; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 1.2rem 1.3rem; }
        .mypage-card-title { font-weight: 700; margin-bottom: 0.5rem; }
        .mypage-card-desc { color: #555; font-size: 0.97rem; }
        .mypage-home-btn { display: block; margin: 2.5rem auto 0 auto; padding: 0.7rem 2.2rem; border-radius: 8px; background: #007bff; color: #fff; font-weight: 600; border: none; font-size: 1.05rem; transition: background 0.2s; text-align: center; text-decoration: none; }
        .mypage-home-btn:hover { background: #0056b3; }
        .mypage-edit-btn { display: block; margin: 1rem auto 0 auto; padding: 0.7rem 2.2rem; border-radius: 8px; background: #6c757d; color: #fff; font-weight: 600; border: none; font-size: 1.05rem; transition: background 0.2s; text-align: center; text-decoration: none; }
        .mypage-edit-btn:hover { background: #5a6268; }
        @media (max-width: 600px) { .mypage-main { padding: 90px 10px 60px 10px; } .mypage-card-grid { grid-template-columns: 1fr; } }
        
        /* 비공개 토글 스타일 */
        .private-toggle {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
            margin-left: 10px;
        }
        
        .private-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .private-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }
        
        .private-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .private-slider {
            background-color: #007bff;
        }
        
        input:checked + .private-slider:before {
            transform: translateX(26px);
        }
        
        .private-label {
            font-size: 0.9rem;
            color: #666;
            margin-left: 5px;
        }
        
        .portfolio-actions {
            display: flex;
            align-items: center;
            margin-top: 10px;
        }
        
        .mypage-card {
            position: relative;
        }
    </style>
</head>
<body>
<?php include '../includes/header.php'; ?>
<main class="mypage-main">
    <div class="mypage-title">마이페이지</div>
    <dl class="mypage-userinfo">
        <dt>이름</dt><dd><?php echo htmlspecialchars($user['name']); ?></dd>
        <dt>아이디</dt><dd><?php echo htmlspecialchars($user['username']); ?></dd>
        <dt>이메일</dt><dd><?php echo htmlspecialchars($user['email']); ?></dd>
    </dl>
    <a href="myinfo_edit.php" class="mypage-edit-btn">내 정보 수정하기</a>
    <div class="mypage-portfolio-title">내 포트폴리오</div>
    <div class="mypage-card-grid">
        <?php if (empty($portfolios)): ?>
            <div class="mypage-card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <div class="mypage-card-desc">아직 작성한 포트폴리오가 없습니다.</div>
                <a href="create_portfolio.php" style="display: inline-block; margin-top: 1rem; padding: 0.7rem 1.5rem; background: #007bff; color: #fff; border-radius: 8px; text-decoration: none;">포트폴리오 작성하기</a>
            </div>
        <?php else: ?>
            <?php foreach ($portfolios as $portfolio): ?>
                <div class="mypage-card">
                    <div class="mypage-card-title"><?php echo htmlspecialchars($portfolio['title']); ?></div>
                    <div class="mypage-card-desc"><?php echo htmlspecialchars($portfolio['summary']); ?></div>
                    <div class="portfolio-actions">
                        <label class="private-toggle">
                            <input type="checkbox" 
                                   class="private-toggle-input" 
                                   data-portfolio-id="<?php echo $portfolio['id']; ?>"
                                   <?php echo $portfolio['is_private'] ? 'checked' : ''; ?>>
                            <span class="private-slider"></span>
                        </label>
                        <span class="private-label"><?php echo $portfolio['is_private'] ? '비공개' : '공개'; ?></span>
                        <a href="view_portfolio.php?id=<?php echo $portfolio['id']; ?>" style="margin-left: auto; color: #007bff; text-decoration: none;">보기</a>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
    <a href="../index.php" class="mypage-home-btn">홈으로 돌아가기</a>
</main>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('.private-toggle-input');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const portfolioId = this.dataset.portfolioId;
            const isPrivate = this.checked;
            const labelElement = this.closest('.portfolio-actions').querySelector('.private-label');
            
            // AJAX 요청으로 비공개 상태 업데이트
            fetch('update_portfolio_visibility.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    portfolio_id: portfolioId,
                    is_private: isPrivate
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // 성공 시 라벨 텍스트 변경
                    labelElement.textContent = isPrivate ? '비공개' : '공개';
                    // 성공 시 알림
                    const message = isPrivate ? '포트폴리오가 비공개로 설정되었습니다.' : '포트폴리오가 공개로 설정되었습니다.';
                    alert(message);
                } else {
                    // 실패 시 체크박스 상태 되돌리기
                    this.checked = !isPrivate;
                    labelElement.textContent = !isPrivate ? '비공개' : '공개';
                    alert('설정 변경에 실패했습니다.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                this.checked = !isPrivate;
                labelElement.textContent = !isPrivate ? '비공개' : '공개';
                alert('오류가 발생했습니다.');
            });
        });
    });
});
</script>
<?php include '../includes/footer.php'; ?>
</body>
</html> 