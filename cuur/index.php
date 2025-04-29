<?php
session_start();
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SNS 웹페이지</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="index.php">SNS</a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="feed.php">피드</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="profile.php">프로필</a>
                    </li>
                </ul>
                <?php if(isset($_SESSION['user_id'])): ?>
                    <a href="logout.php" class="btn btn-outline-light">로그아웃</a>
                <?php else: ?>
                    <a href="login.php" class="btn btn-outline-light me-2">로그인</a>
                    <a href="register.php" class="btn btn-light">회원가입</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <h1>환영합니다!</h1>
        <p>이곳은 SNS 웹페이지입니다.</p>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 