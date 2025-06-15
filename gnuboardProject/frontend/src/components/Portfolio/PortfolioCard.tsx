import React from 'react';
import styled from 'styled-components';
import { FaCode as FaCodeIcon, FaHeart as FaHeartIcon } from 'react-icons/fa';

const FaCode = FaCodeIcon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaHeart = FaHeartIcon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

// Portfolio 타입 정의 (간단 버전, 필요시 확장)
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
  // 백엔드에서 제공하는 최상위 레벨 데이터
  portfolioSkills?: Array<{ name: string }>;
  portfolioKeywords?: Array<{ name: string }>;
  portfolioJob?: Array<{ name: string }>;
}

interface PortfolioCardProps {
  portfolio: Portfolio;
  onClick: () => void;
}

const PortfolioCardBox = styled.div`
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 6px 32px rgba(0,0,0,0.10);
  min-height: 240px;
  aspect-ratio: 4/3;
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: box-shadow 0.18s, transform 0.18s;
  position: relative;
  &:hover {
    box-shadow: 0 12px 36px rgba(0,0,0,0.16);
    transform: translateY(-4px) scale(1.02);
  }
`;

const CardHeader = styled.div`
  margin-bottom: 0.4rem;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardUserName = styled.span`
  font-weight: 600;
  color: #212529;
  font-size: 1.08rem;
`;
const UserRole = styled.span`
  color: #4B89DC;
  font-size: 0.97rem;
  font-weight: 500;
`;
const CardHeaderTitle = styled.div`
  font-size: 1.05rem;
  color: #1976d2;
  font-weight: 600;
  margin-top: 2px;
  margin-bottom: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
  display: block;
`;
const CardContent = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.2rem 0 0.2rem 0;
`;
const CardDescription = styled.p`
  margin: 0;
  color: #495057;
  font-size: 1.01rem;
  line-height: 1.6;
  font-weight: 400;
  min-height: 3.8em;
  max-height: 3.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-all;
`;
const CardTag = styled.span`
  background: #E7F5FF;
  color: #4B89DC;
  padding: 0.32rem 1.1rem;
  border-radius: 15px;
  font-size: 0.92rem;
  font-weight: 500;
`;

const LikeCount = styled.div`
  position: absolute;
  bottom: 1.2rem;
  right: 1.2rem;
  color: #888;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
`;

const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio, onClick }) => {
  // 백엔드에서 최상위 레벨로 제공하는 데이터 사용
  const skills = (portfolio.portfolioSkills ?? []).map((skill: any) => skill.name).filter(Boolean);
  const keywords = (portfolio.portfolioKeywords ?? []).map((keyword: any) => keyword.name).filter(Boolean);
  const jobs = (portfolio.portfolioJob ?? []).map((job: any) => job.name).filter(Boolean);
  const MAX_SHOW = 3;
  const showSkills = skills.slice(0, MAX_SHOW);
  const moreSkills = skills.length - MAX_SHOW;
  const showKeywords = keywords.slice(0, MAX_SHOW);
  const moreKeywords = keywords.length - MAX_SHOW;

  return (
    <PortfolioCardBox onClick={onClick} style={{ cursor: 'pointer' }}>
      <CardHeader>
        <TopRow>
          <CardUserName>{portfolio.user?.name || '이름 없음'}</CardUserName>
          <UserRole>{jobs[0] || '직무 없음'}</UserRole>
        </TopRow>
        <CardHeaderTitle>{portfolio.title}</CardHeaderTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{portfolio.intro || '소개 없음'}</CardDescription>
        <div style={{ marginTop: 'auto' }}>
          <hr style={{ margin: '1rem 0 0.7rem 0', border: 0, borderTop: '1px solid #eee' }} />
          {skills.length > 0 && (
            <div style={{ color: '#555', fontSize: '0.98rem', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <FaCode style={{ marginRight: 4 }} />
              {showSkills.join(', ')}
              {moreSkills > 0 && ` +${moreSkills}개`}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 0, paddingRight: '80px' }}>
            <div>
              <div style={{ display: 'flex', flexWrap: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                {(showKeywords.filter((kw): kw is string => Boolean(kw))).map((kw, i) => (
                  <CardTag key={i}>#{kw}</CardTag>
                ))}
              </div>
              {moreKeywords > 0 && (
                <div style={{ marginTop: 4 }}>
                  <CardTag>+{moreKeywords}개</CardTag>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <LikeCount>
        <FaHeart style={{ color: '#ff6b6b' }} />
        {portfolio.likes_count}
      </LikeCount>
    </PortfolioCardBox>
  );
};

export default PortfolioCard; 