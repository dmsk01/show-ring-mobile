/**
 * Typography tokens. Mirrors
 * `G:/Work/show-ring/src/theme/core/typography.ts` with two key deltas:
 *
 *  1. Sizes are plain numbers (px on RN) instead of `rem` strings — RN has no root font size.
 *  2. Responsive sizes are stored per-breakpoint as a map; apply via `useResponsive()`
 *     since RN has no CSS media queries.
 *
 * Font families reference names registered with `expo-font` in `app/_layout.tsx`.
 * The registered name MUST match the `fontFamily.primary` / `.secondary` strings here.
 */

import type { BreakpointKey } from './breakpoints';

// ----------------------------------------------------------------------

export type FontFamily = {
  primary: string;
  secondary: string;
};

export const fontFamily: FontFamily = {
  primary: 'PublicSans',
  secondary: 'Barlow',
};

export type FontWeight = 300 | 400 | 500 | 600 | 700 | 800;

export const fontWeight: Record<
  'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold',
  FontWeight
> = {
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
};

// ----------------------------------------------------------------------

export type TypographyVariantKey =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline'
  | 'button';

export type TypographyVariant = {
  fontFamily: string;
  fontWeight: FontWeight;
  /** Base font size in px. Equivalent to web `pxToRem(base)`. */
  fontSize: number;
  /** Unitless ratio, same as MUI. */
  lineHeight: number;
  /** RN equivalent of CSS `text-transform`. */
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Optional per-breakpoint size overrides — resolve via `useResponsive()`. */
  responsiveFontSizes?: Partial<Record<BreakpointKey, number>>;
};

export type Typography = {
  fontFamily: string;
  fontSecondaryFamily: string;
  fontWeightLight: FontWeight;
  fontWeightRegular: FontWeight;
  fontWeightMedium: FontWeight;
  fontWeightSemiBold: FontWeight;
  fontWeightBold: FontWeight;
  fontWeightExtraBold: FontWeight;
} & Record<TypographyVariantKey, TypographyVariant>;

// ----------------------------------------------------------------------

export const typography: Typography = {
  fontFamily: fontFamily.primary,
  fontSecondaryFamily: fontFamily.secondary,
  fontWeightLight: fontWeight.light,
  fontWeightRegular: fontWeight.regular,
  fontWeightMedium: fontWeight.medium,
  fontWeightSemiBold: fontWeight.semiBold,
  fontWeightBold: fontWeight.bold,
  fontWeightExtraBold: fontWeight.extraBold,
  h1: {
    fontFamily: fontFamily.secondary,
    fontWeight: fontWeight.extraBold,
    fontSize: 40,
    lineHeight: 80 / 64,
    responsiveFontSizes: { sm: 52, md: 58, lg: 64 },
  },
  h2: {
    fontFamily: fontFamily.secondary,
    fontWeight: fontWeight.extraBold,
    fontSize: 32,
    lineHeight: 64 / 48,
    responsiveFontSizes: { sm: 40, md: 44, lg: 48 },
  },
  h3: {
    fontFamily: fontFamily.secondary,
    fontWeight: fontWeight.bold,
    fontSize: 24,
    lineHeight: 1.5,
    responsiveFontSizes: { sm: 26, md: 30, lg: 32 },
  },
  h4: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeight.bold,
    fontSize: 20,
    lineHeight: 1.5,
    responsiveFontSizes: { md: 24 },
  },
  h5: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeight.bold,
    fontSize: 18,
    lineHeight: 1.5,
    responsiveFontSizes: { sm: 19 },
  },
  h6: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeight.semiBold,
    fontSize: 17,
    lineHeight: 28 / 18,
    responsiveFontSizes: { sm: 18 },
  },
  subtitle1: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeight.semiBold,
    fontSize: 16,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeight.semiBold,
    fontSize: 14,
    lineHeight: 22 / 14,
  },
  body1: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeight.regular,
    fontSize: 16,
    lineHeight: 1.5,
  },
  body2: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeight.regular,
    fontSize: 14,
    lineHeight: 22 / 14,
  },
  caption: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeight.regular,
    fontSize: 12,
    lineHeight: 1.5,
  },
  overline: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeight.bold,
    fontSize: 12,
    lineHeight: 1.5,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeight.bold,
    fontSize: 14,
    lineHeight: 24 / 14,
    textTransform: 'none',
  },
};
