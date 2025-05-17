import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios, { isAxiosError } from 'axios';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
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

interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setName(response.data.name);
      } catch (error) {
        let errorMessage = '프로필을 불러오는데 실패했습니다.';
        if (isAxiosError(error)) {
          errorMessage = error.response?.data?.message || error.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updateData: { name?: string; password?: string } = {};
      
      if (name !== profile?.name) {
        updateData.name = name;
      }
      if (password) {
        updateData.password = password;
      }

      await axios.patch('/users/profile', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('프로필이 업데이트되었습니다.');
      setPassword('');
      setError('');
    } catch (error) {
      let errorMessage = '프로필 업데이트에 실패했습니다.';
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  if (!profile) {
    return <div>로딩 중...</div>;
  }

  return (
    <ProfileContainer>
      <h2>프로필</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <Form onSubmit={handleSubmit}>
        <div>
          <label>이메일:</label>
          <Input type="email" value={profile.email} disabled />
        </div>
        <div>
          <label>이름:</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>새 비밀번호:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="변경하려면 입력하세요"
          />
        </div>
        <Button type="submit">프로필 업데이트</Button>
      </Form>
    </ProfileContainer>
  );
};

export default Profile; 