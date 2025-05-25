import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #e4e4e4;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 380px;
  padding: 4rem 2.5rem;
  background: #d6dee7;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  color: #1a73e8;
  margin-bottom: 3.5rem;
  font-size: 1.5rem;
  font-weight: 500;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem;
  margin-bottom: 1.8rem;
  border: 1px solid #e8eaed;
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.1);
  }
  
  &::placeholder {
    color: #80868b;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  margin: 2.5rem 0;
  
  &:hover {
    background: #1557b0;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #e8eaed;
  margin: 2.5rem 0;
`;

const SignUpButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: white;
  color: #1a73e8;
  border: 1px solid #1a73e8;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background: rgba(26, 115, 232, 0.04);
  }
`;

const ErrorMessage = styled.div`
  color: #d93025;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/auth/login', {
        username: email,
        password,
      });
      
      localStorage.setItem('token', response.data.access_token);
      navigate('/');
    } catch (err) {
      setError('아이디 또는 비밀번호가 잘못되었습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginPageContainer>
      <LoginBox>
        <Title>로그인</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ID"
            required
            disabled={isLoading}
          />
          
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={isLoading}
          />
          
          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : 'Sign in'}
          </LoginButton>
        </Form>
        
        <Divider />
        
        <SignUpButton onClick={() => navigate('/register')}>
          Sign up
        </SignUpButton>
      </LoginBox>
    </LoginPageContainer>
  );
};

export default Login;