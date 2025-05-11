<?php
session_start();
require_once '../cuur/config/database.php';
// 로그인 체크
if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.php');
    exit;
}
$user_id = $_SESSION['user_id'];
$portfolio_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$is_edit = false;
$portfolio = null;
$keywords = [];
$skills = [];
$sections = [];

// 수정 모드일 경우 기존 포트폴리오 데이터 불러오기
if ($portfolio_id) {
    $stmt = $pdo->prepare('SELECT * FROM portfolios WHERE id = ? AND user_id = ?');
    $stmt->execute([$portfolio_id, $user_id]);
    $portfolio = $stmt->fetch();
    
    if ($portfolio) {
        $is_edit = true;
        
        // 키워드 불러오기
        $stmt = $pdo->prepare('SELECT k.* FROM keywords k 
            JOIN portfolio_keywords pk ON k.id = pk.keyword_id 
            WHERE pk.portfolio_id = ?');
        $stmt->execute([$portfolio_id]);
        $keywords = $stmt->fetchAll();
        
        // 기술스택 불러오기
        $stmt = $pdo->prepare('SELECT s.* FROM skills s 
            JOIN portfolio_skills ps ON s.id = ps.skill_id 
            WHERE ps.portfolio_id = ?');
        $stmt->execute([$portfolio_id]);
        $skills = $stmt->fetchAll();
        
        // 섹션 불러오기
        $stmt = $pdo->prepare('SELECT * FROM portfolio_sections 
            WHERE portfolio_id = ? ORDER BY sort_order ASC');
        $stmt->execute([$portfolio_id]);
        $sections = $stmt->fetchAll();
    }
}

// 사용자 존재 여부 확인
$user_check = $pdo->prepare('SELECT id FROM users WHERE id = ?');
$user_check->execute([$user_id]);
if (!$user_check->fetch()) {
    // 사용자가 존재하지 않으면 세션 삭제하고 로그인 페이지로 리다이렉트
    session_destroy();
    header('Location: login.php');
    exit;
}

// 저장 처리
$save_success = false;
$save_error = '';
// 기술스택 전체 불러오기
$skill_stmt = $pdo->prepare('SELECT id, name FROM skills ORDER BY name ASC');
$skill_stmt->execute();
$all_skills = $skill_stmt->fetchAll();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $summary = trim($_POST['summary'] ?? '');
    $keywords = $_POST['keywords'] ?? [];
    $skills = $_POST['skills'] ?? [];
    if (is_string($skills)) {
        $skills = array_filter(explode(',', $skills));
    }
    $sections = $_POST['sections'] ?? [];
    $photo_path = '';
    // 사진 업로드
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
        $photo_path = 'uploads/portfolio_' . uniqid() . '.' . $ext;
        move_uploaded_file($_FILES['photo']['tmp_name'], '../' . $photo_path);
    }
    try {
        // 1. portfolios 저장
        $stmt = $pdo->prepare('INSERT INTO portfolios (user_id, title, summary, photo) VALUES (?, ?, ?, ?)');
        $stmt->execute([$user_id, $title, $summary, $photo_path]);
        $portfolio_id = $pdo->lastInsertId();
        // 2. 키워드 저장
        foreach ($keywords as $kw) {
            $kw = trim($kw);
            if ($kw === '') continue;
            // 키워드가 없으면 추가
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
            // 연결 테이블 저장
            $stmt = $pdo->prepare('INSERT INTO portfolio_keywords (portfolio_id, keyword_id) VALUES (?, ?)');
            $stmt->execute([$portfolio_id, $kw_id]);
        }
        // 2-1. 기술스택 저장
        foreach ($skills as $skill_id) {
            $stmt = $pdo->prepare('INSERT INTO portfolio_skills (portfolio_id, skill_id) VALUES (?, ?)');
            $stmt->execute([$portfolio_id, $skill_id]);
        }
        // 3. sections 저장
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
// 사용자 정보 불러오기 (초기값)
$stmt = $pdo->prepare('SELECT name, email, phone FROM users WHERE id = ?');
$stmt->execute([$user_id]);
$user = $stmt->fetch();
if (!$user) { $user = ['name'=>'', 'email'=>'', 'phone'=>'']; }
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $is_edit ? '포트폴리오 수정' : '포트폴리오 작성'; ?></title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        body { background: #f7f8fa; }
        .portfolio-create-wrap { display: flex; gap: 2rem; max-width: 1200px; margin: 0 auto; padding-top: 100px; padding-bottom: 60px; }
        .portfolio-create-main { flex: 1; }
        .portfolio-create-title { text-align: center; font-size: 2.3rem; font-weight: 700; margin-bottom: 2.5rem; }
        .portfolio-create-form { background: #e9eef6; border-radius: 16px; padding: 2.5rem 2.5rem 2rem 2.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
        .profile-photo-upload { display: flex; flex-direction: column; align-items: center; margin-bottom: 2rem; }
        .profile-photo-box { width: 110px; height: 140px; background: url('https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg') center/cover #f3f3f3; border-radius: 10px; border: 2px dashed #bbb; display: flex; align-items: center; justify-content: center; color: #888; font-size: 1.05rem; margin-bottom: 0.7rem; cursor: pointer; position: relative; overflow: hidden; }
        .profile-photo-box input { opacity: 0; position: absolute; width: 100%; height: 100%; left: 0; top: 0; cursor: pointer; }
        .profile-photo-label { color: #888; font-size: 0.98rem; }
        .profile-photo-preview { position: absolute; width: 100%; height: 100%; object-fit: cover; left: 0; top: 0; border-radius: 10px; z-index: 2; }
        .info-form-row { display: flex; gap: 1rem; margin-bottom: 1.1rem; }
        .info-form-row input, .info-form-row select { flex: 1; padding: 0.7rem; border-radius: 7px; border: 1px solid #bbb; font-size: 1rem; }
        .info-form-row select { max-width: 80px; }
        .info-form-label { font-weight: 600; margin-bottom: 0.3rem; display: block; color: #444; }
        .info-form-group { margin-bottom: 1.1rem; }
        .info-form-group input, .info-form-group textarea { width: 100%; padding: 0.7rem; border-radius: 7px; border: 1px solid #bbb; font-size: 1rem; }
        .info-form-group textarea { min-height: 70px; resize: vertical; }
        .keyword-list { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.2rem; }
        .keyword-item {
            background: #fff;
            border-radius: 16px;
            padding: 0.4rem 1.1rem;
            font-size: 0.98rem;
            color: #555;
            border: 1px solid #d0d0d0;
            cursor:pointer;
            display: flex;
            align-items: center;
            margin-bottom: 0.3rem;
            white-space: nowrap;
        }
        .keyword-item .remove-keyword { margin-left: 0.5rem; color: #dc3545; font-weight: bold; cursor:pointer; }
        .keyword-add-btn { background: #fff; border: 1px dashed #bbb; border-radius: 16px; padding: 0.4rem 1.1rem; color: #888; font-size: 1.1rem; cursor: pointer; }
        .info-add-box { background: #f3f6fa; border-radius: 14px; min-height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #bbb; font-size: 1.1rem; margin-bottom: 1.5rem; margin-top: 1.2rem; text-align: center; }
        .info-section-block { background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); padding: 1.1rem; margin: 0.7rem 0; width: 100%; }
        .info-section-block .section-type { font-weight: 600; color: #007bff; margin-bottom: 0.5rem; }
        .info-section-block textarea { width: 100%; min-height: 50px; border-radius: 7px; border: 1px solid #bbb; padding: 0.5rem; }
        .remove-section-btn { color: #dc3545; font-size: 0.95rem; margin-top: 0.3rem; cursor:pointer; background:none; border:none; }
        .portfolio-create-side { 
            width: 260px; 
            position: sticky;
            top: 100px;
            height: fit-content;
        }
        .side-theme { background: #e9eef6; border-radius: 8px; padding: 1rem; margin-bottom: 1.2rem; text-align: center; font-weight: 600; }
        .side-tag-box { background: #fff; border-radius: 8px; padding: 1rem; margin-bottom: 1.2rem; }
        .side-tag-title { font-weight: 600; margin-bottom: 0.7rem; }
        .side-tag-list { display: flex; flex-direction: column; gap: 0.7rem; }
        .side-tag-item { background: #e9eef6; border-radius: 16px; padding: 0.7rem 0; text-align: center; font-size: 1.05rem; color: #333; cursor: pointer; border: none; }
        .side-tag-add { background: #e9eef6; border-radius: 16px; padding: 0.7rem 0; text-align: center; font-size: 1.2rem; color: #888; border: none; cursor: pointer; }
        .side-btns { display: flex; flex-direction: column; gap: 0.7rem; }
        .side-btns button, .side-btns a { border: none; border-radius: 8px; padding: 0.9rem 0; font-size: 1.05rem; font-weight: 600; cursor: pointer; background: #e9eef6; color: #333; transition: background 0.2s; text-align: center; text-decoration: none; }
        .side-btns button:hover, .side-btns a:hover { background: #d0d8e6; }
        @media (max-width: 1000px) { .portfolio-create-wrap { flex-direction: column; } .portfolio-create-side { width: 100%; margin-top: 2.5rem; } }
        /* 기술 스택 모달 스타일 추가 */
        #skillModal {
            display: none;
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.18);
            z-index: 3000;
            align-items: center;
            justify-content: center;
        }
        
        #skillModal > div {
            background: #fff;
            border-radius: 12px;
            padding: 2rem 2.5rem;
            min-width: 320px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 2px 16px rgba(0,0,0,0.13);
        }
        
        #skillOptions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.7rem;
            margin-bottom: 1.2rem;
            max-height: 50vh;
            overflow-y: auto;
            padding: 0.5rem;
        }
        
        .keyword-option-btn {
            background: #f3f6fa;
            color: #333;
            border: 1px solid #bbb;
            border-radius: 16px;
            padding: 0.4rem 1.1rem;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .keyword-option-btn:hover {
            background: #e9eef6;
            border-color: #007bff;
        }
        
        .keyword-option-btn.selected {
            background: #007bff;
            color: #fff;
            border-color: #007bff;
        }
        .skill-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.7rem;
            margin-bottom: 1.2rem;
        }
        .keyword-item {
            background: #fff;
            border-radius: 16px;
            padding: 0.4rem 1.1rem;
            font-size: 0.98rem;
            color: #555;
            border: 1px solid #d0d0d0;
            cursor:pointer;
            display: flex;
            align-items: center;
            margin-bottom: 0.3rem;
            white-space: nowrap;
        }
    </style>
</head>
<body>
<?php include '../includes/header.php'; ?>
<div class="portfolio-create-wrap">
    <div class="portfolio-create-main">
        <div class="portfolio-create-title">Logo</div>
        <?php if ($save_success): ?>
            <div style="background:#d1e7dd; color:#0f5132; border-radius:8px; padding:1rem 1.5rem; margin-bottom:1.5rem; text-align:center;">포트폴리오가 성공적으로 저장되었습니다!</div>
        <?php elseif ($save_error): ?>
            <div style="background:#f8d7da; color:#842029; border-radius:8px; padding:1rem 1.5rem; margin-bottom:1.5rem; text-align:center;">저장 오류: <?php echo htmlspecialchars($save_error); ?></div>
        <?php endif; ?>
        <form class="portfolio-create-form" id="portfolioForm" enctype="multipart/form-data" autocomplete="off" method="post">
            <?php if ($is_edit): ?>
            <input type="hidden" name="portfolio_id" value="<?php echo $portfolio_id; ?>">
            <?php endif; ?>
            <div class="profile-photo-upload">
                <label class="profile-photo-box" id="photoBox">
                    <span id="photoBoxText">사진 추가</span>
                    <input type="file" name="photo" id="photoInput" accept="image/*" <?php echo $is_edit ? '' : 'required'; ?>>
                    <img id="photoPreview" class="profile-photo-preview" style="display:none;" alt="미리보기">
                </label>
                <div class="profile-photo-label">사진 추가</div>
            </div>
            <div class="info-form-group" style="background:#cfd8e6; border-radius:10px; padding:1.2rem 1.2rem 1.2rem 1.2rem; margin-bottom:1.5rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                    <span style="font-weight:600;">이름</span>
                    <a href="#" id="loadUserInfoBtn" style="color:#555; font-size:0.98rem; text-decoration:underline;">내 정보 불러오기</a>
                </div>
                <div class="info-form-row">
                    <input type="text" id="inputName" name="name" value="<?php echo htmlspecialchars($user['name']); ?>" placeholder="이름">
                </div>
                <div class="info-form-row">
                    <select><option>국가</option><option selected>KR</option></select>
                    <input type="text" id="inputPhone" name="phone" value="<?php echo htmlspecialchars($user['phone']); ?>" placeholder="01012345678">
                </div>
                <div class="info-form-row">
                    <input type="email" id="inputEmail" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" placeholder="이메일">
                </div>
            </div>
            <div class="info-form-group">
                <label class="info-form-label">포트폴리오 제목</label>
                <input type="text" name="title" id="inputTitle" placeholder="포트폴리오 제목을 입력하세요" required value="<?php echo $is_edit ? htmlspecialchars($portfolio['title']) : ''; ?>">
            </div>
            <div class="info-form-group">
                <label class="info-form-label">한줄 소개</label>
                <textarea name="summary" placeholder="한줄 소개를 입력하세요" required><?php echo $is_edit ? htmlspecialchars($portfolio['summary']) : ''; ?></textarea>
            </div>
            <div class="info-form-group">
                <label class="info-form-label">나의 키워드</label>
                <div class="keyword-list" id="keywordList">
                    <!-- 동적 키워드 렌더링 -->
                </div>
                <button type="button" class="keyword-add-btn" id="openKeywordSelect">+</button>
                <input type="hidden" name="keywords[]" id="keywordsHidden">
            </div>
            <div class="info-form-group">
                <label class="info-form-label">기술 스택</label>
                <div class="skill-list" id="skillList"></div>
                <button type="button" class="keyword-add-btn" id="openSkillSelect">+</button>
            </div>
            <div class="info-form-group">
                <label class="info-form-label">정보 추가</label>
                <div class="info-add-box" id="infoAddBox">
                    <!-- 동적 섹션 렌더링 -->
                    <div style="color:#bbb;">오른쪽 태그를 끌어와 작성<br><span style="font-size:2.2rem; display:block; margin-top:0.5rem;">+</span></div>
                </div>
                <input type="hidden" name="sections[]" id="sectionsHidden">
            </div>
            <button type="submit" style="margin-top:1.5rem; width:100%; background:#007bff; color:#fff; font-weight:600; border:none; border-radius:8px; padding:0.9rem 0; font-size:1.1rem;">저장</button>
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
            <button type="button">불러오기</button>
            <button type="button">PDF / 프린트 인쇄</button>
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
window.onload = function() {
// 사진 미리보기
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const photoBoxText = document.getElementById('photoBoxText');
photoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            photoPreview.src = ev.target.result;
            photoPreview.style.display = 'block';
            photoBoxText.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else {
        photoPreview.src = '';
        photoPreview.style.display = 'none';
        photoBoxText.style.display = 'block';
    }
});
// 내 정보 불러오기 (AJAX)
document.getElementById('loadUserInfoBtn').addEventListener('click', function(e) {
    e.preventDefault();
    fetch('load_userinfo.php')
        .then(res => res.json())
        .then(data => {
            if (data && data.name) document.getElementById('inputName').value = data.name;
            if (data && data.email) document.getElementById('inputEmail').value = data.email;
            if (data && data.phone) document.getElementById('inputPhone').value = data.phone;
        });
});
// 키워드 동적 추가/삭제/선택
let keywords = [];
const keywordList = document.getElementById('keywordList');
const keywordsHidden = document.getElementById('keywordsHidden');
const openKeywordSelect = document.getElementById('openKeywordSelect');
const keywordModal = document.getElementById('keywordModal');
const keywordOptions = document.getElementById('keywordOptions');
const closeKeywordModal = document.getElementById('closeKeywordModal');
const addSelectedKeywords = document.getElementById('addSelectedKeywords');
// 예시 키워드 목록(실제는 DB에서 불러올 수도 있음)
const allKeywordOptions = ['책임감','성실함','팀워크','창의력','리더십','소통','도전정신','문제해결','긍정','열정','협업','전문성','유연성','집중력','분석력'];
let selectedKeywordOptions = [];
function renderKeywords() {
    keywordList.innerHTML = '';
    keywords.forEach((kw, idx) => {
        const span = document.createElement('span');
        span.className = 'keyword-item';
        span.textContent = '#' + kw;
        const rm = document.createElement('span');
        rm.className = 'remove-keyword';
        rm.textContent = '×';
        rm.onclick = () => { keywords.splice(idx,1); renderKeywords(); };
        span.appendChild(rm);
        keywordList.appendChild(span);
    });
    keywordsHidden.value = keywords.map(k=>k).join(',');
}
openKeywordSelect.addEventListener('click', function() {
    keywordModal.style.display = 'flex';
    renderKeywordOptions();
});
closeKeywordModal.addEventListener('click', function() {
    keywordModal.style.display = 'none';
});
function renderKeywordOptions() {
    keywordOptions.innerHTML = '';
    allKeywordOptions.forEach(kw => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = kw;
        btn.className = 'keyword-option-btn';
        btn.style.background = selectedKeywordOptions.includes(kw) ? '#007bff' : '#f3f6fa';
        btn.style.color = selectedKeywordOptions.includes(kw) ? '#fff' : '#333';
        btn.style.border = '1px solid #bbb';
        btn.style.borderRadius = '16px';
        btn.style.padding = '0.4rem 1.1rem';
        btn.style.fontSize = '1rem';
        btn.style.cursor = 'pointer';
        btn.onclick = function() {
            if (selectedKeywordOptions.includes(kw)) {
                selectedKeywordOptions = selectedKeywordOptions.filter(k=>k!==kw);
            } else {
                selectedKeywordOptions.push(kw);
            }
            renderKeywordOptions();
        };
        keywordOptions.appendChild(btn);
    });
}
addSelectedKeywords.addEventListener('click', function() {
    selectedKeywordOptions.forEach(kw => {
        if (!keywords.includes(kw)) keywords.push(kw);
    });
    renderKeywords();
    keywordModal.style.display = 'none';
    selectedKeywordOptions = [];
});
renderKeywords();
// 정보 추가(태그 블록) 동적 UI
let sections = [];
const infoAddBox = document.getElementById('infoAddBox');
const sectionsHidden = document.getElementById('sectionsHidden');
const sideTagList = document.getElementById('sideTagList');
function renderSections() {
    infoAddBox.innerHTML = '';
    if (sections.length === 0) {
        infoAddBox.innerHTML = '<div style="color:#bbb;">오른쪽 태그를 끌어와 작성<br><span style="font-size:2.2rem; display:block; margin-top:0.5rem;">+</span></div>';
    } else {
        sections.forEach((sec, idx) => {
            const div = document.createElement('div');
            div.className = 'info-section-block';
            div.innerHTML = `<div class="section-type">${sec.type}</div><textarea placeholder="내용을 입력하세요">${sec.content||''}</textarea><button type="button" class="remove-section-btn">삭제</button>`;
            div.querySelector('textarea').oninput = function() { sections[idx].content = this.value; sectionsHidden.value = JSON.stringify(sections); };
            div.querySelector('.remove-section-btn').onclick = function() { sections.splice(idx,1); renderSections(); sectionsHidden.value = JSON.stringify(sections); };
            infoAddBox.appendChild(div);
        });
    }
    sectionsHidden.value = JSON.stringify(sections);
}
sideTagList.querySelectorAll('.side-tag-item').forEach(btn => {
    btn.addEventListener('click', function() {
        const type = this.dataset.type;
        sections.push({type, content:''});
        renderSections();
    });
});
renderSections();
// 기술스택 동적 추가/삭제/선택
let skills = [];
const skillList = document.getElementById('skillList');
const openSkillSelect = document.getElementById('openSkillSelect');
const skillModal = document.getElementById('skillModal');
const skillOptions = document.getElementById('skillOptions');
const closeSkillModal = document.getElementById('closeSkillModal');
const addSelectedSkills = document.getElementById('addSelectedSkills');
const allSkillOptions = <?php echo json_encode($all_skills, JSON_UNESCAPED_UNICODE); ?>;
let selectedSkillOptions = [];
function renderSkills() {
    skillList.innerHTML = '';
    // 기존 input[name='skills[]'] 모두 삭제
    document.querySelectorAll("input[name='skills[]']").forEach(e => e.remove());
    // 선택된 스킬 태그 렌더링 및 input 동적 추가
    skills.forEach((skill, idx) => {
        const span = document.createElement('span');
        span.className = 'keyword-item';
        span.textContent = skill.name;
        const rm = document.createElement('span');
        rm.className = 'remove-keyword';
        rm.textContent = '×';
        rm.onclick = () => { skills.splice(idx,1); renderSkills(); };
        span.appendChild(rm);
        skillList.appendChild(span);
        // input 동적 추가 (form에 직접)
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'skills[]';
        input.value = skill.id;
        document.getElementById('portfolioForm').appendChild(input);
    });
}
openSkillSelect.addEventListener('click', function() {
    skillModal.style.display = 'flex';
    renderSkillOptions();
});
closeSkillModal.addEventListener('click', function() {
    skillModal.style.display = 'none';
});
function renderSkillOptions() {
    skillOptions.innerHTML = '';
    allSkillOptions.forEach(skill => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = skill.name;
        btn.className = 'keyword-option-btn';
        btn.style.background = selectedSkillOptions.includes(skill.id) ? '#007bff' : '#f3f6fa';
        btn.style.color = selectedSkillOptions.includes(skill.id) ? '#fff' : '#333';
        btn.style.border = '1px solid #bbb';
        btn.style.borderRadius = '16px';
        btn.style.padding = '0.4rem 1.1rem';
        btn.style.fontSize = '1rem';
        btn.style.cursor = 'pointer';
        btn.onclick = function() {
            if (selectedSkillOptions.includes(skill.id)) {
                selectedSkillOptions = selectedSkillOptions.filter(sid=>sid!==skill.id);
            } else {
                selectedSkillOptions.push(skill.id);
            }
            renderSkillOptions();
        };
        skillOptions.appendChild(btn);
    });
}
addSelectedSkills.addEventListener('click', function() {
    selectedSkillOptions.forEach(sid => {
        if (!skills.some(s=>s.id===sid)) {
            const skill = allSkillOptions.find(s=>s.id===sid);
            if (skill) skills.push(skill);
        }
    });
    renderSkills();
    skillModal.style.display = 'none';
    selectedSkillOptions = [];
});
renderSkills();
};

// 수정 모드일 경우 기존 데이터로 폼 초기화
<?php if ($is_edit): ?>
document.addEventListener('DOMContentLoaded', function() {
    // 키워드 초기화
    keywords = <?php echo json_encode($keywords); ?>;
    renderKeywords();
    
    // 기술스택 초기화
    skills = <?php echo json_encode($skills); ?>;
    renderSkills();
    
    // 섹션 초기화
    sections = <?php echo json_encode($sections); ?>;
    renderSections();
});
<?php endif; ?>
</script>
<?php include '../includes/footer.php'; ?>
</body>
</html> 