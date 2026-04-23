/**
 * Opacity tokens. Copied verbatim from `G:/Work/show-ring/src/theme/core/opacity.ts`.
 * Used as multipliers for palette channels when computing alpha-composited colors.
 *
 * @see docs/plans/2026-04-22-react-native-port-plan.md §4.1.2
 */

export type Opacity = {
  // system
  switchTrack: number;
  switchTrackDisabled: number;
  inputPlaceholder: number;
  inputUnderline: number;
  // shape
  filled: {
    commonHoverBg: number;
  };
  outlined: {
    border: number;
  };
  soft: {
    bg: number;
    hoverBg: number;
    commonBg: number;
    commonHoverBg: number;
    border: number;
  };
};

export const opacity: Opacity = {
  switchTrack: 1,
  switchTrackDisabled: 0.48,
  inputPlaceholder: 1,
  inputUnderline: 0.32,
  filled: {
    commonHoverBg: 0.72,
  },
  outlined: {
    border: 0.48,
  },
  soft: {
    bg: 0.16,
    hoverBg: 0.32,
    commonBg: 0.08,
    commonHoverBg: 0.16,
    border: 0.24,
  },
};
