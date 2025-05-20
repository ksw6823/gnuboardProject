import React from 'react';
import styled from 'styled-components';
import { PortfolioData } from '../../../types/portfolio';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
`;

const Header = styled.header`
  height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const HeaderBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #ff3366, #ff6b6b);
  opacity: 0.8;
  z-index: -1;
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
`;

const Name = styled.h1`
  font-size: 5rem;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: -0.02em;
`;

const Title = styled.p`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
`;

const ContactInfo = styled.div`
  display: flex;
  gap: 30px;
`;

const ContactItem = styled.a`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #fff;
  }
`;

const MainContent = styled.main`
  padding: 100px 0;
`;

const Section = styled.section`
  margin-bottom: 150px;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 50px;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 4px;
    background: #ff3366;
  }
`;

const Content = styled.div`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 800px;
`;

const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const SkillItem = styled.span`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const Timeline = styled.div`
  position: relative;
  padding-left: 50px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 2px;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: 50px;

  &:last-child {
    padding-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: -54px;
    top: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ff3366;
  }
`;

const TimelineDate = styled.div`
  font-size: 1.1rem;
  color: #ff3366;
  margin-bottom: 10px;
`;

const TimelineTitle = styled.div`
  font-size: 1.4rem;
  margin-bottom: 10px;
`;

const TimelineDesc = styled.div`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
`;

const ProjectItem = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 16/9;
  background: rgba(255, 255, 255, 0.1);
`;

const ProjectContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  transform: translateY(100%);
  transition: transform 0.3s ease;

  ${ProjectItem}:hover & {
    transform: translateY(0);
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 10px;
`;

const ProjectDesc = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const CertList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const CertItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CertName = styled.div`
  font-size: 1.4rem;
  margin-bottom: 10px;
`;

const CertDate = styled.div`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const LanguageList = styled(CertList)``;
const ActivityList = styled(CertList)``;

const LanguageItem = styled(CertItem)``;
const ActivityItem = styled(CertItem)``;

const LanguageName = styled(CertName)``;
const ActivityTitle = styled(CertName)``;

const LanguageLevel = styled(CertDate)``;
const ActivityDesc = styled(CertDate)``;

interface ArtTemplateProps {
  data: PortfolioData;
}

const ArtTemplate: React.FC<ArtTemplateProps> = ({ data }) => {
  return (
    <Container>
      <Header>
        <HeaderBg />
        <HeaderContent>
          <Name>{data.personalInfo.name}</Name>
          <Title>{data.personalInfo.title}</Title>
          <ContactInfo>
            <ContactItem href={`mailto:${data.personalInfo.email}`}>
              📧 {data.personalInfo.email}
            </ContactItem>
            <ContactItem href={`tel:${data.personalInfo.phone}`}>
              📱 {data.personalInfo.phone}
            </ContactItem>
            <ContactItem href="#">📍 {data.personalInfo.location}</ContactItem>
          </ContactInfo>
        </HeaderContent>
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
            {data.skills.map((skill, index) => (
              <SkillItem key={index}>{skill.name}</SkillItem>
            ))}
          </SkillList>
        </Section>

        <Section>
          <SectionTitle>경력</SectionTitle>
          <Timeline>
            {data.experiences.map((exp, index) => (
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
            {data.projects.map((project, index) => (
              <ProjectItem key={index}>
                <ProjectContent>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDesc>{project.description}</ProjectDesc>
                </ProjectContent>
              </ProjectItem>
            ))}
          </ProjectGrid>
        </Section>

        <Section>
          <SectionTitle>자격증</SectionTitle>
          <CertList>
            {data.certificates.map((cert, index) => (
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
            {data.languages.map((lang, index) => (
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
            {data.activities.map((activity, index) => (
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

export default ArtTemplate; 