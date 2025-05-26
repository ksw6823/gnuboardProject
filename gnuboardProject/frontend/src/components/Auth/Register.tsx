import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: hidden;
  background: #E5E5E5;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
  font-weight: 600;
  width: 100%;
`;

const FormBox = styled.div`
  background: #E5E5E5;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  border: 1.5px solid #e0e0e0;
  padding: 3rem;
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-sizing: border-box;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.95rem;
  color: #333;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const domainOptions = [
  '', 'gmail.com', 'naver.com', 'daum.net', '직접입력'
];

const StyledSelect = styled.select`
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background: #fff;
  height: 48px;
  appearance: auto;
  min-width: 0;
`;

const StyledInput = styled(Input)`
  flex: 1;
  height: 22px;
  min-width: 0;
`;

const ProfileImgLabel = styled.label`
  cursor: pointer;
  width: 120px;
  height: 160px;
  border-radius: 10%;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  margin-bottom: 8px;
  position: relative;
`;

const ProfileImgPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const RemoveImgButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  font-size: 1.1rem;
`;

const Register: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [idCheckMsg, setIdCheckMsg] = useState('');
  const [idAvailable, setIdAvailable] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [emailId, setEmailId] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert('아이디를 입력해주세요.');
      return;
    }
    if (!emailId || !(emailDomain || customDomain)) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!gender) {
      alert('성별을 선택해주세요.');
      return;
    }
    if (!phone) {
      alert('전화번호를 입력해주세요.');
      return;
    }
    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!isIdChecked || idAvailable !== true) {
      alert('아이디 중복확인을 해주세요.');
      return;
    }
    // 이메일 조합
    let email = emailId;
    if (emailDomain === '직접입력') {
      email += '@' + customDomain;
    } else if (emailDomain) {
      email += '@' + emailDomain;
    }
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('password', password);
      formData.append('name', name);
      formData.append('gender', gender);
      formData.append('birthYear', birthYear);
      formData.append('birthMonth', birthMonth);
      formData.append('birthDay', birthDay);
      formData.append('phone', phone);
      formData.append('email', email);
      if (profileImg) {
        formData.append('profileImg', profileImg);
      }
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('회원가입에 실패했습니다.');
    }
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImg(e.target.files[0]);
      setProfilePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemoveImg = (e: React.MouseEvent) => {
    e.preventDefault();
    setProfileImg(null);
    setProfilePreview('');
  };

  const handleCheckId = async () => {
    if (!userId) {
      setIdCheckMsg('아이디를 입력해주세요.');
      setIdAvailable(false);
      return;
    }
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/check-username`, {
        params: { username: userId },
      });
      setIdCheckMsg(res.data.message);
      setIdAvailable(res.data.available);
      setIsIdChecked(true);
    } catch (err) {
      setIdCheckMsg('서버 오류가 발생했습니다.');
      setIdAvailable(false);
      setIsIdChecked(false);
    }
  };

  return (
    <RegisterContainer>
      <Title>회원가입</Title>
      <FormBox>
        <Form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
            <Label style={{ alignSelf: 'center', marginBottom: '0.5rem' }}>프로필 사진</Label>
            <ProfileImgLabel htmlFor="profileImg">
              {profilePreview ? (
                <>
                  <ProfileImgPreview src={profilePreview} alt="프로필 미리보기" />
                  <RemoveImgButton type="button" onClick={handleRemoveImg} title="이미지 삭제">×</RemoveImgButton>
                </>
              ) : (
                <span style={{ color: '#aaa', fontSize: 14 }}>(이미지 삽입)</span>
              )}
              <input id="profileImg" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgChange} />
            </ProfileImgLabel>
          </div>
          <InputGroup>
            <Label htmlFor="userId">아이디 <span style={{ color: 'red' }}>*</span></Label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Input
                id="userId"
                type="text"
                placeholder="아이디를 입력하세요"
                value={userId}
                onChange={e => {
                  setUserId(e.target.value);
                  setIsIdChecked(false);
                  setIdCheckMsg('');
                  setIdAvailable(null);
                }}
                required
                style={{ flex: 2 }}
              />
              <Button
                type="button"
                onClick={handleCheckId}
                style={{
                  backgroundColor: idAvailable === true ? '#007bff' : '#6c757d',
                  minWidth: 90,
                  padding: '0.5rem 1rem',
                  fontSize: 14,
                }}
              >
                중복확인
              </Button>
            </div>
            {idCheckMsg && (
              <div style={{ color: idAvailable ? '#007bff' : 'red', fontSize: 13, marginTop: 4 }}>{idCheckMsg}</div>
            )}
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">비밀번호 <span style={{ color: 'red' }}>*</span></Label>
            <Input
              id="password"
              type="password"
              placeholder="8자 이상 입력해주세요"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="passwordCheck">비밀번호 확인 <span style={{ color: 'red' }}>*</span></Label>
            <Input
              id="passwordCheck"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={passwordCheck}
              onChange={e => setPasswordCheck(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="name">이름 <span style={{ color: 'red' }}>*</span></Label>
            <Input
              id="name"
              type="text"
              placeholder="실명을 입력해주세요"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>성별 <span style={{ color: 'red' }}>*</span></Label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button type="button" style={{ background: gender === 'male' ? '#007bff' : '#B5B4B4', color: gender === 'male' ? '#fff' : '#333', border: '1px solid #ddd' }} onClick={() => setGender('male')}>남자</Button>
              <Button type="button" style={{ background: gender === 'female' ? '#007bff' : '#B5B4B4', color: gender === 'female' ? '#fff' : '#333', border: '1px solid #ddd' }} onClick={() => setGender('female')}>여자</Button>
            </div>
          </InputGroup>
          <InputGroup>
            <Label>생년월일 <span style={{ color: 'red' }}>*</span></Label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input
                type="text"
                placeholder="Year"
                value={birthYear}
                onChange={e => setBirthYear(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={4}
                style={{ width: 80 }}
                required
              />
              <Input
                type="text"
                placeholder="month"
                value={birthMonth}
                onChange={e => setBirthMonth(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={2}
                style={{ width: 60 }}
                required
              />
              <Input
                type="text"
                placeholder="day"
                value={birthDay}
                onChange={e => setBirthDay(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={2}
                style={{ width: 60 }}
                required
              />
            </div>
          </InputGroup>
          <InputGroup>
            <Label htmlFor="phone">전화번호 <span style={{ color: 'red' }}>*</span></Label>
            <Input
              id="phone"
              type="text"
              placeholder="010-1234-5678"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              maxLength={11}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>이메일 <span style={{ color: 'red' }}>*</span></Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <StyledInput
                type="text"
                placeholder="이메일 아이디"
                value={emailId}
                onChange={e => setEmailId(e.target.value)}
                required
              />
              <span>@</span>
              {emailDomain === '직접입력' ? (
                <StyledInput
                  type="text"
                  placeholder="도메인 입력"
                  value={customDomain}
                  onChange={e => setCustomDomain(e.target.value)}
                  required
                />
              ) : (
                <StyledSelect
                  value={emailDomain}
                  onChange={e => setEmailDomain(e.target.value)}
                  required
                >
                  {domainOptions.map(opt => (
                    <option key={opt} value={opt} disabled={opt === ''}>{opt === '' ? '도메인 선택' : opt}</option>
                  ))}
                </StyledSelect>
              )}
            </div>
          </InputGroup>
          <Button type="submit">회원가입</Button>
        </Form>
      </FormBox>
    </RegisterContainer>
  );
};

export default Register; 