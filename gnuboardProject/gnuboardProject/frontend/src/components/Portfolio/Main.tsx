import React, { useState } from 'react';
import Header from '../Common/Header';
import Footer from '../Common/Footer';

const dummySkills = [
  'React', 'Node.js', 'TypeScript', 'MySQL', 'PHP', 'AWS', 'Docker', 'Python', 'Java', 'Spring'
];

const dummyPortfolios = [
  {
    id: 1,
    title: 'AI 기반 산학협력 플랫폼',
    summary: 'AI를 활용한 산학협력 매칭 및 관리 시스템',
    photo: '',
    skills: ['React', 'Node.js', 'AWS']
  },
  {
    id: 2,
    title: '스마트 팩토리 데이터 분석',
    summary: '공장 데이터 수집 및 분석 자동화 솔루션',
    photo: '',
    skills: ['Python', 'Docker', 'MySQL']
  },
  // ...더미 데이터 추가 가능
];

const Main: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const filteredPortfolios = dummyPortfolios.filter(p => {
    const matchesTitle = p.title.includes(search) || p.summary.includes(search);
    const matchesSkills = selectedSkills.length === 0 || selectedSkills.every(s => p.skills.includes(s));
    return matchesTitle && matchesSkills;
  });

  return (
    <>
      <Header />
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
            {dummySkills.map(skill => (
              <label
                key={skill}
                className={`search-skill-item${selectedSkills.includes(skill) ? ' selected' : ''}`}
                style={{
                  display:'flex',alignItems:'center',gap:'0.5rem',background:selectedSkills.includes(skill)?'#007bff':'#f8f9fa',color:selectedSkills.includes(skill)?'#fff':'#444',border:'1px solid #ddd',borderColor:selectedSkills.includes(skill)?'#007bff':'#ddd',borderRadius:20,padding:'0.5rem 1rem',fontSize:'0.95rem',cursor:'pointer',transition:'all 0.2s'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedSkills.includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                  style={{width:16,height:16,accentColor:selectedSkills.includes(skill)?'#fff':'#007bff'}}
                />
                {skill}
              </label>
            ))}
          </div>
        </div>
      </section>
      {/* 포트폴리오 섹션 */}
      <section className="portfolio-section" style={{maxWidth:1200,margin:'0 auto',padding:'0 20px'}}>
        <div className="portfolio-grid-title" style={{fontSize:'1.3rem',fontWeight:600,color:'#333',marginBottom:'1.5rem'}}>최근 포트폴리오</div>
        <div className="portfolio-card-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1.5rem'}}>
          {filteredPortfolios.map(p => (
            <a
              key={p.id}
              href={`#portfolio/${p.id}`}
              className="portfolio-card-link portfolio-card-item"
              style={{textDecoration:'none',color:'inherit'}}
            >
              <div className="portfolio-card" style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 8px rgba(0,0,0,0.07)',transition:'box-shadow 0.2s,transform 0.2s'}}>
                <div className="portfolio-card-thumb" style={{background:'#e9eef3',height:90,width:'100%',borderRadius:'12px 12px 0 0'}}>
                  {/* 이미지가 있으면 출력 */}
                  {p.photo ? (
                    <img src={p.photo} alt="포트폴리오 이미지" style={{width:'100%',height:90,objectFit:'cover',borderRadius:'12px 12px 0 0'}} />
                  ) : null}
                </div>
                <div className="portfolio-card-body" style={{padding:'1rem'}}>
                  <div className="portfolio-card-title" style={{fontWeight:600,fontSize:'1.1rem',marginBottom:'0.5rem'}}>{p.title}</div>
                  <div className="portfolio-card-desc" style={{color:'#555',fontSize:'0.97rem',marginBottom:'0.7rem'}}>{p.summary}</div>
                  <div style={{marginTop:'0.7rem'}}>
                    {p.skills.map(sk => (
                      <span key={sk} style={{display:'inline-block',background:'#f1f3f5',color:'#007bff',borderRadius:8,padding:'0.2rem 0.7rem',fontSize:'0.92rem',marginRight:6}}># {sk}</span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
      {/* FAB 버튼 */}
      <a href="#create-portfolio" className="fab-btn" style={{position:'fixed',right:38,bottom:38,width:64,height:64,background:'#007bff',color:'#fff',borderRadius:'50%',boxShadow:'0 4px 16px rgba(0,0,0,0.13)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem',fontWeight:700,zIndex:2000,textDecoration:'none',transition:'background 0.2s, box-shadow 0.2s'}}>
        <span style={{lineHeight:1,marginTop:-2}}>+</span>
      </a>
      <Footer />
    </>
  );
};

export default Main; 