
import React from 'react';

interface ToolbarProps {
  theme: 'light' | 'dark';
  onMinify: () => void;
  onCsv: () => void;
  onTransform: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ theme, onMinify, onCsv, onTransform }) => {
  const toolbarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  const buttonStyle: React.CSSProperties = {
    background: theme === 'dark' ? '#3a3a3c' : '#e5e5ea',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'background 0.2s',
    fontSize: '0.9rem',
  };

  return (
    <div style={toolbarStyle}>
      <button style={buttonStyle} onClick={onMinify}>Minify</button>
      <button style={buttonStyle} onClick={onCsv}>CSV</button>
      <button style={buttonStyle} onClick={onTransform}>Transform</button>
    </div>
  );
};

export default Toolbar;
