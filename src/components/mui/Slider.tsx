/**
 * `Slider` — MUI-compatible drop-in (tap-to-set, no drag).
 *
 * MUI parity:
 *  - `value`, `onChange(value)`, `min` (default 0), `max` (default 100),
 *    `step` (default 1), `color`, `disabled`.
 *
 * Stage 1 limitations:
 *  - TODO(stage-2): drag gesture. Current implementation snaps to the tapped
 *    position only — usable for MVP screens but not production-polished.
 *    Adding drag needs `react-native-gesture-handler` Pan + Reanimated (both
 *    already in deps), but doing it right (accessibility, continuous onChange,
 *    long-press + drag, marks) belongs in Stage 2 when the Slider-using
 *    section lands.
 *  - `marks`, `valueLabelDisplay`, `track='inverted'`, `orientation='vertical'`:
 *    NOT supported.
 */

import { useState } from 'react';
import { useTheme } from 'src/theme';
import { Pressable, StyleSheet, View } from 'react-native';

import type { JSX } from 'react';
import type { SxProp, AdapterColor } from './types';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type SliderProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  color?: Exclude<AdapterColor, 'inherit'>;
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

const THUMB_SIZE = 20;
const TRACK_HEIGHT = 4;

const styles = StyleSheet.create({
  root: { justifyContent: 'center', height: THUMB_SIZE },
  disabled: { opacity: 0.5 },
  track: { height: TRACK_HEIGHT, borderRadius: TRACK_HEIGHT / 2 },
  fill: {
    position: 'absolute',
    left: 0,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
});

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  color = 'primary',
  disabled,
  testID,
  style,
  sx,
}: SliderProps): JSX.Element {
  const { theme } = useTheme();
  const [width, setWidth] = useState(0);

  const handleLayout = (e: LayoutChangeEvent): void => {
    setWidth(e.nativeEvent.layout.width);
  };

  const handlePress = (locationX: number): void => {
    if (disabled || width === 0) return;
    const ratio = clamp(locationX / width, 0, 1);
    const raw = min + ratio * (max - min);
    const snapped = step > 0 ? Math.round(raw / step) * step : raw;
    onChange(clamp(snapped, min, max));
  };

  const ratio = max > min ? clamp((value - min) / (max - min), 0, 1) : 0;
  const fillWidth = width * ratio;
  const tint = theme.palette[color].main;

  return (
    <Pressable
      onPress={(e) => handlePress(e.nativeEvent.locationX)}
      onLayout={handleLayout}
      disabled={disabled}
      testID={testID}
      style={[styles.root, disabled ? styles.disabled : null, style, sx]}
    >
      <View style={[styles.track, { backgroundColor: theme.palette.grey['300'] }]} />
      <View style={[styles.fill, { width: fillWidth, backgroundColor: tint }]} />
      <View style={[styles.thumb, { left: fillWidth - THUMB_SIZE / 2, backgroundColor: tint }]} />
    </Pressable>
  );
}

Slider.displayName = 'Slider';
