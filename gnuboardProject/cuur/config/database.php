<?php
$host = 'localhost';
$dbname = 'sns_db';
$username = 'root';
$password = '1234';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "데이터베이스 연결 실패: " . $e->getMessage();
    die();
}

// 세션 시작 (이미 시작되지 않은 경우에만)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 파일 업로드 관련 상수
define('UPLOAD_DIR', '../uploads/');
define('USER_UPLOAD_DIR', UPLOAD_DIR . 'users/');
define('PORTFOLIO_UPLOAD_DIR', 'portfolios/');

// 사용자 업로드 디렉토리 생성 함수
function createUserUploadDir($username) {
    $userDir = USER_UPLOAD_DIR . $username;
    if (!file_exists($userDir)) {
        if (!mkdir($userDir, 0777, true)) {
            throw new Exception('사용자 디렉토리 생성에 실패했습니다.');
        }
    }
    
    // portfolios 폴더 생성
    $portfoliosDir = $userDir . '/' . PORTFOLIO_UPLOAD_DIR;
    if (!file_exists($portfoliosDir)) {
        if (!mkdir($portfoliosDir, 0777, true)) {
            throw new Exception('포트폴리오 디렉토리 생성에 실패했습니다.');
        }
    }
    
    return $userDir;
}

// 포트폴리오 업로드 디렉토리 생성 함수
function createPortfolioUploadDir($username, $portfolioId) {
    $portfolioDir = USER_UPLOAD_DIR . $username . '/' . PORTFOLIO_UPLOAD_DIR . $portfolioId;
    if (!file_exists($portfolioDir)) {
        if (!mkdir($portfolioDir, 0777, true)) {
            throw new Exception('포트폴리오 디렉토리 생성에 실패했습니다.');
        }
    }
    return $portfolioDir;
}
?> 