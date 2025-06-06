import React from 'react';
import { PDFExportModalProps } from './types';

const PDFExportModal: React.FC<PDFExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  config,
  onConfigChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="pdf-export-modal">
      <div className="modal-content">
        <h2>PDF 설정</h2>
        
        <div className="content-selector">
          <h3>포함할 정보 선택</h3>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" name="title" />
              제목
            </label>
            <label>
              <input type="checkbox" name="intro" />
              소개
            </label>
            <label>
              <input type="checkbox" name="sections" />
              섹션
            </label>
            <label>
              <input type="checkbox" name="skills" />
              기술 스택
            </label>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>취소</button>
          <button onClick={() => onExport([])}>변환</button>
        </div>
      </div>
    </div>
  );
};

export default PDFExportModal; 