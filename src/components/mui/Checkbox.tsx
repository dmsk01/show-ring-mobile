/**
 * `Checkbox` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `checked` (bool) + `indeterminate` (bool) → Paper `status`.
 *  - `onChange(checked: boolean)` — RN gives only the new value.
 *  - `color`: palette key (default `primary`).
 *  - `disabled`, `sx`.
 *  - `size`, `icon`, `checkedIcon`: NOT supported — Paper's icon is fixed.
 */

import { View } from 'react-native';
import { useTheme } from 'src/theme';
import { Checkbox as PaperCheckbox } from 'react-native-paper';

import type { JSX } from 'react';
import type { SxProp, AdapterColor } from './types';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type CheckboxProps = {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  color?: Exclude<AdapterColor, 'inherit'>;
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

export function Checkbox({
  checked,
  indeterminate,
  onChange,
  color = 'primary',
  disabled,
  testID,
  style,
  sx,
}: CheckboxProps): JSX.Element {
  const { theme } = useTheme();
  const status: 'checked' | 'unchecked' | 'indeterminate' = indeterminate
    ? 'indeterminate'
    : checked
      ? 'checked'
      : 'unchecked';

  return (
    <View style={[style, sx]}>
      <PaperCheckbox
        status={status}
        onPress={() => onChange?.(!checked)}
        color={theme.palette[color].main}
        disabled={disabled}
        testID={testID}
      />
    </View>
  );
}

Checkbox.displayName = 'Checkbox';
