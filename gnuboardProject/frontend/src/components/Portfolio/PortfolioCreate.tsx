import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Bg = styled.div`
  min-height: 100vh;
  background: #f4f6fa;
  overflow-x: hidden;
`;

const TopBar = styled.div`
  width: 100vw;
  background: #90b8f8;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3.5rem 0 3.5rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 1.7rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -1px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const TopMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2.2rem;
`;

const TopBtnGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-right: 0;
`;

const TopUserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2.2rem;
  font-size: 1.18rem;
`;

const TopUserName = styled.span`
  font-weight: 500;
  color: #fff;
  font-size: 1.18rem;
`;

const TopLink = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.18rem;
  cursor: pointer;
  padding: 0 0.5rem;
  transition: color 0.15s;
  &:hover { color: #346bb3; }
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 2.5rem auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  margin-top: 56px;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 3.5rem;
  margin-bottom: 1.5rem;
  margin-left: 0;
`;

const ProfileDetail = styled.div`
  font-size: 1.45rem;
  color: #444;
  margin-bottom: 0.18rem;
`;

const ProfileImgInner = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileImg = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #adb5bd;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProfileName = styled.div`
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
`;

const ProfileEmail = styled.div`
  font-size: 1.2rem;
  color: #868e96;
`;

const SectionLabel = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #346bb3;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
`;

const BlueBar = styled.div`
  width: 7px;
  height: 32px;
  background: #4B89DC;
  display: inline-block;
  margin-right: 0.7rem;
  border-radius: 2px;
  vertical-align: middle;
`;

const TagRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
  margin-bottom: 1.5rem;
`;

const AddBtn = styled.button`
  background: #f4f6fa;
  color: #4B89DC;
  border: 1.5px solid #4B89DC;
  border-radius: 24px;
  padding: 0.5rem 2rem;
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: #e3eafc;
  }
`;

const TagInput = styled.input`
  width: 220px;
  padding: 0.7rem 1rem;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: #f8fafd;
`;

const Select = styled.select`
  width: 220px;
  padding: 0.7rem 1rem;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: #f8fafd;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.7rem 1rem;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  background: #f8fafd;
`;

const SectionTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: #346bb3;
  margin-bottom: 0.7rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.7rem;
  margin-bottom: 0.6rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: #f8fafd;
`;

const AddButton = styled.button`
  background: #4B89DC;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  width: 100%;
  &:hover {
    background: #346bb3;
  }
`;

const CardSection = styled.div`
  background: #f5f6fa;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 1.5rem 2.5rem 1.2rem 2.5rem;
  margin-bottom: 0.3rem;
  width: 100%;
`;

const CardAddButton = styled.button`
  background: #3a5fc8;
  color: #fff;
  border: none;
  border-radius: 0 0 8px 8px;
  width: 100%;
  padding: 0.6rem 0;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #2b4fa2;
  }
`;

const CardRow = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-bottom: 0.7rem;
  width: 100%;
`;

const CardInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.08rem;
  background: #e9ecef;
`;

const CardTextArea = styled.textarea`
  width: 100%;
  min-height: 240px;
  padding: 0.7rem 1.2rem;
  padding-right: 2.4rem;
  border: none;
  border-radius: 8px;
  font-size: 1.08rem;
  background: #e9ecef;
  resize: vertical;
  margin-right: 0;
  box-sizing: border-box;
`;

const TallCardSection = styled(CardSection)`
  min-height: 240px;
`;

const SmallCardSection = styled(CardSection)`
  max-width: 730px;
  margin-left: 0;
  margin-right: auto;
`;

const RemoveTagBtn = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 0.5rem;
`;

const Tag = styled.span`
  background: #1976d2;
  color: #fff;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  width: 220px;
  padding: 0.7rem 1rem;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: #f8fafd;
  text-align: left;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  width: 220px;
  background: #fff;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  z-index: 100;
  padding: 1rem 0;
`;

const DropdownOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  font-size: 1.3rem;
  &:hover {
    background: #f4f6fa;
  }
`;

