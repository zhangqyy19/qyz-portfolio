import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CommandPalette from "./components/CommandPalette";
import BackToTop from "./components/BackToTop";
import WeatherOverlay from "./components/WeatherOverlay";
import KonamiEasterEgg from "./components/KonamiEasterEgg";
import ChatBot from "./components/ChatBot";
import AboutPage from "./pages/AboutPage";
import ExperiencePage from "./pages/ExperiencePage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";
import TypingGamePage from "./pages/TypingGamePage";
import BlogPage from "./pages/BlogPage";
import { useNYCWeather, WeatherType } from "./hooks/useNYCWeather";
import { WeatherThemeContext } from "./hooks/useWeatherTheme";
// import { DarkModeContext, useDarkModeState } from "./hooks/useDarkMode";
import './styles/global.scss';

function App() {
  const { weather } = useNYCWeather();
  const [activeTheme, setActiveTheme] = useState<WeatherType | null>(null);
  // const darkMode = useDarkModeState();

  const toggleTheme = () => {
    if (activeTheme) {
      setActiveTheme(null);
    } else if (weather) {
      setActiveTheme(weather.weatherType);
    }
  };

  const setTheme = (theme: WeatherType | null) => {
    setActiveTheme(theme);
  };

  const weatherType = weather?.weatherType || null;

  return (
    <WeatherThemeContext.Provider value={{ activeTheme, toggleTheme, setTheme, weatherType }}>
      <Router>
        <div className={`app-container ${activeTheme ? `theme-${activeTheme}` : ''}`}>
          <CommandPalette />
          <BackToTop />
          <KonamiEasterEgg />
          <ChatBot />
          <Navbar />
          <WeatherOverlay />
          <Routes>
            <Route path="/" element={<AboutPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/typing" element={<TypingGamePage />} />
          </Routes>
        </div>
      </Router>
    </WeatherThemeContext.Provider>
  );
}

export default App;