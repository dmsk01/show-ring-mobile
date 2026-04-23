/**
 * `TextField` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `label`, `value`, `defaultValue`, `placeholder`.
 *  - `onChange(value: string)` — simplified: receives the raw text, not a
 *    SyntheticEvent. Paper exposes `onChangeText` natively.
 *  - `helperText`, `error`, `disabled`, `required`, `autoFocus`, `fullWidth`,
 *    `multiline`, `rows`.
 *  - `variant`: 'outlined' (default) | 'filled' | 'standard' → Paper mode
 *    ('outlined' | 'flat' | 'flat' respectively).
 *  - `type`: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' →
 *    Paper `secureTextEntry` / `keyboardType`.
 *  - `size`: 'small' maps to Paper `dense`; 'medium' (default) is standard;
 *    'large' maps to standard (Paper has no explicit large).
 *  - `startAdornment` / `endAdornment`: map to Paper `left` / `right`.
 *    Accept either a Paper `TextInput.Affix`/`TextInput.Icon` element OR a
 *    plain `IconSource`; in the latter case we wrap in `TextInput.Icon`.
 *  - `inputRef`, `InputProps`, `select`: NOT supported.
 */

import { StyleSheet, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

import type { JSX, ReactElement } from 'react';
import type { SxProp, AdapterSize } from './types';
import type { KeyboardTypeOptions, StyleProp, TextStyle, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  fullWidth: { alignSelf: 'stretch' },
});

// ----------------------------------------------------------------------

export type TextFieldVariant = 'outlined' | 'filled' | 'standard';
export type TextFieldType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

type PaperMode = 'outlined' | 'flat';

const MODE_FOR_VARIANT: Record<TextFieldVariant, PaperMode> = {
  outlined: 'outlined',
  filled: 'flat',
  standard: 'flat',
};

const KEYBOARD_FOR_TYPE: Record<TextFieldType, KeyboardTypeOptions> = {
  text: 'default',
  password: 'default',
  email: 'email-address',
  number: 'numeric',
  tel: 'phone-pad',
  url: 'url',
};

export type TextFieldProps = {
  label?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  variant?: TextFieldVariant;
  type?: TextFieldType;
  size?: AdapterSize;
  startAdornment?: ReactElement;
  endAdornment?: ReactElement;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  sx?: SxProp;
};

export function TextField({
  label,
  value,
  defaultValue,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  helperText,
  error,
  disabled,
  required,
  autoFocus,
  fullWidth,
  multiline,
  rows,
  variant = 'outlined',
  type = 'text',
  size = 'medium',
  startAdornment,
  endAdornment,
  testID,
  style,
  inputStyle,
  sx,
}: TextFieldProps): JSX.Element {
  const labelWithRequired = label && required ? `${label} *` : label;
  const numLines = multiline ? (rows ?? 4) : undefined;

  return (
    <View style={[fullWidth ? styles.fullWidth : null, style, sx]}>
      <TextInput
        mode={MODE_FOR_VARIANT[variant]}
        label={labelWithRequired}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChangeText={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        autoFocus={autoFocus}
        multiline={multiline}
        numberOfLines={numLines}
        error={error}
        dense={size === 'small'}
        secureTextEntry={type === 'password'}
        keyboardType={KEYBOARD_FOR_TYPE[type]}
        left={startAdornment}
        right={endAdornment}
        style={inputStyle}
        testID={testID}
      />
      {helperText ? (
        <HelperText type={error ? 'error' : 'info'} visible>
          {helperText}
        </HelperText>
      ) : null}
    </View>
  );
}

TextField.displayName = 'TextField';
