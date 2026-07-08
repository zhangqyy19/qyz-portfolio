import { createContext, useContext } from 'react';
import { WeatherType } from './useNYCWeather';

export interface WeatherThemeContextType {
  activeTheme: WeatherType | null; // null = default purple theme
  toggleTheme: () => void;
  setTheme: (theme: WeatherType | null) => void;
  weatherType: WeatherType | null;
}

export const WeatherThemeContext = createContext<WeatherThemeContextType>({
  activeTheme: null,
  toggleTheme: () => {},
  setTheme: () => {},
  weatherType: null
});

export function useWeatherTheme() {
  return useContext(WeatherThemeContext);
}