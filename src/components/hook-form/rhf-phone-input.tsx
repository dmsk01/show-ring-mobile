/**
 * `RHFPhoneInput` — Controller-backed phone number field.
 *
 * Divergence from web: web wraps `react-phone-number-input` with a country
 * code selector and flag popover. Mobile uses a plain `TextField` with
 * `type="tel"` (→ `keyboardType: "phone-pad"`). Country code selection can
 * be added later via a separate component if needed.
 */

import { TextField } from 'src/components/mui';
import { Controller, useFormContext } from 'react-hook-form';

import type { JSX } from 'react';
import type { TextFieldProps } from 'src/components/mui';

// ----------------------------------------------------------------------

export type RHFPhoneInputProps = Omit<TextFieldProps, 'value' | 'onChange' | 'onBlur' | 'error'> & {
  name: string;
};

export function RHFPhoneInput({ name, helperText, ...other }: RHFPhoneInputProps): JSX.Element {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...other}
          type="tel"
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={Boolean(error)}
          helperText={error?.message ?? helperText}
        />
      )}
    />
  );
}

RHFPhoneInput.displayName = 'RHFPhoneInput';
