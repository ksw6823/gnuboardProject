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

const EMAIL_DOMAINS = ['gmail.com', 'naver.com', 'daum.net', '직접입력'];

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
  const [emailId, setEmailId] = useState('');
  const [emailDomain, setEmailDomain] = useState('gmail.com');
  const [customDomain, setCustomDomain] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const profileData = response.data;
        setProfile(profileData);
        setFormData(prev => ({ ...prev, name: profileData.name }));
        
        // 초기 데이터 설정
        setEditProfile({
          ...profileData,
          profileImage: profileData.profileImage
        });
        setImgPreview(profileData.profileImage ? 
          (typeof profileData.profileImage === 'string' ? 
            (profileData.profileImage.startsWith('http') ? 
              profileData.profileImage : 
              `${process.env.REACT_APP_API_URL}/${profileData.profileImage}`) : 
            '') : 
          null
        );

        if (profileData.email) {
          const [id, domain] = profileData.email.split('@');
          setEmailId(id || '');
          setEmailDomain(EMAIL_DOMAINS.includes(domain) ? domain : '직접입력');
          setCustomDomain(!EMAIL_DOMAINS.includes(domain) ? domain : '');
        }

        if (profileData.birth) {
          const [y, m, d] = profileData.birth.split('-');
          setBirthYear(y || '');
          setBirthMonth(m || '');
          setBirthDay(d || '');
        }
      } catch (e) {
        setError('프로필을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
    fetchPortfolios();
  }, []);

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
    if (value.length <= 11) {
      if (value.length < 4) {
        setEditProfile(prev => ({ ...prev, phone: value }));
      } else if (value.length < 8) {
        setEditProfile(prev => ({ ...prev, phone: value.slice(0, 3) + '-' + value.slice(3) }));
      } else {
        setEditProfile(prev => ({ ...prev, phone: value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11) }));
      }
    }
  };

  const handleBirthYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 4) {
      setBirthYear(value);
    }
  };

  const handleBirthMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const numValue = parseInt(value);
    if (value === '' || (numValue >= 1 && numValue <= 12)) {
      setBirthMonth(value);
    }
  };

  const handleBirthDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const numValue = parseInt(value);
    if (value === '' || (numValue >= 1 && numValue <= 31)) {
      setBirthDay(value);
    }
  };

  const handleEmailIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, '');
    setEmailId(value);
  };

  const handleEmailDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEmailDomain(value);
    if (value !== '직접입력') {
      setCustomDomain('');
    }
  };

  const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9.-]/g, '');
    setCustomDomain(value);
  };

  const handleEditSave = async () => {
    setValidationError('');

    // 필수값 유효성 검사
    if (!editProfile.name) {
      setValidationError('이름을 입력해주세요.');
      return;
    }
    if (!birthYear || !birthMonth || !birthDay) {
      setValidationError('생년월일을 모두 입력해주세요.');
      return;
    }
    if (!editProfile.phone) {
      setValidationError('전화번호를 입력해주세요.');
      return;
    }
    if (!emailId || !(emailDomain === '직접입력' ? customDomain : emailDomain)) {
      setValidationError('이메일을 모두 입력해주세요.');
      return;
    }

    // 비밀번호 유효성 검사
    if (newPassword && newPassword !== newPasswordCheck) {
      setValidationError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!newPassword && newPasswordCheck) {
      setValidationError('비밀번호 변경란을 먼저 입력해주세요.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', editProfile.name);
      formData.append('gender', editProfile.gender);
      formData.append('phone', editProfile.phone);
      formData.append('email', `${emailId}@${emailDomain === '직접입력' ? customDomain : emailDomain}`);
      formData.append('birth', `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`);
      if (newPassword) {
        formData.append('newPassword', newPassword);
      }
      if (editProfile.profileImage && typeof editProfile.profileImage !== 'string') {
        formData.append('profileImg', editProfile.profileImage);
      }

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

  const handleEditClick = () => {
    // 기존 프로필 데이터를 수정 폼에 복사
    setEditProfile({
      ...profile,
      profileImage: profile.profileImage
    });

    // 이메일 분리 및 초기화
    if (profile.email) {
      const [id, domain] = profile.email.split('@');
      setEmailId(id || '');
      const isCustomDomain = !EMAIL_DOMAINS.includes(domain);
      setEmailDomain(isCustomDomain ? '직접입력' : domain);
      setCustomDomain(isCustomDomain ? domain : '');
    } else {
      setEmailId('');
      setEmailDomain('gmail.com');
      setCustomDomain('');
    }

    // 생년월일 분리
    if (profile.birth) {
      const [y, m, d] = profile.birth.split('-');
      setBirthYear(y || '');
      setBirthMonth(m || '');
      setBirthDay(d || '');
    }

    // 비밀번호 필드 초기화
    setNewPassword('');
    setNewPasswordCheck('');

    // 이미지 프리뷰 설정
    setImgPreview(profile.profileImage ? 
      (typeof profile.profileImage === 'string' ? 
        (profile.profileImage.startsWith('http') ? 
          profile.profileImage : 
          `${process.env.REACT_APP_API_URL}/${profile.profileImage}`) : 
        '') : 
      null
    );

    // 수정 모드로 전환
    setIsEdit(true);
  };

  // 저장/취소 버튼 스타일
  const ButtonRow = styled.div`
    display: flex;
    gap: 1.2rem;
    justify-content: center;
    margin-top: 18px;
  `;

  const CancelButton = styled.button`
    background: #4B89DC;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.9rem 2.5rem;
    font-size: 1.15rem;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(80,120,255,0.13);
    cursor: pointer;
    transition: background 0.15s;
    &:hover { background: #346bb3; }
  `;

  const SaveButton = styled.button`
    background: #4B89DC;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.9rem 2.5rem;
    font-size: 1.15rem;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(80,120,255,0.13);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    transition: background 0.15s;
    &:hover { background: #346bb3; }
  `;

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <LogoContainer onClick={() => navigate('/')}>
        <Logo>산학협력</Logo>
      </LogoContainer>
      <SectionTitle>내정보 수정</SectionTitle>
      <Container>
        {!isEdit ? (
          <div style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 120, height: 120, borderRadius: 12, background: '#f3f3f3', border: '1.5px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, overflow: 'hidden', position: 'relative' }}>
                  {profile.profileImage ? (
                    <img src={typeof profile.profileImage === 'string' ? (profile.profileImage.startsWith('http') ? profile.profileImage : `${process.env.REACT_APP_API_URL}/${profile.profileImage}`) : ''} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#aaa', fontSize: 14 }}>(이미지 없음)</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#888' }}>프로필 사진</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 15, color: '#888', marginBottom: 4 }}>아이디</div>
                  <div style={{ background: '#ccc', color: '#333', borderRadius: 8, padding: '0.7rem 1.2rem', fontSize: 18, fontWeight: 500, display: 'inline-block' }}>{profile.username}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 15, color: '#888', marginBottom: 4 }}>이름</div>
                  <div style={{ fontSize: 18 }}>{profile.name}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 15, color: '#888', marginBottom: 4 }}>생년월일</div>
                  <div style={{ fontSize: 18 }}>{profile.birth}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 15, color: '#888', marginBottom: 4 }}>전화 번호</div>
                  <div style={{ fontSize: 18 }}>{profile.phone}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 15, color: '#888', marginBottom: 4 }}>이메일</div>
                  <div style={{ fontSize: 18 }}>{profile.email}</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
              <Button type="button" onClick={handleEditClick}>수정하기</Button>
            </div>
          </div>
        ) : (
          <Form onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 120, height: 120, borderRadius: 12, background: '#f3f3f3', border: '1.5px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, overflow: 'hidden', position: 'relative' }}>
                  {imgPreview ? (
                    <img src={imgPreview} alt="프로필 미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#aaa', fontSize: 14 }}>(이미지 삽입)</span>
                  )}
                  <input type="file" accept="image/*" onChange={handleImgChange} style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, left: 0, top: 0, cursor: 'pointer' }} />
                </div>
                <div style={{ fontSize: 13, color: '#888' }}>프로필 사진</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 15, color: '#888', marginBottom: 4 }}>아이디</div>
                  <div style={{ background: '#ccc', color: '#333', borderRadius: 8, padding: '0.7rem 1.2rem', fontSize: 18, fontWeight: 500, display: 'inline-block' }}>{profile.username}</div>
                </div>
              </div>
            </div>
            <FormGroup>
              <label>이름</label>
              <input 
                name="name" 
                value={editProfile.name} 
                onChange={handleEditChange} 
                placeholder="이름" 
                required 
              />
            </FormGroup>
            <FormGroup>
              <label>생년월일</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="text" 
                  placeholder="년" 
                  value={birthYear} 
                  onChange={handleBirthYearChange} 
                  style={{ width: 80 }} 
                  maxLength={4}
                />
                <input 
                  type="text" 
                  placeholder="월" 
                  value={birthMonth} 
                  onChange={handleBirthMonthChange} 
                  style={{ width: 50 }} 
                  maxLength={2}
                />
                <input 
                  type="text" 
                  placeholder="일" 
                  value={birthDay} 
                  onChange={handleBirthDayChange} 
                  style={{ width: 50 }} 
                  maxLength={2}
                />
              </div>
            </FormGroup>
            <FormGroup>
              <label>전화 번호</label>
              <input 
                name="phone" 
                value={editProfile.phone} 
                onChange={handlePhoneEditChange} 
                placeholder="010-1234-5678" 
                maxLength={13} 
              />
            </FormGroup>
            <FormGroup>
              <label>이메일</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input 
                  style={{ width: 120 }} 
                  value={emailId} 
                  onChange={handleEmailIdChange} 
                  placeholder="이메일 아이디" 
                />
                <span>@</span>
                {emailDomain !== '직접입력' ? (
                  <select 
                    value={emailDomain} 
                    onChange={handleEmailDomainChange} 
                    style={{ width: 120, padding: '0.5rem', borderRadius: 4, border: '1px solid #ddd' }}
                  >
                    {EMAIL_DOMAINS.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    style={{ width: 120 }} 
                    value={customDomain} 
                    onChange={handleCustomDomainChange} 
                    placeholder="도메인 입력" 
                  />
                )}
              </div>
            </FormGroup>
            {validationError && (
              <div style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                {validationError}
              </div>
            )}
            <FormGroup>
              <label>비밀번호 변경</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="8자 이상 입력하세요" minLength={8} />
            </FormGroup>
            <FormGroup>
              <label>비밀번호 확인</label>
              <input type="password" value={newPasswordCheck} onChange={e => setNewPasswordCheck(e.target.value)} placeholder="비밀번호를 다시 입력하세요" minLength={8} />
            </FormGroup>
            <ButtonRow>
              <CancelButton type="button" onClick={() => { setIsEdit(false); setEditProfile(profile); setImgPreview(profile.profileImage ? `${process.env.REACT_APP_API_URL}/${profile.profileImage}` : null); }}>취소</CancelButton>
              <SaveButton type="submit">변경 및 저장</SaveButton>
            </ButtonRow>
          </Form>
        )}
      </Container>
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