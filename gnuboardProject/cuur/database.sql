CREATE DATABASE IF NOT EXISTS sns_db;
USE sns_db;

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    profile_image VARCHAR(255) DEFAULT 'default.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 게시물 테이블
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE portfolios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100),           -- 포트폴리오 제목(예: 웹 개발자 포트폴리오)
    summary TEXT,                 -- 한줄 소개
    photo VARCHAR(255),           -- 이력서/프로필 사진 경로
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE keywords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE portfolio_keywords (
    portfolio_id INT NOT NULL,
    keyword_id INT NOT NULL,
    PRIMARY KEY (portfolio_id, keyword_id),
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    FOREIGN KEY (keyword_id) REFERENCES keywords(id) ON DELETE CASCADE
);

CREATE TABLE portfolio_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id INT NOT NULL,
    type VARCHAR(50),         -- 예: '기본정보', '기술스택', '수행경험', '이력', '자격증', '자기소개서', '언어' 등
    content JSON,             -- 실제 입력 내용(자유롭게 구조화 가능)
    sort_order INT DEFAULT 0, -- 순서
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (post_id, user_id)
);

CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE portfolio_skills (
    portfolio_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (portfolio_id, skill_id),
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 기술 스택 데이터 추가
INSERT INTO skills (name) VALUES 
('HTML'), ('CSS'), ('JavaScript'), ('TypeScript'), ('React'), ('Vue.js'), ('Angular'),
('Node.js'), ('Express'), ('Django'), ('Spring'), ('PHP'), ('Laravel'),
('MySQL'), ('PostgreSQL'), ('MongoDB'), ('Redis'),
('AWS'), ('Azure'), ('GCP'), ('Docker'), ('Kubernetes'),
('Git'), ('GitHub'), ('GitLab'), ('Jira'), ('Figma'),
('Python'), ('Java'), ('C#'), ('C++'), ('Go'), ('Ruby'),
('Android'), ('iOS'), ('Flutter'), ('React Native'),
('TensorFlow'), ('PyTorch'), ('OpenCV'), ('Unity'), ('Unreal Engine'); 