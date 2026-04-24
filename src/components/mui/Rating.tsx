/**
 * `Rating` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `value`: number | null (0..max, fractional when precision = 0.5).
 *  - `max`: default 5.
 *  - `precision`: 0.5 | 1 (default 1). 0.1 is not supported on mobile.
 *  - `readOnly`: display-only; taps ignored.
 *  - `disabled`: display-only + reduced opacity; taps ignored.
 *  - `size`: 'small' | 'medium' | 'large' → 20 / 24 / 28 px glyph.
 *  - `color`: palette key — tints filled glyphs (default `warning`, MUI's amber).
 *  - `onChange(value)`: tap on the same slot clears the rating (MUI behavior).
 *
 * Intentionally NOT supported:
 *  - `onChangeActive` / `hover` — no hover on mobile.
 *  - Custom `icon` / `emptyIcon` — fixed MaterialIcons star / star_border / star_half.
 *  - `highlightSelectedOnly` — rare; add when a consumer needs it.
 */

import { useTheme } from 'src/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import type { JSX } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SxProp, AdapterColor, AdapterSize } from './types';

// ----------------------------------------------------------------------

const GLYPH_PX: Record<AdapterSize, number> = {
  small: 20,
  medium: 24,
  large: 28,
};

type RatingPrecision = 0.5 | 1;

export type RatingProps = {
  value: number | null;
  onChange?: (value: number | null) => void;
  max?: number;
  precision?: RatingPrecision;
  readOnly?: boolean;
  disabled?: boolean;
  size?: AdapterSize;
  color?: Exclude<AdapterColor, 'inherit'>;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  slot: { position: 'relative' },
  halfZone: { position: 'absolute', top: 0, bottom: 0 },
  leftHalf: { left: 0 },
  rightHalf: { right: 0 },
  disabled: { opacity: 0.5 },
});

// ----------------------------------------------------------------------

export function Rating({
  value,
  onChange,
  max = 5,
  precision = 1,
  readOnly,
  disabled,
  size = 'medium',
  color = 'warning',
  testID,
  style,
  sx,
}: RatingProps): JSX.Element {
  const { theme } = useTheme();
  const glyph = GLYPH_PX[size];
  const filledTint = theme.palette[color].main;
  const emptyTint = theme.palette.action.disabled;
  const interactive = !readOnly && !disabled;

  const commit = (next: number): void => {
    if (!interactive) return;
    // MUI clears when the new value equals the current — lets the user reset.
    onChange?.(value === next ? null : next);
  };

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityValue={{ min: 0, max, now: value ?? 0 }}
      testID={testID}
      style={[styles.row, disabled ? styles.disabled : null, style, sx]}
    >
      {Array.from({ length: max }).map((_, i) => {
        const current = value ?? 0;
        // Decide the visual state of slot `i` (0-indexed): filled / half / empty.
        const fullThreshold = i + 1;
        const halfThreshold = i + 0.5;
        let state: 'full' | 'half' | 'empty';
        if (current >= fullThreshold) state = 'full';
        else if (precision === 0.5 && current >= halfThreshold) state = 'half';
        else state = 'empty';

        const iconName = state === 'full' ? 'star' : state === 'half' ? 'star-half' : 'star-border';
        const iconColor = state === 'empty' ? emptyTint : filledTint;

        return (
          <View
            key={i}
            style={[styles.slot, { width: glyph, height: glyph }]}
            pointerEvents={interactive ? 'auto' : 'none'}
          >
            <MaterialIcons name={iconName} size={glyph} color={iconColor} />
            {interactive && precision === 0.5 ? (
              <>
                <Pressable
                  onPress={() => commit(i + 0.5)}
                  style={[styles.halfZone, styles.leftHalf, { width: glyph / 2 }]}
                />
                <Pressable
                  onPress={() => commit(i + 1)}
                  style={[styles.halfZone, styles.rightHalf, { width: glyph / 2 }]}
                />
              </>
            ) : null}
            {interactive && precision === 1 ? (
              <Pressable
                onPress={() => commit(i + 1)}
                style={[styles.halfZone, styles.leftHalf, { width: glyph }]}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

Rating.displayName = 'Rating';