const TagList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const keywordOptions = ['책임감', '소통', '리더십', '창의성', '성실함'];
const stackOptions = ['React', 'Node.js', 'Python', 'Java', 'TypeScript'];
const jobOptions = ['프론트엔드', '백엔드', '풀스택', '디자이너', '기획자'];

const CardButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.7rem;
`;

const ConfirmButton = styled.button`
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 8px 0 0 8px;
  padding: 0.5rem 1.3rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: #1251a3; }
`;

const DeleteButton = styled.button`
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 0 8px 8px 0;
  padding: 0.5rem 1.3rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 2px;
  &:hover { background: #1769aa; }
`;

const TopButton = styled.button`
  background: #4B89DC;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.3rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: #346bb3;
  }
`;

const FixedSaveButton = styled.div`
  position: fixed;
  top: 90px;
  right: 2.2rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

// 직무 직군, 기술 스택, 키워드 고정 리스트
const JOB_LIST = [
  'AI 엔지니어',
  'DevOps 엔지니어',
  '기획자',
  '데이터 엔지니어',
  '디자이너',
  '모바일 개발자',
  '백엔드 개발자',
  '프론트엔드 개발자',
];
const STACK_LIST = [
  'AWS',
  'Django',
  'Docker',
  'JavaScript',
  'Kubernetes',
  'MongoDB',
  'MySQL',
  'NestJS',
  'Node.js',
  'Python',
  'React',
  'Spring Boot',
  'TypeScript',
  'Vue.js',
];
const KEYWORD_LIST = [
  '리더십',
  '문제해결',
  '분석력',
  '성실함',
  '적응력',
  '창의성',
  '책임감',
  '커뮤니케이션',
  '팀워크',
  '학습능력',
];

