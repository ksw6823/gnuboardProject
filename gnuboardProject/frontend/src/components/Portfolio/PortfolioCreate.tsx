import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import { PortfolioData } from '../../types/portfolio';
import { User } from '../../types/user';
import DefaultTemplate from './templates/DefaultTemplate';
import CardTemplate from './templates/CardTemplate';
import SplitTemplate from './templates/SplitTemplate';
import DarkTemplate from './templates/DarkTemplate';
import TabTemplate from './templates/TabTemplate';
import ArtTemplate from './templates/ArtTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import BrutalTemplate from './templates/BrutalTemplate';
import GradientTemplate from './templates/GradientTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import { FaRegSave } from 'react-icons/fa';
import { MdOutlinePalette } from 'react-icons/md';

// 드래그&드롭용 태그 카테고리 - 이제 사용하지 않음
// const TAG_CATEGORIES = [
//   { id: 'basic', label: '기본 정보' },
//   { id: 'tech', label: '기술 스택' },
//   { id: 'exp', label: '수행경험' },
//   { id: 'career', label: '이력' },
//   { id: 'cert', label: '자격증' },
//   { id: 'intro', label: '자기소개서' },
//   { id: 'lang', label: '언어' },
// ];

interface Skill { id: number; name: string; }
interface Keyword { id: number; name: string; }
interface Section { id: string; type: string; title: string; content: string; order: number; }

const TemplateSelector = styled.select`
  padding: 8px 16px;
  margin: 0; /* 기존 마진 제거 */
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background-color: white;
  width: auto; /* 너비를 auto로 변경하여 내용에 맞게 조정 */
`;

// TemplateContainer 제거
// const TemplateContainer = styled.div`
//   margin-top: 2rem;
//   padding: 2rem;
//   background: #fff;
//   border-radius: 12px;
//   box-shadow: 0 2px 8px rgba(0,0,0,0.07);
// `;

const SelectableItemList = styled.div`
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  max-height: 150px;
  overflow-y: auto;
  margin-top: 8px;
`;

const SelectableItem = styled.div<{ selected: boolean }>`
  padding: 6px 8px;
  cursor: pointer;
  background-color: ${props => props.selected ? '#e9e9e9' : 'transparent'};

  &:hover {
    background-color: #f0f0f0;
  }
`;

// 이미지에 맞게 스타일 수정
const SectionContainer = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
  border-left: 4px solid #007bff; /* 파란색 세로 바 */
  padding-left: 8px;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
`;

const SmallTextarea = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
  font-size: 14px;
`;

const SelectableHeader = styled.div`
  font-weight: 500;
  margin-bottom: 6px;
  cursor: pointer;
  padding: 10px 8px; /* 이미지에 맞게 패딩 조정 */
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between; /* +,- 를 오른쪽으로 */
  align-items: center;
`;

const SelectedTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px; /* 목록 아래에 공간 추가 */
`;

const SelectedTag = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid #007bff;
  background: #e0f2ff;
  color: #007bff;
  font-size: 13px;
`;

// 오른쪽 사이드바 스타일 수정 (fixed position)
const RightSidebar = styled.div`
  position: fixed; /* 화면 오른쪽에 고정 */
  top: 0; /* 상단에 붙임 */
  right: 0; /* 오른쪽에 붙임 */
  width: 200px; /* 적절한 너비 설정 */
  height: 100vh; /* 전체 높이 */
  background: #f7f8fa; /* 배경색 */
  border-left: 1px solid #e0e6ed; /* 왼쪽 경계선 */
  padding: 20px; /* 내부 여백 */
  display: flex;
  flex-direction: column; /* 요소들을 세로로 배열 */
  align-items: center; /* 가운데 정렬 */
  z-index: 1000; /* 다른 요소 위에 표시 */
  box-sizing: border-box; /* 패딩을 너비에 포함 */
`;

const SaveButton = styled.button`
  width: 100%; /* 부모 너비에 맞춤 */
  padding: 10px 16px;
  border-radius: 4px;
  background: #007bff;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  margin-bottom: 16px; /* 드롭다운과의 간격 */
`;

// 모달 스타일 컴포넌트 추가
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.15);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalBox = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  padding: 24px 28px 20px 28px;
  min-width: 260px;
  max-height: 70vh;
  overflow-y: auto;
`;
const ModalTitle = styled.div`
  font-weight: bold;
  margin-bottom: 12px;
