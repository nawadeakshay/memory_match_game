import { Switch } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  disabled?: boolean;
}

// Built on React Native's own Switch rather than a custom animated control —
// it already gives native platform behavior and accessibility for free.
export function Toggle({ value, onValueChange, accessibilityLabel, disabled }: ToggleProps) {
  const { colors } = useTheme();

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      trackColor={{ false: colors.border, true: colors.accent }}
      thumbColor={colors.background}
      ios_backgroundColor={colors.border}
    />
  );
}
