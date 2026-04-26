/**
 * `RHFAutocomplete` — Controller-backed wrapper over the MUI adapter
 * `Autocomplete`.
 *
 * Divergence from web: no `renderInput` override — the adapter owns the
 * TextField internally. Error/helper text rendered via `HelperText` below
 * the control (adapter's TextField doesn't accept `error`/`helperText`
 * externally).
 */

import { View } from 'react-native';
import { Autocomplete } from 'src/components/mui';
import { Controller, useFormContext } from 'react-hook-form';

import { HelperText } from './help-text';

import type { JSX, ReactNode } from 'react';
import type { AutocompleteProps } from 'src/components/mui';

// ----------------------------------------------------------------------

export type RHFAutocompleteProps<T> = Omit<AutocompleteProps<T>, 'value' | 'onChange'> & {
  name: string;
  helperText?: ReactNode;
};

export function RHFAutocomplete<T>({
  name,
  helperText,
  ...other
}: RHFAutocompleteProps<T>): JSX.Element {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <View>
          <Autocomplete
            {...other}
            value={field.value}
            onChange={(newValue) => setValue(name, newValue, { shouldValidate: true })}
          />
          <HelperText errorMessage={error?.message} helperText={helperText} />
        </View>
      )}
    />
  );
}

RHFAutocomplete.displayName = 'RHFAutocomplete';
