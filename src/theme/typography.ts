export type FontWeightToken = '400' | '500' | '600' | '700';

// Poppins ships one font file per weight (loaded in App.tsx via useFonts), so
// components set `fontFamily` — not `fontWeight` — to pick a weight. Android in
// particular ignores `fontWeight` on a custom-named font and always renders the
// family's own default weight, so mixing the two silently produces the wrong look.
const POPPINS_FAMILY_BY_WEIGHT: Record<FontWeightToken, string> = {
  '400': 'Poppins_400Regular',
  '500': 'Poppins_500Medium',
  '600': 'Poppins_600SemiBold',
  '700': 'Poppins_700Bold',
};

export interface TextStyleToken {
  fontSize: number;
  fontWeight: FontWeightToken;
  fontFamily: string;
  lineHeight: number;
}

function textStyle(fontSize: number, fontWeight: FontWeightToken, lineHeight: number): TextStyleToken {
  return { fontSize, fontWeight, fontFamily: POPPINS_FAMILY_BY_WEIGHT[fontWeight], lineHeight };
}

// Matches the reference design system's exact scale: H1/Display 32/40 Bold,
// H2/Title 24/32 SemiBold, H3/Heading 18/24 SemiBold, Body 16/24 Regular,
// Caption 12/16 Regular, Stats/Numbers 20/28 Bold (tabular).
export const typography = {
  display: textStyle(32, '700', 40),
  title: textStyle(24, '600', 32),
  heading: textStyle(18, '600', 24),
  body: textStyle(16, '400', 24),
  caption: textStyle(12, '400', 16),
  stat: textStyle(20, '700', 28),
};
