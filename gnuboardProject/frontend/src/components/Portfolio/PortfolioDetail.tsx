import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import { PortfolioData } from '../../types/portfolio';
// 템플릿 컴포넌트들 import
import DefaultTemplate from './templates/DefaultTemplate';
import DarkTemplate from './templates/DarkTemplate';
import GradientTemplate from './templates/GradientTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ArtTemplate from './templates/ArtTemplate';
import BrutalTemplate from './templates/BrutalTemplate';
import TabTemplate from './templates/TabTemplate';
import SplitTemplate from './templates/SplitTemplate';
import CardTemplate from './templates/CardTemplate';
import ClassicTemplate from './templates/ClassicTemplate';

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
  template: string;
  user?: { id: number; username: string; name: string };
}

// 템플릿별 스타일 컴포넌트
const ModernTemplate = styled.div`
  .section {
    background: #ffffff;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }

    h4 {
      color: #2c3e50;
      font-size: 1.5rem;
      margin-bottom: 1rem;
      border-bottom: 2px solid #3498db;
      padding-bottom: 0.5rem;
    }
  }
`;

const CreativeTemplate = styled.div`
  .section {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(to bottom, #ff6b6b, #4ecdc4);
    }

    h4 {
      color: #2d3436;
      font-size: 1.4rem;
      margin-bottom: 1rem;
    }
  }
`;

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

  // 템플릿 컴포넌트 매핑
  const templateComponents = {
    default: DefaultTemplate,
    dark: DarkTemplate,
    gradient: GradientTemplate,
    minimal: MinimalTemplate,
    art: ArtTemplate,
    brutal: BrutalTemplate,
    tab: TabTemplate,
    split: SplitTemplate,
    card: CardTemplate,
    classic: ClassicTemplate,
  };

  // 템플릿 데이터 변환 함수
  const convertToTemplateData = (): PortfolioData => {
    if (!portfolio) return {
      personalInfo: {
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        introduction: '',
        profileImage: '',
      },
      skills: [],
      experiences: [],
      education: [],
      projects: [],
      certificates: [],
      languages: [],
      activities: []
    };
    
    return {
      personalInfo: {
        name: portfolio.user?.name || '',
        title: portfolio.title,
        email: '',
        phone: '',
        location: '',
        introduction: portfolio.summary,
        profileImage: portfolio.photo ? `${process.env.REACT_APP_API_URL}/${portfolio.photo.replace('\\', '/')}` : '',
      },
      skills: portfolio.skills.map(skill => ({
        name: skill.name,
        level: '',
      })),
      experiences: portfolio.sections
        .filter(section => section.title.toLowerCase().includes('경력') || section.title.toLowerCase().includes('experience'))
        .map(section => ({
          title: section.title,
          company: '',
          date: '',
          description: section.content,
        })),
      education: portfolio.sections
        .filter(section => section.title.toLowerCase().includes('학력') || section.title.toLowerCase().includes('education'))
        .map(section => ({
          school: section.title,
          degree: '',
          date: '',
          description: section.content,
        })),
      projects: portfolio.sections
        .filter(section => section.title.toLowerCase().includes('프로젝트') || section.title.toLowerCase().includes('project'))
        .map(section => ({
          title: section.title,
          description: section.content,
          technologies: [],
          link: '',
        })),
      certificates: portfolio.sections
        .filter(section => section.title.toLowerCase().includes('자격증') || section.title.toLowerCase().includes('certificate'))
        .map(section => ({
          name: section.title,
          issuer: '',
          date: '',
        })),
      languages: portfolio.sections
        .filter(section => section.title.toLowerCase().includes('언어') || section.title.toLowerCase().includes('language'))
        .map(section => ({
          name: section.title,
          level: section.content,
        })),
      activities: portfolio.sections
        .filter(section => section.title.toLowerCase().includes('활동') || section.title.toLowerCase().includes('activity'))
        .map(section => ({
          title: section.title,
          description: section.content,
        })),
    };
  };

  if (!portfolio) return <div>로딩 중...</div>;

  const SelectedTemplate = templateComponents[portfolio.template as keyof typeof templateComponents] || DefaultTemplate;
  const templateData = convertToTemplateData();

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      {templateData && <SelectedTemplate data={templateData} />}
      
      {/* 댓글 섹션 */}
      <div style={{ marginTop: '2rem', background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
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
  );
};

export default PortfolioDetail; 