import React, { useEffect, useState } from 'react';
import { useWeatherTheme } from '../hooks/useWeatherTheme';
import '../styles/WeatherOverlay.scss';

const WeatherOverlay: React.FC = () => {
  const { activeTheme } = useWeatherTheme();
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });

  // Track mouse for fog flashlight
  useEffect(() => {
    if (activeTheme !== 'fog') return;

    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [activeTheme]);

  if (!activeTheme) return null;

  return (
    <div className={`weather-overlay weather-${activeTheme}`}>
      {activeTheme === 'snow' && (
        <div className="snow-container">
          {Array.from({ length: 120 }).map((_, i) => (
            <div key={i} className="snowflake" style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${10 + Math.random() * 16}px`,
              opacity: 0.7 + Math.random() * 0.3
            }}>
              &#10052;
            </div>
          ))}
        </div>
      )}

      {activeTheme === 'rain' && (
        <div className="rain-container">
          {Array.from({ length: 150 }).map((_, i) => (
            <div key={i} className="raindrop" style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${0.4 + Math.random() * 0.3}s`,
              animationDelay: `${Math.random() * 1}s`
            }} />
          ))}
        </div>
      )}

      {activeTheme === 'storm' && (
        <div className="storm-container">
          {Array.from({ length: 180 }).map((_, i) => (
            <div key={i} className="raindrop storm-rain" style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${0.2 + Math.random() * 0.2}s`,
              animationDelay: `${Math.random() * 0.5}s`
            }} />
          ))}
          <div className="lightning lightning-1" />
          <div className="lightning lightning-2" />
          <div className="lightning lightning-3" />
        </div>
      )}

      {activeTheme === 'cloudy' && (
        <div className="clouds-container">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="cloud" style={{
              top: `${5 + Math.random() * 40}%`,
              animationDuration: `${8 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.4 + Math.random() * 0.3
            }} />
          ))}
        </div>
      )}

      {activeTheme === 'fog' && (
        <div className="fog-container">
          <div
            className="fog-layer"
            style={{
              '--fog-mask': `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`
            } as React.CSSProperties}
          />
        </div>
      )}
    </div>
  );
};

export default WeatherOverlay;