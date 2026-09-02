import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { AccessibilityRole, Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { durations, easeOut, getTransformDuration } from '../theme/animation';
import { radii } from '../theme/radii';
import { getShadow } from '../theme/shadows';
import { SYMBOL_IMAGES } from '../theme/gameAssets';

export type CardVisualState = 'hidden' | 'locked' | 'faceUp' | 'mismatch' | 'matched';

export interface MemoryCardProps {
  symbol: string;
  visualState: CardVisualState;
  size: number;
  onPress: () => void;
}

const FLIP_ROTATION = 180;
const MATCH_POP_SCALE = 1.06;
const SHAKE_OFFSET = 6;

export function MemoryCard({ symbol, visualState, size, onPress }: MemoryCardProps) {
  const { colors, colorScheme, reduceMotion } = useTheme();

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const shakeX = useSharedValue(0);

  const isRevealed = visualState === 'faceUp' || visualState === 'mismatch' || visualState === 'matched';

  useEffect(() => {
    rotation.value = withTiming(isRevealed ? FLIP_ROTATION : 0, {
      duration: getTransformDuration(durations.cardFlip, reduceMotion),
      easing: easeOut,
    });
  }, [isRevealed, reduceMotion, rotation]);

  useEffect(() => {
    if (visualState !== 'matched' || reduceMotion) return;
    const duration = durations.matchPop / 2;
    scale.value = withSequence(
      withTiming(MATCH_POP_SCALE, { duration, easing: easeOut }),
      withTiming(1, { duration, easing: easeOut })
    );
  }, [visualState, reduceMotion, scale]);

  useEffect(() => {
    if (visualState !== 'mismatch' || reduceMotion) return;
    const step = durations.mismatchShake / 4;
    shakeX.value = withSequence(
      withTiming(-SHAKE_OFFSET, { duration: step }),
      withTiming(SHAKE_OFFSET, { duration: step }),
      withTiming(-SHAKE_OFFSET, { duration: step }),
      withTiming(0, { duration: step })
    );
  }, [visualState, reduceMotion, shakeX]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }, { scale: scale.value }],
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${rotation.value}deg` }],
  }));

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${rotation.value + 180}deg` }],
  }));

  const isInteractive = visualState === 'hidden';
  const borderColor =
    visualState === 'matched' ? colors.success : visualState === 'mismatch' ? colors.mismatch : colors.border;
  const borderWidth = visualState === 'matched' || visualState === 'mismatch' ? 2 : 1;

  return (
    <Animated.View
      style={[
        { width: size, height: size, borderRadius: radii.lg },
        getShadow('s1', colorScheme, colors),
        containerAnimatedStyle,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={!isInteractive}
        accessibilityRole={'button' as AccessibilityRole}
        accessibilityLabel={accessibilityLabelFor(visualState)}
        accessibilityState={{ disabled: !isInteractive }}
        style={styles.pressable}
      >
        <Animated.View
          style={[styles.face, { backgroundColor: colors.cardBack, borderWidth: 0 }, backAnimatedStyle]}
        >
          <CardBack locked={visualState === 'locked'} />
        </Animated.View>

        <Animated.View
          style={[styles.face, { backgroundColor: colors.card, borderColor, borderWidth }, frontAnimatedStyle]}
        >
          <Image source={SYMBOL_IMAGES[symbol]} style={styles.symbolImage} resizeMode="contain" />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

function CardBack({ locked }: { locked: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.backContent, locked && styles.backContentLocked]}>
      <Ionicons name="sparkles-outline" size={22} color={colors.cardBackSymbol} />
      {locked && <Ionicons name="lock-closed" size={14} color={colors.cardBackSymbol} style={styles.lockGlyph} />}
    </View>
  );
}

function accessibilityLabelFor(state: CardVisualState): string {
  switch (state) {
    case 'hidden':
      return 'Hidden card. Double tap to flip.';
    case 'locked':
      return 'Card locked while the previous pair resolves.';
    case 'faceUp':
      return 'Face up card, waiting for a second card.';
    case 'mismatch':
      return 'Mismatched pair, flipping back down.';
    case 'matched':
      return 'Matched pair.';
  }
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: radii.lg, // 16px, matching the reference's stated card corner radius
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  backContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backContentLocked: {
    opacity: 0.5,
  },
  lockGlyph: {
    position: 'absolute',
  },
  symbolImage: {
    width: '68%',
    height: '68%',
  },
});
