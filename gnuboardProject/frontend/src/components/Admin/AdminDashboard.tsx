import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface Portfolio {
  id: number;
  title: string;
  user: {
    id: number;
    username: string;
  };
  createdAt: string;
}

interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    username: string;
  };
  portfolio: {
    id: number;
    title: string;
  };
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'portfolios' | 'comments'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          const usersResponse = await axios.get('/admin/users');
          setUsers(usersResponse.data);
          break;
        case 'portfolios':
          const portfoliosResponse = await axios.get('/admin/portfolios');
          setPortfolios(portfoliosResponse.data);
          break;
        case 'comments':
          const commentsResponse = await axios.get('/admin/comments');
          setComments(commentsResponse.data);
          break;
      }
    } catch (error) {
      console.error('데이터를 불러오는데 실패했습니다:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleAdmin = async (userId: number) => {
    try {
      await axios.patch(`/admin/users/${userId}/toggle-admin`);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
      ));
    } catch (error) {
      console.error('관리자 권한 변경에 실패했습니다:', error);
      alert('관리자 권한 변경에 실패했습니다.');
    }
  };

  const handleDeletePortfolio = async (portfolioId: number) => {
    if (!window.confirm('포트폴리오를 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`/admin/portfolios/${portfolioId}`);
      setPortfolios(portfolios.filter(p => p.id !== portfolioId));
    } catch (error) {
      console.error('포트폴리오 삭제에 실패했습니다:', error);
      alert('포트폴리오 삭제에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`/admin/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('댓글 삭제에 실패했습니다:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>관리자 대시보드</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            background: activeTab === 'users' ? '#007bff' : '#6c757d',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          사용자 관리
        </button>
        <button
          onClick={() => setActiveTab('portfolios')}
          style={{
            background: activeTab === 'portfolios' ? '#007bff' : '#6c757d',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          포트폴리오 관리
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          style={{
            background: activeTab === 'comments' ? '#007bff' : '#6c757d',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          댓글 관리
        </button>
      </div>

      {isLoading ? (
        <div>로딩 중...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          {activeTab === 'users' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>사용자 목록</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {users.map(user => (
                  <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #eee', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                      <div style={{ color: '#666' }}>{user.username}</div>
                      <div style={{ color: '#666' }}>{user.email}</div>
                    </div>
                    <button
                      onClick={() => handleToggleAdmin(user.id)}
                      style={{
                        background: user.isAdmin ? '#dc3545' : '#28a745',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      {user.isAdmin ? '관리자 해제' : '관리자 지정'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'portfolios' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>포트폴리오 목록</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {portfolios.map(portfolio => (
                  <div key={portfolio.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #eee', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{portfolio.title}</div>
                      <div style={{ color: '#666' }}>작성자: {portfolio.user.username}</div>
                      <div style={{ color: '#666' }}>작성일: {new Date(portfolio.createdAt).toLocaleDateString()}</div>
                    </div>
                    <button
                      onClick={() => handleDeletePortfolio(portfolio.id)}
                      style={{
                        background: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>댓글 목록</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {comments.map(comment => (
                  <div key={comment.id} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>작성자: {comment.user.username}</div>
                        <div style={{ color: '#666' }}>포트폴리오: {comment.portfolio.title}</div>
                        <div style={{ color: '#666' }}>작성일: {new Date(comment.createdAt).toLocaleDateString()}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{
                          background: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: 6,
                          cursor: 'pointer',
                        }}
                      >
                        삭제
                      </button>
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>{comment.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 