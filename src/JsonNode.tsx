import { useState, useEffect } from 'react';

interface JsonNodeProps {
  data: any;
  isRoot?: boolean;
  isCollapsed?: boolean;
  onCollapseChange?: (isCollapsed: boolean) => void;
  theme?: string;
}

const JsonNode = ({ data, isRoot = false, isCollapsed: parentIsCollapsed = false, onCollapseChange, theme = 'dark' }: JsonNodeProps) => {
  const [isCollapsed, setIsCollapsed] = useState(parentIsCollapsed);

  useEffect(() => {
    setIsCollapsed(parentIsCollapsed);
  }, [parentIsCollapsed]);

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

  const themes = {
    dark: {
      brace: '#bfc7d5',
      key: '#c678dd',
      string: '#98c379',
      number: '#61afef',
      boolean: '#d19a66',
      null: '#5c6370',
      text: '#e6eaf3',
      border: '#31363f',
    },
    light: {
      brace: '#6c757d',
      key: '#c82829',
      string: '#718c00',
      number: '#3e999f',
      boolean: '#e67e22',
      null: '#969896',
      text: '#212529',
      border: '#dee2e6',
    },
  };

  const currentTheme = themes[theme];

  const nodeStyle = {
    fontFamily: '"Fira Mono", Menlo, monospace',
    fontSize: '1.08rem',
    lineHeight: '1.6',
    color: currentTheme.text,
  };

  const braceStyle = {
    color: currentTheme.brace,
    cursor: 'pointer',
    userSelect: 'none' as 'none',
    fontWeight: 'bold' as 'bold',
  };

  const keyStyle = {
    color: currentTheme.key,
    fontWeight: 'bold' as 'bold',
  };

  const valueStyle = (value: any) => {
    const type = typeof value;
    if (type === 'string') return { color: currentTheme.string };
    if (type === 'number') return { color: currentTheme.number };
    if (type === 'boolean') return { color: currentTheme.boolean };
    if (value === null) return { color: currentTheme.null };
    return { color: currentTheme.text };
  };

  const renderValue = (value: any) => {
    if (typeof value === 'object' && value !== null) {
      return <JsonNode data={value} theme={theme} />;
    }
    return (
      <span style={valueStyle(value)}>
        {JSON.stringify(value)}
      </span>
    );
  };

  if (typeof data !== 'object' || data === null) {
    return <div style={nodeStyle}>{renderValue(data)}</div>;
  }

  const isArray = Array.isArray(data);
  const entries = Object.entries(data);
  const collapsedContent = isArray ? `[...] (${entries.length} items)` : `{...} (${entries.length} keys)`;

  return (
    <div style={nodeStyle}>
      <span onClick={toggleCollapse} style={braceStyle}>
        {isCollapsed ? '▶' : '▼'} {isArray ? '[' : '{'}
      </span>

      {isCollapsed && (
        <span style={{ ...braceStyle, marginLeft: '0.5em' }} onClick={toggleCollapse}>
          {collapsedContent}
          {isArray ? ']' : '}'}
        </span>
      )}

      {!isCollapsed && (
        <>
          <div style={{ marginLeft: '2em', borderLeft: `1px solid ${currentTheme.border}`, paddingLeft: '1em' }}>
            {entries.map(([key, value], index) => (
              <div key={key} style={{ position: 'relative' }}>
                <span style={keyStyle}>{!isArray && `"${key}": `}</span>
                {renderValue(value)}
                {index < entries.length - 1 && ','}
              </div>
            ))}
          </div>
          <span style={braceStyle}>{isArray ? ']' : '}'}</span>
        </>
      )}
    </div>
  );
};

export default JsonNode;
