import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Background = styled.div`
  min-height: 100vh;
  background: #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginCard = styled.div`
  background: #dde6ef;
  border-radius: 10px;
  box-shadow: 2px 4px 12px rgba(0,0,0,0.10);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.7rem 1rem;
  border: 1px solid #bbb;
  border-radius: 4px;
  font-size: 1rem;
  background: #fff;
`;

const SignInButton = styled.button`
  padding: 0.7rem 0;
  background: #8eaefc;
  color: #222;
  border: none;
  border-radius: 7px;
  font-size: 1.05rem;
  font-weight: 500;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #6d97f5;
  }
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1.5px solid #bfc9d1;
  margin: 2rem 0 1.2rem 0;
`;

const SignUpButton = styled.button`
  width: 100%;
  padding: 0.7rem 0;
  background: #fff;
  color: #222;
  border: 1.5px solid #bfc9d1;
  border-radius: 4px;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #f3f6fa;
  }
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        username,
        password,
      });
      localStorage.setItem('token', response.data.access_token);
      navigate('/');
    } catch (error) {
      alert('로그인에 실패했습니다.');
    }
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <Background>
      <LoginCard>
        <Title>로그인</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <SignInButton type="submit">Sign in</SignInButton>
        </Form>
        <Divider />
        <SignUpButton type="button" onClick={handleSignUp}>Sign up</SignUpButton>
      </LoginCard>
    </Background>
  );
};

export default Login; 