/**
 * `RHFCountrySelect` — Controller-backed country picker.
 *
 * Divergence from web: web has a dedicated `CountrySelect` component with
 * flag icons and a custom popover. Mobile uses the MUI adapter `Autocomplete`
 * directly over the `countries` data set. Country labels are shown as plain
 * text (no flag icons — avoids a new dep). Can be enhanced later.
 */

import { View } from 'react-native';
import { countries } from 'src/assets/data';
import { useMemo, useCallback } from 'react';
import { Autocomplete } from 'src/components/mui';
import { Controller, useFormContext } from 'react-hook-form';

import { HelperText } from './help-text';

import type { JSX, ReactNode } from 'react';

// ----------------------------------------------------------------------

export type RHFCountrySelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: ReactNode;
};

export function RHFCountrySelect({
  name,
  label,
  placeholder,
  helperText,
}: RHFCountrySelectProps): JSX.Element {
  const { control, setValue } = useFormContext();

  const options = useMemo(() => countries.map((c) => c.label), []);

  const getOptionLabel = useCallback((option: string) => option, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <View>
          <Autocomplete
            options={options}
            value={field.value || null}
            onChange={(newValue) => setValue(name, newValue ?? '', { shouldValidate: true })}
            getOptionLabel={getOptionLabel}
            label={label}
            placeholder={placeholder}
          />
          <HelperText errorMessage={error?.message} helperText={helperText} />
        </View>
      )}
    />
  );
}

RHFCountrySelect.displayName = 'RHFCountrySelect';
