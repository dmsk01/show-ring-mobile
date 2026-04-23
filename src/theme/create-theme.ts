/**
 * Combines palette + typography + shadows + spacing + breakpoints into a single
 * resolved `AppTheme` consumed by `useTheme()`. Also produces a thin
 * `react-native-paper` MD3 theme bridge so Paper primitives inherit our colors.
 *
 * @see docs/plans/2026-04-22-react-native-port-plan.md §4.1.2
 */

import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

import { sp } from './core/spacing';
import { opacity } from './core/opacity';
import { palette } from './core/palette';
import { shadows } from './core/shadows';
import { typography } from './core/typography';
import { breakpoints } from './core/breakpoints';
import { customShadows } from './core/custom-shadows';

import type { AppTheme } from './types';
import type { PaletteMode } from './core/palette';
import type { MD3Theme } from 'react-native-paper';

// ----------------------------------------------------------------------

export function createAppTheme(mode: PaletteMode): AppTheme {
  return {
    mode,
    palette: palette[mode],
    typography,
    shadows: shadows[mode],
    customShadows: customShadows[mode],
    opacity,
    spacing: sp,
    breakpoints,
  };
}

// ----------------------------------------------------------------------

/**
 * Build a Paper MD3 theme aligned with our palette. This lets Paper primitives
 * (`PaperButton`, `PaperTextInput`, etc.) pick up the right colors when adapter
 * components delegate to them.
 */
export function createPaperTheme(theme: AppTheme): MD3Theme {
  const base = theme.mode === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const { palette: p } = theme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: p.primary.main,
      onPrimary: p.primary.contrastText,
      primaryContainer: p.primary.lighter,
      onPrimaryContainer: p.primary.darker,
      secondary: p.secondary.main,
      onSecondary: p.secondary.contrastText,
      secondaryContainer: p.secondary.lighter,
      onSecondaryContainer: p.secondary.darker,
      tertiary: p.info.main,
      onTertiary: p.info.contrastText,
      error: p.error.main,
      onError: p.error.contrastText,
      background: p.background.default,
      onBackground: p.text.primary,
      surface: p.background.paper,
      onSurface: p.text.primary,
      surfaceVariant: p.background.neutral,
      onSurfaceVariant: p.text.secondary,
      outline: p.shared.inputOutlined,
      outlineVariant: p.divider,
    },
  };
}
