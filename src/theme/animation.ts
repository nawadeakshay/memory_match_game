import { Easing } from 'react-native-reanimated';

export const durations = {
  cardFlip: 300,
  matchPop: 200,
  mismatchShake: 350,
  buttonPress: 120,
  resultIntro: 400,
};

export const easeOut = Easing.out(Easing.cubic);

/**
 * "Reduce motion" trades transform-based animation (rotation, translation, scale)
 * for a near-instant, opacity-only transition instead of just shortening the same
 * animation — matching the accessibility expectation that motion-sensitive users
 * see essentially no movement, not a faster version of it.
 */
export function getTransformDuration(baseMs: number, reduceMotion: boolean): number {
  return reduceMotion ? 0 : baseMs;
}
