import { ImageSourcePropType } from 'react-native';

// Metro requires static, literal require() paths, so every asset is listed
// explicitly here rather than built from a template string.

/**
 * Maps each existing card `symbol` id (still the emoji strings deck.ts has
 * always used — unchanged, since match.ts only compares them for equality)
 * to the generated artwork that now renders in its place. This is the only
 * place that association lives, so deck.ts/match.ts never need to know
 * artwork exists.
 */
export const SYMBOL_IMAGES: Record<string, ImageSourcePropType> = {
  '🔵': require('../../assets/game/symbols/circle.png'),
  '🟧': require('../../assets/game/symbols/square.png'),
  '🟣': require('../../assets/game/symbols/diamond.png'),
  '🔷': require('../../assets/game/symbols/triangle.png'),
  '🟡': require('../../assets/game/symbols/star.png'),
  '🟪': require('../../assets/game/symbols/moon.png'),
  '⚫': require('../../assets/game/symbols/ring.png'),
  '🔶': require('../../assets/game/symbols/chevron.png'),
  '🟦': require('../../assets/game/symbols/heart.png'),
  '🟨': require('../../assets/game/symbols/sun.png'),
  '🟠': require('../../assets/game/symbols/flag.png'),
  '🟫': require('../../assets/game/symbols/flower.png'),
};

export const MASCOT_IMAGES = {
  brain: require('../../assets/game/mascots/brain.png') as ImageSourcePropType,
  trophy: require('../../assets/game/mascots/trophy.png') as ImageSourcePropType,
  hourglass: require('../../assets/game/mascots/hourglass.png') as ImageSourcePropType,
};

export const DECORATION_IMAGES = {
  sparkles: require('../../assets/game/decoration/sparkles.png') as ImageSourcePropType,
  confetti: require('../../assets/game/decoration/confetti.png') as ImageSourcePropType,
  clouds: require('../../assets/game/decoration/clouds.png') as ImageSourcePropType,
  blobs: require('../../assets/game/decoration/blobs.png') as ImageSourcePropType,
  rays: require('../../assets/game/decoration/rays.png') as ImageSourcePropType,
  plants: require('../../assets/game/decoration/plants.png') as ImageSourcePropType,
};
