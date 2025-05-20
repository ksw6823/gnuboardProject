import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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

// 드래그&드롭용 태그 카테고리
const TAG_CATEGORIES = [
  { id: 'basic', label: '기본 정보' },
  { id: 'tech', label: '기술 스택' },
  { id: 'exp', label: '수행경험' },
  { id: 'career', label: '이력' },
  { id: 'cert', label: '자격증' },
  { id: 'intro', label: '자기소개서' },
  { id: 'lang', label: '언어' },
];

interface Skill { id: number; name: string; }
interface Keyword { id: number; name: string; }
interface Section { id: string; type: string; title: string; content: string; order: number; }

const TemplateSelector = styled.select`
  padding: 8px 16px;
  margin: 1rem 0;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background-color: white;
`;

const TemplateContainer = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
`;

const PortfolioWrite: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // 프로필/기본정보
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [summary, setSummary] = useState('');
  const [title, setTitle] = useState('');
  // 키워드/기술스택
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  // 섹션(드래그&드롭)
  const [sections, setSections] = useState<Section[]>([]);
  // 드래그 상태
  const [draggedTag, setDraggedTag] = useState<string | null>(null);
  // 모달 상태
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [tempKeyword, setTempKeyword] = useState<number[]>([]);
  const [tempSkill, setTempSkill] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('default');

  // 내 정보 불러오기
  const loadProfile = () => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      // phone 등 추가 정보 필요시 user에서 불러오기
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

  // 모달 오픈 시 임시 선택값 초기화
  const openKeywordModal = () => {
    setTempKeyword(selectedKeywords);
    setShowKeywordModal(true);
  };
  const openSkillModal = () => {
    setTempSkill(selectedSkills);
    setShowSkillModal(true);
  };

  // 모달 체크박스 토글
  const toggleTempKeyword = (id: number) => {
    setTempKeyword(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);
  };
  const toggleTempSkill = (id: number) => {
    setTempSkill(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  // 모달에서 추가 버튼 클릭 시 반영
  const applyKeyword = () => {
    setSelectedKeywords(tempKeyword);
    setShowKeywordModal(false);
  };
  const applySkill = () => {
    setSelectedSkills(tempSkill);
    setShowSkillModal(false);
  };

  // 태그 드래그 시작
  const onDragStart = (type: string) => setDraggedTag(type);
  // 태그 드롭
  const onDrop = () => {
    if (draggedTag) {
      setSections([...sections, {
        id: uuidv4(),
        type: draggedTag,
        title: '',
        content: '',
        order: sections.length,
      }]);
      setDraggedTag(null);
    }
  };

  // 섹션 내용 변경
  const updateSection = (id: string, field: 'title' | 'content', value: string) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    ));
  };
  // 섹션 삭제
  const removeSection = (id: string) => setSections(sections.filter(s => s.id !== id));

  // 저장 함수 추가
  const handleSave = async () => {
    const formData = new FormData();
    // 기본 정보
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('summary', summary);
    formData.append('title', title);
    // 프로필 이미지
    if (profileImg) {
      formData.append('profileImg', profileImg);
    }
    // 키워드/기술스택/섹션
    formData.append('keywords', JSON.stringify(selectedKeywords));
    formData.append('skills', JSON.stringify(selectedSkills));
    formData.append('sections', JSON.stringify(sections));

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

  // 템플릿 데이터 변환 함수
  const convertToTemplateData = (): PortfolioData => {
    return {
      personalInfo: {
        name,
        title,
        email,
        phone,
        location: '', // 위치 정보가 없는 경우 빈 문자열로 설정
        introduction: summary,
        profileImage: profileImg ? URL.createObjectURL(profileImg) : '',
      },
      skills: skills
        .filter(skill => selectedSkills.includes(skill.id))
        .map(skill => ({
          name: skill.name,
          level: '',
        })),
      experiences: sections
        .filter(section => section.type === 'experience')
        .map(section => {
          const content = JSON.parse(section.content);
          return {
            title: content.title,
            company: content.company,
            date: content.period,
            description: content.description,
          };
        }),
      education: sections
        .filter(section => section.type === 'education')
        .map(section => {
          const content = JSON.parse(section.content);
          return {
            school: content.school,
            degree: content.degree,
            date: content.period,
            description: content.description,
          };
        }),
      projects: sections
        .filter(section => section.type === 'project')
        .map(section => {
          const content = JSON.parse(section.content);
          return {
            title: content.title,
            description: content.description,
            technologies: content.technologies || [],
            link: content.link || '',
          };
        }),
      certificates: sections
        .filter(section => section.type === 'certificate')
        .map(section => {
          const content = JSON.parse(section.content);
          return {
            name: content.name,
            issuer: content.issuer,
            date: content.date,
          };
        }),
      languages: sections
        .filter(section => section.type === 'language')
        .map(section => {
          const content = JSON.parse(section.content);
          return {
            name: content.name,
            level: content.level,
          };
        }),
      activities: sections
        .filter(section => section.type === 'activity')
        .map(section => {
          const content = JSON.parse(section.content);
          return {
            title: content.title,
            description: content.description,
          };
        }),
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
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f8fa' }}>
        {/* 중앙: 입력 폼 */}
        <div style={{ flex: 1, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 520, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: 32 }}>
            {/* 제목 입력란 */}
            <div style={{ marginBottom: 16 }}>
              <input type="text" placeholder="포트폴리오 제목" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: 12, border: '1px solid #bbb', borderRadius: 8, fontSize: 18, fontWeight: 600 }} />
            </div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Logo</div>
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
              <button type="button" onClick={loadProfile} style={{ fontSize: 13, color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 8 }}>내 정보 불러오기</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <input type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 6, marginBottom: 8 }} />
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input type="text" placeholder="국가" value="" disabled style={{ width: 60, padding: 10, border: '1px solid #eee', borderRadius: 6, background: '#f5f5f5' }} />
                <input type="text" placeholder="01012345678" value={phone} onChange={e => setPhone(e.target.value)} style={{ flex: 1, padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
              </div>
              <input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <textarea placeholder="한줄 소개" value={summary} onChange={e => setSummary(e.target.value)} style={{ width: '100%', minHeight: 60, padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            </div>
            {/* 키워드 선택 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontWeight: 500 }}>나의 키워드</div>
                <button type="button" onClick={openKeywordModal} style={{ marginLeft: 8, fontSize: 13, padding: '2px 12px', borderRadius: 16, border: '1px solid #bbb', background: '#f8f9fa', cursor: 'pointer' }}>추가</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {keywords.filter(k => selectedKeywords.includes(k.id)).map(k => (
                  <span key={k.id} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid #ddd', background: '#007bff', color: '#fff', fontSize: 14 }}>{k.name}</span>
                ))}
              </div>
            </div>
            {/* 기술스택 선택 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontWeight: 500 }}>기술 스택</div>
                <button type="button" onClick={openSkillModal} style={{ marginLeft: 8, fontSize: 13, padding: '2px 12px', borderRadius: 16, border: '1px solid #bbb', background: '#f8f9fa', cursor: 'pointer' }}>추가</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.filter(s => selectedSkills.includes(s.id)).map(s => (
                  <span key={s.id} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid #ddd', background: '#007bff', color: '#fff', fontSize: 14 }}>{s.name}</span>
                ))}
              </div>
            </div>
            {/* 정보 추가(드래그&드롭) */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 6 }}>정보 추가</div>
              <div onDragOver={e => e.preventDefault()} onDrop={onDrop} style={{ minHeight: 80, border: '2px dashed #bbb', borderRadius: 8, background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                {sections.length === 0 && <div style={{ color: '#bbb', fontSize: 14 }}>오른쪽 태그를 끌어와 작성</div>}
                {sections.map(section => (
                  <div key={section.id} style={{ width: '100%', background: '#f9f9fc', border: '1px solid #eee', borderRadius: 8, margin: '8px 0', padding: 12, position: 'relative' }}>
                    <input type="text" placeholder="제목" value={section.title} onChange={e => updateSection(section.id, 'title', e.target.value)} style={{ width: '100%', marginBottom: 8, padding: 8, border: '1px solid #ddd', borderRadius: 6 }} />
                    <ReactQuill value={section.content} onChange={v => updateSection(section.id, 'content', v)} style={{ height: 120, marginBottom: 8 }} />
                    <button type="button" onClick={() => removeSection(section.id)} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', color: '#888', fontSize: 18, cursor: 'pointer' }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* 우측: 태그/테마/저장 등 */}
        <div style={{ width: 220, background: '#eaf3fa', borderLeft: '1px solid #e0e6ed', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button style={{ width: '100%', marginBottom: 16, padding: 10, borderRadius: 8, border: '1px solid #bcd', background: '#fff', fontWeight: 500, cursor: 'pointer' }}>테마 설정</button>
          <div style={{ width: '100%', marginBottom: 24 }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>태그</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TAG_CATEGORIES.map(tag => (
                <div key={tag.id} draggable onDragStart={() => onDragStart(tag.id)} style={{ padding: '10px 0', borderRadius: 8, background: '#fff', border: '1px solid #bcd', textAlign: 'center', fontWeight: 500, cursor: 'grab', userSelect: 'none' }}>{tag.label}</div>
              ))}
            </div>
          </div>
          <button style={{ width: '100%', marginBottom: 8, padding: 10, borderRadius: 8, border: '1px solid #bcd', background: '#fff', fontWeight: 500, cursor: 'pointer' }} onClick={handleSave}>저장</button>
          <button style={{ width: '100%', marginBottom: 8, padding: 10, borderRadius: 8, border: '1px solid #bcd', background: '#fff', fontWeight: 500, cursor: 'pointer' }}>불러오기</button>
          <button style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #bcd', background: '#fff', fontWeight: 500, cursor: 'pointer' }}>PDF / 프린트 인쇄</button>
        </div>
      </div>
      {/* 키워드 모달 */}
      {showKeywordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>키워드 선택</div>
            <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
              {keywords.map(k => (
                <label key={k.id} style={{ display: 'block', marginBottom: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={tempKeyword.includes(k.id)} onChange={() => toggleTempKeyword(k.id)} style={{ marginRight: 8 }} />
                  {k.name}
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowKeywordModal(false)} style={{ padding: '6px 18px', borderRadius: 6, border: '1px solid #bbb', background: '#f8f9fa', cursor: 'pointer' }}>취소</button>
              <button onClick={applyKeyword} style={{ padding: '6px 18px', borderRadius: 6, border: '1px solid #007bff', background: '#007bff', color: '#fff', cursor: 'pointer' }}>추가</button>
            </div>
          </div>
        </div>
      )}
      {/* 기술스택 모달 */}
      {showSkillModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>기술 스택 선택</div>
            <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
              {skills.map(s => (
                <label key={s.id} style={{ display: 'block', marginBottom: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={tempSkill.includes(s.id)} onChange={() => toggleTempSkill(s.id)} style={{ marginRight: 8 }} />
                  {s.name}
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowSkillModal(false)} style={{ padding: '6px 18px', borderRadius: 6, border: '1px solid #bbb', background: '#f8f9fa', cursor: 'pointer' }}>취소</button>
              <button onClick={applySkill} style={{ padding: '6px 18px', borderRadius: 6, border: '1px solid #007bff', background: '#007bff', color: '#fff', cursor: 'pointer' }}>추가</button>
            </div>
          </div>
        </div>
      )}
      {/* 템플릿 미리보기 섹션 */}
      <TemplateContainer>
        <h2 style={{ marginBottom: '1rem' }}>템플릿 미리보기</h2>
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
        <SelectedTemplate data={convertToTemplateData()} />
      </TemplateContainer>
      <Footer />
    </>
  );
};

export default PortfolioWrite; 