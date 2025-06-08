import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import customAxios from '../../api/axios';
import { FaCode, FaUser, FaTag, FaSortAmountDown } from 'react-icons/fa';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import PortfolioList from './PortfolioList';
import Pagination from '../Common/Pagination';

interface Skill {
  id: number;
  name: string;
}

interface PortfolioSection {
  portfolioSkills?: { skill?: { name: string } }[];
  portfolioKeywords?: { keyword?: { name: string } }[];
  portfolioJob?: { job?: { name: string } }[];
}

interface Portfolio {
  id: number;
  title: string;
  intro: string;
  likes_count: number;
  created_at: string;
  views?: number;
  user: {
    name: string;
    role: string;
    profileImage?: string;
  };
  sections?: PortfolioSection[];
  // 백엔드에서 제공하는 최상위 레벨 데이터
  portfolioSkills?: Array<{ name: string }>;
  portfolioKeywords?: Array<{ name: string }>;
  portfolioJob?: Array<{ name: string }>;
}

type FilterType = '직무' | '기술스택' | '키워드' | '정렬기준';

interface FilterState {
  직무: string;
  기술스택: string;
  키워드: string;
  정렬기준: string;
}

interface FilterOptions {
  직무: string[];
  기술스택: string[];
  키워드: string[];
  정렬기준: string[];
}

const MainContainer = styled.div`
  min-height: 100vh;
  background: rgb(255, 255, 255);
`;

const BlueBgBox = styled.div`
  position: absolute;
  top: 64px; /* 헤더 높이만큼, 필요시 조정 */
  left: 0;
  width: 100%;
  height: 260px;
  background: linear-gradient(180deg, #e3f0ff 0%, #c9e0ff 100%);
  z-index: 0;
`;

const SearchFilterWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 1.2rem auto 0 auto;
  padding: 1.2rem 1.5rem 1.1rem 1.5rem;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SearchBar = styled.div`
  width: 100%;
  max-width: 400px;
  align-self: flex-end;
  position: relative;
  background: #F5F6FA;
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  margin-bottom: 0.5rem;

  input {
    width: 100%;
    padding: 0.7rem 2.5rem 0.7rem 1.2rem;
    border: none;
    font-size: 1.1rem;
    background: transparent;
    &:focus { outline: none; }
    &::placeholder { color: #ADB5BD; }
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1.2rem;
  width: 100%;
  justify-content: flex-start;
`;

const FilterSelect = styled.div`
  position: relative;
  min-width: 150px;
  flex: 1;
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 1rem 1.2rem;
  background: #F8F9FA;
  border: 1.5px solid #E9ECEF;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 1rem;
  color: #495057;
  font-weight: 500;
  transition: background 0.15s, border 0.15s;

  &:hover {
    background: #E7F5FF;
    border-color: #4B89DC;
  }

  svg {
    width: 18px;
    height: 18px;
    margin-left: 0.5rem;
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: white;
  border: 1.5px solid #E9ECEF;
  border-radius: 10px;
  margin-top: 0.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.13);
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1000;
  max-height: 320px;
  overflow-y: auto;
`;

