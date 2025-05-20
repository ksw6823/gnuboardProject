import React, { useState } from 'react';
import styled from 'styled-components';
import { PortfolioData } from '../../../types/portfolio';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
`;

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

const Name = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #333;
`;

const Title = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
`;

const ContactInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
  color: #666;
  font-size: 1rem;
`;

const TabContainer = styled.div`
  margin-bottom: 40px;
`;

const TabList = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.active ? '#007bff' : '#666'};
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.active ? '#007bff' : 'transparent'};
    transition: all 0.3s ease;
  }

  &:hover {
    color: #007bff;
  }
`;

const TabContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Section = styled.section`
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 20px;
    background: #007bff;
    border-radius: 2px;
  }
`;

const Content = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
`;

const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const SkillItem = styled.span`
  font-size: 1rem;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 20px;
  color: #007bff;
  border: 1px solid #007bff;
  transition: all 0.3s ease;

  &:hover {
    background: #007bff;
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
    width: 10px;
    height: 10px;
    background: #007bff;
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 10px;
    width: 2px;
    height: calc(100% + 20px);
    background: #e9ecef;
  }

  &:last-child::after {
    display: none;
  }
`;

const TimelineDate = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
`;

const TimelineTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
`;

const TimelineDesc = styled.div`
  font-size: 1rem;
  color: #444;
  line-height: 1.5;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const ProjectItem = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
`;

const ProjectDesc = styled.p`
  font-size: 1rem;
  color: #444;
  line-height: 1.5;
`;

const CertList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
`;

const CertItem = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CertName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
`;

const CertDate = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const LanguageList = styled(CertList)``;
const ActivityList = styled(CertList)``;

const LanguageItem = styled(CertItem)``;
const ActivityItem = styled(CertItem)``;

const LanguageName = styled(CertName)``;
const ActivityTitle = styled(CertName)``;

const LanguageLevel = styled(CertDate)``;
const ActivityDesc = styled(CertDate)``;

interface TabTemplateProps {
  data: PortfolioData;
}

const TabTemplate: React.FC<TabTemplateProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('about');

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

      <TabContainer>
        <TabList>
          <Tab 
            active={activeTab === 'about'} 
            onClick={() => setActiveTab('about')}
          >
            자기소개
          </Tab>
          <Tab 
            active={activeTab === 'skills'} 
            onClick={() => setActiveTab('skills')}
          >
            기술스택
          </Tab>
          <Tab 
            active={activeTab === 'experience'} 
            onClick={() => setActiveTab('experience')}
          >
            경력
          </Tab>
          <Tab 
            active={activeTab === 'projects'} 
            onClick={() => setActiveTab('projects')}
          >
            프로젝트
          </Tab>
          <Tab 
            active={activeTab === 'certificates'} 
            onClick={() => setActiveTab('certificates')}
          >
            자격증
          </Tab>
          <Tab 
            active={activeTab === 'languages'} 
            onClick={() => setActiveTab('languages')}
          >
            외국어
          </Tab>
          <Tab 
            active={activeTab === 'activities'} 
            onClick={() => setActiveTab('activities')}
          >
            대외활동
          </Tab>
        </TabList>

        <TabContent>
          {activeTab === 'about' && (
            <Section>
              <SectionTitle>자기소개</SectionTitle>
              <Content>
                <p>{data.personalInfo.introduction}</p>
              </Content>
            </Section>
          )}

          {activeTab === 'skills' && (
            <Section>
              <SectionTitle>기술스택</SectionTitle>
              <SkillList>
                {data.skills.map((skill: { name: string }, index: number) => (
                  <SkillItem key={index}>{skill.name}</SkillItem>
                ))}
              </SkillList>
            </Section>
          )}

          {activeTab === 'experience' && (
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
          )}

          {activeTab === 'projects' && (
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
          )}

          {activeTab === 'certificates' && (
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
          )}

          {activeTab === 'languages' && (
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
          )}

          {activeTab === 'activities' && (
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
          )}
        </TabContent>
      </TabContainer>
    </Container>
  );
};

export default TabTemplate; 