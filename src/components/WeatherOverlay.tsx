import React from 'react';
import { useWeatherTheme } from '../hooks/useWeatherTheme';
import '../styles/WeatherOverlay.scss';

const WeatherOverlay: React.FC = () => {
  const { activeTheme } = useWeatherTheme();

  if (!activeTheme) return null;

  return (
    <div className={`weather-overlay weather-${activeTheme}`}>
      {activeTheme === 'snow' && (
        <div className="snow-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="snowflake" style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${8 + Math.random() * 12}px`
            }}>
              &#10052;
            </div>
          ))}
        </div>
      )}

      {activeTheme === 'rain' && (
        <div className="rain-container">
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className="raindrop" style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
              animationDelay: `${Math.random() * 2}s`
            }} />
          ))}
        </div>
      )}

      {activeTheme === 'storm' && (
        <div className="storm-container">
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className="raindrop" style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${0.3 + Math.random() * 0.3}s`,
              animationDelay: `${Math.random() * 1.5}s`
            }} />
          ))}
          <div className="lightning" />
        </div>
      )}

      {activeTheme === 'cloudy' && (
        <div className="clouds-container">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="cloud" style={{
              top: `${10 + Math.random() * 30}%`,
              animationDuration: `${20 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: 0.3 + Math.random() * 0.3
            }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherOverlay;