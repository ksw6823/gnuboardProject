import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { PDFExportProps, PDFExportConfig, PDFContent } from './types';
import PDFExportModal from './PDFExportModal';
import './styles.css';

const PDFExport: React.FC<PDFExportProps> = ({ portfolioId }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [exportConfig, setExportConfig] = useState<PDFExportConfig>({
    margin: [10, 10, 10, 10],
    filename: `portfolio-${portfolioId}.pdf`,
    image: { type: 'jpeg', quality: 0.98 }
  });

  const handleExport = async (selectedContent: PDFContent[]): Promise<void> => {
    try {
      const container = document.createElement('div');
      container.className = 'pdf-container';

      // 선택된 정보에 따라 PDF 내용 구성
      if (selectedContent.some(content => content.type === 'title')) {
        const titleElement = document.getElementById('portfolio-title');
        if (titleElement) {
          container.appendChild(titleElement.cloneNode(true));
        }
      }

      if (selectedContent.some(content => content.type === 'sections')) {
        const sectionsElement = document.getElementById('portfolio-sections');
        if (sectionsElement) {
          container.appendChild(sectionsElement.cloneNode(true));
        }
      }

      // PDF 변환 옵션
      const opt = {
        margin: exportConfig.margin,
        filename: exportConfig.filename,
        image: exportConfig.image,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // PDF 생성
      await html2pdf().set(opt).from(container).save();
      
    } catch (error) {
      console.error('PDF 변환 중 오류 발생:', error);
    }
  };

  return (
    <div className="pdf-export-container">
      <button 
        className="pdf-export-button"
        onClick={() => setIsModalOpen(true)}
      >
        PDF로 저장
      </button>
      
      {isModalOpen && (
        <PDFExportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onExport={handleExport}
          config={exportConfig}
          onConfigChange={setExportConfig}
        />
      )}
    </div>
  );
};

export default PDFExport; 