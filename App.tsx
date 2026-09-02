import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { GameSettingsProvider } from './src/hooks/useGameSettings';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function AppContent() {
  const { colorScheme } = useTheme();

  return (
    <NavigationContainer>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF6EF' }}>
        <ActivityIndicator color="#6F5AF7" />
      </View>
    );
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
