/**
 * `Divider` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `orientation`: 'horizontal' | 'vertical'.
 *  - `flexItem`: ignored on RN (no need — flex containers just work).
 *  - `sx`: flat RN style object.
 */

import { useMemo } from 'react';
import { useTheme } from 'src/theme';
import { StyleSheet, View } from 'react-native';

import type { JSX } from 'react';
import type { SxProp } from './types';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type DividerProps = ViewProps & {
  orientation?: 'horizontal' | 'vertical';
  sx?: SxProp;
};

export function Divider({
  orientation = 'horizontal',
  style,
  sx,
  ...rest
}: DividerProps): JSX.Element {
  const { theme } = useTheme();

  const dividerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      orientation === 'horizontal'
        ? { height: StyleSheet.hairlineWidth, alignSelf: 'stretch' }
        : { width: StyleSheet.hairlineWidth, alignSelf: 'stretch' },
      { backgroundColor: theme.palette.divider },
      style,
      sx,
    ],
    [orientation, theme, style, sx]
  );

  return <View style={dividerStyle} {...rest} />;
}

Divider.displayName = 'Divider';
