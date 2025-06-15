import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../../contexts/AuthContext';

const Background = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #E5E5E5;
  padding: 2rem;
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  cursor: pointer;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #4B89DC;
  display: inline-block;
  padding: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: #E5E5E5;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  border: 1.5px solid #e0e0e0;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  color: #333;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  padding: 0.8rem;
  background-color: #4B89DC;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #3B79CC;
  }
`;

const RegisterLink = styled.div`
  margin-top: 1rem;
  text-align: center;
  color: #666;

  a {
    color: #4B89DC;
    text-decoration: none;
    margin-left: 0.5rem;

  &:hover {
      text-decoration: underline;
    }
  }
`;

const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(userId, password);
      navigate('/');
    } catch (error) {
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <Background>
      <LogoContainer onClick={handleLogoClick}>
        <Logo>산학협력</Logo>
      </LogoContainer>
      <LoginContainer>
        <Title>로그인</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">로그인</Button>
        </Form>
        <RegisterLink>
          계정이 없으신가요?
          <a href="/register">회원가입</a>
        </RegisterLink>
      </LoginContainer>
    </Background>
  );
};

export default Login; 