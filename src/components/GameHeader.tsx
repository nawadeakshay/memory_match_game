import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { radii } from '../theme/radii';
import { getShadow } from '../theme/shadows';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export interface GameHeaderProps {
  difficultyLabel: string;
  onBack: () => void;
  onCycleDifficulty: () => void;
  onRestart: () => void;
}

export function GameHeader({ difficultyLabel, onBack, onCycleDifficulty, onRestart }: GameHeaderProps) {
  const { colors, colorScheme } = useTheme();

  return (
    <View style={styles.row}>
      <IconButton iconName="chevron-back" accessibilityLabel="Back to Home" onPress={onBack} />

      <Pressable
        onPress={onCycleDifficulty}
        accessibilityRole="button"
        accessibilityLabel={`Difficulty: ${difficultyLabel}. Tap to change.`}
        style={({ pressed }) => [
          styles.pill,
          { backgroundColor: colors.surface, borderColor: colors.border, ...getShadow('s1', colorScheme, colors) },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={[styles.pillLabel, { color: colors.textPrimary }]}>{difficultyLabel}</Text>
        <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
      </Pressable>

      <IconButton iconName="refresh" accessibilityLabel="Restart game" onPress={onRestart} />
    </View>
  );
}

function IconButton({
  iconName,
  accessibilityLabel,
  onPress,
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
  onPress: () => void;
}) {
  const { colors, colorScheme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => [
        styles.iconButton,
        { backgroundColor: colors.surface, borderColor: colors.border, ...getShadow('s1', colorScheme, colors) },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Ionicons name={iconName} size={20} color={colors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radii.round,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radii.round,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  pillLabel: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.heading.fontFamily,
    letterSpacing: 0.2,
  },
});
