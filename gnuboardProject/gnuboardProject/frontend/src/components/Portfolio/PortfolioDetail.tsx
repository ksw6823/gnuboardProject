import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
}

interface Section {
  id: number;
  title: string;
  content: string;
  order: number;
}

interface Portfolio {
  id: number;
  title: string;
  summary: string;
  photo?: string;
  skills: { id: number; name: string }[];
  keywords: { id: number; name: string }[];
  sections: Section[];
  user?: { id: number; username: string; name: string };
}

const PortfolioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const fetchPortfolio = async () => {
    try {
      const response = await api.get(`/portfolios/${id}`);
      setPortfolio(response.data);
    } catch (error) {
      console.error('포트폴리오를 불러오는데 실패했습니다:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/portfolios/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('댓글을 불러오는데 실패했습니다:', error);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const [countResponse, statusResponse] = await Promise.all([
        api.get(`/portfolios/${id}/likes/count`),
        api.get(`/portfolios/${id}/likes/status`),
      ]);
      setLikeCount(countResponse.data);
      setHasLiked(statusResponse.data);
    } catch (error) {
      console.error('좋아요 상태를 불러오는데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchComments();
    fetchLikeStatus();
  }, [fetchPortfolio, fetchComments, fetchLikeStatus]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    if (!isAuthenticated || !user) {
      alert('댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }

    try {
      const response = await api.post(`/portfolios/${id}/comments`, {
        content: newComment,
      });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성에 실패했습니다:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  const handleLikeClick = async () => {
    try {
      const response = await api.post(`/portfolios/${id}/likes`);
      setHasLiked(response.data.liked);
      setLikeCount(prev => response.data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('좋아요 처리에 실패했습니다:', error);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/portfolios/${id}/comments/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('댓글 삭제에 실패했습니다:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  if (!portfolio) return <div>로딩 중...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        {portfolio.photo && (
          <img
            src={`${process.env.REACT_APP_API_URL}/${portfolio.photo.replace('\\', '/')}`}
            alt={portfolio.title}
            style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8, marginBottom: '1.5rem' }}
          />
        )}
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{portfolio.title}</h1>
        <div style={{ color: '#666', marginBottom: '1.5rem' }}>
          작성자: {portfolio.user ? (portfolio.user.name || portfolio.user.username) : '알 수 없음'}
        </div>
        <div style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>{portfolio.summary}</div>
        <div style={{ marginBottom: '1rem' }}>
          {portfolio.skills && portfolio.skills.map(sk => (
            <span key={sk.id} style={{ display: 'inline-block', background: '#f1f3f5', color: '#007bff', borderRadius: 8, padding: '0.2rem 0.7rem', fontSize: '0.92rem', marginRight: 6 }}># {sk.name}</span>
          ))}
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          {portfolio.keywords && portfolio.keywords.map(kw => (
            <span key={kw.id} style={{ display: 'inline-block', background: '#e3f2fd', color: '#1976d2', borderRadius: 8, padding: '0.2rem 0.7rem', fontSize: '0.92rem', marginRight: 6 }}># {kw.name}</span>
          ))}
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>섹션</h3>
          {portfolio.sections.sort((a, b) => a.order - b.order).map(section => (
            <div key={section.id} style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{section.title}</h4>
              <div style={{ whiteSpace: 'pre-line', color: '#444' }}>{section.content}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={handleLikeClick}
            style={{
              background: hasLiked ? '#dc3545' : '#6c757d',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>❤️</span>
            <span>{likeCount}</span>
          </button>
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>댓글</h3>
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '1.5rem' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 작성하세요..."
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: 6, border: '1px solid #ddd' }}
              rows={3}
            />
            <button
              type="submit"
              style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer' }}
            >
              댓글 작성
            </button>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {comments.map(comment => (
              <div key={comment.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{comment.user ? comment.user.name : '알 수 없음'}</span>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    {new Date(comment.created_at).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p style={{ marginBottom: '0.5rem' }}>{comment.content}</p>
                {comment.user && portfolio.user && comment.user.id === portfolio.user.id && (
                  <button
                    onClick={() => handleCommentDelete(comment.id)}
                    style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetail; 