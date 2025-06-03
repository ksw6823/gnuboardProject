import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <header style={{
      background: '#86b6ff', // 파란 배경
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      minHeight: '60px',
      border: 'none',
      boxShadow: 'none',
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
        <Link to="/" style={{ fontSize: '2rem', fontWeight: 300, color: '#fff', textDecoration: 'none', letterSpacing: '0.5px' }}>
          PortFlow
        </Link>
        {/* 우측 메뉴 */}
        <ul style={{ display: 'flex', alignItems: 'center', listStyle: 'none', gap: '2.2rem', margin: 0, color: '#fff', fontWeight: 300, fontSize: '1rem' }}>
          {!isAuthenticated ? (
            <>
              <li style={{ color: '#fff', opacity: 0.9 }}>환영합니다!</li>
              <li><Link to="/login" style={{ textDecoration: 'none', color: '#fff' }}>로그인</Link></li>
              <li><Link to="/register" style={{ textDecoration: 'none', color: '#fff' }}>회원가입</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/admin" style={{ textDecoration: 'none', color: '#fff' }}>관리 페이지</Link></li>
              <li>
                <button onClick={handleLogout} style={{
                  background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 300, padding: 0
                }}>
                  로그아웃
                </button>
              </li>
<<<<<<< Updated upstream
              {user?.name && (
                <li style={{ color: '#333', fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
                  {user.name} 님
                </li>
              )}
=======
              <li style={{ color: '#fff' }}>{user?.name} 님</li>
>>>>>>> Stashed changes
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
