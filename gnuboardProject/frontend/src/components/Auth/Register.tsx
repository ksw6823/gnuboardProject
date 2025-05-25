import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const RegisterPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #e4e4e4;
`;

const RegisterBox = styled.div`
  width: 100%;
  max-width: 380px;
  padding: 2rem;
  background: #d6dee7;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 500;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 100%;
  margin-bottom: 0.3rem;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  align-items: center;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.25rem;
  
  &::after {
    content: '*';
    color: red;
    margin-left: 4px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #1a73e8;
  }

  &[type="password"] {
    letter-spacing: 0.1em;
  }
`;

const ProfileImageUpload = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
  width: 100%;
`;

const ImagePreview = styled.div`
  width: 80px;
  height: 80px;
  border: 1px dashed #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  cursor: pointer;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadButton = styled.button`
  padding: 0.5rem 1rem;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #1557b0;
  }
`;

const BirthDateContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;

  input {
    flex: 1;
  }
`;

const EmailContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;

  input {
    flex: 1;
    min-width: 120px;
  }

  span {
    color: #666;
    margin: 0 0.25rem;
  }

  select {
    width: 160px;
    padding: 0.7rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
    background: white;
  }
`;

const EmailInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 160px;

  input {
    flex: 1;
    min-width: 100px;
  }

  button {
    white-space: nowrap;
    padding: 0.7rem 1rem;
    min-width: 60px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #1a73e8;
  }
`;

const CheckButton = styled.button`
  padding: 0.7rem 1.2rem;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #1557b0;
  }
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.8rem;
  
  &:hover {
    background: #1557b0;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #d93025;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
  width: 100%;
  max-width: 320px;
  margin: 0.5rem auto 0;
`;

const GenderButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;

const GenderButton = styled.button<{ isSelected: boolean }>`
  flex: 1;
  padding: 0.7rem;
  border: 1px solid ${props => props.isSelected ? '#1a73e8' : '#ddd'};
  border-radius: 4px;
  background: ${props => props.isSelected ? '#1a73e8' : 'white'};
  color: ${props => props.isSelected ? 'white' : '#333'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isSelected ? '#1557b0' : '#f5f5f5'};
  }
`;

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    profileImage: null as File | null,
    name: '',
    password: '',
    passwordConfirm: '',
    gender: '남성',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    emailId: '',
    emailDomain: 'direct',
    customEmailDomain: '',
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
  const [isCustomDomain, setIsCustomDomain] = useState(true);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDuplicateCheck = async () => {
    if (!formData.name) {
      setError('아이디를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/check-duplicate`, {
        name: formData.name
      });
      
      if (response.data.isDuplicate) {
        setError('이미 사용중인 아이디입니다.');
        setIsDuplicateChecked(false);
      } else {
        setError('사용 가능한 아이디입니다.');
        setIsDuplicateChecked(true);
      }
    } catch (error) {
      console.error('Duplicate check failed:', error);
      setError('중복 확인에 실패했습니다.');
      setIsDuplicateChecked(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const email = `${formData.emailId}@${isCustomDomain ? formData.customEmailDomain : formData.emailDomain}`;
      const birthDate = `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`;

      const formDataToSend = new FormData();
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('birthDate', birthDate);
      formDataToSend.append('gender', formData.gender);

      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      setError('회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setIsCustomDomain(value === 'direct');
    setFormData(prev => ({
      ...prev,
      emailDomain: value,
      customEmailDomain: value === 'direct' ? '' : prev.customEmailDomain
    }));
  };

  return (
    <RegisterPageContainer>
      <RegisterBox>
        <Title>회원가입</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>프로필 사진</Label>
            <ProfileImageUpload>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <ImagePreview onClick={() => document.getElementById('profileImage')?.click()}>
                {previewUrl ? (
                  <img src={previewUrl} alt="프로필 미리보기" />
                ) : (
                  '프로필 사진'
                )}
              </ImagePreview>
              <UploadButton type="button" onClick={() => document.getElementById('profileImage')?.click()}>
                찾아보기
              </UploadButton>
            </ProfileImageUpload>
          </FormGroup>

          <FormGroup>
            <Label>아이디</Label>
            <InputGroup>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="아이디를 입력하세요"
                required
              />
              <CheckButton type="button" onClick={handleDuplicateCheck}>
                중복확인
              </CheckButton>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>비밀번호</Label>
            <InputGroup>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>비밀번호 확인</Label>
            <InputGroup>
              <Input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleInputChange}
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>성별</Label>
            <GenderButtonGroup>
              <GenderButton
                type="button"
                isSelected={formData.gender === '남성'}
                onClick={() => setFormData(prev => ({ ...prev, gender: '남성' }))}
              >
                남성
              </GenderButton>
              <GenderButton
                type="button"
                isSelected={formData.gender === '여성'}
                onClick={() => setFormData(prev => ({ ...prev, gender: '여성' }))}
              >
                여성
              </GenderButton>
            </GenderButtonGroup>
          </FormGroup>

          <FormGroup>
            <Label>생년월일</Label>
            <BirthDateContainer>
              <Input
                type="text"
                name="birthYear"
                value={formData.birthYear}
                onChange={handleInputChange}
                placeholder="년도"
                maxLength={4}
              />
              <Input
                type="text"
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleInputChange}
                placeholder="월"
                maxLength={2}
              />
              <Input
                type="text"
                name="birthDay"
                value={formData.birthDay}
                onChange={handleInputChange}
                placeholder="일"
                maxLength={2}
              />
            </BirthDateContainer>
          </FormGroup>

          <FormGroup>
            <Label>이메일</Label>
            <EmailContainer>
              <Input
                type="text"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                placeholder="이메일"
                required
                style={{ flex: "1" }}
              />
              <span>@</span>
              {isCustomDomain ? (
                <EmailInputGroup>
                  <Input
                    type="text"
                    name="customEmailDomain"
                    value={formData.customEmailDomain}
                    onChange={handleInputChange}
                    placeholder="도메인 입력"
                    required
                  />
                  <CheckButton 
                    type="button" 
                    onClick={() => {
                      setIsCustomDomain(false);
                      setFormData(prev => ({
                        ...prev,
                        emailDomain: 'naver.com',
                        customEmailDomain: ''
                      }));
                    }}
                  >
                    선택
                  </CheckButton>
                </EmailInputGroup>
              ) : (
                <select
                  name="emailDomain"
                  value={formData.emailDomain}
                  onChange={handleEmailDomainChange}
                >
                  <option value="naver.com">naver.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="daum.net">daum.net</option>
                  <option value="hanmail.net">hanmail.net</option>
                  <option value="direct">직접입력</option>
                </select>
              )}
            </EmailContainer>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <RegisterButton type="submit" disabled={isLoading}>
            {isLoading ? '가입 중...' : '회원가입'}
          </RegisterButton>
        </Form>
      </RegisterBox>
    </RegisterPageContainer>
  );
};

export default Register; 