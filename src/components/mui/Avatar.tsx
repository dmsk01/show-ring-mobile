/**
 * `Avatar` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `src` (image URL) → Paper `Avatar.Image` with `{ uri: src }`.
 *  - `children` (string initials) → Paper `Avatar.Text`.
 *  - `icon` (IconSource) → Paper `Avatar.Icon`.
 *  - `variant`: `'circular'` (default) | `'rounded'` | `'square'`.
 *  - `size`: number (px) — MUI uses `sx={{ width, height }}`, we expose a prop.
 *  - `alt` is accepted but maps to `accessibilityLabel` (RN has no img alt).
 *  - `color`: palette key — tints `Avatar.Text` / `Avatar.Icon` background.
 */

import { useTheme } from 'src/theme';
import { Avatar as PaperAvatar } from 'react-native-paper';

import type { JSX, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { IconSource, SxProp, AdapterColor } from './types';

// ----------------------------------------------------------------------

export type AvatarVariant = 'circular' | 'rounded' | 'square';

export type AvatarProps = {
  src?: string;
  alt?: string;
  icon?: IconSource;
  color?: Exclude<AdapterColor, 'inherit'>;
  variant?: AvatarVariant;
  size?: number;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
  children?: ReactNode;
};

const DEFAULT_SIZE = 40;

export function Avatar({
  src,
  alt,
  icon,
  color = 'primary',
  variant = 'circular',
  size = DEFAULT_SIZE,
  testID,
  style,
  sx,
  children,
}: AvatarProps): JSX.Element {
  const { theme } = useTheme();
  const tint = theme.palette[color];

  const borderRadius =
    variant === 'circular' ? size / 2 : variant === 'rounded' ? theme.spacing(1) : 0;
  const wrapperStyle: StyleProp<ViewStyle> = [{ borderRadius, overflow: 'hidden' }, style, sx];

  if (src) {
    return (
      <PaperAvatar.Image
        source={{ uri: src }}
        size={size}
        accessibilityLabel={alt}
        testID={testID}
        style={wrapperStyle}
      />
    );
  }
  if (icon) {
    return (
      <PaperAvatar.Icon
        icon={icon}
        size={size}
        color={tint.contrastText}
        style={[{ backgroundColor: tint.main }, wrapperStyle]}
        testID={testID}
      />
    );
  }
  return (
    <PaperAvatar.Text
      label={typeof children === 'string' ? children : (alt ?? '?').slice(0, 2).toUpperCase()}
      size={size}
      color={tint.contrastText}
      style={[{ backgroundColor: tint.main }, wrapperStyle]}
      testID={testID}
    />
  );
}

Avatar.displayName = 'Avatar';
