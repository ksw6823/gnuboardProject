import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const UploadContainer = styled.div`
  margin: 1rem 0;
`;

const UploadButton = styled.button`
  padding: 0.5rem 1rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const FileList = styled.div`
  margin-top: 1rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  
  button {
    padding: 0.25rem 0.5rem;
    background: #dc3545;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background: #c82333;
    }
  }
`;

interface FileUploadProps {
  onFileUploaded?: (file: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('file', file);
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/file/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (onFileUploaded) {
          onFileUploaded(data);
        }
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert('파일 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('파일 업로드 중 오류가 발생했습니다:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <UploadContainer>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <UploadButton
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        파일 선택
      </UploadButton>
      <UploadButton
        onClick={handleUpload}
        disabled={files.length === 0 || uploading}
      >
        {uploading ? '업로드 중...' : '업로드'}
      </UploadButton>

      <FileList>
        {files.map((file, index) => (
          <FileItem key={index}>
            <span>{file.name}</span>
            <span>({(file.size / 1024).toFixed(2)} KB)</span>
            <button onClick={() => handleRemoveFile(index)}>삭제</button>
          </FileItem>
        ))}
      </FileList>
    </UploadContainer>
  );
};

export default FileUpload; 