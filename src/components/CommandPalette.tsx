import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CommandPalette.scss';

interface CommandItem {
  label: string;
  path: string;
  category: string;
  keywords: string[];
}

const commands: CommandItem[] = [
  // Pages
  { label: 'About Me', path: '/', category: 'Pages', keywords: ['about', 'home', 'bio', 'profile', 'qian yun'] },
  { label: 'Experience', path: '/experience', category: 'Pages', keywords: ['experience', 'work', 'jobs', 'education', 'resume'] },
  { label: 'Projects', path: '/projects', category: 'Pages', keywords: ['projects', 'skills', 'portfolio', 'code'] },
  { label: 'Contact', path: '/contact', category: 'Pages', keywords: ['contact', 'email', 'reach', 'message'] },
  { label: 'Blog', path: '/blog', category: 'Pages', keywords: ['blog', 'posts', 'articles', 'writing', 'notes'] },
  // Skills
  { label: 'Python', path: '/projects', category: 'Skills', keywords: ['python', 'programming', 'language'] },
  { label: 'React', path: '/projects', category: 'Skills', keywords: ['react', 'frontend', 'web', 'javascript'] },
  { label: 'Java', path: '/projects', category: 'Skills', keywords: ['java', 'programming', 'backend'] },
  { label: 'C++', path: '/projects', category: 'Skills', keywords: ['c++', 'cpp', 'programming', 'systems'] },
  { label: 'GenAI & LLM', path: '/projects', category: 'Skills', keywords: ['ai', 'genai', 'llm', 'machine learning', 'openai', 'gemini'] },
  { label: 'Flask', path: '/projects', category: 'Skills', keywords: ['flask', 'backend', 'api', 'web'] },
  { label: 'SQL', path: '/projects', category: 'Skills', keywords: ['sql', 'database', 'data'] },
  // Experience
  { label: 'Columbia University', path: '/experience', category: 'Education', keywords: ['columbia', 'college', 'university', 'new york', 'computer science'] },
  { label: 'University of Michigan', path: '/experience', category: 'Education', keywords: ['michigan', 'umich', 'ann arbor', 'transfer'] },
  { label: 'Jingdong Group', path: '/experience', category: 'Work', keywords: ['jd', 'jingdong', 'backend', 'developer', 'beijing'] },
  { label: 'Alibaba Group', path: '/experience', category: 'Work', keywords: ['alibaba', 'software', 'engineer', 'intern', 'hangzhou'] },
  { label: 'UMich FREE Laboratory', path: '/experience', category: 'Work', keywords: ['research', 'assistant', 'lab', 'free', 'fullstack'] },
  { label: 'Shenwan Hongyuan Securities', path: '/experience', category: 'Work', keywords: ['shenwan', 'investment', 'banking', 'analyst', 'finance'] },
  // Easter Eggs
  { label: '⌨️ Typing Speed Test', path: '/typing', category: 'Easter Eggs', keywords: ['typing', 'game', 'speed', 'test', 'fun', 'hidden'] },
];

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = commands.filter((cmd) => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      cmd.label.toLowerCase().includes(q) ||
      cmd.keywords.some((k) => k.includes(q)) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  // Group filtered results by category
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  const flatFiltered = Object.values(grouped).flat();

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const executeCommand = useCallback((cmd: CommandItem) => {
    navigate(cmd.path);
    close();
  }, [navigate, close]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, flatFiltered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatFiltered[selectedIndex]) {
        executeCommand(flatFiltered[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  let globalIdx = -1;

  return (
    <div className="command-palette-overlay" onClick={close}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="command-input-wrapper">
          <span className="command-icon">⌘K</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, skills, experience..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
          />
          <kbd className="esc-hint">ESC</kbd>
        </div>
        <div className="command-results">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="result-group">
              <div className="result-group-label">{category}</div>
              {items.map((cmd) => {
                globalIdx++;
                const idx = globalIdx;
                return (
                  <button
                    key={`${cmd.path}-${cmd.label}`}
                    className={`command-result-item ${idx === selectedIndex ? 'selected' : ''}`}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <span className="result-label">{cmd.label}</span>
                    <span className="result-path">{cmd.path}</span>
                  </button>
                );
              })}
            </div>
          ))}
          {flatFiltered.length === 0 && (
            <div className="no-results">No results found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;