/**
 * Spacing helper. `sp(n) = n * 8` — mirrors MUI default spacing.
 * Always route raw spacing numbers through `sp()` per CLAUDE.md rule.
 */

export const SPACING_UNIT = 8;

export function sp(n: number): number {
  return n * SPACING_UNIT;
}
