import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useNYCWeather, WeatherType } from '../hooks/useNYCWeather';
import { useWeatherTheme } from '../hooks/useWeatherTheme';
// import { useDarkMode } from '../hooks/useDarkMode';
import '../styles/Navbar.scss';

const weatherIcons: Record<WeatherType, string> = {
  clear: '☀️',
  cloudy: '☁️',
  rain: '🌧️',
  snow: '❄️',
  storm: '⛈️',
  fog: '🌫️'
};

const weatherLabels: Record<WeatherType, string> = {
  clear: 'Clear',
  cloudy: 'Cloudy',
  rain: 'Rainy',
  snow: 'Snowy',
  storm: 'Storm',
  fog: 'Foggy'
};

const allWeatherTypes: WeatherType[] = ['clear', 'cloudy', 'rain', 'snow', 'storm', 'fog'];

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { weather, nycTime, nycDate } = useNYCWeather();
  const { activeTheme, toggleTheme, setTheme } = useWeatherTheme();
  // const { isDark, toggle: toggleDark } = useDarkMode();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTheme = (type: WeatherType) => {
    if (activeTheme === type) {
      setTheme(null); // toggle off if same
    } else {
      setTheme(type);
    }
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-weather-wrapper" ref={dropdownRef}>
          <div className="navbar-weather" onClick={toggleTheme}>
            <span className="weather-label">NYC</span>
            <span className="weather-date">{nycDate}</span>
            <span className="weather-time">{nycTime}</span>
            {weather && (
              <>
                <span className="weather-temp">{weather.temperature}°F</span>
                <span className={`weather-icon ${activeTheme ? 'active' : ''}`}>
                  {weatherIcons[weather.weatherType]}
                </span>
                <span className={`toggle-dot ${activeTheme ? 'on' : ''}`} />
              </>
            )}
            {!weather && <span className="weather-loading">...</span>}
          </div>
          {weather && (
            <button className="dropdown-arrow" onClick={() => setDropdownOpen(!dropdownOpen)}>
              ▾
            </button>
          )}
          {dropdownOpen && (
            <div className="weather-dropdown">
              {allWeatherTypes.map((type) => (
                <button
                  key={type}
                  className={`dropdown-item ${activeTheme === type ? 'selected' : ''}`}
                  onClick={() => handleSelectTheme(type)}
                >
                  <span className="dropdown-icon">{weatherIcons[type]}</span>
                  <span className="dropdown-label">{weatherLabels[type]}</span>
                  {weather && weather.weatherType === type && <span className="live-badge">LIVE</span>}
                </button>
              ))}
              {activeTheme && (
                <button className="dropdown-item dropdown-reset" onClick={() => { setTheme(null); setDropdownOpen(false); }}>
                  Reset to default
                </button>
              )}
            </div>
          )}
        </div>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} end>About</NavLink>
          <NavLink to="/experience" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Experience</NavLink>
          <NavLink to="/projects" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Projects</NavLink>
          <NavLink to="/blog" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Blog</NavLink>
          <NavLink to="/contact" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
        </div>

        <div className="navbar-social">
          {/* <button className="dark-mode-toggle" onClick={toggleDark} aria-label="Toggle dark mode">
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </button> */}
          <a href="https://github.com/zhangqyy19" target="_blank" rel="noreferrer"><GitHubIcon /></a>
          <a href="https://www.linkedin.com/in/qian-yun-zhang-555291346/" target="_blank" rel="noreferrer"><LinkedInIcon /></a>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;