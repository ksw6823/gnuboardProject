<?php
require_once '../cuur/config/database.php';

// 로그인 체크
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$portfolio_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if (!$portfolio_id) {
    echo '잘못된 접근입니다.';
    exit;
}

// 포트폴리오 정보 불러오기
$stmt = $pdo->prepare('SELECT * FROM portfolios WHERE id = ? AND user_id = ?');
$stmt->execute([$portfolio_id, $_SESSION['user_id']]);
$portfolio = $stmt->fetch();

if (!$portfolio) {
    echo '포트폴리오를 찾을 수 없거나 수정 권한이 없습니다.';
    exit;
}

// 키워드 불러오기
$stmt = $pdo->prepare('SELECT k.name FROM portfolio_keywords pk JOIN keywords k ON pk.keyword_id = k.id WHERE pk.portfolio_id = ?');
$stmt->execute([$portfolio_id]);
$keywords = $stmt->fetchAll(PDO::FETCH_COLUMN);

// 기술스택 불러오기
$stmt = $pdo->prepare('SELECT s.* FROM portfolio_skills ps JOIN skills s ON ps.skill_id = s.id WHERE ps.portfolio_id = ?');
$stmt->execute([$portfolio_id]);
$skills = $stmt->fetchAll();

// 섹션 불러오기
$stmt = $pdo->prepare('SELECT type, content FROM portfolio_sections WHERE portfolio_id = ? ORDER BY sort_order ASC');
$stmt->execute([$portfolio_id]);
$sections = $stmt->fetchAll();

// 전체 기술스택 목록
$skill_stmt = $pdo->prepare('SELECT id, name FROM skills ORDER BY name ASC');
$skill_stmt->execute();
$all_skills = $skill_stmt->fetchAll();

