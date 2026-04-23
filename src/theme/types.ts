import type { Opacity } from './core/opacity';
import type { Shadows } from './core/shadows';
import type { Typography } from './core/typography';
import type { BreakpointKey } from './core/breakpoints';
import type { Palette, PaletteMode } from './core/palette';
import type { CustomShadows } from './core/custom-shadows';

/**
 * Resolved app theme object — what `useTheme()` returns.
 */
export type AppTheme = {
  mode: PaletteMode;
  palette: Palette;
  typography: Typography;
  shadows: Shadows;
  customShadows: CustomShadows;
  opacity: Opacity;
  spacing: (n: number) => number;
  breakpoints: Record<BreakpointKey, number>;
};

export type { PaletteMode, BreakpointKey };
