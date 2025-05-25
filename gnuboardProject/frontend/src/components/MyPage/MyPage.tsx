import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
}

interface Portfolio {
  id: number;
  title: string;
  summary: string;
  photo?: string;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUserData();
    fetchUserPortfolios();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/users/me');
      setUser(response.data);
      setFormData(prev => ({
        ...prev,
        name: response.data.name,
        email: response.data.email,
      }));
    } catch (error) {
      console.error('사용자 정보를 불러오는데 실패했습니다:', error);
    }
  };

  const fetchUserPortfolios = async () => {
    try {
      const response = await axios.get('/users/me/portfolios');
      setPortfolios(response.data);
    } catch (error) {
      console.error('포트폴리오를 불러오는데 실패했습니다:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('/users/me', {
        name: formData.name,
        email: formData.email,
      });
      setIsEditing(false);
      fetchUserData();
      alert('프로필이 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 업데이트에 실패했습니다:', error);
      alert('프로필 업데이트에 실패했습니다.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await axios.put('/users/me/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      alert('비밀번호가 변경되었습니다.');
    } catch (error) {
      console.error('비밀번호 변경에 실패했습니다:', error);
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await axios.delete('/users/me');
        localStorage.removeItem('token');
        navigate('/login');
      } catch (error) {
        console.error('계정 삭제에 실패했습니다:', error);
        alert('계정 삭제에 실패했습니다.');
      }
    }
  };

  if (!user) return <div>로딩 중...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>마이페이지</h1>
      
      <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>프로필 정보</h2>
        {!isEditing ? (
          <div>
            <p><strong>이름:</strong> {user.name}</p>
            <p><strong>이메일:</strong> {user.email}</p>
            <button onClick={() => setIsEditing(true)} style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer' }}>
              수정하기
            </button>
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate}>
            <div style={{ marginBottom: '1rem' }}>
              <label>이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>이메일</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
            </div>
            <button type="submit" style={{ background: '#28a745', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer', marginRight: '0.5rem' }}>
              저장
            </button>
            <button type="button" onClick={() => setIsEditing(false)} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer' }}>
              취소
            </button>
          </form>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>비밀번호 변경</h2>
        <form onSubmit={handlePasswordChange}>
          <div style={{ marginBottom: '1rem' }}>
            <label>현재 비밀번호</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>새 비밀번호</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>새 비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </div>
          <button type="submit" style={{ background: '#28a745', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer' }}>
            비밀번호 변경
          </button>
        </form>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>내 포트폴리오</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {portfolios.map(portfolio => (
            <div key={portfolio.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: '1rem' }}>
              {portfolio.photo && (
                <img
                  src={`${process.env.REACT_APP_API_URL}/${portfolio.photo.replace('\\', '/')}`}
                  alt={portfolio.title}
                  style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 4, marginBottom: '0.5rem' }}
                />
              )}
              <h3 style={{ marginBottom: '0.5rem' }}>{portfolio.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{portfolio.summary}</p>
              <button
                onClick={() => navigate(`/portfolio/${portfolio.id}`)}
                style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer', marginTop: '0.5rem' }}
              >
                보기
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#dc3545' }}>계정 삭제</h2>
        <p style={{ marginBottom: '1rem' }}>계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.</p>
        <button
          onClick={handleDeleteAccount}
          style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer' }}
        >
          계정 삭제
        </button>
      </div>
    </div>
  );
};

export default MyPage; 