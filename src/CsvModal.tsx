import React from 'react';

interface CsvModalProps {
  theme: 'light' | 'dark';
  onClose: () => void;
  csvData: string;
}

const CsvModal: React.FC<CsvModalProps> = ({ theme, onClose, csvData }) => {
  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  };

  const contentStyle: React.CSSProperties = {
    background: theme === 'dark' ? '#2c2c2e' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    padding: '2rem',
    borderRadius: '14px',
    width: '600px',
    maxWidth: '90%',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    height: '300px',
    background: theme === 'dark' ? '#1c1c1e' : '#f2f2f7',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
    borderRadius: '8px',
    padding: '1rem',
    fontFamily: '"SF Mono", "Fira Mono", Menlo, monospace',
    fontSize: '1rem',
    resize: 'none',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '1.5rem',
  };

  const buttonStyle: React.CSSProperties = {
    background: theme === 'dark' ? '#3a3a3c' : '#e5e5ea',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'background 0.2s',
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Generated CSV</h2>
        <textarea style={textareaStyle} value={csvData} readOnly />
        <div style={buttonContainerStyle}>
          <button style={buttonStyle} onClick={() => navigator.clipboard.writeText(csvData)}>Copy to Clipboard</button>
          <button style={buttonStyle} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CsvModal;
