import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { durations, getTransformDuration } from '../theme/animation';
import { radii } from '../theme/radii';
import { getShadow } from '../theme/shadows';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export type AppButtonVariant = 'primary' | 'secondary';
export type AppButtonTone = 'accent' | 'danger';

export interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  tone?: AppButtonTone;
  disabled?: boolean;
  /** Layout-only overrides (e.g. flex) for the outer wrapper — not for color. */
  style?: StyleProp<ViewStyle>;
  /**
   * Color overrides for contexts that don't use the ambient theme (e.g. a
   * button sitting on Time Up's always-dark scene). These are applied to the
   * actual Pressable surface, unlike `style`, which only reaches the outer
   * transform wrapper and can never repaint an element that sets its own
   * background/text colors.
   */
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  accessibilityHint?: string;
  /** Name of an Ionicons glyph shown before the label (e.g. "play", "settings-outline"). */
  icon?: keyof typeof Ionicons.glyphMap;
}

const PRESSED_SCALE = 0.96;

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  tone = 'accent',
  disabled = false,
  style,
  backgroundColor,
  borderColor,
  textColor,
  accessibilityHint,
  icon,
}: AppButtonProps) {
  const { colors, colorScheme, reduceMotion } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const toneColor = tone === 'danger' ? colors.mismatch : colors.accent;
  const isFilled = variant === 'primary';
  const contentColor = textColor ?? (isFilled ? colors.textOnAccent : disabled ? colors.textSecondary : colors.textPrimary);

  const handlePressIn = () => {
    scale.value = withTiming(PRESSED_SCALE, { duration: getTransformDuration(durations.buttonPress, reduceMotion) });
  };
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: getTransformDuration(durations.buttonPress, reduceMotion) });
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        style={[
          styles.base,
          isFilled
            ? {
                backgroundColor: backgroundColor ?? (disabled ? colors.border : toneColor),
                ...getShadow('s2', colorScheme, colors),
              }
            : {
                backgroundColor: backgroundColor ?? colors.surface,
                borderWidth: 1,
                borderColor: borderColor ?? colors.border,
              },
        ]}
      >
        <View style={styles.content}>
          {icon && <Ionicons name={icon} size={18} color={contentColor} />}
          <Text style={[styles.label, { color: contentColor }]}>{label}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: radii.round,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.heading.fontSize,
    fontFamily: typography.heading.fontFamily,
  },
});
