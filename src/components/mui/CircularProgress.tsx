/**
 * `CircularProgress` — MUI-compatible drop-in for indeterminate spinners.
 *
 * MUI parity:
 *  - `size`: number (px) or MUI `'small' | 'medium' | 'large'` → Paper size.
 *  - `color`: palette key (default `primary`) or `'inherit'` (= `text.primary`).
 *  - `thickness`, `value`, `variant='determinate'`: NOT supported — Paper's
 *    ActivityIndicator is indeterminate only. For determinate progress use
 *    `LinearProgress`.
 *  - `sx`.
 */

import { useTheme } from 'src/theme';
import { ActivityIndicator } from 'react-native-paper';

import type { JSX } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SxProp, AdapterColor, AdapterSize } from './types';

// ----------------------------------------------------------------------

const SIZE_PX: Record<AdapterSize, number> = {
  small: 20,
  medium: 28,
  large: 40,
};

export type CircularProgressProps = {
  size?: number | AdapterSize;
  color?: AdapterColor;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

export function CircularProgress({
  size = 'medium',
  color = 'primary',
  testID,
  style,
  sx,
}: CircularProgressProps): JSX.Element {
  const { theme } = useTheme();
  const tint = color === 'inherit' ? theme.palette.text.primary : theme.palette[color].main;
  const px = typeof size === 'number' ? size : SIZE_PX[size];
  return <ActivityIndicator animating size={px} color={tint} testID={testID} style={[style, sx]} />;
}

CircularProgress.displayName = 'CircularProgress';
