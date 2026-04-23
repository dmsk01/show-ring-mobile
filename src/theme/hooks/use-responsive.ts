/**
 * RN replacement for MUI's `useMediaQuery` / responsive font sizes.
 *
 * Backed by `useWindowDimensions()` and our `breakpoints` token table.
 * Example:
 *   const { up, down, between, width } = useResponsive();
 *   const isDesktop = up('md');
 */

import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { breakpoints } from '../core/breakpoints';

import type { BreakpointKey } from '../core/breakpoints';

// ----------------------------------------------------------------------

export type Responsive = {
  width: number;
  height: number;
  /** true if window width >= breakpoint. */
  up: (key: BreakpointKey) => boolean;
  /** true if window width < breakpoint. */
  down: (key: BreakpointKey) => boolean;
  /** true if window width in [start, end). */
  between: (start: BreakpointKey, end: BreakpointKey) => boolean;
  /** active breakpoint key (largest matching). */
  active: BreakpointKey;
};

const KEYS: readonly BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export function useResponsive(): Responsive {
  const { width, height } = useWindowDimensions();

  return useMemo<Responsive>(() => {
    const up = (key: BreakpointKey): boolean => width >= breakpoints[key];
    const down = (key: BreakpointKey): boolean => width < breakpoints[key];
    const between = (start: BreakpointKey, end: BreakpointKey): boolean =>
      width >= breakpoints[start] && width < breakpoints[end];

    let active: BreakpointKey = 'xs';
    for (const key of KEYS) {
      if (width >= breakpoints[key]) {
        active = key;
      }
    }

    return { width, height, up, down, between, active };
  }, [width, height]);
}

/**
 * Resolve a per-breakpoint size table to a single number based on current width.
 * Falls back through sm→md→lg→xl in ascending order.
 */
export function pickResponsive(
  base: number,
  overrides: Partial<Record<BreakpointKey, number>> | undefined,
  width: number
): number {
  if (!overrides) return base;
  let picked = base;
  for (const key of KEYS) {
    const value = overrides[key];
    if (value !== undefined && width >= breakpoints[key]) {
      picked = value;
    }
  }
  return picked;
}
