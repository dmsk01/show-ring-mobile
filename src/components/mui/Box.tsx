/**
 * `Box` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `sx`: supported as a flat RN style object (no media queries).
 *  - `component`: NOT supported — RN has no polymorphic rendering.
 *  - all other props forwarded to the underlying `View`.
 */

import { View } from 'react-native';

import type { SxProp } from './types';
import type { JSX, ReactNode } from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

export type BoxProps = ViewProps & {
  sx?: SxProp;
  children?: ReactNode;
};

export function Box({ sx, style, children, ...rest }: BoxProps): JSX.Element {
  const merged: StyleProp<ViewStyle> = [style, sx];
  return (
    <View style={merged} {...rest}>
      {children}
    </View>
  );
}

Box.displayName = 'Box';
