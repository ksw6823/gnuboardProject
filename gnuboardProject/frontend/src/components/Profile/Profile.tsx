import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-weight: bold;
    color: #555;
  }
  
  input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const InfoCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  padding: 2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`;

const EditButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: #4B89DC;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
`;

const PortfolioList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const PortfolioItem = styled.li`
  padding: 0.7rem 0;
  border-bottom: 1px solid #eee;
  font-size: 1rem;
`;

const ProfileImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1.5rem;
  background: #f0f0f0;
`;

const ProfileImgWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const GenderSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

type ProfileType = {
  username: string;
  name: string;
  gender: string;
  birth: string;
  phone: string;
  email: string;
  profileImage: string | File;
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileType>({
    username: '',
    name: '',
    gender: '',
    birth: '',
    phone: '',
    email: '',
    profileImage: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState<{ id: number; title: string }[]>([]);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [editProfile, setEditProfile] = useState<ProfileType>(profile);
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
    fetchPortfolios();
    setEditProfile(profile);
    setImgPreview(profile.profileImage ? `${process.env.REACT_APP_API_URL}/${profile.profileImage}` : null);
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setProfile(response.data);
      setFormData(prev => ({ ...prev, name: response.data.name }));
    } catch (e) {
      setError('프로필을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolios = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/portfolios/my`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setPortfolios(response.data.map((p: any) => ({ id: p.id, title: p.title })));
    } catch (e) {
      // 에러 무시(없을 수 있음)
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/users/profile`, {
        name: formData.name,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword || undefined,
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('프로필이 성공적으로 업데이트되었습니다.');
      navigate('/');
    } catch (error: any) {
      let errorMessage = '프로필 업데이트에 실패했습니다.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditProfile(prev => ({ ...prev, profileImage: e.target.files![0] as File }));
      setImgPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePhoneEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length < 4) {
      setEditProfile(prev => ({ ...prev, phone: value }));
    } else if (value.length < 8) {
      setEditProfile(prev => ({ ...prev, phone: value.slice(0, 3) + '-' + value.slice(3) }));
    } else {
      setEditProfile(prev => ({ ...prev, phone: value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11) }));
    }
  };

  const handleEditSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editProfile.name);
      formData.append('gender', editProfile.gender);
      formData.append('phone', editProfile.phone);
      formData.append('email', editProfile.email);
      if (editProfile.profileImage && typeof editProfile.profileImage !== 'string') {
        formData.append('profileImg', editProfile.profileImage);
      }
      // 디버깅: FormData 내용 출력
      Array.from(formData.entries()).forEach((pair: [string, FormDataEntryValue]) => {
        console.log(pair[0] + ':', pair[1]);
      });
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/users/profile`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile(response.data);
      setIsEdit(false);
      alert('프로필이 성공적으로 수정되었습니다.');
    } catch (e: any) {
      if (e.response) {
        console.log('서버 응답:', e.response.data);
        alert('프로필 수정에 실패했습니다: ' + (e.response.data.message || JSON.stringify(e.response.data)));
      } else {
        alert('프로필 수정에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <LogoContainer onClick={() => navigate('/')}>
        <Logo>산학협력</Logo>
      </LogoContainer>
      <SectionTitle>나의 정보</SectionTitle>
      <InfoCard>
        {isEdit ? (
          <>
            <ProfileImgWrapper>
              <ProfileImg
                src={
                  imgPreview
                    ? imgPreview
                    : (typeof editProfile.profileImage === 'string' && editProfile.profileImage
                        ? (editProfile.profileImage.startsWith('http')
                            ? editProfile.profileImage
                            : `${(process.env.REACT_APP_API_URL ?? '').replace(/\/$/, '')}/${editProfile.profileImage.replace(/^\//, '')}`)
                        : 'https://via.placeholder.com/80?text=No+Image')
                }
                alt="프로필 이미지"
              />
              <input type="file" accept="image/*" onChange={handleImgChange} style={{ marginLeft: 12 }} />
            </ProfileImgWrapper>
            <input name="name" value={editProfile.name} onChange={handleEditChange} placeholder="이름" style={{ marginBottom: 8, padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            <GenderSelect name="gender" value={editProfile.gender} onChange={handleEditChange}>
              <option value="">성별 선택</option>
              <option value="Male">남자</option>
              <option value="Female">여자</option>
            </GenderSelect>
            <input name="birth" type="date" value={editProfile.birth} onChange={handleEditChange} placeholder="생년월일" style={{ marginBottom: 8, padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            <input name="phone" type="tel" value={editProfile.phone} onChange={handlePhoneEditChange} placeholder="010-1234-5678" maxLength={13} style={{ marginBottom: 8, padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            <input name="email" type="email" value={editProfile.email} onChange={handleEditChange} placeholder="이메일" style={{ marginBottom: 8, padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button type="button" onClick={handleEditSave}>저장</Button>
              <Button type="button" onClick={() => { setIsEdit(false); setEditProfile(profile); setImgPreview(profile.profileImage ? `${process.env.REACT_APP_API_URL}/${profile.profileImage}` : null); }}>취소</Button>
            </div>
          </>
        ) : (
          <>
            <ProfileImgWrapper>
              <ProfileImg
                src={
                  typeof profile.profileImage === 'string' && profile.profileImage
                    ? (profile.profileImage.startsWith('http')
                        ? profile.profileImage
                        : `${(process.env.REACT_APP_API_URL ?? '').replace(/\/$/, '')}/${profile.profileImage.replace(/^\//, '')}`)
                    : 'https://via.placeholder.com/80?text=No+Image'
                }
                alt="프로필 이미지"
              />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{profile.name}</div>
                <div style={{ margin: '0.3rem 0' }}>{profile.gender} {profile.birth}</div>
                <div style={{ margin: '0.3rem 0' }}>{profile.phone}</div>
                <div style={{ margin: '0.3rem 0' }}>{profile.email}</div>
              </div>
            </ProfileImgWrapper>
            <EditButton onClick={() => setIsEdit(true)}>✏️ 수정하기</EditButton>
          </>
        )}
      </InfoCard>
      <SectionTitle>내가 작성한 포트폴리오</SectionTitle>
      <InfoCard>
        <PortfolioList>
          {portfolios.length === 0 ? (
            <PortfolioItem>작성한 포트폴리오가 없습니다.</PortfolioItem>
          ) : (
            portfolios.map(p => (
              <PortfolioItem key={p.id}>{p.title}</PortfolioItem>
            ))
          )}
        </PortfolioList>
        <EditButton onClick={() => alert('포트폴리오 관리 기능 준비중')}>✏️ 수정하기</EditButton>
      </InfoCard>
    </>
  );
};

export default Profile; 