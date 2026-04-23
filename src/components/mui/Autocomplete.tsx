/**
 * `Autocomplete` — MUI-compatible drop-in (simplified for Stage 1).
 *
 * MUI parity:
 *  - `options`, `value`, `onChange(value | null)`.
 *  - `getOptionLabel(option)` — defaults to `String(option)`.
 *  - `isOptionEqualToValue(a, b)` — defaults to referential equality.
 *  - `label`, `placeholder`, `disabled`, `fullWidth`.
 *  - Composition: uses `TextField` + Paper `Menu` to show filtered results.
 *
 * Intentional omissions (YAGNI for Stage 1):
 *  - `multiple`, `freeSolo`, `groupBy`, `renderOption`, `renderTags`, `loading`
 *    spinner, chips for multi. Revisit when a section needs them.
 */

import { useMemo, useState } from 'react';
import { Menu } from 'react-native-paper';

import { TextField } from './TextField';

import type { JSX } from 'react';
import type { SxProp } from './types';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type AutocompleteProps<T> = {
  options: readonly T[];
  value: T | null;
  onChange: (value: T | null) => void;
  getOptionLabel?: (option: T) => string;
  isOptionEqualToValue?: (a: T, b: T) => boolean;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

export function Autocomplete<T>({
  options,
  value,
  onChange,
  getOptionLabel = (o) => String(o),
  label,
  placeholder,
  disabled,
  fullWidth,
  testID,
  style,
  sx,
}: AutocompleteProps<T>): JSX.Element {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>(() => (value !== null ? getOptionLabel(value) : ''));

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((o) => getOptionLabel(o).toLowerCase().includes(needle));
  }, [options, query, getOptionLabel]);

  return (
    <Menu
      visible={open}
      onDismiss={() => setOpen(false)}
      anchor={
        <TextField
          label={label}
          placeholder={placeholder}
          value={query}
          onChange={(text) => {
            setQuery(text);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          fullWidth={fullWidth}
          testID={testID}
          style={[style, sx]}
        />
      }
    >
      {filtered.map((option, i) => (
        <Menu.Item
          key={i}
          title={getOptionLabel(option)}
          onPress={() => {
            onChange(option);
            setQuery(getOptionLabel(option));
            setOpen(false);
          }}
        />
      ))}
    </Menu>
  );
}

Autocomplete.displayName = 'Autocomplete';
