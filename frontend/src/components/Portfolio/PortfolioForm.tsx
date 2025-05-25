import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

interface Section {
  id?: number;
  title: string;
  content: string;
  order: number;
}

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
`;

const TemplateOption = styled.div<{ selected: boolean }>`
  border: 2px solid ${props => props.selected ? '#007bff' : '#ddd'};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
`;

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
  const [sections, setSections] = useState<Section[]>([{ title: '', content: '', order: 0 }]);
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
        setSections(p.sections.length ? p.sections : [{ title: '', content: '', order: 0 }]);
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

  const handleSectionChange = (idx: number, field: keyof Section, value: string) => {
    setSections(sections =>
      sections.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const addSection = () => {
    setSections([...sections, { title: '', content: '', order: sections.length }]);
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
      sections: sections.map((s, i) => ({ ...s, order: i })),
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
              <input value={section.title} onChange={e=>handleSectionChange(idx,'title',e.target.value)} placeholder="섹션 제목" style={{width:'100%',marginBottom:8,padding:'0.5rem',border:'1px solid #ddd',borderRadius:6}} />
              <textarea value={section.content} onChange={e=>handleSectionChange(idx,'content',e.target.value)} placeholder="섹션 내용" style={{width:'100%',padding:'0.5rem',border:'1px solid #ddd',borderRadius:6}} />
              {sections.length > 1 && <button type="button" onClick={()=>removeSection(idx)} style={{marginTop:8,color:'#dc3545',background:'none',border:'none',cursor:'pointer'}}>삭제</button>}
            </div>
          ))}
        </TemplatePreview>
        <button type="button" onClick={addSection} style={{background:'#007bff',color:'#fff',border:'none',borderRadius:6,padding:'0.5rem 1rem',cursor:'pointer'}}>섹션 추가</button>
      </div>
      <button type="submit" style={{background:'#007bff',color:'#fff',border:'none',borderRadius:8,padding:'0.8rem 2rem',fontWeight:600,fontSize:'1.1rem',cursor:'pointer'}}>저장</button>
    </form>
  );
};

export default PortfolioForm; 