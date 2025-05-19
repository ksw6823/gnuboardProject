import React from 'react';
import styled from 'styled-components';
import { PortfolioData } from '../../../types/portfolio';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background: #f8f9fa;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 60px;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 30px;
  object-fit: cover;
  border: 8px solid #fff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const Name = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #2d3436;
`;

const Title = styled.p`
  font-size: 1.5rem;
  color: #636e72;
  margin-bottom: 30px;
`;

const ContactInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  font-size: 1.2rem;
  color: #636e72;
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #2d3436;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 24px;
    background: #0984e3;
    border-radius: 2px;
  }
`;

const Content = styled.div`
  font-size: 1.1rem;
  color: #636e72;
  line-height: 1.6;
`;

const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const SkillItem = styled.span`
  background: #f1f2f6;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1rem;
  color: #2d3436;
  transition: all 0.3s ease;

  &:hover {
    background: #0984e3;
    color: #fff;
  }
`;

const Timeline = styled.div`
  position: relative;
`;

const TimelineItem = styled.div`
  margin-bottom: 30px;
  padding-left: 25px;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #0984e3;
  }

  &::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 12px;
    width: 2px;
    height: calc(100% + 18px);
    background: #dfe6e9;
  }

  &:last-child::after {
    display: none;
  }
`;

const TimelineDate = styled.div`
  font-size: 1rem;
  color: #0984e3;
  margin-bottom: 8px;
  font-weight: 600;
`;

const TimelineTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #2d3436;
`;

const TimelineDesc = styled.div`
  font-size: 1rem;
  color: #636e72;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const ProjectItem = styled.div`
  background: #f1f2f6;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: #0984e3;
    color: #fff;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const ProjectDesc = styled.p`
  font-size: 1rem;
`;

const CertList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const CertItem = styled.div`
  background: #f1f2f6;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: #0984e3;
    color: #fff;
  }
`;

const CertName = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const CertDate = styled.div`
  font-size: 1rem;
`;

const LanguageList = styled(CertList)``;
const ActivityList = styled(CertList)``;

const LanguageItem = styled(CertItem)``;
const ActivityItem = styled(CertItem)``;

const LanguageName = styled(CertName)``;
const ActivityTitle = styled(CertName)``;

const LanguageLevel = styled(CertDate)``;
const ActivityDesc = styled(CertDate)``;

const Section = styled.section`
  margin-bottom: 40px;
  background: #fff;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #2d3436;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 24px;
    background: #0984e3;
    border-radius: 2px;
  }
`;

interface CardTemplateProps {
  data: PortfolioData;
}

const CardTemplate: React.FC<CardTemplateProps> = ({ data }) => {
  return (
    <Container>
      <Header>
        <ProfileImage src={data.personalInfo.profileImage} alt={data.personalInfo.name} />
        <Name>{data.personalInfo.name}</Name>
        <Title>{data.personalInfo.title}</Title>
        <ContactInfo>
          <span>📧 {data.personalInfo.email}</span>
          <span>📱 {data.personalInfo.phone}</span>
          <span>📍 {data.personalInfo.location}</span>
        </ContactInfo>
      </Header>

      <MainContent>
        <Section>
          <SectionTitle>자기소개</SectionTitle>
          <Content>
            <p>{data.personalInfo.introduction}</p>
          </Content>
        </Section>

        <Section>
          <SectionTitle>기술스택</SectionTitle>
          <SkillList>
            {data.skills.map((skill: { name: string }, index: number) => (
              <SkillItem key={index}>{skill.name}</SkillItem>
            ))}
          </SkillList>
        </Section>

        <Section>
          <SectionTitle>경력</SectionTitle>
          <Timeline>
            {data.experiences.map((exp: { title: string; company: string; date: string; description: string }, index: number) => (
              <TimelineItem key={index}>
                <TimelineDate>{exp.date}</TimelineDate>
                <TimelineTitle>{exp.title}</TimelineTitle>
                <TimelineDesc>{exp.description}</TimelineDesc>
              </TimelineItem>
            ))}
          </Timeline>
        </Section>

        <Section>
          <SectionTitle>프로젝트</SectionTitle>
          <ProjectGrid>
            {data.projects.map((project: { title: string; description: string; technologies: string[] }, index: number) => (
              <ProjectItem key={index}>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDesc>{project.description}</ProjectDesc>
              </ProjectItem>
            ))}
          </ProjectGrid>
        </Section>

        <Section>
          <SectionTitle>자격증</SectionTitle>
          <CertList>
            {data.certificates.map((cert: { name: string; issuer: string; date: string }, index: number) => (
              <CertItem key={index}>
                <CertName>{cert.name}</CertName>
                <CertDate>{cert.date}</CertDate>
              </CertItem>
            ))}
          </CertList>
        </Section>

        <Section>
          <SectionTitle>외국어</SectionTitle>
          <LanguageList>
            {data.languages.map((lang: { name: string; level: string }, index: number) => (
              <LanguageItem key={index}>
                <LanguageName>{lang.name}</LanguageName>
                <LanguageLevel>{lang.level}</LanguageLevel>
              </LanguageItem>
            ))}
          </LanguageList>
        </Section>

        <Section>
          <SectionTitle>대외활동</SectionTitle>
          <ActivityList>
            {data.activities.map((activity: { title: string; description: string }, index: number) => (
              <ActivityItem key={index}>
                <ActivityTitle>{activity.title}</ActivityTitle>
                <ActivityDesc>{activity.description}</ActivityDesc>
              </ActivityItem>
            ))}
          </ActivityList>
        </Section>
      </MainContent>
    </Container>
  );
};

export default CardTemplate; 