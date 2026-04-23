/**
 * `Chip` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `label` — text content (string or ReactNode).
 *  - `variant`: `'filled'` (default) | `'outlined'` → Paper `mode`.
 *  - `color`: palette key or 'inherit' (= `text.primary`).
 *  - `size`: `'small' | 'medium'` — `small` maps to Paper `compact`.
 *    (MUI has no `large`; we accept `AdapterSize` but treat `large === medium`.)
 *  - `onClick` (aliased to `onPress`), `onDelete` (Paper `onClose`).
 *  - `icon`, `avatar`: Paper `IconSource` / ReactNode — handled via Paper props.
 *  - `disabled`, `selected`, `sx`.
 */

import { useTheme, varAlpha } from 'src/theme';
import { Chip as PaperChip } from 'react-native-paper';

import type { JSX, ReactNode } from 'react';
import type { IconSource, SxProp, AdapterColor, AdapterSize } from './types';
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type ChipProps = {
  label: ReactNode;
  variant?: 'filled' | 'outlined';
  color?: AdapterColor;
  size?: AdapterSize;
  disabled?: boolean;
  selected?: boolean;
  icon?: IconSource;
  avatar?: ReactNode;
  onClick?: (event: GestureResponderEvent) => void;
  onPress?: (event: GestureResponderEvent) => void;
  onDelete?: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

export function Chip({
  label,
  variant = 'filled',
  color = 'inherit',
  size = 'medium',
  disabled,
  selected,
  icon,
  avatar,
  onClick,
  onPress,
  onDelete,
  testID,
  style,
  sx,
}: ChipProps): JSX.Element {
  const { theme } = useTheme();

  const palette = color === 'inherit' ? null : theme.palette[color];
  const background = palette
    ? variant === 'filled'
      ? varAlpha(palette.mainChannel, theme.opacity.soft.bg)
      : 'transparent'
    : undefined;
  const textColor = palette
    ? variant === 'filled'
      ? palette.dark
      : palette.main
    : theme.palette.text.primary;

  return (
    <PaperChip
      mode={variant === 'outlined' ? 'outlined' : 'flat'}
      compact={size === 'small'}
      disabled={disabled}
      selected={selected}
      icon={icon}
      avatar={avatar}
      onPress={onClick ?? onPress}
      onClose={onDelete}
      textStyle={{ color: textColor }}
      style={[background ? { backgroundColor: background } : null, style, sx]}
      testID={testID}
    >
      {label}
    </PaperChip>
  );
}

Chip.displayName = 'Chip';
