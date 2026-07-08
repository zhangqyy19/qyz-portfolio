import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import '../styles/BackToTop.scss';

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const isContactPage = location.pathname === '/contact';

  useEffect(() => {
    const container = document.querySelector('.app-container');
    if (!container) return;

    const handleScroll = () => {
      setVisible(container.scrollTop > 200);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const container = document.querySelector('.app-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isContactPage) return null;

  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <KeyboardArrowUpIcon />
    </button>
  );
};

export default BackToTop;