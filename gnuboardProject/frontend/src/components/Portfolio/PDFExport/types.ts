export interface PDFExportConfig {
  margin?: number[];
  filename?: string;
  image?: {
    type: string;
    quality: number;
  };
}

export interface PDFExportProps {
  portfolioId: number;
}

export interface PDFContent {
  id: string;
  type: string;
  content: any;
}

export interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (content: PDFContent[]) => void;
  config: PDFExportConfig;
  onConfigChange: (config: PDFExportConfig) => void;
} 