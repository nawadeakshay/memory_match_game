import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameBoard } from '../components/GameBoard';
import { GameHeader } from '../components/GameHeader';
import { StatsBar } from '../components/StatsBar';
import { useGame } from '../hooks/useGame';
import { useGameSettings } from '../hooks/useGameSettings';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { RootStackScreenProps } from '../types/navigation';
import { formatTime } from '../utils/formatTime';

const TIPS = ['Focus, you’ve got this.', 'Take your time — accuracy beats speed.', 'Remember what you flip.'];

export function GameScreen({ navigation }: RootStackScreenProps<'Game'>) {
  const { colors } = useTheme();
  const { difficulty, difficultyConfig, timeLimitSec, cycleDifficulty, recordResult } = useGameSettings();
  const game = useGame({ pairCount: difficultyConfig.pairCount, timeLimitSec });
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const hasNavigatedAway = useRef(false);

  useEffect(() => {
    if (hasNavigatedAway.current) return;

    if (game.status === 'won') {
      hasNavigatedAway.current = true;
      const newBests = recordResult(difficulty, { seconds: game.seconds, moves: game.moves });
      navigation.replace('Win', {
        difficulty,
        moves: game.moves,
        seconds: game.seconds,
        matchedPairs: game.matchedPairs,
        totalPairs: game.totalPairs,
        newBestTime: newBests.time,
        newBestMoves: newBests.moves,
      });
    } else if (game.status === 'timeUp') {
      hasNavigatedAway.current = true;
      navigation.replace('TimeUp', {
        difficulty,
        moves: game.moves,
        matchedPairs: game.matchedPairs,
        totalPairs: game.totalPairs,
        timeLimitSec,
      });
    }
  }, [game.status, game.seconds, game.moves, game.matchedPairs, game.totalPairs, difficulty, timeLimitSec, navigation, recordResult]);

  const timeValue =
    timeLimitSec > 0 ? formatTime(Math.max(0, timeLimitSec - game.seconds)) : formatTime(game.seconds);
  const timeLow = timeLimitSec > 0 && timeLimitSec - game.seconds <= 10;
  const difficultyLabel = `${difficultyConfig.label} ${difficultyConfig.columns}×${difficultyConfig.rows}`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <GameHeader
        difficultyLabel={difficultyLabel}
        onBack={() => navigation.navigate('Home')}
        onCycleDifficulty={cycleDifficulty}
        onRestart={game.restart}
      />

      <StatsBar
        items={[
          {
            label: 'Pairs',
            value: `${game.matchedPairs} / ${game.totalPairs}`,
            icon: 'star',
            iconColor: colors.accentYellow,
            valueColor: colors.accent,
          },
          { label: 'Moves', value: `${game.moves}`, icon: 'footsteps', iconColor: colors.info },
          {
            label: timeLimitSec > 0 ? 'Time Left' : 'Time',
            value: timeValue,
            icon: 'time',
            iconColor: timeLow ? colors.mismatch : colors.success,
            valueColor: timeLow ? colors.mismatch : colors.success,
          },
        ]}
      />

      {/*
        Two weighted spacers (1:3) around the grid instead of centering it (which
        previously pushed it far down) or top-aligning it flush against the stats
        bar (which just relocates all the leftover space below instead of
        distributing it). Most of the available space still trails toward the
        hint card, but a small proportional gap remains above the grid too, and
        both scale with the screen instead of being fixed pixel values.
      */}
      <View style={styles.boardWrapper}>
        <View style={{ flex: 1 }} />
        <GameBoard
          cards={game.cards}
          columns={difficultyConfig.columns}
          isBoardLocked={game.isBoardLocked}
          onSelectCard={game.selectCard}
        />
        <View style={{ flex: 3 }} />
      </View>

      <View style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="bulb-outline" size={16} color={colors.accent} />
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>{tip}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  boardWrapper: {
    flex: 1,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  tipText: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    textAlign: 'center',
  },
});
