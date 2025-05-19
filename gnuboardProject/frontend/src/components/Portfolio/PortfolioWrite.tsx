import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Skill, Keyword, Section } from '../../types/portfolio';
import { PortfolioData } from '../../types/portfolio';

const LogoContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-size: 1.5rem;
  font-weight: bold;
  transition: color 0.3s ease;
  
  &:hover {
    color: #007bff;
  }
`;

const LogoText = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  background: linear-gradient(45deg, #007bff, #00bcd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #e0e0e0;
    z-index: 1;
  }
`;

const ProgressStep = styled.div<{ active: boolean; completed: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.completed ? '#007bff' : props.active ? '#fff' : '#e0e0e0'};
  border: 2px solid ${props => props.completed || props.active ? '#007bff' : '#e0e0e0'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.completed ? '#fff' : props.active ? '#007bff' : '#666'};
  font-weight: bold;
  position: relative;
  z-index: 2;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const StepLabel = styled.div<{ active: boolean; completed: boolean }>`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.9rem;
  color: ${props => props.completed || props.active ? '#007bff' : '#666'};
`;

const Form = styled.form`
  background: #fff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SectionContainer = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #007bff;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  color: #555;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #0056b3;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: space-between;
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const DeleteButton = styled.button`
  background: #dc3545;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #c82333;
  }
`;

const DateInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const DateRangeContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 4px;
`;

const ItemContainer = styled.div`
  position: relative;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: #fff;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
`;

const AddButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
`;

const steps = [
  { id: 1, label: '기본 정보' },
  { id: 2, label: '스킬' },
  { id: 3, label: '학력' },
  { id: 4, label: '경력' },
  { id: 5, label: '프로젝트' },
  { id: 6, label: '자격증' },
  { id: 7, label: '어학' },
  { id: 8, label: '활동' },
];

const PortfolioWrite: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PortfolioData>({
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      introduction: '',
      profileImage: '',
    },
    skills: [],
    experiences: [],
    education: [],
    projects: [],
    certificates: [],
    languages: [],
    activities: [],
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [profileImgUrl, setProfileImgUrl] = useState<string>('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    axios.get('/skills').then(res => setSkills(res.data));
    
    if (id) {
      axios.get(`/portfolios/${id}`).then(res => {
        const data = res.data;
        setFormData({
          personalInfo: {
            name: data.name || '',
            title: data.title || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            introduction: data.introduction || '',
            profileImage: data.profileImage || '',
          },
          skills: data.skills || [],
          experiences: data.experiences || [],
          education: data.education || [],
          projects: data.projects || [],
          certificates: data.certificates || [],
          languages: data.languages || [],
          activities: data.activities || [],
        });
        if (data.profileImage) {
          setProfileImgUrl(data.profileImage);
        }
      });
    }
  }, [id]);

  const handleInputChange = (section: keyof PortfolioData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImg(e.target.files[0]);
      setProfileImgUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9-]*$/;
    return phoneRegex.test(phone);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (!validateEmail(email) && email !== '') {
      setEmailError('올바른 이메일 형식이 아닙니다.');
    } else {
      setEmailError('');
    }
    handleInputChange('personalInfo', 'email', email);
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    if (!validatePhone(phone)) {
      setPhoneError('숫자와 하이픈(-)만 입력 가능합니다.');
      return;
    }
    setPhoneError('');
    handleInputChange('personalInfo', 'phone', phone);
  };

  const handleSkillChange = (skillName: string) => {
    setFormData(prev => {
      const skillExists = prev.skills.some(s => s.name === skillName);
      if (skillExists) {
        return {
          ...prev,
          skills: prev.skills.filter(s => s.name !== skillName)
        };
      } else {
        return {
          ...prev,
          skills: [...prev.skills, { name: skillName, level: '' }]
        };
      }
    });
  };

  const handleDateChange = (startDate: string, endDate: string, index: number, type: 'education' | 'experience') => {
    const formattedDate = `${startDate} - ${endDate}`;
    
    if (type === 'education') {
      const newEducation = [...formData.education];
      newEducation[index] = { ...newEducation[index], date: formattedDate };
      setFormData(prev => ({ ...prev, education: newEducation }));
    } else {
      const newExperiences = [...formData.experiences];
      newExperiences[index] = { ...newExperiences[index], date: formattedDate };
      setFormData(prev => ({ ...prev, experiences: newExperiences }));
    }
  };

  const handleDelete = (index: number, type: 'education' | 'experience' | 'project' | 'certificate' | 'language' | 'activity') => {
    switch (type) {
      case 'education':
        setFormData(prev => ({
          ...prev,
          education: prev.education.filter((_, i) => i !== index)
        }));
        break;
      case 'experience':
        setFormData(prev => ({
          ...prev,
          experiences: prev.experiences.filter((_, i) => i !== index)
        }));
        break;
      case 'project':
        setFormData(prev => ({
          ...prev,
          projects: prev.projects.filter((_, i) => i !== index)
        }));
        break;
      case 'certificate':
        setFormData(prev => ({
          ...prev,
          certificates: prev.certificates.filter((_, i) => i !== index)
        }));
        break;
      case 'language':
        setFormData(prev => ({
          ...prev,
          languages: prev.languages.filter((_, i) => i !== index)
        }));
        break;
      case 'activity':
        setFormData(prev => ({
          ...prev,
          activities: prev.activities.filter((_, i) => i !== index)
        }));
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (emailError || phoneError) {
      alert('입력값을 확인해주세요.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      if (profileImg) {
        formDataToSend.append('photo', profileImg);
      }

      const portfolioData = {
        title: formData.personalInfo.title,
        summary: formData.personalInfo.introduction,
        content: JSON.stringify({
          personalInfo: formData.personalInfo,
          education: formData.education,
          experiences: formData.experiences,
          projects: formData.projects,
          certificates: formData.certificates,
          languages: formData.languages,
          activities: formData.activities
        }),
        skills: JSON.stringify(formData.skills.map(skill => skill.name)),
        keywords: JSON.stringify([]),
        sections: JSON.stringify([
          ...formData.education.map((edu, index) => ({
            title: '학력',
            content: JSON.stringify(edu),
            order: index
          })),
          ...formData.experiences.map((exp, index) => ({
            title: '경력',
            content: JSON.stringify(exp),
            order: index + formData.education.length
          })),
          ...formData.projects.map((proj, index) => ({
            title: '프로젝트',
            content: JSON.stringify(proj),
            order: index + formData.education.length + formData.experiences.length
          })),
          ...formData.certificates.map((cert, index) => ({
            title: '자격증',
            content: JSON.stringify(cert),
            order: index + formData.education.length + formData.experiences.length + formData.projects.length
          })),
          ...formData.languages.map((lang, index) => ({
            title: '어학',
            content: JSON.stringify(lang),
            order: index + formData.education.length + formData.experiences.length + formData.projects.length + formData.certificates.length
          })),
          ...formData.activities.map((act, index) => ({
            title: '활동',
            content: JSON.stringify(act),
            order: index + formData.education.length + formData.experiences.length + formData.projects.length + formData.certificates.length + formData.languages.length
          }))
        ]),
        isPrivate: 'false'
      };

      Object.entries(portfolioData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const endpoint = id ? `/portfolios/${id}` : '/portfolios';
      const method = id ? 'put' : 'post';

      const response = await axios({
        method,
        url: endpoint,
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert('포트폴리오가 성공적으로 저장되었습니다.');
        navigate('/portfolios');
      }
    } catch (error) {
      console.error('Error saving portfolio:', error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '저장 중 오류가 발생했습니다.');
      } else {
        alert('저장 중 오류가 발생했습니다.');
      }
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SectionContainer>
            <SectionTitle>기본 정보</SectionTitle>
            <FormGroup>
              <Label>프로필 이미지</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
              />
              {profileImgUrl && (
                <img
                  src={profileImgUrl}
                  alt="Profile"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }}
                />
              )}
            </FormGroup>
            <FormGroup>
              <Label>이름</Label>
              <Input
                type="text"
                value={formData.personalInfo.name}
                onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>직무</Label>
              <Input
                type="text"
                value={formData.personalInfo.title}
                onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>이메일</Label>
              <Input
                type="email"
                value={formData.personalInfo.email}
                onChange={handleEmailChange}
                required
              />
              {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>전화번호</Label>
              <Input
                type="tel"
                value={formData.personalInfo.phone}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
              />
              {phoneError && <ErrorMessage>{phoneError}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>소개</Label>
              <TextArea
                value={formData.personalInfo.introduction}
                onChange={(e) => handleInputChange('personalInfo', 'introduction', e.target.value)}
                required
              />
            </FormGroup>
          </SectionContainer>
        );
      case 2:
        return (
          <SectionContainer>
            <SectionTitle>스킬</SectionTitle>
            <CheckboxGroup>
              {skills.map(skill => (
                <CheckboxLabel key={skill.id}>
                  <input
                    type="checkbox"
                    checked={formData.skills.some(s => s.name === skill.name)}
                    onChange={() => handleSkillChange(skill.name)}
                  />
                  {skill.name}
                </CheckboxLabel>
              ))}
            </CheckboxGroup>
          </SectionContainer>
        );
      case 3:
        return (
          <SectionContainer>
            <SectionTitle>학력</SectionTitle>
            {formData.education.map((edu, index) => (
              <ItemContainer key={index}>
                <FormGroup>
                  <Label>학교</Label>
                  <Input
                    type="text"
                    value={edu.school}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index] = { ...edu, school: e.target.value };
                      setFormData(prev => ({ ...prev, education: newEducation }));
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>학위</Label>
                  <Input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index] = { ...edu, degree: e.target.value };
                      setFormData(prev => ({ ...prev, education: newEducation }));
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>기간</Label>
                  <DateRangeContainer>
                    <DateInput
                      type="date"
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        const [startDate] = newEducation[index].date.split(' - ');
                        handleDateChange(e.target.value, startDate || '', index, 'education');
                      }}
                    />
                    <span>~</span>
                    <DateInput
                      type="date"
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        const [, endDate] = newEducation[index].date.split(' - ');
                        handleDateChange(endDate || '', e.target.value, index, 'education');
                      }}
                    />
                  </DateRangeContainer>
                </FormGroup>
                <FormGroup>
                  <Label>설명</Label>
                  <TextArea
                    value={edu.description}
                    onChange={(e) => {
                      const newEducation = [...formData.education];
                      newEducation[index] = { ...edu, description: e.target.value };
                      setFormData(prev => ({ ...prev, education: newEducation }));
                    }}
                  />
                </FormGroup>
                <ButtonContainer>
                  <DeleteButton onClick={() => handleDelete(index, 'education')}>
                    삭제
                  </DeleteButton>
                </ButtonContainer>
              </ItemContainer>
            ))}
            <AddButton
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  education: [
                    ...prev.education,
                    { school: '', degree: '', date: '', description: '' },
                  ],
                }));
              }}
            >
              학력 추가
            </AddButton>
          </SectionContainer>
        );
      case 4:
        return (
          <SectionContainer>
            <SectionTitle>경력</SectionTitle>
            {formData.experiences.map((exp, index) => (
              <ItemContainer key={index}>
                <FormGroup>
                  <Label>직무</Label>
                  <Input
                    type="text"
                    value={exp.title}
                    onChange={(e) => {
                      const newExperiences = [...formData.experiences];
                      newExperiences[index] = { ...exp, title: e.target.value };
                      setFormData(prev => ({ ...prev, experiences: newExperiences }));
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>회사</Label>
                  <Input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const newExperiences = [...formData.experiences];
                      newExperiences[index] = { ...exp, company: e.target.value };
                      setFormData(prev => ({ ...prev, experiences: newExperiences }));
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>기간</Label>
                  <DateRangeContainer>
                    <DateInput
                      type="date"
                      onChange={(e) => {
                        const newExperiences = [...formData.experiences];
                        const [startDate] = newExperiences[index].date.split(' - ');
                        handleDateChange(e.target.value, startDate || '', index, 'experience');
                      }}
                    />
                    <span>~</span>
                    <DateInput
                      type="date"
                      onChange={(e) => {
                        const newExperiences = [...formData.experiences];
                        const [, endDate] = newExperiences[index].date.split(' - ');
                        handleDateChange(endDate || '', e.target.value, index, 'experience');
                      }}
                    />
                  </DateRangeContainer>
                </FormGroup>
                <FormGroup>
                  <Label>설명</Label>
                  <TextArea
                    value={exp.description}
                    onChange={(e) => {
                      const newExperiences = [...formData.experiences];
                      newExperiences[index] = { ...exp, description: e.target.value };
                      setFormData(prev => ({ ...prev, experiences: newExperiences }));
                    }}
                  />
                </FormGroup>
                <ButtonContainer>
                  <DeleteButton onClick={() => handleDelete(index, 'experience')}>
                    삭제
                  </DeleteButton>
                </ButtonContainer>
              </ItemContainer>
            ))}
            <AddButton
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  experiences: [
                    ...prev.experiences,
                    { title: '', company: '', date: '', description: '' },
                  ],
                }));
              }}
            >
              경력 추가
            </AddButton>
          </SectionContainer>
        );
      case 5:
        return (
          <SectionContainer>
            <SectionTitle>프로젝트</SectionTitle>
            {formData.projects.map((project, index) => (
              <ItemContainer key={index}>
                <FormGroup>
                  <Label>프로젝트명</Label>
                  <Input
                    type="text"
                    value={project.title}
                    onChange={(e) => {
                      const newProjects = [...formData.projects];
                      newProjects[index] = { ...project, title: e.target.value };
                      setFormData(prev => ({ ...prev, projects: newProjects }));
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>설명</Label>
                  <TextArea
                    value={project.description}
                    onChange={(e) => {
                      const newProjects = [...formData.projects];
                      newProjects[index] = { ...project, description: e.target.value };
                      setFormData(prev => ({ ...prev, projects: newProjects }));
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>사용 기술</Label>
                  <Input
                    type="text"
                    value={project.technologies.join(', ')}
                    onChange={(e) => {
                      const newProjects = [...formData.projects];
                      newProjects[index] = {
                        ...project,
                        technologies: e.target.value.split(',').map(tech => tech.trim()),
                      };
                      setFormData(prev => ({ ...prev, projects: newProjects }));
                    }}
                    placeholder="쉼표로 구분하여 입력"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>링크</Label>
                  <Input
                    type="url"
                    value={project.link || ''}
                    onChange={(e) => {
                      const newProjects = [...formData.projects];
                      newProjects[index] = { ...project, link: e.target.value };
                      setFormData(prev => ({ ...prev, projects: newProjects }));
                    }}
                  />
                </FormGroup>
                <ButtonContainer>
                  <DeleteButton onClick={() => handleDelete(index, 'project')}>
                    삭제
                  </DeleteButton>
                </ButtonContainer>
              </ItemContainer>
            ))}
            <AddButton
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  projects: [
                    ...prev.projects,
                    { title: '', description: '', technologies: [], link: '' },
                  ],
                }));
              }}
            >
              프로젝트 추가
            </AddButton>
          </SectionContainer>
        );
      case 6:
        return (
          <SectionContainer>
            <SectionTitle>자격증</SectionTitle>
            {formData.certificates.map((cert, index) => (
              <ItemContainer key={index}>
                <FormGroup>
                  <Label>자격증명</Label>
                  <Input
                    type="text"
                    value={cert.name}
                    onChange={(e) => {
                      const newCertificates = [...formData.certificates];
                      newCertificates[index] = { ...cert, name: e.target.value };
                      setFormData(prev => ({ ...prev, certificates: newCertificates }));
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>발행처</Label>
                  <Input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => {
                      const newCertificates = [...formData.certificates];
                      newCertificates[index] = { ...cert, issuer: e.target.value };
                      setFormData(prev => ({ ...prev, certificates: newCertificates }));
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>취득일</Label>
                  <DateInput
                    type="date"
                    value={cert.date}
                    onChange={(e) => {
                      const newCertificates = [...formData.certificates];
                      newCertificates[index] = { ...cert, date: e.target.value };
                      setFormData(prev => ({ ...prev, certificates: newCertificates }));
                    }}
                  />
                </FormGroup>
                <ButtonContainer>
                  <DeleteButton onClick={() => handleDelete(index, 'certificate')}>
                    삭제
                  </DeleteButton>
                </ButtonContainer>
              </ItemContainer>
            ))}
            <AddButton
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  certificates: [
                    ...prev.certificates,
                    { name: '', issuer: '', date: '' },
                  ],
                }));
              }}
            >
              자격증 추가
            </AddButton>
          </SectionContainer>
        );
      case 7:
        return (
          <SectionContainer>
            <SectionTitle>어학</SectionTitle>
            {formData.languages.map((lang, index) => (
              <ItemContainer key={index}>
                <FormGroup>
                  <Label>언어</Label>
                  <Input
                    type="text"
                    value={lang.name}
                    onChange={(e) => {
                      const newLanguages = [...formData.languages];
                      newLanguages[index] = { ...lang, name: e.target.value };
                      setFormData(prev => ({ ...prev, languages: newLanguages }));
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>수준</Label>
                  <Input
                    type="text"
                    value={lang.level}
                    onChange={(e) => {
                      const newLanguages = [...formData.languages];
                      newLanguages[index] = { ...lang, level: e.target.value };
                      setFormData(prev => ({ ...prev, languages: newLanguages }));
                    }}
                  />
                </FormGroup>
                <ButtonContainer>
                  <DeleteButton onClick={() => handleDelete(index, 'language')}>
                    삭제
                  </DeleteButton>
                </ButtonContainer>
              </ItemContainer>
            ))}
            <AddButton
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  languages: [
                    ...prev.languages,
                    { name: '', level: '' },
                  ],
                }));
              }}
            >
              어학 추가
            </AddButton>
          </SectionContainer>
        );
      case 8:
        return (
          <SectionContainer>
            <SectionTitle>활동</SectionTitle>
            {formData.activities.map((activity, index) => (
              <ItemContainer key={index}>
                <FormGroup>
                  <Label>활동명</Label>
                  <Input
                    type="text"
                    value={activity.title}
                    onChange={(e) => {
                      const newActivities = [...formData.activities];
                      newActivities[index] = { ...activity, title: e.target.value };
                      setFormData(prev => ({ ...prev, activities: newActivities }));
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>설명</Label>
                  <TextArea
                    value={activity.description}
                    onChange={(e) => {
                      const newActivities = [...formData.activities];
                      newActivities[index] = { ...activity, description: e.target.value };
                      setFormData(prev => ({ ...prev, activities: newActivities }));
                    }}
                  />
                </FormGroup>
                <ButtonContainer>
                  <DeleteButton onClick={() => handleDelete(index, 'activity')}>
                    삭제
                  </DeleteButton>
                </ButtonContainer>
              </ItemContainer>
            ))}
            <AddButton
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  activities: [
                    ...prev.activities,
                    { title: '', description: '' },
                  ],
                }));
              }}
            >
              활동 추가
            </AddButton>
          </SectionContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <LogoContainer>
        <Logo to="/">
          <LogoText>산학협력</LogoText>
        </Logo>
      </LogoContainer>

      <Header>
        <Title>포트폴리오 작성</Title>
        <Subtitle>당신의 경력과 성과를 보여주세요</Subtitle>
      </Header>

      <ProgressBar>
        {steps.map((step) => (
          <ProgressStep
            key={step.id}
            active={currentStep === step.id}
            completed={currentStep > step.id}
            onClick={() => setCurrentStep(step.id)}
          >
            {step.id}
            <StepLabel active={currentStep === step.id} completed={currentStep > step.id}>
              {step.label}
            </StepLabel>
          </ProgressStep>
        ))}
      </ProgressBar>

      <Form onSubmit={handleSubmit}>
        {renderStep()}
        
        <ButtonGroup>
          {currentStep > 1 && (
            <Button type="button" onClick={prevStep}>
              이전
            </Button>
          )}
          {currentStep < steps.length ? (
            <Button type="button" onClick={nextStep}>
              다음
            </Button>
          ) : (
            <Button type="submit">저장</Button>
          )}
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default PortfolioWrite; 