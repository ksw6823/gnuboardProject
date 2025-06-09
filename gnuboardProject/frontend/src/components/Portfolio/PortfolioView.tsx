import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Common/Header';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatPhone } from '../../utils/phoneFormat';

const Layout = styled.div`
  display: flex;
  background: #f7f7f7;
  min-height: 100vh;
`;

const MainCard = styled.div`
  flex: 2;
  background: #fff;
  margin: 2.5rem 1.5rem 2.5rem 3.5rem;
  border-radius: 18px;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  position: relative;
`;

const SideCard = styled.div`
  flex: 1;
  margin: 2.5rem 3.5rem 2.5rem 0;
  background: #fff;
  border-radius: 18px;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  min-width: 340px;
  height: fit-content;
  position: sticky;
  top: 2.5rem;
  z-index: 10;
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ProfileImg = styled.img`
  width: 120px;
  height: 160px;
  border-radius: 16px;
  object-fit: cover;
  background: #eee;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const PDFButton = styled.button`
  position: absolute;
  right: 2.5rem;
  top: 2.5rem;
  background: #4B89DC;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionTitle = styled.div`
  font-weight: 700;
  font-size: 1.08rem;
  margin: 1.5rem 0 0.5rem 0;
  color: #4B89DC;
`;

const TagRow = styled.div`
  margin: 0.7rem 0 0.7rem 0;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: #E7F5FF;
  color: #4B89DC;
  padding: 0.32rem 1.1rem;
  border-radius: 15px;
  font-size: 0.92rem;
  font-weight: 500;
`;

const IntroBox = styled.div`
  border: 1.5px solid #E9ECEF;
  border-radius: 10px;
  padding: 1.2rem;
  min-height: 80px;
  background: #f8f9fa;
  font-size: 1.05rem;
  color: #495057;
`;

const CareerList = styled.ul`
  margin: 0.5rem 0 0 0;
  padding: 0;
  list-style: none;
`;

const CareerItem = styled.li`
  margin-bottom: 1.1rem;
  font-size: 1.01rem;
`;

const CommentInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: auto;
  border-top: 1px solid #eee;
  padding-top: 1rem;
`;

const LikeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-top: 1.2rem;
`;

const CommentButton = styled.button`
  background: #4B89DC;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  &:hover {
    background: #3572b7;
    box-shadow: 0 2px 8px rgba(75, 137, 220, 0.15);
  }
`;

const DeleteButton = styled.button`
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  &:hover {
    background: #c82333;
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.15);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
`;

const ModalText = styled.p`
  margin: 0 0 1.5rem 0;
  color: #666;
  line-height: 1.5;
`;

const ModalButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ModalButton = styled.button<{ variant: 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  ${props => props.variant === 'secondary' ? `
    background: #6c757d;
    color: white;
    &:hover { background: #5a6268; }
  ` : `
    background: #dc3545;
    color: white;
    &:hover { background: #c82333; }
  `}
`;

// PDF 관련 스타일드 컴포넌트들
const PDFPreviewModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
`;

const PDFPreviewContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
`;

const PDFPreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
`;

const DownloadButton = styled.button`
  background: #4B89DC;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
`;

const PDFTemplate = styled.div`
  width: 210mm;
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
  line-height: 1.4;
  padding: 12mm;
  box-sizing: border-box;
`;

const PDFPage = styled.div`
  width: 210mm;
  min-height: 297mm;
  background: white;
  padding: 12mm;
  box-sizing: border-box;
  
  @media print {
    page-break-after: always;
    &:last-child {
      page-break-after: auto;
    }
  }
`;

const PDFHeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  border-bottom: 2px solid #4B89DC;
  padding-bottom: 15px;
`;

const PDFPersonalInfo = styled.div`
  flex: 1;
`;

const PDFNameTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #4B89DC;
  margin: 0 0 10px 0;
`;

const PDFInfoItem = styled.div`
  display: flex;
  margin-bottom: 5px;
  font-size: 12px;
`;

const PDFInfoLabel = styled.span`
  font-weight: 600;
  width: 80px;
  color: #666;
`;

const PDFInfoValue = styled.span`
  color: #333;
`;

const PDFProfileImage = styled.div`
  width: 90px;
  height: 120px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
`;

const PDFSection = styled.div`
  margin-bottom: 20px;
  page-break-inside: avoid;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PDFSectionTitle = styled.h3`
  font-size: 14px;
  font-weight: bold;
  color: #4B89DC;
  margin: 0 0 8px 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 3px;
`;

const PDFTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
`;

const PDFTag = styled.span`
  background: #E7F5FF;
  color: #4B89DC;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
`;

const PDFList = styled.div`
  margin-bottom: 10px;
`;

const PDFListItem = styled.div`
  margin-bottom: 8px;
  font-size: 11px;
`;

const PDFItemTitle = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
`;

const PDFItemSubtitle = styled.div`
  color: #666;
  font-size: 10px;
  margin-bottom: 3px;
`;

const PDFItemDescription = styled.div`
  color: #444;
  font-size: 10px;
  line-height: 1.3;
  white-space: pre-line;
`;



// 프로필 이미지 URL 생성 함수
const getProfileImageUrl = (profileImage: string | undefined) => {
  if (!profileImage) return '/default-profile.png';
  if (profileImage.startsWith('http')) return profileImage;
  return `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/${profileImage}`;
};

const PortfolioView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [skillOptions, setSkillOptions] = useState<any[]>([]);
  const [keywordOptions, setKeywordOptions] = useState<any[]>([]);
  const [jobOptions, setJobOptions] = useState<any[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get(`/portfolios/${id}`);
        setPortfolio(res.data);
      } catch (error) {
        console.error('포트폴리오 불러오기 실패:', error);
      }
    };
    fetchPortfolio();
    
    api.get('/skills')
      .then(res => setSkillOptions(Array.isArray(res.data) ? res.data : []))
      .catch(error => {
        console.error('기술 옵션 불러오기 실패:', error);
        setSkillOptions([]);
      });
      
    api.get('/keywords')
      .then(res => setKeywordOptions(Array.isArray(res.data) ? res.data : []))
      .catch(error => {
        console.error('키워드 옵션 불러오기 실패:', error);
        setKeywordOptions([]);
      });
      
    api.get('/jobs')
      .then(res => setJobOptions(Array.isArray(res.data) ? res.data : []))
      .catch(error => {
        console.error('직무 옵션 불러오기 실패:', error);
        setJobOptions([]);
      });
  }, [id]);

  const fetchComments = useCallback(async (pageToFetch = page) => {
    if (!id) return;
    try {
      const res = await api.get(`/portfolios/${id}/comments?page=${pageToFetch}&pageSize=${pageSize}`);
      setComments(Array.isArray(res.data?.data) ? res.data.data : []);
      setTotal(res.data?.total || 0);
    } catch (error) {
      console.error('댓글 불러오기 실패:', error);
      setComments([]);
      setTotal(0);
    }
  }, [id, page, pageSize]);

  useEffect(() => {
    fetchComments();
    api.get(`/portfolios/${id}/likes/count`).then(res => setLikeCount(res.data));
    if (user) {
      api.get(`/portfolios/${id}/likes/status`).then(res => setHasLiked(res.data));
    } else {
      setHasLiked(false);
    }
  }, [id, page, pageSize, user, fetchComments]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(`/portfolios/${id}/comments`, { content: newComment });
      setNewComment('');
      setPage(1);
      fetchComments(1);
    } catch (e) {
      alert('댓글 등록에 실패했습니다.');
    }
  };

  // PDF 미리보기 모달 열기
  const generatePDFPreview = () => {
    setPdfBlob(null); // PDF blob 초기화
    setShowPDFPreview(true);
  };

  // PDF 생성
  const generatePDF = async () => {
    if (!pdfTemplateRef.current) {
      alert('PDF 템플릿을 찾을 수 없습니다.');
      return;
    }

    try {
      // 전체 내용을 하나의 캔버스로 캡처
      const canvas = await html2canvas(pdfTemplateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: pdfTemplateRef.current.scrollWidth,
        height: pdfTemplateRef.current.scrollHeight
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // A4 페이지 설정
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      
      // 캔버스 크기를 A4 비율로 계산
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      // PDF에서 실제 사용할 이미지 크기 계산 (여백 고려)
      const imgWidth = pdfWidth - 20; // 좌우 10mm 여백
      const imgHeight = (canvasHeight * imgWidth) / canvasWidth;
      
      // 한 페이지에 들어갈 수 있는 높이 (상하 10mm 여백)
      const pageContentHeight = pdfHeight - 20;
      
      let yPosition = 0;
      let pageCount = 0;
      
      while (yPosition < imgHeight) {
        if (pageCount > 0) {
          pdf.addPage();
        }
        
        // 현재 페이지에 넣을 높이 계산
        const remainingHeight = imgHeight - yPosition;
        const currentPageHeight = Math.min(pageContentHeight, remainingHeight);
        
        // 캔버스에서 해당 부분을 잘라내기 위한 계산
        const sourceY = (yPosition * canvasHeight) / imgHeight;
        const sourceHeight = (currentPageHeight * canvasHeight) / imgHeight;
        
        // 임시 캔버스 생성
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          tempCanvas.width = canvasWidth;
          tempCanvas.height = sourceHeight;
          
          // 원본 캔버스에서 해당 부분만 복사
          tempCtx.drawImage(
            canvas,
            0, sourceY, canvasWidth, sourceHeight, // 소스 영역
            0, 0, canvasWidth, sourceHeight        // 대상 영역
          );
          
          const pageImageData = tempCanvas.toDataURL('image/png', 1.0);
          
          // PDF에 이미지 추가 (10mm 여백 적용)
          pdf.addImage(pageImageData, 'PNG', 10, 10, imgWidth, currentPageHeight);
        }
        
        yPosition += currentPageHeight;
        pageCount++;
      }
      
      const pdfOutput = pdf.output('blob');
      setPdfBlob(pdfOutput);
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성에 실패했습니다.');
    }
  };

  const downloadPDF = async () => {
    // PDF가 없으면 먼저 생성
    if (!pdfBlob) {
      await generatePDF();
    }
    
    // PDF 생성 후에도 없으면 에러
    if (!pdfBlob) {
      alert('PDF 생성에 실패했습니다.');
      return;
    }
    
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolio?.user?.name || '포트폴리오'}_이력서.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // PDF 템플릿 렌더링
  const renderPDFTemplate = () => {
    if (!portfolio) return null;

    const owner = portfolio.user as any;
    const sections = portfolio.sections || [];
    
    const educations = (sections || []).filter((s: any) => s.type === 'education').map((s: any) => JSON.parse(s.content));
    const careers = (sections || []).filter((s: any) => s.type === 'experience').map((s: any) => JSON.parse(s.content));
    const projects = (sections || []).filter((s: any) => s.type === 'project').map((s: any) => JSON.parse(s.content));
    const certificates = (sections || []).filter((s: any) => s.type === 'certificate').map((s: any) => JSON.parse(s.content));
    const languages = (sections || []).filter((s: any) => s.type === 'language').map((s: any) => JSON.parse(s.content));
    const activities = (sections || []).filter((s: any) => s.type === 'activity').map((s: any) => JSON.parse(s.content));
    
    const allSkillIds = (sections || []).flatMap((s: any) => (s.portfolioSkills || []).map((ps: any) => ps.skillId));
    const allJobIds = (sections || []).flatMap((s: any) => (s.portfolioJob || []).map((pj: any) => pj.jobId));
    const allSkills = (skillOptions || []).filter((opt: any) => allSkillIds.includes(opt.id));
    const allJobs = (jobOptions || []).filter((opt: any) => allJobIds.includes(opt.id));

    return (
      <PDFTemplate ref={pdfTemplateRef}>
        <PDFPage className="pdf-page">
          {/* 상단 헤더: 개인정보 + 프로필 이미지 */}
          <PDFHeaderSection>
            <PDFPersonalInfo>
              <PDFNameTitle>{owner?.name || '-'}</PDFNameTitle>
              <PDFInfoItem>
                <PDFInfoLabel>생년월일:</PDFInfoLabel>
                <PDFInfoValue>{owner?.birth || '-'}</PDFInfoValue>
              </PDFInfoItem>
              <PDFInfoItem>
                <PDFInfoLabel>성별:</PDFInfoLabel>
                <PDFInfoValue>{owner?.gender || '-'}</PDFInfoValue>
              </PDFInfoItem>
              <PDFInfoItem>
                <PDFInfoLabel>전화번호:</PDFInfoLabel>
                <PDFInfoValue>{owner?.phone ? formatPhone(owner.phone) : '-'}</PDFInfoValue>
              </PDFInfoItem>
              <PDFInfoItem>
                <PDFInfoLabel>이메일:</PDFInfoLabel>
                <PDFInfoValue>{owner?.email || '-'}</PDFInfoValue>
              </PDFInfoItem>
            </PDFPersonalInfo>
            <PDFProfileImage>
              {owner?.profileImage ? (
                <img 
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/${owner.profileImage}`}
                  alt="프로필 사진"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  crossOrigin="anonymous"
                />
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '2px dashed #dee2e6',
                  color: '#6c757d',
                  fontSize: '0.9rem'
                }}>
                  사진
                </div>
              )}
            </PDFProfileImage>
          </PDFHeaderSection>

          {/* 희망 직무 */}
          {(allJobs || []).length > 0 && (
            <PDFSection>
              <PDFSectionTitle>희망 직무</PDFSectionTitle>
              <PDFTagList>
                {(allJobs || []).map((job: any, idx: number) => (
                  <PDFTag key={idx}>{job.name}</PDFTag>
                ))}
              </PDFTagList>
            </PDFSection>
          )}

          {/* 보유 기술 */}
          {(allSkills || []).length > 0 && (
            <PDFSection>
              <PDFSectionTitle>보유 기술</PDFSectionTitle>
              <PDFTagList>
                {(allSkills || []).map((skill: any, idx: number) => (
                  <PDFTag key={idx}>{skill.name}</PDFTag>
                ))}
              </PDFTagList>
            </PDFSection>
          )}

          {/* 자기소개 */}
          {portfolio.intro && (
            <PDFSection>
              <PDFSectionTitle>자기소개</PDFSectionTitle>
              <PDFItemDescription>{portfolio.intro}</PDFItemDescription>
            </PDFSection>
          )}

          {/* 학력 */}
          {(educations || []).length > 0 && (
            <PDFSection>
              <PDFSectionTitle>학력</PDFSectionTitle>
              <PDFList>
                {(educations || []).map((edu: any, idx: number) => (
                  <PDFListItem key={idx}>
                    <PDFItemTitle>
                      {edu.school}
                      {edu.major && ` - ${edu.major}`}
                    </PDFItemTitle>
                    <PDFItemSubtitle>
                      {edu.degree || '재학중'} ({edu.startDate || ''} ~ {edu.endDate || '현재'})
                    </PDFItemSubtitle>
                  </PDFListItem>
                ))}
              </PDFList>
            </PDFSection>
          )}

          {/* 경력 */}
          {careers.length > 0 && (
            <PDFSection>
              <PDFSectionTitle>경력</PDFSectionTitle>
              <PDFList>
                {careers.map((career: any, idx: number) => (
                  <PDFListItem key={idx}>
                    <PDFItemTitle>{career.company} - {career.position}</PDFItemTitle>
                    <PDFItemSubtitle>
                      {career.period && (career.period.startDate || career.period.endDate) 
                        ? `${career.period.startDate || ''} ~ ${career.period.endDate || '현재'}`
                        : ''}
                    </PDFItemSubtitle>
                    {career.description && (
                      <PDFItemDescription>{career.description}</PDFItemDescription>
                    )}
                  </PDFListItem>
                ))}
              </PDFList>
            </PDFSection>
          )}

          {/* 프로젝트 */}
          {projects.length > 0 && (
            <PDFSection>
              <PDFSectionTitle>프로젝트</PDFSectionTitle>
              <PDFList>
                {projects.map((project: any, idx: number) => (
                  <PDFListItem key={idx}>
                    <PDFItemTitle>{project.name}</PDFItemTitle>
                    <PDFItemSubtitle>
                      {project.period && (project.period.startDate || project.period.endDate)
                        ? `${project.period.startDate || ''} ~ ${project.period.endDate || '현재'}`
                        : ''}
                    </PDFItemSubtitle>
                    {project.description && (
                      <PDFItemDescription>{project.description}</PDFItemDescription>
                    )}
                  </PDFListItem>
                ))}
              </PDFList>
            </PDFSection>
          )}

          {/* 자격증 */}
          {certificates.length > 0 && (
            <PDFSection>
              <PDFSectionTitle>자격증</PDFSectionTitle>
              <PDFList>
                {certificates.map((cert: any, idx: number) => (
                  <PDFListItem key={idx}>
                    <PDFItemTitle>{cert.name}</PDFItemTitle>
                    <PDFItemSubtitle>
                      {cert.level && `${cert.level} `}
                      {cert.issuer && `- ${cert.issuer}`}
                    </PDFItemSubtitle>
                  </PDFListItem>
                ))}
              </PDFList>
            </PDFSection>
          )}

          {/* 외국어 */}
          {languages.length > 0 && (
            <PDFSection>
              <PDFSectionTitle>외국어</PDFSectionTitle>
              <PDFList>
                {languages.map((lang: any, idx: number) => (
                  <PDFListItem key={idx}>
                    <PDFItemTitle>{lang.name}</PDFItemTitle>
                    {lang.level && <PDFItemSubtitle>{lang.level}</PDFItemSubtitle>}
                  </PDFListItem>
                ))}
              </PDFList>
            </PDFSection>
          )}

          {/* 대외활동 */}
          {activities.length > 0 && (
            <PDFSection>
              <PDFSectionTitle>대외활동</PDFSectionTitle>
              <PDFList>
                {activities.map((activity: any, idx: number) => (
                  <PDFListItem key={idx}>
                    <PDFItemTitle>
                      {activity.name}
                      {activity.org && ` - ${activity.org}`}
                    </PDFItemTitle>
                    <PDFItemSubtitle>
                      {activity.period && (activity.period.startDate || activity.period.endDate)
                        ? `${activity.period.startDate || ''} ~ ${activity.period.endDate || '현재'}`
                        : ''}
                    </PDFItemSubtitle>
                    {activity.description && (
                      <PDFItemDescription>{activity.description}</PDFItemDescription>
                    )}
                  </PDFListItem>
                ))}
              </PDFList>
            </PDFSection>
          )}
        </PDFPage>
      </PDFTemplate>
    );
  };

  // 좋아요 토글 핸들러
  const handleLikeToggle = async () => {
    if (!user) return;
    const res = await api.post(`/portfolios/${id}/likes`);
    setHasLiked(res.data.liked);
    const countRes = await api.get(`/portfolios/${id}/likes/count`);
    setLikeCount(countRes.data);
  };

  // 포트폴리오 삭제 핸들러
  const handleDelete = async () => {
    try {
      await api.delete(`/portfolios/${id}`);
      alert('포트폴리오가 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      alert('포트폴리오 삭제에 실패했습니다.');
    }
    setShowDeleteModal(false);
  };

  if (!portfolio) return <div>로딩중...</div>;

  const owner = portfolio.user as any;
  const intro = portfolio.intro;
  const sections = portfolio.sections || [];
  const educations = (sections || []).filter((s: any) => s.type === 'education').map((s: any) => JSON.parse(s.content));
  const careers = (sections || []).filter((s: any) => s.type === 'experience').map((s: any) => JSON.parse(s.content));
  const projects = (sections || []).filter((s: any) => s.type === 'project').map((s: any) => JSON.parse(s.content));
  const certificates = (sections || []).filter((s: any) => s.type === 'certificate').map((s: any) => JSON.parse(s.content));
  const languages = (sections || []).filter((s: any) => s.type === 'language').map((s: any) => JSON.parse(s.content));
  const activities = (sections || []).filter((s: any) => s.type === 'activity').map((s: any) => JSON.parse(s.content));
  const allSkillIds = (sections || []).flatMap((s: any) => (s.portfolioSkills || []).map((ps: any) => ps.skillId));
  const allKeywordIds = (sections || []).flatMap((s: any) => (s.portfolioKeywords || []).map((pk: any) => pk.keywordId));
  const allJobIds = (sections || []).flatMap((s: any) => (s.portfolioJob || []).map((pj: any) => pj.jobId));
  const allSkills = (skillOptions || []).filter((opt: any) => allSkillIds.includes(opt.id));
  const allKeywords = (keywordOptions || []).filter((opt: any) => allKeywordIds.includes(opt.id));
  const allJobs = (jobOptions || []).filter((opt: any) => allJobIds.includes(opt.id));

  return (
    <>
      <Header />
      <Layout>
        <MainCard>
          <PDFButton onClick={generatePDFPreview}>PDF 인쇄 <span role="img" aria-label="print">🖨️</span></PDFButton>
          {user && owner && user.id === owner.id && (
            <>
              <PDFButton style={{ right: '11rem', background: '#6c757d' }} onClick={() => navigate(`/portfolios/${id}/edit`)}>수정</PDFButton>
              <DeleteButton style={{ position: 'absolute', right: '17.5rem', top: '2.5rem' }} onClick={() => setShowDeleteModal(true)}>삭제</DeleteButton>
            </>
          )}
          <ProfileRow>
            <ProfileImg src={getProfileImageUrl(owner?.profileImage)} />
            <UserInfo>
              <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{owner?.name}</div>
              <div>성별: {owner?.gender || '-'}</div>
              <div>생년월일: {owner?.birth || '-'}</div>
                              <div>전화번호: {owner?.phone ? formatPhone(owner.phone) : '-'}</div>
              <div>이메일: {owner?.email || '-'}</div>
            </UserInfo>
          </ProfileRow>
          <SectionTitle>나의 키워드</SectionTitle>
          <TagRow>
            {(allKeywords || []).map((kw) => <Tag key={kw.id}>{kw.name}</Tag>)}
          </TagRow>
          <SectionTitle>직무/직군</SectionTitle>
          <TagRow>
            {(allJobs || []).map((job) => <Tag key={job.id}>{job.name}</Tag>)}
          </TagRow>
          <SectionTitle>기술 스택</SectionTitle>
          <TagRow>
            {(allSkills || []).map((skill) => <Tag key={skill.id}>{skill.name}</Tag>)}
          </TagRow>
          <SectionTitle>나의 소개</SectionTitle>
          <IntroBox>{intro}</IntroBox>
          <SectionTitle>학력</SectionTitle>
          <CareerList>
            {educations?.map((edu: any, idx: any) => (
              <CareerItem key={idx}>
                <div style={{ fontWeight: 600 }}>{edu.school} <span style={{ fontWeight: 400, color: '#888' }}>{edu.major} {edu.degree && `(${edu.degree})`}</span></div>
                <div style={{ color: '#888', fontSize: '0.97rem' }}>{edu.startDate} ~ {edu.endDate}</div>
              </CareerItem>
            ))}
          </CareerList>
          <SectionTitle>경력</SectionTitle>
          <CareerList>
            {careers?.map((career: any, idx: any) => (
              <CareerItem key={idx}>
                <div style={{ fontWeight: 600 }}>{career.company} <span style={{ fontWeight: 400, color: '#888' }}>{career.position}</span></div>
                <div style={{ color: '#888', fontSize: '0.97rem' }}>{career.period && (career.period.startDate || career.period.endDate) ? `${career.period.startDate || ''} ~ ${career.period.endDate || ''}` : ''}</div>
                {career.description && <div style={{ color: '#444', fontSize: '1.05rem', whiteSpace: 'pre-line', marginTop: 4 }}>{career.description}</div>}
              </CareerItem>
            ))}
          </CareerList>
          <SectionTitle>프로젝트</SectionTitle>
          <CareerList>
            {projects?.map((p: any, idx: any) => (
              <CareerItem key={idx}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ color: '#888', fontSize: '0.97rem' }}>{p.period && (p.period.startDate || p.period.endDate) ? `${p.period.startDate || ''} ~ ${p.period.endDate || ''}` : ''}</div>
                {p.description && <div style={{ color: '#444', fontSize: '1.05rem', whiteSpace: 'pre-line', marginTop: 4 }}>{p.description}</div>}
              </CareerItem>
            ))}
          </CareerList>
          <SectionTitle>자격증</SectionTitle>
          <CareerList>
            {certificates?.map((c: any, idx: any) => (
              <CareerItem key={idx}>
                <div style={{ fontWeight: 600 }}>{c.name} {c.level && <span style={{ color: '#888', fontWeight: 400, marginLeft: 8 }}>{c.level}</span>} {c.issuer && <span style={{ color: '#888', fontWeight: 400, marginLeft: 8 }}>{c.issuer}</span>}</div>
              </CareerItem>
            ))}
          </CareerList>
          <SectionTitle>외국어</SectionTitle>
          <CareerList>
            {languages?.map((l: any, idx: any) => (
              <CareerItem key={idx}>
                <div style={{ fontWeight: 600 }}>{l.name} {l.level && <span style={{ color: '#888', fontWeight: 400, marginLeft: 8 }}>{l.level}</span>}</div>
              </CareerItem>
            ))}
          </CareerList>
          <SectionTitle>대외 활동</SectionTitle>
          <CareerList>
            {activities?.map((a: any, idx: any) => (
              <CareerItem key={idx}>
                <div style={{ fontWeight: 600 }}>{a.name} {a.org && <span style={{ color: '#888', fontWeight: 400, marginLeft: 8 }}>{a.org}</span>}</div>
                <div style={{ color: '#888', fontSize: '0.97rem' }}>{a.period && (a.period.startDate || a.period.endDate) ? `${a.period.startDate || ''} ~ ${a.period.endDate || ''}` : ''}</div>
                {a.description && <div style={{ color: '#444', fontSize: '1.05rem', whiteSpace: 'pre-line', marginTop: 4 }}>{a.description}</div>}
              </CareerItem>
            ))}
          </CareerList>
        </MainCard>
        <SideCard>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>댓글</div>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
            {(comments || []).map((c, i) => (
              <div key={i} style={{ border: '1px solid #eee', borderRadius: 8, padding: '1rem', marginBottom: 10 }}>
                <div style={{ fontWeight: 600 }}>{c.user?.name} <span style={{ color: '#4B89DC', fontSize: '0.95em' }}>{c.user?.id === owner?.id && '(작성자)'}</span></div>
                <div style={{ color: '#888', fontSize: '0.95em', marginBottom: 4 }}>
                  {c.created_at ? new Date(c.created_at).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\. /g, '.').replace('.', '').replace('.', '').trim() : ''}
                </div>
                <div style={{ color: '#444', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>{c.content}</div>
              </div>
            ))}
            {Math.ceil(total / pageSize) > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <CommentButton onClick={() => setPage(page - 1)} disabled={page === 1} style={{ minWidth: 60, opacity: page === 1 ? 0.5 : 1 }}>이전</CommentButton>
                <span style={{ fontSize: 15 }}>{page} / {Math.max(1, Math.ceil(total / pageSize))}</span>
                <CommentButton onClick={() => setPage(page + 1)} disabled={page >= Math.ceil(total / pageSize)} style={{ minWidth: 60, opacity: page >= Math.ceil(total / pageSize) ? 0.5 : 1 }}>다음</CommentButton>
              </div>
            )}
          </div>
          <CommentInputRow>
            <input
              style={{ flex: 1, border: '1px solid #ddd', borderRadius: 8, padding: '0.7rem' }}
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <CommentButton onClick={handleCommentSubmit}>등록</CommentButton>
          </CommentInputRow>
          <LikeRow>
            <span
              style={{ fontSize: 22, color: hasLiked ? '#e25555' : '#4B89DC', cursor: user ? 'pointer' : 'not-allowed', transition: 'color 0.2s' }}
              onClick={user ? handleLikeToggle : undefined}
              title={user ? (hasLiked ? '좋아요 취소' : '좋아요') : '로그인 필요'}
            >
              {hasLiked ? '♥' : '♡'}
            </span>
            <span style={{ fontSize: 18, color: '#4B89DC', minWidth: 24, textAlign: 'left' }}>{likeCount}</span>
          </LikeRow>
        </SideCard>
      </Layout>

      {/* PDF 미리보기 모달 */}
      {showPDFPreview && (
        <PDFPreviewModal onClick={() => setShowPDFPreview(false)}>
          <PDFPreviewContent onClick={(e) => e.stopPropagation()}>
            <PDFPreviewHeader>
              <h3>PDF 미리보기</h3>
              <div>
                <DownloadButton onClick={generatePDF} disabled={!!pdfBlob}>
                  {pdfBlob ? 'PDF 생성됨' : 'PDF 생성'}
                </DownloadButton>
                <DownloadButton onClick={downloadPDF} disabled={!pdfBlob}>
                  다운로드
                </DownloadButton>
                <CloseButton onClick={() => setShowPDFPreview(false)}>
                  ×
                </CloseButton>
              </div>
            </PDFPreviewHeader>
            {renderPDFTemplate()}
          </PDFPreviewContent>
        </PDFPreviewModal>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <Modal onClick={() => setShowDeleteModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>포트폴리오 삭제</ModalTitle>
            <ModalText>
              정말로 이 포트폴리오를 삭제하시겠습니까?<br />
              삭제된 포트폴리오는 복구할 수 없습니다.
            </ModalText>
            <ModalButtonRow>
              <ModalButton variant="secondary" onClick={() => setShowDeleteModal(false)}>
                취소
              </ModalButton>
              <ModalButton variant="danger" onClick={handleDelete}>
                삭제
              </ModalButton>
            </ModalButtonRow>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default PortfolioView; 