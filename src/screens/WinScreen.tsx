import { ResultScreen } from '../components/ResultScreen';
import { useTheme } from '../theme/ThemeContext';
import { RootStackScreenProps } from '../types/navigation';
import { formatTime } from '../utils/formatTime';
import { numberToWords } from '../utils/numberToWords';

export function WinScreen({ route, navigation }: RootStackScreenProps<'Win'>) {
  const { moves, seconds, totalPairs, newBestTime, newBestMoves } = route.params;
  const { colors } = useTheme();

  const accuracy = moves > 0 ? Math.round((route.params.matchedPairs / moves) * 100) : 100;
  const pairWord = numberToWords(totalPairs).toUpperCase();

  return (
    <ResultScreen
      tone="success"
      mascot="trophy"
      title={pairWord}
      titleAccent={[
        { text: 'FOR ', color: colors.accent },
        { text: `${pairWord}.`, color: colors.accentOrange },
      ]}
      subtitle="Perfect pairs. Perfect you."
      stats={[
        { label: 'Time', value: formatTime(seconds), icon: 'time-outline', iconColor: colors.info, isNewBest: newBestTime },
        { label: 'Moves', value: `${moves}`, icon: 'footsteps-outline', iconColor: colors.success, isNewBest: newBestMoves },
        { label: 'Accuracy', value: `${accuracy}%`, icon: 'checkmark-circle-outline', iconColor: colors.success },
      ]}
      primaryLabel="Play Again"
      primaryIcon="play"
      onPrimary={() => navigation.replace('Game')}
      secondaryLabel="Back to Home"
      onSecondary={() => navigation.navigate('Home')}
    />
  );
}