const PortfolioCreate: React.FC = () => {
  const navigate = useNavigate();

  // 멀티셀렉트 드롭다운 상태
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [keywordOpen, setKeywordOpen] = useState(false);
  const keywordRef = useRef<HTMLDivElement>(null);

  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [stackOpen, setStackOpen] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);

  // 직무/직군 상태
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [jobOpen, setJobOpen] = useState(false);
  const jobRef = useRef<HTMLDivElement>(null);

  // 경력, 프로젝트, 자격증, 외국어, 대외활동 상태
  const [experiences, setExperiences] = useState([
    { company: '', position: '', period: '', description: '', isConfirmed: false }
  ]);
  const [projects, setProjects] = useState([
    { name: '', period: '', description: '', isConfirmed: false }
  ]);
  const [certificates, setCertificates] = useState([
    { name: '', level: '', issuer: '', isConfirmed: false }
  ]);
  const [languages, setLanguages] = useState([
    { name: '', level: '', isConfirmed: false }
  ]);
  const [activities, setActivities] = useState([
    { name: '', org: '', period: '', description: '', isConfirmed: false }
  ]);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (keywordRef.current && !keywordRef.current.contains(e.target as Node)) setKeywordOpen(false);
      if (stackRef.current && !stackRef.current.contains(e.target as Node)) setStackOpen(false);
      if (jobRef.current && !jobRef.current.contains(e.target as Node)) setJobOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // 키워드 선택/해제
  const handleKeywordChange = (option: string) => {
    setSelectedKeywords(prev =>
      prev.includes(option)
        ? prev.filter(k => k !== option)
        : [...prev, option]
    );
  };
  // 키워드 개별 삭제
  const handleRemoveKeyword = (option: string) => {
    setSelectedKeywords(prev => prev.filter(k => k !== option));
  };

  // 스택 선택/해제
  const handleStackChange = (option: string) => {
    setSelectedStacks(prev =>
      prev.includes(option)
        ? prev.filter(s => s !== option)
        : [...prev, option]
    );
  };
  // 스택 개별 삭제
  const handleRemoveStack = (option: string) => {
    setSelectedStacks(prev => prev.filter(s => s !== option));
  };

  // 직무/직군 선택/해제
  const handleJobChange = (option: string) => {
    setSelectedJobs(prev =>
      prev.includes(option)
        ? prev.filter(j => j !== option)
        : [...prev, option]
    );
  };
  // 직무/직군 개별 삭제
  const handleRemoveJob = (option: string) => {
    setSelectedJobs(prev => prev.filter(j => j !== option));
  };

  // 추가 핸들러
  const handleAddExperience = () => setExperiences([...experiences, { company: '', position: '', period: '', description: '', isConfirmed: false }]);
  const handleAddProject = () => setProjects([...projects, { name: '', period: '', description: '', isConfirmed: false }]);
  const handleAddCertificate = () => setCertificates([...certificates, { name: '', level: '', issuer: '', isConfirmed: false }]);
  const handleAddLanguage = () => setLanguages([...languages, { name: '', level: '', isConfirmed: false }]);
  const handleAddActivity = () => setActivities([...activities, { name: '', org: '', period: '', description: '', isConfirmed: false }]);

  // 값 변경 핸들러
  const handleExperienceChange = (idx: number, field: string, value: string) => {
    setExperiences(experiences.map((exp, i) => i === idx ? { ...exp, [field]: value } : exp));
  };
  const handleProjectChange = (idx: number, field: string, value: string) => {
    setProjects(projects.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };
  const handleCertificateChange = (idx: number, field: string, value: string) => {
    setCertificates(certificates.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };
  const handleLanguageChange = (idx: number, field: string, value: string) => {
    setLanguages(languages.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };
  const handleActivityChange = (idx: number, field: string, value: string) => {
    setActivities(activities.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  };

  // 삭제 핸들러
  const handleRemoveExperience = (idx: number) => {
    setExperiences(experiences.filter((_, i) => i !== idx));
  };
  const handleRemoveProject = (idx: number) => {
    setProjects(projects.filter((_, i) => i !== idx));
  };
  const handleRemoveCertificate = (idx: number) => {
    setCertificates(certificates.filter((_, i) => i !== idx));
  };
  const handleRemoveLanguage = (idx: number) => {
    setLanguages(languages.filter((_, i) => i !== idx));
  };
  const handleRemoveActivity = (idx: number) => {
    setActivities(activities.filter((_, i) => i !== idx));
  };

  // 확인/수정 핸들러
  const handleConfirmExperience = (idx: number) => {
    setExperiences(experiences.map((exp, i) => i === idx ? { ...exp, isConfirmed: true } : exp));
  };
  const handleEditExperience = (idx: number) => {
    setExperiences(experiences.map((exp, i) => i === idx ? { ...exp, isConfirmed: false } : exp));
  };
  const handleConfirmProject = (idx: number) => {
    setProjects(projects.map((p, i) => i === idx ? { ...p, isConfirmed: true } : p));
  };
  const handleEditProject = (idx: number) => {
    setProjects(projects.map((p, i) => i === idx ? { ...p, isConfirmed: false } : p));
  };
  const handleConfirmCertificate = (idx: number) => {
    setCertificates(certificates.map((c, i) => i === idx ? { ...c, isConfirmed: true } : c));
  };
  const handleEditCertificate = (idx: number) => {
    setCertificates(certificates.map((c, i) => i === idx ? { ...c, isConfirmed: false } : c));
  };
  const handleConfirmLanguage = (idx: number) => {
    setLanguages(languages.map((l, i) => i === idx ? { ...l, isConfirmed: true } : l));
  };
  const handleEditLanguage = (idx: number) => {
    setLanguages(languages.map((l, i) => i === idx ? { ...l, isConfirmed: false } : l));
  };
  const handleConfirmActivity = (idx: number) => {
    setActivities(activities.map((a, i) => i === idx ? { ...a, isConfirmed: true } : a));
  };
  const handleEditActivity = (idx: number) => {
    setActivities(activities.map((a, i) => i === idx ? { ...a, isConfirmed: false } : a));
  };

  // 프로필 정보 상태 (API 연동)
  const [profile, setProfile] = useState({
    name: '',
    gender: '',
    birth: '',
    phone: '',
    email: '',
    image: null as string | null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.REACT_APP_API_URL || '';
        const res = await axios.get(`${apiUrl}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // 응답 필드명에 따라 매핑 필요
        setProfile({
          name: res.data.name,
          gender: res.data.gender,
          birth: res.data.birth,
          phone: res.data.phone,
          email: res.data.email,
          image: res.data.profileImage || null,
        });
      } catch (e) {
        // 에러 시 기본값 유지
      }
    };
    fetchProfile();
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Bg>
      <TopBar>
        <Logo onClick={() => navigate('/')}>산학협력</Logo>
        <TopUserMenu>
          <TopLink onClick={() => navigate('/profile')}>내정보</TopLink>
          <TopLink onClick={handleLogout}>로그아웃</TopLink>
          <TopUserName>{profile.name ? `${profile.name} 님` : '- 님'}</TopUserName>
        </TopUserMenu>
      </TopBar>
      <MainContent>
        {/* 프로필 */}
        <ProfileSection>
          <ProfileImg>
            {profile.image ? (
              <ProfileImgInner src={profile.image.startsWith('http') ? profile.image : `${process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : ''}/${profile.image.replace(/^\//, '')}`}
                alt="프로필" />
            ) : null}
          </ProfileImg>
          <ProfileInfo>
            <ProfileName>{profile.name}</ProfileName>
            <ProfileDetail>{profile.gender}</ProfileDetail>
            <ProfileDetail>{profile.birth}</ProfileDetail>
            <ProfileDetail>{profile.phone}</ProfileDetail>
            <ProfileDetail>{profile.email}</ProfileDetail>
          </ProfileInfo>
        </ProfileSection>

        {/* 나의 키워드 */}
        <div>
          <SectionLabel><BlueBar />나의 키워드</SectionLabel>
          <TagRow>
            <TagList>
              {selectedKeywords.map(option => (
                <Tag key={option}>
                  {option}
                  <RemoveTagBtn onClick={() => handleRemoveKeyword(option)}>×</RemoveTagBtn>
                </Tag>
              ))}
            </TagList>
            <DropdownContainer ref={keywordRef}>
              <AddBtn onClick={() => setKeywordOpen(v => !v)}>+</AddBtn>
              {keywordOpen && (
                <DropdownMenu>
                  {KEYWORD_LIST.map(option => (
                    <DropdownOption key={option}>
                      <input
                        type="checkbox"
                        checked={selectedKeywords.includes(option)}
                        onChange={() => handleKeywordChange(option)}
                        style={{ marginRight: '0.6rem' }}
                      />
                      {option}
                    </DropdownOption>
                  ))}
                </DropdownMenu>
              )}
            </DropdownContainer>
          </TagRow>
        </div>

        {/* 직군/직무 */}
        <div>
          <SectionLabel><BlueBar />직군 / 직무</SectionLabel>
          <TagRow>
            <TagList>
              {selectedJobs.map(option => (
                <Tag key={option}>
                  {option}
                  <RemoveTagBtn onClick={() => handleRemoveJob(option)}>×</RemoveTagBtn>
                </Tag>
              ))}
            </TagList>
            <DropdownContainer ref={jobRef}>
              <AddBtn onClick={() => setJobOpen(v => !v)}>+</AddBtn>
              {jobOpen && (
                <DropdownMenu>
                  {JOB_LIST.map(option => (
                    <DropdownOption key={option}>
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(option)}
                        onChange={() => handleJobChange(option)}
                        style={{ marginRight: '0.6rem' }}
                      />
                      {option}
                    </DropdownOption>
                  ))}
                </DropdownMenu>
              )}
            </DropdownContainer>
          </TagRow>
        </div>

        {/* 기술 스택 */}
        <div>
          <SectionLabel><BlueBar />기술 스택</SectionLabel>
          <TagRow>
            <TagList>
              {selectedStacks.map(option => (
                <Tag key={option}>
                  {option}
                  <RemoveTagBtn onClick={() => handleRemoveStack(option)}>×</RemoveTagBtn>
                </Tag>
              ))}
            </TagList>
            <DropdownContainer ref={stackRef}>
              <AddBtn onClick={() => setStackOpen(v => !v)}>+</AddBtn>
              {stackOpen && (
                <DropdownMenu>
                  {STACK_LIST.map(option => (
                    <DropdownOption key={option}>
                      <input
                        type="checkbox"
                        checked={selectedStacks.includes(option)}
                        onChange={() => handleStackChange(option)}
                        style={{ marginRight: '0.6rem' }}
                      />
                      {option}
                    </DropdownOption>
                  ))}
                </DropdownMenu>
              )}
            </DropdownContainer>
          </TagRow>
        </div>

        {/* 나의 소개 */}
        <div>
          <SectionLabel><BlueBar />나의 소개</SectionLabel>
          <TextArea placeholder="자기소개를 입력하세요" />
        </div>

        {/* 경력 */}
        <SectionLabel style={{ marginBottom: '1rem', maxWidth: '100%' }}><BlueBar />경력</SectionLabel>
        {/* 리스트(확인된 항목) */}
        {experiences.filter(exp => exp.isConfirmed).length > 0 && (
          <TallCardSection style={{ marginBottom: '1.5rem' }}>
            {experiences.filter(exp => exp.isConfirmed).map((exp, idx, arr) => (
              <div key={idx} style={{ padding: '1.2rem 0.5rem 1.2rem 0.5rem', borderBottom: idx !== arr.length - 1 ? '1px solid #e0e0e0' : 'none', marginBottom: '0.7rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.18rem', marginBottom: '0.2rem' }}>
                  {exp.company}
                  {exp.period && (
                    <span style={{ color: '#b0b0b0', fontWeight: 400, fontSize: '0.98rem', marginLeft: '0.7rem' }}>{exp.period}</span>
                  )}
                </div>
                <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: '0.1rem' }}>{exp.position}</div>
                {exp.description && (
                  <div style={{ color: '#444', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>{exp.description}</div>
                )}
                <div style={{ marginTop: '0.7rem', textAlign: 'right' }}>
                  <ConfirmButton as="button" style={{ background: '#eee', color: '#1976d2' }} onClick={() => handleEditExperience(experiences.findIndex(e => e === exp))}>수정</ConfirmButton>
                  <DeleteButton onClick={() => handleRemoveExperience(experiences.findIndex(e => e === exp))}>삭제</DeleteButton>
                </div>
              </div>
            ))}
          </TallCardSection>
        )}
        {/* 입력폼(확인 안 된 항목) */}
        {experiences.filter(exp => !exp.isConfirmed).map((exp, idx) => {
          // experiences에서 isConfirmed가 false인 항목의 실제 인덱스
          const realIdx = experiences.findIndex((e, i) => !e.isConfirmed && experiences.slice(0, i+1).filter(x => !x.isConfirmed).length-1 === idx);
          return (
            <TallCardSection key={realIdx} style={{ marginBottom: '0' }}>
              <CardRow>
                <CardInput value={exp.company} onChange={e => handleExperienceChange(realIdx, 'company', e.target.value)} placeholder="기업명" />
                <CardInput value={exp.position} onChange={e => handleExperienceChange(realIdx, 'position', e.target.value)} placeholder="직위/직급" />
                <CardInput value={exp.period} onChange={e => handleExperienceChange(realIdx, 'period', e.target.value)} placeholder="재직기간" />
              </CardRow>
              <CardTextArea value={exp.description} onChange={e => handleExperienceChange(realIdx, 'description', e.target.value)} placeholder="주요 업무 및 성과(선택)" />
              <CardButtonRow>
                <div />
                <div>
                  <ConfirmButton onClick={() => handleConfirmExperience(realIdx)}>확인</ConfirmButton>
                  <DeleteButton onClick={() => handleRemoveExperience(realIdx)}>삭제</DeleteButton>
                </div>
              </CardButtonRow>
            </TallCardSection>
          );
        })}
        <TallCardSection style={{ boxShadow: 'none', background: 'none', padding: 0, marginBottom: '2.5rem' }}>
          <CardAddButton style={{ width: '100%', minWidth: 'unset', margin: 0 }} onClick={handleAddExperience}>+ 추가</CardAddButton>
        </TallCardSection>

        {/* 프로젝트 */}
        <SectionLabel style={{ marginBottom: '1rem', maxWidth: '100%' }}><BlueBar />프로젝트</SectionLabel>
        {/* 리스트(확인된 항목) */}
        {projects.filter(p => p.isConfirmed).length > 0 && (
          <TallCardSection style={{ marginBottom: '1.5rem' }}>
            {projects.filter(p => p.isConfirmed).map((p, idx, arr) => (
              <div key={idx} style={{ padding: '1.2rem 0.5rem 1.2rem 0.5rem', borderBottom: idx !== arr.length - 1 ? '1px solid #e0e0e0' : 'none', marginBottom: '0.7rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.18rem', marginBottom: '0.2rem' }}>{p.name}
                  {p.period && (
                    <span style={{ color: '#b0b0b0', fontWeight: 400, fontSize: '0.98rem', marginLeft: '0.7rem' }}>{p.period}</span>
                  )}
                </div>
                {p.description && (
                  <div style={{ color: '#444', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>{p.description}</div>
                )}
                <div style={{ marginTop: '0.7rem', textAlign: 'right' }}>
                  <ConfirmButton as="button" style={{ background: '#eee', color: '#1976d2' }} onClick={() => handleEditProject(projects.findIndex(x => x === p))}>수정</ConfirmButton>
                  <DeleteButton onClick={() => handleRemoveProject(projects.findIndex(x => x === p))}>삭제</DeleteButton>
                </div>
              </div>
            ))}
          </TallCardSection>
        )}
        {/* 입력폼(확인 안 된 항목) */}
        {projects.filter(p => !p.isConfirmed).map((p, idx) => {
          const realIdx = projects.findIndex((x, i) => !x.isConfirmed && projects.slice(0, i+1).filter(y => !y.isConfirmed).length-1 === idx);
          return (
            <TallCardSection key={realIdx} style={{ marginBottom: '0' }}>
              <CardRow>
                <CardInput value={p.name} onChange={e => handleProjectChange(realIdx, 'name', e.target.value)} placeholder="프로젝트명" />
                <CardInput value={p.period} onChange={e => handleProjectChange(realIdx, 'period', e.target.value)} placeholder="프로젝트 기간" />
              </CardRow>
              <CardTextArea value={p.description} onChange={e => handleProjectChange(realIdx, 'description', e.target.value)} placeholder="프로젝트 내용" />
              <CardButtonRow>
                <div />
                <div>
                  <ConfirmButton onClick={() => handleConfirmProject(realIdx)}>확인</ConfirmButton>
                  <DeleteButton onClick={() => handleRemoveProject(realIdx)}>삭제</DeleteButton>
                </div>
              </CardButtonRow>
            </TallCardSection>
          );
        })}
        <TallCardSection style={{ boxShadow: 'none', background: 'none', padding: 0, marginBottom: '2.5rem' }}>
          <CardAddButton style={{ width: '100%', minWidth: 'unset', margin: 0 }} onClick={handleAddProject}>+ 추가</CardAddButton>
        </TallCardSection>

        {/* 자격증 */}
        <SectionLabel style={{ marginBottom: '1rem', maxWidth: '730px' }}><BlueBar />자격증</SectionLabel>
        {certificates.filter(c => c.isConfirmed).length > 0 && (
          <SmallCardSection style={{ marginBottom: '1.5rem' }}>
            {certificates.filter(c => c.isConfirmed).map((c, idx, arr) => (
              <div key={idx} style={{ padding: '1.2rem 0.5rem 1.2rem 0.5rem', borderBottom: idx !== arr.length - 1 ? '1px solid #e0e0e0' : 'none', marginBottom: '0.7rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: '0.2rem' }}>{c.name}
                  {c.level && (
                    <span style={{ color: '#b0b0b0', fontWeight: 400, fontSize: '0.98rem', marginLeft: '0.7rem' }}>{c.level}</span>
                  )}
                  {c.issuer && (
                    <span style={{ color: '#b0b0b0', fontWeight: 400, fontSize: '0.98rem', marginLeft: '0.7rem' }}>{c.issuer}</span>
                  )}
                </div>
                <div style={{ marginTop: '0.7rem', textAlign: 'right' }}>
                  <ConfirmButton as="button" style={{ background: '#eee', color: '#1976d2' }} onClick={() => handleEditCertificate(certificates.findIndex(x => x === c))}>수정</ConfirmButton>
                  <DeleteButton onClick={() => handleRemoveCertificate(certificates.findIndex(x => x === c))}>삭제</DeleteButton>
                </div>
              </div>
            ))}
          </SmallCardSection>
        )}
        {certificates.filter(c => !c.isConfirmed).map((c, idx) => {
          const realIdx = certificates.findIndex((x, i) => !x.isConfirmed && certificates.slice(0, i+1).filter(y => !y.isConfirmed).length-1 === idx);
          return (
            <SmallCardSection key={realIdx} style={{ marginBottom: '0' }}>
              <CardRow>
                <CardInput value={c.name} onChange={e => handleCertificateChange(realIdx, 'name', e.target.value)} placeholder="자격증명" />
                <CardInput value={c.level} onChange={e => handleCertificateChange(realIdx, 'level', e.target.value)} placeholder="급수" />
                <CardInput value={c.issuer} onChange={e => handleCertificateChange(realIdx, 'issuer', e.target.value)} placeholder="발급기관" />
              </CardRow>
              <CardButtonRow>
                <div />
                <div>
                  <ConfirmButton onClick={() => handleConfirmCertificate(realIdx)}>확인</ConfirmButton>
                  <DeleteButton onClick={() => handleRemoveCertificate(realIdx)}>삭제</DeleteButton>
                </div>
              </CardButtonRow>
            </SmallCardSection>
          );
        })}
        <SmallCardSection style={{ boxShadow: 'none', background: 'none', padding: 0, marginBottom: '2.5rem' }}>
          <CardAddButton style={{ width: '100%', minWidth: 'unset', margin: 0 }} onClick={handleAddCertificate}>+ 추가</CardAddButton>
        </SmallCardSection>

        {/* 외국어 */}
        <SectionLabel style={{ marginBottom: '1rem', maxWidth: '730px' }}><BlueBar />외국어</SectionLabel>
        {languages.filter(l => l.isConfirmed).length > 0 && (
          <SmallCardSection style={{ marginBottom: '1.5rem' }}>
            {languages.filter(l => l.isConfirmed).map((l, idx, arr) => (
              <div key={idx} style={{ padding: '1.2rem 0.5rem 1.2rem 0.5rem', borderBottom: idx !== arr.length - 1 ? '1px solid #e0e0e0' : 'none', marginBottom: '0.7rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: '0.2rem' }}>{l.name}
                  {l.level && (
                    <span style={{ color: '#b0b0b0', fontWeight: 400, fontSize: '0.98rem', marginLeft: '0.7rem' }}>{l.level}</span>
                  )}
                </div>
                <div style={{ marginTop: '0.7rem', textAlign: 'right' }}>
                  <ConfirmButton as="button" style={{ background: '#eee', color: '#1976d2' }} onClick={() => handleEditLanguage(languages.findIndex(x => x === l))}>수정</ConfirmButton>
                  <DeleteButton onClick={() => handleRemoveLanguage(languages.findIndex(x => x === l))}>삭제</DeleteButton>
                </div>
              </div>
            ))}
          </SmallCardSection>
        )}
        {languages.filter(l => !l.isConfirmed).map((l, idx) => {
          const realIdx = languages.findIndex((x, i) => !x.isConfirmed && languages.slice(0, i+1).filter(y => !y.isConfirmed).length-1 === idx);
          return (
            <SmallCardSection key={realIdx} style={{ marginBottom: '0' }}>
              <CardRow>
                <CardInput value={l.name} onChange={e => handleLanguageChange(realIdx, 'name', e.target.value)} placeholder="언어명" />
                <CardInput value={l.level} onChange={e => handleLanguageChange(realIdx, 'level', e.target.value)} placeholder="수준" />
              </CardRow>
              <CardButtonRow>
                <div />
                <div>
                  <ConfirmButton onClick={() => handleConfirmLanguage(realIdx)}>확인</ConfirmButton>
                  <DeleteButton onClick={() => handleRemoveLanguage(realIdx)}>삭제</DeleteButton>
                </div>
              </CardButtonRow>
            </SmallCardSection>
          );
        })}
        <SmallCardSection style={{ boxShadow: 'none', background: 'none', padding: 0, marginBottom: '2.5rem' }}>
          <CardAddButton style={{ width: '100%', minWidth: 'unset', margin: 0 }} onClick={handleAddLanguage}>+ 추가</CardAddButton>
        </SmallCardSection>

        {/* 대외 활동 */}
        <SectionLabel style={{ marginBottom: '1rem', maxWidth: '100%' }}><BlueBar />대외 활동</SectionLabel>
        {activities.filter(a => a.isConfirmed).length > 0 && (
          <TallCardSection style={{ marginBottom: '1.5rem' }}>
            {activities.filter(a => a.isConfirmed).map((a, idx, arr) => (
              <div key={idx} style={{ padding: '1.2rem 0.5rem 1.2rem 0.5rem', borderBottom: idx !== arr.length - 1 ? '1px solid #e0e0e0' : 'none', marginBottom: '0.7rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.18rem', marginBottom: '0.2rem' }}>{a.name}
                  {a.org && (
                    <span style={{ color: '#b0b0b0', fontWeight: 400, fontSize: '0.98rem', marginLeft: '0.7rem' }}>{a.org}</span>
                  )}
                  {a.period && (
                    <span style={{ color: '#b0b0b0', fontWeight: 400, fontSize: '0.98rem', marginLeft: '0.7rem' }}>{a.period}</span>
                  )}
                </div>
                {a.description && (
                  <div style={{ color: '#444', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>{a.description}</div>
                )}
                <div style={{ marginTop: '0.7rem', textAlign: 'right' }}>
                  <ConfirmButton as="button" style={{ background: '#eee', color: '#1976d2' }} onClick={() => handleEditActivity(activities.findIndex(x => x === a))}>수정</ConfirmButton>
                  <DeleteButton onClick={() => handleRemoveActivity(activities.findIndex(x => x === a))}>삭제</DeleteButton>
                </div>
              </div>
            ))}
          </TallCardSection>
        )}
        {activities.filter(a => !a.isConfirmed).map((a, idx) => {
          const realIdx = activities.findIndex((x, i) => !x.isConfirmed && activities.slice(0, i+1).filter(y => !y.isConfirmed).length-1 === idx);
          return (
            <TallCardSection key={realIdx} style={{ marginBottom: '0' }}>
              <CardRow>
                <CardInput value={a.name} onChange={e => handleActivityChange(realIdx, 'name', e.target.value)} placeholder="활동명" />
                <CardInput value={a.org} onChange={e => handleActivityChange(realIdx, 'org', e.target.value)} placeholder="활동기관" />
                <CardInput value={a.period} onChange={e => handleActivityChange(realIdx, 'period', e.target.value)} placeholder="활동 기간" />
              </CardRow>
              <CardTextArea value={a.description} onChange={e => handleActivityChange(realIdx, 'description', e.target.value)} placeholder="활동 설명" />
              <CardButtonRow>
                <div />
                <div>
                  <ConfirmButton onClick={() => handleConfirmActivity(realIdx)}>확인</ConfirmButton>
                  <DeleteButton onClick={() => handleRemoveActivity(realIdx)}>삭제</DeleteButton>
                </div>
              </CardButtonRow>
            </TallCardSection>
          );
        })}
        <TallCardSection style={{ boxShadow: 'none', background: 'none', padding: 0, marginBottom: '2.5rem' }}>
          <CardAddButton style={{ width: '100%', minWidth: 'unset', margin: 0 }} onClick={handleAddActivity}>+ 추가</CardAddButton>
        </TallCardSection>
      </MainContent>
      <FixedSaveButton>
        <TopButton>저장</TopButton>
      </FixedSaveButton>
    </Bg>
  );
};

export default PortfolioCreate; 