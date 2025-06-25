import { useEffect, useState } from "react";
import JsonNode from './JsonNode';

// --- TYPE DEFINITIONS ---
interface Tab {
  id: string;
  name: string;
  json: string;
  isCollapsed: boolean;
}

type Theme = 'light' | 'dark';

// --- THEME COLOR PALETTES ---
const themes = {
  dark: {
    background: '#1a1d24',
    secondaryBackground: '#21252b',
    border: '#2c313a',
    text: '#e6eaf3',
    subtleText: '#abb2bf',
    error: '#e06c75',
  },
  light: {
    background: '#f8f9fa',
    secondaryBackground: '#e9ecef',
    border: '#dee2e6',
    text: '#212529',
    subtleText: '#6c757d',
    error: '#dc3545',
  },
};

// --- COMPONENT ---
function App() {
  // --- STATE MANAGEMENT ---
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
  });

  const [tabs, setTabs] = useState<Tab[]>(() => {
    const savedTabs = localStorage.getItem('tabs');
    if (savedTabs) {
      try {
        return JSON.parse(savedTabs);
      } catch {
        return [{ id: 'tab-1', name: 'Tab 1', json: '', isCollapsed: false }];
      }
    }
    return [{ id: 'tab-1', name: 'Tab 1', json: '', isCollapsed: false }];
  });

  const [activeTabId, setActiveTabId] = useState<string | null>(() => {
    const savedActiveTabId = localStorage.getItem('activeTabId');
    return savedActiveTabId || (tabs.length > 0 ? tabs[0].id : null);
  });

  const [cleanJson, setCleanJson] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // --- DERIVED STATE & EFFECTS ---
  const currentTheme = themes[theme];
  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (activeTabId) {
      localStorage.setItem('activeTabId', activeTabId);
    }
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }, [tabs, activeTabId]);

  useEffect(() => {
    if (activeTab && activeTab.json) {
      try {
        setCleanJson(JSON.stringify(JSON.parse(activeTab.json), null, 2));
        setJsonError(null);
      } catch (e) {
        console.error('Invalid JSON:', e);
        setCleanJson('');
        setJsonError('Invalid JSON: Please check your input.');
      }
    } else {
      setCleanJson('');
      setJsonError(null);
    }
  }, [activeTab]);

  // --- HANDLER FUNCTIONS ---
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleJsonChange = (json: string) => {
    const newTabs = tabs.map(tab => tab.id === activeTabId ? { ...tab, json } : tab);
    setTabs(newTabs);
  };

  const handleCollapseChange = (isCollapsed: boolean) => {
    const newTabs = tabs.map(tab => tab.id === activeTabId ? { ...tab, isCollapsed } : tab);
    setTabs(newTabs);
  };

  const addTab = () => {
    const newTabId = `tab-${Date.now()}`;
    const tabNumbers = tabs.map(tab => parseInt(tab.name.replace('Tab ', ''), 10) || 0);
    const newTabNumber = Math.max(0, ...tabNumbers) + 1;
    const newTab: Tab = { id: newTabId, name: `Tab ${newTabNumber}`, json: '', isCollapsed: false };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTabId);
  };

  const closeTab = (tabIdToClose: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabIdToClose);
    const newTabs = tabs.filter(tab => tab.id !== tabIdToClose);

    if (newTabs.length === 0) {
      const newTab: Tab = { id: 'tab-1', name: 'Tab 1', json: '', isCollapsed: false };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
      return;
    }

    if (activeTabId === tabIdToClose) {
      const newActiveTab = newTabs[tabIndex] || newTabs[tabIndex - 1] || newTabs[0];
      setActiveTabId(newActiveTab.id);
    }
    setTabs(newTabs);
  };

  // --- RENDER ---
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: currentTheme.background,
      margin: 0,
      padding: 0,
      fontFamily: '"Inter", sans-serif',
      boxSizing: 'border-box',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      color: currentTheme.text,
    }}>
      <header style={{
        width: '100%',
        background: currentTheme.background,
        color: currentTheme.text,
        fontWeight: 700,
        fontSize: '1.5rem',
        textAlign: 'center',
        padding: '0.8rem 0',
        zIndex: 10,
        flex: '0 0 auto',
        borderBottom: `1px solid ${currentTheme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        JSON Viewer
        <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="https://github.com/faiz877/JSON-Viewer" target="_blank" rel="noopener noreferrer" style={{ color: currentTheme.subtleText, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          <label className="switch">
            <input type="checkbox" onChange={toggleTheme} checked={theme === 'light'} />
            <span className="slider round"></span>
          </label>
        </div>
      </header>
      <nav style={{
        width: '100%',
        background: currentTheme.secondaryBackground,
        borderBottom: `1px solid ${currentTheme.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        gap: '0.5rem',
        userSelect: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', flexGrow: 1, padding: '0.2rem 0' }}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: tab.id === activeTabId ? currentTheme.background : 'transparent',
                color: tab.id === activeTabId ? currentTheme.text : currentTheme.subtleText,
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                fontWeight: 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
                position: 'relative',
                flexShrink: 0,
                marginRight: '0.5rem',
              }}
            >
              {tab.name}
              <span
                className="close-tab-btn"
                style={{ marginLeft: 10, color: currentTheme.subtleText, fontWeight: 400, fontSize: '1.2em', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s, color 0.2s' }}
                onClick={e => { e.stopPropagation(); closeTab(tab.id); }}
                title="Close tab"
              >
                ×
              </span>
            </div>
          ))}
          <button
            style={{ background: 'transparent', border: `1px dashed ${currentTheme.border}`, color: currentTheme.subtleText, fontSize: '1.2rem', cursor: 'pointer', borderRadius: '6px', padding: '0.3rem 0.7rem', fontWeight: 700, transition: 'background 0.2s, color 0.2s', flexShrink: 0 }}
            title="New Tab"
            onClick={addTab}
          >
            +
          </button>
        </div>
      </nav>
      <main style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem',
        width: '100%',
        padding: '1rem',
        height: '100%',
        alignItems: 'stretch',
        justifyContent: 'center',
        background: currentTheme.background,
        flex: '1 1 auto',
        overflow: 'hidden',
      }}>
        <section style={{ flex: 1, minWidth: 0, background: currentTheme.secondaryBackground, display: 'flex', flexDirection: 'column', border: `1px solid ${currentTheme.border}`, borderRadius: '8px', overflow: 'hidden' }}>
          <textarea
            id="json-input"
            value={activeTab ? activeTab.json : ''}
            onChange={(e) => handleJsonChange(e.target.value)}
            placeholder="Paste or type your JSON here..."
            style={{ flex: 1, width: '100%', minHeight: 0, height: '100%', padding: '1.5rem', border: 'none', fontFamily: '"Fira Mono", Menlo, monospace', fontSize: '1.1rem', background: 'transparent', color: currentTheme.text, resize: 'none', outline: 'none', overflow: 'auto' }}
          />
        </section>
        <section style={{ flex: 1, minWidth: 0, background: currentTheme.secondaryBackground, display: 'flex', flexDirection: 'column', border: `1px solid ${currentTheme.border}`, borderRadius: '8px', overflow: 'hidden' }}>
          <div
            id="json-output"
            style={{ flex: 1, width: '100%', minHeight: 0, height: '100%', padding: '1.5rem', fontFamily: '"Fira Mono", Menlo, monospace', fontSize: '1.1rem', background: 'transparent', color: currentTheme.text, overflow: 'auto' }}
          >
            {jsonError ? (
              <div style={{ color: currentTheme.error, fontWeight: 'bold' }}>{jsonError}</div>
            ) : cleanJson && activeTab ? (
              <JsonNode data={JSON.parse(cleanJson)} isRoot={true} isCollapsed={activeTab.isCollapsed} onCollapseChange={handleCollapseChange} theme={theme} />
            ) : (
              <span style={{color: currentTheme.subtleText, padding: '1.5rem'}}>Formatted JSON will appear here</span>
            )}
          </div>
        </section>
      </main>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
        html, body, #root { height: 100%; margin: 0; padding: 0; box-sizing: border-box; overflow: hidden; }
        *, *::before, *::after { box-sizing: inherit; }
        .close-tab-btn:hover { opacity: 1 !important; color: #ff7b72 !important; }
        .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
        .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; }
        input:checked + .slider { background-color: #2196F3; }
        input:focus + .slider { box-shadow: 0 0 1px #2196F3; }
        input:checked + .slider:before { transform: translateX(22px); }
        .slider.round { border-radius: 28px; }
        .slider.round:before { border-radius: 50%; }
        nav > div::-webkit-scrollbar { height: 4px; background: ${currentTheme.secondaryBackground}; }
        nav > div::-webkit-scrollbar-thumb { background: ${currentTheme.border}; border-radius: 4px; }
        textarea::-webkit-scrollbar, #json-output::-webkit-scrollbar { width: 14px; background: ${currentTheme.secondaryBackground}; }
        textarea::-webkit-scrollbar-thumb, #json-output::-webkit-scrollbar-thumb { background: ${currentTheme.border}; border-radius: 14px; border: 4px solid ${currentTheme.secondaryBackground}; }
      `}</style>
    </div>
  )
}

export default App;
