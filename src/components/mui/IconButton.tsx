/**
 * `IconButton` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `color`: palette key or 'inherit' (= `text.primary`).
 *  - `size`: 'small' | 'medium' | 'large' → 20 / 24 / 28 px icon.
 *  - `disabled`, `onClick` (aliased to `onPress`).
 *  - `edge`: NOT supported — has no meaning on RN (no inline layout flow).
 *  - `sx`: flat RN style object.
 *  - `component`: NOT supported.
 *  - Icon supplied via the `icon` prop (Paper `IconSource`) — not children,
 *    matching how icons are provided in the rest of this adapter set.
 */

import { useTheme } from 'src/theme';
import { IconButton as PaperIconButton } from 'react-native-paper';

import type { JSX } from 'react';
import type { IconSource, SxProp, AdapterColor, AdapterSize } from './types';
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

const SIZE_PX: Record<AdapterSize, number> = {
  small: 20,
  medium: 24,
  large: 28,
};

export type IconButtonProps = {
  icon: IconSource;
  color?: AdapterColor;
  size?: AdapterSize;
  disabled?: boolean;
  selected?: boolean;
  onClick?: (event: GestureResponderEvent) => void;
  onPress?: (event: GestureResponderEvent) => void;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

export function IconButton({
  icon,
  color = 'inherit',
  size = 'medium',
  disabled,
  selected,
  onClick,
  onPress,
  accessibilityLabel,
  testID,
  style,
  sx,
}: IconButtonProps): JSX.Element {
  const { theme } = useTheme();
  const iconColor = color === 'inherit' ? theme.palette.text.primary : theme.palette[color].main;

  return (
    <PaperIconButton
      icon={icon}
      size={SIZE_PX[size]}
      iconColor={iconColor}
      disabled={disabled}
      selected={selected}
      onPress={onClick ?? onPress}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[style, sx]}
    />
  );
}

IconButton.displayName = 'IconButton';
