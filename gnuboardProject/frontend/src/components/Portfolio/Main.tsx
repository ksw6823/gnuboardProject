import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const MainContainer = styled.div`
  min-height: 100vh;
  background: #F0F2F5;
`;

const Header = styled.header`
  background: #4B89DC;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: white;
  font-size: 1.5rem;
  margin: 0;
`;

const HeaderNav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const HeaderLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
`;

const SearchSection = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 0.75rem;

  input {
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 2rem;
    border: none;
    font-size: 0.9rem;
    background: transparent;
    
    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #ADB5BD;
    }
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: #ADB5BD;
`;

const FilterSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const FilterCategory = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryTitle = styled.h3`
  font-size: 1rem;
  color: #495057;
  margin: 0 0 1rem 0;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  font-size: 0.9rem;
  color: #495057;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: 0;
    cursor: pointer;
  }

  &:hover {
    color: #4B89DC;
  }
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const PortfolioCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #F8F9FA;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #212529;
`;

const UserRole = styled.span`
  color: #868E96;
  font-size: 0.8rem;
  margin-left: auto;
`;

const CardImage = styled.div`
  aspect-ratio: 16/9;
  background: #F8F9FA;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const CardDescription = styled.p`
  margin: 0;
  color: #495057;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const CardTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding: 0.5rem 1rem 1rem;
  border-top: 1px solid #F1F3F5;
`;

const CardTag = styled.span`
  background: #E7F5FF;
  color: #4B89DC;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
`;

const Main: React.FC = () => {
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

  const technologies = {
    프론트엔드: ['Angular', 'React', 'Vue.js', 'TypeScript', 'JavaScript'],
    백엔드: ['Django', 'Spring Boot', 'Node.js', 'NestJS', 'Flask', 'Python'],
    데이터베이스: ['MongoDB', 'MySQL', 'PostgreSQL'],
    도구: ['Docker', 'Git', 'AWS']
  };

  const handleTechChange = (tech: string) => {
    setSelectedTechs(prev => 
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  return (
    <MainContainer>
      <Header>
        <Logo>PortFlow</Logo>
        <HeaderNav>
          <HeaderLink to="/login">회원입니다!</HeaderLink>
          <HeaderLink to="/register">로그인</HeaderLink>
          <HeaderLink to="/register">회원가입</HeaderLink>
        </HeaderNav>
      </Header>

      <SearchSection>
        <SearchBar>
          <SearchIcon>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 15L11 11M7 13C3.686 13 1 10.314 1 7C1 3.686 3.686 1 7 1C10.314 1 13 3.686 13 7C13 10.314 10.314 13 7 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SearchIcon>
          <input type="text" placeholder="관심있는 분야나 기술을 검색해보세요" />
        </SearchBar>

        <FilterSection>
          {Object.entries(technologies).map(([category, techs]) => (
            <FilterCategory key={category}>
              <CategoryTitle>{category}</CategoryTitle>
              <FilterGroup>
                {techs.map(tech => (
                  <FilterLabel key={tech}>
                    <input
                      type="checkbox"
                      checked={selectedTechs.includes(tech)}
                      onChange={() => handleTechChange(tech)}
                    />
                    {tech}
                  </FilterLabel>
                ))}
              </FilterGroup>
            </FilterCategory>
          ))}
        </FilterSection>
      </SearchSection>

      <PortfolioGrid>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <PortfolioCard key={i}>
            <CardHeader>
              <UserAvatar />
              <UserName>남도일</UserName>
              <UserRole>프론트엔드 개발자</UserRole>
            </CardHeader>
            <CardImage>
              <img src={`https://picsum.photos/500/300?random=${i}`} alt="프로젝트 이미지" />
            </CardImage>
            <CardContent>
              <CardDescription>
                남구청에서 남부 산업단지 소공인과 지원사업을 통해 제품을 만들어 판매하는 플랫폼을 만들었습니다.
              </CardDescription>
            </CardContent>
            <CardTags>
              <CardTag>JavaScript</CardTag>
              <CardTag>HTML/CSS</CardTag>
              <CardTag>C++</CardTag>
            </CardTags>
          </PortfolioCard>
        ))}
      </PortfolioGrid>
    </MainContainer>
  );
};

export default Main; 