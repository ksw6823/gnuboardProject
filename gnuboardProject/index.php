<?php
require_once 'cuur/config/database.php';
// 포트폴리오 목록 불러오기 (기술스택 포함)
$stmt = $pdo->prepare('SELECT p.id, p.title, p.summary, p.path, u.username, GROUP_CONCAT(DISTINCT s.name) as skills
    FROM portfolios p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN portfolio_skills ps ON p.id = ps.portfolio_id
    LEFT JOIN skills s ON ps.skill_id = s.id
    WHERE p.is_private = 0
    GROUP BY p.id
    ORDER BY p.created_at DESC LIMIT 30');
$stmt->execute();
$portfolios = $stmt->fetchAll();

// 디버깅을 위한 출력
echo "<!-- Debug Info:\n";
foreach ($portfolios as $p) {
    echo "Portfolio ID: " . $p['id'] . "\n";
    echo "Username: " . $p['username'] . "\n";
    echo "Path: " . $p['path'] . "\n";
    echo "---\n";
}
echo "-->";

// 전체 기술스택 불러오기
$skill_stmt = $pdo->prepare('SELECT id, name FROM skills ORDER BY name ASC');
$skill_stmt->execute();
$all_skills = $skill_stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>산학협력 프로젝트</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
    .portfolio-card-link { text-decoration:none; color:inherit; }
    .portfolio-card-link:hover .portfolio-card { box-shadow:0 6px 24px rgba(0,0,0,0.13); transform:translateY(-4px) scale(1.03); }
    .portfolio-card-thumb { background:#e9eef3; height:90px; width:100%; border-radius:12px 12px 0 0; }
    .portfolio-card-thumb img { width:100%; height:90px; object-fit:cover; border-radius:12px 12px 0 0; }
    
    /* 검색 섹션 스타일 */
    .search-section {
        background: #fff;
        padding: 2rem 0;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    .search-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    .search-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 1.5rem;
    }
    
    .search-input-wrap {
        position: relative;
        margin-bottom: 1.5rem;
    }
    
    .search-input-wrap input {
        width: 100%;
        padding: 1rem 1.5rem;
        padding-left: 3rem;
        border: 1px solid #ddd;
        border-radius: 12px;
        font-size: 1.1rem;
        background: #f8f9fa;
        transition: all 0.2s;
    }
    
    .search-input-wrap input:focus {
        background: #fff;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        outline: none;
    }
    
    .search-input-wrap::before {
        content: "🔍";
        position: absolute;
        left: 1.2rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.2rem;
        color: #666;
    }
    
    .search-skill-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        margin-bottom: 0.5rem;
    }
    
    .search-skill-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 20px;
        padding: 0.5rem 1rem;
        font-size: 0.95rem;
        color: #444;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .search-skill-item:hover {
        background: #e9ecef;
        border-color: #007bff;
    }
    
    .search-skill-item input[type=checkbox] {
        width: 16px;
        height: 16px;
        accent-color: #007bff;
    }
    
    .search-skill-item.selected {
        background: #007bff;
        color: #fff;
        border-color: #007bff;
    }
    
    .search-skill-item.selected input[type=checkbox] {
        accent-color: #fff;
    }
    
    .portfolio-section {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    .portfolio-grid-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 1.5rem;
    }
    
    /* FAB 버튼 스타일 */
    .fab-btn {
        position: fixed;
        right: 38px;
        bottom: 38px;
        width: 64px;
        height: 64px;
        background: #007bff;
        color: #fff;
        border-radius: 50%;
        box-shadow: 0 4px 16px rgba(0,0,0,0.13);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        font-weight: 700;
        z-index: 2000;
        transition: background 0.2s, box-shadow 0.2s;
        text-decoration: none;
    }
    
    .fab-btn:hover {
        background: #0056b3;
        box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    }
    
    .fab-btn span {
        display: block;
        line-height: 1;
        margin-top: -2px;
    }
    
    @media (max-width: 600px) {
        .fab-btn {
            right: 18px;
            bottom: 18px;
            width: 52px;
            height: 52px;
            font-size: 2rem;
        }
    }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>
    
    <!-- 검색 섹션 -->
    <section class="search-section">
        <div class="search-container">
            <div class="search-title">포트폴리오 검색</div>
            <div class="search-input-wrap">
                <input type="text" class="form-control" id="searchTitle" placeholder="관심있는 분야나 기술을 검색해보세요">
            </div>
            <div class="search-skill-list" id="searchSkillList">
                <?php foreach ($all_skills as $sk): ?>
                <label class="search-skill-item">
                    <input type="checkbox" value="<?php echo $sk['name']; ?>">
                    <?php echo htmlspecialchars($sk['name']); ?>
                </label>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    
    <!-- 포트폴리오 섹션 -->
    <section class="portfolio-section">
        <div class="portfolio-grid-title">최근 포트폴리오</div>
        <div class="portfolio-card-grid" id="portfolioCardGrid">
            <?php foreach ($portfolios as $p): ?>
            <a href="pages/view_portfolio.php?id=<?php echo $p['id']; ?>" class="portfolio-card-link portfolio-card-item" data-title="<?php echo htmlspecialchars($p['title']); ?>" data-skills="<?php echo htmlspecialchars($p['skills']); ?>">
                <div class="portfolio-card">
                    <div class="portfolio-card-thumb">
                        <img src="uploads/users/<?php echo htmlspecialchars($p['username']); ?>/portfolios/<?php echo $p['id']; ?>/thumbnail.jpg" 
                             alt="썸네일"
                             onerror="this.onerror=null; this.src='uploads/users/<?php echo htmlspecialchars($p['username']); ?>/portfolios/<?php echo $p['id']; ?>/thumbnail.png'; this.onerror=function(){this.src='uploads/users/<?php echo htmlspecialchars($p['username']); ?>/portfolios/<?php echo $p['id']; ?>/thumbnail.bmp'; this.onerror=function(){this.src='uploads/default.jpg';}}">
                    </div>
                    <div class="portfolio-card-body">
                        <div class="portfolio-card-title"><?php echo htmlspecialchars($p['title']); ?></div>
                        <div class="portfolio-card-desc"><?php echo htmlspecialchars($p['summary']); ?></div>
                        <div style="margin-top:0.7rem;">
                            <?php foreach (explode(',', $p['skills']) as $sk): if ($sk): ?>
                                <span class="view-header-keyword">#<?php echo htmlspecialchars($sk); ?></span>
                            <?php endif; endforeach; ?>
                        </div>
                    </div>
                </div>
            </a>
            <?php endforeach; ?>
        </div>
    </section>
    
    <?php include 'includes/footer.php'; ?>
    <a href="pages/create_portfolio.php" class="fab-btn" title="포트폴리오 작성">
        <span>+</span>
    </a>
    
    <script>
    const searchTitle = document.getElementById('searchTitle');
    const searchSkillList = document.getElementById('searchSkillList');
    const portfolioCardGrid = document.getElementById('portfolioCardGrid');
    const cards = Array.from(document.querySelectorAll('.portfolio-card-item'));
    
    // 기술 스택 체크박스 스타일 업데이트
    searchSkillList.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.closest('.search-skill-item');
            if (this.checked) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
            filterPortfolios();
        });
    });
    
    function filterPortfolios() {
        const titleVal = searchTitle.value.trim().toLowerCase();
        const checkedSkills = Array.from(searchSkillList.querySelectorAll('input[type=checkbox]:checked')).map(cb=>cb.value);
        
        cards.forEach(card => {
            const cardTitle = card.getAttribute('data-title').toLowerCase();
            const cardSkills = card.getAttribute('data-skills') ? card.getAttribute('data-skills').split(',') : [];
            
            const titleMatch = !titleVal || cardTitle.includes(titleVal);
            const skillMatch = checkedSkills.length === 0 || checkedSkills.every(sk => cardSkills.includes(sk));
            
            card.style.display = (titleMatch && skillMatch) ? '' : 'none';
        });
    }
    
    searchTitle.addEventListener('input', filterPortfolios);

    function renderSkills() {
        skillList.innerHTML = '';
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
        });
        // 기존 hidden input을 모두 제거 후, 선택된 스킬마다 새로운 input을 추가
        // 반드시 form 안에 skillsHidden가 한 번만 있어야 함!
        skillsHidden.parentNode.querySelectorAll("input[name='skills[]']").forEach(e => e.remove());
        skills.forEach(s => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'skills[]';
            input.value = s.id;
            skillsHidden.parentNode.appendChild(input);
        });
    }
    </script>
</body>
</html> 