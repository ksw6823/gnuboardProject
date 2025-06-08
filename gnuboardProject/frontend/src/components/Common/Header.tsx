import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();


  const handleLogout = () => {
    logout();
  };

  return (
    <header style={{
      background: '#ffffff', // 파란 배경
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      minHeight: '60px',
      border: 'none',
      boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.25)',
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0.7rem 2rem',
        position: 'relative',
      }}>
        {/* 좌측 PortFlow */}
        <Link to="/" style={{ fontSize: '2rem', fontWeight: 300, color: '#7DA9FF', textDecoration: 'none', letterSpacing: '0.5px' , textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
          PortFlow
        </Link>
        {/* 우측 메뉴 */}
        <ul style={{ display: 'flex', alignItems: 'center', listStyle: 'none', gap: '2.2rem', margin: 0, color: '#000000', fontWeight: 300, fontSize: '1rem' }}>
          {!isAuthenticated ? (
            <>
              <li style={{ color: '#000000', opacity: 0.9 }}>환영합니다!</li>
              <li><Link to="/login" style={{ textDecoration: 'none', color: '#000000' }}>로그인</Link></li>
              <li><Link to="/register" style={{ textDecoration: 'none', color: '#000000' }}>회원가입</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/mypage" style={{ textDecoration: 'none', color: '#000000' }}>마이 페이지</Link></li>
              <li>
                <button onClick={handleLogout} style={{
                  background: 'none', border: 'none', color: '#000000', cursor: 'pointer', fontSize: '1rem', fontWeight: 300, padding: 0
                }}>
                  로그아웃
                </button>
              </li>
              <li style={{ color: '#000000' }}>{user?.name} 님</li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
