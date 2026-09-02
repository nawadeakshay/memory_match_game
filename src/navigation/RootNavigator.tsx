import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameScreen } from '../screens/GameScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TimeUpScreen } from '../screens/TimeUpScreen';
import { WinScreen } from '../screens/WinScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Win" component={WinScreen} />
      <Stack.Screen name="TimeUp" component={TimeUpScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
