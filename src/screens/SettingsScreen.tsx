import { Ionicons } from '@expo/vector-icons';
import { Children, isValidElement, ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingRow } from '../components/SettingRow';
import { Toggle } from '../components/Toggle';
import { useGameSettings } from '../hooks/useGameSettings';
import { ThemePreference, useTheme } from '../theme/ThemeContext';
import { radii } from '../theme/radii';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { RootStackScreenProps } from '../types/navigation';
import { formatTime } from '../utils/formatTime';

export function SettingsScreen({ navigation }: RootStackScreenProps<'Settings'>) {
  const { colors, preference, setPreference, reduceMotion, setReduceMotion } = useTheme();
  const { difficultyConfig, cycleDifficulty, timeLimitSec, cycleTimeLimit, resetStatistics } = useGameSettings();

  const handleResetStatistics = () => {
    Alert.alert('Reset Statistics', 'This clears your best time and moves for every difficulty. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetStatistics },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
          style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerTitleGroup}>
          <Ionicons name="settings-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Settings</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>
      <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Make it your kind of fun.</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Section title="Gameplay">
          <SettingRow
            label="Difficulty / Grid Size"
            icon="grid-outline"
            value={`${difficultyConfig.columns} × ${difficultyConfig.rows} (${difficultyConfig.label})`}
            onPress={cycleDifficulty}
          />
          <SettingRow
            label="Time Limit"
            icon="time-outline"
            value={timeLimitSec === 0 ? 'Off' : formatTime(timeLimitSec)}
            onPress={cycleTimeLimit}
          />
        </Section>

        <Section title="Experience">
          <SettingRow
            label="Reduce Motion"
            icon="accessibility-outline"
            right={<Toggle value={reduceMotion} onValueChange={setReduceMotion} accessibilityLabel="Reduce motion" />}
          />
        </Section>

        <Section title="Appearance">
          <SettingRow
            label="Theme"
            icon="contrast-outline"
            right={<ThemeSegmentedControl value={preference} onChange={setPreference} />}
          />
        </Section>

        <Section title="Account">
          <SettingRow label="Reset Statistics" icon="trash-outline" onPress={handleResetStatistics} danger />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { colors } = useTheme();
  const rows = Children.toArray(children).filter(isValidElement);

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title.toUpperCase()}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {rows.map((row, index) => (
          <View
            key={row.key ?? index}
            style={index < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            {row}
          </View>
        ))}
      </View>
    </View>
  );
}

function ThemeSegmentedControl({
  value,
  onChange,
}: {
  value: ThemePreference;
  onChange: (preference: ThemePreference) => void;
}) {
  const { colors } = useTheme();
  const options: { key: ThemePreference; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'light', label: 'Light', icon: 'sunny-outline' },
    { key: 'dark', label: 'Dark', icon: 'moon-outline' },
    { key: 'auto', label: 'Auto', icon: 'contrast-outline' },
  ];

  return (
    <View style={[styles.segmented, { backgroundColor: colors.background, borderColor: colors.border }]}>
      {options.map((option) => {
        const active = value === option.key;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            accessibilityRole="button"
            accessibilityLabel={`${option.label} theme`}
            accessibilityState={{ selected: active }}
            style={[styles.segment, active && { backgroundColor: colors.accent }]}
          >
            <Ionicons name={option.icon} size={14} color={active ? colors.textOnAccent : colors.textSecondary} />
            <Text style={[styles.segmentLabel, { color: active ? colors.textOnAccent : colors.textSecondary }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radii.round,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.title.fontSize,
    fontFamily: typography.title.fontFamily,
  },
  headerSpacer: {
    width: 40,
  },
  headerSubtitle: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    letterSpacing: 0.5,
    marginLeft: spacing.xs,
  },
  sectionCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: radii.sm,
    borderWidth: 1,
    padding: 2,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm - 2,
  },
  segmentLabel: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.heading.fontFamily,
  },
});
