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
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 3rem 3.5rem;
  margin-bottom: 0;
  max-width: 1000px;
  min-width: 320px;
  width: 100%;
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
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2.2rem;
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

const ProfileImgWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0;
`;

const ProfileImg = styled.img`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 2.5rem;
  background: #f0f0f0;
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

const PageBg = styled.div`
  min-height: 100vh;
  background: #e5e5e5;
  padding: 4rem 0 6rem 0;
`;

const CardRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  align-items: center;
`;

const ModalCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  max-width: 520px;
  width: 100%;
  margin: 3rem auto;
  padding: 3.5rem 2.5rem 2.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalTitle = styled.div`
  font-size: 2.1rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2.5rem;
`;

const ProfileImgSquare = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 12px;
  background: repeating-linear-gradient(45deg, #eee 0 10px, #fff 10px 20px);
  border: 1.5px dashed #bbb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.7rem;
  position: relative;
  overflow: hidden;
`;

const IdBox = styled.div`
  background: #bbb;
  color: #fff;
  border-radius: 8px;
  padding: 0.7rem 1.2rem;
  font-size: 1.1rem;
  font-weight: 500;
  display: inline-block;
  margin-left: 1.2rem;
`;

const ModalForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ModalRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const ModalInput = styled.input`
  flex: 1;
  padding: 0.9rem 1.1rem;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1.1rem;
  background: #fafbfc;
`;

const ModalSelect = styled.select`
  flex: 1;
  padding: 0.9rem 1.1rem;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1.1rem;
  background: #fafbfc;
`;

const ModalBtnRow = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2.5rem;
`;

const ModalButton = styled.button`
  background: #90b8f8;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 1rem 2.8rem;
  font-size: 1.15rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(80,120,255,0.10);
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  &:hover { background: #7ea6e6; }
  &:last-child {
    background: #4B89DC;
    &:hover { background: #346bb3; }
  }
`;

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

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <PageBg>
      <LogoContainer onClick={() => navigate('/')}>
        <Logo>산학협력</Logo>
      </LogoContainer>
      <CardRow>
        <div style={{width: '100%', maxWidth: 1000}}>
          <SectionTitle style={{marginBottom: '1.2rem'}}>나의 정보</SectionTitle>
          <InfoCard>
            <EditButton onClick={handleEditClick}>✏️ 수정하기</EditButton>
            {isEdit ? (
              <ModalCard>
                <ModalTitle>내정보 수정</ModalTitle>
                <ModalForm onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
                  <ModalRow>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1}}>
                      <ProfileImgSquare>
                        {imgPreview ? (
                          <img src={imgPreview} alt="프로필 미리보기" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                        ) : (
                          <span style={{ color: '#aaa', fontSize: 15 }}>(이미지 삽입)</span>
                        )}
                        <input type="file" accept="image/*" onChange={handleImgChange} style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, left: 0, top: 0, cursor: 'pointer' }} />
                      </ProfileImgSquare>
                      <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>프로필 사진</div>
                    </div>
                    <div style={{flex:2,display:'flex',flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
                      <span style={{fontSize:'1.1rem',color:'#888',marginBottom:4}}>아이디</span>
                      <IdBox>{profile.username}</IdBox>
                    </div>
                  </ModalRow>
                  <ModalInput name="name" value={editProfile.name} onChange={handleEditChange} placeholder="이름" required />
                  <ModalRow>
                    <ModalInput type="text" placeholder="년" value={birthYear} onChange={handleBirthYearChange} maxLength={4} style={{width:90}} />
                    <ModalInput type="text" placeholder="월" value={birthMonth} onChange={handleBirthMonthChange} maxLength={2} style={{width:60}} />
                    <ModalInput type="text" placeholder="일" value={birthDay} onChange={handleBirthDayChange} maxLength={2} style={{width:60}} />
                  </ModalRow>
                  <ModalInput name="phone" value={editProfile.phone} onChange={handlePhoneEditChange} placeholder="전화번호" maxLength={13} />
                  <ModalRow>
                    <ModalInput style={{width:150}} value={emailId} onChange={handleEmailIdChange} placeholder="이메일 아이디" />
                    <span>@</span>
                    {emailDomain !== '직접입력' ? (
                      <ModalSelect value={emailDomain} onChange={handleEmailDomainChange} style={{width:150}}>
                        {EMAIL_DOMAINS.map(domain => (
                          <option key={domain} value={domain}>{domain}</option>
                        ))}
                      </ModalSelect>
                    ) : (
                      <ModalInput style={{width:150}} value={customDomain} onChange={handleCustomDomainChange} placeholder="도메인 입력" />
                    )}
                  </ModalRow>
                  <ModalInput type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="비밀번호 변경 (8자 이상 입력하세요)" minLength={8} />
                  <ModalInput type="password" value={newPasswordCheck} onChange={e => setNewPasswordCheck(e.target.value)} placeholder="비밀번호 확인 (비밀번호를 다시 입력하세요)" minLength={8} />
                  {validationError && (
                    <div style={{ color: 'red', marginTop: '0.5rem', fontSize: '1rem', textAlign: 'center' }}>{validationError}</div>
                  )}
                  <ModalBtnRow>
                    <ModalButton type="button" onClick={() => { setIsEdit(false); setEditProfile(profile); setImgPreview(profile.profileImage ? `${process.env.REACT_APP_API_URL}/${profile.profileImage}` : null); setValidationError(''); }}>취소</ModalButton>
                    <ModalButton type="submit"><span role="img" aria-label="저장">💾</span> 변경 및 저장</ModalButton>
                  </ModalBtnRow>
                </ModalForm>
              </ModalCard>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <ProfileImgWrapper>
                  {profile.profileImage ? (
                    <ProfileImg src={typeof profile.profileImage === 'string' ? (profile.profileImage.startsWith('http') ? profile.profileImage : `${process.env.REACT_APP_API_URL}/${profile.profileImage}`) : ''} alt="프로필" />
                  ) : (
                    <div style={{background:'#ddd',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3.5rem',color:'#aaa',width:130,height:130,borderRadius:'50%'}}>●</div>
                  )}
                </ProfileImgWrapper>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{profile.name}</div>
                  <div style={{ color: '#444', fontSize: '1.2rem', margin: '0.2rem 0' }}>{profile.gender}</div>
                  <div style={{ color: '#444', fontSize: '1.2rem', margin: '0.2rem 0' }}>{profile.birth}</div>
                  <div style={{ color: '#444', fontSize: '1.2rem', margin: '0.2rem 0' }}>{profile.phone}</div>
                  <div style={{ color: '#444', fontSize: '1.2rem', margin: '0.2rem 0' }}>{profile.email}</div>
                </div>
              </div>
            )}
          </InfoCard>
        </div>
        <div style={{width: '100%', maxWidth: 1000}}>
          <SectionTitle style={{marginBottom: '1.2rem'}}>나의 포트폴리오</SectionTitle>
          <InfoCard>
            <EditButton onClick={() => alert('포트폴리오 관리 기능 준비중')}>✏️ 수정하기</EditButton>
            <PortfolioList>
              {portfolios.length === 0 ? (
                <PortfolioItem>작성한 포트폴리오가 없습니다.</PortfolioItem>
              ) : (
                portfolios.map(p => (
                  <PortfolioItem key={p.id}>{p.title}</PortfolioItem>
                ))
              )}
            </PortfolioList>
          </InfoCard>
        </div>
      </CardRow>
    </PageBg>
  );
};

export default Profile; 