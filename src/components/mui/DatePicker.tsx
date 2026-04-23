/**
 * `DatePicker` — MUI X DatePicker drop-in.
 *
 * MUI parity:
 *  - `value: Date | null`, `onChange(date)`.
 *  - `label`, `disabled`, `minDate`, `maxDate`.
 *
 * Stage 1 implementation:
 *  - Text-input based. Consumer types an ISO-ish date (`YYYY-MM-DD`); on blur
 *    we parse with `dayjs` and call `onChange` with a `Date` (or `null` if
 *    parsing fails). No calendar popup.
 *
 * TODO(stage-4): wire a native calendar UI. Two options to evaluate when we
 * port the sections that use `DatePicker`:
 *  - `react-native-paper-dates` (matches Paper's visual language, New Arch OK).
 *  - `@react-native-community/datetimepicker` (native OS picker).
 * Both are new deps → decide at Stage 4 with user sign-off.
 */

import dayjs from 'dayjs';
import { useState } from 'react';

import { TextField } from './TextField';

import type { JSX } from 'react';
import type { SxProp } from './types';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

const FORMAT = 'YYYY-MM-DD';

export type DatePickerProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  fullWidth?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

function format(date: Date | null): string {
  return date ? dayjs(date).format(FORMAT) : '';
}

export function DatePicker({
  value,
  onChange,
  label,
  disabled,
  minDate,
  maxDate,
  fullWidth,
  testID,
  style,
  sx,
}: DatePickerProps): JSX.Element {
  const [draft, setDraft] = useState(() => format(value));

  const commit = (): void => {
    const text = draft.trim();
    if (!text) {
      onChange(null);
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      setDraft(format(value));
      return;
    }
    const parsed = dayjs(text);
    if (!parsed.isValid()) {
      setDraft(format(value));
      return;
    }
    let next = parsed.toDate();
    if (minDate && next < minDate) next = minDate;
    if (maxDate && next > maxDate) next = maxDate;
    onChange(next);
    setDraft(format(next));
  };

  return (
    <TextField
      label={label ?? 'Date'}
      value={draft}
      onChange={setDraft}
      onBlur={commit}
      placeholder={FORMAT}
      disabled={disabled}
      fullWidth={fullWidth}
      type="text"
      testID={testID}
      style={style}
      sx={sx}
    />
  );
}

DatePicker.displayName = 'DatePicker';
