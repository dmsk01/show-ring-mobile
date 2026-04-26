/**
 * `RHFSwitch` — Controller-backed wrapper over the MUI adapter `Switch`.
 *
 * Divergence from web: no `FormControlLabel` in RN — label is rendered as
 * inline `Typography` next to the Switch. `slotProps` simplified to flat
 * `switchProps`.
 */

import { View, StyleSheet } from 'react-native';
import { Switch, Typography } from 'src/components/mui';
import { Controller, useFormContext } from 'react-hook-form';

import { HelperText } from './help-text';

import type { JSX, ReactNode } from 'react';
import type { SwitchProps } from 'src/components/mui';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type RHFSwitchProps = {
  name: string;
  label?: ReactNode;
  helperText?: ReactNode;
  sx?: StyleProp<ViewStyle>;
  switchProps?: Partial<SwitchProps>;
};

export function RHFSwitch({
  name,
  label,
  helperText,
  sx,
  switchProps,
}: RHFSwitchProps): JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <View style={sx}>
          <View style={styles.row}>
            <Switch
              checked={field.value}
              onChange={(checked) => field.onChange(checked)}
              {...switchProps}
            />
            {typeof label === 'string' ? (
              <Typography variant="body2" sx={{ marginLeft: 8, flexShrink: 1 }}>
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

RHFSwitch.displayName = 'RHFSwitch';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
