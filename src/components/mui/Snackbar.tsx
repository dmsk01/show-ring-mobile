/**
 * `Snackbar` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `open` ↔ Paper `visible`.
 *  - `onClose` ↔ Paper `onDismiss`.
 *  - `message` ↔ children.
 *  - `autoHideDuration` (ms) ↔ Paper `duration`.
 *  - `action`: `{ label, onPress }` — mapped to Paper `action`.
 *  - `anchorOrigin`, `TransitionComponent`: NOT supported.
 *    The `burnt` library (native toasts) is preferred for most use cases —
 *    this adapter exists so MUI code ports cleanly.
 */

import { Snackbar as PaperSnackbar } from 'react-native-paper';

import type { SxProp } from './types';
import type { JSX, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type SnackbarAction = {
  label: string;
  onPress: () => void;
};

export type SnackbarProps = {
  open: boolean;
  onClose: () => void;
  message?: ReactNode;
  /** Auto-hide duration in ms. MUI default is 6000. */
  autoHideDuration?: number;
  action?: SnackbarAction;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
  children?: ReactNode;
};

export function Snackbar({
  open,
  onClose,
  message,
  autoHideDuration = 6000,
  action,
  testID,
  style,
  sx,
  children,
}: SnackbarProps): JSX.Element {
  return (
    <PaperSnackbar
      visible={open}
      onDismiss={onClose}
      duration={autoHideDuration}
      action={action}
      testID={testID}
      style={[style, sx]}
    >
      {children ?? message}
    </PaperSnackbar>
  );
}

Snackbar.displayName = 'Snackbar';
