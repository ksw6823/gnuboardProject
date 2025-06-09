import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Header from '../Common/Header';
import { useAuth } from '../../contexts/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatPhone } from '../../utils/phoneFormat';

const Wrapper = styled.div`
  max-width: 730px;
  margin: 0 auto;
  padding: 2rem 0;
`;
const Section = styled.div`
  margin-bottom: 2.5rem;
`;
const SectionLabel = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
`;
const TagList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.7rem;
`;
const Tag = styled.span`
  background: #1976d2;
  color: #fff;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
`;
const RemoveTagBtn = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
`;
const AddBtn = styled.button`
  background: #f4f6fa;
  color: #1976d2;
  border: 1.5px solid #1976d2;
  border-radius: 24px;
  padding: 0.2rem 1.2rem;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 0.5rem;
`;
const Dropdown = styled.div`
  position: absolute;
  background: #fff;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  z-index: 100;
  padding: 1rem 0.5rem;
  min-width: 200px;
  margin-top: 0.5rem;
`;
const DropdownOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1.1rem;
  &:hover { background: #f4f6fa; }
`;

const SectionWrapper = styled.div`
  max-width: 730px;
  width: 100%;
  margin: 0 auto 2.5rem auto;
  background: #f7f9fc;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.5rem 1.5rem 1.2rem 1.5rem;
`;
const CardRow = styled.div`
  display: flex;
  gap: 0.7rem;
  margin-bottom: 0.6rem;
`;
const CardInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.7rem 1.2rem;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  font-size: 1.08rem;
  background: #fff;
`;
const CardTextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.7rem 1.2rem;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  font-size: 1.08rem;
  background: #fff;
  resize: vertical;
  margin-right: 0;
  box-sizing: border-box;
`;
const CardButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 0.7rem;
  margin-bottom: 1.2rem;
`;
const CardAddButton = styled.button`
  background: #3a5fc8;
  color: #fff;
  border: none;
  border-radius: 8px;
  width: 100%;
  margin: 0 auto;
  padding: 0.6rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #2b4fa2;
  }
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

const ProfilePreviewWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2.2rem;
  margin: 2.5rem auto 2.5rem auto;
  max-width: 730px;
  background: #f7f9fc;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 2.2rem 2.5rem;
`;
const ProfileImg = styled.img`
  width: 120px;
  height: 160px;
  border-radius: 16px;
  object-fit: cover;
  background: #e0e0e0;
`;
const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;
const ProfileName = styled.div`
  font-size: 1.7rem;
  font-weight: 700;
  color: #1976d2;
`;
const ProfileEmail = styled.div`
  font-size: 1.1rem;
  color: #444;
