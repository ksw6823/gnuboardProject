<?php
require_once '../cuur/config/database.php';
$portfolio_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if (!$portfolio_id) { echo '잘못된 접근입니다.'; exit; }

// 현재 로그인한 사용자 확인
$is_owner = false;
if (isset($_SESSION['user_id'])) {
    $stmt = $pdo->prepare('SELECT user_id FROM portfolios WHERE id = ?');
    $stmt->execute([$portfolio_id]);
    $portfolio_owner = $stmt->fetch();
    $is_owner = $portfolio_owner && $portfolio_owner['user_id'] == $_SESSION['user_id'];
}

// 포트폴리오 기본 정보
$stmt = $pdo->prepare('SELECT p.*, u.name as user_name, u.username, u.profile_image FROM portfolios p JOIN users u ON p.user_id = u.id WHERE p.id = ?');
$stmt->execute([$portfolio_id]);
$portfolio = $stmt->fetch();
if (!$portfolio) { echo '포트폴리오를 찾을 수 없습니다.'; exit; }

// HTML 파일 경로 확인
$html_path = '../uploads/users/' . $portfolio['username'] . '/portfolios/' . $portfolio_id . '/index.html';
// HTML 파일 존재 여부만 확인하고 직접 출력하지 않음
$has_html = file_exists($html_path);

// 키워드
$stmt = $pdo->prepare('SELECT k.name FROM portfolio_keywords pk JOIN keywords k ON pk.keyword_id = k.id WHERE pk.portfolio_id = ?');
$stmt->execute([$portfolio_id]);
$keywords = $stmt->fetchAll(PDO::FETCH_COLUMN);
// 섹션(블록)
$stmt = $pdo->prepare('SELECT type, content FROM portfolio_sections WHERE portfolio_id = ? ORDER BY sort_order ASC');
$stmt->execute([$portfolio_id]);
$sections = $stmt->fetchAll();
// 섹션 타입 목록(내비게이션용)
$section_types = ['자기소개','기술스택','경력','프로젝트','자격증','외국어','대외활동'];
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($portfolio['title']); ?> - 포트폴리오</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .view-wrap { display: flex; gap: 2.5rem; max-width: 1200px; margin: 0 auto; padding-top: 100px; padding-bottom: 60px; }
        .view-main { flex: 1; }
        .view-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2.2rem; }
        .view-profile-img { width: 90px; height: 90px; border-radius: 12px; object-fit: cover; background: #eee; border: 1.5px solid #ccc; }
        .view-header-info { display: flex; flex-direction: column; justify-content: center; }
        .view-header-name { font-size: 1.3rem; font-weight: 700; color: #222; margin-bottom: 0.3rem; }
        .view-header-keywords { margin-bottom: 0.2rem; }
        .view-header-keyword { display:inline-block; background:#e9eef6; color:#007bff; border-radius:16px; padding:0.3rem 0.9rem; margin-right:0.3rem; font-size:0.95rem; }
        .view-title { font-size: 1.7rem; font-weight: 700; margin-bottom: 0.7rem; }
        .view-summary { font-size: 1.1rem; color: #444; margin-bottom: 1.2rem; }
        .view-section { background:#fff; border-radius:12px; box-shadow:0 1px 4px rgba(0,0,0,0.04); padding:1.2rem 1.3rem; margin-bottom:1.2rem; }
        .view-section-type { font-weight:600; color:#007bff; margin-bottom:0.5rem; }
        .view-section-content { color:#333; font-size:1.05rem; white-space:pre-line; }
        .view-side-nav { width: 180px; background: #e9eef6; border-radius: 18px; padding: 1.5rem 0.7rem; height: fit-content; position: sticky; top: 110px; }
        .view-side-nav-btn { display: block; width: 100%; background: none; border: none; border-bottom: 1px solid #b8c6d1; color: #333; font-size: 1.07rem; padding: 0.7rem 0; text-align: center; cursor: pointer; border-radius: 10px 10px 0 0; margin-bottom: 0.2rem; transition: background 0.15s; }
        .view-side-nav-btn:last-child { border-bottom: none; }
        .view-side-nav-btn:hover, .view-side-nav-btn.active { background: #cfd8e6; color: #007bff; }
        @media (max-width: 1000px) { .view-wrap { flex-direction: column; } .view-side-nav { width: 100%; margin-bottom: 2rem; position: static; } }
        
        .edit-portfolio-btn {
            width: 100%;
            background: #6c757d;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 0.9rem 0;
            font-size: 1.05rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            margin-top: 1rem;
            text-align: center;
            text-decoration: none;
            display: block;
        }
        .edit-portfolio-btn:hover {
            background: #5a6268;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
<?php include '../includes/header.php'; ?>
<div class="view-wrap">
    <div class="view-main">
        <div class="view-header">
            <img src="../uploads/users/<?php echo htmlspecialchars($portfolio['username']); ?>/portfolios/<?php echo $portfolio_id; ?>/thumbnail.jpg" 
                 class="view-profile-img" 
                 alt="프로필 사진"
                 onerror="this.onerror=null; this.src='../uploads/users/<?php echo htmlspecialchars($portfolio['username']); ?>/portfolios/<?php echo $portfolio_id; ?>/thumbnail.png'; this.onerror=function(){this.src='../uploads/users/<?php echo htmlspecialchars($portfolio['username']); ?>/portfolios/<?php echo $portfolio_id; ?>/thumbnail.bmp'; this.onerror=function(){this.src='../uploads/default.jpg';}}">
            <div class="view-header-info">
                <div class="view-header-name"><?php echo htmlspecialchars($portfolio['user_name']); ?></div>
                <div class="view-header-keywords">
                    <?php foreach ($keywords as $kw): ?>
                        <span class="view-header-keyword">#<?php echo htmlspecialchars($kw); ?></span>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
        <div class="view-title"><?php echo htmlspecialchars($portfolio['title']); ?></div>
        <div class="view-summary"><?php echo nl2br(htmlspecialchars($portfolio['summary'])); ?></div>
        <?php if ($has_html): ?>
            <div class="view-section" style="background:#fff; border-radius:12px; box-shadow:0 1px 4px rgba(0,0,0,0.04); padding:0; overflow:hidden;">
                <iframe id="portfolioIframe" src="../uploads/users/<?php echo $portfolio['username']; ?>/portfolios/<?php echo $portfolio_id; ?>/index.html" width="100%" height="900px" frameborder="0" style="border-radius:12px; min-height:600px; background:#fff;"></iframe>
            </div>
        <?php else: ?>
            <div class="view-section">포트폴리오 미리보기를 불러올 수 없습니다.</div>
        <?php endif; ?>
    </div>
    <nav class="view-side-nav">
        <?php if ($is_owner): ?>
        <a href="edit_portfolio.php?id=<?php echo $portfolio_id; ?>" class="edit-portfolio-btn">✎ 수정하기</a>
        <?php endif; ?>
        <?php foreach ($section_types as $stype): ?>
            <button type="button" class="view-side-nav-btn" onclick="scrollToSection('<?php echo $stype; ?>')"><?php echo $stype; ?></button>
        <?php endforeach; ?>
    </nav>
</div>

<script>
function scrollToSection(type) {
    const el = document.getElementById('section-' + type);
    if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
}
</script>
<?php include '../includes/footer.php'; ?>
</body>
</html> 