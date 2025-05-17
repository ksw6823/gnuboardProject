import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000
    }}>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: 1200, margin: '0 auto', padding: '1rem 2rem', position: 'relative'
      }}>
        {/* 로고/홈버튼 */}
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff', textDecoration: 'none' }}>
          산학협력 프로젝트
        </Link>
        {/* 네비게이션 버튼 */}
        <ul style={{ display: 'flex', listStyle: 'none', gap: '1.5rem', margin: 0 }}>
          {!isAuthenticated ? (
            <>
              <li><Link to="/login" style={{ textDecoration: 'none', color: '#333' }}>로그인</Link></li>
              <li><Link to="/register" style={{ textDecoration: 'none', color: '#333' }}>회원가입</Link></li>
            </>
          ) : (
            <>
              <li>
                <Link to="/profile" style={{ textDecoration: 'none', color: '#333' }}>
                  {user?.name || '내 정보'}
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} style={{
                  background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '1rem'
                }}>
                  로그아웃
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
