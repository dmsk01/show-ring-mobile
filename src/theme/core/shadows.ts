/**
 * MUI shadow levels (0..24) → React Native shadow props.
 *
 * RN shadows are very different from CSS box-shadow:
 *  - iOS uses `shadowColor/Offset/Opacity/Radius`.
 *  - Android uses `elevation` (no offset/spread control).
 *
 * We pick sensible per-level mappings that approximate MUI depth visually.
 * Color mode drives the base shadow hue (light mode = grey 500 tint,
 * dark mode = pure black — same as the web project).
 */

import { grey, common, varAlpha } from './palette';

import type { PaletteMode } from './palette';

// ----------------------------------------------------------------------

export type RNShadow = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export type ShadowLevel =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24;

export type Shadows = Record<ShadowLevel, RNShadow>;

// ----------------------------------------------------------------------

const NONE: RNShadow = {
  shadowColor: 'transparent',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0,
};

function createShadows(colorChannel: string): Shadows {
  const result: Partial<Shadows> = { 0: NONE };
  const shadowColor = varAlpha(colorChannel, 1);
  for (let level = 1; level <= 24; level++) {
    const offsetY = Math.max(1, Math.round(level * 0.5));
    const radius = Math.max(2, Math.round(level * 0.7));
    result[level as ShadowLevel] = {
      shadowColor,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: 0.16,
      shadowRadius: radius,
      elevation: level,
    };
  }
  return result as Shadows;
}

// ----------------------------------------------------------------------

export const shadows: Record<PaletteMode, Shadows> = {
  light: createShadows(grey['500Channel']),
  dark: createShadows(common.blackChannel),
};
