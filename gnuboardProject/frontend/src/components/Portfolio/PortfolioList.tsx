import React from 'react';
import styled from 'styled-components';
import PortfolioCard from './PortfolioCard';

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

interface PortfolioListProps {
  portfolios: Portfolio[];
  onCardClick: (id: number) => void;
}

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.2rem;
  max-width: 1200px;
  margin: 2.5rem auto;
  padding: 0 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: #868E96;
  font-size: 1.1rem;
`;

const PortfolioList: React.FC<PortfolioListProps> = ({ portfolios, onCardClick }) => {
  if (!Array.isArray(portfolios) || portfolios.length === 0) {
    return <NoResults>검색 결과가 없습니다.</NoResults>;
  }
  return (
    <PortfolioGrid>
      {portfolios.map((portfolio) => (
        <PortfolioCard key={portfolio.id} portfolio={portfolio} onClick={() => onCardClick(portfolio.id)} />
      ))}
    </PortfolioGrid>
  );
};

export default PortfolioList; 