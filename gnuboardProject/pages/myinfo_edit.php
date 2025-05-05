<?php
// session_start();
require_once '../cuur/config/database.php';

// 로그인 체크
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$user_id = $_SESSION['user_id'];

// 정보 수정 처리
$success = false;
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    try {
        // 이메일 중복 체크
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
        $stmt->execute([$email, $user_id]);
        if ($stmt->fetch()) {
            $error = '이미 사용 중인 이메일입니다.';
        } else {
            if ($password) {
                $hashed = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare('UPDATE users SET name=?, email=?, password=? WHERE id=?');
                $stmt->execute([$name, $email, $hashed, $user_id]);
            } else {
                $stmt = $pdo->prepare('UPDATE users SET name=?, email=? WHERE id=?');
                $stmt->execute([$name, $email, $user_id]);
            }
            $success = true;
        }
    } catch (PDOException $e) {
        $error = '정보 수정 중 오류가 발생했습니다.';
    }
}
// 현재 정보 불러오기
$stmt = $pdo->prepare('SELECT username, name, email FROM users WHERE id = ?');
$stmt->execute([$user_id]);
$user = $stmt->fetch();
if (!$user) {
    session_destroy();
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>내 정보 수정</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .edit-main { max-width: 500px; margin: 0 auto; padding-top: 120px; padding-bottom: 80px; }
        .edit-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; text-align: center; }
        .edit-form label { font-weight: 600; margin-bottom: 0.3rem; display: block; }
        .edit-form input { width: 100%; padding: 0.7rem; margin-bottom: 1.2rem; border-radius: 8px; border: 1px solid #ccc; font-size: 1rem; }
        .edit-form button { width: 100%; padding: 0.8rem; border-radius: 8px; background: #007bff; color: #fff; font-weight: 600; border: none; font-size: 1.05rem; transition: background 0.2s; }
        .edit-form button:hover { background: #0056b3; }
        .edit-form .edit-info { color: #888; font-size: 0.95rem; margin-bottom: 1.2rem; }
        .edit-form .error { color: #dc3545; margin-bottom: 1rem; }
        .edit-form .success { color: #198754; margin-bottom: 1rem; }
    </style>
</head>
<body>
<?php include '../includes/header.php'; ?>
<main class="edit-main">
    <div class="edit-title">내 정보 수정</div>
    <form method="post" class="edit-form">
        <?php if ($error): ?><div class="error"><?php echo $error; ?></div><?php endif; ?>
        <?php if ($success): ?><div class="success">정보가 성공적으로 수정되었습니다.</div><?php endif; ?>
        <label>아이디</label>
        <input type="text" value="<?php echo htmlspecialchars($user['username']); ?>" disabled>
        <label for="name">이름</label>
        <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($user['name']); ?>" required>
        <label for="email">이메일</label>
        <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required>
        <div class="edit-info">비밀번호를 변경하려면 새 비밀번호를 입력하세요.<br>비워두면 기존 비밀번호가 유지됩니다.</div>
        <label for="password">새 비밀번호</label>
        <input type="password" id="password" name="password" autocomplete="new-password">
        <button type="submit">수정하기</button>
    </form>
</main>
<?php include '../includes/footer.php'; ?>
</body>
</html> 