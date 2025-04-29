<?php
require_once 'config/database.php';

// 로그인 상태 확인
$is_logged_in = isset($_SESSION['user_id']);
$user_id = $is_logged_in ? $_SESSION['user_id'] : null;
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SNS 웹페이지</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .post-image {
            max-width: 100%;
            height: auto;
        }
        .profile-image {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="index.php">SNS</a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="index.php">홈</a>
                    </li>
                    <?php if($is_logged_in): ?>
                        <li class="nav-item">
                            <a class="nav-link" href="profile.php">프로필</a>
                        </li>
                    <?php endif; ?>
                </ul>
                <?php if($is_logged_in): ?>
                    <div class="d-flex align-items-center">
                        <img src="uploads/<?php echo $_SESSION['profile_image']; ?>" class="profile-image me-2" alt="프로필">
                        <a href="logout.php" class="btn btn-outline-light">로그아웃</a>
                    </div>
                <?php else: ?>
                    <a href="login.php" class="btn btn-outline-light me-2">로그인</a>
                    <a href="register.php" class="btn btn-light">회원가입</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <?php if($is_logged_in): ?>
            <!-- 게시물 작성 폼 -->
            <div class="card mb-4">
                <div class="card-body">
                    <form action="create_post.php" method="POST" enctype="multipart/form-data">
                        <div class="mb-3">
                            <textarea class="form-control" name="content" rows="3" placeholder="무슨 생각을 하고 계신가요?"></textarea>
                        </div>
                        <div class="mb-3">
                            <input type="file" class="form-control" name="image">
                        </div>
                        <button type="submit" class="btn btn-primary">게시하기</button>
                    </form>
                </div>
            </div>

            <!-- 게시물 목록 -->
            <?php
            $stmt = $pdo->prepare("
                SELECT p.*, u.username, u.profile_image 
                FROM posts p 
                JOIN users u ON p.user_id = u.id 
                ORDER BY p.created_at DESC
            ");
            $stmt->execute();
            $posts = $stmt->fetchAll();

            foreach($posts as $post):
            ?>
                <div class="card mb-4">
                    <div class="card-header d-flex align-items-center">
                        <img src="uploads/<?php echo $post['profile_image']; ?>" class="profile-image me-2" alt="프로필">
                        <div>
                            <h6 class="mb-0"><?php echo htmlspecialchars($post['username']); ?></h6>
                            <small class="text-muted"><?php echo $post['created_at']; ?></small>
                        </div>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><?php echo nl2br(htmlspecialchars($post['content'])); ?></p>
                        <?php if($post['image_path']): ?>
                            <img src="uploads/<?php echo $post['image_path']; ?>" class="post-image mb-3" alt="게시물 이미지">
                        <?php endif; ?>
                        
                        <!-- 댓글 작성 폼 -->
                        <form action="create_comment.php" method="POST" class="mb-3">
                            <input type="hidden" name="post_id" value="<?php echo $post['id']; ?>">
                            <div class="input-group">
                                <input type="text" class="form-control" name="content" placeholder="댓글을 입력하세요">
                                <button class="btn btn-outline-primary" type="submit">작성</button>
                            </div>
                        </form>

                        <!-- 댓글 목록 -->
                        <?php
                        $stmt = $pdo->prepare("
                            SELECT c.*, u.username, u.profile_image 
                            FROM comments c 
                            JOIN users u ON c.user_id = u.id 
                            WHERE c.post_id = ? 
                            ORDER BY c.created_at DESC
                        ");
                        $stmt->execute([$post['id']]);
                        $comments = $stmt->fetchAll();

                        foreach($comments as $comment):
                        ?>
                            <div class="d-flex mb-2">
                                <img src="uploads/<?php echo $comment['profile_image']; ?>" class="profile-image me-2" alt="프로필">
                                <div>
                                    <h6 class="mb-0"><?php echo htmlspecialchars($comment['username']); ?></h6>
                                    <p class="mb-0"><?php echo htmlspecialchars($comment['content']); ?></p>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="text-center mt-5">
                <h1>환영합니다!</h1>
                <p>로그인하여 SNS를 시작하세요.</p>
                <a href="login.php" class="btn btn-primary">로그인</a>
                <a href="register.php" class="btn btn-outline-primary">회원가입</a>
            </div>
        <?php endif; ?>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 