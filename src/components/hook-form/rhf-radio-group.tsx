/**
 * `RHFRadioGroup` — Controller-backed wrapper over the MUI adapter
 * `RadioGroup` + `Radio`.
 *
 * Divergence from web: no `FormControl` / `FormControlLabel` — uses
 * adapter `RadioGroup` (Paper's `RadioButton.Group`) directly with
 * inline labels rendered as `Typography`.
 */

import { View, StyleSheet } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { Radio, RadioGroup, Typography } from 'src/components/mui';

import { HelperText } from './help-text';

import type { JSX, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type RHFRadioGroupProps = {
  name: string;
  label?: string;
  options: { label: string; value: string }[];
  helperText?: ReactNode;
  row?: boolean;
  sx?: StyleProp<ViewStyle>;
};

export function RHFRadioGroup({
  name,
  label,
  options,
  helperText,
  row,
  sx,
}: RHFRadioGroupProps): JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <View style={sx}>
          {label && (
            <Typography variant="body2" sx={{ marginBottom: 8 }}>
              {label}
            </Typography>
          )}
          <RadioGroup value={field.value} onChange={field.onChange}>
            <View style={row ? styles.rowLayout : undefined}>
              {options.map((option) => (
                <View key={option.value} style={row ? styles.optionRow : styles.optionColumn}>
                  <Radio value={option.value} />
                  <Typography variant="body2" sx={{ marginLeft: 4 }}>
                    {option.label}
                  </Typography>
                </View>
              ))}
            </View>
          </RadioGroup>
          <HelperText disableGutters errorMessage={error?.message} helperText={helperText} />
        </View>
      )}
    />
  );
}

RHFRadioGroup.displayName = 'RHFRadioGroup';

const styles = StyleSheet.create({
  rowLayout: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionRow: { flexDirection: 'row', alignItems: 'center' },
  optionColumn: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
});
