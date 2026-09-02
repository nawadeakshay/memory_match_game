export interface ColorTokens {
  background: string;
  surface: string;
  card: string;
  /** The memory card's hidden-side color — fixed dark navy in both themes, per the reference. */
  cardBack: string;
  cardBackSymbol: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textOnAccent: string;
  accent: string;
  accentSoft: string;
  accentYellow: string;
  accentOrange: string;
  success: string;
  successSoft: string;
  mismatch: string;
  mismatchSoft: string;
  info: string;
  infoSoft: string;
  overlay: string;
}

export const lightColors: ColorTokens = {
  background: '#FAF6EF',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  cardBack: '#1C1F3A',
  cardBackSymbol: 'rgba(255, 255, 255, 0.35)',
  border: '#E7E7EB',
  textPrimary: '#1C1026',
  textSecondary: '#6B7280',
  textOnAccent: '#FFFFFF',
  accent: '#6F5AF7',
  accentSoft: '#EFECFF',
  accentYellow: '#FFC94D',
  accentOrange: '#FF8A3D',
  success: '#22CC5E',
  successSoft: '#E7F9EE',
  mismatch: '#FF5A5F',
  mismatchSoft: '#FFEBEC',
  info: '#3B82F6',
  infoSoft: '#E9F0FF',
  overlay: 'rgba(28, 16, 38, 0.5)',
};

export const darkColors: ColorTokens = {
  background: '#0F1220',
  surface: '#1A1E34',
  card: '#1E2340',
  cardBack: '#151833',
  cardBackSymbol: 'rgba(255, 255, 255, 0.25)',
  border: '#2A2E45',
  textPrimary: '#F5F4FF',
  textSecondary: '#9498A8',
  textOnAccent: '#FFFFFF',
  accent: '#8F7FFF',
  accentSoft: '#2A2450',
  accentYellow: '#FFC94D',
  accentOrange: '#FF8A3D',
  success: '#3ADD78',
  successSoft: '#173324',
  mismatch: '#FF6B70',
  mismatchSoft: '#3A2024',
  info: '#5C9BFF',
  infoSoft: '#1C2740',
  overlay: 'rgba(0, 0, 0, 0.65)',
};
