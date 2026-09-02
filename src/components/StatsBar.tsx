import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { radii } from '../theme/radii';
import { getShadow } from '../theme/shadows';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export interface StatItem {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  /** Overrides the default dark value text color (e.g. a countdown turning coral when low). */
  valueColor?: string;
}

export interface StatsBarProps {
  items: StatItem[];
}

export function StatsBar({ items }: StatsBarProps) {
  const { colors, colorScheme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border, ...getShadow('s1', colorScheme, colors) },
      ]}
    >
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <View style={styles.labelRow}>
            <Ionicons name={item.icon} size={13} color={item.iconColor} />
            <Text style={[styles.label, { color: colors.textSecondary }]}>{item.label}</Text>
          </View>
          <Text style={[styles.value, { color: item.valueColor ?? colors.textPrimary }]}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  item: {
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: typography.stat.fontSize,
    fontFamily: typography.stat.fontFamily,
    fontVariant: ['tabular-nums'],
  },
});
