/**
 * Access the resolved `AppTheme` plus mode controls.
 * Always use this hook — never import theme tokens directly from `./core/*`
 * inside components, so that mode switches propagate correctly.
 */

import { useContext } from 'react';

import { ThemeContext } from '../theme-provider';

import type { ThemeContextValue } from '../theme-provider';

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
