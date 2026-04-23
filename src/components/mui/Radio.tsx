/**
 * `Radio` + `RadioGroup` — MUI-compatible drop-ins.
 *
 * MUI parity:
 *  - `Radio`: `checked`, `value`, `onChange(value)`, `color`, `disabled`.
 *    When used inside a `RadioGroup`, `checked`/`onChange` are inferred from the
 *    group — individual Radio components just declare their `value`.
 *  - `RadioGroup`: `value`, `onChange(value)`, `children`.
 *  - Paper's `RadioButton.Group` handles the wiring; we re-export under MUI names.
 *  - `size`, `icon`, `checkedIcon`: NOT supported.
 */

import { useTheme } from 'src/theme';
import { RadioButton as PaperRadio } from 'react-native-paper';

import type { JSX, ReactNode } from 'react';
import type { SxProp, AdapterColor } from './types';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type RadioProps = {
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  color?: Exclude<AdapterColor, 'inherit'>;
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

export function Radio({
  value,
  checked,
  onChange,
  color = 'primary',
  disabled,
  testID,
}: RadioProps): JSX.Element {
  const { theme } = useTheme();
  // If rendered inside `<RadioGroup>`, Paper's group owns the status — we still
  // pass `status` for standalone use.
  const status = checked ? 'checked' : 'unchecked';
  return (
    <PaperRadio
      value={value}
      status={checked === undefined ? undefined : status}
      onPress={() => onChange?.(value)}
      color={theme.palette[color].main}
      disabled={disabled}
      testID={testID}
    />
  );
}

Radio.displayName = 'Radio';

// ----------------------------------------------------------------------

export type RadioGroupProps = {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
};

export function RadioGroup({ value, onChange, children }: RadioGroupProps): JSX.Element {
  return (
    <PaperRadio.Group value={value} onValueChange={onChange}>
      {children}
    </PaperRadio.Group>
  );
}

RadioGroup.displayName = 'RadioGroup';
