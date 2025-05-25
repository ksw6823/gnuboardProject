import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import customAxios from '../../api/axios';
import axios, { AxiosError } from 'axios';
import * as FaIcons from 'react-icons/fa';

interface Skill {
  id: number;
  name: string;
}

interface Portfolio {
  id: number;
  title: string;
  summary: string;
  photo?: string;
  likes_count: number;
  created_at: string;
  user: {
    name: string;
    role: string;
  };
  skills: Skill[];
}

type FilterType = '직무' | '기술스택' | '커리어' | '정렬기준';

interface FilterState {
  직무: string;
  기술스택: string;
  커리어: string;
  정렬기준: string;
}

interface FilterOptions {
  직무: string[];
  기술스택: string[];
  커리어: string[];
  정렬기준: string[];
}

const MainContainer = styled.div`
  min-height: 100vh;
  background: #e3f0ff;
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
`;

const HeaderUserName = styled.span`
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const SearchFilterWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 2rem auto 0 auto;
  padding: 2.5rem 3rem 2rem 3rem;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const SearchBar = styled.div`
  width: 100%;
  max-width: 340px;
  align-self: flex-end;
  position: relative;
  background: #F5F6FA;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0.7rem 1.2rem;
  margin-bottom: 0.5rem;

  input {
    width: 100%;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    border: none;
    font-size: 1.05rem;
    background: transparent;
    &:focus { outline: none; }
    &::placeholder { color: #ADB5BD; }
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1.1rem;
  width: 100%;
  justify-content: flex-start;
`;

const FilterSelect = styled.div`
  position: relative;
  min-width: 140px;
  flex: 1;
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #ADB5BD;
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;

  &:hover {
    background: #F8F9FA;
  }

  svg {
    width: 16px;
    height: 16px;
    margin-left: 0.5rem;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  margin-top: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
`;

const MenuItem = styled.div<{ isSelected: boolean }>`
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: ${props => props.isSelected ? '#4B89DC' : '#495057'};
  background: ${props => props.isSelected ? '#E7F5FF' : 'transparent'};

  &:hover {
    background: ${props => props.isSelected ? '#E7F5FF' : '#F8F9FA'};
  }
`;

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  max-width: 1300px;
  margin: 2.5rem auto;
  padding: 0 2rem;
`;

const PortfolioCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 220px;
  aspect-ratio: 4/3;
  padding: 1.7rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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

const CardUserName = styled.span`
  font-weight: 500;
  color: #212529;
`;

const CreateButton = styled(Link)`
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  background: #4B89DC;
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #3B79CC;
    transform: translateY(-2px);
    transition: all 0.2s;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-top: 1px solid #F1F3F5;
`;

const LikeButton = styled.button<{ isLiked: boolean }>`
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.isLiked ? '#FF6B6B' : '#ADB5BD'};
  
  &:hover {
    color: #FF6B6B;
  }
`;

const LikeCount = styled.span`
  font-size: 0.9rem;
  color: #495057;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: #868E96;
  font-size: 1.1rem;
`;

const HeartIcon = styled.div`
  color: inherit;
  svg {
    width: 1.2em;
    height: 1.2em;
  }
`;

const EmptyHeartIcon = styled.div`
  color: inherit;
  svg {
    width: 1.2em;
    height: 1.2em;
  }
`;

const CardInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
  font-size: 0.92rem;
  margin-top: 0.7rem;
`;

const CodeIcon = FaIcons.FaCode;
const TagIcon = FaIcons.FaTag;

const PortfolioList: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 각 필터의 열림/닫힘 상태
  const [openFilter, setOpenFilter] = useState<FilterType | null>(null);
  
  // 각 카테고리별 선택된 값
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    직무: '',
    기술스택: '',
    커리어: '',
    정렬기준: ''
  });

  const [likedPortfolios, setLikedPortfolios] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 포트폴리오 목록 가져오기
        const portfoliosResponse = await customAxios.get('/portfolios', { headers });
        setPortfolios(portfoliosResponse.data);

        // 기술 스택 목록 가져오기
        const skillsResponse = await customAxios.get('/skills', { headers });
        setSkills(skillsResponse.data);

        // 로그인 상태 확인
        if (token) {
          const userResponse = await customAxios.get('/users/me', { headers });
          setIsLoggedIn(true);
          setUser(userResponse.data);

          // 좋아요 상태 가져오기
          const likedPortfoliosResponse = await customAxios.get('/users/me/likes', { headers });
          setLikedPortfolios(likedPortfoliosResponse.data.map((like: any) => like.portfolioId));
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setUser(null);
          }
        }
      }
    };

    fetchData();

    // 클릭 이벤트 리스너 추가
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.filter-select')) {
        setOpenFilter(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const filterOptions: FilterOptions = {
    직무: ['프론트엔드', '백엔드', '풀스택', 'DevOps', '데이터 엔지니어'],
    기술스택: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Node.js', 'Python', 'Java'],
    커리어: ['신입', '1-3년', '4-6년', '7년 이상'],
    정렬기준: ['최신순', '인기순', '조회순']
  };

  const handleFilterClick = (filterType: FilterType) => {
    setOpenFilter(openFilter === filterType ? null : filterType);
  };

  const handleOptionSelect = (filterType: FilterType, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === option ? '' : option
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const handleLike = async (portfolioId: number) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await customAxios.post(`/portfolios/${portfolioId}/likes`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 좋아요 상태 업데이트
      setLikedPortfolios(prev => 
        prev.includes(portfolioId)
          ? prev.filter(id => id !== portfolioId)
          : [...prev, portfolioId]
      );

      // 포트폴리오 목록 업데이트
      setPortfolios(prev =>
        prev.map(portfolio =>
          portfolio.id === portfolioId
            ? {
                ...portfolio,
                likes_count: likedPortfolios.includes(portfolioId)
                  ? portfolio.likes_count - 1
                  : portfolio.likes_count + 1
              }
            : portfolio
        )
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('좋아요 처리 중 오류 발생:', error.response?.data || error.message);
      } else {
        console.error('좋아요 처리 중 알 수 없는 오류 발생');
      }
    }
  };

  // 필터링된 포트폴리오 목록
  const filteredPortfolios = portfolios.filter(portfolio => {
    const matchesSearch = searchQuery === '' || 
      portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portfolio.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJob = !selectedFilters.직무 || portfolio.user.role === selectedFilters.직무;
    
    const matchesTech = !selectedFilters.기술스택 || 
      portfolio.skills.some(skill => skill.name === selectedFilters.기술스택);

    const matchesCareer = !selectedFilters.커리어 || portfolio.user.role.includes(selectedFilters.커리어);

    return matchesSearch && matchesJob && matchesTech && matchesCareer;
  });

  // 정렬 적용
  const sortedPortfolios = [...filteredPortfolios].sort((a, b) => {
    switch (selectedFilters.정렬기준) {
      case '인기순':
        return b.likes_count - a.likes_count;
      case '최신순':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  // 필터별 아이콘 컴포넌트 매핑
  const filterIconComponents: Record<string, any> = {
    '직무': FaIcons.FaUser,
    '기술스택': FaIcons.FaCode,
    '커리어': FaIcons.FaBriefcase,
    '정렬기준': FaIcons.FaSortAmountDown,
  };

  return (
    <MainContainer>
      <Header>
        <Logo>PortFlow</Logo>
        <HeaderNav>
          {isLoggedIn && user ? (
            <UserInfo>
              <HeaderUserName>{user.name}님</HeaderUserName>
              <HeaderLink to="/my-portfolio">내 포트폴리오</HeaderLink>
              <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
            </UserInfo>
          ) : (
            <>
              <HeaderLink to="/login">로그인</HeaderLink>
              <HeaderLink to="/register">회원가입</HeaderLink>
            </>
          )}
        </HeaderNav>
      </Header>

      <SearchFilterWrapper>
        <SearchBar>
          <input
            type="text"
            placeholder="포트폴리오 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchIcon>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 15L11 11M7 13C3.686 13 1 10.314 1 7C1 3.686 3.686 1 7 1C10.314 1 13 3.686 13 7C13 10.314 10.314 13 7 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SearchIcon>
        </SearchBar>
        <FilterRow>
          {Object.keys(filterOptions).map(filterType => (
            <FilterSelect key={filterType} className="filter-select">
              <SelectButton onClick={() => handleFilterClick(filterType as FilterType)}>
                {(() => {
                  const IconComp = filterIconComponents[filterType];
                  return IconComp ? <IconComp style={{ marginRight: '0.5em' }} /> : null;
                })()}
                {selectedFilters[filterType as FilterType] || filterType}
                <ChevronIcon />
              </SelectButton>
              <DropdownMenu isOpen={openFilter === filterType as FilterType}>
                {filterOptions[filterType as FilterType].map(option => (
                  <MenuItem
                    key={option}
                    isSelected={selectedFilters[filterType as FilterType] === option}
                    onClick={() => handleOptionSelect(filterType as FilterType, option)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </DropdownMenu>
            </FilterSelect>
          ))}
        </FilterRow>
      </SearchFilterWrapper>

      <PortfolioGrid>
        {sortedPortfolios.length > 0 ? (
          sortedPortfolios.map(portfolio => (
            <PortfolioCard key={portfolio.id}>
              <CardHeader>
                <CardUserName>{portfolio.user.name}</CardUserName>
                <UserRole>{portfolio.user.role}</UserRole>
              </CardHeader>
              <CardContent>
                <CardDescription>{portfolio.summary}</CardDescription>
                <CardInfoRow>
                  {React.createElement(FaIcons.FaCode as any, { style: { marginRight: 6 } })}
                  {portfolio.skills.map(skill => skill.name).join(', ')}
                </CardInfoRow>
                <CardInfoRow>
                  {React.createElement(FaIcons.FaTag as any, { style: { marginRight: 6 } })}
                  {portfolio.skills.map(skill => `#${skill.name}`).join(' ')}
                </CardInfoRow>
              </CardContent>
            </PortfolioCard>
          ))
        ) : (
          <NoResults>
            검색 결과가 없습니다.
          </NoResults>
        )}
      </PortfolioGrid>

      {isLoggedIn && (
        <CreateButton to="/portfolio/create">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          포트폴리오 작성
        </CreateButton>
      )}
    </MainContainer>
  );
};

export default PortfolioList; 