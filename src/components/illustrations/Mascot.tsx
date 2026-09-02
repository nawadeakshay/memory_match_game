import { Image } from 'react-native';
import { MASCOT_IMAGES } from '../../theme/gameAssets';

/**
 * Renders the generated mascot artwork (assets/game/mascots/). Kept behind
 * this one small component with a `variant` prop — unchanged from when it
 * rendered hand-built View shapes — so no screen needed to change when the
 * real artwork replaced the placeholder illustrations.
 */
export type MascotVariant = 'brain' | 'trophy' | 'hourglass';

export interface MascotProps {
  variant: MascotVariant;
  size?: number;
}

export function Mascot({ variant, size = 120 }: MascotProps) {
  return (
    <Image
      source={MASCOT_IMAGES[variant]}
      style={{ width: size, height: size }}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
    />
  );
}
