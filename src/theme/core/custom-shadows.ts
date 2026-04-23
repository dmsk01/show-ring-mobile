/**
 * Custom shadow presets used across the web design system — ported to RN props.
 *
 * Web values (see `G:/Work/show-ring/src/theme/core/custom-shadows.ts`):
 *   z1  → `0 1px 2px 0 rgba(grey500, 0.16)`
 *   z4  → `0 4px 8px 0 rgba(grey500, 0.16)`
 *   …
 *   card → dual-layer shadow, dialog → large offset, dropdown → horizontal.
 *
 * RN cannot layer two box-shadows or apply negative spread, so the approximation
 * collapses each preset to a single `RNShadow` with the dominant offset/radius.
 */

import {
  grey,
  info,
  error,
  common,
  primary,
  success,
  warning,
  secondary,
  varAlpha,
} from './palette';

import type { RNShadow } from './shadows';
import type { PaletteMode } from './palette';

// ----------------------------------------------------------------------

export type CustomShadowKey =
  | 'z1'
  | 'z4'
  | 'z8'
  | 'z12'
  | 'z16'
  | 'z20'
  | 'z24'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'card'
  | 'dialog'
  | 'dropdown';

export type CustomShadows = Record<CustomShadowKey, RNShadow>;

// ----------------------------------------------------------------------

function shadow(
  colorChannel: string,
  alpha: number,
  offsetY: number,
  radius: number,
  elevation: number
): RNShadow {
  return {
    shadowColor: varAlpha(colorChannel, 1),
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: alpha,
    shadowRadius: radius,
    elevation,
  };
}

function colorShadow(mainChannel: string): RNShadow {
  // web: `0 8px 16px 0 rgba(color, 0.24)`
  return shadow(mainChannel, 0.24, 8, 16, 8);
}

function createCustomShadows(colorChannel: string): CustomShadows {
  return {
    z1: shadow(colorChannel, 0.16, 1, 2, 1),
    z4: shadow(colorChannel, 0.16, 4, 8, 4),
    z8: shadow(colorChannel, 0.16, 8, 16, 8),
    z12: shadow(colorChannel, 0.16, 12, 24, 12),
    z16: shadow(colorChannel, 0.16, 16, 32, 16),
    z20: shadow(colorChannel, 0.16, 20, 40, 20),
    z24: shadow(colorChannel, 0.16, 24, 48, 24),

    dialog: shadow(common.blackChannel, 0.24, 40, 80, 24),
    // Web card: two layers `0 0 2px rgba(.2)` + `0 12px 24px -4px rgba(.12)`.
    // On RN we keep the dominant layer.
    card: shadow(colorChannel, 0.12, 12, 24, 12),
    // Web dropdown: `0 0 2px rgba(.24)` + `-20px 20px 40px -4px rgba(.24)`.
    dropdown: shadow(colorChannel, 0.24, 20, 40, 16),

    primary: colorShadow(primary.mainChannel),
    secondary: colorShadow(secondary.mainChannel),
    info: colorShadow(info.mainChannel),
    success: colorShadow(success.mainChannel),
    warning: colorShadow(warning.mainChannel),
    error: colorShadow(error.mainChannel),
  };
}

// ----------------------------------------------------------------------

export const customShadows: Record<PaletteMode, CustomShadows> = {
  light: createCustomShadows(grey['500Channel']),
  dark: createCustomShadows(common.blackChannel),
};
