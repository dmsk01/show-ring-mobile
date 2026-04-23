/**
 * `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions` — MUI-compatible drop-ins.
 *
 * MUI parity:
 *  - `Dialog`: `open`, `onClose`, `children`. Wraps Paper `<Portal><Dialog/>`.
 *    `fullWidth`, `maxWidth`, `fullScreen`, `TransitionComponent`: NOT supported.
 *  - `DialogTitle`: children (string) → Paper `Dialog.Title`.
 *  - `DialogContent`: children → Paper `Dialog.Content`.
 *  - `DialogActions`: children → Paper `Dialog.Actions`.
 */

import { Dialog as PaperDialog, Portal } from 'react-native-paper';

import type { SxProp } from './types';
import type { JSX, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
  children?: ReactNode;
};

export function Dialog({ open, onClose, testID, style, sx, children }: DialogProps): JSX.Element {
  return (
    <Portal>
      <PaperDialog visible={open} onDismiss={onClose} testID={testID} style={[style, sx]}>
        {children}
      </PaperDialog>
    </Portal>
  );
}

Dialog.displayName = 'Dialog';

// ----------------------------------------------------------------------

export type DialogTitleProps = { children?: ReactNode };

export function DialogTitle({ children }: DialogTitleProps): JSX.Element {
  return <PaperDialog.Title>{children}</PaperDialog.Title>;
}

DialogTitle.displayName = 'DialogTitle';

// ----------------------------------------------------------------------

export type DialogContentProps = { children?: ReactNode };

export function DialogContent({ children }: DialogContentProps): JSX.Element {
  return <PaperDialog.Content>{children}</PaperDialog.Content>;
}

DialogContent.displayName = 'DialogContent';

// ----------------------------------------------------------------------

export type DialogActionsProps = { children?: ReactNode };

export function DialogActions({ children }: DialogActionsProps): JSX.Element {
  return <PaperDialog.Actions>{children}</PaperDialog.Actions>;
}

DialogActions.displayName = 'DialogActions';
