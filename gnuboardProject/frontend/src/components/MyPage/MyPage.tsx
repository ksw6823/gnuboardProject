import React, { useState, useEffect, useMemo } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import PortfolioCard from '../Portfolio/PortfolioCard';

import PortfolioList from '../Portfolio/PortfolioList';

interface User {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
}

interface Portfolio {
  id: number;
  title: string;
  intro: string;
  likes_count: number;
  created_at: string;
  user: {
    name: string;
    role: string;
    profileImage?: string;
  };
  sections?: Array<{
    portfolioSkills?: Array<{ skill?: { name: string } }>;
    portfolioKeywords?: Array<{ keyword?: { name: string } }>;
    portfolioJob?: Array<{ job?: { name: string } }>;
  }>;
}

interface Skill { id: number; name: string; }
interface Keyword { id: number; name: string; }
interface Job { id: number; name: string; }

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
  const [skills, setSkills] = useState<Skill[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetchUserData();
    fetchUserPortfolios();
    fetchOptions();
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/portfolios/my`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setPortfolios(Array.isArray(response.data)
        ? (response.data || []).map((p: any) => ({
            ...p,
            sections: p.sections && p.sections.length > 0 ? p.sections : [{
              portfolioSkills: (p.skills || []).map((id: number) => ({ skillId: id })),
              portfolioKeywords: (p.keywords || []).map((id: number) => ({ keywordId: id })),
              portfolioJob: (p.jobs || []).map((id: number) => ({ jobId: id })),
            }]
          }))
        : []);
    } catch (error) {
      console.error('포트폴리오를 불러오는데 실패했습니다:', error);
      setPortfolios([]);
    }
  };

  const fetchOptions = async () => {
    try {
      const [jobsRes, skillsRes, keywordsRes] = await Promise.all([
        axios.get('/jobs'),
        axios.get('/skills'),
        axios.get('/keywords'),
      ]);
      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
      setKeywords(Array.isArray(keywordsRes.data) ? keywordsRes.data : []);
    } catch (e) {
      console.error('옵션 불러오기 실패:', e);
      setJobs([]);
      setSkills([]);
      setKeywords([]);
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
    console.log('프로필 업데이트 formData:', formData);
    try {
      console.log('전송할 데이터:', {
        name: formData.name,
        email: formData.email,
      });
      
      const response = await axios.put('/users/me', {
        name: formData.name,
        email: formData.email,
      });
      console.log('업데이트 응답:', response.data);
      
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

  const isDataReady = (skills || []).length > 0 && (jobs || []).length > 0 && (keywords || []).length > 0;

  const mappedPortfolios = useMemo(() => {
    if (!isDataReady) return [];
    return (portfolios || []).map(portfolio => {
      const sections = (portfolio.sections || []).map(section => ({
        ...section,
        portfolioSkills: (section.portfolioSkills || []).map((ps: any) => ({
          skill: (skills || []).find(s => s.id === ps.skillId) || { name: '스킬 없음' }
        })),
        portfolioKeywords: (section.portfolioKeywords || []).map((pk: any) => ({
          keyword: (keywords || []).find(k => k.id === pk.keywordId) || { name: '키워드 없음' }
        })),
        portfolioJob: (section.portfolioJob || []).map((pj: any) => ({
          job: (jobs || []).find(j => j.id === pj.jobId) || { name: '직무 없음' }
        })),
      }));
      return {
        ...portfolio,
        sections,
        user: {
          name: portfolio.user?.name || '이름 없음',
          role: (
            (sections[0]?.portfolioJob?.[0]?.job?.name) || '직무 없음'
          ),
          profileImage: portfolio.user?.profileImage,
        },
        likes_count: portfolio.likes_count ?? 0,
      };
    });
  }, [portfolios, skills, jobs, keywords]);

  if (!user || !isDataReady) return <div>로딩 중...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>마이페이지</h1>
      
      <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>프로필 정보</h2>
        {!isEditing ? (
          <div>
            <p><strong>이름:</strong> {user.name}</p>
            <p><strong>이메일:</strong> {user.email}</p>
            <button onClick={() => {
              setFormData({
                ...formData,
                name: user.name,
                email: user.email,
              });
              setIsEditing(true);
            }} style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer' }}>
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
            <button type="button" onClick={() => {
              setFormData({
                ...formData,
                name: user.name,
                email: user.email,
              });
              setIsEditing(false);
            }} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer' }}>
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
        <PortfolioList
          portfolios={mappedPortfolios}
          onCardClick={id => navigate(`/portfolio/${id}`)}
        />
      </div>
    </div>
  );
};

export default MyPage;