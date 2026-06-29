import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import WeatherOverlay from "./components/WeatherOverlay";
import AboutPage from "./pages/AboutPage";
import ExperiencePage from "./pages/ExperiencePage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";
import { useNYCWeather, WeatherType } from "./hooks/useNYCWeather";
import { WeatherThemeContext } from "./hooks/useWeatherTheme";
import './styles/global.scss';

function App() {
  const { weather } = useNYCWeather();
  const [activeTheme, setActiveTheme] = useState<WeatherType | null>(null);

  const toggleTheme = () => {
    if (activeTheme) {
      setActiveTheme(null); // toggle off
    } else if (weather) {
      setActiveTheme(weather.weatherType); // toggle on
    }
  };

  const weatherType = weather?.weatherType || null;

  return (
    <WeatherThemeContext.Provider value={{ activeTheme, toggleTheme, weatherType }}>
      <Router>
        <div className={`app-container ${activeTheme ? `theme-${activeTheme}` : ''}`}>
          <Navbar />
          <WeatherOverlay />
          <Routes>
            <Route path="/" element={<AboutPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
       </div>
      </Router>
    </WeatherThemeContext.Provider>
  );
}

export default App;