`;

const FixedSaveButton = styled.button`
  position: fixed;
  top: 110px;
  right: 4vw;
  z-index: 2000;
  background: #3a5fc8;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.9rem 2.2rem;
  font-size: 1.15rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(80,120,255,0.10);
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  &:hover { background: #2b4fa2; }
`;

const TitleInput = styled.input`
  width: 100%;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 1.2rem 1.2rem;
  border: 1.5px solid #b0b0b0;
  border-radius: 10px;
  margin-bottom: 2.2rem;
  margin-top: 1.2rem;
  background: #fff;
`;

// 생년월일 포맷 변환 함수 추가
const formatBirth = (birth: string | undefined) => {
  if (!birth) return '-';
  // YYYY-MM-DD → YY. MM. DD
  const [y, m, d] = birth.split('-');
  return `${y?.slice(2)}. ${m}. ${d}`;
};

const PortfolioCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // 선택값
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [selectedKeywordIds, setSelectedKeywordIds] = useState<number[]>([]);
  // 옵션
  const [jobOptions, setJobOptions] = useState<{id: number, name: string}[]>([]);
  const [skillOptions, setSkillOptions] = useState<{id: number, name: string}[]>([]);
  const [keywordOptions, setKeywordOptions] = useState<{id: number, name: string}[]>([]);
  // 드롭다운 오픈 상태
  const [jobOpen, setJobOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [keywordOpen, setKeywordOpen] = useState(false);
  // 임시 선택값
  const [tempSelectedJobId, setTempSelectedJobId] = useState<number | null>(null);
  const [tempSelectedSkillIds, setTempSelectedSkillIds] = useState<number[]>([]);
  const [tempSelectedKeywordIds, setTempSelectedKeywordIds] = useState<number[]>([]);
  // 기타 입력값
  const [intro, setIntro] = useState('');
  // Section별 입력 상태
  type Period = { startDate: Date | null, endDate: Date | null };
  type Experience = { company: string, position: string, period: Period, description: string, isConfirmed: boolean };
  type Project = { name: string, period: Period, description: string, isConfirmed: boolean };
  type Activity = { name: string, org: string, period: Period, description: string, isConfirmed: boolean };
  const [experiences, setExperiences] = useState<Experience[]>([
    { company: '', position: '', period: { startDate: null, endDate: null }, description: '', isConfirmed: false }
  ]);
  const [projects, setProjects] = useState<Project[]>([
    { name: '', period: { startDate: null, endDate: null }, description: '', isConfirmed: false }
  ]);
  const [certificates, setCertificates] = useState([
    { name: '', level: '', issuer: '', isConfirmed: false }
  ]);
  const [languages, setLanguages] = useState([
    { name: '', level: '', isConfirmed: false }
  ]);
  const [activities, setActivities] = useState<Activity[]>([
    { name: '', org: '', period: { startDate: null, endDate: null }, description: '', isConfirmed: false }
  ]);
  // 제목
  const [title, setTitle] = useState('');
  // 학력
  const [educations, setEducations] = useState([
    { school: '', major: '', startDate: null as Date | null, endDate: null as Date | null, degree: '재학중', isConfirmed: false }
  ]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    axios.get('/jobs')
      .then(res => setJobOptions(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Failed to load jobs:', err);
        setJobOptions([]);
      });
    
    axios.get('/skills')
      .then(res => setSkillOptions(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Failed to load skills:', err);
        setSkillOptions([]);
      });
    
    axios.get('/keywords')
      .then(res => setKeywordOptions(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Failed to load keywords:', err);
        setKeywordOptions([]);
      });
  }, []);

  // 드롭다운 열기 시 임시값 초기화
  const openKeywordDropdown = () => {
    setTempSelectedKeywordIds(selectedKeywordIds || []);
    setKeywordOpen(true);
  };
  const openJobDropdown = () => {
    setTempSelectedJobId(selectedJobId);
    setJobOpen(true);
  };
  const openSkillDropdown = () => {
    setTempSelectedSkillIds(selectedSkillIds || []);
    setSkillOpen(true);
  };

  // 임시 선택 핸들러
  const handleTempJobChange = (id: number) => setTempSelectedJobId(id);
  const handleTempSkillChange = (id: number) => setTempSelectedSkillIds(prev => (prev || []).includes(id) ? (prev || []).filter(s => s !== id) : [...(prev || []), id]);
  const handleTempKeywordChange = (id: number) => setTempSelectedKeywordIds(prev => (prev || []).includes(id) ? (prev || []).filter(k => k !== id) : [...(prev || []), id]);

  // 추가 버튼 클릭 시 실제 선택값에 반영
  const applyKeywordSelection = () => {
    setSelectedKeywordIds(tempSelectedKeywordIds || []);
    setKeywordOpen(false);
  };
  const applyJobSelection = () => {
    setSelectedJobId(tempSelectedJobId);
    setJobOpen(false);
  };
  const applySkillSelection = () => {
    setSelectedSkillIds(tempSelectedSkillIds || []);
    setSkillOpen(false);
  };

  // 드롭다운 닫기 시 임시값 초기화
  const closeKeywordDropdown = () => {
    setKeywordOpen(false);
    setTempSelectedKeywordIds([]);
  };
  const closeJobDropdown = () => {
    setJobOpen(false);
    setTempSelectedJobId(null);
  };
  const closeSkillDropdown = () => {
    setSkillOpen(false);
    setTempSelectedSkillIds([]);
  };

  // 태그 X 버튼
  const removeKeyword = (id: number) => setSelectedKeywordIds(prev => (prev || []).filter(k => k !== id));
  const removeSkill = (id: number) => setSelectedSkillIds(prev => (prev || []).filter(s => s !== id));
  const removeJob = () => setSelectedJobId(null);

  // Section별 핸들러
  // 추가
  const handleAddExperience = () => setExperiences([...experiences, { company: '', position: '', period: { startDate: null, endDate: null }, description: '', isConfirmed: false }]);
  const handleAddProject = () => setProjects([...projects, { name: '', period: { startDate: null, endDate: null }, description: '', isConfirmed: false }]);
  const handleAddCertificate = () => setCertificates([...certificates, { name: '', level: '', issuer: '', isConfirmed: false }]);
  const handleAddLanguage = () => setLanguages([...languages, { name: '', level: '', isConfirmed: false }]);
  const handleAddActivity = () => setActivities([...activities, { name: '', org: '', period: { startDate: null, endDate: null }, description: '', isConfirmed: false }]);
  const handleAddEducation = () => setEducations([...educations, { school: '', major: '', startDate: null, endDate: null, degree: '재학중', isConfirmed: false }]);
  // 값 변경
  const handleExperienceChange = (idx: number, field: string, value: any) => setExperiences(experiences.map((exp, i) => i === idx ? { ...exp, [field]: value } : exp));
  const handleProjectChange = (idx: number, field: string, value: any) => setProjects(projects.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  const handleCertificateChange = (idx: number, field: string, value: string) => setCertificates(certificates.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  const handleLanguageChange = (idx: number, field: string, value: string) => setLanguages(languages.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  const handleActivityChange = (idx: number, field: string, value: any) => setActivities(activities.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  const handleEducationChange = (idx: number, field: string, value: any) => setEducations(educations.map((edu, i) => i === idx ? { ...edu, [field]: value } : edu));
  // 삭제
  const handleRemoveExperience = (idx: number) => setExperiences(experiences.filter((_, i) => i !== idx));
  const handleRemoveProject = (idx: number) => setProjects(projects.filter((_, i) => i !== idx));
  const handleRemoveCertificate = (idx: number) => setCertificates(certificates.filter((_, i) => i !== idx));
  const handleRemoveLanguage = (idx: number) => setLanguages(languages.filter((_, i) => i !== idx));
  const handleRemoveActivity = (idx: number) => setActivities(activities.filter((_, i) => i !== idx));
  const handleRemoveEducation = (idx: number) => setEducations(educations.filter((_, i) => i !== idx));
  // 확인/수정
  const handleConfirmExperience = (idx: number) => setExperiences(experiences.map((exp, i) => i === idx ? { ...exp, isConfirmed: true } : exp));
  const handleEditExperience = (idx: number) => setExperiences(experiences.map((exp, i) => i === idx ? { ...exp, isConfirmed: false } : exp));
  const handleConfirmProject = (idx: number) => setProjects(projects.map((p, i) => i === idx ? { ...p, isConfirmed: true } : p));
  const handleEditProject = (idx: number) => setProjects(projects.map((p, i) => i === idx ? { ...p, isConfirmed: false } : p));
  const handleConfirmCertificate = (idx: number) => setCertificates(certificates.map((c, i) => i === idx ? { ...c, isConfirmed: true } : c));
  const handleEditCertificate = (idx: number) => setCertificates(certificates.map((c, i) => i === idx ? { ...c, isConfirmed: false } : c));
  const handleConfirmLanguage = (idx: number) => setLanguages(languages.map((l, i) => i === idx ? { ...l, isConfirmed: true } : l));
  const handleEditLanguage = (idx: number) => setLanguages(languages.map((l, i) => i === idx ? { ...l, isConfirmed: false } : l));
  const handleConfirmActivity = (idx: number) => setActivities(activities.map((a, i) => i === idx ? { ...a, isConfirmed: true } : a));
  const handleEditActivity = (idx: number) => setActivities(activities.map((a, i) => i === idx ? { ...a, isConfirmed: false } : a));
  const handleConfirmEducation = (idx: number) => setEducations(educations.map((edu, i) => i === idx ? { ...edu, isConfirmed: true } : edu));
  const handleEditEducation = (idx: number) => setEducations(educations.map((edu, i) => i === idx ? { ...edu, isConfirmed: false } : edu));

  // 저장
  const handleSave = async () => {
    setErrorMsg('');
    if (!title.trim()) {
      setErrorMsg('제목을 입력해주세요.');
      return;
    }
    if (!selectedKeywordIds || selectedKeywordIds.length === 0) {
      setErrorMsg('키워드를 1개 이상 선택해주세요.');
      return;
    }
    if (selectedJobId === null) {
      setErrorMsg('직무/직군을 선택해주세요.');
      return;
    }
    if (!selectedSkillIds || selectedSkillIds.length === 0) {
      setErrorMsg('기술스택을 1개 이상 선택해주세요.');
      return;
    }
    if (!intro.trim()) {
      setErrorMsg('소개를 입력해주세요.');
      return;
    }
    // Section 데이터 준비
    const sections: any[] = [];
    educations.filter(e => e.isConfirmed && e.school).forEach(e => {
      sections.push({
        type: 'education',
        content: JSON.stringify({
          school: e.school || '',
          major: e.major || '',
          startDate: e.startDate ? e.startDate.toISOString().slice(0, 10) : '',
          endDate: e.endDate ? e.endDate.toISOString().slice(0, 10) : '',
          degree: e.degree || ''
        })
      });
    });
    experiences.filter(e => e.isConfirmed && e.company && e.position && e.period?.startDate).forEach(e => {
      sections.push({
        type: 'experience',
        content: JSON.stringify({
          ...e,
          period: {
            startDate: e.period && e.period.startDate instanceof Date ? e.period.startDate.toISOString().slice(0, 10) : '',
            endDate: e.period && e.period.endDate instanceof Date ? e.period.endDate.toISOString().slice(0, 10) : ''
          }
        })
      });
    });
    projects.filter(p => p.isConfirmed && p.name && p.period?.startDate).forEach(p => {
      sections.push({
        type: 'project',
        content: JSON.stringify({
          ...p,
          period: {
            startDate: p.period && p.period.startDate instanceof Date ? p.period.startDate.toISOString().slice(0, 10) : '',
            endDate: p.period && p.period.endDate instanceof Date ? p.period.endDate.toISOString().slice(0, 10) : ''
          }
        })
      });
    });
    certificates.filter(c => c.isConfirmed && c.name).forEach(c => {
      sections.push({ type: 'certificate', content: JSON.stringify(c) });
    });
    languages.filter(l => l.isConfirmed && l.name).forEach(l => {
      sections.push({ type: 'language', content: JSON.stringify(l) });
    });
    activities.filter(a => a.isConfirmed && a.name && a.org && a.period?.startDate).forEach(a => {
      sections.push({
        type: 'activity',
        content: JSON.stringify({
          ...a,
          period: {
            startDate: a.period && a.period.startDate instanceof Date ? a.period.startDate.toISOString().slice(0, 10) : '',
            endDate: a.period && a.period.endDate instanceof Date ? a.period.endDate.toISOString().slice(0, 10) : ''
          }
        })
      });
    });
    // 저장 요청 (JSON)
    await axios.post(
      '/portfolios',
      {
        title,
        userId: user ? String(user.id) : '',
        is_private: false,
        jobs: selectedJobId !== null ? [selectedJobId] : [],
        skills: selectedSkillIds,
        keywords: selectedKeywordIds,
        intro,
        sections,
        user: user ? { id: user.id, name: user.name, email: user.email, username: user.username } : undefined,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      }
    );
    navigate('/');
  };

  return (
    <>
      <Header />
      {user && (
        <ProfilePreviewWrapper>
          {user.profileImage && user.profileImage !== '' ? (
            <ProfileImg src={user.profileImage.startsWith('http') ? user.profileImage : `${process.env.REACT_APP_API_URL}/${user.profileImage}`} alt="프로필" />
          ) : (
            <ProfileImg as="div" style={{background:'#e0e0e0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem',color:'#aaa',width:120,height:160,borderRadius:16}}>
              <span role="img" aria-label="user">👤</span>
          </ProfileImg>
          )}
          <ProfileInfo>
            <ProfileName>{user.name || '-'}</ProfileName>
            <div style={{ fontSize: '1.15rem', color: '#222', marginBottom: 2 }}>{user.gender || '-'}</div>
            <div style={{ fontSize: '1.1rem', color: '#222', marginBottom: 2 }}>{formatBirth(user.birth)}</div>
                          <div style={{ fontSize: '1.1rem', color: '#222', marginBottom: 2 }}>{user.phone ? formatPhone(user.phone) : '-'}</div>
            <ProfileEmail>{user.email || '-'}</ProfileEmail>
          </ProfileInfo>
        </ProfilePreviewWrapper>
      )}
      <FixedSaveButton onClick={handleSave}>저장 및 게시</FixedSaveButton>
      {errorMsg && <div style={{ color: 'red', margin: '1rem 0', textAlign: 'center' }}>{errorMsg}</div>}
      <Wrapper>
        {/* 포트폴리오 제목 */}
        <TitleInput value={title} onChange={e => setTitle(e.target.value)} placeholder="포트폴리오 제목을 입력하세요" />
        {/* 키워드 */}
        <Section>
          <SectionLabel>나의 키워드</SectionLabel>
            <TagList>
            {(selectedKeywordIds || []).map(id => {
              const option = (keywordOptions || []).find(opt => opt.id === id);
              if (!option) return null;
              return (
                <Tag key={id}>{option.name}<RemoveTagBtn onClick={() => removeKeyword(id)}>×</RemoveTagBtn></Tag>
              );
            })}
            <div style={{ position: 'relative' }}>
              {(selectedKeywordIds || []).length < (keywordOptions || []).length && (
                <AddBtn onClick={openKeywordDropdown}>+</AddBtn>
              )}
              {keywordOpen && (
                <Dropdown>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>키워드 선택</div>
                  {(keywordOptions || []).map(option => (
                    <DropdownOption key={option.id}>
                      <input
                        type="checkbox"
                        checked={(tempSelectedKeywordIds || []).includes(option.id)}
                        onChange={() => handleTempKeywordChange(option.id)}
                        style={{ marginRight: '0.6rem' }}
                      />
                      {option.name}
                    </DropdownOption>
                  ))}
                  <AddBtn style={{ marginTop: 8 }} onClick={applyKeywordSelection}>추가</AddBtn>
                  <AddBtn style={{ marginTop: 8, marginLeft: 8, background: '#eee', color: '#1976d2', borderColor: '#eee' }} onClick={closeKeywordDropdown}>취소</AddBtn>
                </Dropdown>
              )}
        </div>
            </TagList>
        </Section>
        {/* 직무/직군 */}
        <Section>
          <SectionLabel>직무 / 직군</SectionLabel>
          <TagList>
            {selectedJobId !== null ? (() => {
              const option = (jobOptions || []).find(opt => opt.id === selectedJobId);
              if (!option) return null;
              return (
                <Tag key={selectedJobId}>{option.name}<RemoveTagBtn onClick={removeJob}>×</RemoveTagBtn></Tag>
              );
            })() : null}
            <div style={{ position: 'relative' }}>
              {selectedJobId === null && (jobOptions || []).length > 0 && (
                <AddBtn onClick={openJobDropdown}>+</AddBtn>
              )}
              {jobOpen && (
                <Dropdown>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>직무 선택</div>
                  {(jobOptions || []).map(option => (
                    <DropdownOption key={option.id}>
                      <input
                        type="radio"
                        name="jobRadio"
                        checked={tempSelectedJobId === option.id}
                        onChange={() => handleTempJobChange(option.id)}
                        style={{ marginRight: '0.6rem' }}
                      />
                      {option.name}
                    </DropdownOption>
                  ))}
                  <AddBtn style={{ marginTop: 8 }} onClick={applyJobSelection}>추가</AddBtn>
                  <AddBtn style={{ marginTop: 8, marginLeft: 8, background: '#eee', color: '#1976d2', borderColor: '#eee' }} onClick={closeJobDropdown}>취소</AddBtn>
                </Dropdown>
              )}
        </div>
          </TagList>
        </Section>
        {/* 기술 스택 */}
        <Section>
          <SectionLabel>기술 스택</SectionLabel>
            <TagList>
            {(selectedSkillIds || []).map(id => {
              const option = (skillOptions || []).find(opt => opt.id === id);
              if (!option) return null;
              return (
                <Tag key={id}>{option.name}<RemoveTagBtn onClick={() => removeSkill(id)}>×</RemoveTagBtn></Tag>
              );
            })}
            <div style={{ position: 'relative' }}>
              {(selectedSkillIds || []).length < (skillOptions || []).length && (
                <AddBtn onClick={openSkillDropdown}>+</AddBtn>
              )}
              {skillOpen && (
                <Dropdown>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>기술스택 선택</div>
                  {(skillOptions || []).map(option => (
                    <DropdownOption key={option.id}>
                      <input
                        type="checkbox"
                        checked={(tempSelectedSkillIds || []).includes(option.id)}
                        onChange={() => handleTempSkillChange(option.id)}
                        style={{ marginRight: '0.6rem' }}
                      />
                      {option.name}
                    </DropdownOption>
                  ))}
                  <AddBtn style={{ marginTop: 8 }} onClick={applySkillSelection}>추가</AddBtn>
                  <AddBtn style={{ marginTop: 8, marginLeft: 8, background: '#eee', color: '#1976d2', borderColor: '#eee' }} onClick={closeSkillDropdown}>취소</AddBtn>
                </Dropdown>
              )}
            </div>
          </TagList>
        </Section>
        {/* 소개 */}
        <Section>
          <SectionLabel>나의 소개</SectionLabel>
          <textarea style={{ width: '100%', minHeight: 120, fontSize: '1.1rem', borderRadius: 8, border: '1.5px solid #b0b0b0', padding: '1rem', resize: 'vertical' }}
            value={intro} onChange={e => setIntro(e.target.value)} placeholder="자기소개를 입력하세요" />
        </Section>
        {/* 학력 */}
        <SectionWrapper>
          <SectionLabel>학력</SectionLabel>
          {educations.filter(edu => edu.isConfirmed).map((edu, idx, arr) => (
            <div key={idx} style={{ padding: '1.2rem 0.5rem 1.2rem 0.5rem', borderBottom: idx !== arr.length - 1 ? '1px solid #e0e0e0' : 'none', marginBottom: '0.7rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1.18rem', marginBottom: '0.2rem' }}>{edu.school}
                {(edu.startDate || edu.endDate) && (
                  <span style={{ color: '#b0b0b0', fontWeight: 400, fontSize: '0.98rem', marginLeft: '0.7rem' }}>
                    {edu.startDate ? (typeof edu.startDate === 'string' ? edu.startDate : edu.startDate.toLocaleDateString()) : ''}
                    ~
                    {edu.endDate ? (typeof edu.endDate === 'string' ? edu.endDate : edu.endDate.toLocaleDateString()) : ''}
                  </span>
                )}
              </div>
              <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: '0.1rem' }}>{edu.major} {edu.degree && `(${edu.degree})`}</div>
              <div style={{ marginTop: '0.7rem', textAlign: 'right' }}>
                <ConfirmButton as="button" style={{ background: '#eee', color: '#1976d2' }} onClick={() => handleEditEducation(educations.findIndex(e => e === edu))}>수정</ConfirmButton>
                <DeleteButton onClick={() => handleRemoveEducation(educations.findIndex(e => e === edu))}>삭제</DeleteButton>
              </div>
            </div>
          ))}
          {/* 입력폼(확인 안 된 항목) */}
          {educations.filter(edu => !edu.isConfirmed).map((edu, idx) => {
            const realIdx = educations.findIndex((e, i) => !e.isConfirmed && educations.slice(0, i+1).filter(x => !x.isConfirmed).length-1 === idx);
            return (
              <div key={realIdx} style={{ marginBottom: '0' }}>
                <CardRow>
                  <CardInput value={edu.school} onChange={e => handleEducationChange(realIdx, 'school', e.target.value)} placeholder="학교명" />
                  <CardInput value={edu.major} onChange={e => handleEducationChange(realIdx, 'major', e.target.value)} placeholder="전공" />
                </CardRow>
                <CardRow>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 50, flex: 2 }}>
                    <DatePicker
                      selected={edu.startDate}
                      onChange={(date: Date | null) => handleEducationChange(realIdx, 'startDate', date)}
                      selectsStart
                      startDate={edu.startDate ? edu.startDate : undefined}
                      endDate={edu.endDate ? edu.endDate : undefined}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="시작일"
                      customInput={<CardInput />}
                    />
                    <span style={{ margin: '0 4px' }}>~</span>
                    <DatePicker
                      selected={edu.endDate}
                      onChange={(date: Date | null) => handleEducationChange(realIdx, 'endDate', date)}
                      selectsEnd
                      startDate={edu.startDate ? edu.startDate : undefined}
                      endDate={edu.endDate ? edu.endDate : undefined}
                      minDate={edu.startDate ? edu.startDate : undefined}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="종료일"
                      disabled={edu.degree === '재학중'}
                      customInput={<CardInput />}
                    />
                  </div>
                </CardRow>
                <CardRow>
                  <select
                    value={edu.degree}
                    onChange={e => {
                      const value = e.target.value;
                      setEducations(educations.map((item, i) =>
                        i === realIdx
                          ? {
                              ...item,
                              degree: value,
                              endDate: value === '재학중' ? null : item.endDate
                            }
                          : item
                      ));
                    }}
                    style={{ flex: 1, padding: '0.7rem 1.2rem', border: '1.5px solid #e9ecef', borderRadius: 8, fontSize: '1.08rem', background: '#fff' }}
                  >
                    <option value="재학중">재학중</option>
                    <option value="졸업">졸업</option>
                  </select>
                </CardRow>
                <CardButtonRow>
                  <div />
              <div>
                    <ConfirmButton onClick={() => handleConfirmEducation(realIdx)}>확인</ConfirmButton>
                    <DeleteButton onClick={() => handleRemoveEducation(realIdx)}>삭제</DeleteButton>
        </div>
                </CardButtonRow>
              </div>
            );
          })}
          <CardAddButton onClick={handleAddEducation}>+ 추가</CardAddButton>
        </SectionWrapper>
        {/* 경력 */}
        <SectionWrapper>
          <SectionLabel>경력</SectionLabel>
            {experiences.filter(exp => exp.isConfirmed).map((exp, idx, arr) => (
              <div key={idx} style={{ padding: '1.2rem 0.5rem 1.2rem 0.5rem', borderBottom: idx !== arr.length - 1 ? '1px solid #e0e0e0' : 'none', marginBottom: '0.7rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.18rem', marginBottom: '0.2rem' }}>
                  {exp.company}
                {(exp.period && (exp.period.startDate || exp.period.endDate)) && (
                  <span style={{ color: '#b0b0b0', fontWeight: 400, fontSize: '0.98rem', marginLeft: '0.7rem' }}>
                    {exp.period.startDate ? (exp.period.startDate instanceof Date ? exp.period.startDate.toISOString().slice(0, 10) : '') : ''}
                    {exp.period.startDate || exp.period.endDate ? ' ~ ' : ''}
                    {exp.period.endDate ? (exp.period.endDate instanceof Date ? exp.period.endDate.toISOString().slice(0, 10) : '') : ''}
                  </span>
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
        {/* 입력폼(확인 안 된 항목) */}
        {experiences.filter(exp => !exp.isConfirmed).map((exp, idx) => {
          // experiences에서 isConfirmed가 false인 항목의 실제 인덱스
          const realIdx = experiences.findIndex((e, i) => !e.isConfirmed && experiences.slice(0, i+1).filter(x => !x.isConfirmed).length-1 === idx);
          return (
              <div key={realIdx} style={{ marginBottom: '0' }}>
              <CardRow>
                <CardInput value={exp.company} onChange={e => handleExperienceChange(realIdx, 'company', e.target.value)} placeholder="기업명" />
                <CardInput value={exp.position} onChange={e => handleExperienceChange(realIdx, 'position', e.target.value)} placeholder="직위/직급" />
                </CardRow>
                <CardRow>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 50, flex: 2 }}>
                    <DatePicker
                      selected={exp.period.startDate}
                      onChange={(date: Date | null) => handleExperienceChange(realIdx, 'period', { ...exp.period, startDate: date })}
                      selectsStart
                      startDate={exp.period.startDate ? exp.period.startDate : undefined}
                      endDate={exp.period.endDate ? exp.period.endDate : undefined}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="시작일"
                      customInput={<CardInput />}
                    />
                    <span style={{ margin: '0 4px' }}>~</span>
                    <DatePicker
                      selected={exp.period.endDate}
                      onChange={(date: Date | null) => handleExperienceChange(realIdx, 'period', { ...exp.period, endDate: date })}
                      selectsEnd
                      startDate={exp.period.startDate ? exp.period.startDate : undefined}
                      endDate={exp.period.endDate ? exp.period.endDate : undefined}
                      minDate={exp.period.startDate ? exp.period.startDate : undefined}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="종료일"
                      customInput={<CardInput />}
                    />
                  </div>
              </CardRow>
              <CardTextArea value={exp.description} onChange={e => handleExperienceChange(realIdx, 'description', e.target.value)} placeholder="주요 업무 및 성과(선택)" />
              <CardButtonRow>
                <div />
                <div>
                  <ConfirmButton onClick={() => handleConfirmExperience(realIdx)}>확인</ConfirmButton>
                  <DeleteButton onClick={() => handleRemoveExperience(realIdx)}>삭제</DeleteButton>
                </div>
              </CardButtonRow>
              </div>
          );
        })}
          <CardAddButton onClick={handleAddExperience}>+ 추가</CardAddButton>
        </SectionWrapper>
        {/* 프로젝트 */}
        <SectionWrapper>
          <SectionLabel>프로젝트</SectionLabel>
            {projects.filter(p => p.isConfirmed).map((p, idx, arr) => (
              <div key={idx} style={{ padding: '1.2rem 0.5rem 1.2rem 0.5rem', borderBottom: idx !== arr.length - 1 ? '1px solid #e0e0e0' : 'none', marginBottom: '0.7rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.18rem', marginBottom: '0.2rem' }}>{p.name}
                {(p.period && (p.period.startDate || p.period.endDate)) && (
                  <span style={{ color: '#b0b0b0', fontWeight: 400, fontSize: '0.98rem', marginLeft: '0.7rem' }}>
                    {p.period.startDate ? (p.period.startDate instanceof Date ? p.period.startDate.toISOString().slice(0, 10) : '') : ''}
                    {p.period.startDate || p.period.endDate ? ' ~ ' : ''}
                    {p.period.endDate ? (p.period.endDate instanceof Date ? p.period.endDate.toISOString().slice(0, 10) : '') : ''}
                  </span>
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
        {/* 입력폼(확인 안 된 항목) */}
        {projects.filter(p => !p.isConfirmed).map((p, idx) => {
          const realIdx = projects.findIndex((x, i) => !x.isConfirmed && projects.slice(0, i+1).filter(y => !y.isConfirmed).length-1 === idx);
          return (
              <div key={realIdx} style={{ marginBottom: '0' }}>
              <CardRow>
                <CardInput value={p.name} onChange={e => handleProjectChange(realIdx, 'name', e.target.value)} placeholder="프로젝트명" />
                </CardRow>
                <CardRow>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 50, flex: 2 }}>
                    <DatePicker
                      selected={p.period.startDate}
                      onChange={(date: Date | null) => handleProjectChange(realIdx, 'period', { ...p.period, startDate: date })}
                      selectsStart
                      startDate={p.period.startDate ? p.period.startDate : undefined}
                      endDate={p.period.endDate ? p.period.endDate : undefined}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="시작일"
                      customInput={<CardInput />}
                    />
                    <span style={{ margin: '0 4px' }}>~</span>
                    <DatePicker
                      selected={p.period.endDate}
                      onChange={(date: Date | null) => handleProjectChange(realIdx, 'period', { ...p.period, endDate: date })}
                      selectsEnd
                      startDate={p.period.startDate ? p.period.startDate : undefined}
                      endDate={p.period.endDate ? p.period.endDate : undefined}
                      minDate={p.period.startDate ? p.period.startDate : undefined}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="종료일"
                      customInput={<CardInput />}
                    />
                  </div>
              </CardRow>
              <CardTextArea value={p.description} onChange={e => handleProjectChange(realIdx, 'description', e.target.value)} placeholder="프로젝트 내용" />
              <CardButtonRow>
                <div />
                <div>
                  <ConfirmButton onClick={() => handleConfirmProject(realIdx)}>확인</ConfirmButton>
                  <DeleteButton onClick={() => handleRemoveProject(realIdx)}>삭제</DeleteButton>
                </div>
              </CardButtonRow>
              </div>
          );
        })}
          <CardAddButton onClick={handleAddProject}>+ 추가</CardAddButton>
        </SectionWrapper>
        {/* 자격증 */}
        <SectionWrapper>
          <SectionLabel>자격증</SectionLabel>
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
        {certificates.filter(c => !c.isConfirmed).map((c, idx) => {
          const realIdx = certificates.findIndex((x, i) => !x.isConfirmed && certificates.slice(0, i+1).filter(y => !y.isConfirmed).length-1 === idx);
          return (
              <div key={realIdx} style={{ marginBottom: '0' }}>
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
              </div>
          );
        })}
          <CardAddButton onClick={handleAddCertificate}>+ 추가</CardAddButton>
        </SectionWrapper>
        {/* 외국어 */}
        <SectionWrapper>
          <SectionLabel>외국어</SectionLabel>
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
        {languages.filter(l => !l.isConfirmed).map((l, idx) => {
          const realIdx = languages.findIndex((x, i) => !x.isConfirmed && languages.slice(0, i+1).filter(y => !y.isConfirmed).length-1 === idx);
          return (
              <div key={realIdx} style={{ marginBottom: '0' }}>
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
              </div>
          );
        })}
          <CardAddButton onClick={handleAddLanguage}>+ 추가</CardAddButton>
        </SectionWrapper>
        {/* 대외 활동 */}
        <SectionWrapper>
          <SectionLabel>대외 활동</SectionLabel>
            {activities.filter(a => a.isConfirmed).map((a, idx, arr) => (
              <div key={idx} style={{ padding: '1.2rem 0.5rem 1.2rem 0.5rem', borderBottom: idx !== arr.length - 1 ? '1px solid #e0e0e0' : 'none', marginBottom: '0.7rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.18rem', marginBottom: '0.2rem' }}>{a.name}
                  {a.org && (
                    <span style={{ color: '#b0b0b0', fontWeight: 400, fontSize: '0.98rem', marginLeft: '0.7rem' }}>{a.org}</span>
                  )}
                {(a.period && (a.period.startDate || a.period.endDate)) && (
                  <span style={{ color: '#b0b0b0', fontWeight: 400, fontSize: '0.98rem', marginLeft: '0.7rem' }}>
                    {a.period.startDate ? (a.period.startDate instanceof Date ? a.period.startDate.toISOString().slice(0, 10) : '') : ''}
                    {a.period.startDate || a.period.endDate ? ' ~ ' : ''}
                    {a.period.endDate ? (a.period.endDate instanceof Date ? a.period.endDate.toISOString().slice(0, 10) : '') : ''}
                  </span>
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
        {activities.filter(a => !a.isConfirmed).map((a, idx) => {
          const realIdx = activities.findIndex((x, i) => !x.isConfirmed && activities.slice(0, i+1).filter(y => !y.isConfirmed).length-1 === idx);
          return (
              <div key={realIdx} style={{ marginBottom: '0' }}>
              <CardRow>
                <CardInput value={a.name} onChange={e => handleActivityChange(realIdx, 'name', e.target.value)} placeholder="활동명" />
                <CardInput value={a.org} onChange={e => handleActivityChange(realIdx, 'org', e.target.value)} placeholder="활동기관" />
                </CardRow>
                <CardRow>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 50, flex: 2 }}>
                    <DatePicker
                      selected={a.period.startDate}
                      onChange={(date: Date | null) => handleActivityChange(realIdx, 'period', { ...a.period, startDate: date })}
                      selectsStart
                      startDate={a.period.startDate ? a.period.startDate : undefined}
                      endDate={a.period.endDate ? a.period.endDate : undefined}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="시작일"
                      customInput={<CardInput />}
                    />
                    <span style={{ margin: '0 4px' }}>~</span>
                    <DatePicker
                      selected={a.period.endDate}
                      onChange={(date: Date | null) => handleActivityChange(realIdx, 'period', { ...a.period, endDate: date })}
                      selectsEnd
                      startDate={a.period.startDate ? a.period.startDate : undefined}
                      endDate={a.period.endDate ? a.period.endDate : undefined}
                      minDate={a.period.startDate ? a.period.startDate : undefined}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="종료일"
                      customInput={<CardInput />}
                    />
                  </div>
              </CardRow>
              <CardTextArea value={a.description} onChange={e => handleActivityChange(realIdx, 'description', e.target.value)} placeholder="활동 설명" />
              <CardButtonRow>
                <div />
                <div>
                  <ConfirmButton onClick={() => handleConfirmActivity(realIdx)}>확인</ConfirmButton>
                  <DeleteButton onClick={() => handleRemoveActivity(realIdx)}>삭제</DeleteButton>
            </div>
              </CardButtonRow>
              </div>
          );
        })}
          <CardAddButton onClick={handleAddActivity}>+ 추가</CardAddButton>
        </SectionWrapper>
      </Wrapper>
    </>
  );
};

export default PortfolioCreate; 