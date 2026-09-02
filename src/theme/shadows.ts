import { Platform } from 'react-native';
import { ColorTokens } from './colors';

export type ShadowLevel = 's1' | 's2' | 's3';

const LIGHT_SHADOW_OPACITY: Record<ShadowLevel, number> = { s1: 0.06, s2: 0.08, s3: 0.12 };
const DARK_SHADOW_OPACITY: Record<ShadowLevel, number> = { s1: 0.3, s2: 0.4, s3: 0.5 };
const OFFSET_Y: Record<ShadowLevel, number> = { s1: 1, s2: 4, s3: 8 };
const RADIUS: Record<ShadowLevel, number> = { s1: 3, s2: 12, s3: 24 };
const ELEVATION: Record<ShadowLevel, number> = { s1: 1, s2: 3, s3: 6 };

/**
 * Cross-platform shadow style. iOS reads shadowColor/Offset/Opacity/Radius;
 * Android only honors `elevation` and always renders a black shadow, so the two
 * platforms can never look pixel-identical — this keeps both "subtle depth"
 * rather than pixel parity.
 */
export function getShadow(level: ShadowLevel, colorScheme: 'light' | 'dark', colors: ColorTokens) {
  const opacity = colorScheme === 'light' ? LIGHT_SHADOW_OPACITY[level] : DARK_SHADOW_OPACITY[level];

  return Platform.select({
    android: { elevation: ELEVATION[level] },
    default: {
      shadowColor: colorScheme === 'light' ? colors.textPrimary : '#000000',
      shadowOffset: { width: 0, height: OFFSET_Y[level] },
      shadowOpacity: opacity,
      shadowRadius: RADIUS[level],
    },
  });
}