// 저장 처리
$save_success = false;
$save_error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $summary = trim($_POST['summary'] ?? '');
    $keywords = $_POST['keywords'] ?? [];
    $skills = $_POST['skills'] ?? [];
    if (is_string($skills)) {
        $skills = array_filter(explode(',', $skills));
    }
    $sections = $_POST['sections'] ?? [];
    $photo_path = $portfolio['photo'];

    // 사진 업로드
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
        $photo_path = 'uploads/portfolio_' . uniqid() . '.' . $ext;
        move_uploaded_file($_FILES['photo']['tmp_name'], '../' . $photo_path);
    }

    try {
        // 1. portfolios 업데이트
        $stmt = $pdo->prepare('UPDATE portfolios SET title = ?, summary = ?, photo = ? WHERE id = ? AND user_id = ?');
        $stmt->execute([$title, $summary, $photo_path, $portfolio_id, $_SESSION['user_id']]);

        // 2. 키워드 업데이트
        $stmt = $pdo->prepare('DELETE FROM portfolio_keywords WHERE portfolio_id = ?');
        $stmt->execute([$portfolio_id]);
        foreach ($keywords as $kw) {
            $kw = trim($kw);
            if ($kw === '') continue;
            $stmt = $pdo->prepare('SELECT id FROM keywords WHERE name = ?');
            $stmt->execute([$kw]);
            $row = $stmt->fetch();
            if ($row) {
                $kw_id = $row['id'];
            } else {
                $stmt = $pdo->prepare('INSERT INTO keywords (name) VALUES (?)');
                $stmt->execute([$kw]);
                $kw_id = $pdo->lastInsertId();
            }
            $stmt = $pdo->prepare('INSERT INTO portfolio_keywords (portfolio_id, keyword_id) VALUES (?, ?)');
            $stmt->execute([$portfolio_id, $kw_id]);
        }

        // 3. 기술스택 업데이트
        $stmt = $pdo->prepare('DELETE FROM portfolio_skills WHERE portfolio_id = ?');
        $stmt->execute([$portfolio_id]);
        foreach ($skills as $skill_id) {
            $stmt = $pdo->prepare('INSERT INTO portfolio_skills (portfolio_id, skill_id) VALUES (?, ?)');
            $stmt->execute([$portfolio_id, $skill_id]);
        }

        // 4. 섹션 업데이트
        $stmt = $pdo->prepare('DELETE FROM portfolio_sections WHERE portfolio_id = ?');
        $stmt->execute([$portfolio_id]);
        foreach ($sections as $i => $section) {
            $type = $section['type'] ?? '';
            $content = $section['content'] ?? '';
            $stmt = $pdo->prepare('INSERT INTO portfolio_sections (portfolio_id, type, content, sort_order) VALUES (?, ?, ?, ?)');
            $stmt->execute([$portfolio_id, $type, json_encode($content, JSON_UNESCAPED_UNICODE), $i]);
        }

        $save_success = true;
    } catch (PDOException $e) {
        $save_error = '저장 중 오류: ' . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>포트폴리오 수정</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        /* create_portfolio.php의 스타일을 그대로 사용 */
        body { background: #f7f8fa; }
        .portfolio-create-wrap { display: flex; gap: 2rem; max-width: 1200px; margin: 0 auto; padding-top: 100px; padding-bottom: 60px; }
        .portfolio-create-main { flex: 1; }
        .portfolio-create-title { text-align: center; font-size: 2.3rem; font-weight: 700; margin-bottom: 2.5rem; }
        .portfolio-create-form { background: #e9eef6; border-radius: 16px; padding: 2.5rem 2.5rem 2rem 2.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
        /* ... 나머지 스타일은 create_portfolio.php와 동일 ... */
    </style>
</head>
<body>
<?php include '../includes/header.php'; ?>
<div class="portfolio-create-wrap">
    <div class="portfolio-create-main">
        <div class="portfolio-create-title">포트폴리오 수정</div>
        <?php if ($save_success): ?>
            <div style="background:#d1e7dd; color:#0f5132; border-radius:8px; padding:1rem 1.5rem; margin-bottom:1.5rem; text-align:center;">포트폴리오가 성공적으로 수정되었습니다!</div>
        <?php elseif ($save_error): ?>
            <div style="background:#f8d7da; color:#842029; border-radius:8px; padding:1rem 1.5rem; margin-bottom:1.5rem; text-align:center;">저장 오류: <?php echo htmlspecialchars($save_error); ?></div>
        <?php endif; ?>
        <form class="portfolio-create-form" id="portfolioForm" enctype="multipart/form-data" method="post">
            <div class="profile-photo-upload">
                <label class="profile-photo-box" id="photoBox">
                    <span id="photoBoxText" style="display:<?php echo $portfolio['photo'] ? 'none' : 'block'; ?>">사진 추가</span>
                    <input type="file" name="photo" id="photoInput" accept="image/*">
                    <img id="photoPreview" class="profile-photo-preview" src="<?php echo $portfolio['photo'] ? '../' . htmlspecialchars($portfolio['photo']) : ''; ?>" style="display:<?php echo $portfolio['photo'] ? 'block' : 'none'; ?>" alt="미리보기">
                </label>
                <div class="profile-photo-label">사진 수정</div>
            </div>
            <div class="info-form-group">
                <label class="info-form-label">포트폴리오 제목</label>
                <input type="text" name="title" id="inputTitle" value="<?php echo htmlspecialchars($portfolio['title']); ?>" placeholder="포트폴리오 제목을 입력하세요" required>
            </div>
            <div class="info-form-group">
                <label class="info-form-label">한줄 소개</label>
                <textarea name="summary" placeholder="한줄 소개를 입력하세요"><?php echo htmlspecialchars($portfolio['summary']); ?></textarea>
            </div>
            <div class="info-form-group">
                <label class="info-form-label">나의 키워드</label>
                <div class="keyword-list" id="keywordList">
                    <?php foreach ($keywords as $kw): ?>
                        <span class="keyword-item">#<?php echo htmlspecialchars($kw); ?><span class="remove-keyword">×</span></span>
                    <?php endforeach; ?>
                </div>
                <button type="button" class="keyword-add-btn" id="openKeywordSelect">+</button>
                <input type="hidden" name="keywords[]" id="keywordsHidden" value="<?php echo htmlspecialchars(implode(',', $keywords)); ?>">
            </div>
            <div class="info-form-group">
                <label class="info-form-label">기술 스택</label>
                <div class="skill-list" id="skillList">
                    <?php foreach ($skills as $skill): ?>
                        <span class="keyword-item"><?php echo htmlspecialchars($skill['name']); ?><span class="remove-keyword">×</span></span>
                    <?php endforeach; ?>
                </div>
                <button type="button" class="keyword-add-btn" id="openSkillSelect">+</button>
            </div>
            <div class="info-form-group">
                <label class="info-form-label">정보 추가</label>
                <div class="info-add-box" id="infoAddBox">
                    <?php foreach ($sections as $section): ?>
                        <div class="info-section-block">
                            <div class="section-type"><?php echo htmlspecialchars($section['type']); ?></div>
                            <textarea placeholder="내용을 입력하세요"><?php echo htmlspecialchars(json_decode($section['content'], true)); ?></textarea>
                            <button type="button" class="remove-section-btn">삭제</button>
                        </div>
                    <?php endforeach; ?>
                </div>
                <input type="hidden" name="sections[]" id="sectionsHidden" value="<?php echo htmlspecialchars(json_encode($sections)); ?>">
            </div>
            <button type="submit" style="margin-top:1.5rem; width:100%; background:#007bff; color:#fff; font-weight:600; border:none; border-radius:8px; padding:0.9rem 0; font-size:1.1rem;">수정 완료</button>
        </form>
    </div>
    <aside class="portfolio-create-side">
        <div class="side-theme">테마 설정</div>
        <div class="side-tag-box">
            <div class="side-tag-title">태그</div>
            <div class="side-tag-list" id="sideTagList">
                <button type="button" class="side-tag-item" data-type="기본정보">기본 정보</button>
                <button type="button" class="side-tag-item" data-type="기술스택">기술 스택</button>
                <button type="button" class="side-tag-item" data-type="수행경험">수행경험</button>
                <button type="button" class="side-tag-item" data-type="이력">이력</button>
                <button type="button" class="side-tag-item" data-type="자격증">자격증</button>
                <button type="button" class="side-tag-item" data-type="자기소개서">자기소개서</button>
                <button type="button" class="side-tag-item" data-type="언어">언어</button>
                <button type="button" class="side-tag-add">+</button>
            </div>
        </div>
        <div class="side-btns">
            <button type="button" onclick="document.getElementById('portfolioForm').submit();">저장</button>
            <a href="view_portfolio.php?id=<?php echo $portfolio_id; ?>">취소</a>
        </div>
    </aside>
</div>

<!-- 키워드 선택 모달 -->
<div id="keywordModal" style="display:none; position:fixed; left:0; top:0; width:100vw; height:100vh; background:rgba(0,0,0,0.18); z-index:3000; align-items:center; justify-content:center;">
    <div style="background:#fff; border-radius:12px; padding:2rem 2.5rem; min-width:320px; max-width:90vw; box-shadow:0 2px 16px rgba(0,0,0,0.13);">
        <div style="font-weight:700; font-size:1.15rem; margin-bottom:1.2rem;">키워드 선택</div>
        <div id="keywordOptions" style="display:flex; flex-wrap:wrap; gap:0.7rem; margin-bottom:1.2rem;"></div>
        <div style="text-align:right;">
            <button type="button" id="closeKeywordModal" style="background:#bbb; color:#fff; border:none; border-radius:7px; padding:0.5rem 1.3rem; font-weight:600; margin-right:0.5rem;">닫기</button>
            <button type="button" id="addSelectedKeywords" style="background:#007bff; color:#fff; border:none; border-radius:7px; padding:0.5rem 1.3rem; font-weight:600;">추가</button>
        </div>
    </div>
</div>

<!-- 기술스택 선택 모달 -->
<div id="skillModal" style="display:none; position:fixed; left:0; top:0; width:100vw; height:100vh; background:rgba(0,0,0,0.18); z-index:3000; align-items:center; justify-content:center;">
    <div style="background:#fff; border-radius:12px; padding:2rem 2.5rem; min-width:320px; max-width:90vw; box-shadow:0 2px 16px rgba(0,0,0,0.13);">
        <div style="font-weight:700; font-size:1.15rem; margin-bottom:1.2rem;">기술 스택 선택</div>
        <div id="skillOptions" style="display:flex; flex-wrap:wrap; gap:0.7rem; margin-bottom:1.2rem;"></div>
        <div style="text-align:right;">
            <button type="button" id="closeSkillModal" style="background:#bbb; color:#fff; border:none; border-radius:7px; padding:0.5rem 1.3rem; font-weight:600; margin-right:0.5rem;">닫기</button>
            <button type="button" id="addSelectedSkills" style="background:#007bff; color:#fff; border:none; border-radius:7px; padding:0.5rem 1.3rem; font-weight:600;">추가</button>
        </div>
    </div>
</div>

<script>
// create_portfolio.php의 JavaScript 코드를 그대로 사용하되, 초기값 설정 부분만 수정
window.onload = function() {
    // ... 기존 JavaScript 코드 ...
    
    // 초기값 설정
    keywords = <?php echo json_encode($keywords); ?>;
    skills = <?php echo json_encode($skills); ?>;
    sections = <?php echo json_encode($sections); ?>;
    
    renderKeywords();
    renderSkills();
    renderSections();
};
</script>

<?php include '../includes/footer.php'; ?>
</body>
</html> 