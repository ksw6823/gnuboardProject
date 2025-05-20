# SNS 웹페이지

간단한 SNS 웹페이지 프로젝트입니다.

## 기능
- 회원가입/로그인
- 게시물 작성 및 조회
- 댓글 작성
- 좋아요 기능

## 설치 방법
1. XAMPP 설치 (https://www.apachefriends.org/download.html)
2. 프로젝트 파일을 `C:\xampp\htdocs\sns` 폴더에 복사
3. phpMyAdmin에서 `sns_db` 데이터베이스 생성
4. `database.sql` 파일의 내용을 실행하여 테이블 생성
5. 웹 브라우저에서 `http://localhost/sns` 접속

## 데이터베이스 설정
`config/database.php` 파일에서 다음 정보를 확인/수정하세요:
```php
$host = 'localhost';
$dbname = 'sns_db';
$username = 'root';
$password = '';
```

## 사용 기술
- PHP
- MySQL
- Bootstrap 5 