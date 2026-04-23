/**
 * Breakpoint tokens mirroring MUI's default values.
 * On RN these are resolved against `useWindowDimensions().width` rather than
 * CSS media queries — see `src/theme/hooks/use-responsive.ts`.
 */

export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const breakpoints: Record<BreakpointKey, number> = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

export const breakpointKeys: readonly BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