`;
const ModalButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;
const Tag = styled.span`
  display: inline-block;
  background: #e0f2ff;
  color: #007bff;
  border-radius: 12px;
  padding: 4px 12px;
  font-size: 14px;
  margin: 0 6px 6px 0;
`;

// 임의 데이터
const KEYWORD_LIST = ['긍정적', '꼼꼼함', '도전정신', '리더십', '성실함', '소통', '자기주도', '창의성', '책임감', '협업'];
const SKILL_LIST = ['React', 'Node.js', 'Python', 'Java', 'C++', 'AWS', 'Docker', 'Figma', 'MySQL', 'Kubernetes'];
const JOB_LIST = ['프론트엔드', '백엔드', '풀스택', 'AI 엔지니어', '데이터 분석가', 'PM', '디자이너'];

// 프로필 사진 업로드 박스 스타일 추가
const ProfileImgBox = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #f4f4f4;
  border: 2px dashed #d0d0d0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
  cursor: pointer;
  overflow: hidden;
  position: relative;
`;
const ProfileImgPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  background: repeating-linear-gradient(45deg, #e0e0e0, #e0e0e0 10px, #f4f4f4 10px, #f4f4f4 20px);
  border-radius: 50%;
`;
const ProfileName = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2px;
`;
const ProfileEmail = styled.div`
  font-size: 1rem;
  color: #888;
  text-align: center;
  margin-bottom: 18px;
`;

const PortfolioCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // 프로필/기본정보
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [summary, setSummary] = useState('');
  const [title, setTitle] = useState('');
  // 키워드/기술스택
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  // 섹션 (고정된 입력 필드)
  const [sections, setSections] = useState<Section[]>([
    { id: uuidv4(), type: 'job', title: '직무/직군', content: '', order: 0 },
    { id: uuidv4(), type: 'intro', title: '자기소개', content: '', order: 1 },
    { id: uuidv4(), type: 'career', title: '경력', content: '', order: 2 },
    { id: uuidv4(), type: 'project', title: '프로젝트', content: '', order: 3 },
    { id: uuidv4(), type: 'cert', title: '자격증', content: '', order: 4 },
    { id: uuidv4(), type: 'lang', title: '외국어', content: '', order: 5 },
    { id: uuidv4(), type: 'activity', title: '대외활동', content: '', order: 6 }, // 'activity'를 대외활동 타입으로 가정
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  // 선택 목록 표시 상태
  const [showKeywordList, setShowKeywordList] = useState(false);
  const [showSkillList, setShowSkillList] = useState(false);
  const [showTemplateSelect, setShowTemplateSelect] = useState(false);

  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      introduction: '',
      profileImage: ''
    },
    skills: [],
    experiences: [],
    projects: [],
    certificates: [],
    languages: [],
    activities: [],
    education: []
  });

  // 동적 폼 상태를 PortfolioData 타입에 맞게 수정
  const [experiences, setExperiences] = useState([{ title: '', company: '', date: '', description: '' }]);
  const [projects, setProjects] = useState([{ title: '', description: '', technologies: [], date: '' }]);
  const [certificates, setCertificates] = useState([{ name: '', issuer: '', date: '' }]);
  const [languages, setLanguages] = useState([{ name: '', level: '' }]);
  const [activities, setActivities] = useState([{ title: '', description: '' }]);

  const handleInputChange = (section: keyof PortfolioData, field: string, value: string) => {
    if (section === 'personalInfo') {
      setPortfolioData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value
        }
      }));
    } else {
      setPortfolioData(prev => {
        if (Array.isArray(prev[section])) {
          return {
            ...prev,
            [section]: prev[section].map((item: any, index: number) => 
              index === 0 ? { ...item, [field]: value } : item
            )
          };
        }
        return prev;
      });
    }
  };

  // 내 정보 불러오기
  const loadProfile = () => {
    if (user) {
      // 필요한 user 정보가 있다면 여기서 사용
    }
  };

  // 기술스택/키워드 목록 불러오기
  useEffect(() => {
    axios.get('/skills').then(res => setSkills(res.data));
    axios.get('/keywords').then(res => setKeywords(res.data));
  }, []);

  // 프로필 이미지 미리보기
  const handleProfileImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImg(e.target.files[0]);
      setProfilePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // 키워드 토글 함수
  const toggleKeyword = (id: number) => {
    setSelectedKeywords(prev => prev.includes(id.toString()) ? prev.filter(k => k !== id.toString()) : [...prev, id.toString()]);
  };

  // 기술스택 토글 함수
  const toggleSkill = (id: number) => {
    setSelectedSkills(prev => prev.includes(id.toString()) ? prev.filter(s => s !== id.toString()) : [...prev, id.toString()]);
  };

  // 섹션 내용 변경
  const updateSectionContent = (type: string, value: string) => {
    setSections(sections.map(section =>
      section.type === type ? { ...section, content: value } : section
    ));
  };

  // 핸들러 및 추가 함수도 필드명에 맞게 수정
  const handleExperienceChange = (idx: number, field: string, value: string) => {
    setExperiences(experiences.map((exp, i) => i === idx ? { ...exp, [field]: value } : exp));
  };
  const addExperience = () => setExperiences([...experiences, { title: '', company: '', date: '', description: '' }]);

  const handleProjectChange = (idx: number, field: string, value: string) => {
    setProjects(projects.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };
  const addProject = () => setProjects([...projects, { title: '', description: '', technologies: [], date: '' }]);

  const handleCertificateChange = (idx: number, field: string, value: string) => {
    setCertificates(certificates.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };
  const addCertificate = () => setCertificates([...certificates, { name: '', issuer: '', date: '' }]);

  const handleLanguageChange = (idx: number, field: string, value: string) => {
    setLanguages(languages.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };
  const addLanguage = () => setLanguages([...languages, { name: '', level: '' }]);

  const handleActivityChange = (idx: number, field: string, value: string) => {
    setActivities(activities.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  };
  const addActivity = () => setActivities([...activities, { title: '', description: '' }]);

  // 저장 함수
  const handleSave = async () => {
    try {
      const templateData = convertToTemplateData();
      
      // 포트폴리오 데이터 저장
      const response = await axios.post('/portfolios', {
        template: selectedTemplate,
        data: templateData
      });

      if (response.status === 200) {
        alert('포트폴리오가 저장되었습니다.');
        navigate('/portfolio/list');
      }
    } catch (error) {
      console.error('포트폴리오 저장 중 오류 발생:', error);
      alert('포트폴리오 저장 중 오류가 발생했습니다.');
    }
  };

  // 템플릿 데이터 변환 함수
  const convertToTemplateData = (): PortfolioData => {
    if (!user) {
      throw new Error('User is not authenticated');
    }

    return {
      personalInfo: {
        name: user.name || '',
        title: portfolioData.personalInfo.title,
        email: user.email || '',
        phone: '',
        location: '',
        introduction: portfolioData.personalInfo.introduction,
        profileImage: profileImg ? URL.createObjectURL(profileImg) : ''
      },
      skills: skills
        .filter(skill => selectedSkills.includes(skill.id.toString()))
        .map(skill => ({
          name: skill.name,
          level: '' // 이미지에 레벨 입력칸이 없으므로 빈 문자열로 설정
        })),
      experiences: experiences.filter(item => item.description !== ''),
      projects: projects.filter(item => item.description !== ''),
      certificates: certificates.filter(item => item.name !== ''),
      languages: languages.filter(item => item.level !== ''),
      activities: activities.filter(item => item.description !== ''),
      education: [
        {
          school: '', // 이미지에 학교 입력칸이 없으므로 빈 문자열로 설정
          degree: '', // 이미지에 학위 입력칸이 없으므로 빈 문자열로 설정
          date: '', // 이미지에 날짜 입력칸이 없으므로 빈 문자열로 설정
          description: portfolioData.education[0]?.description || '' // 고정된 입력 필드 값 사용
        }
      ].filter(item => item.description !== '')
    };
  };

  const templates = {
    default: DefaultTemplate,
    dark: DarkTemplate,
    gradient: GradientTemplate,
    minimal: MinimalTemplate,
    art: ArtTemplate,
    brutal: BrutalTemplate,
    tab: TabTemplate,
    split: SplitTemplate,
    card: CardTemplate,
    classic: ClassicTemplate,
  };

  const SelectedTemplate = templates[selectedTemplate as keyof typeof templates];

  // 모달 상태
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [tempChecked, setTempChecked] = useState<string[]>([]);

  // 모달 열기/닫기 및 임시 체크박스 상태 관리
  const openModal = (type: 'keyword' | 'skill' | 'job') => {
    if (type === 'keyword') {
      setTempChecked(selectedKeywords);
      setShowKeywordModal(true);
    } else if (type === 'skill') {
      setTempChecked(selectedSkills);
      setShowSkillModal(true);
    } else {
      setTempChecked(selectedJobs);
      setShowJobModal(true);
    }
  };
  const closeModal = () => {
    setShowKeywordModal(false);
    setShowSkillModal(false);
    setShowJobModal(false);
  };
  const handleTempCheck = (value: string) => {
    setTempChecked(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };
  const handleModalAdd = (type: 'keyword' | 'skill' | 'job') => {
    if (type === 'keyword') setSelectedKeywords(tempChecked);
    else if (type === 'skill') setSelectedSkills(tempChecked);
    else setSelectedJobs(tempChecked);
    closeModal();
  };

  return (
    <>
      <Header />

      <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center' }}>
        <div style={{ flex: 1, padding: '20px', marginLeft: '200px', maxWidth: '800px' }}>
          {/* 상단 버튼 영역 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
            <button
              onClick={() => setShowTemplateSelect((prev) => !prev)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#f4f6fa', border: '1px solid #bfc5ce', borderRadius: 8,
                padding: '8px 24px', fontSize: 16, fontWeight: 500, cursor: 'pointer',
              }}
            >
              <span role="img" aria-label="palette">🎨</span>
              테마 변경
            </button>
            <button
              onClick={handleSave}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#007bff', color: '#fff', border: 'none', borderRadius: 8,
                padding: '8px 24px', fontSize: 16, fontWeight: 500, cursor: 'pointer',
              }}
            >
              <span role="img" aria-label="save">💾</span>
              저장 및 게시
            </button>
          </div>
          {/* 테마 선택 드롭다운 */}
          {showTemplateSelect && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <select
              value={selectedTemplate}
                onChange={(e) => { setSelectedTemplate(e.target.value); setShowTemplateSelect(false); }}
              style={{
                  minWidth: 180,
                padding: '10px',
                borderRadius: '5px',
                  border: '1px solid #ddd',
                  fontSize: 16,
              }}
            >
              <option value="">템플릿 선택</option>
              <option value="default">기본 템플릿</option>
              <option value="dark">다크 템플릿</option>
              <option value="gradient">그라데이션 템플릿</option>
              <option value="minimal">미니멀 템플릿</option>
              <option value="art">아트 템플릿</option>
              <option value="brutal">브루탈 템플릿</option>
              <option value="tab">탭 템플릿</option>
              <option value="split">스플릿 템플릿</option>
              <option value="card">카드 템플릿</option>
              <option value="classic">클래식 템플릿</option>
            </select>
          </div>
          )}
          <h1>포트폴리오 작성</h1>
          
          {/* 상단 버튼 영역 아래, 프로필 영역 위에 제목 입력란 추가 */}
          <div style={{ margin: '0 0 24px 0', maxWidth: 600 }}>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="포트폴리오 제목을 입력하세요"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: 22,
                fontWeight: 600,
                border: '1px solid #ddd',
                borderRadius: 8,
                marginBottom: 8,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>
          {/* 상단 프로필 영역 추가 */}
          <div style={{ margin: '0 0 24px 32px', maxWidth: 400, display: 'flex', alignItems: 'center', gap: 28, justifyContent: 'flex-start' }}>
            <ProfileImgBox onClick={() => document.getElementById('profileImgInput')?.click()}>
              {profilePreview ? (
                <img src={profilePreview} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ProfileImgPlaceholder />
              )}
              <input
                id="profileImgInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfileImg}
              />
            </ProfileImgBox>
            <div>
              <ProfileName>추가 필요</ProfileName>
              <ProfileEmail>이메일 추가 필요</ProfileEmail>
            </div>
          </div>
          {/* 나의 키워드 */}
          <div style={{ marginBottom: 24 }}>
            <SectionTitle>나의 키워드</SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <button type="button" onClick={() => openModal('keyword')} style={{ border: '1px solid #bfc5ce', borderRadius: 8, background: '#fff', padding: '2px 16px', fontSize: 18, cursor: 'pointer' }}>+</button>
              <div>
                {selectedKeywords.map((kw) => <Tag key={kw}>{kw}</Tag>)}
              </div>
            </div>
          </div>
          {/* 직군/직무 */}
          <div style={{ marginBottom: 24 }}>
            <SectionTitle>직군 / 직무</SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <button type="button" onClick={() => openModal('job')} style={{ border: '1px solid #bfc5ce', borderRadius: 8, background: '#fff', padding: '2px 16px', fontSize: 18, cursor: 'pointer' }}>+</button>
              <div>
                {selectedJobs.map((job) => <Tag key={job}>{job}</Tag>)}
              </div>
            </div>
          </div>
          {/* 기술 스택 */}
          <div style={{ marginBottom: 24 }}>
            <SectionTitle>기술 스택</SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <button type="button" onClick={() => openModal('skill')} style={{ border: '1px solid #bfc5ce', borderRadius: 8, background: '#fff', padding: '2px 16px', fontSize: 18, cursor: 'pointer' }}>+</button>
              <div>
                {selectedSkills.map((sk) => <Tag key={sk}>{sk}</Tag>)}
              </div>
            </div>
          </div>
          {/* 자기소개 입력란 */}
          <div style={{ marginBottom: '20px' }}>
            <SectionTitle htmlFor="introduction">나의 소개</SectionTitle>
            <StyledTextarea
              id="introduction"
              value={portfolioData.personalInfo.introduction}
              onChange={(e) => handleInputChange('personalInfo', 'introduction', e.target.value)}
              placeholder="본인을 소개해보세요"
            />
          </div>
          {/* 경력 */}
          <div style={{ marginBottom: '32px' }}>
            <SectionTitle>경력</SectionTitle>
            {experiences.map((exp, idx) => (
              <div key={idx} style={{ background: '#bfc5ce', borderRadius: 10, padding: 16, marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={exp.company} onChange={e => handleExperienceChange(idx, 'company', e.target.value)} placeholder="기관명" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                  <input value={exp.date} onChange={e => handleExperienceChange(idx, 'date', e.target.value)} placeholder="재직기간" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                </div>
                <textarea value={exp.description} onChange={e => handleExperienceChange(idx, 'description', e.target.value)} placeholder="직무 및 특기 작성사항" style={{ width: '100%', minHeight: 60, borderRadius: 6, border: '1px solid #ccc', padding: 8 }} />
              </div>
            ))}
            <button type="button" onClick={addExperience} style={{ width: '100%', background: '#4a5263', color: '#fff', border: 'none', borderRadius: 8, padding: 8, fontSize: 20, marginBottom: 24 }}>+</button>
          </div>

          {/* 프로젝트 */}
          <div style={{ marginBottom: '32px' }}>
            <SectionTitle>프로젝트</SectionTitle>
            {projects.map((p, idx) => (
              <div key={idx} style={{ background: '#bfc5ce', borderRadius: 10, padding: 16, marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={p.title} onChange={e => handleProjectChange(idx, 'title', e.target.value)} placeholder="프로젝트 명" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                  <input value={p.date} onChange={e => handleProjectChange(idx, 'date', e.target.value)} placeholder="프로젝트 기간" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                </div>
                <textarea value={p.description} onChange={e => handleProjectChange(idx, 'description', e.target.value)} placeholder="프로젝트 내용" style={{ width: '100%', minHeight: 60, borderRadius: 6, border: '1px solid #ccc', padding: 8 }} />
              </div>
            ))}
            <button type="button" onClick={addProject} style={{ width: '100%', background: '#4a5263', color: '#fff', border: 'none', borderRadius: 8, padding: 8, fontSize: 20, marginBottom: 24 }}>+</button>
          </div>

          {/* 자격증 */}
          <div style={{ marginBottom: '32px' }}>
            <SectionTitle>자격증</SectionTitle>
            {certificates.map((c, idx) => (
              <div key={idx} style={{ background: '#bfc5ce', borderRadius: 10, padding: 16, marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={c.name} onChange={e => handleCertificateChange(idx, 'name', e.target.value)} placeholder="자격증 이름" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                  <input value={c.issuer} onChange={e => handleCertificateChange(idx, 'issuer', e.target.value)} placeholder="발급기관" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                  <input value={c.date} onChange={e => handleCertificateChange(idx, 'date', e.target.value)} placeholder="취득일" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                </div>
              </div>
            ))}
            <button type="button" onClick={addCertificate} style={{ width: '100%', background: '#4a5263', color: '#fff', border: 'none', borderRadius: 8, padding: 8, fontSize: 20, marginBottom: 24 }}>+</button>
          </div>

          {/* 외국어 */}
          <div style={{ marginBottom: '32px' }}>
            <SectionTitle>외국어</SectionTitle>
            {languages.map((l, idx) => (
              <div key={idx} style={{ background: '#bfc5ce', borderRadius: 10, padding: 16, marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={l.name} onChange={e => handleLanguageChange(idx, 'name', e.target.value)} placeholder="언어명" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                  <input value={l.level} onChange={e => handleLanguageChange(idx, 'level', e.target.value)} placeholder="수준" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                </div>
              </div>
            ))}
            <button type="button" onClick={addLanguage} style={{ width: '100%', background: '#4a5263', color: '#fff', border: 'none', borderRadius: 8, padding: 8, fontSize: 20, marginBottom: 24 }}>+</button>
          </div>

          {/* 대외활동 */}
          <div style={{ marginBottom: '32px' }}>
            <SectionTitle>대외 활동</SectionTitle>
            {activities.map((a, idx) => (
              <div key={idx} style={{ background: '#bfc5ce', borderRadius: 10, padding: 16, marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={a.title} onChange={e => handleActivityChange(idx, 'title', e.target.value)} placeholder="활동명" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                </div>
                <textarea value={a.description} onChange={e => handleActivityChange(idx, 'description', e.target.value)} placeholder="활동 설명" style={{ width: '100%', minHeight: 60, borderRadius: 6, border: '1px solid #ccc', padding: 8 }} />
              </div>
            ))}
            <button type="button" onClick={addActivity} style={{ width: '100%', background: '#4a5263', color: '#fff', border: 'none', borderRadius: 8, padding: 8, fontSize: 20, marginBottom: 24 }}>+</button>
          </div>
        </div>
      </div>

      {/* 모달 구현 */}
      {showKeywordModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>키워드 선택</ModalTitle>
            <div style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 8 }}>
              {KEYWORD_LIST.map((kw) => (
                <div key={kw} style={{ marginBottom: 4 }}>
                  <label>
                    <input type="checkbox" checked={tempChecked.includes(kw)} onChange={() => handleTempCheck(kw)} /> {kw}
                  </label>
                </div>
              ))}
            </div>
            <ModalButtonRow>
              <button onClick={closeModal} style={{ border: '1px solid #bbb', background: '#fff', borderRadius: 6, padding: '4px 16px', cursor: 'pointer' }}>취소</button>
              <button onClick={() => handleModalAdd('keyword')} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 16px', cursor: 'pointer' }}>추가</button>
            </ModalButtonRow>
          </ModalBox>
        </ModalOverlay>
      )}
      {showSkillModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>기술 스택 선택</ModalTitle>
            <div style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 8 }}>
              {SKILL_LIST.map((sk) => (
                <div key={sk} style={{ marginBottom: 4 }}>
                  <label>
                    <input type="checkbox" checked={tempChecked.includes(sk)} onChange={() => handleTempCheck(sk)} /> {sk}
                  </label>
                </div>
              ))}
            </div>
            <ModalButtonRow>
              <button onClick={closeModal} style={{ border: '1px solid #bbb', background: '#fff', borderRadius: 6, padding: '4px 16px', cursor: 'pointer' }}>취소</button>
              <button onClick={() => handleModalAdd('skill')} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 16px', cursor: 'pointer' }}>추가</button>
            </ModalButtonRow>
          </ModalBox>
        </ModalOverlay>
      )}
      {showJobModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>직군/직무 선택</ModalTitle>
            <div style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 8 }}>
              {JOB_LIST.map((job: any) => (
                <div key={job} style={{ marginBottom: 4 }}>
                  <label>
                    <input type="checkbox" checked={tempChecked.includes(job)} onChange={() => handleTempCheck(job)} /> {job}
                  </label>
                </div>
              ))}
            </div>
            <ModalButtonRow>
              <button onClick={closeModal} style={{ border: '1px solid #bbb', background: '#fff', borderRadius: 6, padding: '4px 16px', cursor: 'pointer' }}>취소</button>
              <button onClick={() => handleModalAdd('job')} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 16px', cursor: 'pointer' }}>추가</button>
            </ModalButtonRow>
          </ModalBox>
        </ModalOverlay>
      )}

      <Footer />
    </>
  );
};

export default PortfolioCreate; 