/**
 * `Typography` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `variant`: all theme variants (h1…h6, subtitle1/2, body1/2, caption, overline, button).
 *  - `color`: palette key ('primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error')
 *            or 'inherit' (= primary text).
 *  - `align`: maps to RN `textAlign`.
 *  - `gutterBottom`: adds a bottom margin of `spacing(1)` — MUI semantics.
 *  - `noWrap`: maps to `numberOfLines={1}` + ellipsis.
 *  - `sx`: flat RN style object.
 */

import { useMemo } from 'react';
import { Text } from 'react-native';
import { useResponsive, useTheme, pickResponsive } from 'src/theme';

import type { JSX, ReactNode } from 'react';
import type { SxProp, AdapterColor } from './types';
import type { TypographyVariantKey } from 'src/theme';
import type { StyleProp, TextProps, TextStyle } from 'react-native';

// ----------------------------------------------------------------------

export type TypographyProps = Omit<TextProps, 'numberOfLines'> & {
  variant?: TypographyVariantKey;
  color?: AdapterColor;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  gutterBottom?: boolean;
  noWrap?: boolean;
  sx?: SxProp<TextStyle>;
  children?: ReactNode;
};

export function Typography({
  variant = 'body1',
  color = 'inherit',
  align,
  gutterBottom,
  noWrap,
  style,
  sx,
  children,
  ...rest
}: TypographyProps): JSX.Element {
  const { theme } = useTheme();
  const { width } = useResponsive();

  const resolvedStyle = useMemo<StyleProp<TextStyle>>(() => {
    const variantTokens = theme.typography[variant];
    const fontSize = pickResponsive(
      variantTokens.fontSize,
      variantTokens.responsiveFontSizes,
      width
    );
    const textColor = color === 'inherit' ? theme.palette.text.primary : theme.palette[color].main;

    const base: TextStyle = {
      fontFamily: variantTokens.fontFamily,
      fontWeight: variantTokens.fontWeight,
      fontSize,
      lineHeight: fontSize * variantTokens.lineHeight,
      textTransform: variantTokens.textTransform,
      color: textColor,
      textAlign: align,
      marginBottom: gutterBottom ? theme.spacing(1) : 0,
    };
    return [base, style, sx];
  }, [theme, width, variant, color, align, gutterBottom, style, sx]);

  return (
    <Text
      style={resolvedStyle}
      numberOfLines={noWrap ? 1 : undefined}
      ellipsizeMode={noWrap ? 'tail' : undefined}
      {...rest}
    >
      {children}
    </Text>
  );
}

Typography.displayName = 'Typography';
