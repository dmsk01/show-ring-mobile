/**
 * Theme provider — wraps `PaperProvider`, exposes mode toggle, persists mode via MMKV.
 * Consumers read the resolved theme with `useTheme()` from `./hooks/use-theme`.
 *
 * @see docs/plans/2026-04-22-react-native-port-plan.md §4.1.2
 */

import { storage } from 'src/lib/storage';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { createAppTheme, createPaperTheme } from './create-theme';

import type { AppTheme } from './types';
import type { ReactNode, JSX } from 'react';
import type { PaletteMode } from './core/palette';

// ----------------------------------------------------------------------

const MODE_STORAGE_KEY = 'theme-mode';

export type ThemeMode = PaletteMode | 'system';

export type ThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
  resolvedMode: PaletteMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

// ----------------------------------------------------------------------

function readStoredMode(): ThemeMode {
  const raw = storage.getItem(MODE_STORAGE_KEY);
  if (raw === 'light' || raw === 'dark' || raw === 'system') {
    return raw;
  }
  return 'system';
}

// ----------------------------------------------------------------------

export type ThemeProviderProps = {
  children: ReactNode;
  /** Override default `'system'` startup mode (e.g. for Storybook). */
  defaultMode?: ThemeMode;
};

export function ThemeProvider({ children, defaultMode }: ThemeProviderProps): JSX.Element {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(() => defaultMode ?? readStoredMode());

  const resolvedMode: PaletteMode = useMemo(() => {
    if (mode === 'system') return systemScheme === 'dark' ? 'dark' : 'light';
    return mode;
  }, [mode, systemScheme]);

  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode]);
  const paperTheme = useMemo(() => createPaperTheme(theme), [theme]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    storage.setItem(MODE_STORAGE_KEY, next);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      storage.setItem(MODE_STORAGE_KEY, next);
      return next;
    });
  }, []);

  // Keep persisted value in sync if an external tool seeded it after mount.
  useEffect(() => {
    const stored = storage.getItem(MODE_STORAGE_KEY);
    if (
      stored &&
      stored !== mode &&
      (stored === 'light' || stored === 'dark' || stored === 'system')
    ) {
      setModeState(stored);
    }
    // Mount-only sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, mode, resolvedMode, setMode, toggleMode }),
    [theme, mode, resolvedMode, setMode, toggleMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}
