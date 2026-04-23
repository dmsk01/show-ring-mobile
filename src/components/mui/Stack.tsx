/**
 * `Stack` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `direction`: 'row' | 'column' | 'row-reverse' | 'column-reverse'.
 *  - `spacing`: numeric multiplier of the 8px base, matches MUI's `spacing(n)`.
 *  - `alignItems`, `justifyContent`: forwarded.
 *  - `divider`: NOT supported in Stage 1 (YAGNI; easy to add when needed).
 *  - `sx`: flat RN style object.
 */

import { useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from 'src/theme';

import type { SxProp } from './types';
import type { JSX, ReactNode } from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type StackDirection = NonNullable<ViewStyle['flexDirection']>;

export type StackProps = ViewProps & {
  direction?: StackDirection;
  /** Gap between children in 8px units (MUI spacing). Defaults to 0. */
  spacing?: number;
  alignItems?: ViewStyle['alignItems'];
  justifyContent?: ViewStyle['justifyContent'];
  sx?: SxProp;
  children?: ReactNode;
};

export function Stack({
  direction = 'column',
  spacing = 0,
  alignItems,
  justifyContent,
  style,
  sx,
  children,
  ...rest
}: StackProps): JSX.Element {
  const { theme } = useTheme();

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        flexDirection: direction,
        gap: spacing > 0 ? theme.spacing(spacing) : 0,
        alignItems,
        justifyContent,
      },
      style,
      sx,
    ],
    [direction, spacing, alignItems, justifyContent, style, sx, theme]
  );

  return (
    <View style={containerStyle} {...rest}>
      {children}
    </View>
  );
}

Stack.displayName = 'Stack';