const MenuItem = styled.div<{ $isSelected: boolean }>`
  padding: 1rem 1.2rem;
  cursor: pointer;
  font-size: 1rem;
  color: ${props => props.$isSelected ? '#4B89DC' : '#495057'};
  background: ${props => props.$isSelected ? '#E7F5FF' : 'transparent'};
  font-weight: 500;

  &:hover {
    background: #F1F3F5;
  }
`;

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
);



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

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: #868E96;
  font-size: 1.1rem;
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #ADB5BD;
`;

// 아이콘 타입 단언 (react-icons v5 대응)
const FaCodeIcon = FaCode as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const PortfolioMain: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 각 필터의 열림/닫힘 상태
  const [openFilter, setOpenFilter] = useState<FilterType | null>(null);
  
  // 각 카테고리별 선택된 값
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    직무: '',
    기술스택: '',
    키워드: '',
    정렬기준: ''
  });


  const [jobs, setJobs] = useState<{ id: number; name: string }[]>([]);
  const [keywords, setKeywords] = useState<{ id: number; name: string }[]>([]);

  // 필터링된 포트폴리오 목록
  const filteredPortfolios = portfolios.filter(portfolio => {
    const matchesSearch = searchQuery === '' || 
      portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portfolio.intro.toLowerCase().includes(searchQuery.toLowerCase());

    // 백엔드에서 제공하는 최상위 레벨 데이터 사용
    const matchesJob =
      !selectedFilters.직무 ||
      portfolio.portfolioJob?.some((job: any) => job.name === selectedFilters.직무);

    const matchesTech =
      !selectedFilters.기술스택 ||
      portfolio.portfolioSkills?.some((skill: any) => skill.name === selectedFilters.기술스택);

    const matchesKeyword =
      !selectedFilters.키워드 ||
      portfolio.portfolioKeywords?.some((keyword: any) => keyword.name === selectedFilters.키워드);

    return matchesSearch && matchesJob && matchesTech && matchesKeyword;
  });

  // 정렬 적용
  const sortedPortfolios = [...filteredPortfolios].sort((a, b) => {
    switch (selectedFilters.정렬기준) {
      case '인기순':
        return b.likes_count - a.likes_count;
      case '최신순':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case '조회순':
        return (b.views || 0) - (a.views || 0);
      default:
        return 0;
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(sortedPortfolios.length / itemsPerPage);
  const pagedPortfolios = sortedPortfolios.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await customAxios.get('/portfolios', { headers });
        setPortfolios(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [jobsRes, skillsRes, keywordsRes] = await Promise.all([
          customAxios.get('/jobs'),
          customAxios.get('/skills'),
          customAxios.get('/keywords'),
        ]);
        setJobs(jobsRes.data);
        setSkills(skillsRes.data);
        setKeywords(keywordsRes.data);
      } catch (e) {
        // 에러 핸들링 (필요시)
      }
    };
    fetchOptions();
  }, []);

  // 필터 옵션
  const filterOptions: FilterOptions = useMemo(() => ({
    직무: Array.isArray(jobs) ? jobs.map(j => j.name) : [],
    기술스택: Array.isArray(skills) ? skills.map(s => s.name) : [],
    키워드: Array.isArray(keywords) ? keywords.map(k => k.name) : [],
    정렬기준: ['최신순', '인기순', '조회순'],
  }), [jobs, skills, keywords]);

  const handleFilterClick = (filterType: FilterType) => {
    setOpenFilter(openFilter === filterType ? null : filterType);
  };

  const handleOptionSelect = (filterType: FilterType, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === option ? '' : option
    }));
  };

  // 필터별 아이콘 컴포넌트 매핑
  const filterIconComponents: Record<string, any> = {
    '직무': FaUser,
    '기술스택': FaCodeIcon,
    '키워드': FaTag,
    '정렬기준': FaSortAmountDown,
  };

  return (
    <>
      <Header />
      <BlueBgBox />
      <MainContainer>
        {!isLoggedIn ? (
          <NoResults style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
            로그인 후 포트폴리오를 볼 수 있습니다.
          </NoResults>
        ) : (
          <>
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
                    <DropdownMenu $isOpen={openFilter === filterType as FilterType}>
                      {Array.isArray(filterOptions[filterType as FilterType])
                        ? filterOptions[filterType as FilterType].map(option => (
                            <MenuItem
                              key={option}
                              $isSelected={selectedFilters[filterType as FilterType] === option}
                              onClick={() => handleOptionSelect(filterType as FilterType, option)}
                            >
                              {option}
                            </MenuItem>
                          ))
                        : null}
                    </DropdownMenu>
                  </FilterSelect>
                ))}
              </FilterRow>
            </SearchFilterWrapper>

            <PortfolioList portfolios={pagedPortfolios} onCardClick={id => navigate(`/portfolios/${id}`)} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={page => setCurrentPage(page)}
            />

            <CreateButton to="#" onClick={e => { e.preventDefault(); navigate('/portfolio/create'); }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              포트폴리오 작성
            </CreateButton>
          </>
        )}
      </MainContainer>
      <Footer />
    </>
  );
};

export default PortfolioMain;