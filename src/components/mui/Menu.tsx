/**
 * `Menu` + `MenuItem` — MUI-compatible drop-ins.
 *
 * MUI parity:
 *  - `open`, `onClose`, `children`.
 *  - **Deviation:** MUI uses `anchorEl` (a DOM ref). RN has no DOM; Paper's Menu
 *    requires the anchor element as a `ReactNode`. Consumers pass the trigger
 *    via the `anchor` prop here.
 *  - `MenuItem`: `onClick`, `disabled`, `children` (used as `title`). MUI also
 *    supports `selected` and complex children — for MVP we take the string
 *    content of children and forward it to Paper as `title`.
 */

import { Menu as PaperMenu } from 'react-native-paper';

import type { IconSource } from './types';
import type { JSX, ReactNode } from 'react';
import type { GestureResponderEvent } from 'react-native';

// ----------------------------------------------------------------------

export type MenuProps = {
  open: boolean;
  onClose: () => void;
  /** Trigger element — RN deviation from MUI's DOM-based `anchorEl`. */
  anchor: ReactNode;
  testID?: string;
  children?: ReactNode;
};

export function Menu({ open, onClose, anchor, testID, children }: MenuProps): JSX.Element {
  return (
    <PaperMenu visible={open} onDismiss={onClose} anchor={anchor} testID={testID}>
      {children}
    </PaperMenu>
  );
}

Menu.displayName = 'Menu';

// ----------------------------------------------------------------------

export type MenuItemProps = {
  children: string;
  onClick?: (event: GestureResponderEvent) => void;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  leadingIcon?: IconSource;
  trailingIcon?: IconSource;
  testID?: string;
};

export function MenuItem({
  children,
  onClick,
  onPress,
  disabled,
  leadingIcon,
  trailingIcon,
  testID,
}: MenuItemProps): JSX.Element {
  return (
    <PaperMenu.Item
      title={children}
      onPress={onClick ?? onPress}
      disabled={disabled}
      leadingIcon={leadingIcon}
      trailingIcon={trailingIcon}
      testID={testID}
    />
  );
}

MenuItem.displayName = 'MenuItem';
