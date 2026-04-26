/**
 * `HelperText` — RN equivalent of web's MUI `FormHelperText` wrapper.
 *
 * Used by RHF wrappers (Switch, Checkbox, RadioGroup, Autocomplete) to render
 * validation errors or helper hints below the control.
 */

import { useTheme } from 'src/theme';
import { Typography } from 'src/components/mui';

import type { JSX, ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

// ----------------------------------------------------------------------

export type HelperTextProps = {
  errorMessage?: string;
  helperText?: ReactNode;
  disableGutters?: boolean;
  sx?: StyleProp<TextStyle>;
};

export function HelperText({
  sx,
  helperText,
  errorMessage,
  disableGutters = false,
}: HelperTextProps): JSX.Element | null {
  const { theme } = useTheme();
  const message = errorMessage ?? helperText;

  if (!message) return null;

  return (
    <Typography
      variant="caption"
      sx={[
        {
          color: errorMessage ? theme.palette.error.main : theme.palette.text.secondary,
          paddingHorizontal: disableGutters ? 0 : 12,
          marginTop: 4,
        },
        sx,
      ]}
    >
      {message}
    </Typography>
  );
}

HelperText.displayName = 'HelperText';
