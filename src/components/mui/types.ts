/**
 * Common types shared across the MUI-compatible adapter set.
 *
 * IMPORTANT: these mirror `@mui/material` prop names so section code ports
 * mechanically, but the values map to RN primitives under the hood. See
 * CLAUDE.md "Architecture contract → Adapter layer" for the support matrix.
 */

import type { ComponentProps } from 'react';
import type { PaletteColorKey } from 'src/theme';
import type { IconButton as PaperIconButton } from 'react-native-paper';
import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

/** Subset of MUI `color` prop values supported by the adapter. */
export type AdapterColor = PaletteColorKey | 'inherit';

/** MUI-style `size` prop values shared by buttons / icon buttons / etc. */
export type AdapterSize = 'small' | 'medium' | 'large';

/**
 * Flat `sx` prop — supports a single RN style object (or array of them).
 * Defaults to `ViewStyle`; pass `TextStyle` for text adapters.
 * Media queries and pseudo-selectors are NOT supported.
 */
export type SxProp<S extends ViewStyle | TextStyle | ImageStyle = ViewStyle> = StyleProp<S>;

/**
 * Paper's `IconSource` — icon name (string), component, or render function.
 * Shared by Button, IconButton, Chip, TextField, Avatar etc.
 * MUI accepts a `ReactNode` instead; documented deviation keeps icons consistent
 * with the `@expo/vector-icons` / Paper ecosystem.
 */
export type IconSource = NonNullable<ComponentProps<typeof PaperIconButton>['icon']>;
