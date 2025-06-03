import React, { useRef, useState } from 'react';
import styled from 'styled-components';
<<<<<<< Updated upstream

const Bg = styled.div`
  min-height: 100vh;
  background: #f4f6fa;
=======
import { SectionDto } from '../../types/portfolio';

interface Skill {
  id: number;
  name: string;
}
interface Keyword {
  id: number;
  name: string;
}

const TemplatePreview = styled.div<{ template: string }>`
  .section {
    ${props => props.template === 'modern' && `
      background: #ffffff;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;

      &:hover {
        transform: translateY(-2px);
      }

      h4 {
        color: #2c3e50;
        font-size: 1.5rem;
        margin-bottom: 1rem;
        border-bottom: 2px solid #3498db;
        padding-bottom: 0.5rem;
      }
    `}

    ${props => props.template === 'minimal' && `
      padding: 1.5rem;
      margin-bottom: 2rem;
      border-left: 4px solid #e0e0e0;
      
      h4 {
        color: #424242;
        font-size: 1.3rem;
        margin-bottom: 1rem;
      }
    `}

    ${props => props.template === 'creative' && `
      background: #f8f9fa;
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(to bottom, #ff6b6b, #4ecdc4);
      }

      h4 {
        color: #2d3436;
        font-size: 1.4rem;
        margin-bottom: 1rem;
      }
    `}
  }
>>>>>>> Stashed changes
`;

const TopBar = styled.div`
  width: 100%;
  background: #b9c9f5;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff !important;
  letter-spacing: -1px;
`;

const TopBtnGroup = styled.div`
  display: flex;
  gap: 0.7rem;
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

<<<<<<< Updated upstream
const MainContent = styled.div`
  width: 100%;
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2.5rem 0;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 2.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Title = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #346bb3;
  margin-bottom: 0;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2.2rem;
  margin-bottom: 1.5rem;
`;

const ProfileImg = styled.div`
  width: 110px;
  height: 110px;
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
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
`;

const ProfileEmail = styled.div`
  font-size: 1rem;
  color: #868e96;
`;

const SectionLabel = styled.div`
  font-size: 1.08rem;
  font-weight: 600;
  color: #346bb3;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
`;

const BlueBar = styled.div`
  width: 3px;
  height: 18px;
  background: #4B89DC;
  display: inline-block;
  margin-right: 0.7rem;
  border-radius: 2px;
  vertical-align: middle;
`;

const TagRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.5rem;
`;

const AddBtn = styled.button`
  background: #f4f6fa;
  color: #4B89DC;
  border: 1.5px solid #4B89DC;
  border-radius: 16px;
  padding: 0.2rem 1.2rem;
  font-size: 1.1rem;
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

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 0.5rem;
  min-width: 200px;
  z-index: 1000;
`;

const DropdownItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background: #f8f9fa;
  }
`;

