import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { durations, easeOut, getTransformDuration } from '../theme/animation';
import { radii } from '../theme/radii';
import { getShadow } from '../theme/shadows';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { DECORATION_IMAGES } from '../theme/gameAssets';
import { AppButton } from './AppButton';
import { Mascot, MascotVariant } from './illustrations/Mascot';

export interface ResultStat {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  isNewBest?: boolean;
}

export interface TitleAccentPart {
  text: string;
  color: string;
}

export interface ResultScreenProps {
  tone: 'success' | 'danger';
  mascot: MascotVariant;
  title: string;
  /**
   * The second title line. Pass a plain string for a single tone-colored line
   * (Time Up's "TIME."). Pass parts for independently-colored words within
   * that line (Win's "FOR" purple / "EIGHT." orange) — each part still needs
   * its own trailing space baked in where one belongs, same as writing the string.
   */
  titleAccent: string | TitleAccentPart[];
  subtitle: string;
  stats: ResultStat[];
  primaryLabel: string;
  primaryIcon: keyof typeof Ionicons.glyphMap;
  onPrimary: () => void;
  secondaryLabel: string;
  onSecondary: () => void;
  /** Time-Up uses a fixed dark background regardless of app theme, per the reference. */
  forceDarkBackground?: boolean;
}

const NIGHT_STARS = [
  { top: 0, left: '12%', size: 5 },
  { top: 20, left: '85%', size: 4 },
  { top: 50, left: '5%', size: 3 },
  { top: 60, left: '92%', size: 5 },
  { top: 10, left: '48%', size: 3 },
] as const;

export function ResultScreen({
  tone,
  mascot,
  title,
  titleAccent,
  subtitle,
  stats,
  primaryLabel,
  primaryIcon,
  onPrimary,
  secondaryLabel,
  onSecondary,
  forceDarkBackground,
}: ResultScreenProps) {
  const { colors, colorScheme, reduceMotion } = useTheme();
  const toneColor = tone === 'success' ? colors.success : colors.mismatch;
  const toneSoft = tone === 'success' ? colors.successSoft : colors.mismatchSoft;

  // Time-Up is a deliberate "night" moment — always dark, independent of the app theme.
  const background = forceDarkBackground ? '#0F1220' : colors.background;
  const textPrimary = forceDarkBackground ? '#F5F4FF' : colors.textPrimary;
  const textSecondary = forceDarkBackground ? '#9498A8' : colors.textSecondary;
  const surface = forceDarkBackground ? '#1A1E34' : colors.surface;
  const border = forceDarkBackground ? '#2A2E45' : colors.border;
  const resolvedScheme = forceDarkBackground ? 'dark' : colorScheme;

  const introProgress = useSharedValue(reduceMotion ? 1 : 0);
  useEffect(() => {
    introProgress.value = withTiming(1, {
      duration: getTransformDuration(durations.resultIntro, reduceMotion),
      easing: easeOut,
    });
  }, [introProgress, reduceMotion]);

  const introStyle = useAnimatedStyle(() => ({
    opacity: introProgress.value,
    transform: [{ scale: 0.95 + introProgress.value * 0.05 }],
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top', 'bottom']}>
      <View style={styles.closeRow}>
        <Pressable
          onPress={onSecondary}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={8}
          style={[
            styles.closeButton,
            { backgroundColor: surface, borderColor: border },
            !forceDarkBackground && getShadow('s1', resolvedScheme, colors),
          ]}
        >
          <Ionicons name="close" size={20} color={textPrimary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.iconWrapper, introStyle]}>
          {tone === 'success' && (
            <Image
              source={DECORATION_IMAGES.confetti}
              style={styles.confettiImage}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          )}
          {forceDarkBackground &&
            NIGHT_STARS.map((star, index) => (
              <View
                key={index}
                style={[
                  styles.starDot,
                  { top: star.top, left: star.left, width: star.size, height: star.size, borderRadius: star.size / 2 },
                ]}
              />
            ))}
          {forceDarkBackground ? (
            <Mascot variant={mascot} size={168} />
          ) : (
            <View style={[styles.iconCircle, { backgroundColor: toneSoft }]}>
              <Mascot variant={mascot} size={96} />
            </View>
          )}
        </Animated.View>

        <Text style={[styles.title, { color: textPrimary }]}>{title}</Text>
        <Text style={styles.title}>
          {typeof titleAccent === 'string' ? (
            <Text style={{ color: toneColor }}>{titleAccent}</Text>
          ) : (
            titleAccent.map((part, index) => (
              <Text key={index} style={{ color: part.color }}>
                {part.text}
              </Text>
            ))
          )}
        </Text>
        <Text style={[styles.subtitle, { color: textSecondary }]}>{subtitle}</Text>

        <View
          style={[
            styles.statsCard,
            { backgroundColor: surface, borderColor: border, ...getShadow('s2', resolvedScheme, colors) },
          ]}
        >
          {stats.map((stat, index) => (
            <View
              key={stat.label}
              style={[styles.statRow, index < stats.length - 1 && { borderBottomWidth: 1, borderBottomColor: border }]}
            >
              <View style={styles.statLabelGroup}>
                <Ionicons name={stat.icon} size={16} color={stat.iconColor} />
                <Text style={[styles.statLabel, { color: textSecondary }]}>{stat.label}</Text>
              </View>
              <View style={styles.statValueGroup}>
                <Text style={[styles.statValue, { color: textPrimary }]}>{stat.value}</Text>
                {stat.isNewBest && (
                  <View style={[styles.badge, { backgroundColor: toneSoft }]}>
                    <Text style={[styles.badgeLabel, { color: toneColor }]}>NEW BEST</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <AppButton
          label={primaryLabel}
          icon={primaryIcon}
          onPress={onPrimary}
          variant="primary"
          tone={tone === 'success' ? 'accent' : 'danger'}
        />
        <AppButton
          label={secondaryLabel}
          icon="home-outline"
          onPress={onSecondary}
          variant="secondary"
          backgroundColor={forceDarkBackground ? surface : undefined}
          borderColor={forceDarkBackground ? border : undefined}
          textColor={forceDarkBackground ? textPrimary : undefined}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  iconWrapper: {
    marginBottom: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Centered explicitly on both axes (rather than relying on the parent's
  // alignItems for an absolutely-positioned child) — the previous version set
  // only `top`, which left it hugging the left edge instead of centered behind
  // the trophy, reading as a lopsided, cropped-looking scatter.
  confettiImage: {
    position: 'absolute',
    width: 260,
    height: 130,
    top: '50%',
    left: '50%',
    marginTop: -65,
    marginLeft: -130,
  },
  starDot: {
    position: 'absolute',
    backgroundColor: '#F5F4FF',
    opacity: 0.8,
  },
  closeRow: {
    alignItems: 'flex-start',
    paddingTop: spacing.sm,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: radii.round,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: radii.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.display.fontSize,
    fontFamily: typography.display.fontFamily,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    fontFamily: typography.body.fontFamily,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  statsCard: {
    width: '100%',
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  statLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statLabel: {
    fontSize: typography.body.fontSize,
    fontFamily: typography.body.fontFamily,
  },
  statValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statValue: {
    fontSize: typography.stat.fontSize,
    fontFamily: typography.stat.fontFamily,
  },
  badge: {
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeLabel: {
    fontSize: 10,
    fontFamily: typography.caption.fontFamily,
    letterSpacing: 0.3,
  },
  actions: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
});
