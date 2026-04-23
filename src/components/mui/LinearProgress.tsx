/**
 * `LinearProgress` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `variant`: `'determinate'` (needs `value`) | `'indeterminate'` (default).
 *  - `value`: 0..100, MUI percent scale (Paper wants 0..1 — we divide here).
 *  - `color`: palette key (default `primary`).
 *  - `sx`.
 *  - `valueBuffer`, `buffer` variants: NOT supported.
 */

import { useTheme } from 'src/theme';
import { ProgressBar } from 'react-native-paper';

import type { JSX } from 'react';
import type { SxProp, AdapterColor } from './types';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type LinearProgressProps = {
  variant?: 'determinate' | 'indeterminate';
  /** MUI scale: 0..100. Ignored when `variant === 'indeterminate'`. */
  value?: number;
  color?: Exclude<AdapterColor, 'inherit'>;
  visible?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

export function LinearProgress({
  variant = 'indeterminate',
  value,
  color = 'primary',
  visible = true,
  testID,
  style,
  sx,
}: LinearProgressProps): JSX.Element {
  const { theme } = useTheme();
  const isIndeterminate = variant === 'indeterminate';
  const progress = isIndeterminate ? undefined : Math.max(0, Math.min(100, value ?? 0)) / 100;

  return (
    <ProgressBar
      indeterminate={isIndeterminate}
      progress={progress}
      color={theme.palette[color].main}
      visible={visible}
      testID={testID}
      style={[style, sx]}
    />
  );
}

LinearProgress.displayName = 'LinearProgress';
