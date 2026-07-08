import { useState, useEffect } from 'react';

export type WeatherType = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog';

export interface WeatherData {
  temperature: number; // Fahrenheit
  weatherType: WeatherType;
  description: string;
}

// WMO Weather interpretation codes -> our types
function wmoToWeatherType(code: number): { type: WeatherType; description: string } {
  if (code === 0 || code === 1) return { type: 'clear', description: 'Clear' };
  if (code === 2 || code === 3) return { type: 'cloudy', description: 'Cloudy' };
  if (code === 45 || code === 48) return { type: 'fog', description: 'Foggy' };
  if (code >= 51 && code <= 67) return { type: 'rain', description: 'Rainy' };
  if (code >= 71 && code <= 77) return { type: 'snow', description: 'Snowy' };
  if (code >= 80 && code <= 82) return { type: 'rain', description: 'Showers' };
  if (code >= 85 && code <= 86) return { type: 'snow', description: 'Snow Showers' };
  if (code >= 95) return { type: 'storm', description: 'Thunderstorm' };
  return { type: 'clear', description: 'Clear' };
}

export function useNYCWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [nycTime, setNycTime] = useState<string>('');
  const [nycDate, setNycDate] = useState<string>('');

  // Update NYC time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const nycTimeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      const nycDateStr = now.toLocaleDateString('en-US', {
        timeZone: 'America/New_York',
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      setNycTime(nycTimeStr);
      setNycDate(nycDateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather every 10 minutes
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // NYC coordinates: 40.7128, -74.0060
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America%2FNew_York'
        );
        const data = await res.json();
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        const { type, description } = wmoToWeatherType(code);

        setWeather({
          temperature: temp,
          weatherType: type,
          description
        });
      } catch (err) {
        console.error('Failed to fetch weather:', err);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // 10 min
    return () => clearInterval(interval);
  }, []);

  return { weather, nycTime, nycDate };
}