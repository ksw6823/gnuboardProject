// 전화번호 포맷팅 유틸 함수들

// 숫자만 남기기 (저장용)
export const removePhoneFormat = (phone: string): string => {
  return phone.replace(/[^0-9]/g, '');
};

// 하이픈 추가 (표시용)
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  const cleaned = removePhoneFormat(phone);
  
  if (cleaned.length === 11) {
    // 010-1234-5678 형태
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    // 02-1234-5678 형태 (서울 지역번호)
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 9) {
    // 031-123-4567 형태 (일부 지역번호)
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return cleaned; // 포맷팅할 수 없는 경우 원본 반환
};

// 입력 중 실시간 포맷팅 (입력 필드용)
export const formatPhoneInput = (value: string): string => {
  const cleaned = removePhoneFormat(value);
  
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  } else if (cleaned.length <= 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
}; 