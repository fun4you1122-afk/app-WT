import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

export const lightColors = {
  background: '#F4F6FF',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8FAFF',
  card: '#FFFFFF',
  primary: '#0055FF',
  primaryLight: '#E8EFFE',
  accent: '#7C3AED',
  accentLight: '#EDE9FE',
  cyan: '#0EA5E9',
  success: '#059669',
  successLight: '#D1FAE5',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  text: '#0A1628',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  inputBg: '#F4F6FF',
  shadow: '#0A1628',
  overlay: 'rgba(10,22,40,0.5)',
};

export const darkColors: typeof lightColors = {
  background: '#0A0F1E',
  surface: '#141B2D',
  surfaceSecondary: '#1A2238',
  card: '#1A2238',
  primary: '#3B82F6',
  primaryLight: '#1E3A5F',
  accent: '#A78BFA',
  accentLight: '#2E1B5E',
  cyan: '#38BDF8',
  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FCD34D',
  warningLight: '#451A03',
  error: '#F87171',
  errorLight: '#450A0A',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#475569',
  textInverse: '#0A1628',
  border: '#1E293B',
  borderLight: '#1E293B',
  tabBar: '#141B2D',
  tabBarBorder: '#1E293B',
  inputBg: '#1A2238',
  shadow: '#000000',
  overlay: 'rgba(0,0,0,0.7)',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  colors: lightColors,
});

const THEME_KEY = '@wethink_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(saved => {
      if (saved === 'dark' || saved === 'light') setTheme(saved);
    });
  }, []);

  const toggleTheme = async () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    await AsyncStorage.setItem(THEME_KEY, next);
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
