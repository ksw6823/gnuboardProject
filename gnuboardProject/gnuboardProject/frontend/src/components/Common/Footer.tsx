import React from 'react';

const Footer: React.FC = () => (
  <footer style={{background:'#f8f9fa',color:'#888',padding:'1rem 0',textAlign:'center',fontSize:'0.95rem',marginTop:'2rem'}}>
    &copy; {new Date().getFullYear()} 산학협력 프로젝트 포트폴리오
  </footer>
);

export default Footer; 