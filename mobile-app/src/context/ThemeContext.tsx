import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, LightTheme, ThemeColors } from '../constants/theme';

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  temaDegistir: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const TEMA_KEY = 'degerbic_tema';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const temaYukle = async () => {
      const kayitli = await AsyncStorage.getItem(TEMA_KEY);
      if (kayitli) {
        setIsDark(kayitli === 'dark');
      }
    };
    temaYukle();
  }, []);

  const temaDegistir = async () => {
    const yeniTema = !isDark;
    setIsDark(yeniTema);
    await AsyncStorage.setItem(TEMA_KEY, yeniTema ? 'dark' : 'light');
  };

  const colors = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ colors, isDark, temaDegistir }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme, ThemeProvider içinde kullanılmalıdır');
  }
  return context;
}
