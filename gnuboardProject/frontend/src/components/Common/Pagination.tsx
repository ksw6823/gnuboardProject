import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <nav style={{ display: 'flex', justifyContent: 'center', margin: '2.5rem 0 1.5rem 0', gap: 0 }}>
      <ul style={{ display: 'flex', gap: 0, padding: 0, margin: 0, listStyle: 'none', borderRadius: 12, boxShadow: '0 2px 8px rgba(80,120,255,0.07)', background: '#f8fafd' }}>
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              border: 'none',
              background: 'none',
              color: currentPage === 1 ? '#bbb' : '#4B89DC',
              fontWeight: 500,
              fontSize: '1rem',
              padding: '0.7rem 1.2rem',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              borderRadius: '12px 0 0 12px',
              transition: 'background 0.15s',
              outline: 'none',
            }}
          >이전</button>
        </li>
        {[...Array(totalPages)].map((_, idx) => (
          <li key={idx + 1}>
            <button
              onClick={() => onPageChange(idx + 1)}
              style={{
                border: 'none',
                background: currentPage === idx + 1 ? '#4B89DC' : 'none',
                color: currentPage === idx + 1 ? '#fff' : '#333',
                fontWeight: currentPage === idx + 1 ? 700 : 500,
                fontSize: '1rem',
                padding: '0.7rem 1.2rem',
                cursor: 'pointer',
                borderRadius: 0,
                transition: 'background 0.15s',
                outline: 'none',
                boxShadow: currentPage === idx + 1 ? '0 2px 8px rgba(80,120,255,0.10)' : 'none',
              }}
            >{idx + 1}</button>
          </li>
        ))}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              border: 'none',
              background: 'none',
              color: currentPage === totalPages ? '#bbb' : '#4B89DC',
              fontWeight: 500,
              fontSize: '1rem',
              padding: '0.7rem 1.2rem',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              borderRadius: '0 12px 12px 0',
              transition: 'background 0.15s',
              outline: 'none',
            }}
          >다음</button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination; 