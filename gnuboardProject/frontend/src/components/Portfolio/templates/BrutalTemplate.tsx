import React from 'react';
import styled from 'styled-components';
import { PortfolioData } from '../../../types/portfolio';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  border: 4px solid #000;
  padding: 40px;
`;

const Header = styled.header`
  margin-bottom: 60px;
  border-bottom: 4px solid #000;
  padding-bottom: 40px;
`;

const Name = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const Title = styled.p`
  font-size: 1.5rem;
  margin-bottom: 30px;
`;

const ContactInfo = styled.div`
  display: flex;
  gap: 40px;
  font-size: 1.2rem;
`;

const Section = styled.section`
  margin-bottom: 60px;
  border: 4px solid #000;
  padding: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  text-transform: uppercase;
  display: inline-block;
  border-bottom: 4px solid #000;
`;

const Content = styled.div`
  font-size: 1.2rem;
`;

const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const SkillItem = styled.span`
  font-size: 1.2rem;
  padding: 10px 20px;
  border: 4px solid #000;
  background: #fff;
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
  margin-bottom: 40px;
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
    width: 20px;
    height: 20px;
    border: 4px solid #000;
  }
`;

const TimelineDate = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const TimelineTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const TimelineDesc = styled.div`
  font-size: 1.2rem;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const ProjectItem = styled.div`
  border: 4px solid #000;
  padding: 30px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translate(-10px, -10px);
    box-shadow: 10px 10px 0 #000;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 15px;
`;

const ProjectDesc = styled.p`
  font-size: 1.2rem;
`;

const CertList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
`;

const CertItem = styled.div`
  border: 4px solid #000;
  padding: 30px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translate(-10px, -10px);
    box-shadow: 10px 10px 0 #000;
  }
`;

const CertName = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const CertDate = styled.div`
  font-size: 1.2rem;
`;

const LanguageList = styled(CertList)``;
const ActivityList = styled(CertList)``;

const LanguageItem = styled(CertItem)``;
const ActivityItem = styled(CertItem)``;

const LanguageName = styled(CertName)``;
const ActivityTitle = styled(CertName)``;

const LanguageLevel = styled(CertDate)``;
const ActivityDesc = styled(CertDate)``;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
`;

interface BrutalTemplateProps {
  data: PortfolioData;
}

const BrutalTemplate: React.FC<BrutalTemplateProps> = ({ data }) => {
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
            {data.experiences.map((exp: { title: string; company: string; start_date: string; end_date: string; description: string }, index: number) => (
              <TimelineItem key={index}>
                <TimelineDate>
                  {exp.start_date}
                  {exp.end_date ? ` ~ ${exp.end_date}` : ' ~ 현재'}
                </TimelineDate>
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

export default BrutalTemplate; 