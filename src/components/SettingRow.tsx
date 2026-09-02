import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export interface SettingRowProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Tappable rows show a value + chevron and cycle through options on press. */
  value?: string;
  onPress?: () => void;
  /** A custom trailing control (e.g. a Toggle) instead of the value + chevron. */
  right?: ReactNode;
  danger?: boolean;
}

export function SettingRow({ label, icon, value, onPress, right, danger }: SettingRowProps) {
  const { colors } = useTheme();
  const isInteractive = Boolean(onPress);
  const labelColor = danger ? colors.mismatch : colors.textPrimary;

  const content = (
    <View style={styles.row}>
      <View style={styles.labelGroup}>
        {icon && <Ionicons name={icon} size={18} color={labelColor} />}
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      </View>
      {right ?? (
        <View style={styles.valueGroup}>
          {value !== undefined && <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text>}
          {isInteractive && <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />}
        </View>
      )}
    </View>
  );

  if (!isInteractive) {
    return content;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      style={({ pressed }) => [pressed && { opacity: 0.6 }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingVertical: spacing.sm,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.body.fontSize,
    fontFamily: typography.body.fontFamily,
  },
  valueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  value: {
    fontSize: typography.body.fontSize,
    fontFamily: typography.body.fontFamily,
  },
});
