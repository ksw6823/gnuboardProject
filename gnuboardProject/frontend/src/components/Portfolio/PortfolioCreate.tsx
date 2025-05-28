import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import { PortfolioData } from '../../types/portfolio';
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
interface Section { id: string; type: string; title: string; content: string; order: number; itemTitle?: string; }

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

// 섹션 제목 입력 스타일 추가
const SectionInputTitle = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px; /* 내용 입력란과의 간격 */
  font-size: 1rem;
`;

// 섹션 내용 입력 스타일 (기존 StyledTextarea 재활용)
// const StyledTextarea = styled.textarea`
//   width: 100%;
//   min-height: 120px;
//   padding: 10px;
//   border: 1px solid #ddd;
//   border-radius: 6px;
//   resize: vertical;
// `;

// SmallTextarea는 직무/직군용으로 유지
const SmallTextarea = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
  font-size: 14px;
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
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
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
    setSelectedKeywords(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);
  };

  // 기술스택 토글 함수
  const toggleSkill = (id: number) => {
    setSelectedSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  // 섹션 내용 변경 함수 수정 (제목 변경 기능 추가)
  const updateSectionContent = (id: string, field: 'itemTitle' | 'content', value: string) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  // 저장 함수 수정 (섹션 데이터 구조 변경 반영)
  const handleSave = async () => {
    const formData = new FormData();
    formData.append('summary', summary);
    formData.append('title', title);
    if (profileImg) {
      formData.append('profileImg', profileImg);
    }
    formData.append('keywords', JSON.stringify(selectedKeywords));
    formData.append('skills', JSON.stringify(selectedSkills));
    // 섹션 데이터 저장 형식 변경
    const sectionsToSave = sections.map(section => ({
      id: section.id,
      type: section.type,
      title: section.type === 'job' ? section.title : section.itemTitle, // 'job' 타입은 섹션 기본 타이틀 사용, 나머지는 입력한 itemTitle 사용
      content: section.content,
      order: section.order,
    }));
    formData.append('sections', JSON.stringify(sectionsToSave));

    try {
      await axios.post('/portfolios', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('저장되었습니다.');
      navigate('/');
    } catch (err) {
      alert('저장 실패');
    }
  };

  // 템플릿 데이터 변환 함수 수정 (섹션 데이터 구조 변경 반영)
  const convertToTemplateData = (): PortfolioData => {
    const findSection = (type: string) => sections.find(section => section.type === type);

    return {
      personalInfo: {
        name: '', // 입력 필드 제거로 빈 값 사용
        title,
        email: '', // 입력 필드 제거로 빈 값 사용
        phone: '', // 입력 필드 제거로 빈 값 사용
        location: '', // 위치 정보가 없는 경우 빈 문자열로 설정
        introduction: findSection('intro')?.content || '',
        profileImage: profileImg ? URL.createObjectURL(profileImg) : '',
      },
      skills: skills
        .filter(skill => selectedSkills.includes(skill.id))
        .map(skill => ({
          name: skill.name,
          level: '', // 스킬 레벨 정보가 없는 경우 빈 문자열로 설정
        })),
      // 섹션 데이터를 템플릿에서 사용하는 형식으로 변환
      experiences: sections.filter(s => s.type === 'career').map(s => ({
        title: s.itemTitle || '',
        company: '', // 입력 필드 없음
        date: '', // 입력 필드 없음
        description: s.content || '',
      })), // career를 experiences로 매핑
      education: sections.filter(s => s.type === 'education').map(s => ({
        school: s.itemTitle || '',
        degree: '', // 입력 필드 없음
        date: '', // 입력 필드 없음
        description: s.content || '',
      })), // education 섹션이 있다면 매핑
      projects: sections.filter(s => s.type === 'project').map(s => ({
        title: s.itemTitle || '',
        description: s.content || '',
        technologies: [], // 입력 필드 없음
      })), // project를 projects로 매핑
      certificates: sections.filter(s => s.type === 'cert').map(s => ({
        name: s.itemTitle || '', // name으로 매핑
        issuer: '', // 입력 필드 없음
        date: '', // 입력 필드 없음
      })), // cert를 certificates로 매핑
      languages: sections.filter(s => s.type === 'lang').map(s => ({
        name: s.itemTitle || '', // name으로 매핑
        level: '', // 입력 필드 없음
      })), // lang를 languages로 매핑
      keywords: keywords
        .filter(keyword => selectedKeywords.includes(keyword.id))
        .map(keyword => ({ name: keyword.name })),
      activities: sections.filter(s => s.type === 'activity').map(s => ({
        title: s.itemTitle || '',
        description: s.content || '',
      })), // activity를 activities로 매핑
      // job 섹션은 PortfolioData에 직접 매핑되지 않으므로 임시 제거
      // job: findSection('job')?.content || '',
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

  return (
    <>
      <Header />

      {/* 오른쪽 사이드바에 저장 버튼과 템플릿 드롭다운 배치 (fixed position) */}
      <RightSidebar>
        <SaveButton onClick={handleSave}>저장</SaveButton>
        <TemplateSelector
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
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
        </TemplateSelector>
      </RightSidebar>

      {/* 중앙: 입력 폼 (사이드바 너비만큼 마진 추가) */}
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f8fa', marginLeft: '200px' }}> {/* 사이드바 너비만큼 마진 */}
        <div style={{ flex: 1, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 520, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: 32 }}>
            {/* 포트폴리오 제목 - 기존 스타일 유지 */}
            <div style={{ marginBottom: 16 }}>
              <input type="text" placeholder="포트폴리오 제목" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: 12, border: '1px solid #bbb', borderRadius: 8, fontSize: 18, fontWeight: 600 }} />
            </div>

            {/* 프로필 이미지 및 기본 정보 (이름, 이메일) */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              {/* 이름과 이메일 표시 - user 객체에서 가져오도록 가정 */}
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{user?.name || '이름'}</div> {/* user.name 사용 예시 */}
              <div style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>{user?.email || '이메일'}</div> {/* user.email 사용 예시 */}
              
              <div>
                <label htmlFor="profileImg" style={{ display: 'inline-block', width: 100, height: 100, border: '1px dashed #bbb', borderRadius: 12, background: '#fafbfc', cursor: 'pointer', overflow: 'hidden', marginBottom: 8 }}>
                  {profilePreview ? (
                    <img src={profilePreview} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 14 }}>사진 추가</div>
                  )}
                  <input id="profileImg" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfileImg} />
                </label>
              </div>
              {/* 전화번호 및 내 정보 불러오기 버튼 제거 */}
              {/* <button type="button" onClick={loadProfile} style={{ fontSize: 13, color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 8 }}>내 정보 불러오기</button> */}
            </div>

            {/* 한줄 소개 입력란 - 기존 스타일 유지 */}
            <div style={{ marginBottom: 16 }}>
              <textarea placeholder="한줄 소개" value={summary} onChange={e => setSummary(e.target.value)} style={{ width: '100%', minHeight: 60, padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            </div>

            {/* 키워드 선택 - 스타일 수정 */}
            <SectionContainer>
              <SelectableHeader onClick={() => setShowKeywordList(!showKeywordList)}>
                나의 키워드 <span>{showKeywordList ? '-' : '+'}</span>
              </SelectableHeader>
              {showKeywordList && (
                <SelectableItemList>
                  {keywords.map(k => (
                    <SelectableItem key={k.id} selected={selectedKeywords.includes(k.id)} onClick={() => toggleKeyword(k.id)}>
                      {k.name}
                    </SelectableItem>
                  ))}
                </SelectableItemList>
              )}
              <SelectedTagsContainer>
                {keywords.filter(k => selectedKeywords.includes(k.id)).map(k => (
                  <SelectedTag key={k.id}>{k.name}</SelectedTag>
                ))}
              </SelectedTagsContainer>
            </SectionContainer>

            {/* 기술스택 선택 - 스타일 수정 */}
            <SectionContainer>
              <SelectableHeader onClick={() => setShowSkillList(!showSkillList)}>
                기술 스택 <span>{showSkillList ? '-' : '+'}</span>
              </SelectableHeader>
              {showSkillList && (
                <SelectableItemList>
                  {skills.map(s => (
                    <SelectableItem key={s.id} selected={selectedSkills.includes(s.id)} onClick={() => toggleSkill(s.id)}>
                      {s.name}
                    </SelectableItem>
                  ))}
                </SelectableItemList>
              )}
              <SelectedTagsContainer>
                {skills.filter(s => selectedSkills.includes(s.id)).map(s => (
                  <SelectedTag key={s.id}>{s.name}</SelectedTag>
                ))}
              </SelectedTagsContainer>
            </SectionContainer>

            {/* 고정된 섹션 입력 필드 - 제목/내용 분리 */}
            <div style={{ marginBottom: 16 }}>
              {sections.map(section => (
                <SectionContainer key={section.id}>
                  <SectionTitle>{section.title}</SectionTitle>
                  {section.type !== 'job' && (
                    <SectionInputTitle
                      type="text"
                      placeholder={`${section.title} 제목을 입력하세요.`}
                      value={section.itemTitle || ''}
                      onChange={(e) => updateSectionContent(section.id, 'itemTitle', e.target.value)}
                    />
                  )}
                  {section.type === 'job' ? (
                    <SmallTextarea
                      value={section.content}
                      onChange={(e) => updateSectionContent(section.id, 'content', e.target.value)}
                      placeholder="직무/직군을 입력해주세요."
                    />
                  ) : (
                    <StyledTextarea
                      value={section.content}
                      onChange={(e) => updateSectionContent(section.id, 'content', e.target.value)}
                      placeholder={`${section.title} 내용을 입력하세요.`}
                    />
                  )}
                </SectionContainer>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PortfolioCreate; 