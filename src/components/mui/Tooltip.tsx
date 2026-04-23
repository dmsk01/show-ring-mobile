/**
 * `Tooltip` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `title`: tooltip text (string only in this adapter — Paper's Tooltip takes
 *    `title: string`; ReactNode titles unsupported).
 *  - `children`: single anchor element (Paper requires a single child).
 *  - `placement`, `arrow`, `open`/`onOpen`/`onClose`: NOT supported.
 *    Paper triggers on long-press automatically.
 */

import { Tooltip as PaperTooltip } from 'react-native-paper';

import type { JSX, ReactElement } from 'react';

// ----------------------------------------------------------------------

export type TooltipProps = {
  title: string;
  enterTouchDelay?: number;
  leaveTouchDelay?: number;
  children: ReactElement;
};

export function Tooltip({
  title,
  enterTouchDelay,
  leaveTouchDelay,
  children,
}: TooltipProps): JSX.Element {
  return (
    <PaperTooltip title={title} enterTouchDelay={enterTouchDelay} leaveTouchDelay={leaveTouchDelay}>
      {children}
    </PaperTooltip>
  );
}

Tooltip.displayName = 'Tooltip';
