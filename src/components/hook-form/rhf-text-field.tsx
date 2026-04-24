/**
 * `RHFTextField` — `Controller`-backed wrapper around the MUI adapter
 * `TextField`. Mirrors web's `src/components/hook-form/rhf-text-field.tsx` so
 * section code ports with zero API changes.
 *
 * Divergence from web:
 *  - The adapter's `onChange` receives the raw string (not a SyntheticEvent),
 *    so the `transformValueOnChange` pipeline from `minimal-shared` is not
 *    required here. Number coercion is handled inline to avoid pulling a
 *    web-only dep.
 *  - `slotProps` is not forwarded — the adapter does not accept it.
 */

import { TextField } from 'src/components/mui';
import { Controller, useFormContext } from 'react-hook-form';

import type { JSX } from 'react';
import type { TextFieldProps } from 'src/components/mui';

// ----------------------------------------------------------------------

export type RHFTextFieldProps = Omit<TextFieldProps, 'value' | 'onChange' | 'onBlur' | 'error'> & {
  name: string;
};

export function RHFTextField({
  name,
  helperText,
  type = 'text',
  ...other
}: RHFTextFieldProps): JSX.Element {
  const { control } = useFormContext();

  const isNumberType = type === 'number';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...other}
          type={type}
          value={field.value == null ? '' : String(field.value)}
          onChange={(text) => {
            if (isNumberType) {
              const trimmed = text.trim();
              field.onChange(trimmed === '' ? '' : Number(trimmed));
            } else {
              field.onChange(text);
            }
          }}
          onBlur={field.onBlur}
          error={Boolean(error)}
          helperText={error?.message ?? helperText}
        />
      )}
    />
  );
}

RHFTextField.displayName = 'RHFTextField';
