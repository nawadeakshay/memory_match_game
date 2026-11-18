import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { usePersistentState } from '../services/storage';
import { ColorTokens, darkColors, lightColors } from './colors';

export type ColorScheme = 'light' | 'dark';
export type ThemePreference = ColorScheme | 'auto';

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'auto';
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

interface ThemeContextValue {
  /** What the user picked in Settings: 'light' | 'dark' | 'auto'. */
  preference: ThemePreference;
  /** The actual scheme in effect right now — 'auto' resolved against the OS setting. */
  colorScheme: ColorScheme;
  colors: ColorTokens;
  setPreference: (preference: ThemePreference) => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
  /** True once saved theme settings have been read from the device. */
  ready: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [preference, setPreference, preferenceLoaded] = usePersistentState<ThemePreference>(
    'memoryMatch.themePreference',
    'light',
    isThemePreference
  );
  const [reduceMotion, setReduceMotion, reduceMotionLoaded] = usePersistentState<boolean>('memoryMatch.reduceMotion', false, isBoolean);

  const colorScheme: ColorScheme = preference === 'auto' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;
  const colors = colorScheme === 'light' ? lightColors : darkColors;

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      colorScheme,
      colors,
      setPreference,
      reduceMotion,
      setReduceMotion,
      ready: preferenceLoaded && reduceMotionLoaded,
    }),
    [preference, colorScheme, colors, setPreference, reduceMotion, setReduceMotion, preferenceLoaded, reduceMotionLoaded]
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
