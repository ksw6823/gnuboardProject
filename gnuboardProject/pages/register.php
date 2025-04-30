<?php
session_start();
require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $password_confirm = $_POST['password_confirm'];
    $email = $_POST['email'];
    $name = $_POST['name'];
    
    $errors = [];
    
    // 기본적인 유효성 검사
    if (empty($username)) {
        $errors[] = "아이디를 입력해주세요.";
    }
    if (empty($password)) {
        $errors[] = "비밀번호를 입력해주세요.";
    }
    if ($password !== $password_confirm) {
        $errors[] = "비밀번호가 일치하지 않습니다.";
    }
    if (empty($email)) {
        $errors[] = "이메일을 입력해주세요.";
    }
    if (empty($name)) {
        $errors[] = "이름을 입력해주세요.";
    }
    
    // 에러가 없으면 회원가입 처리
    if (empty($errors)) {
        try {
            // 아이디 중복 확인
            $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
            $stmt->execute([$username]);
            if ($stmt->fetch()) {
                $errors[] = "이미 사용 중인 아이디입니다.";
            } else {
                // 이메일 중복 확인
                $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
                $stmt->execute([$email]);
                if ($stmt->fetch()) {
                    $errors[] = "이미 사용 중인 이메일입니다.";
                } else {
                    // 비밀번호 해시화
                    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                    
                    // 사용자 정보 저장
                    $stmt = $pdo->prepare("INSERT INTO users (username, password, email, name) VALUES (?, ?, ?, ?)");
                    if ($stmt->execute([$username, $hashed_password, $email, $name])) {
                        $_SESSION['register_success'] = true;
                        header("Location: login.php");
                        exit();
                    } else {
                        $errors[] = "회원가입 중 오류가 발생했습니다.";
                    }
                }
            }
        } catch(PDOException $e) {
            $errors[] = "데이터베이스 오류가 발생했습니다.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원가입 - 산학협력 프로젝트</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .register-container {
            max-width: 500px;
            margin: 100px auto;
            padding: 2rem;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
        }
        .form-group input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .btn-register {
            width: 100%;
            padding: 0.75rem;
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 1rem;
        }
        .btn-register:hover {
            background: #0056b3;
        }
        .error-message {
            color: #dc3545;
            margin-bottom: 1rem;
        }
        .login-link {
            text-align: center;
            margin-top: 1rem;
        }
        .login-link a {
            color: #007bff;
            text-decoration: none;
        }
        .login-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <?php include '../includes/header.php'; ?>

    <div class="register-container">
        <h2>회원가입</h2>
        
        <?php if (!empty($errors)): ?>
            <div class="error-message">
                <?php foreach ($errors as $error): ?>
                    <p><?php echo $error; ?></p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label for="username">아이디</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="password">비밀번호</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <div class="form-group">
                <label for="password_confirm">비밀번호 확인</label>
                <input type="password" id="password_confirm" name="password_confirm" required>
            </div>
            
            <div class="form-group">
                <label for="email">이메일</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="name">이름</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <button type="submit" class="btn-register">회원가입</button>
        </form>
        
        <div class="login-link">
            이미 계정이 있으신가요? <a href="login.php">로그인하기</a>
        </div>
    </div>

    <?php include '../includes/footer.php'; ?>
</body>
</html> 