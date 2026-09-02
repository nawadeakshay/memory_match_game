import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { ColorTokens, darkColors, lightColors } from './colors';

export type ColorScheme = 'light' | 'dark';
export type ThemePreference = ColorScheme | 'auto';

interface ThemeContextValue {
  /** What the user picked in Settings: 'light' | 'dark' | 'auto'. */
  preference: ThemePreference;
  /** The actual scheme in effect right now — 'auto' resolved against the OS setting. */
  colorScheme: ColorScheme;
  colors: ColorTokens;
  setPreference: (preference: ThemePreference) => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('light');
  const [reduceMotion, setReduceMotion] = useState(false);

  const colorScheme: ColorScheme = preference === 'auto' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;
  const colors = colorScheme === 'light' ? lightColors : darkColors;

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, colorScheme, colors, setPreference, reduceMotion, setReduceMotion }),
    [preference, colorScheme, colors, reduceMotion]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
