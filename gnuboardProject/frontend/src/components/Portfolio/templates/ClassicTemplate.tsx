import React from 'react';
import styled from 'styled-components';
import { PortfolioData } from '../../../types/portfolio';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  font-family: 'Times New Roman', Times, serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 60px;
  border-bottom: 2px solid #000;
  padding-bottom: 40px;
`;

const Name = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  letter-spacing: 2px;
`;

const Title = styled.p`
  font-size: 1.5rem;
  margin-bottom: 30px;
  font-style: italic;
`;

const ContactInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  font-size: 1.2rem;
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid #000;
  padding-bottom: 10px;
`;

const Content = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
`;

const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const SkillItem = styled.span`
  font-size: 1.1rem;
  padding: 5px 15px;
  border: 1px solid #000;
  transition: all 0.3s ease;

  &:hover {
    background: #000;
    color: #fff;
  }
`;

const Timeline = styled.div`
  position: relative;
`;

const TimelineItem = styled.div`
  margin-bottom: 30px;
  padding-left: 30px;
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
    border: 2px solid #000;
  }
`;

const TimelineDate = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 10px;
  font-style: italic;
`;

const TimelineTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const TimelineDesc = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const ProjectItem = styled.div`
  border: 1px solid #000;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 5px 5px 0 #000;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 15px;
`;

const ProjectDesc = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
`;

const CertList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
`;

const CertItem = styled.div`
  border: 1px solid #000;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 5px 5px 0 #000;
  }
`;

const CertName = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const CertDate = styled.div`
  font-size: 1.1rem;
  font-style: italic;
`;

const LanguageList = styled(CertList)``;
const ActivityList = styled(CertList)``;

const LanguageItem = styled(CertItem)``;
const ActivityItem = styled(CertItem)``;

const LanguageName = styled(CertName)``;
const ActivityTitle = styled(CertName)``;

const LanguageLevel = styled(CertDate)``;
const ActivityDesc = styled(CertDate)``;

interface ClassicTemplateProps {
  data: PortfolioData;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data }) => {
  return (
    <Container>
      <Header>
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

export default ClassicTemplate; 