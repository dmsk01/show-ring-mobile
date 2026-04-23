/**
 * `Switch` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `checked` ↔ Paper `value`.
 *  - `onChange(checked: boolean)` — deviates from MUI's `(event, checked)`:
 *    RN gives only the new value, so we pass the boolean directly.
 *  - `color`: palette key (default `primary`).
 *  - `disabled`, `sx`.
 *  - `size`, `inputProps`: NOT supported (Paper's Switch has fixed size).
 */

import { useTheme } from 'src/theme';
import { Switch as PaperSwitch } from 'react-native-paper';

import type { JSX } from 'react';
import type { SxProp, AdapterColor } from './types';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type SwitchProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  color?: Exclude<AdapterColor, 'inherit'>;
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

export function Switch({
  checked,
  onChange,
  color = 'primary',
  disabled,
  testID,
  style,
  sx,
}: SwitchProps): JSX.Element {
  const { theme } = useTheme();

  return (
    <PaperSwitch
      value={!!checked}
      onValueChange={onChange}
      color={theme.palette[color].main}
      disabled={disabled}
      testID={testID}
      style={[style, sx]}
    />
  );
}

Switch.displayName = 'Switch';
