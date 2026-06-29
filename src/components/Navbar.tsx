import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/Navbar.scss';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          QYZ
        </NavLink>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} end>
            About
          </NavLink>
          <NavLink to="/experience" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            Experience
          </NavLink>
          <NavLink to="/projects" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            Projects
          </NavLink>
          <NavLink to="/contact" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
        </div>

        <div className="navbar-social">
          <a href="https://github.com/zhangqyy19" target="_blank" rel="noreferrer">
            <GitHubIcon />
          </a>
          <a href="https://www.linkedin.com/in/qian-yun-zhang-555291346/" target="_blank" rel="noreferrer">
            <LinkedInIcon />
          </a>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;