const PortfolioCreate: React.FC = () => {
  const keywordRef = useRef<HTMLDivElement>(null);
  const [keywordOpen, setKeywordOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const keywords = [
    '프론트엔드', '백엔드', '풀스택', '모바일', 'AI', '데이터',
    '클라우드', '보안', 'DevOps', 'UI/UX'
  ];

  const handleKeywordSelect = (keyword: string) => {
    if (!selectedKeywords.includes(keyword)) {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
    setKeywordOpen(false);
  };

  return (
    <Bg>
      <TopBar>
        <Logo>산학협력</Logo>
        <TopBtnGroup>
          <TopButton>임시 저장</TopButton>
          <TopButton>작성 완료</TopButton>
        </TopBtnGroup>
      </TopBar>
      <MainContent>
        <Card>
          <Title>내정보 수정</Title>
          {/* 프로필 */}
          <ProfileSection>
            <ProfileImg />
            <ProfileInfo>
              <ProfileName>홍길동</ProfileName>
              <ProfileEmail>이메일 gkarkhsdn@gmail.com</ProfileEmail>
            </ProfileInfo>
          </ProfileSection>

          {/* 나의 키워드 */}
          <div>
            <SectionLabel><BlueBar />나의 키워드</SectionLabel>
            <DropdownContainer ref={keywordRef}>
              <AddBtn
                onClick={e => {
                  e.stopPropagation();
                  setKeywordOpen(v => !v);
                }}
              >+</AddBtn>
              {keywordOpen && (
                <DropdownMenu>
                  {keywords.map(keyword => (
                    <DropdownItem
                      key={keyword}
                      onClick={() => handleKeywordSelect(keyword)}
                    >
                      {keyword}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )}
            </DropdownContainer>
            <TagRow>
              {selectedKeywords.map(keyword => (
                <AddBtn key={keyword}>{keyword}</AddBtn>
              ))}
            </TagRow>
          </div>

          {/* 직군/직무 */}
          <div>
            <SectionLabel><BlueBar />직군 / 직무</SectionLabel>
            <TagRow>
              <AddBtn>+</AddBtn>
            </TagRow>
          </div>

          {/* 기술 스택 */}
          <div>
            <SectionLabel><BlueBar />기술 스택</SectionLabel>
            <TagRow>
              <AddBtn>+</AddBtn>
            </TagRow>
          </div>

          {/* 나의 소개 */}
          <div>
            <SectionLabel><BlueBar />나의 소개</SectionLabel>
            <TextArea placeholder="자기소개를 입력하세요" />
          </div>

          {/* 경력 */}
          <div>
            <SectionLabel><BlueBar />경력</SectionLabel>
            <Row>
              <Input placeholder="회사명" />
              <Input placeholder="직위" />
            </Row>
            <Row>
              <Input placeholder="기간" />
            </Row>
            <Row>
              <Input placeholder="경력 내용" />
            </Row>
            <AddButton>+ 추가</AddButton>
          </div>

          {/* 프로젝트 */}
          <div>
            <SectionLabel><BlueBar />프로젝트</SectionLabel>
            <Row>
              <Input placeholder="프로젝트명" />
              <Input placeholder="프로젝트 기간" />
            </Row>
            <Row>
              <Input placeholder="프로젝트 내용" />
            </Row>
            <AddButton>+ 추가</AddButton>
          </div>

          {/* 자격증 */}
          <div>
            <SectionLabel><BlueBar />자격증</SectionLabel>
            <Row>
              <Input placeholder="자격증명" />
              <Input placeholder="발급기관" />
              <Input placeholder="취득일" />
            </Row>
            <AddButton>+ 추가</AddButton>
          </div>

          {/* 외국어 */}
          <div>
            <SectionLabel><BlueBar />외국어</SectionLabel>
            <Row>
              <Input placeholder="언어" />
              <Input placeholder="수준" />
            </Row>
            <AddButton>+ 추가</AddButton>
          </div>

          {/* 대외 활동 */}
          <div>
            <SectionLabel><BlueBar />대외 활동</SectionLabel>
            <Row>
              <Input placeholder="활동명" />
              <Input placeholder="활동기관" />
            </Row>
            <Row>
              <Input placeholder="활동 내용" />
            </Row>
            <AddButton>+ 추가</AddButton>
          </div>
        </Card>
      </MainContent>
    </Bg>
=======
type Section = SectionDto & { id?: number };

const PortfolioForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>([]);
  const [sections, setSections] = useState<Section[]>([{ type: '', content: '', skills: [], keywords: [], job: undefined }]);
  const [template, setTemplate] = useState('modern');

  useEffect(() => {
    axios.get('/skills').then(res => setSkills(res.data));
    axios.get('/keywords').then(res => setKeywords(res.data));
    if (id) {
      axios.get(`/portfolios/${id}`).then(res => {
        const p = res.data;
        setTitle(p.title);
        setSummary(p.summary);
        setPhotoUrl(p.photo ? `${process.env.REACT_APP_API_URL}/${p.photo.replace('\\','/')}` : '');
        setSelectedSkills(p.skills.map((s: Skill) => s.id));
        setSelectedKeywords(p.keywords.map((k: Keyword) => k.id));
        setSections(p.sections.length ? p.sections : [{ type: '', content: '', skills: [], keywords: [], job: undefined }]);
        setTemplate(p.template || 'modern');
      });
    }
  }, [id]);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setPhotoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSectionChange = (idx: number, field: keyof SectionDto, value: any) => {
    setSections(sections =>
      sections.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const addSection = () => {
    setSections([...sections, { type: '', content: '', skills: [], keywords: [], job: undefined }]);
  };

  const removeSection = (idx: number) => {
    setSections(sections => sections.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      summary,
      template,
      skills: selectedSkills.map(id => ({ id })),
      keywords: selectedKeywords.map(id => ({ id })),
      sections: sections.map((s) => ({
        type: s.type,
        content: s.content,
        skills: s.skills,
        keywords: s.keywords,
        job: s.job,
      })),
    };
    let portfolioId = id;
    if (!id) {
      const res = await axios.post('/portfolios', data);
      portfolioId = res.data.id;
    } else {
      await axios.patch(`/portfolios/${id}`, data);
      portfolioId = id;
    }
    if (photo) {
      const formData = new FormData();
      formData.append('file', photo);
      await axios.patch(`/portfolios/${portfolioId}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    alert('저장되었습니다.');
    navigate(`/portfolio/${portfolioId}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:700,margin:'2rem auto',background:'#fff',borderRadius:12,boxShadow:'0 2px 8px rgba(0,0,0,0.07)',padding:'2rem'}}>
      <h2 style={{fontSize:'1.5rem',fontWeight:700,marginBottom:'1.5rem'}}>{id ? '포트폴리오 수정' : '포트폴리오 작성'}</h2>
      <div style={{marginBottom:'2rem'}}>
        <label style={{display:'block',marginBottom:'1rem',fontWeight:600}}>템플릿 선택</label>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
          <TemplateOption selected={template === 'modern'} onClick={() => setTemplate('modern')}>
            <h3>Modern</h3>
            <p>깔끔하고 현대적인 디자인</p>
          </TemplateOption>
          <TemplateOption selected={template === 'minimal'} onClick={() => setTemplate('minimal')}>
            <h3>Minimal</h3>
            <p>심플하고 미니멀한 디자인</p>
          </TemplateOption>
          <TemplateOption selected={template === 'creative'} onClick={() => setTemplate('creative')}>
            <h3>Creative</h3>
            <p>창의적이고 독특한 디자인</p>
          </TemplateOption>
        </div>
      </div>
      <div style={{marginBottom:'1rem'}}>
        <label>제목</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} required style={{width:'100%',padding:'0.7rem',border:'1px solid #ddd',borderRadius:8}} />
      </div>
      <div style={{marginBottom:'1rem'}}>
        <label>요약</label>
        <textarea value={summary} onChange={e=>setSummary(e.target.value)} required style={{width:'100%',padding:'0.7rem',border:'1px solid #ddd',borderRadius:8}} />
      </div>
      <div style={{marginBottom:'1rem'}}>
        <label>대표 이미지</label><br/>
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
        {photoUrl && <img src={photoUrl} alt="미리보기" style={{width:'100%',maxHeight:200,objectFit:'cover',marginTop:'0.5rem',borderRadius:8}} />}
      </div>
      <div style={{marginBottom:'1rem'}}>
        <label>기술스택</label><br/>
        {skills.map(sk => (
          <label key={sk.id} style={{marginRight:10}}>
            <input type="checkbox" checked={selectedSkills.includes(sk.id)} onChange={() => setSelectedSkills(selectedSkills.includes(sk.id) ? selectedSkills.filter(i=>i!==sk.id) : [...selectedSkills, sk.id])} /> {sk.name}
          </label>
        ))}
      </div>
      <div style={{marginBottom:'1rem'}}>
        <label>키워드</label><br/>
        {keywords.map(kw => (
          <label key={kw.id} style={{marginRight:10}}>
            <input type="checkbox" checked={selectedKeywords.includes(kw.id)} onChange={() => setSelectedKeywords(selectedKeywords.includes(kw.id) ? selectedKeywords.filter(i=>i!==kw.id) : [...selectedKeywords, kw.id])} /> {kw.name}
          </label>
        ))}
      </div>
      <div style={{marginBottom:'1.5rem'}}>
        <label>섹션</label>
        <TemplatePreview template={template}>
          {sections.map((section, idx) => (
            <div key={idx} className="section">
              <input value={section.type} onChange={e=>handleSectionChange(idx,'type',e.target.value)} placeholder="섹션 제목" style={{width:'100%',marginBottom:8,padding:'0.5rem',border:'1px solid #ddd',borderRadius:6}} />
              <textarea value={section.content} onChange={e=>handleSectionChange(idx,'content',e.target.value)} placeholder="섹션 내용" style={{width:'100%',padding:'0.5rem',border:'1px solid #ddd',borderRadius:6}} />
              {sections.length > 1 && <button type="button" onClick={()=>removeSection(idx)} style={{marginTop:8,color:'#dc3545',background:'none',border:'none',cursor:'pointer'}}>삭제</button>}
            </div>
          ))}
        </TemplatePreview>
        <button type="button" onClick={addSection} style={{background:'#007bff',color:'#fff',border:'none',borderRadius:6,padding:'0.5rem 1rem',cursor:'pointer'}}>섹션 추가</button>
      </div>
      <button type="submit" style={{background:'#007bff',color:'#fff',border:'none',borderRadius:8,padding:'0.8rem 2rem',fontWeight:600,fontSize:'1.1rem',cursor:'pointer'}}>저장</button>
    </form>
>>>>>>> Stashed changes
  );
};

export default PortfolioCreate; 