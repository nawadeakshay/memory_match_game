import { ResultScreen } from '../components/ResultScreen';
import { darkColors } from '../theme/colors';
import { RootStackScreenProps } from '../types/navigation';
import { formatTime } from '../utils/formatTime';

export function TimeUpScreen({ route, navigation }: RootStackScreenProps<'TimeUp'>) {
  const { moves, matchedPairs, totalPairs, timeLimitSec } = route.params;

  return (
    <ResultScreen
      tone="danger"
      mascot="hourglass"
      forceDarkBackground
      title="OUT OF"
      titleAccent="TIME."
      subtitle="So close! Try again and beat your best."
      stats={[
        {
          label: 'Pairs Completed',
          value: `${matchedPairs} / ${totalPairs}`,
          icon: 'star',
          iconColor: darkColors.accentYellow,
        },
        { label: 'Moves', value: `${moves}`, icon: 'footsteps-outline', iconColor: darkColors.info },
        { label: 'Time Limit', value: formatTime(timeLimitSec), icon: 'time-outline', iconColor: darkColors.mismatch },
      ]}
      primaryLabel="Try Again"
      primaryIcon="refresh"
      onPrimary={() => navigation.replace('Game')}
      secondaryLabel="Back to Home"
      onSecondary={() => navigation.navigate('Home')}
    />
  );
}
