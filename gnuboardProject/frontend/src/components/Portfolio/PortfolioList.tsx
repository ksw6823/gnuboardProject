import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Skill {
  id: number;
  name: string;
}

interface Portfolio {
  id: number;
  title: string;
  summary: string;
  photo?: string;
  skills: Skill[];
}

const PortfolioList: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [filtered, setFiltered] = useState<Portfolio[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    axios.get('/portfolios').then(res => {
      setPortfolios(res.data);
      setFiltered(res.data);
    });
    axios.get('/skills').then(res => setSkills(res.data));
  }, []);

  useEffect(() => {
    setFiltered(
      portfolios.filter(p => {
        const matchesTitle = p.title.includes(search) || p.summary.includes(search);
        const matchesSkills = selectedSkills.length === 0 || selectedSkills.every(sid => p.skills.some(sk => sk.id === sid));
        return matchesTitle && matchesSkills;
      })
    );
  }, [search, selectedSkills, portfolios]);

  const handleSkillToggle = (id: number) => {
    setSelectedSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  return (
    <>
      <Header />
      <div style={{background:'#f7f8fa',minHeight:'100vh'}}>
        {/* 검색 섹션 */}
        <section className="search-section" style={{background:'#fff',padding:'2rem 0',marginBottom:'2rem',boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}>
          <div className="search-container" style={{maxWidth:1200,margin:'0 auto',padding:'0 20px'}}>
            <div className="search-title" style={{fontSize:'1.5rem',fontWeight:600,color:'#333',marginBottom:'1.5rem'}}>포트폴리오 검색</div>
            <div className="search-input-wrap" style={{position:'relative',marginBottom:'1.5rem'}}>
              <input
                type="text"
                placeholder="관심있는 분야나 기술을 검색해보세요"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{width:'100%',padding:'1rem 1.5rem',paddingLeft:'3rem',border:'1px solid #ddd',borderRadius:12,fontSize:'1.1rem',background:'#f8f9fa'}}
              />
              <span style={{position:'absolute',left:'1.2rem',top:'50%',transform:'translateY(-50%)',fontSize:'1.2rem',color:'#666'}}>🔍</span>
            </div>
            <div className="search-skill-list" style={{display:'flex',flexWrap:'wrap',gap:'0.8rem',marginBottom:'0.5rem'}}>
              {skills.map(skill => (
                <label
                  key={skill.id}
                  className={`search-skill-item${selectedSkills.includes(skill.id) ? ' selected' : ''}`}
                  style={{
                    display:'flex',alignItems:'center',gap:'0.5rem',background:selectedSkills.includes(skill.id)?'#007bff':'#f8f9fa',color:selectedSkills.includes(skill.id)?'#fff':'#444',border:'1px solid #ddd',borderColor:selectedSkills.includes(skill.id)?'#007bff':'#ddd',borderRadius:20,padding:'0.5rem 1rem',fontSize:'0.95rem',cursor:'pointer',transition:'all 0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill.id)}
                    onChange={() => handleSkillToggle(skill.id)}
                    style={{width:16,height:16,accentColor:selectedSkills.includes(skill.id)?'#fff':'#007bff'}}
                  />
                  {skill.name}
                </label>
              ))}
            </div>
          </div>
        </section>
        {/* 포트폴리오 섹션 */}
        <section className="portfolio-section" style={{maxWidth:1200,margin:'0 auto',padding:'0 20px'}}>
          <div className="portfolio-grid-title" style={{fontSize:'1.3rem',fontWeight:600,color:'#333',marginBottom:'1.5rem'}}>최근 포트폴리오</div>
          <div className="portfolio-list-grid" style={{display:'flex',flexWrap:'wrap',gap:'2.5rem 2rem',justifyContent:'flex-start'}}>
            {filtered.slice(0,6).map(p => (
              <Link
                key={p.id}
                to={`/portfolios/${p.id}`}
                className="portfolio-card-link portfolio-card-item"
                style={{textDecoration:'none',color:'inherit',width:320,maxWidth:320,marginBottom:'2.5rem'}}
              >
                <div className="portfolio-card" style={{background:'#b8c7d1',borderRadius:18,boxShadow:'0 2px 8px rgba(0,0,0,0.07)',transition:'box-shadow 0.2s,transform 0.2s',height:260,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'1.2rem'}}>
                  {/* 썸네일 */}
                  <div style={{width:70,height:70,background:'#e9eef3',borderRadius:12,marginBottom:12,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                    {p.photo ? (
                      <img src={`${process.env.REACT_APP_API_URL}/${p.photo.replace('\\','/')}`} alt="포트폴리오 이미지" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    ) : null}
                  </div>
                  {/* 제목 */}
                  <div style={{fontWeight:700,fontSize:'1.13rem',marginBottom:6,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',width:'100%',textAlign:'center'}}>{p.title}</div>
                  {/* 요약 */}
                  <div style={{color:'#555',fontSize:'1.01rem',marginBottom:8,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',width:'100%',textAlign:'center'}}>{p.summary}</div>
                  {/* 기술스택 */}
                  <div style={{marginTop:2,display:'flex',flexWrap:'wrap',gap:4,justifyContent:'center'}}>
                    {p.skills && p.skills.map(sk => (
                      <span key={sk.id} style={{display:'inline-block',background:'#f1f3f5',color:'#007bff',borderRadius:8,padding:'0.15rem 0.6rem',fontSize:'0.97rem'}}># {sk.name}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        {/* FAB 버튼 */}
        {isAuthenticated && (
          <Link to="/portfolios/new" className="fab-btn" style={{position:'fixed',right:38,bottom:38,width:64,height:64,background:'#007bff',color:'#fff',borderRadius:'50%',boxShadow:'0 4px 16px rgba(0,0,0,0.13)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem',fontWeight:700,zIndex:2000,textDecoration:'none',transition:'background 0.2s, box-shadow 0.2s'}}>
            <span style={{lineHeight:1,marginTop:-2}}>+</span>
          </Link>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PortfolioList; 