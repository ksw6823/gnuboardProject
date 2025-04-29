<?php
require_once 'config/database.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $content = $_POST['content'];
    $user_id = $_SESSION['user_id'];
    $image_path = null;

    // 이미지 업로드 처리
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['image'];
        $filename = uniqid() . '_' . $file['name'];
        $destination = $upload_dir . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $image_path = $filename;
        }
    }

    // 게시물 저장
    $stmt = $pdo->prepare("INSERT INTO posts (user_id, content, image_path) VALUES (?, ?, ?)");
    $stmt->execute([$user_id, $content, $image_path]);

    header('Location: index.php');
    exit();
}
?> 