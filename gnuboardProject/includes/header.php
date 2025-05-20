<?php
// session_start() 제거 - database.php에서 처리됨
?>
<header class="main-header">
    <nav class="nav-container">
        <div class="logo">
            <a href="/index.php">산학협력</a>
        </div>
        <ul class="nav-menu">
            <li><a href="/index.php">홈</a></li>
            <li><a href="/pages/projects.php">프로젝트</a></li>
            <?php if(isset($_SESSION['user_id'])): ?>
                <li><a href="/pages/mypage.php">마이페이지</a></li>
                <li><a href="/pages/logout.php">로그아웃</a></li>
            <?php else: ?>
                <li><a href="/pages/login.php">로그인</a></li>
            <?php endif; ?>
        </ul>
    </nav>
</header> 