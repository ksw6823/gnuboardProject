import React from 'react';
import styled from 'styled-components';
import { PortfolioData } from '../../../types/portfolio';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
`;

// 여기에 필요한 스타일 컴포넌트들을 정의합니다
const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
  object-fit: cover;
  border: 5px solid #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

// ... 다른 스타일 컴포넌트들 ...

interface ModernTemplateProps {
  data: PortfolioData;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  return (
    <Container>
      <Header>
        <ProfileImage src={data.personalInfo.profileImage} alt={data.personalInfo.name} />
        <h1>{data.personalInfo.name}</h1>
        <p>{data.personalInfo.title}</p>
        {/* 여기에 원하는 레이아웃과 디자인을 구현합니다 */}
      </Header>
      {/* 섹션들을 원하는 디자인으로 구현합니다 */}
    </Container>
  );
};

export default ModernTemplate; 