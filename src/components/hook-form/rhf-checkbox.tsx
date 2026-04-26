/**
 * `RHFCheckbox` — Controller-backed wrapper over the MUI adapter `Checkbox`.
 *
 * Divergence from web: no `FormControlLabel` — label rendered as inline
 * `Typography`. No `slotProps` — flat `checkboxProps` instead.
 */

import { View, StyleSheet } from 'react-native';
import { Checkbox, Typography } from 'src/components/mui';
import { Controller, useFormContext } from 'react-hook-form';

import { HelperText } from './help-text';

import type { JSX, ReactNode } from 'react';
import type { CheckboxProps } from 'src/components/mui';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type RHFCheckboxProps = {
  name: string;
  label?: ReactNode;
  helperText?: ReactNode;
  sx?: StyleProp<ViewStyle>;
  checkboxProps?: Partial<CheckboxProps>;
};

export function RHFCheckbox({
  name,
  label,
  helperText,
  sx,
  checkboxProps,
}: RHFCheckboxProps): JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <View style={sx}>
          <View style={styles.row}>
            <Checkbox
              checked={field.value}
              onChange={(checked) => field.onChange(checked)}
              {...checkboxProps}
            />
            {typeof label === 'string' ? (
              <Typography variant="body2" sx={{ marginLeft: 4, flexShrink: 1 }}>
                {label}
              </Typography>
            ) : (
              label
            )}
          </View>
          <HelperText errorMessage={error?.message} helperText={helperText} />
        </View>
      )}
    />
  );
}

RHFCheckbox.displayName = 'RHFCheckbox';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
