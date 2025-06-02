import React from 'react';
import styled from 'styled-components';

const Bg = styled.div`
  min-height: 100vh;
  background: #f4f6fa;
`;

const TopBar = styled.div`
  width: 100%;
  background: #b9c9f5;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3a5fc8;
  letter-spacing: -1px;
`;

const TopBtnGroup = styled.div`
  display: flex;
  gap: 0.7rem;
`;

const TopButton = styled.button`
  background: #4B89DC;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.3rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: #346bb3;
  }
`;

const MainContent = styled.div`
  max-width: 700px;
  margin: 2.5rem auto 2.5rem auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2.2rem;
  margin-bottom: 1.5rem;
`;

const ProfileImg = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #adb5bd;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProfileName = styled.div`
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
`;

const ProfileEmail = styled.div`
  font-size: 1rem;
  color: #868e96;
`;

const SectionLabel = styled.div`
  font-size: 1.08rem;
  font-weight: 600;
  color: #346bb3;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
`;

const BlueBar = styled.div`
  width: 3px;
  height: 18px;
  background: #4B89DC;
  display: inline-block;
  margin-right: 0.7rem;
  border-radius: 2px;
  vertical-align: middle;
`;

const TagRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.5rem;
`;

const AddBtn = styled.button`
  background: #f4f6fa;
  color: #4B89DC;
  border: 1.5px solid #4B89DC;
  border-radius: 16px;
  padding: 0.2rem 1.2rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: #e3eafc;
  }
`;

const TagInput = styled.input`
  width: 220px;
  padding: 0.7rem 1rem;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: #f8fafd;
`;

const Select = styled.select`
  width: 220px;
  padding: 0.7rem 1rem;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: #f8fafd;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.7rem 1rem;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  background: #f8fafd;
`;

const SectionTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: #346bb3;
  margin-bottom: 0.7rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.7rem;
  margin-bottom: 0.6rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: #f8fafd;
`;

const AddButton = styled.button`
  background: #4B89DC;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  width: 100%;
  &:hover {
    background: #346bb3;
  }
`;

const PortfolioCreate: React.FC = () => {
  return (
    <Bg>
      <TopBar>
        <Logo>PortFlow</Logo>
        <TopBtnGroup>
          <TopButton>임시 저장</TopButton>
          <TopButton>작성 완료</TopButton>
        </TopBtnGroup>
      </TopBar>
      <MainContent>
        {/* 프로필 */}
        <ProfileSection>
          <ProfileImg />
          <ProfileInfo>
            <ProfileName>홍길동</ProfileName>
            <ProfileEmail>이메일 gkarkhsdn@gmail.com</ProfileEmail>
          </ProfileInfo>
        </ProfileSection>

        {/* 나의 키워드 */}
        <div>
          <SectionLabel><BlueBar />나의 키워드</SectionLabel>
          <TagRow>
            <AddBtn>+</AddBtn>
          </TagRow>
        </div>

        {/* 직군/직무 */}
        <div>
          <SectionLabel><BlueBar />직군 / 직무</SectionLabel>
          <TagRow>
            <AddBtn>+</AddBtn>
          </TagRow>
        </div>

        {/* 기술 스택 */}
        <div>
          <SectionLabel><BlueBar />기술 스택</SectionLabel>
          <TagRow>
            <AddBtn>+</AddBtn>
          </TagRow>
        </div>

        {/* 나의 소개 */}
        <div>
          <SectionLabel><BlueBar />나의 소개</SectionLabel>
          <TextArea placeholder="자기소개를 입력하세요" />
        </div>

        {/* 경력 */}
        <div>
          <SectionLabel><BlueBar />경력</SectionLabel>
          <Row>
            <Input placeholder="회사명" />
            <Input placeholder="직위" />
          </Row>
          <Row>
            <Input placeholder="기간" />
          </Row>
          <Row>
            <Input placeholder="경력 내용" />
          </Row>
          <AddButton>+ 추가</AddButton>
        </div>

        {/* 프로젝트 */}
        <div>
          <SectionLabel><BlueBar />프로젝트</SectionLabel>
          <Row>
            <Input placeholder="프로젝트명" />
            <Input placeholder="프로젝트 기간" />
          </Row>
          <Row>
            <Input placeholder="프로젝트 내용" />
          </Row>
          <AddButton>+ 추가</AddButton>
        </div>

        {/* 자격증 */}
        <div>
          <SectionLabel><BlueBar />자격증</SectionLabel>
          <Row>
            <Input placeholder="자격증명" />
            <Input placeholder="발급기관" />
            <Input placeholder="취득일" />
          </Row>
          <AddButton>+ 추가</AddButton>
        </div>

        {/* 외국어 */}
        <div>
          <SectionLabel><BlueBar />외국어</SectionLabel>
          <Row>
            <Input placeholder="언어" />
            <Input placeholder="수준" />
          </Row>
          <AddButton>+ 추가</AddButton>
        </div>

        {/* 대외 활동 */}
        <div>
          <SectionLabel><BlueBar />대외 활동</SectionLabel>
          <Row>
            <Input placeholder="활동명" />
            <Input placeholder="활동기관" />
          </Row>
          <Row>
            <Input placeholder="활동 내용" />
          </Row>
          <AddButton>+ 추가</AddButton>
        </div>
      </MainContent>
    </Bg>
  );
};

export default PortfolioCreate; 