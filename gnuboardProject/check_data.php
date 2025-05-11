<?php
require_once 'cuur/config/database.php';

echo "<h2>포트폴리오 데이터</h2>";
$stmt = $pdo->query('SELECT * FROM portfolios');
$portfolios = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "<pre>";
print_r($portfolios);
echo "</pre>";

echo "<h2>키워드 데이터</h2>";
$stmt = $pdo->query('SELECT * FROM keywords');
$keywords = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "<pre>";
print_r($keywords);
echo "</pre>";

echo "<h2>기술스택 데이터</h2>";
$stmt = $pdo->query('SELECT * FROM skills');
$skills = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "<pre>";
print_r($skills);
echo "</pre>";

echo "<h2>포트폴리오-키워드 연결 데이터</h2>";
$stmt = $pdo->query('SELECT pk.*, k.name as keyword_name, p.title as portfolio_title 
    FROM portfolio_keywords pk 
    JOIN keywords k ON pk.keyword_id = k.id 
    JOIN portfolios p ON pk.portfolio_id = p.id');
$portfolio_keywords = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "<pre>";
print_r($portfolio_keywords);
echo "</pre>";

echo "<h2>포트폴리오-기술스택 연결 데이터</h2>";
$stmt = $pdo->query('SELECT ps.*, s.name as skill_name, p.title as portfolio_title 
    FROM portfolio_skills ps 
    JOIN skills s ON ps.skill_id = s.id 
    JOIN portfolios p ON ps.portfolio_id = p.id');
$portfolio_skills = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "<pre>";
print_r($portfolio_skills);
echo "</pre>";

echo "<h2>포트폴리오 섹션 데이터</h2>";
$stmt = $pdo->query('SELECT ps.*, p.title as portfolio_title 
    FROM portfolio_sections ps 
    JOIN portfolios p ON ps.portfolio_id = p.id');
$portfolio_sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "<pre>";
print_r($portfolio_sections);
echo "</pre>";
?> 