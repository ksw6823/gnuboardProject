import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

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
        {sections.map((section, idx) => (
          <div key={idx} style={{border:'1px solid #eee',borderRadius:8,padding:'1rem',marginBottom:'1rem'}}>
            <input value={section.title} onChange={e=>handleSectionChange(idx,'title',e.target.value)} placeholder="섹션 제목" style={{width:'100%',marginBottom:8,padding:'0.5rem',border:'1px solid #ddd',borderRadius:6}} />
            <textarea value={section.content} onChange={e=>handleSectionChange(idx,'content',e.target.value)} placeholder="섹션 내용" style={{width:'100%',padding:'0.5rem',border:'1px solid #ddd',borderRadius:6}} />
            {sections.length > 1 && <button type="button" onClick={()=>removeSection(idx)} style={{marginTop:8,color:'#dc3545',background:'none',border:'none',cursor:'pointer'}}>삭제</button>}
          </div>
        ))}
        <button type="button" onClick={addSection} style={{background:'#007bff',color:'#fff',border:'none',borderRadius:6,padding:'0.5rem 1rem',cursor:'pointer'}}>섹션 추가</button>
      </div>
      <button type="submit" style={{background:'#007bff',color:'#fff',border:'none',borderRadius:8,padding:'0.8rem 2rem',fontWeight:600,fontSize:'1.1rem',cursor:'pointer'}}>저장</button>
    </form>
  );
};

export default PortfolioForm; 