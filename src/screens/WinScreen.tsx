import { ResultScreen } from '../components/ResultScreen';
import { useGameSettings } from '../hooks/useGameSettings';
import { useTheme } from '../theme/ThemeContext';
import { RootStackScreenProps } from '../types/navigation';
import { formatTime } from '../utils/formatTime';
import { numberToWords } from '../utils/numberToWords';

export function WinScreen({ route, navigation }: RootStackScreenProps<'Win'>) {
  const { difficulty, moves, seconds, totalPairs } = route.params;
  const { bestResults } = useGameSettings();
  const { colors } = useTheme();

  const bestResult = bestResults[difficulty];
  const isNewBest = bestResult !== null && bestResult.seconds === seconds && bestResult.moves === moves;
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
        { label: 'Time', value: formatTime(seconds), icon: 'time-outline', iconColor: colors.info, isNewBest },
        { label: 'Moves', value: `${moves}`, icon: 'footsteps-outline', iconColor: colors.success },
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
