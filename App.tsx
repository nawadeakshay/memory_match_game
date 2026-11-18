import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { GameSettingsProvider } from './src/hooks/useGameSettings';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

// Keep the native splash screen up until fonts and saved theme settings are loaded,
// so players never see a blank screen or a flash of the wrong theme.
SplashScreen.preventAutoHideAsync().catch(() => {});

function AppContent() {
  const { colorScheme, ready } = useTheme();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <NavigationContainer>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <GameSettingsProvider>
          <AppContent />
        </GameSettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
